"use client";

import { useEffect, useState } from "react"
import { RequestIpPhone, DashboardData } from "../types/entities"



// Branches Hook
export function useBranches() {
  const [branches, setBranches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBranches = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/v1/branch/list`)
      if (!response.ok) throw new Error("Failed to fetch branches")
      const data = await response.json()
      setBranches(data.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }


  useEffect(() => {
    fetchBranches()
  }, [])
  return { branches, loading, error, refreshBranches: fetchBranches }
}

// Departments Hook
export function useDepartments() {
  const [departments, setDepartments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDepartments = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/v1/department/list`)
      if (!response.ok) throw new Error("Failed to fetch departments")
      const data = await response.json()
      setDepartments(data.data || [])

    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDepartments()
  }, [])

  return { departments, loading, error, refreshDepartments: fetchDepartments }
}

// Programs Hook
export function usePrograms() {
  const [programs, setPrograms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPrograms = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/v1/program/list`)
      if (!response.ok) throw new Error("Failed to fetch programs")
      const data = await response.json()
      setPrograms(data.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPrograms()
  }, [])

  return { programs, loading, error, refreshPrograms: fetchPrograms }
}

// IP Phones Hook
export function useIPPhones() {
  const [ipPhones, setIPPhones] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchIPPhones = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/v1/ipphone/list`)
      if (!response.ok) throw new Error("Failed to fetch IP phones")
      const data = await response.json()
      setIPPhones(data.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchIPPhones()
  }, [])

  return { ipPhones, loading, error, refreshIPPhones: fetchIPPhones }
}

// Tasks Hook (updated for new structure)
export function useTasksNew() {
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTasks = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/v1/problem/list`)
      if (!response.ok) throw new Error("Failed to fetch tasks")
      const data = await response.json()
      setTasks(data.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }

  }

  useEffect(() => {
    fetchTasks()
  }, [])

  return { tasks, loading, error, refreshTasks: fetchTasks }
}

export function useDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDashboard = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/v1/dashboard/data`)
      if (!response.ok) throw new Error("Failed to fetch dashboard data")
      const dashboardData = await response.json()
      setData(dashboardData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboard()
  }, [])

  return { data, loading, error, refreshDashboard: fetchDashboard }
}

// API Functions
export async function addBranch(branch: { name: string }) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/v1/branch/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(branch),
  })
  return await response.json()
}

export async function updateBranch(id: number, branch: { name: string }) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/v1/branch/update/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(branch),
  })
  return await response.json()
}

export async function deleteBranch(id: number) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/v1/branch/delete/${id}`, {
    method: "DELETE",
  })
  return response.ok
}

export async function addDepartment(department: { name: string, branch_id: number }) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/v1/department/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(department),
  })
  return await response.json()
}

export async function updateDepartment(id: number, department: { name: string; branch_id: number }) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/v1/department/update/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(department),
  })
  return await response.json()
}

export async function deleteDepartment(id: number) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/v1/department/delete/${id}`, {
    method: "DELETE",
  })
  return response.ok
}

export async function addProgram(program: { name: string }) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/v1/program/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(program),
  })
  return await response.json()
}

export async function updateProgram(id: number, program: { name: string }) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/v1/program/update/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(program),
  })
  return await response.json()
}

export async function deleteProgram(id: number) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/v1/program/delete/${id}`, {
    method: "DELETE",
  })
  return response.ok
}

export async function addIPPhone(req: RequestIpPhone) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/v1/ipphone/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req),
    })
    return await response.json()
  } catch (error) {
    console.log(error);
  }

}

export async function updateIPPhone(id: number, ipPhone: { number: number; name: string; branch_id: number; department_id: number }) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/v1/ipphone/update/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(ipPhone),
  })
  return await response.json()
}

export async function deleteIPPhone(id: number) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/v1/ipphone/delete/${id}`, {
    method: "DELETE",
  })
  return response.ok
}

export async function addTaskNew(task: { phone_id: number | null; system_id: number; text: string; status: number; telegram?: boolean }) {
  try {
    // สร้าง payload โดยเปลี่ยนเฉพาะ phone_id เป็น null ถ้าไม่ถูกต้อง
    const payload = {
      phone_id: task.phone_id && task.phone_id > 0 ? task.phone_id : null,
      system_id: task.system_id,
      text: task.text,
      status: task.status,
      telegram: task.telegram
    };
    
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/v1/problem/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Create failed:', response.status, errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
}

export async function updateTaskNew(id: number, task: { phone_id: number | null; system_id: number; text: string; status: number; telegram?: boolean }) {
  try {
    // สร้าง payload โดยเปลี่ยนเฉพาะ phone_id เป็น null ถ้าไม่ถูกต้อง
    const payload = {
      phone_id: task.phone_id && task.phone_id > 0 ? task.phone_id : null,
      system_id: task.system_id,
      text: task.text,
      status: task.status,
      telegram: task.telegram
    };
    
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/v1/problem/update/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Update failed:', response.status, errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
}

export async function deleteTaskNew(id: number) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/v1/problem/delete/${id}`, {
    method: "DELETE",
  })
  return response.ok
}



