"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {  Pencil, Trash } from "lucide-react"
import type { Department } from "@/types/entities"

interface DepartmentsTableProps {
  departments: Department[]
  onEditDepartment: (department: Department) => void
  onDeleteDepartment: (departmentId: number) => void
  loading?: boolean
  error?: string | null
}

export function DepartmentsTable({ 
  departments, 
  onEditDepartment, 
  onDeleteDepartment,
  loading = false,
  error = null 
}: DepartmentsTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Branch</TableHead>
            <TableHead className="w-[70px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  กำลังโหลดข้อมูล...
                </div>
              </TableCell>
            </TableRow>
          ) : error ? (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center text-red-500">
                เกิดข้อผิดพลาด: {error}
              </TableCell>
            </TableRow>
          ) : departments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                ไม่พบข้อมูลแผนก
              </TableCell>
            </TableRow>
          ) : (
            departments.map((department, index) => (
              <TableRow key={department.id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{department.name}</TableCell>
                <TableCell>{department.branch_name}</TableCell>
                <TableCell> 
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditDepartment(department);
                    }}
                    disabled={loading}
                    className="cursor-pointer mr-2 bg-(--accent) text-white hover:bg-(--popover) hover:scale-105 "
                  >
                    <Pencil className=" h-4 w-4" />
                  </Button>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteDepartment(department.id);
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
  )
}
