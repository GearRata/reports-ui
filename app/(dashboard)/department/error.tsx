"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Department page error:", error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>เกิดข้อผิดพลาด</AlertTitle>
          <AlertDescription className="mt-2">
            <p>ไม่สามารถโหลดข้อมูลแผนกได้</p>
            {error.message && (
              <p className="text-sm opacity-90 mt-1">
                {error.message}
              </p>
            )}
          </AlertDescription>
        </Alert>

        <div className="flex gap-2">
          <Button onClick={reset} variant="default" className="flex-1">
            <RefreshCw className="mr-2 h-4 w-4" />
            ลองอีกครั้ง
          </Button>
          <Button
            onClick={() => window.location.href = "/dashboard"}
            variant="outline"
            className="flex-1"
          >
            <Home className="mr-2 h-4 w-4" />
            หน้าหลัก
          </Button>
        </div>
      </div>
    </div>
  );
}
