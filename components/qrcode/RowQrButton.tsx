"use client";

// React และ UI components
import * as React from "react";
import { Button } from "@/components/ui/button";
import { QrCode } from "lucide-react";

// PDF และ QR Code libraries
import QRCode from "qrcode";
import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";

// API helper function
import { buildQrUrl } from "@/app/api/qr-pdf";

// Type definition สำหรับข้อมูลแผนก
type Row = {
  id: number;          // รหัสแผนก
  name: string;        // ชื่อแผนก
  branch_id: number;   // รหัสสาขา
  branch_name: string; // ชื่อสาขา
};

// ขนาดกระดาษต่างๆ (หน่วย: points) - 1 inch = 72 points
const PAPER_SIZES = {
  A4: { w: 595.28, h: 841.89 },     // A4 (210 × 297 mm)
  A3: { w: 841.89, h: 1190.55 },   // A3 (297 × 420 mm) 
  A5: { w: 419.53, h: 595.28 },    // A5 (148 × 210 mm)
  LETTER: { w: 612, h: 792 },      // US Letter (8.5 × 11 inch)
  LEGAL: { w: 612, h: 1008 },      // US Legal (8.5 × 14 inch)
  TABLOID: { w: 792, h: 1224 },    // Tabloid (11 × 17 inch)
};

// เลือกขนาดกระดาษที่ต้องการใช้
const PAPER = PAPER_SIZES.A4;  // เปลี่ยนเป็น A3, A5, LETTER, LEGAL, TABLOID ได้
// ขอบกระดาษ (0.5 นิ้ว = 36 points)
const MARGIN = 36;

// ฟังก์ชันแปลงชื่อไฟล์ให้ปลอดภัย
function safeFilename(text: string) {
  return text
    .replaceAll(/[\\/:*?"<>|]/g, "-") // แทนที่อักขระพิเศษด้วย -
    .replaceAll(/\s+/g, "-")          // แทนที่ช่องว่างด้วย -
    .toLowerCase();                    // แปลงเป็นตัวพิมพ์เล็ก
}

// ฟังก์ชันแปลง Data URL เป็น bytes สำหรับฝังใน PDF
async function dataUrlToBytes(dataUrl: string) {
  const res = await fetch(dataUrl);              // ดึงข้อมูลจาก Data URL
  return new Uint8Array(await res.arrayBuffer()); // แปลงเป็น Uint8Array
}

/** สร้าง PDF QR สำหรับ items 1 ตัว (หรือหลายตัวก็ได้) แล้วดาวน์โหลด */
async function generateQrPdf(
  items: Row[],
  opts?: { fileNamePrefix?: string; qrPixelSize?: number }
) {
  // ตั้งค่าเริ่มต้น
  const fileNamePrefix = opts?.fileNamePrefix ?? "nopadol-dept-qr"; // ชื่อไฟล์
  const qrPixelSize = opts?.qrPixelSize ?? 512;                     // ขนาด QR (pixels)

  // สร้างเอกสาร PDF ใหม่
  const pdf = await PDFDocument.create();
  // ลงทะเบียน fontkit เพื่อรองรับฟอนต์ไทย
  pdf.registerFontkit(fontkit);

  // โหลดและฝังฟอนต์ไทย
  const fontBytes = await fetch("/fonts/NotoSansThai_SemiCondensed-Regular.ttf").then((r) => r.arrayBuffer());
  const thaiFont = await pdf.embedFont(fontBytes, { subset: true }); // subset = ใช้เฉพาะตัวอักษรที่ต้องการ

  // วาง 1 รายการ/หน้า (อ่านง่ายและใหญ่)
  for (const d of items) {
    // เพิ่มหน้าใหม่ตามขนาดกระดาษที่เลือก
    const page = pdf.addPage([PAPER.w, PAPER.h]);

    // สร้าง URL สำหรับ QR Code
    const url = buildQrUrl(d.branch_id, d.id);
    // สร้าง QR Code เป็น Data URL (PNG)
    const qrDataUrl = await QRCode.toDataURL(url, {
      width: qrPixelSize,           // ขนาดภาพ QR
      margin: 1,                    // ขอบรอบ QR
      errorCorrectionLevel: "M",    // ระดับการแก้ไขข้อผิดพลาด
    });
    // แปลง Data URL เป็น PNG และฝังใน PDF
    const qrPng = await pdf.embedPng(await dataUrlToBytes(qrDataUrl));

    // คำนวณขนาดและตำแหน่ง QR Code
    const qrSize = Math.min(PAPER.w, PAPER.h) * 0.45; // ขนาด QR = 45% ของด้านที่เล็กกว่า
    const qrX = (PAPER.w - qrSize) / 2;               // จัดกึ่งกลางแนวนอน
    const qrY = (PAPER.h - qrSize) / 2 - 30;          // จัดกึ่งกลางแนวตั้ง (เลื่อนลง 30pt)

    // วาดกรอบรอบหน้า
    page.drawRectangle({
      x: MARGIN,                       // ตำแหน่ง X
      y: MARGIN,                       // ตำแหน่ง Y
      width: PAPER.w - MARGIN * 2,     // ความกว้าง (หักขอบ)
      height: PAPER.h - MARGIN * 2,    // ความสูง (หักขอบ)
      color: rgb(1, 1, 1),          // สีพื้นหลัง (ขาว)
      borderColor: rgb(0.9, 0.9, 0.9), // สีเส้นขอบ (เทาอ่อน)
      borderWidth: 0.5,             // ความหนาเส้นขอบ
    });

    // วาง QR Code ลงในหน้า
    page.drawImage(qrPng, { 
      x: qrX,        // ตำแหน่ง X
      y: qrY,        // ตำแหน่ง Y
      width: qrSize, // ความกว้าง
      height: qrSize // ความสูง
    });

    // เตรียมข้อความที่จะแสดง
    const title = d.name;                                    // ชื่อแผนก
    const sub = `สาขา: ${d.branch_name}`;     // ข้อมูลสาขาและรหัส

    // วาดชื่อแผนก (ด้านบน QR)
    page.drawText(title, {
      x: MARGIN + 20,                    // ตำแหน่ง X (ชิดขอบซ้าย)
      y: qrY + qrSize + 200,         // ตำแหน่ง Y (เหนือ QR 18pt)
      size: 32,                     // ขนาดตัวอักษร
      font: thaiFont,               // ฟอนต์ไทย
      color: rgb(0, 0, 0),          // สีดำ
      maxWidth: PAPER.w - MARGIN * 2,  // ความกว้างสูงสุด
    });

    // วาดข้อมูลสาขาและรหัส (ด้านล่าง)
    page.drawText(sub, {
      x: MARGIN + 20,                       // ตำแหน่ง X (ชิดขอบซ้าย)
      y: 672,                  // ตำแหน่ง Y (เหนือขอบล่าง 14pt)
      size: 32,                        // ขนาดตัวอักษร (เล็กกว่าชื่อแผนก)
      font: thaiFont,                  // ฟอนต์ไทย
      color: rgb(0.5, 0.5, 0.5),    // สีเทาเข้ม
      maxWidth: PAPER.w - MARGIN * 2,     // ความกว้างสูงสุด
    });
  }

  // บันทึก PDF และดาวน์โหลด
  const bytes = await pdf.save();                                                    // แปลง PDF เป็น bytes
  const blob = new Blob([bytes], { type: "application/pdf" });                     // สร้าง Blob
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\..+/, ""); // สร้าง timestamp
  const name = `${safeFilename(fileNamePrefix)}-${stamp}.pdf`;                    // สร้างชื่อไฟล์

  // สร้าง link element และคลิกเพื่อดาวน์โหลด
  const url = URL.createObjectURL(blob);  // สร้าง URL สำหรับ blob
  const a = document.createElement("a");  // สร้าง <a> element
  a.href = url;                           // กำหนด URL
  a.download = name;                      // ตั้งชื่อไฟล์ที่จะดาวน์โหลด
  a.style.display = "none";               // ซ่อน element
  document.body.appendChild(a);           // เพิ่มเข้า DOM
  a.click();                              // คลิกเพื่อดาวน์โหลด
  document.body.removeChild(a);           // ลบออกจาก DOM
  
  // ลบ URL หลังจากดาวน์โหลดเสร็จ
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 100);
}

// Component สำหรับปุ่มดาวน์โหลด QR PDF ของแถวเดียว
export function RowQrButton({ row }: { row: Row }) {
  // State สำหรับแสดงสถานะกำลังประมวลผล
  const [busy, setBusy] = React.useState(false);

  return (
    <Button
      size="icon"                                    // ขนาดปุ่มแบบไอคอน
      variant="secondary"                            // สไตล์ปุ่มแบบ secondary
      className="mr-2"                               // margin-right
      title="ดาวน์โหลด QR "                    // tooltip text
      disabled={busy}                               // ปิดการใช้งานเมื่อกำลังประมวลผล
      onClick={async (e) => {
        e.stopPropagation();                        // หยุดการ bubble up ของ event
        try {
          setBusy(true);                            // เริ่มสถานะประมวลผล
          // เรียกฟังก์ชันสร้าง PDF โดยส่งแถวเดียว
          await generateQrPdf([row], { fileNamePrefix: `dept-${row.id}` });
        } finally {
          setBusy(false);                           // จบสถานะประมวลผล
        }
      }}
    >
      <QrCode className="h-4 w-4" />               {/* ไอคอน QR Code */}
      <span className="sr-only">ดาวน์โหลด QR</span>  {/* ข้อความสำหรับ screen reader */}
    </Button>
  );
}
