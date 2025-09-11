"use client";

import { useEffect, useState, useCallback, useRef } from "react";
// import type { RequestIpPhone } from "@/types/entities";
import type {
  AddIpPhone,
  IpPhoneDataId,
  UpdateIpPhone,
  DeleteIpPhone,
} from "@/types/phone/model";
import {
  IPPhonesPaginationParams,
  IPPhonesPaginationResponse,
  IPPhonesPaginationState,
} from "@/types/pagination/model";

// IP Phones Hook with Pagination Support
export function useIPPhonesPaginated(
  params?: IPPhonesPaginationParams & { search?: string }
) {
  const [state, setState] = useState<IPPhonesPaginationState>({
    ipPhones: [],
    currentPage: params?.page || 1,
    pageSize: params?.limit || 10,
    totalItems: 0,
    totalPages: 0,
    loading: true,
    error: null,
  });

  const [searchTerm, setSearchTerm] = useState(params?.search || "");
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchIPPhones = useCallback(
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
        const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE}/api/v1/ipphone/list`;
        let url;

        if (search?.trim()) {
          url = `${baseUrl}/${encodeURIComponent(
            search.trim()
          )}?page=${page}&limit=${limit}`;
        } else {
          url = `${baseUrl}?page=${page}&limit=${limit}`;
        }

        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) throw new Error("Failed to fetch IP phones");

        const data: IPPhonesPaginationResponse = await response.json();

        setState({
          ipPhones: data.data || [],
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
      fetchIPPhones(page, state.pageSize, searchTerm);
    },
    [fetchIPPhones, state.pageSize, searchTerm]
  );

  const changePageSize = useCallback(
    (limit: number) => {
      fetchIPPhones(1, limit, searchTerm);
    },
    [fetchIPPhones, searchTerm]
  );

  const changeSearch = useCallback(
    (search: string) => {
      setSearchTerm(search);
      fetchIPPhones(1, state.pageSize, search);
    },
    [fetchIPPhones, state.pageSize]
  );

  const refreshIPPhones = useCallback(() => {
    fetchIPPhones(state.currentPage, state.pageSize, searchTerm);
  }, [fetchIPPhones, state.currentPage, state.pageSize, searchTerm]);

  useEffect(() => {
    fetchIPPhones(
      params?.page || 1,
      params?.limit || 10,
      params?.search || ""
    );
  }, []);

  return {
    ...state,
    goToPage,
    changePageSize,
    changeSearch,
    refreshIPPhones,
    search: searchTerm,
  };
}

// IP Phones Hook for Dropdown
export function useIPPhonesForDropdown() {
  const { ipPhones, loading, error } = useIPPhonesPaginated({
    page: 1,
    limit: 500,
  });
  return { ipPhones, loading, error };
}

// Get single IP phone by ID
export async function getIPPhoneById(id: IpPhoneDataId) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/api/v1/ipphone/${id}`
    );
    if (!response.ok) throw new Error("Failed to fetch IP phone");
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.log("Error to fetch IPPhone ID", error);
    throw error;
  }
}

// API Functions
export async function addIPPhone(phone: AddIpPhone) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/api/v1/ipphone/create`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(phone),
      }
    );
    if (!response.ok) throw new Error("Failed to add IPPhone");
    return await response.json();
  } catch (error) {
    console.log("Error to adding IPPhone", error);
    throw error;
  }
}

export async function updateIPPhone(id: number, ipPhone: UpdateIpPhone) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/api/v1/ipphone/update/${id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ipPhone),
      }
    );
    if (!response.ok) throw new Error("Failed to update program");
    return await response.json();
  } catch (error) {
    console.log("Error to update IPPhone", error);
    throw error;
  }
}

export async function deleteIPPhone(id: DeleteIpPhone) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/api/v1/ipphone/delete/${id}`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) throw new Error("Failed to delete IPPhone");
    return response.ok;
  } catch (error) {
    console.log("Error to delete IPPhone", error);
    throw error;
  }
}

