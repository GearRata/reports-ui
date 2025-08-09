"use client";

import { TrendingUp, CalendarIcon } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { th } from "date-fns/locale";

import { DashboardData } from "@/types/entities";
import { Calendar } from "@/components/ui/calendar";
import React from "react";

interface BarChartProps {
  data: DashboardData | null;
  loading?: boolean;
  error?: string | null;
}

interface ChartDataPoint {
  month: string;
  branch_name: string;
  total_problems: number;
}

export function ChartBar({ data, error, loading }: BarChartProps) {
  // All hooks must be called at the top level, before any early returns
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    new Date()
  );

  // Filter data by selected date (month/year) - moved before early returns
  const filteredTasks = React.useMemo(() => {
    if (!data?.tasks || !selectedDate) return data?.tasks || [];

    const selectedMonth = selectedDate.getMonth() + 1; // getMonth() returns 0-11
    const selectedYear = selectedDate.getFullYear();

    return data.tasks.filter((task) => {
      const taskDate = new Date(task.created_at);
      return (
        taskDate.getMonth() + 1 === selectedMonth &&
        taskDate.getFullYear() === selectedYear
      );
    });
  }, [data?.tasks, selectedDate]);

  // Transform filtered data for chart - moved before early returns
  const chartData = React.useMemo(() => {
    const groupedData: { [key: string]: number } = {};

    filteredTasks.forEach((task) => {
      const branchName = task.branch_name || "ไม่ระบุสาขา";
      groupedData[branchName] = (groupedData[branchName] || 0) + 1;
    });

    return Object.entries(groupedData).map(([branch_name, total_problems]) => ({
      branch_name,
      total_problems,
    }));
  }, [filteredTasks]);

  // Create chart config dynamically - moved before early returns
  const chartConfig = React.useMemo(() => {
    const config: ChartConfig = {
      total_problems: {
        label: "จำนวนปัญหา",
        color: "hsl(var(--chart-1))",
      },
    };
    return config;
  }, []);

  const selectedMonthYear = selectedDate
    ? format(selectedDate, "MMMM yyyy", { locale: th })
    : "เลือกเดือน";

  // Handle loading state - moved after all hooks
  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-96">
          <div className="text-center">กำลังโหลดข้อมูล...</div>
        </CardContent>
      </Card>
    );
  }

  // Handle error state - moved after all hooks
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

  // Handle no data - moved after all hooks
  if (!data || !data.success || !data.tasks || data.tasks.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="p-4 border border-blue-200 bg-blue-50 rounded-md">
            <p className="text-blue-800">ไม่มีข้อมูลสำหรับแสดงกราฟ</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Calendar Filter */}
      <div className="flex items-center gap-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[280px] justify-start text-left font-normal",
                !selectedDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? (
                format(selectedDate, "PPP", { locale: th })
              ) : (
                <span>เลือกวันที่</span>
              )}
            </Button>
          </DialogTrigger>
          <DialogContent className="w-auto p-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              
              initialFocus
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>สถิติปัญหาตามสาขา</CardTitle>
          <CardDescription>
            ข้อมูลสำหรับ {selectedMonthYear} (จำนวน {filteredTasks.length}{" "}
            รายการ)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {chartData.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-md">
                <p className="text-yellow-800">
                  ไม่มีข้อมูลสำหรับเดือนที่เลือก
                </p>
              </div>
            </div>
          ) : (
            <ChartContainer config={chartConfig}>
              <BarChart
                accessibilityLayer
                data={chartData}
                layout="vertical"
                margin={{
                  right: 16,
                }}
              >
                <CartesianGrid horizontal={false} />
                <YAxis
                  dataKey="branch_name"
                  type="category"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  width={120}
                />
                <XAxis dataKey="total_problems" type="number" />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <Bar
                  dataKey="total_problems"
                  fill="var(--color-total_problems)"
                  radius={4}
                >
                  <LabelList
                    dataKey="total_problems"
                    position="right"
                    offset={8}
                    className="fill-foreground"
                    fontSize={12}
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
          )}
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 leading-none font-medium">
            แสดงข้อมูลปัญหาทั้งหมด <TrendingUp className="h-4 w-4" />
          </div>
          <div className="text-muted-foreground leading-none">
            กรองข้อมูลตามวันที่ที่เลือก
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
