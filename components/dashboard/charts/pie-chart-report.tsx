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

interface PieChartReportProps {
  filteredTasks: Array<{
    reported_by: string;
    [key: string]: unknown;
  }>;
  selectedDate?: Date;
  selectedBranch: string;
  loading?: boolean;
  error?: string | null;
}

export const ChartPieReport = React.memo(function ChartPieReport({
  filteredTasks,
  selectedDate,
  selectedBranch,
  loading,
  error,
}: PieChartReportProps) {
  // Reporter colors
  const reporterColors = React.useMemo(
    () => [
      "#3B82F6", // สีน้ำเงิน
      "#10B981", // สีเขียว
      "#F59E0B", // สีเหลือง
      "#EF4444", // สีแดง
      "#8B5CF6", // สีม่วง
      "#F97316", // สีส้ม
      "#06B6D4", // สีฟ้า
      "#84CC16", // สีเขียวอ่อน
      "#EC4899", // สีชมพู
      "#6B7280", // สีเทา
    ],
    []
  );

  // Transform filtered data for pie chart
  const chartData = React.useMemo(() => {
    const groupedData: { [key: string]: number } = {};

    filteredTasks.forEach((task) => {
      const reporterName = task.reported_by?.trim() || "ไม่ระบุชื่อผู้แจ้ง";
      groupedData[reporterName] = (groupedData[reporterName] || 0) + 1;
    });

    const result = Object.entries(groupedData)
      .map(([reported_by, total_problems], index) => ({
        reported_by,
        total_problems,
        fill: reporterColors[index % reporterColors.length],
      }))
      .sort((a, b) => b.total_problems - a.total_problems); // เรียงจากมากไปน้อย

    return result;
  }, [filteredTasks, reporterColors]);

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
      config[item.reported_by] = {
        label: item.reported_by,
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
        <CardTitle>สถิติปัญหาตามผู้แจ้ง</CardTitle>
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
                        `ผู้แจ้ง ${name}: `,
                        `${value} รายการ`,
                      ]}
                    />
                  }
                />
                <Pie
                  data={chartData}
                  dataKey="total_problems"
                  nameKey="reported_by"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ reported_by, total_problems, percent }) =>
                    `${reported_by}: ${total_problems} (${(
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