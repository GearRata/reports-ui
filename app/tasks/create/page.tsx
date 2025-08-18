"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { ArrowLeft } from "lucide-react";
import { addTaskNew } from "@/lib/api/tasks";
import { useAssign } from "@/lib/api/auth";
import { useProgramsForDropdown } from "@/lib/api/programs";
import { useIPPhonesForDropdown } from "@/lib/api/phones";
import CameraPicker from "@/components/camera";

function CreateTaskPage() {
  const router = useRouter();
  const { ipPhones } = useIPPhonesForDropdown();
  const { programs } = useProgramsForDropdown();
  const { assignTo: assignTo } = useAssign();

  const [phoneId, setPhoneId] = useState<string>("");
  const [programID, setProgramID] = useState<string>("");
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [capturedFiles, setCapturedFiles] = useState<File[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const assignPerson = assignTo.find((p) => p.id === 1); // Default assign to first person or adjust as needed
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const assignName = assignPerson ? assignPerson.name : null;

      await addTaskNew({
        phone_id:
          phoneId && phoneId !== "" && phoneId !== "null"
            ? Number(phoneId)
            : null,
        system_id: Number(programID),
        text,
        status: 0, // Default to pending
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

  const handleImagesCapture = (images: string[]) => {
    setCapturedImages(images);
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
                {/* Back Button */}
                <div className="mb-6">
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Tasks
                  </Button>
                </div>

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
                      {/* IP Phone Selection */}
                      <div className="space-y-2">
                        <Label htmlFor="phone_id">IP Phone</Label>
                        <Select
                          value={phoneId}
                          onValueChange={(value) => setPhoneId(value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select IP phone" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="null">ไม่ได้ระบุ ID</SelectItem>
                            {ipPhones.map((phone) => (
                              <SelectItem
                                key={phone.id}
                                value={phone.id.toString()}
                              >
                                {phone.number} - {phone.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Program Selection */}
                      <div className="space-y-2">
                        <Label htmlFor="program_id">Program</Label>
                        <Select
                          value={programID}
                          onValueChange={(value) => setProgramID(value)}
                          required
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Program" />
                          </SelectTrigger>
                          <SelectContent>
                            {programs.map((program) => (
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
                        <CameraPicker 
                          onImagesCapture={handleImagesCapture}
                          onFilesCapture={handleFilesCapture}
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
