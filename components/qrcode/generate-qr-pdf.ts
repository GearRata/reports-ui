"use client";

import QRCode from "qrcode";
import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { buildQrUrl } from "@/app/api/qr-pdf";

export type RowLike = {
  id: number;
  name: string;
  branch_id: number;
  branch_name: string;
};

const A4 = { w: 595.28, h: 841.89 };
const MARGIN = 36;

function safeFilename(text: string) {
  return text
    .replaceAll(/[\\/:*?"<>|]/g, "-")
    .replaceAll(/\s+/g, "-")
    .toLowerCase();
}

async function dataUrlToBytes(dataUrl: string) {
  const res = await fetch(dataUrl);
  return new Uint8Array(await res.arrayBuffer());
}

/** สร้าง PDF QR สำหรับ items 1 ตัว (หรือหลายตัวก็ได้) แล้วดาวน์โหลด */
export async function generateQrPdf(
  items: RowLike[],
  opts?: { fileNamePrefix?: string; qrPixelSize?: number }
) {
  const fileNamePrefix = opts?.fileNamePrefix ?? "nopadol-dept-qr";
  const qrPixelSize = opts?.qrPixelSize ?? 512;

  const pdf = await PDFDocument.create();
  pdf.registerFontkit(fontkit);

  // ฟอนต์ไทย (ต้องมีที่ /public/fonts/NotoSansThai-Light.ttf)
  const fontBytes = await fetch("/fonts/NotoSansThai-Light.ttf").then((r) => r.arrayBuffer());
  const thaiFont = await pdf.embedFont(fontBytes, { subset: true });

  // วาง 1 รายการ/หน้า (อ่านง่ายและใหญ่)
  for (const d of items) {
    const page = pdf.addPage([A4.w, A4.h]);

    const url = buildQrUrl(d.branch_id, d.id);
    const qrDataUrl = await QRCode.toDataURL(url, {
      width: qrPixelSize,
      margin: 1,
      errorCorrectionLevel: "M",
    });
    const qrPng = await pdf.embedPng(await dataUrlToBytes(qrDataUrl));

    const qrSize = Math.min(A4.w, A4.h) * 0.55;
    const qrX = (A4.w - qrSize) / 2;
    const qrY = (A4.h - qrSize) / 2 - 30;

    page.drawRectangle({
      x: MARGIN,
      y: MARGIN,
      width: A4.w - MARGIN * 2,
      height: A4.h - MARGIN * 2,
      color: rgb(1, 1, 1),
      borderColor: rgb(0.9, 0.9, 0.9),
      borderWidth: 0.5,
    });

    page.drawImage(qrPng, { x: qrX, y: qrY, width: qrSize, height: qrSize });

    const title = d.name;
    const sub = `สาขา: ${d.branch_name} • ID: ${d.id}`;

    page.drawText(title, {
      x: MARGIN,
      y: qrY + qrSize + 18,
      size: 16,
      font: thaiFont,
      color: rgb(0, 0, 0),
      maxWidth: A4.w - MARGIN * 2,
    });

    page.drawText(sub, {
      x: MARGIN,
      y: MARGIN + 14,
      size: 12,
      font: thaiFont,
      color: rgb(0.25, 0.25, 0.25),
      maxWidth: A4.w - MARGIN * 2,
    });
  }

  const bytes = await pdf.save();
  const blob = new Blob([bytes], { type: "application/pdf" });
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\..+/, "");
  const name = `${safeFilename(fileNamePrefix)}-${stamp}.pdf`;

  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  URL.revokeObjectURL(a.href);
}
