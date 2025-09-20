"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import type {
  AddTask,
  TaskDataId,
  UpdateTask,
  DeleteTask,
  updateTaskAssignTo,
} from "@/types/task/model";
// TaskWithPhone type is used in pagination state
import type {
  TasksPaginationParams,
  TasksPaginationResponse,
  TasksPaginationState,
} from "@/types/pagination/model";

// Tasks Hook with Pagination Support
export function useTasksNewPaginated(
  params?: TasksPaginationParams & { search?: string; status?: string }
) {
  const [state, setState] = useState<TasksPaginationState>({
    tasks: [],
    currentPage: params?.page || 1,
    pageSize: params?.limit || 10,
    totalItems: 0,
    totalPages: 0,
    loading: true,
    error: null,
  });

  const [searchTerm, setSearchTerm] = useState(params?.search || "");
  const [statusTerm, setStatusTerm] = useState(params?.status || "all");
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchTasks = useCallback(
    async (
      page: number,
      limit: number,
      search: string,
      status: string = "all"
    ) => {
      // ยกเลิก request เก่า
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // สร้าง AbortController ใหม่
      const controller = new AbortController();
      abortControllerRef.current = controller;

      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        let url;

        // เลือก base URL ตามการมี search term
        const hasSearch = search?.trim();
        const baseUrl = hasSearch 
          ? `${process.env.NEXT_PUBLIC_API_BASE}/api/v1/problem/list`
          : `${process.env.NEXT_PUBLIC_API_BASE}/api/v1/problem/list/sort/status/0`;

        // Add status filter if not "all"
        if (status && status !== "all") {
          const statusValue =
            status === "pending" ? "0" : status === "progress" ? "1" : status === "done" ? "2" : "";
          if (statusValue) {
            url = `${process.env.NEXT_PUBLIC_API_BASE}/api/v1/problem/list/status/${statusValue}?page=${page}&limit=${limit}`;
          } else {
            url = hasSearch
              ? `${baseUrl}/${encodeURIComponent(
                  search.trim()
                )}?page=${page}&limit=${limit}`
              : `${baseUrl}?page=${page}&limit=${limit}`;
          }
        } else {
          url = hasSearch
            ? `${baseUrl}/${encodeURIComponent(
                search.trim()
              )}?page=${page}&limit=${limit}`
            : `${baseUrl}?page=${page}&limit=${limit}`;
        }

        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) throw new Error("Failed to fetch tasks");

        const data: TasksPaginationResponse = await response.json();

        setState({
          tasks: data.data || [],
          currentPage: data.pagination?.page || page,
          pageSize: data.pagination?.limit || limit,
          totalItems: data.pagination?.total || 0,
          totalPages: data.pagination?.total_pages || 0,
          loading: false,
          error: null,
        });
      } catch (err) {
        // ไม่ update state ถ้า request ถูกยกเลิก
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }
        setState((prev) => ({
          ...prev,
          loading: false,
          error: err instanceof Error ? err.message : "Unknown error",
        }));
      }
    },
    []
  );

  const goToPage = useCallback(
    (page: number) => {
      fetchTasks(page, state.pageSize, searchTerm, statusTerm);
    },
    [fetchTasks, state.pageSize, searchTerm, statusTerm]
  );

  const changePageSize = useCallback(
    (limit: number) => {
      fetchTasks(1, limit, searchTerm, statusTerm);
    },
    [fetchTasks, searchTerm, statusTerm]
  );

  const changeSearch = useCallback(
    (search: string) => {
      setSearchTerm(search);
      fetchTasks(1, state.pageSize, search, statusTerm);
    },
    [fetchTasks, state.pageSize, statusTerm]
  );

  const changeStatus = useCallback(
    (status: string) => {
      setStatusTerm(status);
      fetchTasks(1, state.pageSize, searchTerm, status);
    },
    [fetchTasks, state.pageSize, searchTerm]
  );

  const refreshTasks = useCallback(() => {
    fetchTasks(state.currentPage, state.pageSize, searchTerm, statusTerm);
  }, [fetchTasks, state.currentPage, state.pageSize, searchTerm, statusTerm]);

  useEffect(() => {
    fetchTasks(
      params?.page || 1,
      params?.limit || 10,
      params?.search || "",
      params?.status || "all"
    );
  }, [fetchTasks, params?.limit, params?.page, params?.search, params?.status]);

  return {
    ...state,
    goToPage,
    changePageSize,
    changeSearch,
    changeStatus,
    refreshTasks,
    search: searchTerm,
    status: statusTerm,
  };
}

export async function getTaskNewById(id: TaskDataId) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/api/v1/problem/${id}`
    );
    if (!response.ok) throw new Error("Failed to fetch task");
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetch task ID:", error);
    throw error;
  }
}

// API Functions
export async function addTaskNew(task: AddTask) {
  try {
    // สร้าง payload แบบ JSON (ขนาดเล็กกว่า FormData)
    const formData = new FormData();

    // เพิ่มข้อมูล task
    formData.append("reported_by", task.reported_by);
    formData.append("phone_id", task.phone_id ? task.phone_id.toString() : "");
    formData.append("issue_type", task.issue_type.toString());
    formData.append("system_id", task.system_id.toString());
    formData.append("issue_else", task.issue_else);
    formData.append("text", task.text);
    formData.append("status", task.status.toString());
    formData.append("telegram", task.telegram ? "true" : "false");

    // เพิ่มรูปภาพ (ถ้ามี)
    if (task.images && task.images.length > 0) {
      task.images.forEach((image, index) => {
        formData.append(`image_${index}`, image);
      });
    }

    // เพิ่ม base64 images (ถ้ามี)
    if (task.file_paths && task.file_paths.length > 0) {
      task.file_paths.forEach((base64, index) => {
        // แปลง base64 เป็น Blob
        const byteCharacters = atob(base64.split(",")[1]);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "image/jpeg" });
        formData.append("images", blob, `image_${index}.jpg`);
      });
    }

    console.log("API FormData being sent");

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/api/v1/problem/create`,
      {
        method: "POST",
        body: formData, // ไม่ต้องใส่ Content-Type header เพราะ browser จะใส่ให้อัตโนมัติ
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Create failed:", response.status, errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    const result = await response.json();
    console.log("Create API Response:", result);
    return result;
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
}

export async function updateTaskNew(id: number, task: UpdateTask) {
  try {
    // สร้าง payload โดยเปลี่ยนเฉพาะ phone_id เป็น null ถ้าไม่ถูกต้อง
    const payload = {
      reported_by: task.reported_by,
      issue_type: task.issue_type,
      phone_id: task.phone_id && task.phone_id > 0 ? task.phone_id : null,
      system_id: task.system_id,
      text: task.text,
      issue_else: task.issue_else || "",
      status: task.status,
      assign_to: task.assign_to,
      assignedto_id: task.assignedto_id,
      telegram: task.telegram,
      file_paths: task.file_paths || [],
    };

    console.log("Update API Payload being sent:", payload);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/api/v1/problem/update/${id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Update failed:", response.status, errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    console.log("Update API Response:", result);
    return result;
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
}

export async function deleteTaskNew(id: DeleteTask) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/api/v1/problem/delete/${id}`,
      {
        method: "DELETE",
      }
    );
    return response.ok;
  } catch (error) {
    console.log("Error delete task", error);
    throw error;
  }
}

export async function updateTaskAssignTo(id: number, task: updateTaskAssignTo) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/api/v1/problem/update/assignto/${id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to update assigned person: ${response.status} ${errorText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating task assign_to:", error);
    throw error;
  }
}
