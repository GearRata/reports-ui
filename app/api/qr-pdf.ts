"use client";

import { useEffect, useState } from "react";
import { DepartmentData } from "@/types/qr-code/model";

const BASE = process.env.NEXT_PUBLIC_API_BASE ?? "";

export function buildQrUrl(
  branch: number | string,
  department: number | string
) {
  return `${BASE}/public/v1/${encodeURIComponent(String(branch))}/${encodeURIComponent(String(department))}`;
}

export function useDepartment() {
  const [allDepartment, setAllDepartment] = useState<DepartmentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/api/v1/department/listall`
      );
      if (!response.ok) throw new Error("Failed to fetch department all");
      const result = await response.json();
      setAllDepartment(result.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  return { allDepartment, loading, error, refreshDepartments: fetchDepartments };
}

