"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { DepartmentsTable } from "@/components/tables/departments-table";
// DepartmentFormNew removed - using separate pages for create/edit
import {
  useDepartmentsPaginated,
  deleteDepartment,
} from "@/lib/api/departments";
import { PaginationWrapper } from "@/components/pagination/pagination-wrapper";
import { PaginationErrorBoundary } from "@/components/error-boundary/pagination-error-boundary";
import type { Department } from "@/types/entities";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SiteHeader } from "@/components/layout/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";

function Page() {
  const router = useRouter();
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
  } = useDepartmentsPaginated({ page: 1, limit: 10 });

  const [searchQuery, setSearchQuery] = useState("");
  // Form states removed - using separate pages for create/edit

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

  // Note: Server-side filtering will be implemented later
  // For now, we'll use client-side filtering with paginated data
  const filteredDepartments = departments.filter((department) =>
    department.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    department.branch_name.toLowerCase().includes(searchQuery.toLowerCase())
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
        <SiteHeader title="Departments" />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-6">
              <div className="container mx-auto space-y-6">
                {/* Header with search and add button */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-1 items-center space-x-2">
                    <Input
                      placeholder="Filter departments..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-8 w-[150px] lg:w-[450px]"
                    />
                  </div>
                  <Button
                    onClick={handleAddDepartment}
                    size="sm"
                    className="ml-auto h-8 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Department
                  </Button>
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <PaginationErrorBoundary onRetry={refreshDepartments}>
                    <DepartmentsTable
                      departments={filteredDepartments}
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
                        onPageChange={goToPage}
                        onPageSizeChange={changePageSize}
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
      </SidebarInset>
    </SidebarProvider>
  );
}

export default Page;
