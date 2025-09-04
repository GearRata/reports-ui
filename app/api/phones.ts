"use client";

import { useEffect, useState } from "react";
// import type { RequestIpPhone } from "@/types/entities";
import type { AddIpPhone, IpPhoneDataId, UpdateIpPhone, DeleteIpPhone } from "@/types/Phone/model"
import {
  IPPhonesPaginationParams,
  IPPhonesPaginationResponse,
  IPPhonesPaginationState,
} from "@/types/Pagination/model";

// IP Phones Hook with Pagination Support
export function useIPPhonesPaginated(params?: IPPhonesPaginationParams) {
  const [state, setState] = useState<IPPhonesPaginationState>({
    ipPhones: [],
    currentPage: params?.page || 1,
    pageSize: params?.limit || 10,
    totalItems: 0,
    totalPages: 0,
    loading: true,
    error: null,
  });

  const fetchIPPhones = async (page: number = 1, limit: number = 10) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const url = new URL(`${process.env.NEXT_PUBLIC_API_BASE}/api/v1/ipphone/list`);
      url.searchParams.set('page', page.toString());
      url.searchParams.set('limit', limit.toString());

      const response = await fetch(url.toString());
      if (!response.ok) throw new Error("Failed to fetch IP phones");

      const data: IPPhonesPaginationResponse = await response.json();

      setState(prev => ({
        ...prev,
        ipPhones: data.data || [],
        currentPage: data.pagination?.page || page,
        pageSize: data.pagination?.limit || limit,
        totalItems: data.pagination?.total || 0,
        totalPages: data.pagination?.total_pages || 0,
        loading: false,
        error: null,
      }));
    } catch (err) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : "Unknown error",
      }));
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= state.totalPages) {
      fetchIPPhones(page, state.pageSize);
    }
  };

  const changePageSize = (limit: number) => {
    fetchIPPhones(1, limit); // Reset to first page when changing page size
  };

  const refreshIPPhones = () => {
    fetchIPPhones(state.currentPage, state.pageSize);
  };

  useEffect(() => {
    fetchIPPhones(state.currentPage, state.pageSize); // Initial fetch with default values
  }, []); // Only run on mount

  return {
    ...state,
    fetchIPPhones,
    goToPage,
    changePageSize,
    refreshIPPhones,
  };
}

// IP Phones Hook for Dropdown
export function useIPPhonesForDropdown() {
  const { ipPhones, loading, error } = useIPPhonesPaginated({ page: 1, limit: 500 });
  return { ipPhones, loading, error };
}

// API Functions
export async function addIPPhone(phone: AddIpPhone) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/v1/ipphone/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(phone),
    });
    return await response.json();
  } catch (error) {
    console.log(error);
  }
}

export async function updateIPPhone(id: number, ipPhone: UpdateIpPhone) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/v1/ipphone/update/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(ipPhone),
  });
  return await response.json();
}

export async function deleteIPPhone(id: DeleteIpPhone) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/v1/ipphone/delete/${id}`, {
    method: "DELETE",
  });
  return response.ok;
}

// Get single IP phone by ID
export async function getIPPhoneById(id: IpPhoneDataId) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/v1/ipphone/${id}`);
  if (!response.ok) throw new Error("Failed to fetch IP phone");
  const data = await response.json();
  return data.data;
}