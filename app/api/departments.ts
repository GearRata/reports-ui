"use client";

import { useEffect, useState } from "react";
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
export function useDepartmentsPaginated(params?: DepartmentsPaginationParams) {
  const [state, setState] = useState<DepartmentsPaginationState>({
    departments: [],
    currentPage: params?.page || 1,
    pageSize: params?.limit || 10,
    totalItems: 0,
    totalPages: 0,
    loading: true,
    error: null,
  });

  const fetchDepartments = async (page: number = 1, limit: number = 10) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const url = new URL(
        `${process.env.NEXT_PUBLIC_API_BASE}/api/v1/department/list`
      );
      url.searchParams.set("page", page.toString());
      url.searchParams.set("limit", limit.toString());

      const response = await fetch(url.toString());
      if (!response.ok) throw new Error("Failed to fetch departments");

      const data: DepartmentsPaginationResponse = await response.json();

      setState((prev) => ({
        ...prev,
        departments: data.data || [],
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
      fetchDepartments(page, state.pageSize);
    }
  };

  const changePageSize = (limit: number) => {
    fetchDepartments(1, limit); // Reset to first page when changing page size
  };

  const refreshDepartments = () => {
    fetchDepartments(state.currentPage, state.pageSize);
  };

  useEffect(() => {
    fetchDepartments(state.currentPage, state.pageSize); // Initial fetch with default values
  }, []); // Only run on mount

  return {
    ...state,
    fetchDepartments,
    goToPage,
    changePageSize,
    refreshDepartments,
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
