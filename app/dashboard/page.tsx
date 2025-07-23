"use client";
// test git commit
import type React from "react";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { BranchAreaChart } from "@/components/charts/branch-area-chart";
import { YearlyBranchChart } from "@/components/charts/yearly-branch-chart";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SiteHeader } from "@/components/layout/site-header";
import { TaskStatsCards } from "@/components/task/task-stats";
import  { TaskStats } from "@/types/entities";
import { useDashboard } from "@/api/route";
import { useMemo } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

function Page() {
  const { data, loading, error } = useDashboard();

  console.log(data);

  // Calculate stats from dashboard data
  const status: TaskStats = useMemo(() => {
    if (!data?.tasks) {
      return { total: 0, pending: 0, solved: 0 };
    }
    
    const total = data.tasks.length;
    const pending = data.tasks.filter((t) => t.status === 0).length;
    const solved = data.tasks.filter((t) => t.status === 1).length;
    return { total, pending, solved };
  }, [data]);
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
              <TaskStatsCards stats={status} />
              <div
                className="grid grid-cols-1 gap-4 px-3 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-1
                 @xl/main:grid-cols-1 "
              >
                <ChartAreaInteractive data={data} loading={loading} error={error} />
                <BranchAreaChart data={data} loading={loading} error={error} />
                <YearlyBranchChart data={data} loading={loading} error={error} />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default Page;
