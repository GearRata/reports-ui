"use client";

import { useEffect, useState } from "react";
import type { AssignData, AssignDataId, CreateAssignData, UpdateAssignData, DeleteAssignData } from "@/types/assignto/model";


// Assign Hook
export function useAssign() {
  const [assignTo, setAssigningTo] = useState<AssignData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAssigningTo = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/api/v1/respons/list`
      );
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

export async function addAssignTo(assign: CreateAssignData) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/api/v1/respons/create`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(assign),
      }
    );
    if (!response.ok) throw new Error("Failed to add Supervisor");
    return await response.json();
  } catch (error) {
    console.error("Error adding Supervisor:", error);
    throw error;
  }
}

export async function updateAssignTo(
  id: number,
  assign: UpdateAssignData
) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/api/v1/respons/update/${id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(assign),
      }
    );
    if (!response.ok) throw new Error("Failed to update Supervisor");
    return await response.json();
  } catch (error) {
    console.error("Error update Supervisor:", error);
    throw error;
  }
}

export async function deleteAssignTo(id: DeleteAssignData) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/api/v1/respons/delete/${id}`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) throw new Error("Failed to delete Supervisor");
    return response.ok;
  } catch (error) {
    console.error("Error delete Supervisor:", error);
    throw error;
  }
}

export async function getAssignToId(id: AssignDataId) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/api/v1/respons/${id}`
    );
    if (!response.ok) throw new Error("Faild to fetct AssignTo ID");
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error to fetch Supervisor ID:", error);
    throw error;
  }
}
