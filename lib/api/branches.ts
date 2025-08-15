"use client";

import { useEffect, useState } from "react";
import type { Branch } from "@/types/entities";

// Branches Hook
export function useBranches() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBranches = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/v1/branch/list`);
      if (!response.ok) throw new Error("Failed to fetch branches");
      const data = await response.json();
      setBranches(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  return { branches, loading, error, refreshBranches: fetchBranches };
}

// Branches Hook for Dropdown
export function useBranchesForDropdown() {
  const { branches, loading, error } = useBranches();
  return { branches, loading, error };
}

// API Functions
export async function addBranch(branch: { name: string }) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/v1/branch/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(branch),
  });
  return await response.json();
}

export async function updateBranch(id: number, branch: { name: string }) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/v1/branch/update/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(branch),
  });
  return await response.json();
}

export async function deleteBranch(id: number) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/v1/branch/delete/${id}`, {
    method: "DELETE",
  });
  return response.ok;
}

// Get single branch by ID
export async function getBranchById(id: number) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/v1/branch/${id}`);
  if (!response.ok) throw new Error("Failed to fetch branch");
  const data = await response.json();
  return data.data;
}