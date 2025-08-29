"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { TasksNewTable } from "@/components/tables/tasks-new-table";
import { useTasksNewPaginated, deleteTaskNew } from "@/lib/api/tasks";
import { updateTaskAssignTo } from "@/lib/api/tasks";
import { PaginationWrapper } from "@/components/pagination/pagination-wrapper";
import { PaginationErrorBoundary } from "@/components/error-boundary/pagination-error-boundary";
import type { TaskWithPhone } from "@/types/entities";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SiteHeader } from "@/components/layout/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";

function Page() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const lastSearchRef = useRef<string>("");

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
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
  } = useTasksNewPaginated({ page: 1, limit: 10, search: debouncedSearch, status: statusFilter });

  // Update search when debounced value changes
  useEffect(() => {
    if (debouncedSearch !== lastSearchRef.current) {
      lastSearchRef.current = debouncedSearch;
      changeSearch(debouncedSearch);
    }
  }, [debouncedSearch, changeSearch]);

  // Update status filter
  useEffect(() => {
    if (changeStatus) {
      changeStatus(statusFilter);
    }
  }, [statusFilter, changeStatus]);

  const handleAssignChange = async (taskId: number, assignTo: string, assignToId: number) => {
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

  const handleAddTask = () => {
    router.push("/tasks/create");
  };

  const handleEditTask = (task: TaskWithPhone) => {
    router.push(`/tasks/edit/${task.id}`);
  };

  const handleShow = (task: TaskWithPhone) => {
    router.push(`/tasks/show/${task.id}`);
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await deleteTaskNew(id);
      refreshTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 60)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader title="Tasks" />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-2 px-2">
              <div className="container mx-auto space-y-6">
                {/* Header with search and add button */}
                <div className="flex items-center justify-between">
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
                    onClick={handleAddTask}
                    size="sm"
                    className="ml-auto h-8 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Task
                  </Button>
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <PaginationErrorBoundary onRetry={refreshTasks}>
                    <TasksNewTable
                      tasks={tasks}
                      onEditTask={handleEditTask}
                      onDeleteTask={handleDeleteTask}
                      onShowTask={handleShow}
                      onAssignChange={handleAssignChange}
                      onStatusFilterChange={setStatusFilter}
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
                        onPageChange={goToPage}
                        onPageSizeChange={changePageSize}
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

export default Page;
