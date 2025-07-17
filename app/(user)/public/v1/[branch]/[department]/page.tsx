"use client"

import type React from "react"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus } from "lucide-react"
import { Problem } from "@/components/department-table/problem"
import { TaskNewForm } from "@/components/entities-report"
import { useTasksNew, useIPPhones, useBranches, useDepartments, usePrograms, addTaskDepartment, deleteTaskNew } from "@/api/route"
import type { TaskWithPhone } from "@/types/report/model"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { SiteHeader } from "@/components/layout/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"


function Page() {

  const { tasks, refreshTasks } = useTasksNew()
  const { ipPhones } = useIPPhones()
  const { branches } = useBranches()
  const { departments } = useDepartments()
  const { programs } = usePrograms()
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(true)
  const [editingTask, setEditingTask] = useState<TaskWithPhone | null>(null)

   const handleAddTask = () => {
    setEditingTask(null)
    setIsTaskFormOpen(true)
  }

  // useEffect(() => {
  //   const reponse 
  // }


  const handleTaskSubmit = async (data: {  text: string; status: string; id?: number; program_id: number; branch_id: number; department_id: number }) => {
    try {
      if (data.id) {
        await addTaskDepartment({  text: data.text, status: data.status, id: data.id, program_id: data.program_id, branch_id: data.branch_id, department_id: data.department_id })
      } 
      
      
      refreshTasks()
    } catch (error) {
      console.error("Error saving task:", error)
    }
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
        <SiteHeader title="Tasks" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-6">
            <div className="container mx-auto space-y-6">
              {/* Header with search and add button */}
              <div className="flex items-center justify-between">
                <Button onClick={handleAddTask} size="sm" className="ml-auto h-8">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Task
                </Button>
              </div>

              {/* Content */}
              <div className="space-y-4">
                <Problem tasks={tasks}  />
              </div>

              {/* Form */}
              <TaskNewForm
                open={isTaskFormOpen}
                onOpenChange={setIsTaskFormOpen}
                task={editingTask}
                onSubmit={handleTaskSubmit}
                ipPhones={ipPhones}
                branches={branches}
                departments={departments}
                programs={programs}
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
