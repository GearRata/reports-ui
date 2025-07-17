"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Pencil, Trash } from "lucide-react"
import type { TaskWithPhone } from "@/types/entities"

interface TasksNewTableProps {
  tasks: TaskWithPhone[]
  onEditTask: (task: TaskWithPhone) => void
  onDeleteTask: (taskId: number) => void
}

const statusColors: Record<number, string> = {
  1: "bg-orange-100 text-orange-800",
  0: "bg-green-100 text-green-800",
}

const statusLabels: Record<number, string> = {
  1: "Pending",
  0: "Solved",
}

export function TasksNewTable({ tasks, onEditTask, onDeleteTask }: TasksNewTableProps) {
  console.log("TasksNewTable tasks:", tasks)
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Phone Number</TableHead>
            <TableHead>Phone Name</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Branch</TableHead>
            <TableHead>Text</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[70px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No tasks found.
              </TableCell>
            </TableRow>
          ) : (
            tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell className="font-medium">{task.id}</TableCell>
                <TableCell>{task.number}</TableCell>
                <TableCell>{task.phone_name || "-"}</TableCell>
                <TableCell>{task.department_name || "-"}</TableCell>
                <TableCell>{task.branch_name || "-"}</TableCell>
                <TableCell className="max-w-[200px] truncate">{task.text}</TableCell>
                <TableCell>
                  <Badge className={statusColors[task.status? 0 : 1 || "pending"]}>
                   {statusLabels[task.status? 0 : 1 || "pending"]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEditTask(task)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDeleteTask(task.id)} className="text-red-600">
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
