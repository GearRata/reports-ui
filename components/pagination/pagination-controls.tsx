"use client"

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface PaginationControlsProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  disabled?: boolean
  showPageNumbers?: boolean
  maxVisiblePages?: number
}

export function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
  disabled = false,
  showPageNumbers = true,
  maxVisiblePages = 5,
}: PaginationControlsProps) {
  const handlePageClick = (page: number) => {
    if (!disabled && page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange(page)
    }
  }

  const getVisiblePages = () => {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const half = Math.floor(maxVisiblePages / 2)
    let start = Math.max(1, currentPage - half)
    const end = Math.min(totalPages, start + maxVisiblePages - 1)

    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1)
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
  }

  const visiblePages = getVisiblePages()
  const showStartEllipsis = visiblePages[0] > 2
  const showEndEllipsis = visiblePages[visiblePages.length - 1] < totalPages - 1

  if (totalPages <= 1) {
    return null
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => handlePageClick(currentPage - 1)}
            className={
              disabled || currentPage <= 1
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
          />
        </PaginationItem>

        {showPageNumbers && (
          <>
            {/* First page */}
            {visiblePages[0] > 1 && (
              <PaginationItem>
                <PaginationLink
                  onClick={() => handlePageClick(1)}
                  isActive={currentPage === 1}
                  className={disabled ? "pointer-events-none opacity-50" : "cursor-pointer"}
                >
                  1
                </PaginationLink>
              </PaginationItem>
            )}

            {/* Start ellipsis */}
            {showStartEllipsis && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            {/* Visible pages */}
            {visiblePages.map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => handlePageClick(page)}
                  isActive={currentPage === page}
                  className={disabled ? "pointer-events-none opacity-50" : "cursor-pointer"}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}

            {/* End ellipsis */}
            {showEndEllipsis && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            {/* Last page */}
            {visiblePages[visiblePages.length - 1] < totalPages && (
              <PaginationItem>
                <PaginationLink
                  onClick={() => handlePageClick(totalPages)}
                  isActive={currentPage === totalPages}
                  className={disabled ? "pointer-events-none opacity-50" : "cursor-pointer"}
                >
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            )}
          </>
        )}

        <PaginationItem>
          <PaginationNext
            onClick={() => handlePageClick(currentPage + 1)}
            className={
              disabled || currentPage >= totalPages
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}