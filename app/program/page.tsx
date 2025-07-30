"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus } from "lucide-react"
import { ProgramsTable } from "@/components/tables/programs-table"
import { ProgramFormNew } from "@/components/entities-form"
import { usePrograms, addProgram, updateProgram, deleteProgram } from "@/api/route"
import type { Program } from "@/types/entities"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { SiteHeader } from "@/components/layout/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

function Page() {
  const { programs, refreshPrograms } = usePrograms()
  const [searchQuery, setSearchQuery] = useState("")
  const [isProgramFormOpen, setIsProgramFormOpen] = useState(false)
  const [editingProgram, setEditingProgram] = useState<Program | null>(null)
  
   const handleAddProgram = () => {
    setEditingProgram(null)
    setIsProgramFormOpen(true)
  }

  const handleEditProgram = (program: Program) => {
    setEditingProgram(program)
    setIsProgramFormOpen(true)
  }

  const handleProgramSubmit = async (data: { name: string; id?: number }) => {
    try {
      if (data.id) {
        await updateProgram(data.id, { name: data.name })
      } else {
        await addProgram({ name: data.name })
      }
      refreshPrograms()
    } catch (error) {
      console.error("Error saving program:", error)
    }
  }

  const handleDeleteProgram = async (id: number) => {
    try {
      await deleteProgram(id)
      refreshPrograms()
    } catch (error) {
      console.error("Error deleting program:", error)
    }
  }

    const filteredPrograms = programs.filter((program) => program.name.
    toLowerCase().includes(searchQuery.toLowerCase()))

  

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
                    placeholder="Filter programs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-8 w-[150px] lg:w-[450px]"
                  />
                </div>
                <Button onClick={handleAddProgram} size="sm" className="ml-auto h-8 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Program
                </Button>
              </div>

              {/* Content */}
              <div className="space-y-4">
                <ProgramsTable
                  programs={filteredPrograms}
                  onEditProgram={handleEditProgram}
                  onDeleteProgram={handleDeleteProgram}
                />
              </div>

              {/* Form */}
              <ProgramFormNew
                open={isProgramFormOpen}
                onOpenChange={setIsProgramFormOpen}
                program={editingProgram}
                onSubmit={handleProgramSubmit}
              />
            </div>
          </div>
        </div>
      </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default Page
