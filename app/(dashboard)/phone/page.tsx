"use client";
import type React from "react";
import { Suspense, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { IPPhonesTable } from "@/components/tables/ip-phones-table";
// IPPhoneForm removed - using separate pages for create/edit
import { useIPPhonesPaginated, deleteIPPhone } from "@/app/api/phones";
import { PaginationWrapper } from "@/components/pagination/pagination-wrapper";
import { PaginationErrorBoundary } from "@/components/error-boundary/pagination-error-boundary";
import type { IPPhone } from "@/types/entities";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SiteHeader } from "@/components/layout/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useRouter, useSearchParams } from "next/navigation";
import { FileDown } from "lucide-react";
import { exportFilePhone } from "@/lib/utils";

// ——— แยกเนื้อหาออกมาเป็นคอมโพเนนต์ที่อยู่ใน Suspense ———
function IPPhonesPageContent() {
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
    ipPhones,
    currentPage,
    pageSize,
    totalItems,
    totalPages,
    loading,
    error,
    goToPage,
    changePageSize,
    refreshIPPhones,
    changeSearch,
  } = useIPPhonesPaginated({
    page: initialPage, // ← ใช้ค่าจาก URL
    limit: initialLimit, // ← ใช้ค่าจาก URL
    search: debouncedSearch,
  });

  // ✅ เวลาเปลี่ยนหน้า ให้เขียนพารามิเตอร์กลับลง URL ด้วย
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    params.set("limit", String(pageSize)); // คง limit เดิม
    router.replace(`/phone?${params.toString()}`);
    goToPage(page);
  };

  // ✅ เวลาเปลี่ยน page size ก็อัปเดต URL เช่นกัน
  const handlePageSizeChange = (size: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("limit", String(size));
    // ปกติควรรีเซ็ตไปหน้า 1
    params.set("page", "1");
    router.replace(`/phone?${params.toString()}`);
    changePageSize(size);
  };

  // อัปเดต search ใน hook เมื่อ debounce เปลี่ยน
  useEffect(() => {
    if (debouncedSearch !== lastSearchRef.current) {
      lastSearchRef.current = debouncedSearch;
      changeSearch(debouncedSearch);
    }
  }, [debouncedSearch, changeSearch]);

  const handleAddIPPhone = () => {
    router.push("/phone/create");
  };

  const handleEditIPPhone = (ipPhone: IPPhone) => {
    router.push(`/phone/edit/${ipPhone.id}`);
  };

  // handleIPPhoneSubmit removed - using separate pages for create/edit

  const handleDeleteIPPhone = async (id: number) => {
    try {
      await deleteIPPhone(id);
      refreshIPPhones();
    } catch (error) {
      console.error("Error deleting IP phone:", error);
    }
  };

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 53)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader title="IP Phones" />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-4 px-2">
              <div className="container mx-auto space-y-6">
                {/* Header with search and add button */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex flex-1 items-center space-x-2">
                    <Input
                      aria-label="ค้นหาโทรศัพท์ IP"
                      placeholder="ค้นหา"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-8 w-[150px] lg:w-[450px]"
                    />
                  </div>
                  <Button
                  onClick={exportFilePhone}
                  size="sm"
                  className="text-white bg-linear-to-r from-violet-500 to-pink-500"
                >
                    <FileDown />
                  </Button>
                  
                  <Button
                    onClick={handleAddIPPhone}
                    size="sm"
                    className="bg-linear-to-r/srgb from-indigo-500 to-teal-400 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add IP Phone
                  </Button>
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <PaginationErrorBoundary onRetry={refreshIPPhones}>
                    <IPPhonesTable
                      ipPhones={ipPhones}
                      onEditIPPhone={handleEditIPPhone}
                      onDeleteIPPhone={handleDeleteIPPhone}
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
                        itemName="โทรศัพท์"
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
      </SidebarInset>
    </SidebarProvider>
  );
}

export default function Page() {
  // ห่อด้วย Suspense เพื่อรองรับ useSearchParams แบบไม่มี warning
  return (
    <Suspense fallback={<div className="p-4">Loading IP phones…</div>}>
      <IPPhonesPageContent />
    </Suspense>
  );
}
