/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useRef, useState } from "react";
import { useChatID } from "@/app/api/chat";
import { useParams } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { Badge } from "../ui/badge";
import { Wrench } from "lucide-react";

export default function ChatUserPage() {
  const taskId = Number(useParams().id);
  const { Chat, loading, error } = useChatID(taskId);
  const listRef = useRef<HTMLDivElement>(null);

  const [ticketNo, setTicketNo] = useState("");
  const [status, setStatus] = useState(0);
  const [assign, setAssign] = useState("");
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerImages, setViewerImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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


  useEffect(() => {
    if (Chat.length > 0) {
      setTimeout(() => {
        listRef.current?.scrollTo({
          top: listRef.current.scrollHeight,
          behavior: "smooth",
        });
      }, 100);
    }
  }, [Chat.length]);

  // Additional scroll on initial load
  useEffect(() => {
    if (!loading && Chat.length > 0) {
      setTimeout(() => {
        listRef.current?.scrollTo({
          top: listRef.current.scrollHeight,
          behavior: "auto",
        });
      }, 500);
    }
  }, [loading, Chat.length]);

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
    if (!viewerOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight")
        setCurrentImageIndex((prev) => (prev + 1) % viewerImages.length);
      if (e.key === "ArrowLeft")
        setCurrentImageIndex(
          (prev) => (prev - 1 + viewerImages.length) % viewerImages.length
        );
      if (e.key === "Escape") setViewerOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [viewerOpen, viewerImages.length]);

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
                <Badge className="bg-cyan-500 text-white">กำลังดำเนินการ</Badge>
              ) : (
                <Badge className="bg-yellow-500 text-white">รอดำเนินการ</Badge>
              )}
            </div>
          </div>

          <div className="flex relative ">
            <MessageCircle className="w-8 h-8" />

            <div className="flex items-center justify-center absolute -top-1 -right-1 bg-red-500 size-5 rounded-full animate-bounce  ">
              {Chat.length}
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
                <div className="max-w-fit relative rounded-2xl px-3 py-2 text-sm shadow-sm bg-gray-100 dark:bg-zinc-800">
                  <div className="absolute bottom-1 -left-2 border-solid border-r-zinc-800 border-r-20 border-y-transparent border-y-12 border-l-0 whitespace-pre-wrap break-words"></div>
                  <div className="flex justify-start mb-2 whitespace-pre-wrap break-words">
                    {chat.text}
                  </div>
                  <div className="flex justify-start mt-1">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      {chat.file_paths &&
                        Object.entries(chat.file_paths).map(
                          ([key, url], index) => (
                            <button
                              key={key}
                              type="button"
                              className="relative aspect-square"
                              onClick={() => {
                                const images = Object.values(chat.file_paths!);
                                setViewerImages(images);
                                setCurrentImageIndex(index);
                                setViewerOpen(true);
                              }}
                            >
                              <img
                                src={url}
                                alt={`image ${index + 1}`}
                                className="w-full h-full object-cover rounded-md border cursor-pointer hover:opacity-80"
                                loading="lazy"
                              />
                            </button>
                          )
                        )}
                    </div>
                  </div>
                  
                </div>
                <div className="max-w-full flex flex-1 justify-end items-center"></div>
              </div>
            ))}

            {Chat.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                ยังไม่มีความคืบหน้า
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image Viewer Modal */}
      {viewerOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={() => setViewerOpen(false)}
        >
          <div className="relative max-w-[95vw] max-h-[95vh]">
            <img
              src={viewerImages[currentImageIndex]}
              alt={`Preview ${currentImageIndex + 1}`}
              className="max-h-[80vh] w-auto mx-auto rounded-lg object-contain"
              onClick={(e) => e.stopPropagation()}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
            {viewerImages.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(
                      (prev) =>
                        (prev - 1 + viewerImages.length) % viewerImages.length
                    );
                  }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full p-1 bg-gray-500/60 text-white hover:bg-gray-500/80"
                  aria-label="Previous"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(
                      (prev) => (prev + 1) % viewerImages.length
                    );
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 bg-gray-500/60 text-white hover:bg-gray-500/80"
                  aria-label="Next"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </>
            )}
            {viewerImages.length > 0 && (
              <div className="absolute left-1/2 -translate-x-1/2 bottom-2 bg-black/60 text-white px-2 py-1 rounded">
                {currentImageIndex + 1} / {viewerImages.length}
              </div>
            )}
            <button
              onClick={() => setViewerOpen(false)}
              className="absolute top-2 right-2 bg-gray-500/60 text-white p-1 rounded-full hover:bg-gray-500/80"
              aria-label="Close"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
