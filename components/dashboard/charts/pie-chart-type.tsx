"use client";

import React from "react";
import { Pie, PieChart, Cell, ResponsiveContainer } from "recharts";
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

interface PieChartTypeProps {
  filteredTasks: Array<{
    system_type: string;
    [key: string]: unknown;
  }>;
  selectedDate?: Date;
  selectedBranch: string;
  loading?: boolean;
  error?: string | null;
}

export const ChartPieType = React.memo(function ChartPieType({
  filteredTasks,
  selectedDate,
  selectedBranch,
  loading,
  error,
}: PieChartTypeProps) {
  // Type colors
  const typeColors = React.useMemo(
    () => [
      "#F44336", // Blue
      "#2196F3", // Red
      "#84CC16", // Green
   
    ],
    []
  );

  // Transform filtered data for pie chart
  const chartData = React.useMemo(() => {
    const groupedData: { [key: string]: number } = {};

    filteredTasks.forEach((task) => {
      const typeName = task.system_type || "ไม่ระบุประเภท";
      groupedData[typeName] = (groupedData[typeName] || 0) + 1;
    });

    const sortedEntries = Object.entries(groupedData).sort(
      ([, a], [, b]) => b - a
    ); // เรียงจากมากไปน้อย

    // แสดงเฉพาะ Top 10 และรวมที่เหลือเป็น "อื่นๆ"
    const topEntries = sortedEntries.slice(0, 10);
    const otherEntries = sortedEntries.slice(10);

    const result = topEntries.map(([system_type, total_problems], index) => ({
      system_type,
      total_problems,
      fill: typeColors[index % typeColors.length],
    }));

    // เพิ่ม "อื่นๆ" ถ้ามีข้อมูลเหลือ
    if (otherEntries.length > 0) {
      const otherTotal = otherEntries.reduce(
        (sum, [, count]) => sum + count,
        0
      );
      result.push({
        system_type: `อื่นๆ (${otherEntries.length} ประเภท)`,
        total_problems: otherTotal,
        fill: "#94A3B8", // สีเทา
      });
    }

    return result;
  }, [filteredTasks, typeColors]);

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
      config[item.system_type] = {
        label: item.system_type,
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
        <CardTitle>สถิติปัญหาตามประเภท</CardTitle>
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
          <div className="space-y-4">
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square max-h-[500px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value, name) => [
                          `${value} รายการ`,
                          `ประเภท: ${name}`,
                        ]}
                      />
                    }
                  />
                  <Pie
                    data={chartData}
                    dataKey="total_problems"
                    nameKey="system_type"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    innerRadius={40}
                    paddingAngle={2}
                    label={({ percent }) =>
                      percent ? `${(percent * 100).toFixed(1)}%` : ""
                    }
                    labelLine={false}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>

            {/* Custom Legend with better layout */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 text-sm">
              {chartData.map((entry, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-2 rounded-md bg-muted/50"
                >
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: entry.fill }}
                  />
                  <div className="min-w-0 flex-1">
                    <div
                      className="font-medium truncate"
                      title={entry.system_type}
                    >
                      {entry.system_type}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {entry.total_problems} รายการ
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
});