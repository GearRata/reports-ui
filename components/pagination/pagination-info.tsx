"use client"

interface PaginationInfoProps {
  currentPage: number
  pageSize: number
  totalItems: number
  itemName?: string
}

export function PaginationInfo({
  currentPage,
  pageSize,
  totalItems,
  itemName = "รายการ",
}: PaginationInfoProps) {
  if (totalItems === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        ไม่พบ{itemName}
      </div>
    )
  }

  const startItem = (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalItems)
  const totalPages = Math.ceil(totalItems / pageSize)

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <span>
        แสดง {startItem.toLocaleString()}-{endItem.toLocaleString()} จาก {totalItems.toLocaleString()} {itemName}
      </span>
      <span className="text-xs">
        (หน้า {currentPage} จาก {totalPages})
      </span>
    </div>
  )
}