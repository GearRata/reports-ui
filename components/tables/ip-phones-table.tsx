"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Pencil, Trash } from "lucide-react"
import type { IPPhone } from "@/types/entities"

interface IPPhonesTableProps {
  ipPhones: IPPhone[]
  onEditIPPhone: (ipPhone: IPPhone) => void
  onDeleteIPPhone: (ipPhoneId: number) => void
  loading?: boolean
  error?: string | null
}

export function IPPhonesTable({ 
  ipPhones, 
  onEditIPPhone, 
  onDeleteIPPhone,
  loading = false,
  error = null 
}: IPPhonesTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Number</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Branch</TableHead>
            <TableHead className="w-[70px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  กำลังโหลดข้อมูล...
                </div>
              </TableCell>
            </TableRow>
          ) : error ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center text-red-500">
                เกิดข้อผิดพลาด: {error}
              </TableCell>
            </TableRow>
          ) : ipPhones.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                ไม่พบข้อมูลโทรศัพท์
              </TableCell>
            </TableRow>
          ) : (
            ipPhones.map((ipPhone, index) => (
              <TableRow key={ipPhone.id}  onClick={() => onEditIPPhone(ipPhone)} className="cursor-pointer">
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{ipPhone.number}</TableCell>
                <TableCell>{ipPhone.name}</TableCell>
                <TableCell>{ipPhone.department_name}</TableCell>
                <TableCell>{ipPhone.branch_name}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        className="h-8 w-8 p-0"
                        disabled={loading}
                      >
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        onClick={() => onEditIPPhone(ipPhone)}
                        disabled={loading}
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        แก้ไข
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onDeleteIPPhone(ipPhone.id)} 
                        className="text-red-600"
                        disabled={loading}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        ลบ
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
