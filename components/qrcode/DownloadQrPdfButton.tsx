"use client";

import * as React from "react";
import QRCode from "qrcode";
import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { buildQrUrl } from "@/app/api/qr-pdf";
import { DepartmentData } from "@/types/qr-code/model"
import { Button } from "@/components/ui/button";
import { QrCode } from 'lucide-react';

// กำหนดขนาดกระดาษ A4
const A4 = { w: 595.28, h: 841.89 };
// ขอบหน้า
const MARGIN = 36; // 0.5 inch
// layout 2 คอลัมน์ × 3 แถว = 6 QR/หน้า
const COLS = 2;
const ROWS = 3;

function chunk<T>(arr: T[], size: number) {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

async function dataUrlToBytes(dataUrl: string) {
  const res = await fetch(dataUrl);
  return new Uint8Array(await res.arrayBuffer());
}

function safeFilename(text: string) {
  return text
    .replaceAll(/[\\/:*?"<>|]/g, "-")
    .replaceAll(/\s+/g, "-")
    .toLowerCase();
}

type Props = {
  items: DepartmentData[];
  fileNamePrefix?: string;
  qrPixelSize?: number; // ความละเอียดของ PNG ที่ฝังใน PDF (px)
};

export function DownloadQrPdfButton({
  items,
  fileNamePrefix = "nopadol-qr",
  qrPixelSize = 512,
}: Props) {
  const [busy, setBusy] = React.useState(false);

  const handleDownload = async () => {
    try {
      setBusy(true);

      // 1) สร้างเอกสาร PDF + ลงทะเบียน fontkit เพื่อรองรับฟอนต์ไทย
      const pdf = await PDFDocument.create();
      pdf.registerFontkit(fontkit);

      // โหลดฟอนต์ไทยจาก public/fonts
      const fontBytes = await fetch("/fonts/NotoSansThai_SemiCondensed-Regular.ttf").then((r) =>
        r.arrayBuffer()
      );
      const thaiFont = await pdf.embedFont(fontBytes, { subset: true });

      const cellW = (A4.w - MARGIN * 2) / COLS;
      const cellH = (A4.h - MARGIN * 2) / ROWS;

      // ขนาด QR บนกระดาษ (pt) ~ 70% ของ cell
      const qrPtSize = Math.min(cellW, cellH) * 0.7;

      // 2) สร้างหน้า/วางกริดทีละ 6 รายการ
      const pages = chunk(items, COLS * ROWS);
      for (const batch of pages) {
        const page = pdf.addPage([A4.w, A4.h]);
        const draw = page.drawText.bind(page);

        // ชื่อหัวกระดาษ (ถ้าต้องการ)
        const headerTxt = "NOPADOL - Department QR Codes";
        page.drawText(headerTxt, {
          x: MARGIN,
          y: A4.h - MARGIN + 6, // เลยขึ้นไปเล็กน้อย
          size: 10,
          font: thaiFont,
          color: rgb(0.3, 0.3, 0.3),
        });

        for (let i = 0; i < batch.length; i++) {
          const d = batch[i];

          // 2.1) เตรียม URL สำหรับ QR
          const url = buildQrUrl(d.branch_id, d.id);

          // 2.2) สร้าง QR dataURL
          const qrDataUrl = await QRCode.toDataURL(url, {
            width: qrPixelSize,
            margin: 1,
            errorCorrectionLevel: "M",
          });

          const qrPng = await pdf.embedPng(await dataUrlToBytes(qrDataUrl));

          // 2.3) หา position ช่องที่จะวาง (row/col)
          const col = i % COLS;
          const row = Math.floor(i / COLS);

          const x0 = MARGIN + col * cellW;
          const y0 = A4.h - MARGIN - (row + 1) * cellH;

          // ระยะถอยเข้าใน cell
          const pad = 10;

          // วาง QR ให้อยู่ตรงกลางช่อง
          const qrX = x0 + (cellW - qrPtSize) / 2;
          const qrY = y0 + (cellH - qrPtSize) / 2 - 10; // ขยับลงนิดเพื่อเผื่อ text

          page.drawRectangle({
            x: x0,
            y: y0,
            width: cellW,
            height: cellH,
            color: rgb(1, 1, 1),
            borderColor: rgb(0.9, 0.9, 0.9),
            borderWidth: 0.5,
          });

          page.drawImage(qrPng, {
            x: qrX,
            y: qrY,
            width: qrPtSize,
            height: qrPtSize,
          });

          // 2.4) วางข้อความไทย: department + branch + id
          const labelTop = qrY + qrPtSize + 22; // เส้นฐานตัวอักษรเหนือ QR
          const txtSize = 14;

          // แสดงชื่อแผนก
          draw(d.name, {
            x: x0 + pad,
            y: Math.min(y0 + cellH, labelTop),
            size: txtSize,
            font: thaiFont,
            color: rgb(0, 0, 0),
            maxWidth: cellW - pad * 2,
          });

          // แสดงสาขา
          draw(`สาขา: ${d.branch_name}`, {
            x: x0 + 145,
            y: Math.min(y0 + cellH, labelTop),
            size: txtSize,
            font: thaiFont,
            color: rgb(0.15, 0.15, 0.15),
            maxWidth: cellW - pad * 2,
          });

          // แสดงรหัส
          // draw(`ID: ${d.id}`, {
          //   x: x0 + cellW - pad - 160,
          //   y: y0 + 18,
          //   size: 9,
          //   font: thaiFont,
          //   color: rgb(0.35, 0.35, 0.35),
          //   maxWidth: 100,
          // });
        }
      }

      // 3) บันทึกและดาวน์โหลด
      const bytes = await pdf.save();
      const blob = new Blob([bytes], { type: "application/pdf" });
      const stamp = new Date()
        .toISOString()
        .replace(/[-:]/g, "")
        .replace(/\..+/, "");
      const name = `${safeFilename(fileNamePrefix)}-${stamp}.pdf`;
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = name;
      a.click();
      URL.revokeObjectURL(a.href);
    } catch (err) {
      console.error(err);
      alert("สร้าง PDF ไม่สำเร็จ ลองใหม่อีกครั้ง");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Button onClick={handleDownload} disabled={busy} className="bg-linear-to-r/srgb from-indigo-500 to-teal-400">
      {busy ? "กำลังสร้าง PDF..." 
      : <span className="flex justify-center items-center gap-2 text-white s">
        <QrCode className="h-5 w-5" />All QR Code</span>}
    </Button>
  );
}
