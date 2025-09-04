"use client";

import type React from "react";
import { useState, useEffect } from "react";
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
import { useRouter, useParams } from "next/navigation";
import { getAssignToId, updateAssignTo } from "@/app/api/assign";
import type { AssignData } from "@/types/Assignto/model";

function EditSupervisorPage() {
  const router = useRouter();
  const params = useParams();
  const assignToId = params.id as string;

  const [assignTo, setAssignTo] = useState<AssignData | null>(null);
  const [name, setName] = useState("");
  const [user, setUser] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load the specific branch data
  useEffect(() => {
    const loadAssignTo = async () => {
      if (assignToId) {
        try {
          const assignToData = await getAssignToId(Number(assignToId));
          setAssignTo(assignToData);
          setName(assignToData.name);
          setUser(assignToData.telegram_username);
          setLoading(false);
        } catch (error) {
          console.error("Error loading assign:", error);
          setLoading(false);
        }
      }
    };

    loadAssignTo();
  }, [assignToId]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignTo) return;

    setIsSubmitting(true);

    try {
      await updateAssignTo(assignTo.id, {
        name: name,
        telegram_username: user,
      });
      // Navigate back to branches page
      router.push("/supervisor");
    } catch (error) {
      console.error("Error updating assign:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/supervisor");
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
          <SiteHeader title="Edit Supervisor" />
          <div className="flex flex-1 flex-col items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading supervisor...</p>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  if (!assignTo) {
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
          <SiteHeader title="Edit Branch" />
          <div className="flex flex-1 flex-col items-center justify-center">
            <div className="text-center">
              <p className="text-red-500 mb-4">Branch not found</p>
              <Button onClick={handleCancel}>Back to Branches</Button>
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
        <SiteHeader title="Edit Branch" />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-4 px-2">
              <div className="container mx-auto max-w-2xl">
                {/* Edit Branch Form */}
                <Card>
                  <CardHeader>
                    <CardTitle>Edit AssignTo {assignTo.id}</CardTitle>
                    <CardDescription>
                      Update the branch details below.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Branch Name */}
                      <div className="space-y-2">
                        <Label htmlFor="name">Supervisor Name</Label>
                        <Input
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Enter Supervisor name"
                          required
                        />
                      </div>
                      {/* Telegram */}
                      <div className="space-y-2">
                        <Label htmlFor="user">Telegram Username</Label>
                        <Input
                          id="user"
                          value={user}
                          onChange={(e) => setUser(e.target.value)}
                          placeholder="Enter Supervisor name"
                          required
                        />
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
                          disabled={isSubmitting}
                          className="text-white"
                        >
                          {isSubmitting ? "Updating..." : "Update Branch"}
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

export default EditSupervisorPage;
