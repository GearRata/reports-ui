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
import type { AssignData } from "@/types/Assignto/model";

interface AssingToTableProps {
  assignto: AssignData[];
  loading?: boolean;
  handleEditAssignTo: (assign: AssignData) => void;
  handleDeleteAssignTo: (assignId: number) => void;
}

export function AssignToTable({
  assignto,
  loading = false,
  handleEditAssignTo,
  handleDeleteAssignTo,
}: AssingToTableProps) {
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
          {assignto.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="h-24 text-center">
                No branches found.
              </TableCell>
            </TableRow>
          ) : (
            assignto.map((assign, index) => (
              <TableRow key={assign.id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{assign.name}</TableCell>
                <TableCell>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditAssignTo(assign);
                    }}
                    disabled={loading}
                    className="cursor-pointer mr-2 bg-(--accent) text-white hover:bg-(--popover) hover:scale-105 "
                  >
                    <Pencil className=" h-4 w-4" />
                  </Button>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteAssignTo(assign.id);
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
