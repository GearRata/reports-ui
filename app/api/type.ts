"use client";

import { useEffect, useState } from "react";
import type { TypeData, AddType, UpdateType, DeleteType } from "@/types/type/model";

export function useType() {
  const [types, setTypes] = useState<TypeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTypes = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/v1/program/type/list`);
      if (!response.ok) throw new Error("Failed to fetch types");
      const data = await response.json();
      setTypes(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  return { types, loading, error, refreshBranches: fetchTypes };
}

// Branches Hook for Dropdown
export function useTypesForDropdown() {
  const { types, loading, error } = useType();
  return { types, loading, error };
}

// API Functions
export async function addType(type: AddType) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/v1/program/type/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(type),
  });
  return await response.json();
}

export async function updateType(id: number, type: UpdateType) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/v1/program/type/update/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(type),
  });
  return await response.json();
}

export async function deleteType(id: DeleteType) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/v1/program/type/delete/${id}`, {
    method: "DELETE",
  });
  return response.ok;
}