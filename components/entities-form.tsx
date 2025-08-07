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
              className="hover:scale-105"
            >
              Cancel
            </Button>
            <Button type="submit" className="text-white hover:scale-105">
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
  loading: boolean;
}

export function DepartmentFormNew({
  open,
  onOpenChange,
  department,
  onSubmit,
  branches,
  loading,
}: DepartmentFormProps) {
  const [name, setName] = useState("");
  const [branchId, setBranchId] = useState<string>("");

  useEffect(() => {
    if (department) {
      setName(department.name);
      setBranchId(department.branch_id.toString());
    } else {
      setName("");
      setBranchId("");
    }
  }, [department, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      branch_id: Number(branchId),
      ...(department && { id: department.id }),
    });
    onOpenChange(false);
  };

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
                value={branchId}
                onValueChange={(value) => setBranchId(value)}
              >
                <SelectTrigger className="col-span-3 w-full">
                  <SelectValue
                    placeholder={loading ? "Loading..." : "Select Branch"}
                  />
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
              className="hover:scale-105"
            >
              Cancel
            </Button>
            <Button type="submit" className="text-white hover:scale-105">
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
              className="hover:scale-105"
            >
              Cancel
            </Button>
            <Button type="submit" className="text-white hover:scale-105">
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
  onSubmit: (data: {
    number: number;
    name: string;
    id?: number;
    department_id: number;
    branch_id: number;
  }) => void;
  branches: { id: number; name: string }[];
  departments: { id: number; name: string }[];
  loading: boolean;
}

export function IPPhoneForm({
  open,
  onOpenChange,
  ipPhone,
  onSubmit,
  branches,
  departments,
  loading,
}: IPPhoneFormProps) {
  const [branchId, setBranchId] = useState<string>("");
  const [departmentId, setDepartmentID] = useState<string>("");
  const [number, setNumber] = useState<string>("");
  const [name, setName] = useState("");

  useEffect(() => {
    if (ipPhone) {
      setNumber(ipPhone.number.toString());
      setName(ipPhone.name);
      setBranchId(ipPhone.branch_id.toString());
      setDepartmentID(ipPhone.department_id.toString());
    } else {
      setNumber("");
      setName("");
      setBranchId("");
      setDepartmentID("");
    }
  }, [ipPhone, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      number: Number(number),
      name,
      branch_id: Number(branchId),
      department_id: Number(departmentId),
      ...(ipPhone && { id: ipPhone.id }),
    });
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
                onChange={(e) => setNumber(e.target.value)}
                className="col-span-3"
                placeholder="Enter phone number"
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
                value={departmentId}
                onValueChange={(value) => setDepartmentID(value)}
              >
                <SelectTrigger className="col-span-3 w-full">
                  <SelectValue
                    placeholder={loading ? "Loading..." : "Select Department"}
                  />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((department) => (
                    <SelectItem
                      key={department.id}
                      value={department.id.toString()}
                    >
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
                value={branchId}
                onValueChange={(value) => setBranchId(value)}
              >
                <SelectTrigger className="col-span-3 w-full">
                  <SelectValue
                    placeholder={loading ? "Loading..." : "Select Branch"}
                  />
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
              className="hover:scale-105"
            >
              Cancel
            </Button>
            <Button type="submit" className="text-white hover:scale-105">
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
    phone_id: number | null;
    system_id: number;
    text: string;
    status: number;
    id?: number;
  }) => void;
  ipPhones: IPPhone[];
  programs: Program[];
}

export function TaskNewForm({
  open,
  onOpenChange,
  task,
  onSubmit,
  ipPhones,
  programs,
}: TaskNewFormProps) {
  const [phoneId, setPhoneId] = useState<string>("");
  const [programID, setProgramID] = useState<string>("");
  const [text, setText] = useState("");
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    if (task) {
      setPhoneId(task.phone_id ? task.phone_id.toString() : "null");
      setProgramID(task.system_id.toString());
      setText(task.text);
      setStatus(task.status.toString());
    } else {
      setPhoneId("");
      setProgramID("");
      setText("");
      setStatus("");
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
