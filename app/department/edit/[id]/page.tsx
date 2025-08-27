"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SiteHeader } from "@/components/layout/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useRouter, useParams } from "next/navigation";
import {
  getDepartmentById,
  updateDepartment,
} from "@/lib/api/departments";
import { useBranchesForDropdown } from "@/lib/api/branches";
import type { Department } from "@/types/entities";

function EditDepartmentPage() {
  const router = useRouter();
  const params = useParams();
  const departmentId = params.id as string;

  const { branches, loading: branchesLoading } = useBranchesForDropdown();

  const [department, setDepartment] = useState<Department | null>(null);
  const [name, setName] = useState("");
  const [branchId, setBranchId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load the specific department data
  useEffect(() => {
    const loadDepartment = async () => {
      if (departmentId) {
        try {
          const departmentData = await getDepartmentById(Number(departmentId));
          setDepartment(departmentData);
          setName(departmentData.name);
          setBranchId(departmentData.branch_id.toString());
          setLoading(false);
        } catch (error) {
          console.error("Error loading department:", error);
          setLoading(false);
        }
      }
    };

    loadDepartment();
  }, [departmentId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!department) return;
    
    setIsSubmitting(true);

    try {
      await updateDepartment(department.id, { 
        name, 
        branch_id: Number(branchId) 
      });
      // Navigate back to departments page
      router.push('/department');
    } catch (error) {
      console.error("Error updating department:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/department');
  };

  if (loading) {
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
          <SiteHeader title="Edit Department" />
          <div className="flex flex-1 flex-col items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading department...</p>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  if (!department) {
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
          <SiteHeader title="Edit Department" />
          <div className="flex flex-1 flex-col items-center justify-center">
            <div className="text-center">
              <p className="text-red-500 mb-4">Department not found</p>
              <Button onClick={handleCancel}>Back to Departments</Button>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

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
        <SiteHeader title="Edit Department" />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-4 px-2">
              <div className="container mx-auto max-w-2xl">

                {/* Edit Department Form */}
                <Card>
                  <CardHeader>
                    <CardTitle>Edit Department: {department.name}</CardTitle>
                    <CardDescription>
                      Update the department details below.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Department Name */}
                      <div className="space-y-2">
                        <Label htmlFor="name">Department Name *</Label>
                        <Input
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Enter department name"
                          required
                        />
                      </div>

                      {/* Branch Selection */}
                      <div className="space-y-2">
                        <Label htmlFor="branch">Branch *</Label>
                        <Select
                          value={branchId}
                          onValueChange={(value) => setBranchId(value)}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue 
                              placeholder={branchesLoading ? "Loading..." : "Select Branch"} 
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {branches.map((branch) => (
                              <SelectItem key={branch.id} value={branch.id.toString()}>
                                {branch.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Form Actions */}
                      <div className="flex justify-end gap-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleCancel}
                          disabled={isSubmitting}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={isSubmitting || !name.trim() || !branchId}
                          className="text-white"
                        >
                          {isSubmitting ? "Updating..." : "Update Department"}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default EditDepartmentPage;