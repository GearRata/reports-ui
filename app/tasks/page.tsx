"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { TasksNewTable } from "@/components/tables/tasks-new-table";
import {
  useTasksNewPaginated,
  deleteTaskNew,
  updateTaskNew,
} from "@/lib/api/tasks";
import { PaginationWrapper } from "@/components/pagination/pagination-wrapper";
import { PaginationErrorBoundary } from "@/components/error-boundary/pagination-error-boundary";
import type { TaskWithPhone } from "@/types/entities";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SiteHeader } from "@/components/layout/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";

function Page() {
  const router = useRouter();
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
  } = useTasksNewPaginated({ page: 1, limit: 10 });

  const [searchQuery, setSearchQuery] = useState("");

  const handleAssignChange = async (taskId: number, assignTo: string) => {
  try {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      await updateTaskNew(taskId, {
        phone_id: task.phone_id,
        system_id: task.system_id,
        text: task.text,
        status: task.status,
        assign_to: assignTo || null,
        telegram: task.telegram
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
  }

  const handleDeleteTask = async (id: number) => {
    try {
      await deleteTaskNew(id);
      refreshTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Note: Server-side filtering will be implemented later
  // For now, we'll use client-side filtering with paginated data
  const filteredTasks = tasks.filter((task) =>
    task.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (task.ticket_no && task.ticket_no.toLowerCase().includes(searchQuery.toLowerCase())) ||
    task.id.toString().includes(searchQuery.toLowerCase()) ||
    (task.phone_name && task.phone_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (task.department_name && task.department_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (task.system_name && task.system_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (task.branch_name && task.branch_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (task.assign_to && task.assign_to.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (task.system_type && task.system_type.toLowerCase().includes(searchQuery.toLowerCase())) 
  );

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
                      placeholder="Filter tasks..."
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
                      tasks={filteredTasks}
                      onEditTask={handleEditTask}
                      onDeleteTask={handleDeleteTask}
                      onShowTask={handleShow}
                      onAssignChange={handleAssignChange}
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