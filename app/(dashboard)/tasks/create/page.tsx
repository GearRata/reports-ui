"use client";

import * as React from "react";
import { useMemo, useEffect, useState, useRef } from "react";
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
import { addTaskNew } from "@/app/api/tasks";
import { useType } from "@/app/api/type";
import { useProgramsForDropdown } from "@/app/api/programs";
import { useIPPhonesForDropdown } from "@/app/api/phones";
import CameraButton from "@/components/images/CameraButton";
import GalleryButton from "@/components/images/GalleryButton";
import ImageCompressor from "@/components/images/ImageCompressor";
import { cn } from "@/lib/utils";
import { ChevronsUpDown, Check } from "lucide-react";
import toast from "react-hot-toast";

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
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [reportBy, setReportBy] = useState<string>("");
  const [phoneElse, setPhoneElse] = useState<string>("");
  const [open, setOpen] = React.useState(false);
  const [processing, setProcessing] = useState(false);
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

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
            : 0,
        phone_else: phoneId === "0" ? phoneElse : "",
        system_id: Number(programID),
        text,
        status: 0, // Default to pending
        issue_type: Number(type),
        issue_else: issue || "",
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

  const handleCamera = () => {
    cameraRef.current?.click();
  };

  const handleGallery = () => {
    galleryRef.current?.click();
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

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleImagesChange = (images: string[], files: File[]) => {
    setSelectedImages(images);
    setCapturedFiles(files);
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
                      <div className="grid grid-cols-2 gap-4">
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
                                {phoneId ? (
                                  phoneId === "0" ? (
                                    "ไม่มีเบอร์"
                                  ) : (
                                    (() => {
                                      const phone = ipPhones.find(
                                        (phone) => phone.id.toString() === phoneId
                                      );
                                      return phone
                                        ? `${phone.number} - ${phone.name}`
                                        : "Select Phone ID...";
                                    })()
                                  )
                                ) : (
                                  <span className="text-muted-foreground">
                                    Select Phone IP
                                  </span>
                                )}
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
                                      value="0"
                                      onSelect={() => {
                                        setPhoneId("0");
                                        setOpen(false);
                                      }}
                                    >
                                      ไม่มีเบอร์
                                      <Check
                                        className={cn(
                                          "ml-auto",
                                          phoneId === "0" ? "opacity-100" : "opacity-0"
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
                        
                        {/* Phone Else Input - แสดงเมื่อเลือก "ไม่มีเบอร์" */}
                        {phoneId === "0" && (
                          <div className="space-y-2">
                            <Label htmlFor="phone_else">เบอร์โทรศัพท์</Label>
                            <input
                              type="text"
                              id="phone_else"
                              className="w-full border-1 rounded-md p-2"
                              value={phoneElse}
                              onChange={(e) => setPhoneElse(e.target.value)}
                              placeholder="กรอกเบอร์โทรศัพท์ (เช่น 081-234-5678)"
                            />
                          </div>
                        )}
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
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label>Add image</Label>
                          <div className="flex gap-3">
                            <div className="flex items-center gap-2 bg-slate-700/40 backdrop-blur-xl px-1.5 py-1 rounded-2xl border border-slate-600/40 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-120">
                              <GalleryButton
                                onClick={handleGallery}
                                disabled={
                                  processing || selectedImages.length >= 9
                                }
                              />
                            </div>
                            <div className="flex items-center gap-2 bg-slate-700/40 backdrop-blur-xl px-1.5 rounded-2xl border border-slate-600/40 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-120">
                              <CameraButton
                                onClick={handleCamera}
                                disabled={
                                  processing || selectedImages.length >= 9
                                }
                              />
                            </div>
                          </div>
                        </div>

                        <ImageCompressor
                          selectedImages={selectedImages}
                          capturedFiles={capturedFiles}
                          onImagesChange={handleImagesChange}
                          processing={processing}
                        />

                        {/* Hidden File Inputs */}
                        <input
                          ref={cameraRef}
                          type="file"
                          accept="image/*"
                          capture="environment"
                          multiple
                          onChange={handleImageChange}
                          className="hidden"
                        />
                        <input
                          ref={galleryRef}
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageChange}
                          className="hidden"
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
