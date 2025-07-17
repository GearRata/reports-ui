"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface ProgramFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: { name: string }) => void
}

export function ProgramForm({ open, onOpenChange, onSubmit }: ProgramFormProps) {
  const [name, setName] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ name })
    setName("") // reset form
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Program</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label htmlFor="program_name">Program Name</label>
            <Input
              id="program_name"
              placeholder="Enter Program Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-green-500 hover:bg-green-600">
              Add Program
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
