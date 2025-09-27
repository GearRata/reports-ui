"use client";

import React from "react";
import { Pie, PieChart, Cell, ResponsiveContainer, Legend } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { format } from "date-fns";
import { th } from "date-fns/locale";

interface PieChartDepartmentProps {
  filteredTasks: Array<{
    department_name: string;
    [key: string]: unknown;
  }>;
  selectedDate?: Date;
  selectedBranch: string;
  loading?: boolean;
  error?: string | null;
}

export const ChartPieDepartment = React.memo(function ChartPieDepartment({
  filteredTasks,
  selectedDate,
  selectedBranch,
  loading,
  error,
}: PieChartDepartmentProps) {
  // Department colors
  const departmentColors = React.useMemo(
    () => [
      "#3B82F6", // Blue
      "#EF4444", // Red
      "#10B981", // Green
      "#F59E0B", // Amber
      "#8B5CF6", // Purple
      "#EC4899", // Pink
      "#06B6D4", // Cyan
      "#84CC16", // Lime
      "#F97316", // Orange
      "#6366F1", // Indigo
      "#FF884D",
      "#FF3864",
      "#52B788",
      "#1D70A2"
    ],
    []
  );

  // Transform filtered data for pie chart
  const chartData = React.useMemo(() => {
    const groupedData: { [key: string]: number } = {};

    filteredTasks.forEach((task) => {
      const departmentName = task.department_name || "ไม่ระบุแผนก";
      groupedData[departmentName] = (groupedData[departmentName] || 0) + 1;
    });

    const result = Object.entries(groupedData)
      .map(([department_name, total_problems], index) => ({
        department_name,
        total_problems,
        fill: departmentColors[index % departmentColors.length],
      }))
      .sort((a, b) => b.total_problems - a.total_problems); // เรียงจากมากไปน้อย

    return result;
  }, [filteredTasks, departmentColors]);

  // Display text for selected date
  const selectedDateDisplay = React.useMemo(() => {
    return selectedDate
      ? format(selectedDate, "d MMMM yyyy", { locale: th })
      : "ทุกวันที่";
  }, [selectedDate]);

  // Chart config for tooltip
  const chartConfig = React.useMemo(() => {
    const config: Record<string, { label: string; color: string }> = {};
    chartData.forEach((item) => {
      config[item.department_name] = {
        label: item.department_name,
        color: item.fill,
      };
    });
    return config;
  }, [chartData]);

  // Handle loading state
  if (loading) {
    return (
      <Card className="flex flex-col">
        <CardContent className="flex items-center justify-center h-96">
          <div className="text-center">กำลังโหลดข้อมูล...</div>
        </CardContent>
      </Card>
    );
  }

  // Handle error state
  if (error) {
    return (
      <Card className="flex flex-col">
        <CardContent className="p-6">
          <div className="p-4 border border-red-200 bg-red-50 rounded-md">
            <p className="text-red-800">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>สถิติปัญหาตามแผนก</CardTitle>
        <CardDescription>
          ข้อมูลสำหรับวันที่ {selectedDateDisplay} -{" "}
          {selectedBranch === "all" ? "ทุกสาขา" : selectedBranch} (จำนวน{" "}
          {chartData.reduce((sum, item) => sum + item.total_problems, 0)}{" "}
          รายการ)
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {chartData.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-md">
              <p className="text-yellow-800">
                {selectedDate
                  ? `ไม่มีข้อมูลสำหรับวันที่ ${selectedDateDisplay}`
                  : "ไม่มีข้อมูลสำหรับแสดงผล"}
              </p>
            </div>
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[400px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value, name) => [
                        `แผนก ${name}: `,
                        `${value} รายการ`,
                      ]}
                    />
                  }
                />
                <Pie
                  data={chartData}
                  dataKey="total_problems"
                  nameKey="department_name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ department_name, total_problems, percent }) =>
                    `${department_name}: ${total_problems} (${(
                      (percent || 0) * 100
                    ).toFixed(1)}%)`
                  }
                  labelLine={true}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value, entry) => {
                    const payload = entry?.payload as { total_problems: number } | undefined;
                    return `${value} (${payload?.total_problems || 0})`;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
});
