"use client";

import * as React from "react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { DashboardData } from "@/types/entities";
import {
  BranchChartDataPoint,
  MonthOption,
  validateTaskData,
  generateMonthOptions,
  generateChartDataPoints,
  calculateBranchTotals,
} from "@/lib/branch-chart-utils";

export const description = "An interactive line chart";

// Component props interface matching BranchAreaChart pattern
interface BranchLineChartProps {
  data: DashboardData | null;
  loading?: boolean;
  error?: string | null;
}

// Chart data will be generated dynamically from task data

export function ChartLineInteractive({
  data,
  loading,
  error,
}: BranchLineChartProps) {
  // State for active branch - will be updated with dynamic branch names in later tasks
  const [activeBranch, setActiveBranch] = React.useState<string>("");
  const [selectedMonth, setSelectedMonth] = React.useState<string>("");

  // Generate month options from task data using utility function
  const monthOptions = React.useMemo<MonthOption[]>(() => {
    try {
      // Validate data structure first
      if (!data) {
        return [];
      }

      // Validate tasks array exists and is an array
      if (!data.tasks || !Array.isArray(data.tasks)) {
        console.warn("Invalid tasks data structure:", data.tasks);
        return [];
      }

      return generateMonthOptions(data);
    } catch (error) {
      console.error("Error generating month options:", error);
      return [];
    }
  }, [data]);

  // Memoize month change handler to prevent unnecessary re-renders with validation
  const handleMonthChange = React.useCallback(
    (month: string) => {
      try {
        // Validate month format
        if (!month || typeof month !== "string") {
          console.warn("Invalid month value:", month);
          return;
        }

        const monthRegex = /^\d{4}-\d{2}$/;
        if (!monthRegex.test(month)) {
          console.warn("Invalid month format:", month);
          return;
        }

        // Validate month exists in options
        const monthExists = monthOptions.some(
          (option) => option.value === month
        );
        if (!monthExists) {
          console.warn("Selected month not found in options:", month);
          return;
        }

        setSelectedMonth(month);
      } catch (error) {
        console.error("Error handling month change:", error);
      }
    },
    [monthOptions]
  );

  // Set default selected month to current month or first available month
  React.useEffect(() => {
    if (monthOptions.length > 0 && !selectedMonth) {
      try {
        // Try to set current month first
        const currentDate = new Date();
        const currentMonth = `${currentDate.getFullYear()}-${String(
          currentDate.getMonth() + 1
        ).padStart(2, "0")}`;

        // Validate current month format
        const monthRegex = /^\d{4}-\d{2}$/;
        if (!monthRegex.test(currentMonth)) {
          console.warn("Invalid current month format:", currentMonth);
          // Fallback to first available month
          setSelectedMonth(monthOptions[0].value);
          return;
        }

        // Check if current month exists in options
        const currentMonthExists = monthOptions.some(
          (option) => option.value === currentMonth
        );

        if (currentMonthExists) {
          setSelectedMonth(currentMonth);
        } else {
          // Set to first available month (newest)
          if (monthOptions[0] && monthOptions[0].value) {
            setSelectedMonth(monthOptions[0].value);
          }
        }
      } catch (error) {
        console.error("Error setting default month:", error);
        // Fallback to first available month if any error occurs
        if (monthOptions[0] && monthOptions[0].value) {
          setSelectedMonth(monthOptions[0].value);
        }
      }
    }
  }, [monthOptions, selectedMonth]);

  // Get available branches from data with validation
  const availableBranches = React.useMemo(() => {
    try {
      if (!data) {
        return [];
      }

      // Validate branches array exists and is an array
      if (!data.branches || !Array.isArray(data.branches)) {
        console.warn("Invalid branches data structure:", data.branches);
        return [];
      }

      // Validate each branch structure
      const validBranches = data.branches.filter((branch) => {
        if (!branch || typeof branch !== "object") {
          console.warn("Invalid branch object:", branch);
          return false;
        }

        // Check required fields
        if (!("id" in branch) || !("name" in branch)) {
          console.warn("Branch missing required fields:", branch);
          return false;
        }

        // Validate field types
        if (typeof branch.id !== "number" || typeof branch.name !== "string") {
          console.warn("Branch has invalid field types:", branch);
          return false;
        }

        // Validate branch name is not empty
        if (!branch.name.trim()) {
          console.warn("Branch has empty name:", branch);
          return false;
        }

        return true;
      });

      return validBranches;
    } catch (error) {
      console.error("Error processing branches:", error);
      return [];
    }
  }, [data]);

  // Set default active branch to first available branch with validation
  React.useEffect(() => {
    if (availableBranches.length > 0 && !activeBranch) {
      try {
        const firstBranch = availableBranches[0];
        if (
          firstBranch &&
          firstBranch.name &&
          typeof firstBranch.name === "string"
        ) {
          setActiveBranch(firstBranch.name);
        } else {
          console.warn("First branch has invalid name:", firstBranch);
        }
      } catch (error) {
        console.error("Error setting default active branch:", error);
      }
    }
  }, [availableBranches, activeBranch]);

  // Generate chart data using utility functions - process DashboardData.tasks to create daily data points per branch
  const chartData = React.useMemo<BranchChartDataPoint[]>(() => {
    try {
      // Validate data structure
      if (!data) {
        return [];
      }

      // Validate tasks array
      if (
        !data.tasks ||
        !Array.isArray(data.tasks) ||
        data.tasks.length === 0
      ) {
        return [];
      }

      // Validate selectedMonth
      if (!selectedMonth || typeof selectedMonth !== "string") {
        return [];
      }

      // Validate selectedMonth format
      const monthRegex = /^\d{4}-\d{2}$/;
      if (!monthRegex.test(selectedMonth)) {
        console.warn("Invalid selectedMonth format:", selectedMonth);
        return [];
      }

      // Validate availableBranches
      if (
        !availableBranches ||
        !Array.isArray(availableBranches) ||
        availableBranches.length === 0
      ) {
        return [];
      }

      // Validate tasks and generate chart data with dynamic branch keys
      const validatedTasks = validateTaskData(data.tasks);

      if (validatedTasks.length === 0) {
        console.warn("No valid tasks found after validation");
        return [];
      }

      const chartDataPoints = generateChartDataPoints(
        validatedTasks,
        selectedMonth,
        availableBranches
      );

      console.log("Generated chart data points:", chartDataPoints);
      console.log("Selected month:", selectedMonth);
      console.log("Available branches for chart:", availableBranches);

      return chartDataPoints;
    } catch (error) {
      console.error("Error generating chart data:", error);
      return [];
    }
  }, [data, selectedMonth, availableBranches]);

  // Calculate branch totals for toggle buttons
  const branchTotals = React.useMemo(() => {
    try {
      // Validate inputs
      if (!chartData || !Array.isArray(chartData)) {
        return {};
      }

      if (!availableBranches || !Array.isArray(availableBranches)) {
        return {};
      }

      return calculateBranchTotals(chartData, availableBranches);
    } catch (error) {
      console.error("Error calculating branch totals:", error);
      return {};
    }
  }, [chartData, availableBranches]);

  // Generate dynamic chart configuration based on available branches
  const chartConfig = React.useMemo(() => {
    try {
      const colors = [
        "#3b82f6", // Blue
        "#10b981", // Green
        "#f59e0b", // Yellow
        "#8b5cf6", // Purple
        "#f97316", // Orange
      ];

      const config: Record<string, { label: string; color: string }> = {};

      availableBranches.forEach((branch, index) => {
        if (!branch || !branch.name) {
          console.warn("Invalid branch structure:", branch);
          return;
        }

        const baseColor = colors[index % colors.length];

        // Dynamic branch key configuration (e.g., "สาขาใหญ่_total")
        config[`${branch.name}_total`] = {
          label: branch.name,
          color: baseColor,
        };
      });

      console.log("Chart config generated:", config);
      console.log("Available branches:", availableBranches);
      console.log("Active branch:", activeBranch);

      return config;
    } catch (error) {
      console.error("Error generating chart config:", error);
      return {};
    }
  }, [availableBranches, activeBranch]);

  // Handle loading state (copied from BranchAreaChart)
  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-[400px]">
          <div>กำลังโหลดข้อมูล...</div>
        </CardContent>
      </Card>
    );
  }

  // Handle error state (copied from BranchAreaChart)
  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-[400px]">
          <div className="text-red-500">เกิดข้อผิดพลาด: {error}</div>
        </CardContent>
      </Card>
    );
  }

  // Handle empty data state when no tasks available (copied from BranchAreaChart)
  if (!data || !data.tasks || data.tasks.length === 0) {
    return (
      <Card>
        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
          <div className="grid flex-1 gap-1 text-center sm:text-left">
            <CardTitle>สถิติงานแยกตามสาขา</CardTitle>
            <CardDescription>
              แสดงจำนวนงานทั้งหมดของแต่ละสาขาในแต่ละวัน
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[400px]">
          <div className="text-gray-500">ไม่มีข้อมูลงาน</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>สถิติงานแยกตามสาขา</CardTitle>
          <CardDescription>
            แสดงจำนวนงานทั้งหมดของแต่ละสาขาในแต่ละวัน
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
            {monthOptions.length === 0 ? (
              <SelectItem value="" disabled className="rounded-lg">
                ไม่มีข้อมูลเดือน
              </SelectItem>
            ) : (
              monthOptions
                .map((option) => {
                  // Validate option structure
                  if (!option || !option.value || !option.label) {
                    console.warn("Invalid month option:", option);
                    return null;
                  }

                  return (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className="rounded-lg"
                    >
                      {option.label} ({option.taskCount || 0} รายการ)
                    </SelectItem>
                  );
                })
                .filter(Boolean)
            )}
          </SelectContent>
        </Select>
      </CardHeader>
      <div className="flex">
        {availableBranches.length === 0 ? (
          <div className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-center">
            <span className="text-muted-foreground text-xs">
              ไม่มีข้อมูลสาขา
            </span>
            <span className="text-lg leading-none font-bold sm:text-3xl">
              0
            </span>
          </div>
        ) : (
          availableBranches.map((branch) => {
            // Validate branch structure before rendering
            if (!branch || !branch.name || typeof branch.name !== "string") {
              console.warn("Invalid branch structure in render:", branch);
              return null;
            }

            return (
              <button
                key={branch.id}
                data-active={activeBranch === branch.name}
                className="data-[active=true]:bg-muted/50 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
                onClick={() => {
                  try {
                    // Validate branch name before setting
                    if (branch.name && typeof branch.name === "string") {
                      setActiveBranch(branch.name);
                    } else {
                      console.warn(
                        "Invalid branch name for selection:",
                        branch.name
                      );
                    }
                  } catch (error) {
                    console.error("Error setting active branch:", error);
                  }
                }}
              >
                <span className="text-muted-foreground text-xs">
                  {branch.name}
                </span>
                <span className="text-lg leading-none font-bold sm:text-3xl">
                  {(branchTotals[branch.name] || 0).toLocaleString()}
                </span>
              </button>
            );
          })
        )}
      </div>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {!selectedMonth ? (
          <div className="flex items-center justify-center h-[300px] sm:h-[350px]">
            <div className="text-gray-500">กรุณาเลือกเดือนเพื่อแสดงข้อมูล</div>
          </div>
        ) : chartData.length === 0 ? (
          // Add empty state for selected month with no data (copied from BranchAreaChart)
          <div className="flex items-center justify-center h-[300px] sm:h-[350px]">
            <div className="text-gray-500">ไม่มีข้อมูลในเดือนที่เลือก</div>
          </div>
        ) : !activeBranch ||
          typeof activeBranch !== "string" ||
          !activeBranch.trim() ? (
          <div className="flex items-center justify-center h-[300px] sm:h-[350px]">
            <div className="text-gray-500">กรุณาเลือกสาขาเพื่อแสดงข้อมูล</div>
          </div>
        ) : !chartConfig[`${activeBranch}_total`] ? (
          <div className="flex items-center justify-center h-[300px] sm:h-[350px]">
            <div className="text-gray-500">ไม่พบข้อมูลสำหรับสาขาที่เลือก</div>
            <div className="text-xs text-gray-400 ml-2">
              (Config: {JSON.stringify(Object.keys(chartConfig))}, Active:{" "}
              {activeBranch})
            </div>
          </div>
        ) : (
          <>
            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-[300px] sm:h-[350px] w-full"
            >
              <LineChart
                accessibilityLayer
                data={chartData}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
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
                    try {
                      if (!active || !payload || !payload.length) {
                        return null;
                      }

                      // Get the data point
                      const dataPoint = payload[0]?.payload as
                        | BranchChartDataPoint
                        | undefined;

                      if (!dataPoint) return null;

                      // Format date in Thai (similar to BranchAreaChart)
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

                      // Get task count for active branch
                      const taskCount =
                        (dataPoint[`${activeBranch}_total`] as number) || 0;
                      const branchConfig = chartConfig[`${activeBranch}_total`];

                      return (
                        <div className="rounded-lg border bg-background p-3 shadow-md">
                          <div className="mb-2 font-medium text-foreground">
                            {formattedDate}
                          </div>
                          <div className="flex items-center gap-2">
                            <div
                              className="h-3 w-3 rounded-full"
                              style={{
                                backgroundColor:
                                  branchConfig?.color || "#3b82f6",
                              }}
                            />
                            <span className="text-sm">
                              {activeBranch}:{" "}
                              <span className="font-medium">
                                {taskCount} รายการ
                              </span>
                            </span>
                          </div>
                        </div>
                      );
                    } catch (error) {
                      console.error("Error rendering tooltip:", error);
                      return null;
                    }
                  }}
                />
                <Line
                  dataKey={`${activeBranch}_total`}
                  type="monotone"
                   stroke={
                    chartConfig[`${activeBranch}_total`]?.color || "#3b82f6"
                  }
                  strokeWidth={2}
                  dot = {false}
                />
              </LineChart>
            </ChartContainer>
          </>
        )}
      </CardContent>
    </Card>
  );
}
