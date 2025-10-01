"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>ไม่สามารถโหลด Dashboard</AlertTitle>
          <AlertDescription className="mt-2 space-y-2">
            <p>เกิดข้อผิดพลาดในการโหลดข้อมูล Dashboard</p>
            {error.message && (
              <p className="text-sm opacity-90">
                รายละเอียด: {error.message}
              </p>
            )}
          </AlertDescription>
        </Alert>

        <Button
          onClick={reset}
          variant="default"
          className="w-full"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          ลองอีกครั้ง
        </Button>
      </div>
    </div>
  );
}
