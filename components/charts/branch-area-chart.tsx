/**
 * Branch Area Chart Component
 *
 * This component displays an area chart showing problem statistics
 * for all branches with combined total for each branch.
 * Features include:
 *
 * - Month dropdown selector with Thai labels and task counts
 * - Dynamic area chart generation based on available branches
 * - One line per branch showing total tasks (pending + solved)
 * - Daily data display within selected month
 * - Interactive tooltip showing branch details
 * - Dynamic color assignment for multiple branches
 * - Comprehensive error handling and validation
 *
 * Data Source: Dashboard API (/api/v1/dashboard/data)
 * Filters: By month from created_at field
 * Groups: By date and branch_name, counts by status
 *
 * @author Kiro AI Assistant
 * @created 2025-01-24
 */

"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { DashboardData } from "@/types/entities";

interface BranchAreaChartProps {
  data: DashboardData | null;
  loading?: boolean;
  error?: string | null;
}

// Define chart data point structure for branch-specific data
interface BranchChartDataPoint {
  date: string;
  day: number;
  [branchKey: string]: number | string;
  // Dynamic keys like: "สำนักงานใหญ่_total"
}

// Month option interface for selector
interface MonthOption {
  value: string; // YYYY-MM format
  label: string; // "มกราคม 2025" format
  taskCount: number; // จำนวน tasks ในเดือนนั้น
}

/**
 * Format month string to Thai label
 * @param monthString YYYY-MM format
 * @returns Thai month label with Buddhist year
 */
const formatMonthLabel = (monthString: string): string => {
  try {
    const [year, month] = monthString.split("-");
    const monthNames = [
      "มกราคม",
      "กุมภาพันธ์",
      "มีนาคม",
      "เมษายน",
      "พฤษภาคม",
      "มิถุนายน",
      "กรกฎาคม",
      "สิงหาคม",
      "กันยายน",
      "ตุลาคม",
      "พฤศจิกายน",
      "ธันวาคม",
    ];
    const monthIndex = parseInt(month) - 1;
    const buddhistYear = parseInt(year) + 543;

    if (monthIndex >= 0 && monthIndex < 12) {
      return `${monthNames[monthIndex]} ${buddhistYear}`;
    }
    return monthString; // fallback
  } catch {
    return monthString; // fallback
  }
};

export function BranchAreaChart({
  data,
  loading,
  error,
}: BranchAreaChartProps) {
  const [selectedMonth, setSelectedMonth] = React.useState<string>("");

  // Memoize month change handler to prevent unnecessary re-renders
  const handleMonthChange = React.useCallback((month: string) => {
    setSelectedMonth(month);
  }, []);

  /**
   * Generate month options from task data
   *
   * This function:
   * 1. Extracts unique months from task created_at dates
   * 2. Counts tasks for each month
   * 3. Sorts months chronologically (newest first)
   * 4. Formats month labels in Thai
   */
  const monthOptions = React.useMemo<MonthOption[]>(() => {
    if (!data?.tasks || data.tasks.length === 0) {
      return [];
    }

    // Group tasks by month
    const monthMap = new Map<string, number>();

    data.tasks.forEach((task) => {
      // Validate task structure
      if (!task || !task.created_at || typeof task.created_at !== "string") {
        console.warn("Invalid task structure:", task);
        return;
      }

      try {
        // Handle different date formats (YYYY-MM-DD HH:MM:SS or ISO format)
        let dateStr: string;
        if (task.created_at.includes(" ")) {
          // Format: "2025-07-22 04:49:39"
          dateStr = task.created_at.split(" ")[0];
        } else if (task.created_at.includes("T")) {
          // ISO format: "2025-07-22T04:49:39Z"
          dateStr = task.created_at.split("T")[0];
        } else {
          // Fallback: assume it's already in YYYY-MM-DD format
          dateStr = task.created_at;
        }

        // Validate date format (YYYY-MM-DD)
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(dateStr)) {
          console.warn("Invalid date format:", dateStr);
          return;
        }

        // Extract YYYY-MM and validate
        const monthKey = dateStr.substring(0, 7); // "2025-07"
        const monthRegex = /^\d{4}-\d{2}$/;
        if (!monthRegex.test(monthKey)) {
          console.warn("Invalid month format:", monthKey);
          return;
        }

        // Count tasks for this month
        monthMap.set(monthKey, (monthMap.get(monthKey) || 0) + 1);
      } catch (error) {
        console.warn("Error processing task date:", task.created_at, error);
      }
    });

    // Convert to array and sort (newest first)
    const monthArray = Array.from(monthMap.entries())
      .map(([monthKey, taskCount]) => ({
        value: monthKey,
        label: formatMonthLabel(monthKey),
        taskCount,
      }))
      .sort((a, b) => b.value.localeCompare(a.value));

    return monthArray;
  }, [data]);

  // Set default selected month to current month or first available month
  React.useEffect(() => {
    if (monthOptions.length > 0 && !selectedMonth) {
      // Try to set current month first
      const currentDate = new Date();
      const currentMonth = `${currentDate.getFullYear()}-${String(
        currentDate.getMonth() + 1
      ).padStart(2, "0")}`;

      // Check if current month exists in options
      const currentMonthExists = monthOptions.some(
        (option) => option.value === currentMonth
      );

      if (currentMonthExists) {
        setSelectedMonth(currentMonth);
      } else {
        // Set to first available month (newest)
        setSelectedMonth(monthOptions[0].value);
      }
    }
  }, [monthOptions, selectedMonth]);

  /**
   * Transform tasks data to branch chart format
   *
   * This function:
   * 1. Filters tasks by selected month
   * 2. Groups tasks by date and branch
   * 3. Counts pending/solved for each branch per date
   * 4. Creates data points with dynamic branch keys
   * 5. Fills missing dates with zero values
   */
  const chartData = React.useMemo<BranchChartDataPoint[]>(() => {
    if (!data?.tasks || data.tasks.length === 0 || !selectedMonth) {
      return [];
    }

    // Validate selectedMonth format
    const monthRegex = /^\d{4}-\d{2}$/;
    if (!monthRegex.test(selectedMonth)) {
      console.warn("Invalid selectedMonth format:", selectedMonth);
      return [];
    }

    // Filter tasks by selected month
    const monthTasks = data.tasks.filter((task) => {
      // Validate task structure
      if (!task || !task.created_at || typeof task.created_at !== "string") {
        return false;
      }

      try {
        let dateStr: string;
        if (task.created_at.includes(" ")) {
          dateStr = task.created_at.split(" ")[0];
        } else if (task.created_at.includes("T")) {
          dateStr = task.created_at.split("T")[0];
        } else {
          dateStr = task.created_at;
        }

        // Validate date format
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(dateStr)) {
          return false;
        }

        const taskMonth = dateStr.substring(0, 7); // "2025-07"
        return taskMonth === selectedMonth;
      } catch {
        return false;
      }
    });

    if (monthTasks.length === 0) {
      return [];
    }

    // Get unique branches from data - handle case when no branches exist
    const branches = data.branches || [];
    if (branches.length === 0) {
      console.warn("No branches found in data");
      return [];
    }

    // Group tasks by date and branch
    const dateMap = new Map<
      string,
      Map<string, { pending: number; solved: number }>
    >();

    monthTasks.forEach((task) => {
      // Additional validation
      if (!task || typeof task.status !== "number") {
        console.warn("Invalid task structure:", task);
        return;
      }

      try {
        let dateStr: string;
        if (task.created_at.includes(" ")) {
          dateStr = task.created_at.split(" ")[0];
        } else if (task.created_at.includes("T")) {
          dateStr = task.created_at.split("T")[0];
        } else {
          dateStr = task.created_at;
        }

        // Validate date again
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(dateStr)) {
          return;
        }

        // Initialize date map if not exists
        if (!dateMap.has(dateStr)) {
          dateMap.set(dateStr, new Map());
        }

        const dayMap = dateMap.get(dateStr)!;
        const branchName = task.branch_name || "ไม่ระบุสาขา";

        // Initialize branch data if not exists
        if (!dayMap.has(branchName)) {
          dayMap.set(branchName, { pending: 0, solved: 0 });
        }

        const branchData = dayMap.get(branchName)!;

        // Count by status - handle only valid status values
        if (task.status === 0) {
          branchData.pending++;
        } else if (task.status === 1) {
          branchData.solved++;
        }
        // Ignore other status values
      } catch (error) {
        console.warn("Error processing task:", task, error);
      }
    });

    // Generate all dates in the selected month
    try {
      const [year, month] = selectedMonth.split("-");
      const yearNum = parseInt(year);
      const monthNum = parseInt(month);

      // Validate year and month
      if (isNaN(yearNum) || isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
        console.warn("Invalid year or month:", year, month);
        return [];
      }

      const daysInMonth = new Date(yearNum, monthNum, 0).getDate();
      const allDates: string[] = [];

      for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${month}-${String(day).padStart(2, "0")}`;
        allDates.push(dateStr);
      }

      // Create chart data points
      const chartPoints: BranchChartDataPoint[] = allDates.map((dateStr) => {
        const dayData = dateMap.get(dateStr) || new Map();
        const day = parseInt(dateStr.split("-")[2]);

        const dataPoint: BranchChartDataPoint = {
          date: dateStr,
          day: day,
        };

        // Add data for each branch (combined total)
        branches.forEach((branch) => {
          if (!branch || !branch.name) {
            console.warn("Invalid branch structure:", branch);
            return;
          }

          const branchData = dayData.get(branch.name) || {
            pending: 0,
            solved: 0,
          };
          // Combine pending and solved into total
          dataPoint[`${branch.name}_total`] =
            branchData.pending + branchData.solved;
        });

        return dataPoint;
      });

      return chartPoints;
    } catch (error) {
      console.warn("Error generating chart data:", error);
      return [];
    }
  }, [data, selectedMonth]);

  // Get available branches for chart configuration
  const availableBranches = React.useMemo(() => {
    return data?.branches || [];
  }, [data]);

  /**
   * Generate dynamic chart configuration based on available branches
   *
   * This function:
   * 1. Creates config for each branch's total line
   * 2. Assigns distinct colors for each branch
   * 3. Generates Thai labels
   * 4. Handles color cycling for multiple branches
   */
  const chartConfig = React.useMemo<ChartConfig>(() => {
    const colors = [
      "hsl(var(--chart-1))", // Blue
      "hsl(var(--chart-2))", // Green
      "hsl(var(--chart-3))", // Yellow
      "hsl(var(--chart-4))", // Purple
      "hsl(var(--chart-5))", // Orange
    ];

    const config: ChartConfig = {};

    availableBranches.forEach((branch, index) => {
      const baseColor = colors[index % colors.length];

      // Total line configuration
      config[`${branch.name}_total`] = {
        label: `${branch.name}`,
        color: baseColor,
      };
    });

    return config;
  }, [availableBranches]);

  // Handle loading state
  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-[400px]">
          <div>กำลังโหลดข้อมูล...</div>
        </CardContent>
      </Card>
    );
  }

  // Handle error state
  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-[400px]">
          <div className="text-red-500">เกิดข้อผิดพลาด: {error}</div>
        </CardContent>
      </Card>
    );
  }

  // Handle empty data state
  if (!data || !data.tasks || data.tasks.length === 0) {
    return (
      <Card>
        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
          <div className="grid flex-1 gap-1 text-center sm:text-left">
            <CardTitle>สถิติปัญหาระบบแยกตามสาขา</CardTitle>
            <CardDescription>
              แสดงจำนวนปัญหาทั้งหมดของแต่ละสาขาในแต่ละวัน
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[400px]">
          <div className="text-gray-500">ไม่มีข้อมูลปัญหาระบบ</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>สถิติปัญหาระบบแยกตามสาขา</CardTitle>
          <CardDescription>
            แสดงจำนวนปัญหาทั้งหมดของแต่ละสาขาในแต่ละวัน
          </CardDescription>
        </div>
        <Select value={selectedMonth} onValueChange={handleMonthChange}>
          <SelectTrigger
            className="w-[160px] sm:w-[200px] rounded-lg sm:ml-auto"
            aria-label="เลือกเดือน"
          >
            <SelectValue placeholder="เลือกเดือน" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {monthOptions.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="rounded-lg"
              >
                {option.label} ({option.taskCount} รายการ)
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {!selectedMonth ? (
          <div className="flex items-center justify-center h-[350px]">
            <div className="text-gray-500">กรุณาเลือกเดือนเพื่อแสดงข้อมูล</div>
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex items-center justify-center h-[350px]">
            <div className="text-gray-500">ไม่มีข้อมูลในเดือนที่เลือก</div>
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[300px] sm:h-[350px] w-full"
          >
            <AreaChart data={chartData}>
              <defs>
                {/* Generate gradients for each branch */}
                {availableBranches.map((branch, index) => {
                  const colors = [
                    "var(--chart-1)",
                    "var(--chart-2)",
                    "var(--chart-3)",
                    "var(--chart-4)",
                    "var(--chart-5)",
                  ];
                  const color = colors[index % colors.length];

                  return (
                    <linearGradient
                      key={branch.id}
                      id={`fill${branch.name}Total`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                      <stop offset="95%" stopColor={color} stopOpacity={0.1} />
                    </linearGradient>
                  );
                })}
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                textAnchor="middle"
                interval={0}
                tickFormatter={(value) => `${value}`}
                domain={["dataMin", "dataMax"]}
              />
              <ChartTooltip
                cursor={false}
                content={({ active, payload, label }) => {
                  if (!active || !payload || !payload.length) {
                    return null;
                  }

                  // Get the data point
                  const dataPoint = payload[0]?.payload as
                    | BranchChartDataPoint
                    | undefined;

                  if (!dataPoint) return null;

                  // Format date in Thai
                  let formattedDate = "";
                  try {
                    const date = new Date(dataPoint.date);
                    formattedDate = date.toLocaleDateString("th-TH", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      weekday: "long",
                    });
                  } catch {
                    formattedDate = `วันที่ ${label}`;
                  }

                  return (
                    <div className="rounded-lg border bg-background p-3 shadow-md">
                      <div className="mb-2 font-medium text-foreground">
                        {formattedDate}
                      </div>
                      <div className="space-y-1">
                        {availableBranches.map((branch, branchIndex) => {
                          const totalCount =
                            (dataPoint[`${branch.name}_total`] as number) || 0;

                          if (totalCount === 0) return null;

                          const colors = [
                            "hsl(var(--chart-1))",
                            "hsl(var(--chart-2))",
                            "hsl(var(--chart-3))",
                            "hsl(var(--chart-4))",
                            "hsl(var(--chart-5))",
                          ];
                          const color = colors[branchIndex % colors.length];

                          return (
                            <div
                              key={branch.id}
                              className="flex items-center gap-2"
                            >
                              <div
                                className="h-3 w-3 rounded-full"
                                style={{ backgroundColor: color }}
                              />
                              <span className="text-sm">
                                {branch.name}:{" "}
                                <span className="font-medium">
                                  {totalCount} รายการ
                                </span>
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                }}
              />

              {/* Generate Area components for each branch */}
              {availableBranches.map((branch) => (
                <Area
                  key={branch.id}
                  dataKey={`${branch.name}_total`}
                  type="monotone"
                  fill={`url(#fill${branch.name}Total)`}
                  stroke={chartConfig[`${branch.name}_total`]?.color}
                  strokeWidth={2}
                  stackId="total"
                />
              ))}

              <ChartLegend
                content={<ChartLegendContent />}
                formatter={(value) => {
                  const config = chartConfig[value as keyof typeof chartConfig];
                  return config?.label || value;
                }}
                wrapperStyle={{ paddingTop: "20px" }}
                iconType="rect"
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
