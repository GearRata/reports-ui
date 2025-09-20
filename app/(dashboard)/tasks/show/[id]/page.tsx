/* eslint-disable @next/next/no-img-element */
"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
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
import { getTaskNewById, updateTaskAssignTo } from "@/app/api/tasks";
import type { TaskData } from "@/types/task/model";
import type { SolutionData } from "@/types/solution/model";
import CameraButton from "@/components/images/CameraButton";
import GalleryButton from "@/components/images/GalleryButton";
import { useRouter, useParams } from "next/navigation";
import TaskImageViewer from "@/components/images/images-viewer";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash, X } from "lucide-react";
import toast from "react-hot-toast";
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
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [processing, setProcessing] = useState(false);
  const [loadTask, setLoadTask] = useState(true);
  const [loadSolution, setLoadSolution] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditingSolution, setIsEditingSolution] = useState(false);
  const [editSolutionText, setEditSolutionText] = useState("");
  const [editAssign, setEditAssign] = useState("");
  const [editSolutionFiles, setEditSolutionFiles] = useState<File[]>([]);
  const [editSelectedImages, setEditSelectedImages] = useState<string[]>([]);
  const [editProcessing, setEditProcessing] = useState(false);
  const [existingSolutionImages, setExistingSolutionImages] = useState<
    string[]
  >([]);
  const [assignId, setAssignId] = useState<string>("");
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);
  const editCameraRef = useRef<HTMLInputElement>(null);
  const editGalleryRef = useRef<HTMLInputElement>(null);
  const taskImages = Object.values(task?.file_paths || {}) as string[];
  const solutionImages = Object.values(solution?.file_paths || {}) as string[];

  // Load the specific task data
  useEffect(() => {
    const loadTask = async () => {
      if (taskId) {
        try {
          const taskData = await getTaskNewById(Number(taskId));
          setTask(taskData);
          // Only set assignId if it's not 0 (unassigned)
          setAssignId(taskData.assignedto_id && taskData.assignedto_id !== 0 ? taskData.assignedto_id.toString() : "");
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
      if (task && task.status === 2) {
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
      setSelectedImages([]);

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

  const compressImage = (
    file: File,
    maxWidth: number = 400,
    quality: number = 0.3
  ): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;
      const img = new Image();

      img.onload = () => {
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const compressedDataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(compressedDataUrl);
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const handleCamera = () => {
    cameraRef.current?.click();
  };

  const handleGallery = () => {
    galleryRef.current?.click();
  };

  const handleEditCamera = () => {
    editCameraRef.current?.click();
  };

  const handleEditGallery = () => {
    editGalleryRef.current?.click();
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    setProcessing(true);

    try {
      const fileArray = Array.from(selectedFiles);
      const compressedImages: string[] = [];

      for (const file of fileArray) {
        const compressed = await compressImage(file);
        if (compressed.length > 200 * 1024) {
          const superCompressed = await compressImage(file, 300, 0.2);
          compressedImages.push(superCompressed);
        } else {
          compressedImages.push(compressed);
        }
      }

      const updatedImages = [...selectedImages, ...compressedImages];
      const updatedFiles = [...capturedFiles, ...fileArray];
      const finalImages = updatedImages.slice(0, 9);
      const finalFiles = updatedFiles.slice(0, 9);

      if (updatedImages.length > 9) {
        toast.error("สามารถเลือกได้สูงสุด 9 รูปเท่านั้น");
      }

      setSelectedImages(finalImages);
      setCapturedFiles(finalFiles);

      if (cameraRef.current) cameraRef.current.value = "";
      if (galleryRef.current) galleryRef.current.value = "";
    } catch (error) {
      console.error("Error processing images:", error);
    } finally {
      setProcessing(false);
    }
  };

  const onEditFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    setEditProcessing(true);

    try {
      const fileArray = Array.from(selectedFiles);
      const compressedImages: string[] = [];

      for (const file of fileArray) {
        const compressed = await compressImage(file);
        if (compressed.length > 200 * 1024) {
          const superCompressed = await compressImage(file, 300, 0.2);
          compressedImages.push(superCompressed);
        } else {
          compressedImages.push(compressed);
        }
      }

      const updatedImages = [...editSelectedImages, ...compressedImages];
      const updatedFiles = [...editSolutionFiles, ...fileArray];
      const finalImages = updatedImages.slice(0, 9);
      const finalFiles = updatedFiles.slice(0, 9);

      if (updatedImages.length > 9) {
        toast.error("สามารถเลือกได้สูงสุด 9 รูปเท่านั้น");
      }

      setEditSelectedImages(finalImages);
      setEditSolutionFiles(finalFiles);

      if (editCameraRef.current) editCameraRef.current.value = "";
      if (editGalleryRef.current) editGalleryRef.current.value = "";
    } catch (error) {
      console.error("Error processing images:", error);
    } finally {
      setEditProcessing(false);
    }
  };

  const removeImage = (index: number) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    const newFiles = capturedFiles.filter((_, i) => i !== index);
    setSelectedImages(newImages);
    setCapturedFiles(newFiles);
  };

  const removeEditImage = (index: number) => {
    const newImages = editSelectedImages.filter((_, i) => i !== index);
    const newFiles = editSolutionFiles.filter((_, i) => i !== index);
    setEditSelectedImages(newImages);
    setEditSolutionFiles(newFiles);
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

  const handleCancelEdit = () => {
    setIsEditingSolution(false);
    setEditSolutionText("");
    setEditSolutionFiles([]);
    setEditSelectedImages([]);
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
        update_telegram: false,
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
      setEditSelectedImages([]);
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

  if (loadTask || (task && task.status === 2 && loadSolution)) {
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
                        <div className="flex items-center justify-between ">
                          {/* แสดงรายละเอียดของ  Ticket */}
                          <div>
                            <CardTitle>
                              Task #{task.ticket_no || task.id}
                            </CardTitle>
                            <CardDescription>
                              แสดงรายละเอียดงานด้านล่างนี้
                            </CardDescription>
                          </div>

                          <div className="grid place-items-center md:flex gap-2 max-sm:grid max-md:gap-3 ">
                            {/* Icon สำหรับไว้แก้ไขข้อมูล */}
                            <div className="">
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
                            </div>
                            <div className="max-md:flex ">
                              <span
                                className={`px-2 py-1 rounded-md text-sm font-medium ${
                                  task.status === 0
                                    ? "bg-linear-to-r from-amber-500 to-amber-600 text-white text-center"
                                    : task.status === 1 ?
                                    "bg-linear-to-r from-cyan-500 to-sky-600 text-white text-center" :
                                    "bg-linear-to-r from-green-500 to-green-600 text-white text-center"
                                }`}
                              >
                                {task.status === 0
                                  ? "Pending" : task.status === 1 ? "Progress"
                                  : "Done"}
                              </span>
                            </div>
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
                    {task.status === 2 && solution ? (
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
                                    <Label htmlFor="assign_to">มอบหมายงานให้กับ</Label>
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
                                            {assign.name || "ไม่ได้ระบุ"}
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
                                              <div className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-1 rounded">
                                                เดิม
                                              </div>
                                              <button
                                                type="button"
                                                onClick={() =>
                                                  handleRemoveExistingImage(
                                                    index
                                                  )
                                                }
                                                className="absolute -top-2 -right-2 bg-red-500 text-white text-xs p-1 rounded-full hover:bg-red-600"
                                                title="ลบรูปภาพนี้"
                                              >
                                                <X className="h-4 w-4"/>
                                              </button>
                                            </div>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  )}

                                  <div className="space-y-4">
                                    <Label>เพิ่มรูปภาพใหม่</Label>
                                    
                                    {/* Hidden File Inputs */}
                                    <input
                                      ref={editCameraRef}
                                      type="file"
                                      accept="image/*"
                                      capture="environment"
                                      multiple
                                      onChange={onEditFileChange}
                                      className="hidden"
                                    />
                                    <input
                                      ref={editGalleryRef}
                                      type="file"
                                      accept="image/*"
                                      multiple
                                      onChange={onEditFileChange}
                                      className="hidden"
                                    />

                                    {/* Camera and Gallery Buttons */}
                                    <div className="flex gap-4 mb-4">
                                      <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-lg border">
                                        <CameraButton onClick={handleEditCamera} disabled={editProcessing || editSelectedImages.length >= 9} />
                                      </div>
                                      <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-lg border">
                                        <GalleryButton onClick={handleEditGallery} disabled={editProcessing || editSelectedImages.length >= 9} />
                                      </div>
                                      {editProcessing && (
                                        <div className="flex items-center gap-2 text-blue-600">
                                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                                          <span className="text-sm">บีบอัด...</span>
                                        </div>
                                      )}
                                    </div>

                                    {/* Image Grid Display */}
                                    {editSelectedImages.length > 0 && (
                                      <div className="grid grid-cols-3 gap-3">
                                        {editSelectedImages.map((src, i) => (
                                          <div key={i} className="relative aspect-square group">
                                            <img
                                              src={src}
                                              alt={`preview-${i}`}
                                              className="w-full h-full object-cover rounded-lg border-2 border-green-300 shadow-sm"
                                            />
                                            <div className="absolute top-1 left-1 bg-green-500 text-white text-xs px-1 rounded">
                                              ใหม่
                                            </div>
                                            <button
                                              type="button"
                                              onClick={() => removeEditImage(i)}
                                              className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
                                            >
                                              <X className="h-3 w-3" />
                                            </button>
                                          </div>
                                        ))}
                                      </div>
                                    )}

                                    {/* File Size Summary */}
                                    {editSelectedImages.length > 0 && !editProcessing && (
                                      <div className="text-center py-2">
                                        <div className="inline-flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-lg border">
                                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                          <span className="text-sm font-medium">
                                            เลือกแล้ว {editSelectedImages.length} จาก 9 รูป
                                          </span>
                                        </div>
                                      </div>
                                    )}
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
                    ) : task.status === 2 && !solution ? (
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
                              <Label htmlFor="assign_to">มอบหมายงานให้กับ</Label>
                              <Select
                                value={assignId}
                                onValueChange={(value) => setAssignId(value)}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="ยังไม่ได้ระบุ" />
                                </SelectTrigger>
                                <SelectContent>
                                  {assignTo.map((assign) => (
                                    <SelectItem
                                      key={assign.id}
                                      value={assign.id.toString()}
                                    >
                                      {assign.name || "ไม่ได้ระบุ"}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Camera Section */}
                            <div className="space-y-4">
                              <Label>เพิ่มรูปภาพ</Label>
                              
                              {/* Hidden File Inputs */}
                              <input
                                ref={cameraRef}
                                type="file"
                                accept="image/*"
                                capture="environment"
                                multiple
                                onChange={onFileChange}
                                className="hidden"
                              />
                              <input
                                ref={galleryRef}
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={onFileChange}
                                className="hidden"
                              />

                              {/* Camera and Gallery Buttons */}
                              <div className="flex gap-4 mb-4">
                                <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-lg border">
                                  <CameraButton onClick={handleCamera} disabled={processing || selectedImages.length >= 9} />
                                </div>
                                <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-lg border">
                                  <GalleryButton onClick={handleGallery} disabled={processing || selectedImages.length >= 9} />
                                </div>
                                {processing && (
                                  <div className="flex items-center gap-2 text-blue-600">
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                                    <span className="text-sm">บีบอัด...</span>
                                  </div>
                                )}
                              </div>

                              {/* Image Grid Display */}
                              {selectedImages.length > 0 && (
                                <div className="grid grid-cols-3 gap-3">
                                  {selectedImages.map((src, i) => (
                                    <div key={i} className="relative aspect-square group">
                                      <img
                                        src={src}
                                        alt={`preview-${i}`}
                                        className="w-full h-full object-cover rounded-lg border-2 border-slate-300 shadow-sm transition-all duration-300 group-hover:border-slate-400"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => removeImage(i)}
                                        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
                                      >
                                        <X className="h-3 w-3" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* File Size Summary */}
                              {selectedImages.length > 0 && !processing && (
                                <div className="text-center py-2">
                                  <div className="inline-flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-lg border">
                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                    <span className="text-sm font-medium">
                                      เลือกแล้ว {selectedImages.length} จาก 9 รูป
                                    </span>
                                  </div>
                                </div>
                              )}
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
