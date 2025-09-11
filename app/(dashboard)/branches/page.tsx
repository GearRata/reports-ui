"use client";

import type React from "react";

import { useState } from "react";
import { BranchesTable } from "@/components/tables/branches-table";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SiteHeader } from "@/components/layout/site-header";
// BranchForm removed - using separate pages for create/edit
import { useBranches, deleteBranch } from "@/app/api/branches";
import type { Branch } from "@/types/entities";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { FileDown  } from "lucide-react";
import { exportFileBranch } from "@/lib/utils";

function Page() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const { branches, refreshBranches } = useBranches();

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

  const filteredBranches = branches.filter((branch) =>
    branch.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <SiteHeader title="Branch Offices" />
        </div>
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-4 px-2">
              <div className="container mx-auto space-y-6">
                {/* Header with search and add button */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex flex-1 items-center space-x-2">
                    <Input
                      placeholder="Filter branches..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-8 w-[150px] lg:w-[450px]"
                    />
                  </div>
                  <Button
                    onClick={exportFileBranch}
                    size="sm"
                    className="text-white bg-linear-to-r from-violet-500 to-pink-500"
                  >
                    <FileDown  className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={handleAddBranch}
                    size="sm"
                    className="bg-linear-to-r/srgb from-indigo-500 to-teal-400 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2 " />
                    Add Branch
                  </Button>
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <BranchesTable
                    branches={filteredBranches}
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
