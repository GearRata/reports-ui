"use client"

import { useState, useMemo } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Filter, RotateCcw, Search } from "lucide-react"
import taskData from "@/data/data.json"

interface Task {
  id: string
  ip_phone: string
  department: string
  program: string
  problem: string
  status: "in_progress" | "done"
}

const chartConfig = {
  count: {
    label: "Tasks",
    color: "var(--chart-task)",
  },
  in_progress: {
    label: "In Progress",
    color: "var(--chart-1)",
  },
  done: {
    label: "Done",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function ChartBarMultiple() {
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null)
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)

  // Search states for dropdowns
  const [departmentSearch, setDepartmentSearch] = useState("")
  const [programSearch, setProgramSearch] = useState("")

  const tasks = taskData as Task[]

  // Get unique values for filters with search functionality
  const departments = useMemo(() => {
    const allDepartments = Array.from(new Set(tasks.map((task) => task.department))).sort()
    return allDepartments.filter((dept) => dept.toLowerCase().includes(departmentSearch.toLowerCase()))
  }, [tasks, departmentSearch])

  const programs = useMemo(() => {
    const allPrograms = Array.from(new Set(tasks.map((task) => task.program))).sort()
    return allPrograms.filter((program) => program.toLowerCase().includes(programSearch.toLowerCase()))
  }, [tasks, programSearch])

  const statuses = useMemo(() => Array.from(new Set(tasks.map((task) => task.status))).sort(), [tasks])

  // Filter tasks based on selected filters
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (selectedDepartment && task.department !== selectedDepartment) return false
      if (selectedProgram && task.program !== selectedProgram) return false
      if (selectedStatus && task.status !== selectedStatus) return false
      return true
    })
  }, [tasks, selectedDepartment, selectedProgram, selectedStatus])

  // Prepare chart data for departments
  const departmentData = useMemo(() => {
    const counts = filteredTasks.reduce(
      (acc, task) => {
        acc[task.department] = (acc[task.department] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )
    return Object.entries(counts)
      .map(([department, count]) => ({
        name: department,
        count,
      }))
      .sort((a, b) => b.count - a.count)
  }, [filteredTasks])

  // Prepare chart data for programs
  const programData = useMemo(() => {
    const counts = filteredTasks.reduce(
      (acc, task) => {
        acc[task.program] = (acc[task.program] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )
    return Object.entries(counts)
      .map(([program, count]) => ({
        name: program,
        count,
      }))
      .sort((a, b) => b.count - a.count)
  }, [filteredTasks])

  // Prepare chart data for status
  const statusData = useMemo(() => {
    const counts = filteredTasks.reduce(
      (acc, task) => {
        acc[task.status] = (acc[task.status] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )
    return Object.entries(counts).map(([status, count]) => ({
      name: status === "in_progress" ? "In Progress" : "Done",
      count,
      fill: status === "in_progress" ? "var(--color-in_progress)" : "var(--color-done)",
    }))
  }, [filteredTasks])

  // Prepare detailed breakdown data
  const departmentStatusData = useMemo(() => {
    const breakdown = filteredTasks.reduce(
      (acc, task) => {
        if (!acc[task.department]) {
          acc[task.department] = { in_progress: 0, done: 0 }
        }
        acc[task.department][task.status]++
        return acc
      },
      {} as Record<string, { in_progress: number; done: number }>,
    )
    return Object.entries(breakdown)
      .map(([department, counts]) => ({
        department,
        in_progress: counts.in_progress,
        done: counts.done,
        total: counts.in_progress + counts.done,
      }))
      .sort((a, b) => b.total - a.total)
  }, [filteredTasks])

  const clearFilters = () => {
    setSelectedDepartment(null)
    setSelectedProgram(null)
    setSelectedStatus(null)
    setDepartmentSearch("")
    setProgramSearch("")
  }

  const hasActiveFilters = selectedDepartment || selectedProgram || selectedStatus

  return (
    <div className="p-1 mt-5 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Task Dashboard</h1>
          <p className="text-muted-foreground">Overview of tasks by department, program, and status</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm">
            {filteredTasks.length} of {tasks.length} tasks
          </Badge>
          {hasActiveFilters && (
            <Button variant="outline" size="sm" onClick={clearFilters}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Filter Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 ">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 ">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
            {/* Department Filter */}
            <div className="space-y-2 ">
              <label className="text-sm font-medium">Department</label>
              <Select
                value={selectedDepartment || ""}
                onValueChange={(value) => setSelectedDepartment(value === "all" ? null : value)}
              >
                <SelectTrigger className="w-full mt-2">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <div className="flex items-center px-2 pb-2 ">
                    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                    <Input
                      placeholder=" Search departments..."
                      value={departmentSearch}
                      onChange={(e) => setDepartmentSearch(e.target.value)}
                      className="pl-2 h-8 w-full border-0 focus-visible:ring-0"
                    />
                  </div>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Program Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium ">Program</label>
              <Select
                value={selectedProgram || ""}
                onValueChange={(value) => setSelectedProgram(value === "all" ? null : value)}
              >
                <SelectTrigger className="w-full mt-2">
                  <SelectValue placeholder="Select program" />
                </SelectTrigger>
                <SelectContent>
                  <div className="flex items-center px-2 pb-2">
                    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                    <Input
                      placeholder=" Search programs..."
                      value={programSearch}
                      onChange={(e) => setProgramSearch(e.target.value)}
                      className="pl-2 h-8 w-full border-0 focus-visible:ring-0"
                    />
                  </div>
                  <SelectItem value="all">All Programs</SelectItem>
                  {programs.map((program) => (
                    <SelectItem key={program} value={program}>
                      {program}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select
                value={selectedStatus || ""}
                onValueChange={(value) => setSelectedStatus(value === "all" ? null : value)}
              >
                <SelectTrigger className="w-full mt-2">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status === "in_progress" ? "In Progress" : "Done"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        {/* Department Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Tasks by Department</CardTitle>
            <CardDescription>Number of tasks per department</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="min-h-[300px]">
              <BarChart width={533} height={300} data={departmentData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} interval={0} fontSize={14} fontWeight={600}/>
                <YAxis allowDecimals={false} fontSize={14} fontWeight={600}/>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--chart-task)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Program Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Tasks by Program</CardTitle>
            <CardDescription>Number of tasks per program</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="min-h-[300px]">
              <BarChart width={533} height={300} data={programData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} interval={0} fontSize={14} fontWeight={600}/>
                <YAxis allowDecimals={false} fontSize={14} fontWeight={600}/>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--chart-2)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Status Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Tasks by Status</CardTitle>
            <CardDescription>Distribution of task statuses</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="min-h-[300px]">
              <BarChart width={533} height={300} data={statusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={14} fontWeight={600} />
                <YAxis allowDecimals={false} fontSize={14} fontWeight={600}/>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill={chartConfig.done.color} radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Department Status Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Department Status Breakdown</CardTitle>
            <CardDescription>Task status distribution by department</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="min-h-[300px]">
              <BarChart width={533} height={300} data={departmentStatusData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="department" angle={-45} textAnchor="end" height={80} interval={0} fontSize={14} fontWeight={600}/>
                <YAxis allowDecimals={false} fontSize={14} fontWeight={600}/>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="in_progress" stackId="a" fill="var(--chart-1)" radius={[0, 0, 4, 4]} />
                <Bar dataKey="done" stackId="a" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}



