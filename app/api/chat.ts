"use client"

import { useEffect, useState, useCallback } from "react";
import type { ChatData, AddChat, UpdateChat } from "@/types/chat/model";

export function useChatID(id: number) {
  const [Chat, setChat] = useState<ChatData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChatID = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/api/v1/progress/${id}`
      );
      if (!response.ok) throw new Error("Failed to fetch Chat");
      const data = await response.json();
      setChat(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchChatID();
  }, [fetchChatID]);

  return { Chat, loading, error, refreshChat: fetchChatID };
}

export async function addChatNew(id: number, chat: AddChat) {
  try {
    // สร้าง payload แบบ JSON (ขนาดเล็กกว่า FormData)
    const formData = new FormData();
    formData.append("text", chat.text);

    // เพิ่มรูปภาพ (ถ้ามี)
    if (chat.images && chat.images.length > 0) {
      chat.images.forEach((image, index) => {
        formData.append(`image_${index}`, image);
      });
    }

    // เพิ่ม base64 images (ถ้ามี) - ลองใช้ field name หลายแบบ
    if (chat.file_paths && chat.file_paths.length > 0) {
      chat.file_paths.forEach((base64, index) => {
        // แปลง base64 เป็น Blob
        const byteCharacters = atob(base64.split(",")[1]);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "image/jpeg" });
        
        // ใช้ field name ที่ Backend ต้องการ
         formData.append(`image_${index}`, blob);
      });
    }
    // Debug FormData contents
    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/api/v1/progress/create/${id}`,
      {
        method: "POST",
        body: formData, // ไม่ต้องใส่ Content-Type header เพราะ browser จะใส่ให้อัตโนมัติ
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Create failed:", response.status, errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    const result = await response.json();
    console.log("Create API Response:", result);
    return result;
  } catch (error) {
    console.error("Error creating chat:", error);
    throw error;
  }
}

export async function updateChat(
  taskid: number,
  chatid: number,
  chat: UpdateChat
) {
  try {
    const formData = new FormData();
    formData.append("text", chat.text);

    // เพิ่มรูปภาพใหม่ (ถ้ามี)
    if (chat.images && chat.images.length > 0) {
      chat.images.forEach((image, index) => {
        formData.append(`image_${index}`, image);
      });
    }

    // เพิ่ม base64 images (ถ้ามี) - สำหรับกรณีที่ยังต้องการใช้
    if (chat.file_paths && chat.file_paths.length > 0) {
      chat.file_paths.forEach((base64, index) => {
        // แปลง base64 เป็น Blob
        const byteCharacters = atob(base64.split(",")[1]);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "image/jpeg" });
        formData.append(`image_${index}`, blob);
      });
    }

    // เพิ่มลิงค์รูปภาพเดิม (ให้ backend จัดการ)
    if (chat.existing_images && chat.existing_images.length > 0) {
      formData.append("image_urls", JSON.stringify(chat.existing_images));
      console.log("Sending existing image URLs to API:", chat.existing_images);
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/api/v1/progress/update/${taskid}/${chatid}`,
      {
        method: "PUT",
        body: formData,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Update failed:", response.status, errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    console.log("Update API Response:", result);
    return result;
  } catch (error) {
    console.error("Error updating solution:", error);
    throw error;
  }
}

export async function deleteChat(taskid: number, chatid: number) {
  try {
      const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE}/api/v1/progress/delete/${taskid}/${chatid}`,
    {
      method: "DELETE",
    }
  );
  return response.ok;
  } catch (error) {
    console.log("Error delete solution", error);
    throw error;
  }
}
