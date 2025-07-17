"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Task } from "@/types/task"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000"

interface Program {
  id: number;
  name: string;
}

interface Department {
  ip_phone: number;
  branchoffice: string;
}
// const departments: Department[] = [
//   { id: 1, branch_office: "IT Support" },
//   { id: 2, branch_office: "HR" },
//   { id: 3, branch_office: "Finance" },
// ]
interface TaskFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  task?: Task | null
  onSubmit: (task: Omit<Task, "id" | "created_at"> & { id?: string }) => void
}

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "solved", label: "Solved" },
]

export function TaskForm({ open, onOpenChange, task, onSubmit }: TaskFormProps) {
  const [programs, setPrograms] = useState<Program[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [formData, setFormData] = useState<{
    ip_phone: string;
    department: string;
    program: string;
    problem: string;
    solution: string;
    status: "pending" | "solved";
  }>({
    ip_phone: "",
    department: "",
    program: "",
    problem: "",
    solution: "",
    status: "pending",
  })

     // Fetch programs from API
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch(`${API_BASE}/branchEntry/branchOffices`)
        if (!response.ok) throw new Error('Failed to fetch departments')
        const data = await response.json()
        if (data.success && data.branchOffices) {
          setDepartments(data.branchOffices)
        }
      } catch (error) {
        console.error('Error fetching departments:', error)
      }
    }
    fetchDepartments()
  }, [open]) // Refresh when form opens

  // Fetch programs from API
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await fetch(`${API_BASE}/programEntry/programs`)
        if (!response.ok) throw new Error('Failed to fetch programs')
        const data = await response.json()
        if (data.success && data.programs) {
          setPrograms(data.programs)
        }
      } catch (error) {
        console.error('Error fetching programs:', error)
      }
    }
    fetchPrograms()
  }, [open]) // Refresh when form opens

  useEffect(() => {
    if (task) {
      setFormData({
        ip_phone: task.ip_phone,
        department: task.department,
        program: task.program,
        problem: task.problem,
        solution: task.solution,
        status: task.status as "pending" | "solved",
      })
    } else {
      setFormData({
        ip_phone: "",
        department: "",
        program: "",
        problem: "",
        solution: "",
        status: "pending",
      })
    }
  }, [task, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      status: formData.status,
      ...(task && { id: task.id }),
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{task ? "Edit Task" : "Add New Task"}</DialogTitle>
          <DialogDescription>
            {task ? "Update the task details below." : "Fill in the details to create a new task."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ip_phone" className="text-right">
                IP Phone
              </Label>
              <Input
                id="ip_phone"
                value={formData.ip_phone}
                onChange={(e) => setFormData({ ...formData, ip_phone: e.target.value })}
                className="col-span-3"
                placeholder="192.168.1.100"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="department" className="text-right">
                Department
              </Label>
               <div className="col-span-3 flex gap-2">
                <div className="flex-grow">
                  <Select
                    value={formData.department}
                    onValueChange={(value) => setFormData({ ...formData, department: value })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept.ip_phone} value={dept.branchoffice}>
                          {dept.branchoffice}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="program" className="text-right">
                Program
              </Label>
              <div className="col-span-3 flex gap-2">
                <div className="flex-grow">
                  <Select
                    value={formData.program}
                    onValueChange={(value) => setFormData({ ...formData, program: value })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select program" />
                    </SelectTrigger>
                    <SelectContent>
                      {programs.map((program) => (
                        <SelectItem key={program.id} value={program.name}>
                          {program.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="problem" className="text-right">
                Problem
              </Label>
              <Textarea
                id="problem"
                value={formData.problem}
                onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                className="col-span-3"
                placeholder="Describe the issue..."
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="solution" className="text-right">
                Solution
              </Label>
              <Textarea
                id="solution"
                value={formData.solution}
                onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                className="col-span-3"
                placeholder="Solution or steps taken..."
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value: "pending" | "solved") => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger className="col-span-3 w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{task ? "Update Task" : "Create Task"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
