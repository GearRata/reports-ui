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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { IPPhone } from "@/types/entities";

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