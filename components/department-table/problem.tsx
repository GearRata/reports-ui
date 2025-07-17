"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { TaskWithPhone } from "@/types/entities"

interface TasksNewTableProps {
  tasks: TaskWithPhone[]

}

const statusColors: Record<number, string> = {
  1: "bg-orange-100 text-orange-800",
  0: "bg-green-100 text-green-800",
}

const statusLabels: Record<number, string> = {
  1: "Pending",
  0: "Solved",
}

export function Problem({ tasks }: TasksNewTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Department</TableHead>
            <TableHead>Branch</TableHead>
            <TableHead>Text</TableHead>
            <TableHead>Status</TableHead>
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
                <TableCell>{task.department_name || "-"}</TableCell>
                <TableCell>{task.branch_name || "-"}</TableCell>
                <TableCell className="max-w-[200px] truncate">{task.text}</TableCell>
                <TableCell>
                  <Badge className={statusColors[task.status? 0 : 1 || "pending"]}>
                   {statusLabels[task.status? 0 : 1 || "pending"]}
                  </Badge>
                </TableCell>

              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
