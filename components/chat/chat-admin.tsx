/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState, useRef } from "react";
import { useChatID } from "@/hooks/useChats";
import { useParams } from "next/navigation";
import { Send, X, MoreHorizontal, Pencil, Trash, Wrench } from "lucide-react";
import CameraButton from "@/components/images/CameraButton";
import GalleryButton from "@/components/images/GalleryButton";
import { addChatNew, updateChat, deleteChat } from "@/hooks/useChats";
import toast from "react-hot-toast";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "../ui/badge";

export default function ChatAdminPage() {
  const taskId = Number(useParams().id);
  const { Chat, loading, error, refreshChat } = useChatID(taskId);
  const [input, setInput] = useState("");
  const [ticketNo, setTicketNo] = useState("");
  const [assign, setAssign] = useState("");
  const [status, setStatus] = useState(0);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [capturedFiles, setCapturedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [editingChatId, setEditingChatId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [editSelectedImages, setEditSelectedImages] = useState<string[]>([]);
  const [editCapturedFiles, setEditCapturedFiles] = useState<File[]>([]);
  const [editProcessing, setEditProcessing] = useState(false);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);
  const editCameraRef = useRef<HTMLInputElement>(null);
  const editGalleryRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/api/v1/problem/${taskId}`
        );
        const data = await response.json();

        if (data.data) {
          setTicketNo(data.data.ticket_no || `TASK-${taskId}`);
          setStatus(data.data.status);
          setAssign(data.data.assign_to);
        }
        return data.data;
      } catch (error) {
        console.error("Error fetching ticket:", error);
      }
    };

    fetchData();
  }, [taskId]);

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

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setCapturedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleEditCamera = () => {
    editCameraRef.current?.click();
  };

  const handleEditGallery = () => {
    editGalleryRef.current?.click();
  };

  const handleEditImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
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
      const updatedFiles = [...editCapturedFiles, ...fileArray];
      const finalImages = updatedImages.slice(0, 9);
      const finalFiles = updatedFiles.slice(0, 9);

      if (updatedImages.length > 9) {
        toast.error("สามารถเลือกได้สูงสุด 9 รูปเท่านั้น");
      }

      setEditSelectedImages(finalImages);
      setEditCapturedFiles(finalFiles);

      if (editCameraRef.current) editCameraRef.current.value = "";
      if (editGalleryRef.current) editGalleryRef.current.value = "";
    } catch (error) {
      console.error("Error processing images:", error);
    } finally {
      setEditProcessing(false);
    }
  };

  const removeEditImage = (index: number) => {
    setEditSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setEditCapturedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleEditChat = (chat: {
    id: number;
    text: string;
    file_paths?: Record<string, string>;
  }) => {
    setEditingChatId(chat.id);
    setEditText(chat.text);
    setEditSelectedImages([]);
    setEditCapturedFiles([]);
    const existing = chat.file_paths
      ? (Object.values(chat.file_paths) as string[])
      : [];
    setExistingImages(existing);
  };

  const handleCancelEdit = () => {
    setEditingChatId(null);
    setEditText("");
    setEditSelectedImages([]);
    setEditCapturedFiles([]);
    setExistingImages([]);
  };

  const handleUpdateChat = async () => {
    if (
      !editText.trim() &&
      editSelectedImages.length === 0 &&
      existingImages.length === 0
    )
      return;

    setIsSubmitting(true);
    try {
      await updateChat(taskId, editingChatId!, {
        id: editingChatId!,
        text: editText,
        images: editCapturedFiles,
        existing_images: existingImages,
      });
      handleCancelEdit();
      refreshChat();
      // Additional refresh to ensure data is up to date
      window.location.reload();
      toast.success("แก้ไขข้อความเรียบร้อยแล้ว");
    } catch (error) {
      console.error("Error updating chat:", error);
      toast.error("ไม่สามารถแก้ไขข้อความได้");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteChat = async (chatId: number) => {
    if (!confirm("คุณต้องการลบข้อความนี้หรือไม่?")) return;

    try {
      const success = await deleteChat(taskId, chatId);
      if (success) {
        refreshChat();
        toast.success("ลบข้อความเรียบร้อยแล้ว");
      } else {
        toast.error("ไม่สามารถลบข้อความได้");
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
      toast.error("เกิดข้อผิดพลาดในการลบข้อความ");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && selectedImages.length === 0) return;

    setIsSubmitting(true);
    try {
      await addChatNew(taskId, {
        id: taskId,
        text: input,
        images: capturedFiles,
      });
      setInput("");
      setSelectedImages([]);
      setCapturedFiles([]);
      refreshChat();
    } catch (error) {
      console.error("Error sending message:", error);
      alert("ไม่สามารถส่งข้อความได้: งานนี้ได้เสร็จสิ้นแล้ว");
    } finally {
      setIsSubmitting(false);
    }
  };
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);

  const formatThaiDate = (date: Date) => {
    const thaiMonths = [
      "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
      "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
    ];
    const day = date.getDate();
    const month = thaiMonths[date.getMonth()];
    const year = date.getFullYear();
    const time = date.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" });
    return `${day} ${month} ${year} ${time}`;
  };

  useEffect(() => {
    // Scroll to input area at the bottom with delay for initial load
    const timer = setTimeout(() => {
      inputRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [Chat.length]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        กำลังโหลด...
      </div>
    );
  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        เกิดข้อผิดพลาด: {error}
      </div>
    );

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
        <div className="flex items-center justify-center min-h-screen p-2">
          <div className="w-full max-w-3xl rounded-2xl border bg-white dark:bg-zinc-900 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <div className="flex-cols gap-2 text-lg font-semibold ">
                <div className="flex pb-3">{ticketNo}</div>
                <div className="flex gap-2">
                  <Badge className="bg-(--input) text-white p-1">
                    <Wrench /> {assign || "ยังไม่มีผู้รับผิดชอบงานนี้"}
                  </Badge>

                  {status === 2 ? (
                    <Badge className="bg-green-500 text-white">เสร็จสิ้น</Badge>
                  ) : status === 1 ? (
                    <Badge className="bg-cyan-500 text-white">
                      กำลังดำเนินการ
                    </Badge>
                  ) : (
                    <Badge className="bg-yellow-500 text-white">
                      รอดำเนินการ
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div ref={listRef} className="h-[520px] overflow-auto p-4">
              <div className="flex flex-col gap-3">
                {Chat.map((chat) => (
                  <div key={chat.id} className="flex flex-col gap-1 group">
                    {/* Date and Time */}
                    <div className="p-2 text-[12px] opacity-70 text-gray-500 dark:text-gray-400 text-center">
                      {formatThaiDate(new Date(chat.created_at))}
                    </div>
                    
                    {/* Message Container */}
                    <div className="flex justify-end max-w-full gap-2 ">

                      <div className="flex flex-1 justify-end items-center opacity-0 group-hover:opacity-100">
                      {editingChatId !== chat.id && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 flex"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleEditChat(chat)}
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              แก้ไข
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteChat(chat.id)}
                              className="text-red-600"
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              ลบ
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                      </div>
                      <div className="relative rounded-2xl px-4 py-2 text-sm shadow-sm bg-gray-100 dark:bg-zinc-800">
                      <div className="absolute bottom-1 -right-2 border-solid border-l-zinc-800 border-l-20 border-y-transparent border-y-12 border-r-0"></div>

                      {editingChatId === chat.id ? (
                        // Edit Mode
                        <div className="space-y-3">
                          <input
                            ref={editCameraRef}
                            type="file"
                            accept="image/*"
                            capture="environment"
                            multiple
                            onChange={handleEditImageChange}
                            className="hidden"
                          />
                          <input
                            ref={editGalleryRef}
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleEditImageChange}
                            className="hidden"
                          />

                          <textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="w-full p-2 border rounded-lg resize-none bg-white dark:bg-zinc-900 dark:border-zinc-600"
                            rows={2}
                            placeholder="แก้ไขข้อความ..."
                          />

                          {/* Existing Images */}
                          {existingImages.length > 0 && (
                            <div className="space-y-2">
                              <div className="text-xs text-gray-600 dark:text-gray-400">
                                รูปภาพเดิม:
                              </div>
                              <div className="grid grid-cols-3 gap-2">
                                {existingImages.map((url, index) => (
                                  <div
                                    key={index}
                                    className="relative aspect-square"
                                  >
                                    <img
                                      src={url}
                                      alt={`existing-${index}`}
                                      className="w-full h-full object-cover rounded border-2 border-blue-300"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => removeExistingImage(index)}
                                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs hover:bg-red-600"
                                    >
                                      <X className="h-2 w-2" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* New Images */}
                          {editSelectedImages.length > 0 && (
                            <div className="space-y-2">
                              <div className="text-xs text-gray-600 dark:text-gray-400">
                                รูปภาพใหม่:
                              </div>
                              <div className="grid grid-cols-3 gap-2">
                                {editSelectedImages.map((src, index) => (
                                  <div
                                    key={index}
                                    className="relative aspect-square"
                                  >
                                    <img
                                      src={src}
                                      alt={`new-${index}`}
                                      className="w-full h-full object-cover rounded border-2 border-green-300"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => removeEditImage(index)}
                                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs hover:bg-red-600"
                                    >
                                      <X className="h-2 w-2" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Edit Controls */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="p-0.5 bg-gray-100 dark:bg-gray-600 rounded hover:bg-blue-200 dark:hover:bg-slate-800">
                                <CameraButton
                                  onClick={handleEditCamera}
                                  disabled={editProcessing}
                                />
                              </div>
                              <div className="p-0.5 bg-blue-100 dark:bg-gray-600 rounded hover:bg-blue-200 dark:hover:bg-slate-800">
                                <GalleryButton
                                  onClick={handleEditGallery}
                                  disabled={editProcessing}
                                />
                              </div>
                              {editProcessing && (
                                <div className="flex items-center gap-1 text-blue-600">
                                  <div className="animate-spin rounded-full h-3 w-3 border border-blue-600 border-t-transparent"></div>
                                  <span className="text-xs">บีบอัด...</span>
                                </div>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={handleCancelEdit}
                                className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                              >
                                ยกเลิก
                              </button>
                              <button
                                type="button"
                                onClick={handleUpdateChat}
                                disabled={
                                  isSubmitting ||
                                  (!editText.trim() &&
                                    editSelectedImages.length === 0 &&
                                    existingImages.length === 0)
                                }
                                className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                              >
                                {isSubmitting ? "บันทึก..." : "บันทึก"}
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        // View Mode
                        <>
                          <div className="flex justify-end mb-2 whitespace-pre-wrap break-words">
                            {chat.text}
                          </div>
                          <div className="">
                            <div className="flex flex-1 flex-row-reverse flex-wrap gap-2">
                              {chat.file_paths &&
                                Object.entries(chat.file_paths).map(
                                  ([key, url]) => (
                                    <img
                                      key={key}
                                      src={url}
                                      alt="attachment"
                                      className="rounded-md w-34 h-34 object-cover"
                                    />
                                  )
                                )}
                            </div>
                          </div>
                        </>
                      )}
                      </div>
                    </div>
                  </div>
                ))}

                {Chat.length === 0 && status === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    ต้องมีผู้รับผิดชอบงานนี้
                  </div>
                )}
                {Chat.length === 0 && status === 1 && (
                  <div className="text-center text-gray-500 py-8">
                    ยังไม่มีความคืบหน้า
                  </div>
                )}
                {/* Input */}
                <div
                  ref={inputRef}
                  className="border-t border-gray-200 dark:border-zinc-800 pt-3"
                >
                  {selectedImages.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 mb-3">
                      {selectedImages.map((src, index) => (
                        <div
                          key={index}
                          className="relative aspect-square group"
                        >
                          <img
                            src={src}
                            alt={`preview-${index}`}
                            className="w-full h-full object-cover rounded-lg border-2 border-gray-200 dark:border-zinc-700 shadow-sm transition-all duration-300 group-hover:border-gray-300 dark:group-hover:border-zinc-600"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <form
                    onSubmit={handleSubmit}
                    className="flex items-center gap-2"
                  >
                    {status === 1 && (
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 bg-gray-100 dark:bg-zinc-800 px-1 py-1 rounded-lg hover:scale-110">
                          <CameraButton
                            onClick={handleCamera}
                            disabled={
                              processing ||
                              isSubmitting ||
                              selectedImages.length >= 9
                            }
                          />
                        </div>
                        <div className="flex items-center gap-1 bg-gray-100 dark:bg-zinc-800 px-1 py-1 rounded-lg hover:scale-110">
                          <GalleryButton
                            onClick={handleGallery}
                            disabled={
                              processing ||
                              isSubmitting ||
                              selectedImages.length >= 9
                            }
                          />
                        </div>
                        {processing && (
                          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                            <span className="text-xs">บีบอัด...</span>
                          </div>
                        )}
                      </div>
                    )}

                    {status === 1 && (
                      <>
                        <input
                          ref={cameraRef}
                          type="file"
                          accept="image/*"
                          capture="environment"
                          multiple
                          onChange={handleImageChange}
                          className=" hidden"
                        />
                        <input
                          ref={galleryRef}
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageChange}
                          className="hidden"
                        />
                        <input
                          className="flex-1 h-10 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="พิมพ์ข้อความ... แล้วกด Enter"
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          disabled={isSubmitting}
                          required
                        />
                        <button
                          type="submit"
                          disabled={
                            (!input.trim() && selectedImages.length === 0) ||
                            isSubmitting
                          }
                          className="h-10 px-4 rounded-xl bg-blue-600 text-white text-sm font-medium disabled:opacity-50 hover:bg-blue-700 group"
                        >
                          {isSubmitting ? (
                            "กำลังส่ง..."
                          ) : (
                            <Send className="transition-transform duration-300 group-hover:rotate-360" />
                          )}
                        </button>
                      </>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
