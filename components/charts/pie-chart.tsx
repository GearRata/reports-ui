/**
 * Pie Chart Component for Program Statistics
 * 
 * This component displays a pie chart showing problem statistics by program
 * within a selected department. Features include:
 * 
 * - Department dropdown selector to filter data
 * - Pie chart with percentage labels on segments
 * - Interactive tooltip showing detailed information
 * - Legend showing all programs with colors and statistics
 * - Responsive layout for different screen sizes
 * - Thai language support throughout
 * 
 * Data Source: Dashboard API (/api/v1/dashboard/data)
 * Filters: By department_id
 * Groups: By system_name (program)
 * 
 * @author Kiro AI Assistant
 * @created 2025-01-24
 */

"use client";

import * as React from "react";
import { Pie, PieChart, Cell, ResponsiveContainer } from "recharts";

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

interface PieChartSummaryProps {
  data: DashboardData | null;
  loading?: boolean;
  error?: string | null;
}

// Define pie chart data structure
interface PieChartDataPoint {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

// Department option interface
interface DepartmentOption {
  value: string;
  label: string;
  id: number;
}

// Colors for pie chart segments
const COLORS = [
  "#3b82f6", // Blue
  "#10b981", // Green
  "#f59e0b", // Yellow
  "#8b5cf6", // Purple
  "#ef4444", // Red
  "#06b6d4", // Cyan
  "#84cc16", // Lime
  "#f97316", // Orange
  "#ec4899", // Pink
  "#6366f1", // Indigo
];

const chartConfig = {
  value: {
    label: "จำนวนปัญหา",
  },
} satisfies ChartConfig;

export function PieChartSummary({
  data,
  loading,
  error,
}: PieChartSummaryProps) {
  const [selectedDepartment, setSelectedDepartment] =
    React.useState<string>("");

  /**
   * Generate department options from data
   */
  const departmentOptions = React.useMemo<DepartmentOption[]>(() => {
    if (!data?.departments || data.departments.length === 0) {
      return [];
    }

    return data.departments.map((dept) => ({
      value: dept.id.toString(),
      label: dept.name,
      id: dept.id,
    }));
  }, [data]);

  // Set default selected department
  React.useEffect(() => {
    if (departmentOptions.length > 0 && !selectedDepartment) {
      setSelectedDepartment(departmentOptions[0].value);
    }
  }, [departmentOptions, selectedDepartment]);

  /**
   * Transform tasks data to pie chart format
   * Groups by program and counts problems for selected department
   */
  const pieChartData = React.useMemo<PieChartDataPoint[]>(() => {
    if (!data?.tasks || data.tasks.length === 0 || !selectedDepartment) {
      return [];
    }
    console.log(data.tasks)
    

    const departmentId = parseInt(selectedDepartment);

    // Filter tasks by selected department
    const departmentTasks = data.tasks.filter(
      (task) => task.department_id === departmentId
    );

    if (departmentTasks.length === 0) {
      return [];
    }

    // Group tasks by program/system
    const programMap = new Map<string, number>();

    departmentTasks.forEach((task) => {
      const programName = task.system_name || "ไม่ระบุโปรแกรม";
      programMap.set(programName, (programMap.get(programName) || 0) + 1);
    });

    // Calculate total for percentage
    const total = departmentTasks.length;

    // Convert to pie chart format and sort by value (descending)
    const chartData = Array.from(programMap.entries())
      .map(([programName, count], index) => ({
        name: programName,
        value: count,
        percentage: Math.round((count / total) * 100),
        color: COLORS[index % COLORS.length],
      }))
      .sort((a, b) => b.value - a.value);

    return chartData;
  }, [data, selectedDepartment]);

  // Get selected department name for display
  const selectedDepartmentName = React.useMemo(() => {
    const dept = departmentOptions.find((d) => d.value === selectedDepartment);
    return dept?.label || "";
  }, [departmentOptions, selectedDepartment]);

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
            <CardTitle>สถิติปัญหาตามโปรแกรม</CardTitle>
            <CardDescription>
              แสดงเปอร์เซ็นต์ปัญหาของแต่ละโปรแกรมในแผนก
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
          <CardTitle>สถิติปัญหาตามโปรแกรม</CardTitle>
          <CardDescription>
            แสดงเปอร์เซ็นต์ปัญหาของแต่ละโปรแกรมในแผนก
            {selectedDepartmentName && ` ${selectedDepartmentName}`}
          </CardDescription>
        </div>
        <Select
          value={selectedDepartment}
          onValueChange={setSelectedDepartment}
        >
          <SelectTrigger
            className="w-[160px] sm:w-[200px] rounded-lg sm:ml-auto"
            aria-label="เลือกแผนก"
          >
            <SelectValue placeholder="เลือกแผนก" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {departmentOptions.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="rounded-lg"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {!selectedDepartment ? (
          <div className="flex items-center justify-center h-[400px]">
            <div className="text-gray-500">กรุณาเลือกแผนกเพื่อแสดงข้อมูล</div>
          </div>
        ) : pieChartData.length === 0 ? (
          <div className="flex items-center justify-center h-[400px]">
            <div className="text-gray-500">ไม่มีข้อมูลในแผนกที่เลือก</div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Pie Chart */}
            <div className="flex-1">
              <ChartContainer
                config={chartConfig}
                className="mx-auto aspect-square max-h-[400px]"
              >
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    label={({
                      cx,
                      cy,
                      midAngle,
                      innerRadius,
                      outerRadius,
                      percentage,
                    }) => {
                      // Only show percentage if it's >= 3% to avoid clutter
                      if (percentage < 3) return null;
                      
                      // Check for undefined values
                      if (
                        cx === undefined ||
                        cy === undefined ||
                        midAngle === undefined ||
                        innerRadius === undefined ||
                        outerRadius === undefined
                      ) {
                        return null;
                      }

                      const RADIAN = Math.PI / 180;
                      const radius =
                        innerRadius + (outerRadius - innerRadius) * 0.5;
                      const x = cx + radius * Math.cos(-midAngle * RADIAN);
                      const y = cy + radius * Math.sin(-midAngle * RADIAN);

                      return (
                        <text
                          x={x}
                          y={y}
                          fill="white"
                          textAnchor={x > cx ? "start" : "end"}
                          dominantBaseline="central"
                          fontSize="12"
                          fontWeight="bold"
                          style={{
                            textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
                            filter: "drop-shadow(1px 1px 2px rgba(0,0,0,0.8))",
                          }}
                        >
                          {`${percentage}%`}
                        </text>
                      );
                    }}
                    labelLine={false}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip
                    cursor={false}
                    content={({ active, payload }) => {
                      if (!active || !payload || !payload.length) {
                        return null;
                      }

                      const data = payload[0]?.payload as PieChartDataPoint;
                      if (!data) return null;

                      return (
                        <div className="rounded-lg border bg-background p-3 shadow-md">
                          <div className="font-medium text-foreground mb-1">
                            {data.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            จำนวนปัญหา:{" "}
                            <span className="font-medium">
                              {data.value} รายการ
                            </span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            เปอร์เซ็นต์:{" "}
                            <span className="font-medium">
                              {data.percentage}%
                            </span>
                          </div>
                        </div>
                      );
                    }}
                  />
                </PieChart>
              </ChartContainer>
            </div>

            {/* Legend/Labels */}
            <div className="flex-shrink-0 lg:w-64">
              <div className="space-y-3">
                <h3 className="font-medium text-sm text-muted-foreground mb-3">
                  รายการโปรแกรม
                </h3>
                {pieChartData.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-sm flex-shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">
                        {item.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {item.value} รายการ ({item.percentage}%)
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
