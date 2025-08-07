"use client";

import { useEffect, useState } from "react"
import { RequestIpPhone, DashboardData } from "../types/entities"
import {
  TasksPaginationParams,
  TasksPaginationResponse,
  TasksPaginationState,
  ProgramsPaginationParams,
  ProgramsPaginationResponse,
  ProgramsPaginationState,
  DepartmentsPaginationParams,
  DepartmentsPaginationResponse,
  DepartmentsPaginationState,
  IPPhonesPaginationParams,
  IPPhonesPaginationResponse,
  IPPhonesPaginationState
} from "../types/pagination"



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

// Departments Hook - DEPRECATED: Use useDepartmentsPaginated or useDepartmentsForDropdown instead
// Keeping for backward compatibility, but not recommended for new usage

// Departments Hook with Pagination Support
export function useDepartmentsPaginated(params?: DepartmentsPaginationParams) {
  const [state, setState] = useState<DepartmentsPaginationState>({
    departments: [],
    currentPage: params?.page || 1,
    pageSize: params?.limit || 10,
    totalItems: 0,
    totalPages: 0,
    loading: true,
    error: null,
  })

  const fetchDepartments = async (page: number = 1, limit: number = 10) => {
    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const url = new URL(`${process.env.NEXT_PUBLIC_API_BASE}/api/v1/department/list`)
      url.searchParams.set('page', page.toString())
      url.searchParams.set('limit', limit.toString())

      const response = await fetch(url.toString())
      if (!response.ok) throw new Error("Failed to fetch departments")

      const data: DepartmentsPaginationResponse = await response.json()

      setState(prev => ({
        ...prev,
        departments: data.data || [],
        currentPage: data.pagination?.page || page,
        pageSize: data.pagination?.limit || limit,
        totalItems: data.pagination?.total || 0,
        totalPages: data.pagination?.total_pages || 0,
        loading: false,
        error: null,
      }))
    } catch (err) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : "Unknown error",
      }))
    }
  }

  const goToPage = (page: number) => {
    if (page >= 1 && page <= state.totalPages) {
      fetchDepartments(page, state.pageSize)
    }
  }

  const changePageSize = (limit: number) => {
    fetchDepartments(1, limit) // Reset to first page when changing page size
  }

  const refreshDepartments = () => {
    fetchDepartments(state.currentPage, state.pageSize)
  }

  useEffect(() => {
    fetchDepartments(state.currentPage, state.pageSize)
  }, []) // Only run on mount

  return {
    ...state,
    fetchDepartments,
    goToPage,
    changePageSize,
    refreshDepartments,
  }
}

// Programs Hook - DEPRECATED: Use useProgramsPaginated or useProgramsForDropdown instead
// Keeping for backward compatibility, but not recommended for new usage

// Programs Hook with Pagination Support
export function useProgramsPaginated(params?: ProgramsPaginationParams) {
  const [state, setState] = useState<ProgramsPaginationState>({
    programs: [],
    currentPage: params?.page || 1,
    pageSize: params?.limit || 10,
    totalItems: 0,
    totalPages: 0,
    loading: true,
    error: null,
  })

  const fetchPrograms = async (page: number = 1, limit: number = 10) => {
    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const url = new URL(`${process.env.NEXT_PUBLIC_API_BASE}/api/v1/program/list`)
      url.searchParams.set('page', page.toString())
      url.searchParams.set('limit', limit.toString())

      const response = await fetch(url.toString())
      if (!response.ok) throw new Error("Failed to fetch programs")

      const data: ProgramsPaginationResponse = await response.json()

      setState(prev => ({
        ...prev,
        programs: data.data || [],
        currentPage: data.pagination?.page || page,
        pageSize: data.pagination?.limit || limit,
        totalItems: data.pagination?.total || 0,
        totalPages: data.pagination?.total_pages || 0,
        loading: false,
        error: null,
      }))
    } catch (err) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : "Unknown error",
      }))
    }
  }

  const goToPage = (page: number) => {
    if (page >= 1 && page <= state.totalPages) {
      fetchPrograms(page, state.pageSize)
    }
  }

  const changePageSize = (limit: number) => {
    fetchPrograms(1, limit) // Reset to first page when changing page size
  }

  const refreshPrograms = () => {
    fetchPrograms(state.currentPage, state.pageSize)
  }

  useEffect(() => {
    fetchPrograms(state.currentPage, state.pageSize)
  }, []) // Only run on mount

  return {
    ...state,
    fetchPrograms,
    goToPage,
    changePageSize,
    refreshPrograms,
  }
}

// IP Phones Hook - DEPRECATED: Use useIPPhonesPaginated or useIPPhonesForDropdown instead
// Keeping for backward compatibility, but not recommended for new usage

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
  })

  const fetchIPPhones = async (page: number = 1, limit: number = 10) => {
    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const url = new URL(`${process.env.NEXT_PUBLIC_API_BASE}/api/v1/ipphone/list`)
      url.searchParams.set('page', page.toString())
      url.searchParams.set('limit', limit.toString())

      const response = await fetch(url.toString())
      if (!response.ok) throw new Error("Failed to fetch IP phones")

      const data: IPPhonesPaginationResponse = await response.json()

      setState(prev => ({
        ...prev,
        ipPhones: data.data || [],
        currentPage: data.pagination?.page || page,
        pageSize: data.pagination?.limit || limit,
        totalItems: data.pagination?.total || 0,
        totalPages: data.pagination?.total_pages || 0,
        loading: false,
        error: null,
      }))
    } catch (err) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : "Unknown error",
      }))
    }
  }

  const goToPage = (page: number) => {
    if (page >= 1 && page <= state.totalPages) {
      fetchIPPhones(page, state.pageSize)
    }
  }

  const changePageSize = (limit: number) => {
    fetchIPPhones(1, limit) // Reset to first page when changing page size
  }

  const refreshIPPhones = () => {
    fetchIPPhones(state.currentPage, state.pageSize)
  }

  useEffect(() => {
    fetchIPPhones(state.currentPage, state.pageSize)
  }, []) // Only run on mount

  return {
    ...state,
    fetchIPPhones,
    goToPage,
    changePageSize,
    refreshIPPhones,
  }
}

// Tasks Hook (updated for new structure) - DEPRECATED: Use useTasksNewPaginated instead
// Keeping for backward compatibility, but not recommended for new usage

// Tasks Hook with Pagination Support

export function useTasksNewPaginated(params?: TasksPaginationParams) {
  const [state, setState] = useState<TasksPaginationState>({
    tasks: [],
    currentPage: params?.page || 1,
    pageSize: params?.limit || 10,
    totalItems: 0,
    totalPages: 0,
    loading: true,
    error: null,
  })

  const fetchTasks = async (page: number = 1, limit: number = 10) => {
    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const url = new URL(`${process.env.NEXT_PUBLIC_API_BASE}/api/v1/problem/list`)
      url.searchParams.set('page', page.toString())
      url.searchParams.set('limit', limit.toString())

      const response = await fetch(url.toString())
      if (!response.ok) throw new Error("Failed to fetch tasks")

      const data: TasksPaginationResponse = await response.json()

      setState(prev => ({
        ...prev,
        tasks: data.data || [],
        currentPage: data.pagination?.page || page,
        pageSize: data.pagination?.limit || limit,
        totalItems: data.pagination?.total || 0,
        totalPages: data.pagination?.total_pages || 0,
        loading: false,
        error: null,
      }))
    } catch (err) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : "Unknown error",
      }))
    }
  }

  const goToPage = (page: number) => {
    if (page >= 1 && page <= state.totalPages) {
      fetchTasks(page, state.pageSize)
    }
  }

  const changePageSize = (limit: number) => {
    fetchTasks(1, limit) // Reset to first page when changing page size
  }

  const refreshTasks = () => {
    fetchTasks(state.currentPage, state.pageSize)
  }

  useEffect(() => {
    fetchTasks(state.currentPage, state.pageSize)
  }, []) // Only run on mount

  return {
    ...state,
    fetchTasks,
    goToPage,
    changePageSize,
    refreshTasks,
  }
}

// Dropdown/Select hooks (optimized for getting all data)
export function useBranchesForDropdown() {
  const { branches, loading, error } = useBranches()
  return { branches, loading, error }
}

export function useDepartmentsForDropdown() {
  const { departments, loading, error } = useDepartmentsPaginated({ page: 1, limit: 1000 })
  return { departments, loading, error }
}

export function useProgramsForDropdown() {
  const { programs, loading, error } = useProgramsPaginated({ page: 1, limit: 1000 })
  return { programs, loading, error }
}

export function useIPPhonesForDropdown() {
  const { ipPhones, loading, error } = useIPPhonesPaginated({ page: 1, limit: 1000 })
  return { ipPhones, loading, error }
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



