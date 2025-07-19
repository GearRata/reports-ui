"use client"

import { useEffect, useState } from "react"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://192.168.0.192:5000"

// Branches Hook
export function useBranches() {
  const [branches, setBranches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBranches = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_BASE}/branches`)
      if (!response.ok) throw new Error("Failed to fetch branches")
      const data = await response.json()
      setBranches(data.branches || [])
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
      const response = await fetch(`${API_BASE}/departments`)
      if (!response.ok) throw new Error("Failed to fetch departments")
      const data = await response.json()
      setDepartments(data.departments || [])
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
      const response = await fetch(`${API_BASE}/programs`)
      if (!response.ok) throw new Error("Failed to fetch programs")
      const data = await response.json()
      setPrograms(data.programs || [])
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
      const response = await fetch(`${API_BASE}/ip-phones`)
      if (!response.ok) throw new Error("Failed to fetch IP phones")
      const data = await response.json()
      setIPPhones(data.ipPhones || [])
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
      const response = await fetch(`${API_BASE}/tasks`)
      if (!response.ok) throw new Error("Failed to fetch tasks")
      const data = await response.json()
      setTasks(data.tasks || [])
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

// API Functions
export async function addBranch(branch: { name: string }) {
  const response = await fetch(`${API_BASE}/branches`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(branch),
  })
  return await response.json()
}

export async function updateBranch(id: number, branch: { name: string }) {
  const response = await fetch(`${API_BASE}/branches/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(branch),
  })
  return await response.json()
}

export async function deleteBranch(id: number) {
  const response = await fetch(`${API_BASE}/branches/${id}`, {
    method: "DELETE",
  })
  return response.ok
}

export async function addDepartment(department: { name: string }) {
  const response = await fetch(`${API_BASE}/departments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(department),
  })
  return await response.json()
}

export async function updateDepartment(id: number, department: { name: string }) {
  const response = await fetch(`${API_BASE}/departments/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(department),
  })
  return await response.json()
}

export async function deleteDepartment(id: number) {
  const response = await fetch(`${API_BASE}/departments/${id}`, {
    method: "DELETE",
  })
  return response.ok
}

export async function addProgram(program: { name: string }) {
  const response = await fetch(`${API_BASE}/programs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(program),
  })
  return await response.json()
}

export async function updateProgram(id: number, program: { name: string }) {
  const response = await fetch(`${API_BASE}/programs/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(program),
  })
  return await response.json()
}

export async function deleteProgram(id: number) {
  const response = await fetch(`${API_BASE}/programs/${id}`, {
    method: "DELETE",
  })
  return response.ok
}

export async function addIPPhone(ipPhone: { number: string; name: string }) {
  const response = await fetch(`${API_BASE}/ip-phones`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(ipPhone),
  })
  return await response.json()
}

export async function updateIPPhone(id: number, ipPhone: { number: string; name: string }) {
  const response = await fetch(`${API_BASE}/ip-phones/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(ipPhone),
  })
  return await response.json()
}

export async function deleteIPPhone(id: number) {
  const response = await fetch(`${API_BASE}/ip-phones/${id}`, {
    method: "DELETE",
  })
  return response.ok
}

export async function addTaskNew(task: { phone_id: number; text: string; status: string }) {
  const response = await fetch(`${API_BASE}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  })
  return await response.json()
}

export async function updateTaskNew(id: number, task: { phone_id: number; text: string; status: string }) {
  const response = await fetch(`${API_BASE}/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  })
  return await response.json()
}

export async function deleteTaskNew(id: number) {
  const response = await fetch(`${API_BASE}/tasks/${id}`, {
    method: "DELETE",
  })
  return response.ok
}
