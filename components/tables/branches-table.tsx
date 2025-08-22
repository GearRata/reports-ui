"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";
import type { Branch } from "@/types/entities";

interface BranchesTableProps {
  branches: Branch[];
  loading?: boolean;
  onEditBranch: (branch: Branch) => void;
  onDeleteBranch: (branchId: number) => void;
}

export function BranchesTable({
  branches,
  loading = false,
  onEditBranch,
  onDeleteBranch,
}: BranchesTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="w-[70px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {branches.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="h-24 text-center">
                No branches found.
              </TableCell>
            </TableRow>
          ) : (
            branches.map((branch, index) => (
              <TableRow key={branch.id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{branch.name}</TableCell>
                <TableCell>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditBranch(branch);
                    }}
                    disabled={loading}
                    className="cursor-pointer mr-2 bg-(--accent) text-white hover:bg-(--popover) hover:scale-105 "
                  >
                    <Pencil className=" h-4 w-4" />
                  </Button>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteBranch(branch.id);
                    }}
                    disabled={loading}
                    className="cursor-pointer mr-2 bg-red-500 text-white hover:bg-red-600 hover:scale-105 "
                  >
                    <Trash className=" h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
