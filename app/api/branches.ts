"use client";

import { useEffect, useState } from "react";
import type {
  BranchData,
  BranchDataId,
  CreateBranch,
  UpdateBranch,
  DeleteBranch,
} from "@/types/branch/model";

// Branches Hook
export function useBranches() {
  const [branches, setBranches] = useState<BranchData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBranches = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/api/v1/branch/list`
      );
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

// Get single branch by ID
export async function getBranchById(id: BranchDataId) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/api/v1/branch/${id}`
    );
    if (!response.ok) throw new Error("Failed to fetch branch");
    const data = await response.json();
    return data.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

// API Functions
export async function addBranch(branch: CreateBranch) {
  try {
      const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE}/api/v1/branch/create`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(branch),
    } 
  );
    if(!response.ok) throw new Error("Failed to create branch");
    return await response.json();
  } catch (err) {
    console.log("Error adding Branch:",err);
    throw err;
  }
}

export async function updateBranch(id: number, branch: UpdateBranch) {
  try {
    const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE}/api/v1/branch/update/${id}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(branch),
    }
  );
  if(!response.ok) throw new Error("Failed to update Branch");
  return await response.json();
  } catch (err) {
    console.log("Error updating Branch:",err);
    throw err;  
  }
}

export async function deleteBranch(id: DeleteBranch) {
  try {
    const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE}/api/v1/branch/delete/${id}`,
    {
      method: "DELETE",
    }
  );
    if(!response.ok) throw new Error("Failed to delete Branch");
    return response.ok;
  } catch (err) {
    console.log("Error deleting Branch:",err);
    throw err;
  }
}