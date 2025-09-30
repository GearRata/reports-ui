"use client";

import { useState } from "react";

import { Download, ChevronDownIcon  } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { exportFileTaskWithDateRange } from "@/lib/utils";

export function DownLoadFile() {
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [isDownloading, setIsDownloading] = useState(false);
  const [openStart, setOpenStart] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);

  const handlePresetRange = (days: number) => {
    const today = new Date();
    const start = new Date();
    start.setDate(today.getDate() - days + 1);
    setStartDate(start);
    setEndDate(today);
  };

  const handleSelectMonth = (month: number, year: number) => {
    console.log('Month selected:', { month, year });
    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0);
    console.log('Date range set:', { start, end });
    
    // Force new Date objects to trigger re-render
    setStartDate(new Date(start.getTime()));
    setEndDate(new Date(end.getTime()));
  };

  const handleSelectYear = (year: number) => {
    const start = new Date(year, 0, 1);
    const end = new Date(year, 11, 31);
    setStartDate(start);
    setEndDate(end);
  };

  const handleDownload = async () => {
    setIsDownloading(true);

    console.log("Download with dates:", {
      startDate,
      endDate,
      startDateISO: startDate?.toISOString().split("T")[0],
      endDateISO: endDate?.toISOString().split("T")[0],
    });

    try {
      await exportFileTaskWithDateRange(startDate, endDate);
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <Download className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>ดาวน์โหลดข้อมูล CSV</SheetTitle>
          <SheetDescription>
            เลือกช่วงวันที่เพื่อดาวน์โหลดข้อมูล
            หรือไม่ต้องเลือกเพื่อดาวน์โหลดทั้งหมด
          </SheetDescription>
        </SheetHeader>

        <div className="grid grid-cols-5 px-2">
          <div className="flex flex-col gap-3 col-span-2">
            <Label className="px-1">วันที่เริ่มต้น</Label>
            <DropdownMenu open={openStart} onOpenChange={setOpenStart}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between font-normal"
                >
                  {startDate
                    ? startDate.toLocaleDateString('en-US')
                    : "เลือกวันที่เริ่มต้น"}
                  <ChevronDownIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-auto overflow-hidden p-0"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={startDate}
                  captionLayout="dropdown"
                  onSelect={(date) => {
                    console.log("Start date selected:", date);
                    setStartDate(date);
                    setOpenStart(false);
                  }}
                />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-end justify-center text-2xl col-span-1 mb-3">_</div>       
          <div className="flex flex-col gap-3 col-span-2">
            <Label className="px-1">วันที่สิ้นสุด</Label>
            <DropdownMenu open={openEnd} onOpenChange={setOpenEnd}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between font-normal"
                >
                  {endDate
                    ? endDate.toLocaleDateString('en-US')
                    : "เลือกวันที่สิ้นสุด"}
                  <ChevronDownIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-auto overflow-hidden p-0"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={endDate}
                  captionLayout="dropdown"
                  onSelect={(date) => {
                    console.log("End date selected:", date);
                    setEndDate(date);
                    setOpenEnd(false);
                  }}
                />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid grid-cols-2 space-y-4 px-2 gap-2">
          <div className="space-y-2">
            <Label className="text-xs">เลือกเดือน:</Label>
            <Select
              onValueChange={(value) => {
                console.log('Select value:', value);
                const [month, year] = value.split("-").map(Number);
                console.log('Parsed:', { month, year });
                handleSelectMonth(month, year);
              }}
            >
              <SelectTrigger className="h-8 w-full">
                <SelectValue placeholder="เลือกเดือน" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }, (_, i) => {
                  const currentYear = new Date().getFullYear();
                  const monthNames = [
                    "มกราคม",
                    "กุมภาพันธ์",
                    "มีนาคม",
                    "เมษายน",
                    "พฤษภาคม",
                    "มิถุนายน",
                    "กรกฎาคม",
                    "สิงหาคม",
                    "กันยายน",
                    "ตุลาคม",
                    "พฤศจิกายน",
                    "ธันวาคม",
                  ];
                  return (
                    <SelectItem key={i} value={`${i}-${currentYear}`}>
                      {monthNames[i]}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs">เลือกปี:</Label>
            <Select onValueChange={(value) => handleSelectYear(Number(value))}>
              <SelectTrigger className="h-8 w-full">
                <SelectValue placeholder="เลือกปี" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 10 }, (_, i) => {
                  const year = new Date().getFullYear() - i;
                  return (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4 pb-4 px-2">
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const today = new Date();
                setStartDate(today);
                setEndDate(today);
              }}
            >
              วันนี้
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePresetRange(7)}
            >
              7 วัน
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePresetRange(30)}
            >
              1 เดือน
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePresetRange(90)}
            >
              3 เดือน
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePresetRange(180)}
            >
              6 เดือน
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePresetRange(365)}
            >
              1 ปี
            </Button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setStartDate(undefined);
              setEndDate(undefined);
            }}
            className="w-full"
          >
            ล้างวันที่
          </Button>
        </div>

        <SheetFooter >
          <Button
            onClick={handleDownload}
            disabled={isDownloading}
            className="w-full text-white"
          >
            <Download className="h-4 w-4  text-white" />
            {isDownloading ? "Downloading..." : "Download"}
          </Button>
          <SheetClose asChild>
            <Button variant="outline">ปิด</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
