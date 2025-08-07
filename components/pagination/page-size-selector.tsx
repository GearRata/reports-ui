"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface PageSizeSelectorProps {
  pageSize: number
  onPageSizeChange: (size: number) => void
  options?: number[]
  disabled?: boolean
}

export function PageSizeSelector({
  pageSize,
  onPageSizeChange,
  options = [10, 20, 50, 100],
  disabled = false,
}: PageSizeSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium whitespace-nowrap">แสดง</span>
      <Select
        value={pageSize.toString()}
        onValueChange={(value) => onPageSizeChange(Number(value))}
        disabled={disabled}
      >
        <SelectTrigger className="h-8 w-[70px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent side="top">
          {options.map((size) => (
            <SelectItem key={size} value={size.toString()}>
              {size}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <span className="text-sm font-medium whitespace-nowrap">รายการ</span>
    </div>
  )
}