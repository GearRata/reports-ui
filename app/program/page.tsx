"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus } from "lucide-react"
import { ProgramsTable } from "@/components/tables/programs-table"
// ProgramFormNew removed - using separate pages for create/edit
import { useProgramsPaginated, deleteProgram } from "@/lib/api/programs"
// import { useType } from "@/lib/api/type";
import { PaginationWrapper } from "@/components/pagination/pagination-wrapper"
import { PaginationErrorBoundary } from "@/components/error-boundary/pagination-error-boundary"
import type { Program } from "@/types/entities"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { SiteHeader } from "@/components/layout/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { useRouter } from "next/navigation"

function Page() {
  const router = useRouter();
  const {
    programs,
    currentPage,
    pageSize,
    totalItems,
    totalPages,
    loading,
    error,
    goToPage,
    changePageSize,
    refreshPrograms,
  } = useProgramsPaginated({ page: 1, limit: 10 })
  
  const [searchQuery, setSearchQuery] = useState("")
  // const { Types } = useTypes();
  // Form states removed - using separate pages for create/edit
  
   const handleAddProgram = () => {
    router.push('/program/create')
  }

  const handleEditProgram = (program: Program) => {
    router.push(`/program/edit/${program.id}`)
  }

  // handleProgramSubmit removed - using separate pages for create/edit

  const handleDeleteProgram = async (id: number) => {
    try {
      await deleteProgram(id)
      refreshPrograms()
    } catch (error) {
      console.error("Error deleting program:", error)
    }
  }

  // Note: Server-side filtering will be implemented later
  // For now, we'll use client-side filtering with paginated data
  const filteredPrograms = programs.filter((program) => 
    program.name.toLowerCase().includes(searchQuery.toLowerCase())
  )


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
       <SiteHeader title="Programs" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-6">
            <div className="container mx-auto space-y-6">
              {/* Header with search and add button */}
              <div className="flex items-center justify-between">
                <div className="flex flex-1 items-center space-x-2">
                  <Input
                    placeholder="Filter problem..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-8 w-[150px] lg:w-[450px]"
                  />
                </div>
                <Button onClick={handleAddProgram} size="sm" className="ml-auto h-8 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Problem
                </Button>
              </div>

              {/* Content */}
              <div className="space-y-4">
                <PaginationErrorBoundary onRetry={refreshPrograms}>
                  <ProgramsTable
                    programs={filteredPrograms}
                    // types={Types}
                    onEditProgram={handleEditProgram}
                    onDeleteProgram={handleDeleteProgram}
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
                      itemName="โปรแกรม"
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
  )
}

export default Page
