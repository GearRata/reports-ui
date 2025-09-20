/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useRef } from "react";
import { useChatID } from "@/app/api/chat";
import { useParams } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { Badge } from "../ui/badge";
import { Wrench } from 'lucide-react';

export default function ChatUserPage() {
  const taskId = Number(useParams().id);
  const { Chat, loading, error } = useChatID(taskId);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
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
    <div className="flex items-center justify-center min-h-screen p-2">
      <div className="w-full max-w-3xl rounded-2xl border bg-white dark:bg-zinc-900 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="flex gap-2 text-lg font-semibold ">
            Chat# {Chat.length > 0 ? Chat[0].ticket_no : `TASK-${taskId}`}
            {Chat.length > 0 && Chat[0].assignto && (
              <Badge><Wrench/> {Chat[0].assignto}</Badge>
            )}
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
              <div key={chat.id} className="flex w-full gap-2">
                <div className="max-w-full rounded-2xl px-3 py-2 text-sm shadow-sm bg-gray-100 dark:bg-zinc-800">
                  <div className="whitespace-pre-wrap break-words">
                    {chat.text}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {chat.file_paths &&
                      Object.entries(chat.file_paths).map(([key, url]) => (
                        <img
                          key={key}
                          src={url}
                          alt="attachment"
                          className=" mt-2 rounded-lg max-w-full h-auto"
                        />
                      ))}
                  </div>
                  <div className="mt-1 text-[14px] opacity-70 text-gray-500 dark:text-gray-400">
                    {new Date(chat.created_at).toLocaleTimeString("th-TH", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
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
    </div>
  );
}
