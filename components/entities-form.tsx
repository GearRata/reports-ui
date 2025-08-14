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
import type { AssignData } from "@/types/assignto/model";

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
    assign_id?: number | null;
    id?: number;
  }) => void;
  ipPhones: IPPhone[];
  programs: Program[];
  assignTo: AssignData[];
  ipPhonesLoading?: boolean;
  programsLoading?: boolean;
  ipPhonesError?: string | null;
  programsError?: string | null;
  hasIPPhonesCachedData?: boolean;
  hasProgramsCachedData?: boolean;
}

export function TaskNewForm({
  open,
  onOpenChange,
  task,
  onSubmit,
  ipPhones,
  programs,
  assignTo,
  ipPhonesLoading = false,
  programsLoading = false,
  ipPhonesError = null,
  programsError = null,
  hasIPPhonesCachedData = false,
  hasProgramsCachedData = false,
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

    // Prevent submission if data is still loading
    if (ipPhonesLoading || programsLoading) {
      return;
    }

    // Prevent submission if required data failed to load and no cached data available
    if (!!programsError && !hasProgramsCachedData && programs.length === 0) {
      alert(
        "Cannot submit: Programs data failed to load and no cached data available. Please try refreshing the page."
      );
      return;
    }

    // Allow submission even if IP phones failed to load (it's optional)
    // Allow submission with cached data even if refresh failed

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
      <DialogContent className="sm:max-w-[525px] relative">
        {ipPhonesLoading && programsLoading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg shadow-lg border">
              <div className="animate-spin h-5 w-5 border-2 border-gray-300 border-t-blue-600 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">
                Refreshing form data...
              </span>
            </div>
          </div>
        )}
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {task ? "Edit Task" : "Add New Task"}
            {(ipPhonesLoading || programsLoading) && (
              <div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-gray-600 rounded-full"></div>
            )}
          </DialogTitle>
          <DialogDescription>
            {task
              ? "Update the task details below."
              : "Fill in the details to create a new task."}
            {(ipPhonesLoading || programsLoading) && (
              <span className="text-sm text-blue-600 mt-1 block">
                Refreshing form data...
              </span>
            )}
            {(ipPhonesError || programsError) && (
              <span className="text-sm text-amber-600 mt-1 space-y-1 block">
                {ipPhonesError && hasIPPhonesCachedData && (
                  <span className="block">⚠️ IP phones refresh failed - showing cached data</span>
                )}
                {programsError && hasProgramsCachedData && (
                  <span className="block">⚠️ Programs refresh failed - showing cached data</span>
                )}
                {ipPhonesError && !hasIPPhonesCachedData && (
                  <span className="block">❌ Failed to load IP phones: {ipPhonesError}</span>
                )}
                {programsError && !hasProgramsCachedData && (
                  <span className="block">❌ Failed to load programs: {programsError}</span>
                )}
              </span>
            )}
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
                disabled={ipPhonesLoading}
              >
                <SelectTrigger
                  className={`col-span-3 ${
                    !!ipPhonesError && !hasIPPhonesCachedData
                      ? "border-red-300"
                      : ""
                  }`}
                >
                  <SelectValue
                    placeholder={
                      ipPhonesLoading
                        ? "Loading IP phones..."
                        : !!ipPhonesError && !hasIPPhonesCachedData
                        ? "Error loading IP phones"
                        : !!ipPhonesError && hasIPPhonesCachedData
                        ? "Select IP phone (cached data)"
                        : "Select IP phone"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {ipPhonesLoading ? (
                    <SelectItem value="loading-ipphones" disabled>
                      <span className="flex items-center gap-2">
                        <span className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-gray-600 rounded-full"></span>
                        Loading IP phones...
                      </span>
                    </SelectItem>
                  ) : !!ipPhonesError && !hasIPPhonesCachedData ? (
                    <SelectItem value="error-no-data" disabled>
                      <span className="flex items-center gap-2 text-red-600">
                        <span>❌</span>
                        Failed to load IP phones
                      </span>
                    </SelectItem>
                  ) : (
                    <>
                      {task && (
                        <SelectItem value="null">ไม่ได้ระบุ ID</SelectItem>
                      )}
                      {ipPhones.length === 0 ? (
                        <SelectItem value="no-data" disabled>
                          No IP phones available
                        </SelectItem>
                      ) : (
                        <>
                          {!!ipPhonesError && hasIPPhonesCachedData && (
                            <SelectItem value="cached-data-warning" disabled>
                              <span className="flex items-center gap-2 text-amber-600 text-xs">
                                <span>⚠️</span>
                                Using cached data
                              </span>
                            </SelectItem>
                          )}
                          {ipPhones.map((phone) => (
                            <SelectItem
                              key={phone.id}
                              value={phone.id.toString()}
                            >
                              {phone.number} - {phone.name}
                            </SelectItem>
                          ))}
                        </>
                      )}
                    </>
                  )}
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
                disabled={programsLoading}
              >
                <SelectTrigger
                  className={`col-span-3 ${
                    !!programsError && !hasProgramsCachedData
                      ? "border-red-300"
                      : ""
                  }`}
                >
                  <SelectValue
                    placeholder={
                      programsLoading
                        ? "Loading programs..."
                        : !!programsError && !hasProgramsCachedData
                        ? "Error loading programs"
                        : !!programsError && hasProgramsCachedData
                        ? "Select program (cached data)"
                        : "Select Program"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {programsLoading ? (
                    <SelectItem value="loading-programs" disabled>
                      <span className="flex items-center gap-2">
                        <span className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-gray-600 rounded-full"></span>
                        Loading programs...
                      </span>
                    </SelectItem>
                  ) : !!programsError && !hasProgramsCachedData ? (
                    <SelectItem value="error-no-programs" disabled>
                      <span className="flex items-center gap-2 text-red-600">
                        <span>❌</span>
                        Failed to load programs
                      </span>
                    </SelectItem>
                  ) : (
                    <>
                      {programs.length === 0 ? (
                        <SelectItem value="no-programs" disabled>
                          No programs available
                        </SelectItem>
                      ) : (
                        <>
                          {!!programsError && hasProgramsCachedData && (
                            <SelectItem
                              value="cached-programs-warning"
                              disabled
                            >
                              <span className="flex items-center gap-2 text-amber-600 text-xs">
                                <span>⚠️</span>
                                Using cached data
                              </span>
                            </SelectItem>
                          )}
                          {programs.map((program) => (
                            <SelectItem
                              key={program.id}
                              value={program.id.toString()}
                            >
                              {program.name}
                            </SelectItem>
                          ))}
                        </>
                      )}
                    </>
                  )}
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
                    {assignTo.map((assing) => (
                      <SelectItem key={assing.id} value={assing.id.toString()}>
                        {assing.name}
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
            <Button
              type="submit"
              className="text-white hover:scale-105"
              disabled={
                ipPhonesLoading ||
                programsLoading ||
                (!!programsError &&
                  !hasProgramsCachedData &&
                  programs.length === 0)
              }
            >
              {ipPhonesLoading || programsLoading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                  Loading...
                </span>
              ) : !!programsError &&
                !hasProgramsCachedData &&
                programs.length === 0 ? (
                "Cannot Submit - Missing Data"
              ) : task ? (
                "Update Task"
              ) : (
                "Create Task"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
