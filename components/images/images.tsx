/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useRef, useState, useEffect } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { X } from 'lucide-react';

interface CameraPickerProps {
  onImagesCapture?: (images: string[]) => void;
  onFilesCapture?: (files: File[]) => void;
}

export default function CameraPicker({
  onImagesCapture,
  onFilesCapture,
}: CameraPickerProps) {
  const cameraRef = useRef<HTMLInputElement | null>(null);
  const galleryRef = useRef<HTMLInputElement | null>(null);
  const [previews, setPreviews] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);

  const [compressedSizes, setCompressedSizes] = useState<number[]>([]);

  const openCamera = () => {
    cameraRef.current?.click();
  };

  const openGallery = () => {
    galleryRef.current?.click();
  };





  // ฟังก์ชันบีบอัดรูปภาพ (บีบอัดมากขึ้น)
  const compressImage = (
    file: File,
    maxWidth: number = 400, // ลดขนาดลงเหลือ 400px
    quality: number = 0.3 // ลดคุณภาพลงเหลือ 30%
  ): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;
      const img = new Image();

      img.onload = () => {
        // คำนวณขนาดใหม่
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;

        // วาดรูปภาพที่บีบอัดแล้ว
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // แปลงเป็น base64 ด้วยคุณภาพต่ำ
        const compressedDataUrl = canvas.toDataURL("image/jpeg", quality);

        console.log(`Original file: ${(file.size / 1024).toFixed(2)}KB`);
        console.log(
          `Compressed base64: ${(compressedDataUrl.length / 1024).toFixed(2)}KB`
        );

        resolve(compressedDataUrl);
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    setProcessing(true);

    try {
      const fileArray = Array.from(selectedFiles);
      const compressedImages: string[] = [];
      const newPreviewUrls: string[] = [];

      for (const file of fileArray) {
        const compressed = await compressImage(file);

        // ตรวจสอบขนาดหลังบีบอัด ถ้ายังใหญ่เกิน 200KB ให้บีบอัดอีกครั้ง
        if (compressed.length > 200 * 1024) {
          console.log("Image still too large, compressing further...");
          const superCompressed = await compressImage(file, 300, 0.2);
          compressedImages.push(superCompressed);
          newPreviewUrls.push(superCompressed);
        } else {
          compressedImages.push(compressed);
          newPreviewUrls.push(compressed);
        }
      }

      // เพิ่มรูปใหม่ต่อท้ายรูปเก่า แทนการแทนที่
      const updatedPreviews = [...previews, ...newPreviewUrls];
      const updatedFiles = [...files, ...fileArray];
      const newCompressedSizes = compressedImages.map((img) => img.length);
      const updatedCompressedSizes = [
        ...compressedSizes,
        ...newCompressedSizes,
      ];

      // สำหรับ compressed images ต้องใช้ state เก่าที่เป็น base64 แล้ว
      // ไม่ใช่ previews ที่เป็น URL
      const currentCompressedImages = previews; // previews คือ base64 strings แล้ว
      const updatedCompressedImages = [
        ...currentCompressedImages,
        ...compressedImages,
      ];

      // จำกัดจำนวนรูปภาพไม่เกิน 9 รูป
      const finalPreviews = updatedPreviews.slice(0, 9);
      const finalFiles = updatedFiles.slice(0, 9);
      const finalCompressedImages = updatedCompressedImages.slice(0, 9);
      const finalCompressedSizes = updatedCompressedSizes.slice(0, 9);

      if (updatedPreviews.length > 9) {
        alert("สามารถเลือกได้สูงสุด 9 รูปเท่านั้น รูปเก่าจะถูกแทนที่");
      }

      setPreviews(finalPreviews);
      setFiles(finalFiles);
      setCompressedSizes(finalCompressedSizes);

      // ส่งรูปภาพทั้งหมด (เก่า + ใหม่) กลับไปให้ parent component
      if (onImagesCapture) {
        onImagesCapture(finalCompressedImages);
      }

      // ส่ง File objects ทั้งหมดกลับไปให้ parent component
      if (onFilesCapture) {
        onFilesCapture(finalFiles);
      }

      // รีเซ็ต input เพื่อให้สามารถเลือกไฟล์เดิมได้อีก
      if (cameraRef.current) cameraRef.current.value = "";
      if (galleryRef.current) galleryRef.current.value = "";
    } catch (error) {
      console.error("Error processing images:", error);
    } finally {
      setProcessing(false);
    }
  };

  const removeImage = (index: number) => {
    const newPreviews = previews.filter((_, i) => i !== index);
    const newFiles = files.filter((_, i) => i !== index);
    const newCompressedSizes = compressedSizes.filter((_, i) => i !== index);

    setPreviews(newPreviews);
    setFiles(newFiles);
    setCompressedSizes(newCompressedSizes);

    if (onImagesCapture) {
      onImagesCapture(newPreviews);
    }

    if (onFilesCapture) {
      onFilesCapture(newFiles);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Enhanced Grid Layout for Images */}
      <div className="grid grid-cols-3 xs:grid-cols-4 lg:grid-cols-5 gap-3">
        {/* Enhanced Image Previews */}
        {previews.map((src, i) => (
          <div key={i} className="relative aspect-square group animate-fadeIn">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
            <img
              src={src}
              alt={`preview-${i}`}
              className="absolute inset-0 w-full h-full object-cover rounded-2xl border-2 border-slate-600/40 shadow-xl transition-all duration-300 group-hover:border-slate-500/60 group-hover:shadow-2xl transform group-hover:scale-[1.02]"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeImage(i);
              }}
              className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 border-2 border-white/20 backdrop-blur-sm"
            >
              <X className="h-4 w-4"/>
            </button>
            {/* Image Number Badge */}
          </div>
        ))}

     
      </div>

      {/* Enhanced Processing Status */}
      {processing && (
        <div className="flex items-center justify-center py-6 animate-fadeIn">
          <div className="flex items-center gap-4 bg-slate-700/60 px-6 py-4 rounded-2xl border border-slate-600/40 backdrop-blur-xl shadow-xl">
            <div className="relative">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-400 border-t-transparent"></div>
              <div className="absolute inset-0 rounded-full bg-blue-400/20 animate-pulse"></div>
            </div>
            <div>
              <p className="text-sm text-slate-200 font-medium">
                กำลังประมวลผลรูปภาพ...
              </p>
              <p className="text-xs text-slate-400 mt-0.5">กรุณารอสักครู่</p>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced File Size Summary */}
      {previews.length > 0 && !processing && (
        <div className="text-center py-2">
          <div className="inline-flex flex-col items-center gap-2 bg-slate-700/40 px-4 py-3 rounded-xl border border-slate-600/30 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-slate-300 font-medium">
                เลือกแล้ว {previews.length} จาก 9 รูป
              </span>
            </div>
            {files.length > 0 && compressedSizes.length > 0 && (
              <div className="text-xs text-slate-400 flex items-center gap-4">
                <span>
                  ขนาดต้นฉบับ:{" "}
                  <span className="text-blue-300 font-medium">
                    {(
                      files.reduce((total, file) => total + file.size, 0) / 1024
                    ).toFixed(1)}{" "}
                    KB
                  </span>
                </span>
                <span className="text-slate-500">→</span>
                <span>
                  บีบอัดแล้ว:{" "}
                  <span className="text-green-300 font-medium">
                    {(
                      compressedSizes.reduce((total, size) => total + size, 0) /
                      1024
                    ).toFixed(1)}{" "}
                    KB
                  </span>
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* input สำหรับถ่ายรูป */}
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment" // เปิดกล้องหลัง
        multiple
        onChange={onFileChange}
        className="hidden"
      />

      {/* input สำหรับเลือกรูปจากแกลเลอรี่ */}
      <input
        ref={galleryRef}
        type="file"
        accept="image/*"
        multiple
        onChange={onFileChange}
        className="hidden"
      />
    </div>
  );
}
