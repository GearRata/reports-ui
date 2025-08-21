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
 */

"use client";
import type React from "react";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { BarChartComponents } from "@/components/charts/bar-chart";
import { ChartPieDepartment } from "@/components/charts/pie-chart-department";
import { ChartPieProgram } from "@/components/charts/pie-chart-program";
import { SiteHeader } from "@/components/layout/site-header";
import { TaskStatsCards } from "@/components/task/task-stats";
import { TaskStats } from "@/types/entities";
import { useDashboard } from "@/lib/api/dashboard";
import { useMemo, useState, useCallback } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { th } from "date-fns/locale";

function Page() {
  const { data, loading, error } = useDashboard();

  // Dashboard-level filter states
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedBranch, setSelectedBranch] = useState<string>("all");
  const [open, setOpen] = useState(false);

  // Filter data based on selected date and branch
  const filteredTasks = useMemo(() => {
    if (!data?.tasks) return [];

    let filtered = data.tasks;

    // Filter by date if selected
    if (selectedDate) {
      const selectedDay = selectedDate.getDate();
      const selectedMonth = selectedDate.getMonth() + 1;
      const selectedYear = selectedDate.getFullYear();

      filtered = filtered.filter((task) => {
        const taskDate = new Date(task.created_at);
        const taskDay = taskDate.getDate();
        const taskMonth = taskDate.getMonth() + 1;
        const taskYear = taskDate.getFullYear();

        return (
          taskDay === selectedDay &&
          taskMonth === selectedMonth &&
          taskYear === selectedYear
        );
      });
    }

    // Filter by branch if not "all"
    if (selectedBranch !== "all") {
      filtered = filtered.filter((task) => {
        const branchName = task.branch_name || "ไม่ระบุสาขา";
        return branchName === selectedBranch;
      });
    }

    return filtered;
  }, [data?.tasks, selectedDate, selectedBranch]);

  // Calculate stats from filtered data
  const status: TaskStats = useMemo(() => {
    const total = filteredTasks.length;
    const pending = filteredTasks.filter((t) => t.status === 0).length;
    const solved = filteredTasks.filter((t) => t.status === 1).length;
    return { total, pending, solved };
  }, [filteredTasks]);

  // Callback functions for filters
  const handleDateSelect = useCallback((date: Date | undefined) => {
    setSelectedDate(date);
    setOpen(false);
  }, []);

  const handleSelectToday = useCallback(() => {
    setSelectedDate(new Date());
    setOpen(false);
  }, []);

  const handleClearFilter = useCallback(() => {
    setSelectedDate(undefined);
    setOpen(false);
  }, []);

  const handleBranchChange = useCallback((value: string) => {
    setSelectedBranch(value);
  }, []);
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
                <TaskStatsCards stats={status} />

                {/* Dashboard Filters */}
                <div className="grid grid-cols-2 gap-2 p-4 bg-card rounded-lg border max-md:grid-cols-1">
                  {/* Date Filter */}
                  <div>
                    <div className="flex flex-col gap-2">
                      <span className="text-sm font-medium">
                        กรองตามวันที่:
                      </span>
                      <DropdownMenu open={open} onOpenChange={setOpen}>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              " justify-between font-normal",
                              !selectedDate && "text-muted-foreground"
                            )}
                          >
                            <div className="flex items-center">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {selectedDate ? (
                                format(selectedDate, "PPP", { locale: th })
                              ) : (
                                <span>เลือกวันที่เพื่อดูข้อมูล</span>
                              )}
                            </div>
                            <ChevronDownIcon className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          className="w-auto overflow-hidden p-0"
                          align="start"
                        >
                          <div className="p-3 border-b">
                            <p className="text-sm text-muted-foreground text-center">
                              เลือกวันที่เพื่อกรองข้อมูลตามวันที่เฉพาะ
                            </p>
                          </div>
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={handleDateSelect}
                            captionLayout="dropdown"
                          />
                          <div className="p-3 border-t flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleSelectToday}
                            >
                              Today
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleClearFilter}
                            >
                              Clear Filter
                            </Button>
                          </div>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* Branch Filter */}
                  {/* Branch Filter */}
                  <div>
                    <div className="flex flex-col gap-2">
                      <span className="text-sm font-medium">กรองตามสาขา:</span>
                      <Select
                        value={selectedBranch}
                        onValueChange={handleBranchChange}
                      >
                        <SelectTrigger className="w-full justify-between">
                          <SelectValue placeholder="เลือกสาขา" />
                        </SelectTrigger>
                        <SelectContent
                          className="w-[--radix-select-trigger-width]"
                          align="start"
                        >
                          <SelectItem value="all">ทั้งหมด</SelectItem>
                          <SelectItem value="สำนักงานใหญ่">
                            สำนักงานใหญ่
                          </SelectItem>
                          <SelectItem value="สาขาสันกำแพง">
                            สาขาสันกำแพง
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Charts Grid */}

                <BarChartComponents
                  filteredTasks={filteredTasks}
                  selectedDate={selectedDate}
                  selectedBranch={selectedBranch}
                  loading={loading}
                  error={error}
                />
                <div className="grid grid-cols-2 gap-6 max-md:grid-cols-1">
                  <ChartPieDepartment
                    filteredTasks={filteredTasks}
                    selectedDate={selectedDate}
                    selectedBranch={selectedBranch}
                    loading={loading}
                    error={error}
                  />
                  <ChartPieProgram
                    filteredTasks={filteredTasks}
                    selectedDate={selectedDate}
                    selectedBranch={selectedBranch}
                    loading={loading}
                    error={error}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default Page;
