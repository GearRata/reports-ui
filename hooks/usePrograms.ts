"use client";

import { useEffect, useState } from "react";
import type {
  ProgramDataId,
  CreateProgram,
  UpdateProgram,
  DeleteProgram,
} from "@/types/program/model";
// Program type is used in pagination state
import type {
  ProgramsPaginationParams,
  ProgramsPaginationResponse,
  ProgramsPaginationState,
} from "@/types/pagination/model";

// Programs Hook with Pagination Support
export function useProgramsPaginated(params?: ProgramsPaginationParams) {
  const [state, setState] = useState<ProgramsPaginationState>({
    programs: [],
    currentPage: params?.page || 1,
    pageSize: params?.limit || 10,
    totalItems: 0,
    totalPages: 0,
    loading: true,
    error: null,
  });

  const fetchPrograms = async (page: number = 1, limit: number = 10) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const url = new URL(
        `${process.env.NEXT_PUBLIC_API_BASE}/api/v1/program/list`
      );
      url.searchParams.set("page", page.toString());
      url.searchParams.set("limit", limit.toString());

      const response = await fetch(url.toString());
      if (!response.ok) throw new Error("Failed to fetch programs");

      const data: ProgramsPaginationResponse = await response.json();

      setState((prev) => ({
        ...prev,
        programs: data.data || [],
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
      fetchPrograms(page, state.pageSize);
    }
  };

  const changePageSize = (limit: number) => {
    fetchPrograms(1, limit); // Reset to first page when changing page size
  };

  const refreshPrograms = () => {
    fetchPrograms(state.currentPage, state.pageSize);
  };

  useEffect(() => {
    fetchPrograms(state.currentPage, state.pageSize); // Initial fetch with default values
  }, [state.currentPage, state.pageSize]); // Only run on mount

  return {
    ...state,
    fetchPrograms,
    goToPage,
    changePageSize,
    refreshPrograms,
  };
}

// Get single program by ID
export async function getProgramById(id: DeleteProgram) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/api/v1/program/${id}`
    );
    if (!response.ok) throw new Error("Failed to fetch program");
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.log("Error fetch program ID", error);
    throw error;
  }
}

// Programs Hook for Dropdown
export function useProgramsForDropdown() {
  const { programs, loading, error } = useProgramsPaginated({
    page: 1,
    limit: 500,
  });
  return { programs, loading, error };
}

// API Functions
export async function addProgram(program: CreateProgram) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/api/v1/program/create`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(program),
      }
    );
    if (!response.ok) throw new Error("Failed to add program");
    return await response.json();
  } catch (error) {
    console.log("Error add program", error);
    throw error;
  }
}

export async function updateProgram(id: number, program: UpdateProgram) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/api/v1/program/update/${id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(program),
      }
    );
    if (!response.ok) throw new Error("Failed to update program");
    return await response.json();
  } catch (error) {
    console.log("Error update program", error);
    throw error;
  }
}

export async function deleteProgram(id: ProgramDataId) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/api/v1/program/delete/${id}`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) throw new Error("Failed to delete program");
    return response.ok;
  } catch (error) {
    console.log("Error delete program", error);
    throw error;
  }
}
