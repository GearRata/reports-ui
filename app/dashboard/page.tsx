"use client"
// test git commit
import type React from "react"
import { ChartBarMultiple } from "@/components/chart-bar-multiple"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { SiteHeader } from "@/components/layout/site-header"
import { TaskStatsCards } from "@/components/task/task-stats"
import type { TaskStats } from "@/types/task"
import { useTasks } from "@/hooks/use-api"
import { useMemo } from "react"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

function Page() {
  const { tasks } = useTasks()

    // Calculate stats
    const stats: TaskStats = useMemo(() => {
      const total = tasks.length
      const pending = tasks.filter((t) => t.status?.toLowerCase() === "pending").length
      const solved = tasks.filter((t) => t.status?.toLowerCase() === "solved").length
      return { total, pending, solved }
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
                    <ChartBarMultiple tasks={tasks} />
                </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default Page