"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { QrCode } from "lucide-react";
import { generateQrPdf } from "./generate-qr-pdf";

type Row = {
  id: number;
  name: string;
  branch_id: number;
  branch_name: string;
};

export function RowQrButton({ row }: { row: Row }) {
  const [busy, setBusy] = React.useState(false);

  return (
    <Button
      size="icon"
      variant="secondary"
      className="mr-2"
      title="ดาวน์โหลด QR (แถวนี้)"
      disabled={busy}
      onClick={async (e) => {
        e.stopPropagation();
        try {
          setBusy(true);
          await generateQrPdf([row], { fileNamePrefix: `dept-${row.id}` });
        } finally {
          setBusy(false);
        }
      }}
    >
      <QrCode className="h-4 w-4" />
      <span className="sr-only">ดาวน์โหลด QR</span>
    </Button>
  );
}
