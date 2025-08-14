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
  IPPhone,
  Program,
  TaskWithPhone,
} from "@/types/entities";
import type { AssignData } from "@/types/assignto/model";

// Task Form (New Structure)
interface TaskNewFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: TaskWithPhone | null;
  onSubmit: (data: {
    phone_id: number | null;
    system_id: number;
    text: string;
    status: number;
    assign_id?: number | null;
    id?: number;
  }) => void;
  ipPhones: IPPhone[];
  programs: Program[];
  assignTo: AssignData[];
}

export function TaskNewForm({
  open,
  onOpenChange,
  task,
  onSubmit,
  ipPhones,
  programs,
  assignTo,
}: TaskNewFormProps) {
  const [phoneId, setPhoneId] = useState<string>("");
  const [programID, setProgramID] = useState<string>("");
  const [text, setText] = useState("");
  const [status, setStatus] = useState<string>("");
  const [assignId, setAssignId] = useState<string>("");

  useEffect(() => {
    if (task) {
      setPhoneId(task.phone_id ? task.phone_id.toString() : "null");
      setProgramID(task.system_id.toString());
      setText(task.text);
      setStatus(task.status.toString());
      setAssignId(task.assignId ? task.assignId.toString() : "");
    } else {
      setPhoneId("");
      setProgramID("");
      setText("");
      setStatus("");
      setAssignId("");
    }
  }, [task, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      phone_id:
        phoneId && phoneId !== "" && phoneId !== "null"
          ? Number(phoneId)
          : null,
      system_id: Number(programID),
      text,
      status: Number(status),
      assign_id: assignId ? Number(assignId) : null,
      ...(task && { id: task.id }),
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{task ? "Edit Task" : "Add New Task"}</DialogTitle>
          <DialogDescription>
            {task
              ? "Update the task details below."
              : "Fill in the details to create a new task."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone_id" className="text-right">
                IP Phone
              </Label>
              <Select
                value={phoneId}
                onValueChange={(value) => setPhoneId(value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select IP phone" />
                </SelectTrigger>
                <SelectContent>
                  {task && <SelectItem value="null">ไม่ได้ระบุ ID</SelectItem>}
                  {ipPhones.map((phone) => (
                    <SelectItem key={phone.id} value={phone.id.toString()}>
                      {phone.number} - {phone.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="program_id" className="text-right">
                Program
              </Label>
              <Select
                value={programID}
                onValueChange={(value) => setProgramID(value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select Program" />
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
            {task && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select
                  value={status}
                  onValueChange={(value) => setStatus(value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Pending</SelectItem>
                    <SelectItem value="1">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            {task && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Assign To
                </Label>
                <Select
                  value={assignId}
                  onValueChange={(value) => setAssignId(value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select AssignTo" />
                  </SelectTrigger>
                  <SelectContent>
                    {assignTo.map((assign) => (
                      <SelectItem key={assign.id} value={assign.id.toString()}>
                        {assign.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="hover:scale-105"
            >
              Cancel
            </Button>
            <Button type="submit" className="text-white hover:scale-105">
              {task ? "Update Task" : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}