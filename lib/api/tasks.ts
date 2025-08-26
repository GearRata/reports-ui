"use client";

import { useEffect, useState } from "react";
// TaskWithPhone type is used in pagination state
import {
  TasksPaginationParams,
  TasksPaginationResponse,
  TasksPaginationState,
} from "@/types/pagination";

// Tasks Hook with Pagination Support
export function useTasksNewPaginated(params?: TasksPaginationParams) {
  const [state, setState] = useState<TasksPaginationState>({
    tasks: [],
    currentPage: params?.page || 1,
    pageSize: params?.limit || 10,
    totalItems: 0,
    totalPages: 0,
    loading: true,
    error: null,
  });

  const fetchTasks = async (page: number = 1, limit: number = 10) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const url = new URL(
        `${process.env.NEXT_PUBLIC_API_BASE}/api/v1/problem/list`
      );
      url.searchParams.set("page", page.toString());
      url.searchParams.set("limit", limit.toString());

      const response = await fetch(url.toString());
      if (!response.ok) throw new Error("Failed to fetch tasks");

      const data: TasksPaginationResponse = await response.json();

      setState((prev) => ({
        ...prev,
        tasks: data.data || [],
        currentPage: data.pagination?.page || page,
        pageSize: data.pagination?.limit || limit,
        totalItems: data.pagination?.total || 0,
        totalPages: data.pagination?.total_pages || 0,
        loading: false,
        error: null,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : "Unknown error",
      }));
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= state.totalPages) {
      fetchTasks(page, state.pageSize);
    }
  };

  const changePageSize = (limit: number) => {
    fetchTasks(1, limit); // Reset to first page when changing page size
  };

  const refreshTasks = () => {
    fetchTasks(state.currentPage, state.pageSize);
  };

  useEffect(() => {
    fetchTasks(state.currentPage, state.pageSize); // Initial fetch with default values
  }, []); // Only run on mount

  return {
    ...state,
    fetchTasks,
    goToPage,
    changePageSize,
    refreshTasks,
  };
}

// API Functions
export async function addTaskNew(task: {
  reported_by: string;
  phone_id: number | null;
  type_id: number;
  system_id: number;
  issue_else: string;
  text: string;
  status: number;
  assign_to?: string | null;
  telegram?: boolean;
  file_paths?: string[];
  images?: File[];
}) {
  try {
    // สร้าง payload แบบ JSON (ขนาดเล็กกว่า FormData)
    const formData = new FormData();

    // เพิ่มข้อมูล task
    formData.append("reported_by", task.reported_by);
    formData.append("phone_id", task.phone_id ? task.phone_id.toString() : "");
    formData.append("type_id", task.type_id.toString());
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

export async function updateTaskNew(
  id: number,
  task: {
    phone_id: number | null;
    system_id: number;
    text: string;
    issue_else?: string;
    status: number;
    assign_to?: string | null;
    telegram?: boolean;
    file_paths?: string[];
  }
) {
  try {
    // สร้าง payload โดยเปลี่ยนเฉพาะ phone_id เป็น null ถ้าไม่ถูกต้อง
    const payload = {
      phone_id: task.phone_id && task.phone_id > 0 ? task.phone_id : null,
      system_id: task.system_id,
      text: task.text,
      issue_else: task.issue_else || "",
      status: task.status,
      assign_to: task.assign_to,
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

export async function deleteTaskNew(id: number) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE}/api/v1/problem/delete/${id}`,
    {
      method: "DELETE",
    }
  );
  return response.ok;
}

export async function getTaskNewById(id: number) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE}/api/v1/problem/${id}`
  );
  if (!response.ok) throw new Error("Failed to fetch task");
  const data = await response.json();
  return data.data;
}


export async function updateTaskAssignTo(id: number, task:{assign_to: string | null}) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/api/v1/problem/update/assignto/${id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      }
    );
    return await response.json();
  } catch (error) {
    console.error("Error updating task assign_to:", error);
    throw error;
  }
}


