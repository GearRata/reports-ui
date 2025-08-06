/**
 * Yearly Branch Chart Component
 * 
 * This component displays an area chart showing problem statistics
 * for two specific branches (สำนักงานใหญ่ and สาขาสันกำแพง) over a year.
 * Features include:
 * 
 * 
 * Data Source: Dashboard API (/api/v1/dashboard/data)
 * Filters: By year from created_at field
 * Groups: By month and branch_name
 * 
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

interface YearlyBranchChartProps {
  data: DashboardData | null;
  loading?: boolean;
  error?: string | null;
}

// Define chart data point structure for yearly branch data
interface YearlyChartDataPoint {
  month: string;
  monthNumber: number;
  สำนักงานใหญ่: number;
  สาขาสันกำแพง: number;
}

// Year option interface for selector
interface YearOption {
  value: string; // YYYY format
  label: string; // "2568" format (Buddhist year)
  taskCount: number; // จำนวน tasks ในปีนั้น
}

/**
 * Format year to Buddhist year label
 * @param yearString YYYY format
 * @returns Buddhist year label
 */
const formatYearLabel = (yearString: string): string => {
  try {
    const year = parseInt(yearString);
    const buddhistYear = year + 543;
    return `พ.ศ. ${buddhistYear}`;
  } catch {
    return yearString; // fallback
  }
};

/**
 * Get Thai month name
 * @param monthNumber 1-12
 * @returns Thai month name
 */
const getThaiMonthName = (monthNumber: number): string => {
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
  return monthNames[monthNumber - 1] || `เดือน ${monthNumber}`;
};

const chartConfig = {
  สำนักงานใหญ่: {
    label: "สำนักงานใหญ่",
    color: "var(--chart-2)",
  },
  สาขาสันกำแพง: {
    label: "สาขาสันกำแพง",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function YearlyBranchChart({
  data,
  loading,
  error,
}: YearlyBranchChartProps) {
  const [selectedYear, setSelectedYear] = React.useState<string>("");

  // Memoize year change handler to prevent unnecessary re-renders
  const handleYearChange = React.useCallback((year: string) => {
    setSelectedYear(year);
  }, []);

  /**
   * Generate year options from task data
   */
  const yearOptions = React.useMemo<YearOption[]>(() => {
    if (!data?.tasks || data.tasks.length === 0) {
      return [];
    }

    // Group tasks by year
    const yearMap = new Map<string, number>();

    data.tasks.forEach((task) => {
      // Validate task structure
      if (!task || !task.created_at || typeof task.created_at !== "string") {
        console.warn("Invalid task structure:", task);
        return;
      }

      try {
        // Handle different date formats
        let dateStr: string;
        if (task.created_at.includes(" ")) {
          dateStr = task.created_at.split(" ")[0];
        } else if (task.created_at.includes("T")) {
          dateStr = task.created_at.split("T")[0];
        } else {
          dateStr = task.created_at;
        }

        // Validate date format (YYYY-MM-DD)
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(dateStr)) {
          console.warn("Invalid date format:", dateStr);
          return;
        }

        // Extract YYYY
        const yearKey = dateStr.substring(0, 4); // "2025"

        // Count tasks for this year
        yearMap.set(yearKey, (yearMap.get(yearKey) || 0) + 1);
      } catch (error) {
        console.warn("Error processing task date:", task.created_at, error);
      }
    });

    // Convert to array and sort (newest first)
    const yearArray = Array.from(yearMap.entries())
      .map(([yearKey, taskCount]) => ({
        value: yearKey,
        label: formatYearLabel(yearKey),
        taskCount,
      }))
      .sort((a, b) => b.value.localeCompare(a.value));

    return yearArray;
  }, [data]);

  // Set default selected year to current year or first available year
  React.useEffect(() => {
    if (yearOptions.length > 0 && !selectedYear) {
      // Try to set current year first
      const currentYear = new Date().getFullYear().toString();

      // Check if current year exists in options
      const currentYearExists = yearOptions.some(
        (option) => option.value === currentYear
      );

      if (currentYearExists) {
        setSelectedYear(currentYear);
      } else {
        // Set to first available year (newest)
        setSelectedYear(yearOptions[0].value);
      }
    }
  }, [yearOptions, selectedYear]);

  /**
   * Transform tasks data to yearly branch chart format
   */
  const chartData = React.useMemo<YearlyChartDataPoint[]>(() => {
    if (!data?.tasks || data.tasks.length === 0 || !selectedYear) {
      return [];
    }

    // Validate selectedYear format
    const yearRegex = /^\d{4}$/;
    if (!yearRegex.test(selectedYear)) {
      console.warn("Invalid selectedYear format:", selectedYear);
      return [];
    }

    // Filter tasks by selected year
    const yearTasks = data.tasks.filter((task) => {
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

        const taskYear = dateStr.substring(0, 4); // "2025"
        return taskYear === selectedYear;
      } catch {
        return false;
      }
    });

    if (yearTasks.length === 0) {
      return [];
    }

    // Group tasks by month and branch
    const monthMap = new Map<
      number,
      { สำนักงานใหญ่: number; สาขาสันกำแพง: number }
    >();

    // Initialize all 12 months with zero values
    for (let month = 1; month <= 12; month++) {
      monthMap.set(month, { สำนักงานใหญ่: 0, สาขาสันกำแพง: 0 });
    }

    yearTasks.forEach((task) => {
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

        // Extract month
        const monthNumber = parseInt(dateStr.substring(5, 7)); // "07" -> 7
        if (monthNumber < 1 || monthNumber > 12) {
          return;
        }

        const branchName = task.branch_name || "";
        const monthData = monthMap.get(monthNumber)!;

        // Count tasks by branch (all statuses combined)
        if (branchName === "สำนักงานใหญ่") {
          monthData.สำนักงานใหญ่++;
        } else if (branchName === "สาขาสันกำแพง") {
          monthData.สาขาสันกำแพง++;
        }
      } catch (error) {
        console.warn("Error processing task:", task, error);
      }
    });

    // Convert to chart data format
    const chartPoints: YearlyChartDataPoint[] = [];
    for (let month = 1; month <= 12; month++) {
      const monthData = monthMap.get(month)!;
      chartPoints.push({
        month: getThaiMonthName(month),
        monthNumber: month,
        สำนักงานใหญ่: monthData.สำนักงานใหญ่,
        สาขาสันกำแพง: monthData.สาขาสันกำแพง,
      });
    }

    return chartPoints;
  }, [data, selectedYear]);

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
            <CardTitle>สถิติปัญหาระบบรายปีแยกตามสาขา</CardTitle>
            <CardDescription>
              แสดงจำนวนปัญหาทั้งหมดของแต่ละสาขาในแต่ละเดือน
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
          <CardTitle>สถิติปัญหาระบบรายปีแยกตามสาขา</CardTitle>
          <CardDescription>
            แสดงจำนวนปัญหาทั้งหมดของแต่ละสาขาในแต่ละเดือน
          </CardDescription>
        </div>
        <Select value={selectedYear} onValueChange={handleYearChange}>
          <SelectTrigger
            className="w-[160px] sm:w-[200px] rounded-lg sm:ml-auto"
            aria-label="เลือกปี"
          >
            <SelectValue placeholder="เลือกปี" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {yearOptions.map((option) => (
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
        {!selectedYear ? (
          <div className="flex items-center justify-center h-[350px]">
            <div className="text-gray-500">กรุณาเลือกปีเพื่อแสดงข้อมูล</div>
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex items-center justify-center h-[350px]">
            <div className="text-gray-500">ไม่มีข้อมูลในปีที่เลือก</div>
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[300px] sm:h-[350px] w-full"
          >
            <AreaChart data={chartData}>
              <defs>
                <linearGradient
                  id="fillสำนักงานใหญ่"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="var(--color-สำนักงานใหญ่)"
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-สำนักงานใหญ่)"
                    stopOpacity={0.05}
                  />
                </linearGradient>
                <linearGradient
                  id="fillสาขาสันกำแพง"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="var(--color-สาขาสันกำแพง)"
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-สาขาสันกำแพง)"
                    stopOpacity={0.05}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                angle={-45}
                textAnchor="end"
                interval="preserveStartEnd" // แสดงตัวแรกและสุดท้าย
                tickFormatter={(value) => value.substring(0, 3)} // แสดงแค่ 3 ตัวอักษรแรก
              />
              <ChartTooltip
                cursor={false}
                content={({ active, payload, label }) => {
                  if (!active || !payload || !payload.length) {
                    return null;
                  }

                  // Get the data point
                  const dataPoint = payload[0]?.payload as
                    | YearlyChartDataPoint
                    | undefined;

                  if (!dataPoint) return null;

                  const สำนักงานใหญ่Count = dataPoint.สำนักงานใหญ่ || 0;
                  const สาขาสันกำแพงCount = dataPoint.สาขาสันกำแพง || 0;
                  const total = สำนักงานใหญ่Count + สาขาสันกำแพงCount;

                  return (
                    <div className="rounded-lg border bg-background p-3 shadow-md">
                      <div className="mb-2 font-medium text-foreground">
                        {label} {formatYearLabel(selectedYear)}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: "hsl(var(--chart-2))" }}
                          />
                          <span className="text-sm">
                            สำนักงานใหญ่:{" "}
                            <span className="font-medium">
                              {สำนักงานใหญ่Count} รายการ
                            </span>
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: "hsl(var(--chart-1))" }}
                          />
                          <span className="text-sm">
                            สาขาสันกำแพง:{" "}
                            <span className="font-medium">
                              {สาขาสันกำแพงCount} รายการ
                            </span>
                          </span>
                        </div>
                        <div className="mt-2 pt-2 border-t text-xs text-muted-foreground">
                          รวมทั้งหมด: {total} รายการ
                        </div>
                      </div>
                    </div>
                  );
                }}
              />

              <Area
                dataKey="สำนักงานใหญ่"
                type="monotone"
                fill="url(#fillสำนักงานใหญ่)"
                stroke="var(--color-สำนักงานใหญ่)"
                strokeWidth={2}
                fillOpacity={0.3}
                connectNulls={false}  // ไม่เชื่อมจุดที่เป็น null/0

              />
              <Area
                dataKey="สาขาสันกำแพง"
                type="natural"
                fill="url(#fillสาขาสันกำแพง)"
                stroke="var(--color-สาขาสันกำแพง)"
                strokeWidth={2}
                fillOpacity={0.3}
                connectNulls={false}  // ไม่เชื่อมจุดที่เป็น null/0

              />

              <ChartLegend
                content={<ChartLegendContent />}
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
