"use client";

import { PaginationControls } from "./pagination-controls";
import { PaginationInfo } from "./pagination-info";
import { PageSizeSelector } from "./page-size-selector";

interface PaginationWrapperProps {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  disabled?: boolean;
  itemName?: string;
  showPageSizeSelector?: boolean;
  showInfo?: boolean;
  pageSizeOptions?: number[];
}

export function PaginationWrapper({
  currentPage,
  pageSize,
  totalItems,
  totalPages,
  onPageChange,
  onPageSizeChange,
  disabled = false,
  itemName = "รายการ",
  showPageSizeSelector = true,
  showInfo = true,
  pageSizeOptions = [10, 20, 50, 100],
}: PaginationWrapperProps) {
  const handlePageSizeChange = (newSize: number) => {
    onPageSizeChange(newSize);
    // Reset to first page when changing page size
    if (currentPage > 1) {
      onPageChange(1);
    }
  };

  return (
    <div className="flex flex-wrap justify-between items-center">
      <div>
        {showInfo && (
          <PaginationInfo
            currentPage={currentPage}
            pageSize={pageSize}
            totalItems={totalItems}
            itemName={itemName}
          />
        )}
      </div>
      <div>
        {showPageSizeSelector && (
          <PageSizeSelector
            pageSize={pageSize}
            onPageSizeChange={handlePageSizeChange}
            options={pageSizeOptions}
            disabled={disabled}
          />
        )}
      </div>
      <div className="mt-2">
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
