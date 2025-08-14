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
import type { Branch } from "@/types/entities";

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