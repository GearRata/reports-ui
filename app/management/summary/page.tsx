"use client"

import type React from "react"
import { ChartBarMultiple } from "@/components/chart-bar-multiple"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { TaskStatsCards } from "@/components/task-stats"
import type { Task, TaskStats } from "@/types/task"
import tasksData from "@/data/data.json"
import { useState, useEffect, useMemo } from "react"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

function Page() {
   const [tasks, setTasks] = useState<Task[]>([])

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
              <TaskStatsCards stats={stats} />
                <div className="grid grid-cols-1 gap-4 px-3 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-1
                 @xl/main:grid-cols-1 ">
                    <ChartBarMultiple />
                </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default Page
