/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useRef, useState, useEffect } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { FaCamera } from "react-icons/fa";
import { AiFillPicture } from "react-icons/ai";

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
  const [showMenu, setShowMenu] = useState(false);

  const openCamera = () => {
    setShowMenu(false);
    cameraRef.current?.click();
  };

  const openGallery = () => {
    setShowMenu(false);
    galleryRef.current?.click();
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  // ปิดเมนูเมื่อคลิกข้างนอก
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showMenu) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showMenu]);

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

      // สำหรับ compressed images ต้องใช้ state เก่าที่เป็น base64 แล้ว
      // ไม่ใช่ previews ที่เป็น URL
      const currentCompressedImages = previews; // previews คือ base64 strings แล้ว
      const updatedCompressedImages = [
        ...currentCompressedImages,
        ...compressedImages,
      ];

      // จำกัดจำนวนรูปภาพไม่เกิน 3 รูป
      const finalPreviews = updatedPreviews.slice(0, 9);
      const finalFiles = updatedFiles.slice(0, 9);
      const finalCompressedImages = updatedCompressedImages.slice(0, 9);

      if (updatedPreviews.length > 9) {
        alert("สามารถเลือกได้สูงสุด 9 รูปเท่านั้น รูปเก่าจะถูกแทนที่");
      }

      setPreviews(finalPreviews);
      setFiles(finalFiles);

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

    setPreviews(newPreviews);
    setFiles(newFiles);

    if (onImagesCapture) {
      onImagesCapture(newPreviews);
    }

    if (onFilesCapture) {
      onFilesCapture(newFiles);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* พื้นที่แสดงรูปภาพและปุ่มเพิ่ม - ใช้ Grid Layout */}
      <div className="grid lg:grid-cols-4 gap-2 max-w-md md:grid-cols-4 gap-2 max-w-md max-sm:grid-cols-4 gap-2 max-w-md">
        {/* พรีวิวรูปหลายรูป */}
        {previews.map((src, i) => (
          <div key={i} className="relative aspect-square">
            <img
              src={src}
              alt={`preview-${i}`}
              className="w-full h-full object-cover rounded-md border"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeImage(i);
              }}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
            >
              ×
            </button>
          </div>
        ))}

        {/* ปุ่มเพิ่มรูป - แสดงเสมอถ้ายังไม่ครบ 3 รูป */}
        {previews.length < 9 && (
          <div className="relative aspect-square">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleMenu();
              }}
              className="w-full h-full flex items-center justify-center rounded-md border-dashed border-2  shadow-sm active:scale-95 hover:bg-(--secondary)"
              aria-label="Add image"
              type="button"
            >
              <CiCirclePlus size={32} className="text-gray-300" />
            </button>

            {/* เมนูเลือก */}
            {showMenu && (
              <div className="absolute top-full left-0 mt-2 bg-(--card) border rounded-lg shadow-lg z-10 min-w-[150px]">
                <button
                  onClick={openCamera}
                  className="w-full px-4 py-3 text-left hover:bg-(--secondary) flex items-center gap-2 border-b"
                  type="button"
                >
                  <FaCamera size={16} />
                  ถ่ายรูป
                </button>
                <button
                  onClick={openGallery}
                  className="w-full px-4 py-3 text-left hover:bg-(--secondary) flex items-center gap-2"
                  type="button"
                >
                  <AiFillPicture size={16} />
                  เลือกรูปภาพ
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* สถานะ */}
      {processing && (
        <div className="flex items-center justify-center py-2">
          <p className="text-sm text-gray-600">กำลังประมวลผลรูปภาพ...</p>
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