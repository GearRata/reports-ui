/**
 * Dashboard Main Page Component
 * 
 * This is the main dashboard page that displays various charts and statistics
 * for the task tracking system. Features include:
 * 
 * - Task statistics cards showing total, pending, and solved counts
 * - Multiple chart components for different data visualizations:
 *   - ChartAreaInteractive: Original chart with time range filtering
 *   - BranchAreaChart: Monthly branch comparison with pending/solved breakdown
 *   - YearlyBranchChart: Yearly comparison between two main branches
 *   - PieChartSummary: Program statistics by department
 * 
 * - Sidebar navigation and responsive layout
 * - Real-time data fetching from dashboard API
 * - Loading and error state handling
 * 
 * Data Source: useDashboard() hook -> /api/v1/dashboard/data
 * Layout: Sidebar + main content area with grid layout for charts
 * 
 * @author Kiro AI Assistant
 * @created 2025-01-24
 */

"use client";
// test git commit
import type React from "react";
// import { ChartAreaInteractive } from "@/components/chart-area-interactive";
// import { BranchAreaChart } from "@/components/charts/branch-area-chart";
import { YearlyBranchChart } from "@/components/charts/yearly-branch-chart";
import { PieChartSummary } from "@/components/charts/pie-chart";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SiteHeader } from "@/components/layout/site-header";
import { TaskStatsCards } from "@/components/task/task-stats";
import  { TaskStats } from "@/types/entities";
import { useDashboard } from "@/api/route";
import { useMemo } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

function Page() {
  const { data, loading, error } = useDashboard();


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
                {/* <ChartAreaInteractive data={data} loading={loading} error={error} />
                <BranchAreaChart data={data} loading={loading} error={error} /> */}
                <YearlyBranchChart data={data} loading={loading} error={error} />
                <PieChartSummary data={data} loading={loading} error={error} />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default Page;
