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
    <div className="flex flex-col text-sm text-muted-foreground">
        แสดง {startItem.toLocaleString()}-{endItem.toLocaleString()} จาก {totalItems.toLocaleString()} {itemName}
        <div>
          (หน้า {currentPage} จาก {totalPages})
        </div>
        
    </div>
  )
}