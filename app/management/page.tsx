"use client"

import type React from "react"

import { useState, useEffect, useMemo } from "react"
import { TaskStatsCards } from "@/components/task-stats"
import { TaskFilters } from "@/components/task-filters"
import { TaskTable } from "@/components/task-table"
import { TaskForm } from "@/components/task-form"
import type { Task, TaskStats } from "@/types/task"
import tasksData from "@/data/data.json"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

function Page() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
  const [selectedTasks, setSelectedTasks] = useState<string[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  // Add pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Load initial data
  useEffect(() => {
    setTasks(tasksData as Task[])
  }, [])

  // Calculate stats
  const stats: TaskStats = useMemo(() => {
    const total = tasks.length
    const in_progress = tasks.filter((t) => t.status === "in_progress").length
    const done = tasks.filter((t) => t.status === "done").length
    return { total, in_progress, done,  }
  }, [tasks])

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

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter((t) => t.id !== taskId))
    setSelectedTasks(selectedTasks.filter((id) => id !== taskId))
  }

  const handleTaskSubmit = (taskData: Omit<Task, "id" | "created_at"> & { id?: string }) => {
    if (editingTask) {
      // Update existing task
      setTasks(
        tasks.map((t) =>
          t.id === editingTask.id
            ? ({ ...taskData, id: editingTask.id, } as Task)
            : t,
        ),
      )
    } else {
      // Add new task
      const newTask: Task = {
        ...taskData,
        id: `TASK-${Math.floor(Math.random() * 10000)}`,
        created_at: new Date().toISOString(),
      } as Task
      setTasks([newTask, ...tasks])
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize)
    setCurrentPage(1)
  }

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
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-6">
              <div className="container mx-auto space-y-6">
                

                <TaskStatsCards stats={stats} />

                <div className="space-y-4">
                  <TaskFilters
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    selectedStatuses={selectedStatuses}
                    onStatusChange={setSelectedStatuses}
                    onAddTask={handleAddTask}
                  />

                  <TaskTable
                    tasks={paginatedTasks}
                    onEditTask={handleEditTask}
                    onDeleteTask={handleDeleteTask}
                    currentPage={currentPage}
                    pageSize={pageSize}
                    totalItems={filteredTasks.length}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                  />
                </div>

                <TaskForm
                  open={isFormOpen}
                  onOpenChange={setIsFormOpen}
                  task={editingTask}
                  onSubmit={handleTaskSubmit}
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
