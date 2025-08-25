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
import { addIPPhone } from "@/lib/api/phones";
import { useBranchesForDropdown } from "@/lib/api/branches";
import { useDepartmentsForDropdown } from "@/lib/api/departments";

function CreatePhonePage() {
  const router = useRouter();
  const { branches, loading: branchesLoading } = useBranchesForDropdown();
  const { departments, loading: departmentsLoading } = useDepartmentsForDropdown();
  
  const [number, setNumber] = useState("");
  const [name, setName] = useState("");
  const [branchId, setBranchId] = useState<string>("");
  const [departmentId, setDepartmentId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await addIPPhone({ 
        number: Number(number),
        name,
        branch_id: Number(branchId),
        department_id: Number(departmentId)
      });
      // Navigate back to phones page
      router.push('/phone');
    } catch (error) {
      console.error("Error creating IP phone:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/phone");
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
        <SiteHeader title="Create New IP Phone" />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-2 px-2">
              <div className="container mx-auto max-w-2xl">
                {/* Back Button */}
                <div className="mb-6">
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Button>
                </div>

                {/* Create Phone Form */}
                <Card>
                  <CardHeader>
                    <CardTitle>Create New IP Phone</CardTitle>
                    <CardDescription>
                      Fill in the details to create a new IP phone.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Phone Number */}
                      <div className="space-y-2">
                        <Label htmlFor="number">Phone Number</Label>
                        <Input
                          id="number"
                          type="number"
                          value={number}
                          onChange={(e) => setNumber(e.target.value)}
                          placeholder="Enter phone number"
                          required
                        />
                      </div>

                      {/* Phone Name */}
                      <div className="space-y-2">
                        <Label htmlFor="name">Phone Name</Label>
                        <Input
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Enter phone name"
                          required
                        />
                      </div>

                      {/* Branch Selection */}
                      <div className="space-y-2">
                        <Label htmlFor="branch">Branch</Label>
                        <Select
                          value={branchId}
                          onValueChange={(value) => setBranchId(value)}
                          required
                        >
                          <SelectTrigger className="w-full">
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

                      {/* Department Selection */}
                      <div className="space-y-2">
                        <Label htmlFor="department">Department</Label>
                        <Select
                          value={departmentId}
                          onValueChange={(value) => setDepartmentId(value)}
                          required
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue 
                              placeholder={departmentsLoading ? "Loading..." : "Select Department"} 
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {departments.map((department) => (
                              <SelectItem key={department.id} value={department.id.toString()}>
                                {department.name}
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
                          disabled={isSubmitting || !number || !name.trim() || !branchId || !departmentId}
                          className="text-white"
                        >
                          {isSubmitting ? "Creating..." : "Create IP Phone"}
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

export default CreatePhonePage;