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
import type { TypeData, DeleteType } from "@/types/type/model";


interface BranchesTableProps {
  types: TypeData[];
  loading?: boolean;
  onEditType: (types: TypeData) => void;
  onDeleteType: (types: DeleteType) => void;
}

export function TypeTable({
  types,
  loading = false,
  onEditType,
  onDeleteType,
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
          {types.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="h-24 text-center">
                No Type found.
              </TableCell>
            </TableRow>
          ) : (
            types.map((types, index) => (
              <TableRow key={types.id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{types.name}</TableCell>
                <TableCell>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditType(types);
                    }}
                    disabled={loading}
                    className="cursor-pointer mr-2 bg-(--accent) text-white hover:bg-(--popover) hover:scale-105 "
                  >
                    <Pencil className=" h-4 w-4" />
                  </Button>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteType(types.id);
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
