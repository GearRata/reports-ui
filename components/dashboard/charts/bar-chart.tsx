"use client";

import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
  Cell,
  ResponsiveContainer,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import { th } from "date-fns/locale";

interface BarChartProps {
  filteredTasks: Array<{
    branch_name: string;
    [key: string]: unknown;
  }>;
  selectedDate?: Date;
  selectedBranch: string;
  loading?: boolean;
  error?: string | null;
}

export const BarChartComponents = React.memo(function BarChartSimple({
  filteredTasks,
  selectedDate,
  selectedBranch,
  loading,
  error,
}: BarChartProps) {
  // Memoize branch colors
  const branchColors = React.useMemo(
    () =>
      ({
        สำนักงานใหญ่: "#3B82F6", // สีน้ำเงิน
        สาขาสันกำแพง: "#10B981", // สีเขียว
        ไม่ระบุสาขา: "#6B7280", // สีเทา
      } as Record<string, string>),
    []
  );

  // Transform filtered data for chart
  const chartData = React.useMemo(() => {
    const groupedData: { [key: string]: number } = {};

    filteredTasks.forEach((task) => {
      const branchName = task.branch_name || "ไม่ระบุสาขา";
      groupedData[branchName] = (groupedData[branchName] || 0) + 1;
    });

    const result = Object.entries(groupedData).map(
      ([branch_name, total_problems]) => ({
        branch_name,
        total_problems,
        fill: branchColors[branch_name] || "#F59E0B",
      })
    );

    return result;
  }, [filteredTasks, branchColors]);

  // Chart config for ChartContainer
  const chartConfig = React.useMemo(() => {
    const config: ChartConfig = {};
    chartData.forEach((item) => {
      config[item.branch_name] = {
        label: item.branch_name,
        color: item.fill,
      };
    });
    return config;
  }, [chartData]);

  // Display text for selected date
  const selectedDateDisplay = React.useMemo(() => {
    return selectedDate
      ? format(selectedDate, "d MMMM yyyy", { locale: th })
      : "ทุกวันที่";
  }, [selectedDate]);

  // Handle loading state
  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-96">
          <div className="text-center">กำลังโหลดข้อมูล...</div>
        </CardContent>
      </Card>
    );
  }

  // Handle error state
  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="p-4 border border-red-200 bg-red-50 rounded-md">
            <p className="text-red-800">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>สถิติปัญหาตามสาขา</CardTitle>
        <CardDescription>
          ข้อมูลสำหรับวันที่ {selectedDateDisplay} -{" "}
          {selectedBranch === "all" ? "ทุกสาขา" : selectedBranch} (จำนวน{" "}
          {chartData.reduce((sum, item) => sum + item.total_problems, 0)}{" "}
          รายการ)
        </CardDescription>
      </CardHeader>
      <CardContent>
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
          <div className="w-full h-[15rem]">
            <ResponsiveContainer width="100%" height="100%">
              <ChartContainer config={chartConfig}>
                <BarChart
                  data={chartData}
                  layout="vertical"
                  margin={{
                    top: 20,
                    right: 30,
                    left: 0,
                    bottom: 5,
                  }}
                  barCategoryGap="20%"
                >
                  <CartesianGrid strokeOpacity={0.08} />
                  <XAxis
                    type="number"
                    tickFormatter={(value) => Math.floor(value).toString()}
                    domain={[0, (dataMax: number) => Math.max(dataMax + 2, 5)]}
                    allowDecimals={false}
                    interval={0}
                  />
                  <YAxis
                    dataKey="branch_name"
                    type="category"
                    width={100}
                    tick={{ fontSize: 14, fill: "#fff" }}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        labelFormatter={(label) => `สาขา: ${label}`}
                        formatter={(...args: unknown[]) => {
                          const [value] = args;
                          return [
                            `${value} รายการ` as React.ReactNode,
                            "จำนวนปัญหา" as React.ReactNode,
                          ];
                        }}
                      />
                    }
                  />
                  <Bar
                    dataKey="total_problems"
                    radius={[0, 4, 4, 0]}
                    maxBarSize={50}
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.fill}
                        stroke={entry.fill}
                        strokeWidth={1}
                      />
                    ))}
                    <LabelList
                      dataKey="total_problems"
                      position="right"
                      offset={8}
                      style={{
                        fill: "#374151",
                        fontSize: "12px",
                      }}
                    />
                  </Bar>
                </BarChart>
              </ChartContainer>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
});
