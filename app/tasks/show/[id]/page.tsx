/* eslint-disable @next/next/no-img-element */
"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { getTaskNewById } from "@/lib/api/tasks";
import { useAssign } from "@/lib/api/auth";
import type { TaskWithPhone } from "@/types/entities";

function ShowTaskPage() {
  const router = useRouter();
  const params = useParams();
  const taskId = params.id as string;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { assignTo } = useAssign();

  const [task, setTask] = useState<TaskWithPhone | null>(null);
  const [loading, setLoading] = useState(true);

  console.log("Task", task);

  // Load the specific task data
  useEffect(() => {
    const loadTask = async () => {
      if (taskId) {
        try {
          const taskData = await getTaskNewById(Number(taskId));
          setTask(taskData);
          setLoading(false);
        } catch (error) {
          console.error("Error loading task:", error);
          setLoading(false);
        }
      }
    };

    loadTask();
  }, [taskId]);

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
                    <CardTitle>Task #{task.ticket_no || task.id}</CardTitle>
                    <CardDescription>
                      แสดงรายละเอียดงานด้านล่างนี้
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-6">
                      {/* IP Phone Selection */}
                      <div className="space-y-2">
                        <Label className="font-bold text-[16px]">
                          โทรศัพท์ไอพี (IP Phone)
                        </Label>
                        <p className="text-muted-foreground">
                          {task.phone_id
                            ? `${task.number} - ${task.phone_name}`
                            : "ไม่ได้ระบุ ID"}
                        </p>
                      </div>

                      {/* Program Selection */}
                      <div className="space-y-2">
                        <Label className="font-bold text-[16px]">
                          โปรแกรม (Program)
                        </Label>
                        <p className="text-muted-foreground">
                          {task.system_id
                            ? `${task.system_name}`
                            : "ไม่ได้ระบุ Program"}
                        </p>
                      </div>

                      {/* Task Description */}
                      <div className="space-y-2">
                        <Label className="font-bold text-[16px]">
                          รายละเอียดของปัญหา
                        </Label>
                        <Textarea
                          value={task.text}
                          placeholder="Describe the task in detail..."
                          rows={4}
                          readOnly
                        />
                      </div>

                      {/* Status Selection */}
                      <div className="space-y-2">
                        <Label className="font-bold text-[16px]">สถานะ</Label>
                        <span
                          className={
                            task.status === 0
                              ? "bg-orange-400 px-2 rounded-md"
                              : "bg-green-400 px-2 rounded-md"
                          }
                        >
                          {task.status === 0 ? "รอดำเนินการ" : "เสร็จแล้ว"}
                        </span>
                      </div>

                      {/* Assign To Selection */}
                      <div className="space-y-2">
                        <Label className="font-bold text-[16px]">
                          มอบหมายงานให้กับ
                        </Label>
                        <p className="text-muted-foreground">
                          {task.assign_to || "ไม่ได้ระบุ"}
                        </p>
                      </div>

                      {/* แสดงรูปภาพที่มีอยู่ */}
                      {task.file_paths &&
                        Object.keys(task.file_paths).length > 0 && (
                          <div className="space-y-2">
                            <Label className="font-bold text-[16px]">
                              รูปภาพที่แนบมา
                            </Label>
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

export default ShowTaskPage;
