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
}

export function IPPhonesTable({ ipPhones, onEditIPPhone, onDeleteIPPhone }: IPPhonesTableProps) {
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
          {ipPhones.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                No IP phones found.
              </TableCell>
            </TableRow>
          ) : (
            ipPhones.map((ipPhone, index) => (
              <TableRow key={ipPhone.id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{ipPhone.number}</TableCell>
                <TableCell>{ipPhone.name}</TableCell>
                <TableCell>{ipPhone.department_name}</TableCell>
                <TableCell>{ipPhone.branch_name}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEditIPPhone(ipPhone)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDeleteIPPhone(ipPhone.id)} className="text-red-600">
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
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
