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
import type { ProgramData } from "@/types/Program/model";

interface ProgramsTableProps {
  programs: ProgramData[];
  onEditProgram: (program: ProgramData) => void;
  onDeleteProgram: (programId: number) => void;
  loading?: boolean;
  error?: string | null;
}

export function ProgramsTable({
  programs,
  onEditProgram,
  onDeleteProgram,
  loading = false,
  error = null,
}: ProgramsTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="w-[70px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={3} className="h-24 text-center">
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  กำลังโหลดข้อมูล...
                </div>
              </TableCell>
            </TableRow>
          ) : error ? (
            <TableRow>
              <TableCell colSpan={3} className="h-24 text-center text-red-500">
                เกิดข้อผิดพลาด: {error}
              </TableCell>
            </TableRow>
          ) : programs.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={3}
                className="h-24 text-center text-muted-foreground"
              >
                ไม่พบข้อมูลโปรแกรม
              </TableCell>
            </TableRow>
          ) : (
            programs.map((program, index) => (
              <TableRow key={program.id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{program.name}</TableCell>
                <TableCell>{program.type_name}</TableCell>
                <TableCell>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditProgram(program);
                    }}
                    disabled={loading}
                    className="cursor-pointer mr-2 bg-(--accent) text-white hover:bg-(--popover) hover:scale-105 "
                  >
                    <Pencil className=" h-4 w-4" />
                  </Button>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteProgram(program.id);
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
