"use client";

import { useEffect, useState } from "react";
import type { AssignData } from "@/types/assignto/model";

// Assign Hook
export function useAssign() {
  const [assignTo, setAssigningTo] = useState<AssignData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAssigningTo = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/v1/respons/list`);
      if (!response.ok) throw new Error("Failed to fetch assigning to");
      const data = await response.json();
      setAssigningTo(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssigningTo();
  }, []);

  return { assignTo, loading, error, refreshAssigningTo: fetchAssigningTo };
}
