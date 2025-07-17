"use client"

import type React from "react"
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus } from "lucide-react"
import { TaskStatsCards } from "@/components/task/task-stats"
import { ProgramsTable } from "@/components/tables/programs-table"
import { ProgramFormNew } from "@/components/entities-form"
import { usePrograms, addProgram, updateProgram, deleteProgram } from "@/api/route"
import type { Program } from "@/types/entities"
import type { Task, TaskStats } from "@/types/task"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { SiteHeader } from "@/components/layout/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { useTasks, addTask, updateTask } from "@/hooks/use-api"

function Page() {
  const { tasks, loading, error, refreshTasks } = useTasks()
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
  const [selectedTasks, setSelectedTasks] = useState<string[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [isDepartmentFormOpen, setIsDepartmentFormOpen] = useState(false)
  const { programs, refreshPrograms } = usePrograms()
  const [searchQuery, setSearchQuery] = useState("")
  const [isProgramFormOpen, setIsProgramFormOpen] = useState(false)
  const [editingProgram, setEditingProgram] = useState<Program | null>(null)


  // Add pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Department และ Program handlers
  const handleAddDepartment = async () => {
    setIsDepartmentFormOpen(true)
  }


  const handleDepartmentSubmit = async (data: { ip_phone: string; department: string }) => {
    try {
      console.log('Sending data to API:', {
        ip_phone: data.ip_phone,
        branchoffice: data.department
      });

      const response = await fetch(`${API_BASE}/branchEntry/branchOffice`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ 
          ipPhone: data.ip_phone,  // เปลี่ยนจาก ip_phone เป็น ipPhone ตาม API spec
          branchoffice: data.department 
        }),
      })

      const responseData = await response.json();
      console.log('API Response:', responseData);

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to add department')
      }

      if (responseData.success) {
        console.log('Department added successfully');
        setIsDepartmentFormOpen(false)
        refreshTasks()
      } else {
        throw new Error(responseData.message || 'Failed to add department')
      }
    } catch (error) {
      console.error('Error adding department:', error)
      console.error(error instanceof Error ? error.message : "เพิ่ม Department ไม่สำเร็จ กรุณาลองใหม่")
    }
  }

  // const handleProgramSubmit = async (data: { name: string }) => {
  //   try {
  //     console.log('Sending program data to API:', {
  //       name: data.name
  //     });

  //     const response = await fetch(`${API_BASE}/programEntry/program`, {
  //       method: "POST",
  //       headers: { 
  //         "Content-Type": "application/json",
  //         "Accept": "application/json"
  //       },
  //       body: JSON.stringify({ 
  //         name: data.name
  //       }),
  //     })

  //     const responseData = await response.json();
  //     console.log('API Response:', responseData);

  //     if (!response.ok) {
  //       throw new Error(responseData.message || 'Failed to add program')
  //     }

  //     if (responseData.success) {
  //       console.log('Program added successfully');
  //       setIsProgramFormOpen(false)
  //       refreshTasks()
  //     } else {
  //       throw new Error(responseData.message || 'Failed to add program')
  //     }
  //   } catch (error) {
  //     console.error('Error adding program:', error)
  //     console.error(error instanceof Error ? error.message : "เพิ่ม Program ไม่สำเร็จ กรุณาลองใหม่")
  //   }
  // }

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        searchQuery === "" ||
        task.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.ip_phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.program.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.problem.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.status.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(task.status)

      return matchesSearch && matchesStatus
    })
  }, [tasks, searchQuery, selectedStatuses])

  // Paginate filtered tasks
  const paginatedTasks = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize
    return filteredTasks.slice(startIndex, endIndex)
  }, [filteredTasks, currentPage, pageSize])

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedStatuses])

  const handleAddTask = () => {
    setEditingTask(null)
    setIsFormOpen(true)
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setIsFormOpen(true)
  }

  const handleTaskSubmit = async (taskData: Omit<Task, "id" | "created_at"> & { id?: string }) => {
    // Always update/add branch office first
    if (editingTask) {
      await fetch(`${API_BASE}/branchEntry/branchOffice/${taskData.ip_phone}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ branchoffice: taskData.department }),
      })
      await updateTask(Number(editingTask.id), {
        ipPhone: taskData.ip_phone,
        program: taskData.program,
        problem: taskData.problem,
        solution: taskData.solution,
        status: taskData.status,
        other: "",
        solutionUser: "",
      })
    } else {
      await fetch(`${API_BASE}/branchEntry/branchOffice`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ip_phone: taskData.ip_phone, branchoffice: taskData.department }),
      })
      await addTask({
        ipPhone: taskData.ip_phone,
        program: taskData.program,
        problem: taskData.problem,
        solution: taskData.solution,
        status: taskData.status,
        other: "",
        solutionUser: "",
      })
    }
    setIsFormOpen(false)
    refreshTasks()
  }

  const handleDeleteTask = async (taskId: string) => {
    console.log("[DEBUG] Try to delete task id:", taskId, "type:", typeof taskId)
    const res = await fetch(`${API_BASE}/problemEntry/problem/${taskId}`, {
      method: "DELETE",
    })
    if (res.ok) {
      refreshTasks()
      setSelectedTasks(selectedTasks.filter((id) => id !== taskId))
    } else {
      console.error("Failed to delete task:", res.status, res.statusText)
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize)
    setCurrentPage(1)
  }

   const handleAddProgram = () => {
    setEditingProgram(null)
    setIsProgramFormOpen(true)
  }

  const handleEditProgram = (program: Program) => {
    setEditingProgram(program)
    setIsProgramFormOpen(true)
  }

  const handleProgramSubmit = async (data: { name: string; id?: number }) => {
    try {
      if (data.id) {
        await updateProgram(data.id, { name: data.name })
      } else {
        await addProgram({ name: data.name })
      }
      refreshPrograms()
    } catch (error) {
      console.error("Error saving program:", error)
    }
  }

  const handleDeleteProgram = async (id: number) => {
    try {
      await deleteProgram(id)
      refreshPrograms()
    } catch (error) {
      console.error("Error deleting program:", error)
    }
  }

    const filteredPrograms = programs.filter((program) => program.name.
    toLowerCase().includes(searchQuery.toLowerCase()))

  

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 60)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
       <SiteHeader title="Programs" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-6">
            <div className="container mx-auto space-y-6">
              {/* Header with search and add button */}
              <div className="flex items-center justify-between">
                <div className="flex flex-1 items-center space-x-2">
                  <Input
                    placeholder="Filter programs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-8 w-[150px] lg:w-[450px]"
                  />
                </div>
                <Button onClick={handleAddProgram} size="sm" className="ml-auto h-8">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Program
                </Button>
              </div>

              {/* Content */}
              <div className="space-y-4">
                <ProgramsTable
                  programs={filteredPrograms}
                  onEditProgram={handleEditProgram}
                  onDeleteProgram={handleDeleteProgram}
                />
              </div>

              {/* Form */}
              <ProgramFormNew
                open={isProgramFormOpen}
                onOpenChange={setIsProgramFormOpen}
                program={editingProgram}
                onSubmit={handleProgramSubmit}
              />
            </div>
          </div>
        </div>
      </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default Page
