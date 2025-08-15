"use client";

import type React from "react";
import { useState } from "react";
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
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { addDepartment } from "@/lib/api/departments";
import { useBranchesForDropdown } from "@/lib/api/branches";

function CreateDepartmentPage() {
  const router = useRouter();
  const { branches, loading: branchesLoading } = useBranchesForDropdown();
  
  const [name, setName] = useState("");
  const [branchId, setBranchId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await addDepartment({ 
        name, 
        branch_id: Number(branchId) 
      });
      // Navigate back to departments page
      router.push('/department');
    } catch (error) {
      console.error("Error creating department:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/department");
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
        <SiteHeader title="Create New Department" />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-6">
              <div className="container mx-auto max-w-2xl">
                {/* Back Button */}
                <div className="mb-6">
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Departments
                  </Button>
                </div>

                {/* Create Department Form */}
                <Card>
                  <CardHeader>
                    <CardTitle>Create New Department</CardTitle>
                    <CardDescription>
                      Fill in the details to create a new department.
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
                          {isSubmitting ? "Creating..." : "Create Department"}
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

export default CreateDepartmentPage;