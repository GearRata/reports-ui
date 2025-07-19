"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { IPPhonesTable } from "@/components/tables/ip-phones-table";
import { IPPhoneForm } from "@/components/entities-form";
import {
  useIPPhones,
  addIPPhone,
  updateIPPhone,
  deleteIPPhone,
  useBranches,
  useDepartments,
} from "@/api/route";
import type { IPPhone } from "@/types/entities";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SiteHeader } from "@/components/layout/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";


function Page() {
  const { branches } = useBranches()
  const { departments } = useDepartments()
  const { ipPhones, refreshIPPhones } = useIPPhones();
  const [searchQuery, setSearchQuery] = useState("");
  const [isIPPhoneFormOpen, setIsIPPhoneFormOpen] = useState(false);
  const [editingIPPhone, setEditingIPPhone] = useState<IPPhone | null>(null);


  const handleAddIPPhone = () => {
    setEditingIPPhone(null);
    setIsIPPhoneFormOpen(true);
  };

  const handleEditIPPhone = (ipPhone: IPPhone) => {
    setEditingIPPhone(ipPhone);
    setIsIPPhoneFormOpen(true);
  };


  const handleIPPhoneSubmit = async (data: {
    number: number;
    name: string;
    id?: number;
    branch_id: number;
    department_id: number;
  }) => {
    try {
      if (data.id) {
        await updateIPPhone(data.id, { number: data.number, name: data.name, department_id: data.department_id, branch_id: data.branch_id });
      } else {
        console.log("data", data)
        await addIPPhone({ number: data.number, name: data.name, department_id: data.department_id, branch_id: data.branch_id });
      }
      refreshIPPhones();
    } catch (error) {
      console.error("Error saving IP phone:", error);
    }
  };

  const handleDeleteIPPhone = async (id: number) => {
    try {
      await deleteIPPhone(id);
      refreshIPPhones();
    } catch (error) {
      console.error("Error deleting IP phone:", error);
    }
  };

  const filteredIPPhones = ipPhones.filter((ipPhone) =>
    (ipPhone.number + "").toLowerCase().includes(searchQuery.toLowerCase())
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
        <SiteHeader title="IP Phones" />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-6">
              <div className="container mx-auto space-y-6">
                {/* Header with search and add button */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-1 items-center space-x-2">
                    <Input
                      placeholder="Filter IP phones..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-8 w-[150px] lg:w-[450px]"
                    />
                  </div>
                  <Button
                    onClick={handleAddIPPhone}
                    size="sm"
                    className="ml-auto h-8"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add IP Phone
                  </Button>
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <IPPhonesTable
                    ipPhones={filteredIPPhones}
                    onEditIPPhone={handleEditIPPhone}
                    onDeleteIPPhone={handleDeleteIPPhone}
                  />
                </div>

                {/* Form */}
                <IPPhoneForm
                  open={isIPPhoneFormOpen}
                  onOpenChange={setIsIPPhoneFormOpen}
                  ipPhone={editingIPPhone}
                  onSubmit={handleIPPhoneSubmit}
                  branches={branches}
                  departments={departments}
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
