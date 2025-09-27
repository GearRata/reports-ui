"use client";

import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronsUpDown, Check } from "lucide-react";
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
import { addIPPhone } from "@/app/api/phones";
import { cn } from "@/lib/utils";
import { useDepartmentsForDropdown } from "@/app/api/departments";

function CreatePhonePage() {
  const router = useRouter();
  const { departments } = useDepartmentsForDropdown();

  const [number, setNumber] = useState("");
  const [name, setName] = useState("");
  const [departmentId, setDepartmentId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await addIPPhone({
        number: Number(number),
        name,
        department_id: Number(departmentId),
      });
      // Navigate back to phones page
      router.push("/phone");
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
          "--sidebar-width": "calc(var(--spacing) * 53)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader title="Create New IP Phone" />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-4 px-2">
              <div className="container mx-auto max-w-2xl">
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
                     

                      <div className="space-y-2">
                        <Label htmlFor="phone_id">IP Phone</Label>
                        <Popover open={open} onOpenChange={setOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={open}
                              className="w-full justify-between"
                            >
                              {departmentId
                                ? (() => {
                                    const department = departments.find(
                                      (department) =>
                                        department.id.toString() ===
                                        departmentId
                                    );
                                    return department
                                      ? `${department.name}`
                                      : "Select Department...";
                                  })()
                                : <span className="text-muted-foreground">Select Department</span>}
                              <ChevronsUpDown className="opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0">
                            <Command>
                              <CommandInput
                                placeholder="Search phone..."
                                className="h-9"
                              />
                              <CommandList>
                                <CommandEmpty>No phone found.</CommandEmpty>
                                <CommandGroup>
                                  <CommandItem
                                    value="null"
                                    onSelect={() => {
                                      setDepartmentId("");
                                      setOpen(false);
                                    }}
                                  >
                                    ไม่ได้ระบุ Phone ID
                                    <Check
                                      className={cn(
                                        "ml-auto",
                                        !departmentId
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                  </CommandItem>
                                  {departments.map((department) => (
                                    <CommandItem
                                      key={department.id}
                                      value={`${department.number} ${department.name}`}
                                      onSelect={() => {
                                        setDepartmentId(
                                          department.id.toString()
                                        );
                                        setOpen(false);
                                      }}
                                    >
                                       {department.name} - {department.branch_name}
                                      <Check
                                        className={cn(
                                          "ml-auto",
                                          departmentId ===
                                            department.id.toString()
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
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
                          disabled={
                            isSubmitting ||
                            !number ||
                            !name.trim() ||
                            !departmentId
                          }
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
