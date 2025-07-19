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

// Branch Form
interface BranchFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  branch?: Branch | null;
  onSubmit: (data: { name: string; id?: number }) => void;
}

export function BranchForm({
  open,
  onOpenChange,
  branch,
  onSubmit,
}: BranchFormProps) {
  const [name, setName] = useState("");

  useEffect(() => {
    if (branch) {
      setName(branch.name);
    } else {
      setName("");
    }
  }, [branch, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, ...(branch && { id: branch.id }) });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{branch ? "Edit Branch" : "Add New Branch"}</DialogTitle>
          <DialogDescription>
            {branch
              ? "Update the branch details below."
              : "Fill in the details to create a new branch."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
                placeholder="Branch name"
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
              {branch ? "Update Branch" : "Create Branch"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Department Form
interface DepartmentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  department?: Department | null;
  onSubmit: (data: { name: string; id?: number; branch_id: number }) => void;
  branches: { id: number; name: string }[];
}

export function DepartmentFormNew({
  open,
  onOpenChange,
  department,
  onSubmit,
  branches,
}: DepartmentFormProps) {
  const [name, setName] = useState("");
  const [branchId, setBranchId] = useState<number>(0);

  useEffect(() => {
    if (department) {
      setName(department.name);
      setBranchId(department.branch_id);
    } else {
      setName("");
      setBranchId(0);
    }
  }, [department, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      branch_id: branchId,
      ...(department && { id: department.id }),
    });
    onOpenChange(false);
  };

  console.log("branches Array:", branches);
  console.log("branches ID:", branchId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {department ? "Edit Department" : "Add New Department"}
          </DialogTitle>
          <DialogDescription>
            {department
              ? "Update the department details below."
              : "Fill in the details to create a new department."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
                placeholder="Department name"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="branch" className="text-right">
                Branch
              </Label>
              <Select
                value={branchId.toString()}
                onValueChange={(value) => setBranchId(Number(value))}
              >
                <SelectTrigger className="col-span-3 w-full">
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  {branches.map((branch) => (
                    <SelectItem key={branch.id} value={branch.id.toString()}>
                      {branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              {department ? "Update Department" : "Create Department"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Program Form
interface ProgramFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  program?: Program | null;
  onSubmit: (data: { name: string; id?: number }) => void;
}

export function ProgramFormNew({
  open,
  onOpenChange,
  program,
  onSubmit,
}: ProgramFormProps) {
  const [name, setName] = useState("");

  useEffect(() => {
    if (program) {
      setName(program.name);
    } else {
      setName("");
    }
  }, [program, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, ...(program && { id: program.id }) });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {program ? "Edit Program" : "Add New Program"}
          </DialogTitle>
          <DialogDescription>
            {program
              ? "Update the program details below."
              : "Fill in the details to create a new program."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
                placeholder="Program name"
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
              {program ? "Update Program" : "Create Program"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// IP Phone Form
interface IPPhoneFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ipPhone?: IPPhone | null;
  onSubmit: (data: { number: number; name: string; id?: number; department_id: number; branch_id: number; }) => void;
  branches: { id: number; name: string }[];
  departments: { id: number; name: string }[];
}

export function IPPhoneForm({
  open,
  onOpenChange,
  ipPhone,
  onSubmit,
  branches,
  departments,
}: IPPhoneFormProps) {
  const [branchId, setBranchId] = useState<number>(0);
  const [departmentId, setDepartmentID] = useState<number>(0);
  const [number, setNumber] = useState(0);
  const [name, setName] = useState("");

  useEffect(() => {
    if (ipPhone) {
      setNumber(ipPhone.number);
      setName(ipPhone.name);
      setBranchId(ipPhone.branch_id);
      setDepartmentID(ipPhone.department_id);
    } else {
      setNumber(0);
      setName("");
      setBranchId(0);
      setDepartmentID(0);
    }
  }, [ipPhone, open]);

  console.log("IP Phone Form", ipPhone)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ number, name, branch_id: branchId, department_id: departmentId, ...(ipPhone && { id: ipPhone.id }) });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {ipPhone ? "Edit IP Phone" : "Add New IP Phone"}
          </DialogTitle>
          <DialogDescription>
            {ipPhone
              ? "Update the IP phone details below."
              : "Fill in the details to create a new IP phone."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="number" className="text-right">
                Number
              </Label>
              <Input
                id="number"
                value={number}
                type="number"
                onChange={(e) => setNumber(Number(e.target.value))}
                className="col-span-3"
                placeholder="Phone Number"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
                placeholder="Phone name"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="department" className="text-right">
                Department
              </Label>
              <Select
                value={departmentId.toString()}
                onValueChange={(value) => setDepartmentID(Number(value))}
              >
                <SelectTrigger className="col-span-3 w-full">
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((department) => (
                    <SelectItem key={department.id} value={department.id.toString()}>
                      {department.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="branch" className="text-right">
                Branch
              </Label>
              <Select
                value={branchId.toString()}
                onValueChange={(value) => setBranchId(Number(value))}
              >
                <SelectTrigger className="col-span-3 w-full">
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  {branches.map((branch) => (
                    <SelectItem key={branch.id} value={branch.id.toString()}>
                      {branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              {ipPhone ? "Update IP Phone" : "Create IP Phone"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Task Form (New Structure)
interface TaskNewFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: TaskWithPhone | null;
  onSubmit: (data: {
    phone_id: number;
    text: string;
    status: string;
    id?: number;
  }) => void;
  ipPhones: IPPhone[];
}

export function TaskNewForm({
  open,
  onOpenChange,
  task,
  onSubmit,
  ipPhones,
}: TaskNewFormProps) {
  const [phoneId, setPhoneId] = useState<number>(0);
  const [text, setText] = useState("");
  const [status, setStatus] = useState<"pending" | "solved">("pending");

  console.log("task", task);

  useEffect(() => {
    if (task) {
      setPhoneId(task.phone_id);
      setText(task.text);
      setStatus(task.status as "pending" | "solved");
    } else {
      setPhoneId(0);
      setText("");
      setStatus("pending");
    }
  }, [task, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ phone_id: phoneId, text, status, ...(task && { id: task.id }) });
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
                value={phoneId.toString()}
                onValueChange={(value) => setPhoneId(Number(value))}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select IP phone" />
                </SelectTrigger>
                <SelectContent>
                  {ipPhones.map((phone) => (
                    <SelectItem key={phone.id} value={phone.id.toString()}>
                      {phone.number} - {phone.name}
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
            {/* <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select
                value={status}
                onValueChange={(value: "pending" | "solved") =>
                  setStatus(value)
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="solved">Solved</SelectItem>
                </SelectContent>
              </Select>
            </div> */}
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
