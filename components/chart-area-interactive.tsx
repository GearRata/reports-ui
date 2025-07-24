/**
 * Interactive Area Chart Component (Original Chart)
 * 
 * This is the original chart component that displays task statistics
 * with time range filtering. Features include:
 * 
 * - Time range selector (7, 30, 90 days)
 * - Area chart with pending and solved task lines
 * - Daily data aggregation across all branches
 * - Interactive tooltip with detailed information
 * - Thai language labels and formatting
 * - Responsive design with proper error handling
 * 
 * Data Source: Dashboard API (/api/v1/dashboard/data)
 * Filters: By time range from current date
 * Groups: By date, aggregates all branches
 * 
 * @author Kiro AI Assistant
 * @created 2025-01-24 (Enhanced from existing)
 */

"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
} from '@/components/ui/chart'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { DashboardData } from "@/types/entities"

interface ChartAreaInteractiveProps {
  data: DashboardData | null;
  loading?: boolean;
  error?: string | null;
}

// Define chart data point structure for better type safety
interface ChartDataPoint {
  date: string;
  pending: number;
  solved: number;
  desktop: number;  // Keep for compatibility with existing chart config
  mobile: number;   // Keep for compatibility with existing chart config
  branchCount: number;
  branches: string;
}

const chartConfig = {
  pending: {
    label: "รอดำเนินการ",
    color: "hsl(var(--chart-1))",
  },
  solved: {
    label: "แก้ไขแล้ว",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function ChartAreaInteractive({ data, loading, error }: ChartAreaInteractiveProps) {
  const [timeRange, setTimeRange] = React.useState("90d")

  /**
   * Transform dashboard data to chart format
   * 
   * This function:
   * 1. Groups tasks by date (created_at field)
   * 2. Counts pending (status = 0) and solved (status = 1) tasks for each date
   * 3. Tracks which branches have tasks on each date
   * 4. Sorts data by date in ascending order
   */
  const transformedData = React.useMemo<ChartDataPoint[]>(() => {
    if (!data?.tasks || data.tasks.length === 0) {
      return []
    }
    
    // Group tasks by date and aggregate across all branches
    const tasksByDate = data.tasks.reduce((acc: Record<string, { 
      pending: number; 
      solved: number; 
      branches: Set<string>;
      branchesData: Record<string, { pending: number; solved: number }>;
    }>, task) => {
      // Handle different date formats (YYYY-MM-DD HH:MM:SS or ISO format)
      let dateStr: string
      try {
        if (task.created_at.includes(' ')) {
          // Format: "2025-07-22 04:49:39"
          dateStr = task.created_at.split(' ')[0]
        } else if (task.created_at.includes('T')) {
          // ISO format: "2025-07-22T04:49:39Z"
          dateStr = task.created_at.split('T')[0]
        } else {
          // Fallback: assume it's already in YYYY-MM-DD format
          dateStr = task.created_at
        }
      } catch {
        console.warn('Invalid date format:', task.created_at)
        return acc
      }
      
      // Initialize data structure for this date if it doesn't exist
      if (!acc[dateStr]) {
        acc[dateStr] = { 
          pending: 0, 
          solved: 0, 
          branches: new Set(),
          branchesData: {}
        }
      }
      
      // Count tasks by status
      if (task.status === 0) {
        acc[dateStr].pending++
      } else if (task.status === 1) {
        acc[dateStr].solved++
      }
      
      // Track which branches have tasks on this date
      if (task.branch_name) {
        // Add branch to set
        acc[dateStr].branches.add(task.branch_name)
        
        // Initialize branch data if needed
        if (!acc[dateStr].branchesData[task.branch_name]) {
          acc[dateStr].branchesData[task.branch_name] = { pending: 0, solved: 0 }
        }
        
        // Count by branch and status
        if (task.status === 0) {
          acc[dateStr].branchesData[task.branch_name].pending++
        } else if (task.status === 1) {
          acc[dateStr].branchesData[task.branch_name].solved++
        }
      }
      
      return acc
    }, {})

    // Convert to chart format and sort by date
    const chartData = Object.entries(tasksByDate)
      .map(([date, counts]) => {
        // Create branch details for tooltip
        const branchDetails = Object.entries(counts.branchesData)
          .map(([branch, stats]) => `${branch} (รอ: ${stats.pending}, แก้ไข: ${stats.solved})`)
          .join(', ')
          
        return {
          date,
          pending: counts.pending,
          solved: counts.solved,
          desktop: counts.pending,  // Keep for compatibility with existing chart config
          mobile: counts.solved,    // Keep for compatibility with existing chart config
          branchCount: counts.branches.size,
          branches: branchDetails || Array.from(counts.branches).join(', ')
        }
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    return chartData
  }, [data])

  /**
   * Filter chart data based on selected time range
   * 
   * This function:
   * 1. Filters data points based on the selected time range (7d, 30d, 90d)
   * 2. Uses current date as reference point
   * 3. Handles different date formats safely
   */
  const filteredData = React.useMemo<ChartDataPoint[]>(() => {
    if (transformedData.length === 0) return []
    
    // Get current date for reference
    const currentDate = new Date()
    currentDate.setHours(23, 59, 59, 999) // End of day
    
    // Determine days to subtract based on selected range
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    
    // Calculate start date
    const startDate = new Date(currentDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    startDate.setHours(0, 0, 0, 0) // Start of day
    
    // Filter data points within the selected range
    return transformedData.filter((item) => {
      try {
        // Parse date safely
        const itemDate = new Date(item.date)
        
        // Ensure valid date
        if (isNaN(itemDate.getTime())) {
          console.warn('Invalid date:', item.date)
          return false
        }
        
        // Set to start of day for consistent comparison
        itemDate.setHours(0, 0, 0, 0)
        
        // Include if within range
        return itemDate >= startDate && itemDate <= currentDate
      } catch {
        console.warn('Error filtering date:', item.date)
        return false
      }
    })
  }, [transformedData, timeRange])

  // Handle loading state
  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-[300px]">
          <div>กำลังโหลดข้อมูล...</div>
        </CardContent>
      </Card>
    )
  }

  // Handle error state
  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-[300px]">
          <div className="text-red-500">เกิดข้อผิดพลาด: {error}</div>
        </CardContent>
      </Card>
    )
  }

  // Handle empty data state
  if (!data || !data.tasks || data.tasks.length === 0) {
    return (
      <Card>
        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
          <div className="grid flex-1 gap-1 text-center sm:text-left">
            <CardTitle>สถิติปัญหาระบบตามสาขา</CardTitle>
            <CardDescription>
              แสดงจำนวนปัญหาที่รอดำเนินการและแก้ไขแล้วในแต่ละวัน
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <div className="text-gray-500">ไม่มีข้อมูลปัญหาระบบ</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>สถิติปัญหาระบบตามสาขา</CardTitle>
          <CardDescription>
            แสดงจำนวนปัญหาที่รอดำเนินการและแก้ไขแล้วในแต่ละวัน
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select a value"
          >
            <SelectValue placeholder="90 วันที่ผ่านมา" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              90 วันที่ผ่านมา
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              30 วันที่ผ่านมา
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              7 วันที่ผ่านมา
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {filteredData.length === 0 ? (
          <div className="flex items-center justify-center h-[250px]">
            <div className="text-gray-500">ไม่มีข้อมูลในช่วงเวลาที่เลือก</div>
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillPending" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-pending)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-pending)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillSolved" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-solved)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-solved)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value as string)
                return date.toLocaleDateString("th-TH", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={({ active, payload, label }) => {
                if (!active || !payload || !payload.length) {
                  return null
                }

                // Get the data point
                const data = payload[0]?.payload as ChartDataPoint | undefined
                
                if (!data) return null

                // Format date in Thai
                let formattedDate = ""
                try {
                  formattedDate = new Date(label as string).toLocaleDateString("th-TH", {
                    year: "numeric",
                    month: "long", 
                    day: "numeric",
                    weekday: "long"
                  })
                } catch {
                  formattedDate = String(label)
                }

                return (
                  <div className="rounded-lg border bg-background p-3 shadow-md">
                    <div className="mb-2 font-medium text-foreground">
                      {formattedDate}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div 
                          className="h-3 w-3 rounded-full" 
                          style={{ backgroundColor: "hsl(var(--chart-1))" }}
                        />
                        <span className="text-sm">
                          รอดำเนินการ: <span className="font-medium">{data.pending} รายการ</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div 
                          className="h-3 w-3 rounded-full" 
                          style={{ backgroundColor: "hsl(var(--chart-2))" }}
                        />
                        <span className="text-sm">
                          แก้ไขแล้ว: <span className="font-medium">{data.solved} รายการ</span>
                        </span>
                      </div>
                      <div className="mt-2 pt-2 border-t text-xs text-muted-foreground">
                        รวม: {data.pending + data.solved} รายการ
                        {data.branchCount > 0 && (
                          <div className="mt-1">
                            จำนวนสาขา: {data.branchCount} สาขา
                          </div>
                        )}
                        {data.branches && data.branches.length > 0 && data.branches.length < 150 && (
                          <div className="mt-1 text-xs">
                            {data.branches}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              }}
            />
            <Area
              dataKey="solved"
              type="natural"
              fill="url(#fillSolved)"
              stroke="var(--color-solved)"
              stackId="a"
            />
            <Area
              dataKey="pending"
              type="natural"
              fill="url(#fillPending)"
              stroke="var(--color-pending)"
              stackId="a"
            />
            <ChartLegend 
              content={<ChartLegendContent />}
              formatter={(value) => {
                if (value === "pending") return "รอดำเนินการ"
                if (value === "solved") return "แก้ไขแล้ว"
                return value
              }}
            />
          </AreaChart>
        </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}