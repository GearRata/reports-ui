"use client";
import React, { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import QRCode from "qrcode";

export default function SuccessPage() {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [ticketNo, setTicketNo] = useState<string>("");
  const [taskId, setTaskId] = useState<number>(0);

  useEffect(() => {
    const fetchDataAndGenerateQR = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/api/v1/problem/list`
        );
        const data = await response.json();

        if (data.data && data.data.length > 0) {
          const firstTask = data.data[0];
          const chatUrl = `${window.location.origin}/tasks/chat/user/${firstTask.id}`;
          const qrUrl = await QRCode.toDataURL(chatUrl);
          setQrCodeUrl(qrUrl);
          setTicketNo(firstTask.ticket_no || `TASK-${firstTask.id}`);
          setTaskId(firstTask.id);
        }
      } catch (error) {
        console.error("Error generating QR code:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDataAndGenerateQR();
  }, []);

  return (
    <div
      className="backdrop-opacity-10  bg-white/5
        w-full min-h-dvh max-w-4xl mx-auto rounded-2xl border  p-5 flex items-center justify-center opacity-100"
    >
      <div className="grid grid-cols-2 gap-8 place-items-center max-md:grid-cols-1 max-md:text-center">
        <div className="flex flex-col justify-center items-center">
          <div className="space-y-4 mt-2 mb-2">
            <Image
              src="/correct.png"
              alt="Success"
              width={150}
              height={150}
              className="object-contain"
            />
          </div>
          <h1 className="flex items-center justify-center ml-3 inline ">
            <p className="text-3xl font-extrabold">
              แจ้งปัญหาเสร็จเรียบร้อย!
            </p>
            <p className="text-lg font-light">
              สามารถดูปัญหาที่แจ้งไปได้โดยการสแกน QR CODE หรือกดไปที่ลิงค์ได้เลย!
            </p>
            <a
              href={`/tasks/chat/user/${taskId}`}
              className="flex items-center justify-center text-lg inline text-blue-500 hover:text-blue-700 underline gap-1 group"
            >
              ติดตามความคืบหน้า <ArrowRight size={24} className="inline group-hover:translate-x-1.5 duration-200" />
            </a>
          </h1>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold mb-4">{ticketNo}</p>
          {loading ? (
            <p className="text-gray-500">กำลังโหลด...</p>
          ) : qrCodeUrl ? (
            <div>
              <img
                src={qrCodeUrl}
                alt="QR Code"
                className="w-48 h-48 border-2 border-gray-300 rounded-lg shadow-lg"
              />
            </div>
          ) : (
            <p className="text-gray-500">ไม่สามารถสร้าง QR Code ได้</p>
          )}
        </div>
      </div>
    </div>
  );
}
