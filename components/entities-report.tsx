"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  Branch,
  Department,
  Program,
  IPPhone,
  TaskWithPhone,
} from "@/types/entities";

interface TaskNewFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: TaskWithPhone | null;
  onSubmit: (data: {
    text: string;
    status: string;
    id?: number;
    program_id: number;
    branch_id: number;
    department_id: number;
  }) => void;
  ipPhones: IPPhone[];
  branches: Branch[];
  departments: Department[];
  programs: Program[];
}

export function TaskNewForm({
  open,
  onOpenChange,
  task,
  onSubmit,
  branches,
  departments,
  programs,
}: TaskNewFormProps) {
  const [text, setText] = useState("");
  const [branchId, setBranchId] = useState<number>(1);
  const [departmentId, setDepartmentID] = useState<number>(1);
  const [programId, setProgramID] = useState<number>(0);
  const [status, setStatus] = useState<"pending" | "solved">("pending");

  useEffect(() => {
    if (task) {
      setText(task.text);
      setBranchId(task.branch_id);
      setDepartmentID(task.department_id);
      setStatus(task.status as "pending");
    } else {
      setText("");
      setStatus("pending");
    }
  }, [task, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      program_id: programId,
      branch_id: branchId,
      department_id: departmentId,
      text,
      status,
      ...(task && { id: task.id }),
    });
    console.log(
      "TasksNewTable tasks:",
      branchId,
      departmentId,
      programId,
      text,
      status
    );
    onOpenChange(false);
  };

  console.log("branches Array:", branches);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
            <DialogTitle>
             {branches.map((branch) => (
              <div key={branch.id}>
                {branch.id === branchId
                  ? "สาขาใหญ่"
                  : "" }
              </div>
            ))}
          </DialogTitle>
          <DialogDescription>
            {departments.map((department) => (
              <div key={department.id}>
                {department.id === departmentId
                  ? "IT"
                  : "" }
              </div>
            ))}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone_id" className="text-right">
                Program
              </Label>
              <Select
                value={programId.toString()}
                onValueChange={(value) => setProgramID(Number(value))}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select IP phone" />
                </SelectTrigger>
                <SelectContent>
                  {programs.map((program) => (
                    <SelectItem key={program.id} value={program.id.toString()}>
                      {program.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="text" className="text-right">
                Text
              </Label>
              <Textarea
                id="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="col-span-3"
                placeholder="Describe the task..."
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {task ? "Update Task" : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
