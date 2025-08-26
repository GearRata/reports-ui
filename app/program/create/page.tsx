"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SiteHeader } from "@/components/layout/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import { addProgram } from "@/lib/api/programs";
import { useTypesForDropdown } from "@/lib/api/type";

function CreateProgramPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const { types, loading: typesLoading } = useTypesForDropdown();
  const [typeId, setTypeId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await addProgram({
        name,
        type_id: Number(typeId),
      });
      // Navigate back to programs page
      router.push("/program");
    } catch (error) {
      console.error("Error creating program:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/program");
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
        <SiteHeader title="Create New Program" />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-2 px-2">
              <div className="container mx-auto max-w-2xl">

                {/* Create Program Form */}
                <Card>
                  <CardHeader>
                    <CardTitle>Create New Problem</CardTitle>
                    <CardDescription>
                      Fill in the details to create a new problem.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Program Name */}
                      <div className="space-y-2">
                        <Label htmlFor="name">Problem</Label>
                        <Input
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Enter problem"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="branch">Type</Label>
                        <Select
                          value={typeId}
                          onValueChange={(value) => setTypeId(value)}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                typesLoading ? "Loading..." : "Select Type"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {types.map((type) => (
                              <SelectItem
                                key={type.id}
                                value={type.id.toString()}
                              >
                                {type.name}
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
                          disabled={isSubmitting || !name.trim()}
                          className="text-white"
                        >
                          {isSubmitting ? "Creating..." : "Create a problem"}
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

export default CreateProgramPage;
