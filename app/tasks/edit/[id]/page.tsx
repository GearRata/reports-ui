/* eslint-disable @next/next/no-img-element */
"use client";

import type React from "react";
import { useState, useEffect } from "react";
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
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getTaskNewById, updateTaskNew } from "@/lib/api/tasks";
import { useAssign } from "@/lib/api/auth";
import { useProgramsForDropdown } from "@/lib/api/programs";
import { useIPPhonesForDropdown } from "@/lib/api/phones";
import type { TaskWithPhone } from "@/types/entities";

function EditTaskPage() {
  const router = useRouter();
  const params = useParams();
  const taskId = params.id as string;

  const { ipPhones } = useIPPhonesForDropdown();
  const { programs } = useProgramsForDropdown();
  const { assignTo: assignTo } = useAssign();

  const [task, setTask] = useState<TaskWithPhone | null>(null);
  const [phoneId, setPhoneId] = useState<string>("");
  const [programID, setProgramID] = useState<string>("");
  const [text, setText] = useState("");
  const [status, setStatus] = useState<string>("");
  const [assignId, setAssignId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  console.log("Task", task)
  console.log("Assign To", assignTo)
  console.log("assignId", assignId)
  // Load the specific task data
  useEffect(() => {
    const loadTask = async () => {
      if (taskId) {
        try {
          const taskData = await getTaskNewById(Number(taskId));
          setTask(taskData);
          setPhoneId(taskData.phone_id ? taskData.phone_id.toString() : "null");
          setProgramID(taskData.system_id.toString());
          setText(taskData.text);
          setStatus(taskData.status.toString());

          // Find assign ID from assign name
          const assignPerson = assignTo.find(
            (p) => p.name === taskData.assign_to
          );
          setAssignId(assignPerson ? assignPerson.id.toString() : "");

          setLoading(false);
        } catch (error) {
          console.error("Error loading task:", error);
          setLoading(false);
        }
      }
    };

    loadTask();
  }, [taskId, assignTo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task) return;

    setIsSubmitting(true);

    try {
      const assignPerson = assignId
        ? assignTo.find((p) => p.id === Number(assignId))
        : null;
      const assignName = assignPerson ? assignPerson.name : null;

      await updateTaskNew(task.id, {
        phone_id:
          phoneId && phoneId !== "" && phoneId !== "null"
            ? Number(phoneId)
            : null,
        system_id: Number(programID),
        text,
        status: Number(status),
        assign_to: assignName,
        telegram: true,
      });

      // Navigate back to tasks page
      router.push("/tasks");
    } catch (error) {
      console.error("Error updating task:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/tasks");
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
          <SiteHeader title="Edit Task" />
          <div className="flex flex-1 flex-col items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading task...</p>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  if (!task) {
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
          <SiteHeader title="Edit Task" />
          <div className="flex flex-1 flex-col items-center justify-center">
            <div className="text-center">
              <p className="text-red-500 mb-4">Task not found</p>
              <Button onClick={handleCancel}>Back to Tasks</Button>
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
        <SiteHeader title="Edit Task" />
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
                    Back to Tasks
                  </Button>
                </div>

                {/* Edit Task Form */}
                <Card>
                  <CardHeader>
                    <CardTitle>
                      Edit Task #{task.ticket_no || task.id}
                    </CardTitle>
                    <CardDescription>
                      Update the task details below.
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
                        <Label htmlFor="text">Task Description *</Label>
                        <Textarea
                          id="text"
                          value={text}
                          onChange={(e) => setText(e.target.value)}
                          placeholder="Describe the task in detail..."
                          required
                          rows={4}
                        />
                      </div>

                      {/* Status Selection */}
                      <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                          value={status}
                          onValueChange={(value) => setStatus(value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">Pending</SelectItem>
                            <SelectItem value="1">Done</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Assign To Selection */}
                      <div className="space-y-2">
                        <Label htmlFor="assign_to">Assign To</Label>
                        <Select
                          value={assignId}
                          onValueChange={(value) => setAssignId(value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select AssignTo" />
                          </SelectTrigger>
                          <SelectContent>
                            {assignTo.map((assign) => (
                              <SelectItem
                                key={assign.id}
                                value={assign.id.toString()}
                              >
                                {assign.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* แสดงรูปภาพที่มีอยู่ */}
                      {task.file_paths &&
                        Object.keys(task.file_paths).length > 0 && (
                          <div className="space-y-2">
                            <Label>รูปภาพที่แนบมา</Label>
                            <div className="grid grid-cols-3 gap-2 max-w-md">
                              {Object.entries(task.file_paths).map(
                                ([key, url]) => (
                                  <div
                                    key={key}
                                    className="relative aspect-square"
                                  >
                                      <img
                                      src={url}
                                      alt={`Task image ${key}`}
                                      className="w-full h-full object-cover rounded-md border"
                                      onError={(e) => {
                                        console.error(
                                          "Image failed to load:",
                                          url
                                        );
                                        e.currentTarget.src =
                                          "/placeholder-image.png";
                                      }}
                                    />
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )}

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
                          {isSubmitting ? "Updating..." : "Update Task"}
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

export default EditTaskPage;
