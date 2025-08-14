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
import type { Program } from "@/types/entities";

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