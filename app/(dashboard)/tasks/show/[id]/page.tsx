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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  addSolution,
  getSolutionById,
  updateSolution,
  deleteSolution,
} from "@/app/api/solution";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SiteHeader } from "@/components/layout/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getTaskNewById, updateTaskAssignTo} from "@/app/api/tasks";
import type { TaskData } from "@/types/task/model";
import type { SolutionData } from "@/types/solution/model";
import CameraPicker from "@/components/camera";
import { useRouter, useParams } from "next/navigation";
import TaskImageViewer from "@/components/images-viewer";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import { useAssign } from "@/app/api/assign";

function ShowTaskPage() {
  const router = useRouter();
  const params = useParams();
  const taskId = params.id as string;

  const [text, setText] = useState("");
  const [task, setTask] = useState<TaskData | null>(null);
  const [solution, setSoltuion] = useState<SolutionData | null>(null);
  const { assignTo: assignTo } = useAssign();
  const [capturedFiles, setCapturedFiles] = useState<File[]>([]);
  const [loadTask, setLoadTask] = useState(true);
  const [loadSolution, setLoadSolution] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditingSolution, setIsEditingSolution] = useState(false);
  const [editSolutionText, setEditSolutionText] = useState("");
  const [editAssign, setEditAssign] = useState("");
  const [editSolutionFiles, setEditSolutionFiles] = useState<File[]>([]);
  const [existingSolutionImages, setExistingSolutionImages] = useState<
    string[]
  >([]);
  const [assignId, setAssignId] = useState<string>("");
  const taskImages = Object.values(task?.file_paths || {}) as string[];
  const solutionImages = Object.values(solution?.file_paths || {}) as string[];

  // Load the specific task data
  useEffect(() => {
    const loadTask = async () => {
      if (taskId) {
        try {
          const taskData = await getTaskNewById(Number(taskId));
          setTask(taskData);
          setAssignId(taskData.assignedto_id.toString());
          setLoadTask(false);
        } catch (error) {
          console.error("Error loading task:", error);
          setLoadTask(false);
        }
      }
    };
    loadTask();
  }, [taskId]);

  // Load solution only if task is completed (status === 1)
  useEffect(() => {
    const loadSolution = async () => {
      if (task && task.status === 1) {
        try {
          const solutionData = await getSolutionById(Number(taskId));
          setSoltuion(solutionData);
          setLoadSolution(false);
        } catch (error) {
          console.error("Error loading solution:", error);
          // If solution doesn't exist, that's okay - just set loading to false
          setSoltuion(null);
          setLoadSolution(false);
        }
      } else {
        // If task is not completed, no need to load solution
        setSoltuion(null);
        setLoadSolution(false);
      }
    };

    // Only try to load solution after task is loaded
    if (task !== null) {
      loadSolution();
    }
  }, [task, taskId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const assignPerson = assignId
        ? assignTo.find((person) => person.id === Number(assignId))
        : null;
      const assignName = assignPerson ? assignPerson.name : null;
      const assignToId = assignPerson ? assignPerson.id : 0;
      await addSolution(Number(taskId), {
        images: capturedFiles, // ส่งไฟล์รูปภาพ
        solution: text,
        assignedto_id: assignToId,
        assignto: assignName,
      });

      // Reload solution data after successful creation
      try {
        const solutionData = await getSolutionById(Number(taskId));
        setSoltuion(solutionData);
      } catch (error) {
        console.error("Error reloading solution:", error);
      }

      // Clear form
      setText("");
      setCapturedFiles([]);

      setTimeout(() => {
        window.location.reload();
      }, 500);
      // Show success message or navigate back
    } catch (error) {
      console.error("Error creating solution:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFilesCapture = (files: File[]) => {
    setCapturedFiles(files);
  };

  const handleEditSolutionFilesCapture = (files: File[]) => {
    setEditSolutionFiles(files);
  };

  const handleEditSolution = () => {
    if (solution) {
      setIsEditingSolution(true);
      setEditSolutionText(solution.solution || "");
      setEditAssign(task?.assignedto_id?.toString() || "");
      // เก็บรูปภาพเดิมไว้ในตัวแปร
      const existingImages = Object.values(
        solution.file_paths || {}
      ) as string[];
      setExistingSolutionImages(existingImages);
      console.log("Existing solution images:", existingImages);
    }
  };

  console.log("Edit Assign:", editAssign);

  const handleCancelEdit = () => {
    setIsEditingSolution(false);
    setEditSolutionText("");
    setEditSolutionFiles([]);
    setExistingSolutionImages([]);
  };

  const handleUpdateSolution = async () => {
    if (!solution || !editSolutionText.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const assignPerson = editAssign
        ? assignTo.find((person) => person.id === Number(editAssign))
        : null;
      const assignName = assignPerson ? assignPerson.name : null;
      const assignToId = assignPerson ? assignPerson.id : 0;
      console.log("Assign Data", assignTo);
      console.log("Assign Person:", editAssign);
      console.log("Assign to ID:", assignToId);
      console.log("Assign to Name", assignName);

      console.log("Updating solution with:");
      console.log("- Existing images:", existingSolutionImages);
      console.log("- New images:", editSolutionFiles);

      // ส่งลิงค์รูปภาพเดิมไปให้ backend จัดการแทน (แก้ปัญหา CORS)
      console.log(
        "Sending existing image URLs to backend:",
        existingSolutionImages
      );

      // Update solution with new text, existing image URLs, and new images
      await updateSolution(Number(taskId), {
        solution: editSolutionText,
        images: editSolutionFiles, // รูปภาพใหม่
        existing_images: existingSolutionImages, // ลิงค์รูปภาพเดิม ให้ backend จัดการ
        assignedto_id: assignToId,
        assignto: assignName,
      });

       await updateTaskAssignTo(Number(taskId), {
        assignedto_id: assignToId,
        assign_to: assignName,
        update_telegram: true
      });

      // await new Promise(resolve => setTimeout(resolve, 500));

      // Reload solution data
      const solutionData = await getSolutionById(Number(taskId));
      const taskData = await getTaskNewById(Number(taskId));
      setSoltuion(solutionData);
      setTask(taskData);
      setIsEditingSolution(false);
      setEditSolutionText("");
      setEditSolutionFiles([]);
      setExistingSolutionImages([]);


      console.log("Solution updated successfully");
    } catch (error) {
      console.error("Error updating solution:", error);
      alert("เกิดข้อผิดพลาดในการอัปเดตวิธีแก้ไขปัญหา");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveExistingImage = (indexToRemove: number) => {
    setExistingSolutionImages((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleDeleteSolution = async () => {
    try {
      const success = await deleteSolution(Number(taskId));

      if (success) {
        console.log("Solution deleted successfully");
        // Reload หน้าใหม่ทั้งหมดเหมือนกด F5
        window.location.reload();
      } else {
        throw new Error("Delete failed");
      }
    } catch (error) {
      console.error("Error deleting solution:", error);
    }
  };

  if (loadTask || (task && task.status === 1 && loadSolution)) {
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
            "--sidebar-width": "calc(var(--spacing) * 53)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader title="Show Task" />
          <div className="flex flex-1 flex-col items-center justify-center">
            <div className="text-center">
              <p className="text-red-500 mb-4">Task not found</p>
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
        <SiteHeader title="Show Task" />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-3 md:gap-6 md:py-6 px-6">
              <div className="container mx-auto max-w-2xl">
                {/*================ แสดงข้อมูลและแก้ไขข้อมูล ================*/}

                {/* ทริกเกอร์ระหว่างแสดงข้อมูลกับเพิ่มวิธีแก้ไขปัญหา */}
                <Tabs defaultValue="show">
                  <TabsList>
                    <TabsTrigger value="show">ปัญหา</TabsTrigger>
                    <TabsTrigger value="solution">วิธีแก้ไขปัญหา</TabsTrigger>
                  </TabsList>

                  {/* แสดงข้อมูล */}
                  <TabsContent value="show">
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          {/* แสดงรายละเอียดของ  Ticket */}
                          <div>
                            <CardTitle>
                              Task #{task.ticket_no || task.id}
                            </CardTitle>
                            <CardDescription>
                              แสดงรายละเอียดงานด้านล่างนี้
                            </CardDescription>
                          </div>

                          {/* Icon สำหรับไว้แก้ไขข้อมูล */}
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                router.push(`/tasks/edit/${task.id}`)
                              }
                              className="flex items-center gap-2"
                            >
                              <Pencil className="h-4 w-4" />
                              แก้ไข
                            </Button>
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${
                                task.status === 0
                                  ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                                  : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              }`}
                            >
                              {task.status === 0 ? "รอดำเนินการ" : "เสร็จแล้ว"}
                            </span>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent>
                        <form className="space-y-6">
                          {/* ชื่อผู้แจ้ง */}
                          <div className="space-y-2">
                            <Label className="font-bold text-[16px]">
                              ชื่อผู้แจ้ง
                            </Label>
                            <p className="text-muted-foreground">
                              {task.reported_by || "ไม่ได้ระบุชื่อผู้แจ้ง"}
                            </p>
                          </div>
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

                          {/* Type Selection */}
                          <div className="space-y-2">
                            <Label className="font-bold text-[16px]">
                              ชนิดของปัญหา (Type)
                            </Label>
                            <p className="text-muted-foreground">
                              {task.issue_type
                                ? `${task.system_type}`
                                : "ไม่ได้ระบุ Type"}
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            {/* Problem Selection */}
                            <div className="space-y-2">
                              <Label className="font-bold text-[16px]">
                                ปัญหา (Problem)
                              </Label>
                              <p className="text-muted-foreground">
                                {task.system_id === 0
                                  ? "อื่นๆ"
                                  : `${task.system_name}`}
                              </p>
                            </div>

                            {/* Issue Selection */}
                            {task.system_id === 0 && (
                              <div className="space-y-2">
                                <Label className="font-bold text-[16px]">
                                  ปัญหาเพิ่มเติม (Problem)
                                </Label>
                                <p className="text-muted-foreground">
                                  {task.system_id === 0
                                    ? `${task.issue_else}`
                                    : "ไม่ได้ระบุ"}
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Task Description */}
                          <div className="space-y-2">
                            <Label className="font-bold text-[16px]">
                              รายละเอียดของปัญหา
                            </Label>
                            <Textarea
                              defaultValue={task.text}
                              placeholder="Describe the task in detail..."
                              rows={4}
                              readOnly
                            />
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
                          <TaskImageViewer taskImages={taskImages} />
                        </form>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  {/*======================================================*/}

                  {/*================ วิธีแก้ไขปัญหา ================*/}
                  <TabsContent value="solution">
                    {task.status === 1 && solution ? (
                      // Task is completed and solution exists - Show solution (read-only)
                      <Card>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle>
                                Task #{task.ticket_no || task.id}
                              </CardTitle>
                              <CardDescription>
                                วิธีแก้ไขปัญหา (แก้ไข)
                              </CardDescription>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={handleEditSolution}
                                  className="flex items-center cursor-pointer"
                                >
                                  <Pencil className="mr-2 h-4 w-4" />
                                  แก้ไข
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={handleDeleteSolution}
                                  className="text-red-600 flex items-center cursor-pointer"
                                >
                                  <Trash className="mr-2 h-4 w-4" />
                                  ลบ
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-6">
                            <div className="space-y-2">
                              <Label className="font-bold text-[16px]">
                                วิธีแก้ไขปัญหา
                              </Label>

                              {isEditingSolution ? (
                                <div className="space-y-4">
                                  <Textarea
                                    value={editSolutionText}
                                    onChange={(e) =>
                                      setEditSolutionText(e.target.value)
                                    }
                                    placeholder="อธิบายการแก้ปัญหา..."
                                    rows={4}
                                    className="border-primary"
                                  />

                                  {/* Edit Assign Data */}
                                  <div className="space-y-2">
                                    <Label htmlFor="assign_to">Assign To</Label>
                                    <Select
                                      value={editAssign}
                                      onValueChange={(value) =>
                                        setEditAssign(value)
                                      }
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
                                  {/* แสดงรูปภาพเดิม */}
                                  {existingSolutionImages.length > 0 && (
                                    <div className="space-y-2">
                                      <Label className="font-bold text-[16px]">
                                        รูปภาพเดิม (
                                        {existingSolutionImages.length} รูป)
                                      </Label>
                                      <p className="text-sm text-muted-foreground">
                                        รูปภาพเหล่านี้จะถูกเก็บไว้และรวมกับรูปภาพใหม่
                                      </p>
                                      <div className="grid grid-cols-3 gap-2">
                                        {existingSolutionImages.map(
                                          (imageUrl, index) => (
                                            <div
                                              key={index}
                                              className="relative aspect-square group"
                                            >
                                              <img
                                                src={imageUrl}
                                                alt={`Existing image ${
                                                  index + 1
                                                }`}
                                                className="w-full h-full object-cover rounded-md border border-blue-300"
                                              />
                                              <div className="absolute top-1 right-1 bg-blue-500 text-white text-xs px-1 rounded">
                                                เดิม
                                              </div>
                                              <button
                                                type="button"
                                                onClick={() =>
                                                  handleRemoveExistingImage(
                                                    index
                                                  )
                                                }
                                                className="absolute top-1 left-1 bg-red-500 text-white text-xs px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                                title="ลบรูปภาพนี้"
                                              >
                                                ×
                                              </button>
                                            </div>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  )}

                                  <div className="space-y-2">
                                    <Label>เพิ่มรูปภาพใหม่</Label>
                                    <CameraPicker
                                      onFilesCapture={
                                        handleEditSolutionFilesCapture
                                      }
                                    />
                                  </div>

                                  <div className="flex justify-end gap-2">
                                    <Button
                                      type="button"
                                      variant="outline"
                                      onClick={handleCancelEdit}
                                      disabled={isSubmitting}
                                    >
                                      ยกเลิก
                                    </Button>
                                    <Button
                                      type="button"
                                      onClick={handleUpdateSolution}
                                      disabled={
                                        isSubmitting || !editSolutionText.trim()
                                      }
                                      className="text-white"
                                    >
                                      {isSubmitting
                                        ? "กำลังบันทึก..."
                                        : `บันทึก (${
                                            existingSolutionImages.length +
                                            editSolutionFiles.length
                                          } รูป)`}
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <div className="space-y-4">
                                  <Textarea
                                    value={solution.solution || ""}
                                    placeholder="ไม่มีรายละเอียดการแก้ปัญหา"
                                    rows={4}
                                    readOnly
                                    className="bg-muted"
                                  />
                                  <div className="space-y-2">
                                    <Label className="font-bold text-[16px]">
                                      มอบหมายงานให้กับ
                                    </Label>
                                    <p className="text-muted-foreground">
                                      {task.assign_to || "ไม่ได้ระบุ"}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                            {/* Show solution images */}
                            {!isEditingSolution && (
                              <TaskImageViewer
                                solutionImages={solutionImages}
                              />
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ) : task.status === 1 && !solution ? (
                      // Task is completed but no solution exists - Show message
                      <Card>
                        <CardHeader>
                          <CardTitle>
                            Task #{task.ticket_no || task.id}
                          </CardTitle>
                          <CardDescription>วิธีแก้ไขปัญหา</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="text-center py-8">
                            <p className="text-muted-foreground">
                              งานนี้เสร็จแล้ว แต่ยังไม่มีการบันทึกวิธีแก้ไขปัญหา
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      // Task is not completed - Show form to add solution
                      <Card>
                        <CardHeader>
                          <CardTitle>
                            Task #{task.ticket_no || task.id}
                          </CardTitle>
                          <CardDescription>เพิ่มวิธีแก้ไขปัญหา</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                              <Label htmlFor="text">วิธีแก้ไขปัญหา</Label>
                              <Textarea
                                id="text"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="อธิบายการแก้ปัญหา..."
                                required
                                rows={4}
                              />
                            </div>

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

                            {/* Camera Section */}
                            <div className="space-y-2">
                              <Label>เพิ่มรูปภาพ</Label>
                              <CameraPicker
                                onFilesCapture={handleFilesCapture}
                              />
                            </div>
                            <div className="flex justify-end gap-4">
                              <Button
                                type="submit"
                                className="text-white"
                                disabled={isSubmitting}
                              >
                                {isSubmitting
                                  ? "กำลังบันทึก..."
                                  : "บันทึกวิธีแก้ไข"}
                              </Button>
                            </div>
                          </form>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default ShowTaskPage;
