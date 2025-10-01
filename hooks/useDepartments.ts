"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  DepartmentDataId,
  AddDepartment,
  UpdateDepartment,
  DeleteDepartment,
} from "@/types/department/model";
import type {
  DepartmentsPaginationParams,
  DepartmentsPaginationResponse,
  DepartmentsPaginationState,
} from "@/types/pagination/model";

// Departments Hook with Pagination Support
export function useDepartmentsPaginated(
  params?: DepartmentsPaginationParams & { search?: string }
) {
  const [state, setState] = useState<DepartmentsPaginationState>({
    departments: [],
    currentPage: params?.page || 1,
    pageSize: params?.limit || 10,
    totalItems: 0,
    totalPages: 0,
    loading: true,
    error: null,
  });

  const [searchTerm, setSearchTerm] = useState(params?.search || "");
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchDepartments = useCallback(
    async (
      page: number,
      limit: number,
      search: string = ""
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
        const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE}/api/v1/department/list`;
        let url;

        if (search?.trim()) {
          url = `${baseUrl}/${encodeURIComponent(
            search.trim()
          )}?page=${page}&limit=${limit}`;
        } else {
          url = `${baseUrl}?page=${page}&limit=${limit}`;
        }

        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) throw new Error("Failed to fetch departments");

        const data: DepartmentsPaginationResponse = await response.json();

        setState({
          departments: data.data || [],
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
      fetchDepartments(page, state.pageSize, searchTerm);
    },
    [fetchDepartments, state.pageSize, searchTerm]
  );

  const changePageSize = useCallback(
    (limit: number) => {
      fetchDepartments(1, limit, searchTerm);
    },
    [fetchDepartments, searchTerm]
  );

  const changeSearch = useCallback(
    (search: string) => {
      setSearchTerm(search);
      fetchDepartments(1, state.pageSize, search);
    },
    [fetchDepartments, state.pageSize]
  );

  const refreshDepartments = useCallback(() => {
    fetchDepartments(state.currentPage, state.pageSize, searchTerm);
  }, [fetchDepartments, state.currentPage, state.pageSize, searchTerm]);

  useEffect(() => {
    fetchDepartments(
      params?.page || 1,
      params?.limit || 10,
      params?.search || ""
    );
  }, [fetchDepartments, params?.limit, params?.page, params?.search]);

  return {
    ...state,
    goToPage,
    changePageSize,
    changeSearch,
    refreshDepartments,
    search: searchTerm,
  };
}

// Departments Hook for Dropdown
export function useDepartmentsForDropdown() {
  const { departments, loading, error } = useDepartmentsPaginated({
    page: 1,
    limit: 500,
  });
  return { departments, loading, error };
}

// API Functions
export async function addDepartment(department: AddDepartment) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/api/v1/department/create`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(department),
      }
    );
    if (!response.ok) throw new Error("Failed to add department");
    return await response.json();
  } catch (error) {
    console.log("Error to add department", error);
    throw error;
  }
}

export async function updateDepartment(
  id: number,
  department: UpdateDepartment
) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/api/v1/department/update/${id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(department),
      }
    );
    if (!response.ok) throw new Error("Failed to update department");
    return await response.json();
  } catch (error) {
    console.log("Error to update department", error);
    throw error;
  }
}

export async function deleteDepartment(id: DeleteDepartment) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/api/v1/department/delete/${id}`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) throw new Error("Failed to delete department");
    return response.ok;
  } catch (error) {
    console.log("Error to delete department", error);
    throw error;
  }
}

// Get single department by ID
export async function getDepartmentById(id: DepartmentDataId) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/api/v1/department/${id}`
    );
    if (!response.ok) throw new Error("Failed to fetch department");
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.log("Error to fetch department ID", error);
    throw error;
  }
}
