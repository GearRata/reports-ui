"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface DepartmentFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: { ip_phone: string; department: string }) => void
}

export function DepartmentForm({ open, onOpenChange, onSubmit }: DepartmentFormProps) {
  const [ipPhone, setIpPhone] = useState("")
  const [department, setDepartment] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ ip_phone: ipPhone, department })
    setIpPhone("")
    setDepartment("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Department</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label htmlFor="ip_phone">IP Phone</label>
            <Input
              id="ip_phone"
              placeholder="Enter IP Phone"
              value={ipPhone}
              onChange={(e) => setIpPhone(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="department">Department</label>
            <Input
              id="department"
              placeholder="Enter Department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Department</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
