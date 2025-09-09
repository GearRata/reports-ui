"use client";

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
import { addAssignTo } from "@/app/api/assign";

function CreateSupervisorPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [user, setUser] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await addAssignTo({ name: name, 
        telegram_username: user });
      // Navigate back to branches page
      router.push("/supervisor");
    } catch (error) {
      console.error("Error creating supervisor:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/supervisor");
  };

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
        <SiteHeader title="Add Supervisor<" />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-2 px-2">
              <div className="container mx-auto max-w-2xl">
                {/* Create Branch Form */}
                <Card>
                  <CardHeader>
                    <CardTitle>Add Supervisor</CardTitle>
                    <CardDescription>
                      Fill in the details to create a new supervisor.
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
                          placeholder="Enter supervisor name"
                          required
                        />
                      </div>
                      {/* Telegram user */}
                      <div className="space-y-2">
                        <Label htmlFor="user">Telegram User</Label>
                        <Input
                          id="user"
                          value={user}
                          onChange={(e) => setUser(e.target.value)}
                          placeholder="@Username"
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
                          disabled={isSubmitting || !name.trim()}
                          className="text-white"
                        >
                          {isSubmitting ? "Creating..." : "Create Supervisor"}
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

export default CreateSupervisorPage;
