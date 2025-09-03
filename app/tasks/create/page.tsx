"use client";

import * as React from "react";
import { useMemo, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { addTaskNew } from "@/lib/api/tasks";
import { useType } from "@/lib/api/type";
import { useProgramsForDropdown } from "@/lib/api/programs";
import { useIPPhonesForDropdown } from "@/lib/api/phones";
import CameraPicker from "@/components/camera";
import { cn } from "@/lib/utils";
import { ChevronsUpDown, Check } from "lucide-react";

function CreateTaskPage() {
  const router = useRouter();
  const { ipPhones } = useIPPhonesForDropdown();
  const { programs } = useProgramsForDropdown();
  const { types } = useType();
  const [phoneId, setPhoneId] = useState<string>("");
  const [programID, setProgramID] = useState<string>("");
  const [issue, setIssue] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [capturedFiles, setCapturedFiles] = useState<File[]>([]);
  const [reportBy, setReportBy] = useState<string>("");
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    setProgramID("");
    setIssue("");
  }, [type]);

  // กรองโปรแกรมตาม type_id ที่เลือก
  const filteredPrograms = useMemo(() => {
    if (!type) return [];
    return programs.filter((program) => program.type_id === Number(type));
  }, [programs, type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await addTaskNew({
        reported_by: reportBy,
        phone_id:
          phoneId && phoneId !== "" && phoneId !== "null"
            ? Number(phoneId)
            : null,
        // system_id: Number(programID),
        system_id: Number(programID),
        text,
        status: 0, // Default to pending
        issue_type: Number(type),
        issue_else: issue,
        telegram: true,
        images: capturedFiles, // ส่งไฟล์รูปภาพ
      });

      // Navigate back to tasks page
      router.push("/tasks");
    } catch (error) {
      console.error("Error creating task:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/tasks");
  };

  const handleFilesCapture = (files: File[]) => {
    setCapturedFiles(files);
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
        <SiteHeader title="Create New Task" />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-2 px-2">
              <div className="container mx-auto max-w-2xl">
                {/* Create Task Form */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between gap-2">
                      <CardTitle>Create New Task</CardTitle>
                    </div>
                    <CardDescription>
                      Fill in the details to create a new task.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Report by Section */}
                      <div className="space-y-2">
                        <Label htmlFor="report_by">ชื่อผู้แจ้ง</Label>
                        <input
                          type="text"
                          id="report_by"
                          className="w-full border-1 rounded-md p-2"
                          value={reportBy}
                          onChange={(e) => setReportBy(e.target.value)}
                        />
                      </div>
                      {/* IP Phone Selection */}
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
                              {phoneId
                                ? (() => {
                                    const phone = ipPhones.find(
                                      (phone) => phone.id.toString() === phoneId
                                    );
                                    return phone ? `${phone.number} - ${phone.name}` : "Select Phone ID...";
                                  })()
                                : "Select Phone IP"}
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
                                      setPhoneId("");
                                      setOpen(false);
                                    }}
                                  >
                                    ไม่ได้ระบุ Phone ID
                                    <Check
                                      className={cn(
                                        "ml-auto",
                                        !phoneId ? "opacity-100" : "opacity-0"
                                      )}
                                    />
                                  </CommandItem>
                                  {ipPhones.map((phone) => (
                                    <CommandItem
                                      key={phone.id}
                                      value={`${phone.number} ${phone.name}`}
                                      onSelect={() => {
                                        setPhoneId(phone.id.toString());
                                        setOpen(false);
                                      }}
                                    >
                                      {phone.number} - {phone.name}
                                      <Check
                                        className={cn(
                                          "ml-auto",
                                          phoneId === phone.id.toString()
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
                      
                      <div className="space-y-2">
                        <Label htmlFor="type">Type</Label>
                        <Select
                          value={type}
                          onValueChange={(value) => setType(value)}
                          required
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Type" />
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
                          </SelectContent>{" "}
                        </Select>
                      </div>
                      {/* Problem Selection */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="program_id">Problem</Label>
                          <Select
                            value={programID}
                            onValueChange={(value) => setProgramID(value)}
                            required
                            disabled={!type} // ยังไม่เลือก Type ก็ปิดไว้ก่อน
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue
                                placeholder={
                                  type ? "Select Program" : "Select Type first"
                                }
                              />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0">อื่นๆ</SelectItem>
                              {filteredPrograms.map((program) => (
                                <SelectItem
                                  key={program.id}
                                  value={program.id.toString()}
                                >
                                  {program.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {programID === "0" && (
                          <div className="space-y-2">
                            <Label htmlFor="type">Add Problem</Label>
                            <input
                              type="text"
                              id="type"
                              className="w-full border-1 rounded-md p-1.5"
                              value={issue}
                              onChange={(e) => setIssue(e.target.value)}
                              placeholder="อธิบายปัญหาที่พบ"
                            />
                          </div>
                        )}
                      </div>
                      {/* Task Description */}
                      <div className="space-y-2">
                        <Label htmlFor="text">Task Description</Label>
                        <Textarea
                          id="text"
                          value={text}
                          onChange={(e) => setText(e.target.value)}
                          placeholder="Describe the task in detail..."
                          required
                          rows={4}
                        />
                      </div>
                      {/* Camera Section */}
                      <div className="space-y-2">
                        <Label>Add image</Label>
                        <CameraPicker onFilesCapture={handleFilesCapture} />
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
                          disabled={isSubmitting || !programID || !text}
                          className="text-white"
                        >
                          {isSubmitting ? "Creating..." : "Create Task"}
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

export default CreateTaskPage;
