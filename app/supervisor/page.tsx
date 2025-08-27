"use client";

import type React from "react";
import { BranchesTable } from "@/components/tables/branches-table";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SiteHeader } from "@/components/layout/site-header";
// BranchForm removed - using separate pages for create/edit
import { useBranches, deleteBranch } from "@/lib/api/branches";
import type { Branch } from "@/types/entities";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

function Page() {
  const router = useRouter();
  const { branches, refreshBranches } = useBranches();
  // Form states removed - using separate pages for create/edit

  const handleAddBranch = () => {
    router.push("/branches/create");
  };

  const handleEditBranch = (branch: Branch) => {
    // Navigate to edit page with branch ID
    router.push(`/branches/edit/${branch.id}`);
  };

  // handleBranchSubmit removed - using separate pages for create/edit

  const handleDeleteBranch = async (id: number) => {
    try {
      await deleteBranch(id);
      refreshBranches();
    } catch (error) {
      console.error("Error deleting branch:", error);
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
        <SiteHeader title="Supervisor" />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-4 px-2">
              <div className="container mx-auto space-y-6">
                {/* Header with search and add button */}
                <div className="flex items-center justify-between">
                  <Button
                    onClick={handleAddBranch}
                    size="sm"
                    className="ml-auto h-8 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2 " />
                    Add Supervisor
                  </Button>
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <BranchesTable
                    branches={branches}
                    onEditBranch={handleEditBranch}
                    onDeleteBranch={handleDeleteBranch}
                  />
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
