// app/tasks/page.tsx
"use client";

import type React from "react";
import { Suspense, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { TasksNewTable } from "@/components/tables/tasks-new-table";
import { useTasksNewPaginated, deleteTaskNew } from "@/app/api/tasks";
import { updateTaskAssignTo } from "@/app/api/tasks";
import { PaginationWrapper } from "@/components/pagination/pagination-wrapper";
import { PaginationErrorBoundary } from "@/components/error-boundary/pagination-error-boundary";
import type { TaskWithPhone } from "@/types/entities";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SiteHeader } from "@/components/layout/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useRouter, useSearchParams } from "next/navigation";
import { FileDown  } from "lucide-react";
import { exportFileTask } from "@/lib/utils";

// ——— แยกเนื้อหาออกมาเป็นคอมโพเนนต์ที่อยู่ใน Suspense ———
function TasksPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "progress" | "done">(
    "all"
  );

  const lastSearchRef = useRef<string>("");
  // ✅ อ่าน page & limit จาก URL
  const initialPage = Math.max(
    1,
    parseInt(searchParams.get("page") ?? "1", 10)
  );
  const allowed = [10, 20, 50, 100];
  const parsedLimit = parseInt(searchParams.get("limit") ?? "10", 10);
  const initialLimit = allowed.includes(parsedLimit) ? parsedLimit : 10;

  // อ่านค่า status จาก URL เมื่อเข้าเพจหรือเมื่อ URL เปลี่ยน
  const urlStatusRef = useRef<string | null>(null);
  useEffect(() => {
    const currentStatus = searchParams.get("status");
    if (urlStatusRef.current !== currentStatus) {
      urlStatusRef.current = currentStatus;
      const raw = (currentStatus || "all").toLowerCase();
      const normalized =
        raw === "pending" || raw === "progress" || raw === "done"
          ? (raw as "pending" | "progress" | "done" )
          : "all";
      setStatusFilter(normalized);
    }
  }, [searchParams]);

  // debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const {
    tasks,
    currentPage,
    pageSize,
    totalItems,
    totalPages,
    loading,
    error,
    goToPage,
    changePageSize,
    refreshTasks,
    changeSearch,
    changeStatus,
  } = useTasksNewPaginated({
    page: initialPage, // ← ใช้ค่าจาก URL
    limit: initialLimit, // ← ใช้ค่าจาก URL
    search: debouncedSearch,
    status: statusFilter,
  });

  // ✅ เวลาเปลี่ยนหน้า ให้เขียนพารามิเตอร์กลับลง URL ด้วย
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    params.set("limit", String(pageSize)); // คง limit เดิม
    // (จะใส่ status/search ต่อด้วยก็ได้)
    router.replace(`/tasks?${params.toString()}`);
    goToPage(page);
  };

  // ✅ เวลาเปลี่ยน page size ก็อัปเดต URL เช่นกัน
  const handlePageSizeChange = (size: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("limit", String(size));
    // ปกติควรรีเซ็ตไปหน้า 1
    params.set("page", "1");
    router.replace(`/tasks?${params.toString()}`);
    changePageSize(size);
    // ไม่ต้อง goToPage(1) ตรงนี้ก็ได้ เพราะ PaginationWrapper จะเรียก onPageChange(1) ให้อีกที
  };

  // อัปเดต search ใน hook เมื่อ debounce เปลี่ยน
  useEffect(() => {
    if (debouncedSearch !== lastSearchRef.current) {
      lastSearchRef.current = debouncedSearch;
      changeSearch(debouncedSearch);
    }
  }, [debouncedSearch, changeSearch]);

  // อัปเดต status ใน hook เมื่อ statusFilter เปลี่ยน (ทั้งจาก URL และ dropdown)
  const statusRef = useRef(statusFilter);
  useEffect(() => {
    if (statusRef.current !== statusFilter) {
      statusRef.current = statusFilter;
      changeStatus?.(statusFilter);
    }
  }, [statusFilter, changeStatus]);

  const handleAssignChange = async (
    taskId: number,
    assignTo: string,
    assignToId: number
  ) => {
    try {
      const task = tasks.find((t) => t.id === taskId);
      if (task) {
        await updateTaskAssignTo(taskId, {
          assignedto_id: assignToId,
          assign_to: assignTo || null,
          update_telegram: true,
        });
        refreshTasks();
      }
    } catch (error) {
      console.error("Error updating assignment:", error);
    }
  };

  const handleAddTask = () => router.push("/tasks/create");
  const handleEditTask = (task: TaskWithPhone) =>
    router.push(`/tasks/edit/${task.id}`);
  const handleShow = (task: TaskWithPhone) =>
    router.push(`/tasks/show/${task.id}`);
  // const handleSolution = () => router.push("solution/create");

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
        <div>
          <SiteHeader title="Tasks" />
        </div>
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-2 px-2">
              <div className="container mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex flex-1 items-center space-x-2">
                    <Input
                      aria-label="ค้นหารายการงาน"
                      placeholder="ค้นหา"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-8 w-[150px] lg:w-[450px]"
                    />
                  </div>
                  <Button 
                    onClick={exportFileTask}
                    size="sm"
                    className="text-white bg-linear-to-r from-violet-500 to-pink-500"
                  >
                    <FileDown className="h-4 w-4"/>
                  </Button>
                  <Button
                    onClick={handleAddTask}
                    size="sm"
                    className="bg-linear-to-r/srgb from-indigo-500 to-teal-400 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Task
                  </Button>
                </div>

                {/* Table & Pagination */}
                <div className="space-y-4">
                  <PaginationErrorBoundary onRetry={refreshTasks}>
                    <TasksNewTable
                      tasks={tasks}
                      onEditTask={handleEditTask}
                      onDeleteTask={async (id) => {
                        await deleteTaskNew(id);
                        refreshTasks();
                      }}
                      onShowTask={handleShow}
                      // onSolution={handleSolution}
                      onAssignChange={handleAssignChange}
                      onStatusFilterChange={(s) => {
                        // เมื่อเปลี่ยนจาก dropdown ก็ยิง GET เหมือนเดิม (ผ่าน changeStatus)
                        setStatusFilter(s as "all" | "pending" | "progress" |"done");

                        // อัปเดต URL ให้ตรงกัน (optional แต่แนะนำ)
                        const params = new URLSearchParams(
                          searchParams.toString()
                        );
                        if (s === "all") params.delete("status");
                        else params.set("status", s);
                        router.replace(`/tasks?${params.toString()}`);
                      }}
                      statusFilter={statusFilter}
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
                        itemName="งาน"
                        pageSizeOptions={[10, 20, 50, 100]}
                      />
                    )}
                  </PaginationErrorBoundary>
                </div>
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
    <Suspense fallback={<div className="p-4">Loading tasks…</div>}>
      <TasksPageContent />
    </Suspense>
  );
}
