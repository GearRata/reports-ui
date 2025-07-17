"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Filter, Plus } from "lucide-react"

interface TaskFiltersProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  selectedStatuses: string[]
  onStatusChange: (statuses: string[]) => void
  onAddTask: () => void
  onAddDepartment: () => void
  onAddProgram: () => void
}

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "solved", label: "Solved" },
]

export function TaskFilters({
  searchQuery,
  onSearchChange,
  selectedStatuses,
  onStatusChange,
  onAddTask,
  onAddDepartment,
  onAddProgram,
}: TaskFiltersProps) {
  const handleStatusToggle = (status: string) => {
    if (selectedStatuses.includes(status)) {
      onStatusChange(selectedStatuses.filter((s) => s !== status))
    } else {
      onStatusChange([...selectedStatuses, status])
    }
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter tasks... (search by ID, IP, department, program, problem, status)"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-8 w-[150px] lg:w-[450px]"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 border-dashed bg-transparent">
              <Filter className="mr-2 h-4 w-4" />
              Status
              {selectedStatuses.length > 0 && (
                <Badge variant="secondary" className="ml-2 rounded-sm px-1 font-normal">
                  {selectedStatuses.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[200px]" align="start">
            <DropdownMenuLabel>Filter by status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {statusOptions.map((option) => (
              <DropdownMenuCheckboxItem
                key={option.value}
                className="capitalize"
                checked={selectedStatuses.includes(option.value)}
                onCheckedChange={() => handleStatusToggle(option.value)}
              >
                {option.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex items-center space-x-2">
      <Button onClick={onAddTask} size="sm" className="ml-auto h-8 bg-blue-500 hover:bg-blue-600">
        <Plus className=" h-4 w-4" />
        Add Task
      </Button>
      <Button onClick={onAddDepartment} size="sm" className="ml-auto h-8">
        <Plus className=" h-4 w-4" />
        Add Department
      </Button>
      <Button onClick={onAddProgram} size="sm" className="ml-auto h-8 bg-green-500 hover:bg-green-600">
        <Plus className=" h-4 w-4" />
        Add Program
      </Button>
      </div>
    </div>
  )
}
