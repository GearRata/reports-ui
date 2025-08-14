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
import type { Department } from "@/types/entities";

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