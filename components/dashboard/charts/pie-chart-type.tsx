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
      "#EC4899", // สีชมพู
      "#154D71",
      "#FFE100",
      "#0046FF",
      "#CC66DA",
      "#8B5CF6", // สีม่วง
      "#E4004B",
      "#84CC16", // สีเขียวอ่อน
      "#08CB00",
      "#06B6D4", // สีฟ้า
      "#3B82F6", // สีน้ำเงิน
      "#10B981", // สีเขียว
      "#F59E0B", // สีเหลือง
      "#E43636", // สีแดง
      "#1A2A80",
      "#F97316", // สีส้ม
      "#B4E50D",
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

    const result = Object.entries(groupedData)
      .map(([system_type, total_problems], index) => ({
        system_type,
        total_problems,
        fill: typeColors[index % typeColors.length],
      }))
      .sort((a, b) => b.total_problems - a.total_problems); // เรียงจากมากไปน้อย

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
                        `ประเภท ${name}: `,
                        `${value} รายการ`,
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
                  outerRadius={80}
                  label={({ system_type, total_problems, percent }) =>
                    `${system_type}: ${total_problems} (${(
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