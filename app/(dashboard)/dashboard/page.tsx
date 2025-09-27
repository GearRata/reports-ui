"use client";
import type React from "react";
import { useMemo, useState, useCallback } from "react";
import {
  format,
  startOfDay,
  addDays,
  subDays,
  subMonths,
  subYears,
} from "date-fns";
import { th } from "date-fns/locale";

import { AppSidebar } from "@/components/layout/app-sidebar";
import { BarChartComponents } from "@/components/dashboard/charts/bar-chart";
import { ChartPieDepartment } from "@/components/dashboard/charts/pie-chart-department";
import { ChartPieProgram } from "@/components/dashboard/charts/pie-chart-program";
import { ChartPieType } from "@/components/dashboard/charts/pie-chart-type";
import { ChartPieReport } from "@/components/dashboard/charts/pie-chart-report";
import { SiteHeader } from "@/components/layout/site-header";
import { StatsCards } from "@/components/dashboard/card/stats-card";
import { TaskStats } from "@/types/entities";
import { useDashboard } from "@/app/api/dashboard";
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

/** ===== Types ===== */
type Task = {
  created_at: string | Date;
  status: 0 | 1 | number;
  branch_name?: string;

  system_type?: string;
  system_name?: string;

  reported_by?: string;
  created_by?: string;
  phone_name?: string;
};

import type { DashboardData as DashboardDataType } from "@/types/entities";



type Range = { from: Date; to: Date }; // [from, to) รวม from ไม่รวม to

/** ===== Date range utils (half-open [from, to)) ===== */
function rangeForSingleDate(d: Date): Range {
  const from = startOfDay(d);
  const to = addDays(from, 1); // exclusive
  return { from, to };
}

function rangeLastNDaysInclusiveToday(n: number): Range {
  // n วันเต็มย้อนหลัง รวม "วันนี้"
  const to = addDays(startOfDay(new Date()), 1); // พรุ่งนี้ 00:00 (exclusive)
  const from = subDays(to, n);
  return { from, to };
}

function rangeLastNCalendarMonths(n: number): Range {
  // นับเป็นเดือนปฏิทินเต็ม โดยยึดขอบบนที่ endOfTodayExclusive
  const endOfTodayExclusive = addDays(startOfDay(new Date()), 1);
  const from = subMonths(endOfTodayExclusive, n);
  return { from, to: endOfTodayExclusive };
}

function rangeLastYear(): Range {
  const endOfTodayExclusive = addDays(startOfDay(new Date()), 1);
  const from = subYears(endOfTodayExclusive, 1);
  return { from, to: endOfTodayExclusive };
}

function Page() {
  const { data, loading, error } = useDashboard() as {
    data?: DashboardDataType;
    loading: boolean;
    error?: unknown;
  };

  // Dashboard-level filter states
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedRange, setSelectedRange] = useState<Range | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<string>("all");
  const [open, setOpen] = useState(false);

  console.log("Data", data);

  // Filter data based on selected date and branch using half-open ranges [from, to)
  const filteredTasks = useMemo(() => {
    if (!data?.tasks) return [];

    let filtered = data.tasks;

    // Helper to safely get timestamp
    const toTimestamp = (d: Date) => d.getTime();

    if (selectedDate) {
      const { from, to } = rangeForSingleDate(selectedDate);
      const fromTs = toTimestamp(from);
      const toTs = toTimestamp(to);
      filtered = filtered.filter((task) => {
        const taskDate = new Date(task.created_at).getTime();
        if (!isFinite(taskDate)) return false;
        return taskDate >= fromTs && taskDate < toTs; // half-open
      });
    } else if (selectedRange && selectedRange.from && selectedRange.to) {
      const fromTs = toTimestamp(selectedRange.from);
      const toTs = toTimestamp(selectedRange.to);
      filtered = filtered.filter((task) => {
        const taskDate = new Date(task.created_at).getTime();
        if (!isFinite(taskDate)) return false;
        return taskDate >= fromTs && taskDate < toTs; // half-open
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
  }, [data?.tasks, selectedDate, selectedRange, selectedBranch]);

  const tasksForType = useMemo(
    () =>
      filteredTasks.map((t: Record<string, unknown>) => ({
        // ใช้ system_type ถ้ามี; ไม่งั้นลอง fallback เป็น system_name; สุดท้ายใส่ค่า default
        system_type: String(
          (t["system_type"] ?? t["system_name"] ?? "ไม่ระบุประเภท") as string
        ),
      })),
    [filteredTasks]
  );

  const tasksForReport = useMemo(
    () =>
      filteredTasks.map((t: Record<string, unknown>) => ({
        // ใช้ reported_by ถ้ามี; ไม่งั้นลอง created_by หรือ phone_name; สุดท้ายใส่ค่า default
        reported_by: String(
          (t["reported_by"] ??
            t["created_by"] ??
            t["phone_name"] ??
            "ไม่ระบุชื่อผู้แจ้ง") as string
        ),
      })),
    [filteredTasks]
  );

  // Calculate stats from filtered data
  const status: TaskStats = useMemo(() => {
    const total = filteredTasks.length;
    const pending = filteredTasks.filter((t) => t.status === 0).length;
    const progress = filteredTasks.filter((t) => t.status === 1).length;
    const done = filteredTasks.filter((t) => t.status === 2).length;
    return { total, pending, progress, done };
  }, [filteredTasks]);

  // Callback functions for filters
  const handleDateSelect = useCallback((date: Date | undefined) => {
    setSelectedDate(date);
    if (date) setSelectedRange(rangeForSingleDate(date));
    setOpen(false);
  }, []);

  const handleSelectToday = useCallback(() => {
    const today = new Date();
    setSelectedDate(today);
    setSelectedRange(rangeForSingleDate(today));
    setOpen(false);
  }, []);

  const handleSelectWeek = useCallback(() => {
    setSelectedDate(undefined);
    setSelectedRange(rangeLastNDaysInclusiveToday(7));
    setOpen(false);
  }, []);

  const handleClearFilter = useCallback(() => {
    setSelectedDate(undefined);
    setSelectedRange(null);
    setOpen(false);
  }, []);

  const handleBranchChange = useCallback((value: string) => {
    setSelectedBranch(value);
  }, []);

  // Additional preset handlers (1 month, 3 months, 6 months, 1 year)
  const handleSelectMonth = useCallback(() => {
    setSelectedDate(undefined);
    setSelectedRange(rangeLastNCalendarMonths(1));
    setOpen(false);
  }, []);

  const handleSelectMonths = useCallback((months: number) => {
    setSelectedDate(undefined);
    setSelectedRange(rangeLastNCalendarMonths(months));
    setOpen(false);
  }, []);

  const handleSelectYear = useCallback(() => {
    setSelectedDate(undefined);
    setSelectedRange(rangeLastYear());
    setOpen(false);
  }, []);

  // Handlers for specific month and year selection
  const handleSelectSpecificMonth = useCallback(
    (month: number, year: number) => {
      const from = new Date(year, month, 1);
      const to = new Date(year, month + 1, 1);
      setSelectedDate(undefined);
      setSelectedRange({ from, to });
      setOpen(false);
    },
    []
  );

  const handleSelectSpecificYear = useCallback((year: number) => {
    const from = new Date(year, 0, 1);
    const to = new Date(year + 1, 0, 1);
    setSelectedDate(undefined);
    setSelectedRange({ from, to });
    setOpen(false);
  }, []);
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 53)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-2 px-2">
              <div className="container mx-auto space-y-6">
               
                {/* Dashboard Filters */}
                <div className="grid grid-cols-2 gap-2 p-4 bg-card rounded-lg border max-md:grid-cols-1">
                  {/* Date Filter */}

                  <div className="flex flex-col gap-2">
                    <span className="text-sm font-medium">กรองตามวันที่:</span>
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
                            ) : selectedRange ? (
                              <span>
                                {selectedRange.from && selectedRange.to
                                  ? `${format(
                                      selectedRange.from,
                                      "dd MMM yyyy",
                                      { locale: th }
                                    )} — ${format(
                                      subDays(selectedRange.to, 1),
                                      "dd MMM yyyy",
                                      { locale: th }
                                    )}`
                                  : "ช่วงที่เลือก"}
                              </span>
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
                        <div className="flex">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={handleDateSelect}
                            captionLayout="dropdown"
                          />
                          <div className="grid grid-cols-2 max-sm:grid-cols-1">
                            <div className="flex flex-col border-r ">
                              <div className="flex flex-col gap-2 p-3">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={handleSelectToday}
                                >
                                  วันนี้
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={handleSelectWeek}
                                >
                                  7 วัน
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={handleSelectMonth}
                                >
                                  30 วัน
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleSelectMonths(3)}
                                >
                                  3 เดือน
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleSelectMonths(6)}
                                >
                                  6 เดือน
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={handleSelectYear}
                                >
                                  1 ปี
                                </Button>
                              </div>
                            </div>

                            <div className="flex flex-col gap-2 p-3 max-md:flex-wrap">
                              <p className="text-xs text-muted-foreground mb-1">
                                เลือกเดือน:
                              </p>
                              <Select
                                onValueChange={(value) => {
                                  const [month, year] = value
                                    .split("-")
                                    .map(Number);
                                  handleSelectSpecificMonth(month, year);
                                }}
                              >
                                <SelectTrigger className="w-full h-8">
                                  <SelectValue placeholder="เลือกเดือน" />
                                </SelectTrigger>
                                <SelectContent>
                                  {Array.from({ length: 12 }, (_, i) => {
                                    const currentYear =
                                      new Date().getFullYear();
                                    const monthName = format(
                                      new Date(currentYear, i, 1),
                                      "MMMM",
                                      { locale: th }
                                    );
                                    return (
                                      <SelectItem
                                        key={i}
                                        value={`${i}-${currentYear}`}
                                      >
                                        {monthName} {currentYear}
                                      </SelectItem>
                                    );
                                  })}
                                </SelectContent>
                              </Select>

                              <div className="flex flex-col gap-2">
                                <p className="text-xs text-muted-foreground mb-1">
                                  เลือกปี:
                                </p>
                                <Select
                                  onValueChange={(value) =>
                                    handleSelectSpecificYear(Number(value))
                                  }
                                >
                                  <SelectTrigger className="w-full h-8">
                                    <SelectValue placeholder="เลือกปี" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {Array.from({ length: 5 }, (_, i) => {
                                      const year = new Date().getFullYear() - i;
                                      return (
                                        <SelectItem
                                          key={year}
                                          value={year.toString()}
                                        >
                                          {year}
                                        </SelectItem>
                                      );
                                    })}
                                  </SelectContent>
                                </Select>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={handleClearFilter}
                                className="mt-2"
                              >
                                Clear Filter
                              </Button>
                            </div>
                          </div>
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

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
                          {data?.branches?.map((branch) => (
                            <SelectItem key={branch.id} value={branch.name}>
                              {branch.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* StatsCard show Status of tasks */}
               
                 <StatsCards stats={status} />
                
                {/* <StatsCards stats={status} /> */}

                {/* Charts Grid */}

                <BarChartComponents
                  filteredTasks={filteredTasks.map((t) => ({
                    branch_name: t.branch_name || "ไม่ระบุสาขา",
                  }))}
                  selectedDate={selectedDate}
                  selectedBranch={selectedBranch}
                  loading={loading}
                  error={error ? String(error) : undefined}
                />
                <div className="grid grid-cols-2 gap-6 max-md:grid-cols-1">
                  <ChartPieDepartment
                    filteredTasks={filteredTasks.map((t) => ({
                      department_name:
                        (t as Task & { department_name?: string })
                          .department_name || "ไม่ระบุแผนก",
                    }))}
                    selectedDate={selectedDate}
                    selectedBranch={selectedBranch}
                    loading={loading}
                    error={error ? String(error) : undefined}
                  />
                  <ChartPieProgram
                    filteredTasks={filteredTasks.map((t) => ({
                      system_name:
                        (t as Task & { system_name?: string }).system_name ??
                        null,
                    }))}
                    selectedDate={selectedDate}
                    selectedBranch={selectedBranch}
                    loading={loading}
                    error={error ? String(error) : undefined}
                  />
                  <ChartPieType
                    filteredTasks={tasksForType}
                    selectedDate={selectedDate}
                    selectedBranch={selectedBranch}
                    loading={loading}
                    error={error ? String(error) : undefined}
                  />
                  <ChartPieReport
                    filteredTasks={tasksForReport}
                    selectedDate={selectedDate}
                    selectedBranch={selectedBranch}
                    loading={loading}
                    error={error ? String(error) : undefined}
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
