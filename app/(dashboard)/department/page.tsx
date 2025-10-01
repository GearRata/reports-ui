"use client";

import type React from "react";
import { Suspense, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { DepartmentsTable } from "@/components/tables/departments-table";
// DepartmentFormNew removed - using separate pages for create/edit
import {
  useDepartmentsPaginated,
  deleteDepartment,
} from "@/hooks/useDepartments";
import { PaginationWrapper } from "@/components/pagination/pagination-wrapper";
import { PaginationErrorBoundary } from "@/components/error-boundary/pagination-error-boundary";
import type { Department } from "@/types/entities";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SiteHeader } from "@/components/layout/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useRouter, useSearchParams } from "next/navigation";
import { FileDown  } from "lucide-react";
import { exportFileDepartment } from "@/lib/utils";

// ——— แยกเนื้อหาออกมาเป็นคอมโพเนนต์ที่อยู่ใน Suspense ———
function DepartmentsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const lastSearchRef = useRef<string>("");

  // ✅ อ่าน page & limit จาก URL
  const initialPage = Math.max(
    1,
    parseInt(searchParams.get("page") ?? "1", 10)
  );
  const allowed = [10, 20, 50, 100];
  const parsedLimit = parseInt(searchParams.get("limit") ?? "10", 10);
  const initialLimit = allowed.includes(parsedLimit) ? parsedLimit : 10;

  // debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const {
    departments,
    currentPage,
    pageSize,
    totalItems,
    totalPages,
    loading,
    error,
    goToPage,
    changePageSize,
    refreshDepartments,
    changeSearch,
  } = useDepartmentsPaginated({
    page: initialPage, // ← ใช้ค่าจาก URL
    limit: initialLimit, // ← ใช้ค่าจาก URL
    search: debouncedSearch,
  });

  // ✅ เวลาเปลี่ยนหน้า ให้เขียนพารามิเตอร์กลับลง URL ด้วย
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    params.set("limit", String(pageSize)); // คง limit เดิม
    router.replace(`/department?${params.toString()}`);
    goToPage(page);
  };

  // ✅ เวลาเปลี่ยน page size ก็อัปเดต URL เช่นกัน
  const handlePageSizeChange = (size: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("limit", String(size));
    // ปกติควรรีเซ็ตไปหน้า 1
    params.set("page", "1");
    router.replace(`/department?${params.toString()}`);
    changePageSize(size);
  };

  // อัปเดต search ใน hook เมื่อ debounce เปลี่ยน
  useEffect(() => {
    if (debouncedSearch !== lastSearchRef.current) {
      lastSearchRef.current = debouncedSearch;
      changeSearch(debouncedSearch);
    }
  }, [debouncedSearch, changeSearch]);

  const handleAddDepartment = () => {
    router.push("/department/create");
  };

  const handleEditDepartment = (department: Department) => {
    router.push(`/department/edit/${department.id}`);
  };

  // handleDepartmentSubmit removed - using separate pages for create/edit

  const handleDeleteDepartment = async (id: number) => {
    try {
      await deleteDepartment(id);
      refreshDepartments();
    } catch (error) {
      console.error("Error deleting department:", error);
    }
  };

  return (
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-4 px-2">
              <div className="container mx-auto space-y-6">
                {/* Header with search and add button */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex flex-1 items-center space-x-2">
                    <Input
                      aria-label="ค้นหาแผนก"
                      placeholder="ค้นหา"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-8 w-[150px] lg:w-[450px]"
                    />
                  </div>
                  <Button
                    onClick={exportFileDepartment}
                    size="sm"
                    className="text-white bg-linear-to-r from-violet-500 to-pink-500  hover:scale-110"
                  >
                    <FileDown  className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={handleAddDepartment}
                    size="sm"
                    className="bg-linear-to-r/srgb from-indigo-500 to-teal-400 text-white  hover:scale-110"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Department
                  </Button>
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <PaginationErrorBoundary onRetry={refreshDepartments}>
                    <DepartmentsTable
                      departments={departments}
                      onEditDepartment={handleEditDepartment}
                      onDeleteDepartment={handleDeleteDepartment}
                      loading={loading}
                      error={error}
                    />

                    {!loading && !error && (
                      <PaginationWrapper
                        currentPage={currentPage}
                        pageSize={pageSize}
                        totalItems={totalItems}
                        totalPages={totalPages}
                        onPageChange={handlePageChange} // ← เปลี่ยนเป็น handler ใหม่
                        onPageSizeChange={handlePageSizeChange} // ← เปลี่ยนเป็น handler ใหม่
                        disabled={loading}
                        itemName="แผนก"
                        pageSizeOptions={[10, 20, 50, 100]}
                      />
                    )}
                  </PaginationErrorBoundary>
                </div>

                {/* Form removed - using separate pages for create/edit */}
              </div>
            </div>
          </div>
        </div>
  );
}

export default function Page() {
  // ห่อด้วย Suspense เพื่อรองรับ useSearchParams แบบไม่มี warning
  return (
    <Suspense fallback={<div className="p-4">Loading departments…</div>}>
      <DepartmentsPageContent />
    </Suspense>
  );
}
