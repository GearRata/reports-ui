"use client";

import type React from "react";

import { useState } from "react";
import { BranchesTable } from "@/components/tables/branches-table";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SiteHeader } from "@/components/layout/site-header";
import { BranchForm } from "@/components/entities-form";
import {
  useBranches,
  addBranch,
  updateBranch,
  deleteBranch,
} from "@/api/route";
import type { Branch } from "@/types/entities";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

function Page() {
  const [searchQuery, setSearchQuery] = useState("");
  const { branches, refreshBranches } = useBranches();
  const [isBranchFormOpen, setIsBranchFormOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);

  const handleAddBranch = () => {
    setEditingBranch(null);
    setIsBranchFormOpen(true);
  };

  const handleEditBranch = (branch: Branch) => {
    setEditingBranch(branch);
    setIsBranchFormOpen(true);
  };

  const handleBranchSubmit = async (data: { name: string; id?: number }) => {
    try {
      if (data.id) {
        await updateBranch(data.id, { name: data.name });
      } else {
        await addBranch({ name: data.name });
      }
      refreshBranches();
    } catch (error) {
      console.error("Error saving branch:", error);
    }
  };

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
          "--sidebar-width": "calc(var(--spacing) * 60)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader title="Branch Offices" />
                <div className="flex flex-1 flex-col">
                  <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-6">
                      <div className="container mx-auto space-y-6">
                        {/* Header with search and add button */}
                        <div className="flex items-center justify-between">
                          <div className="flex flex-1 items-center space-x-2">
                            <Input
                              placeholder="Filter branches..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="h-8 w-[150px] lg:w-[450px]"
                            />
                          </div>
                          <Button
                            onClick={handleAddBranch}
                            size="sm"
                            className="ml-auto h-8"
                          >
                            <Plus className="h-4 w-4 mr-2" />
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

                        {/* Form */}
                        <BranchForm
                          open={isBranchFormOpen}
                          onOpenChange={setIsBranchFormOpen}
                          branch={editingBranch}
                          onSubmit={handleBranchSubmit}
                        />
                      </div>
                    </div>
                  </div>
                </div>
             
      </SidebarInset>
    </SidebarProvider>
  );
}

export default Page;
