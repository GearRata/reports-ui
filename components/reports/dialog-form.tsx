import React, { useEffect, useState, useCallback } from "react";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { useParams } from "next/navigation";
import { Branch, Department, Program } from "@/types/entities";
import toast from "react-hot-toast";
import CameraPicker from "@/components/camera";
import {
  User,
  Building2,
  Monitor,
  AlertCircle,
  Camera,
  Send,
  Loader2,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function DialogForm() {
  const params = useParams();
  const [reportby, setReportBy] = useState<string>("");
  const [branchID, setBranchID] = useState(0);
  const [departmentID, setDepartmentID] = useState(0);
  const [text, setText] = useState("");
  const [department, setDepartment] = useState<Department | undefined>();
  const [branch, setBranch] = useState<Branch | undefined>();
  const [program, setProgram] = useState<Program | undefined>();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loadingPrograms, setLoadingPrograms] = useState(false);
  const [loadingBranch, setLoadingBranch] = useState(false);
  const [loadingDepartment, setLoadingDepartment] = useState(false);
  const [capturedFiles, setCapturedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleFilesCapture = (files: File[]) => {
    setCapturedFiles(files);
  };

  // useCallback เพื่อป้องกันการสร้างฟังก์ชันใหม่ใน re-render
  const loadProgram = useCallback(async () => {
    setLoadingPrograms(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/api/v1/program/list`
      );
      const data = await response.json();
      if (data.data && data.data.length > 0) {
        setPrograms(data.data);
        // เลือกข้อมูลชุดแรกโดยอัตโนมัติ
        setProgram(data.data[0]);
      } else {
        setPrograms([]);
        setProgram(undefined);
      }
    } catch (error) {
      console.error("Error loading programs:", error);
      setPrograms([]);
      setProgram(undefined);
    } finally {
      setLoadingPrograms(false);
    }
  }, []);

  // useCallback เพื่อป้องกันการสร้างฟังก์ชันใหม่ใน re-render
  const loadBranch = useCallback(async () => {
    if (branchID <= 0) return;

    setLoadingBranch(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/api/v1/branch/${branchID}`
      );
      const data = await response.json();
      if (data.data) {
        setBranch(data.data);
      }
    } catch (error) {
      console.error("Error loading branch:", error);
    } finally {
      setLoadingBranch(false);
    }
  }, [branchID]);

  const loadDepartment = useCallback(async () => {
    if (departmentID <= 0) return;

    setLoadingDepartment(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/api/v1/department/${departmentID}`
      );
      const data = await response.json();
      if (data.data) {
        setDepartment(data.data);
      }
    } catch (error) {
      console.error("Error loading department:", error);
    } finally {
      setLoadingDepartment(false);
    }
  }, [departmentID]);

  // useEffect สำหรับ set parameters จาก URL
  useEffect(() => {
    const branchParam = params.branch;
    const departmentParam = params.department;
    const branchId = Number(branchParam);
    const departmentId = Number(departmentParam);
    setBranchID(branchId);
    setDepartmentID(departmentId);
  }, [params]);

  // useEffect สำหรับโหลดข้อมูล programs (โหลดครั้งเดียวตอน mount)
  useEffect(() => {
    loadProgram();
  }, [loadProgram]);

  // useEffect สำหรับโหลดข้อมูล branch เมื่อ branchID เปลี่ยน
  useEffect(() => {
    loadBranch();
  }, [loadBranch]);

  // useEffect สำหรับโหลดข้อมูล department เมื่อ departmentID เปลี่ยน
  useEffect(() => {
    loadDepartment();
  }, [loadDepartment]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!reportby.trim()) {
      toast.error("กรุณากรอกชื่อผู้แจ้ง");
      return;
    }

    if (!text.trim()) {
      toast.error("กรุณากรอกรายละเอียดปัญหา");
      return;
    }

    if (!program) {
      toast.error("กรุณาเลือกโปรแกรม/ระบบ");
      return;
    }

    setIsSubmitting(true);

    // Build FormData from component state
    try {
      const fd = new FormData();
      fd.append("reported_by", reportby || "");
      fd.append("text", text || "");
      fd.append("branch_id", String(branchID || ""));
      fd.append("department_id", String(departmentID || ""));
      if (program && program.id != null)
        fd.append("system_id", String(program.id));
      fd.append("telegram", String(true));

      // Attach captured files (images)
      if (capturedFiles && capturedFiles.length > 0) {
        capturedFiles.forEach((image, index) => {
          // Use same field name 'images' to send multiple files
          fd.append(`image_${index}`, image);
        });
      }

      console.log("Sending problem create request with FormData");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/api/v1/problem/create`,
        {
          method: "POST",
          body: fd,
        }
      );

      if (!response.ok) {
        const txt = await response.text();
        console.error("Create failed:", response.status, txt);
        toast.error("ไม่สามารถแจ้งปัญหาได้ กรุณาลองใหม่อีกครั้ง");
        return;
      }

      const result = await response.json();
      console.log("Create API Response:", result);
      setIsSuccess(true);
      toast.success("แจ้งปัญหาเรียบร้อยแล้ว");

      // reset form after success animation
      setTimeout(() => {
        setText("");
        setReportBy("");
        setCapturedFiles([]);
        setIsSuccess(false);
      }, 500);

      // optionally refresh page or navigate
      setTimeout(() => window.location.reload(), 500);
      return result;
    } catch (err) {
      console.error("Error creating task:", err);
      toast.error("เกิดข้อผิดพลาดขณะบันทึกข้อมูล");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Modern Glass Card Container */}
      <Card className="border-0 shadow-2xl bg-slate-800/80 backdrop-blur-2xl overflow-hidden border border-slate-700/30 rounded-3xl p-4">
        {/* Enhanced Header Section */}
        <CardHeader className="bg-gradient-to-br from-blue-600/90 via-purple-600/90 to-pink-600/90 text-white pb-8 sm:pb-12 relative overflow-hidden p-4 rounded-2xl">
          {/* Animated Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20"></div>
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
          </div>

          {/* Floating Particles */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/30 rounded-full animate-bounce delay-300"></div>
            <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-white/40 rounded-full animate-bounce delay-700"></div>
            <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-white/20 rounded-full animate-bounce delay-1000"></div>
          </div>

          <div className="relative z-10 text-center space-y-4 sm:space-y-6">
            {/* Icon with Enhanced Animation */}
            <div className="flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-white/30 rounded-3xl blur-xl animate-pulse"></div>
                <div className="relative p-4 sm:p-6 bg-white/20 rounded-3xl backdrop-blur-sm border border-white/30 shadow-2xl transform hover:scale-105 transition-all duration-300">
                  <AlertCircle className="h-8 w-8 sm:h-12 sm:w-12 text-white drop-shadow-2xl animate-pulse" />
                </div>
              </div>
            </div>

            {/* Title Section */}
            <div className="space-y-3">
              <CardTitle className="text-2xl sm:text-4xl lg:text-5xl font-bold mb-3 drop-shadow-2xl bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                แจ้งปัญหาระบบ IT
              </CardTitle>
              <p className="text-white/90 text-sm sm:text-lg font-medium max-w-2xl mx-auto leading-relaxed">
                กรุณากรอกข้อมูลให้ครบถ้วนเพื่อความรวดเร็วในการแก้ไข
              </p>
            </div>

            {/* Enhanced Location Info */}
            <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap pt-4">
              <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm text-xs sm:text-sm px-4 py-2 rounded-full shadow-lg hover:bg-white/30 transition-all duration-300">
                <Building2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                {loadingBranch ? (
                  <div className="animate-pulse bg-white/30 rounded h-3 w-16 sm:h-4 sm:w-20"></div>
                ) : (
                  <span className="font-medium">
                    {branch?.name || "กำลังโหลด..."}
                  </span>
                )}
              </Badge>
              <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm text-xs sm:text-sm px-4 py-2 rounded-full shadow-lg hover:bg-white/30 transition-all duration-300">
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                {loadingDepartment ? (
                  <div className="animate-pulse bg-white/30 rounded h-3 w-20 sm:h-4 sm:w-24"></div>
                ) : (
                  <span className="font-medium">
                    {department?.name || "กำลังโหลด..."}
                  </span>
                )}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 sm:p-10 lg:p-12 space-y-8 sm:space-y-10 bg-gradient-to-b from-slate-800/60 to-slate-900/80 backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-8 sm:space-y-10">
            {/* Enhanced Reporter Information */}
            <div className="space-y-5 group">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-500/30 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
                  <div className="relative p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl transform group-hover:scale-105 transition-all duration-300">
                    <User className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                </div>
                <div>
                  <Label
                    htmlFor="report_by"
                    className="text-base sm:text-lg font-bold text-slate-100 block"
                  >
                    ชื่อผู้แจ้ง{" "}
                    <span className="text-red-400 animate-pulse">*</span>
                  </Label>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    กรอกชื่อจริงเพื่อการติดต่อกลับ
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="relative">
                  <Input
                    type="text"
                    id="report_by"
                    placeholder="เช่น นายสมชาย ใจดี"
                    value={reportby}
                    onChange={(e) => setReportBy(e.target.value)}
                    className={cn(
                      "h-14 sm:h-16 text-base sm:text-lg transition-all duration-500 border-2 rounded-2xl pl-4 pr-12",
                      "bg-slate-700/40 backdrop-blur-xl text-slate-100 placeholder:text-slate-400",
                      "shadow-xl hover:shadow-2xl",
                      reportby.trim()
                        ? "border-green-400/60 focus:border-green-400 bg-green-900/20 shadow-green-500/20 ring-2 ring-green-400/20"
                        : "border-slate-600/40 focus:border-blue-400 hover:border-slate-500/60 focus:ring-2 focus:ring-blue-400/30",
                      "transform hover:scale-[1.02] focus:scale-[1.02] transition-transform duration-300"
                    )}
                    required
                  />
                  {reportby.trim() && (
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <CheckCircle2 className="h-5 w-5 text-green-400 animate-pulse" />
                    </div>
                  )}
                </div>
                {reportby.trim() && (
                  <div className="flex items-center gap-3 text-green-400 text-sm bg-green-900/30 px-4 py-3 rounded-xl border border-green-500/30 backdrop-blur-sm animate-fadeIn">
                    <CheckCircle2 className="h-4 w-4 animate-bounce" />
                    <span className="font-medium">
                      กรอกชื่อผู้แจ้งเรียบร้อย
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced System Selection */}
            <div className="space-y-5 group">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-purple-500/30 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
                  <div className="relative p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-xl transform group-hover:scale-105 transition-all duration-300">
                    <Monitor className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                </div>
                <div>
                  <Label
                    htmlFor="program"
                    className="text-base sm:text-lg font-bold text-slate-100 block"
                  >
                    ปัญหา <span className="text-red-400 animate-pulse">*</span>
                  </Label>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    เลือกระบบที่เกิดปัญหา
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <Select
                  value={program?.id?.toString() || ""}
                  onValueChange={(value) => {
                    const selectedProgram = programs.find(
                      (p) => p.id.toString() === value
                    );
                    setProgram(selectedProgram);
                  }}
                  disabled={loadingPrograms}
                >
                  <SelectTrigger
                    className={cn(
                      "h-14 sm:h-16 text-base sm:text-lg border-2 rounded-2xl transition-all duration-500",
                      "bg-slate-700/40 backdrop-blur-xl text-slate-100 shadow-xl hover:shadow-2xl",
                      program
                        ? "border-green-400/60 bg-green-900/20 shadow-green-500/20 ring-2 ring-green-400/20"
                        : "border-slate-600/40 hover:border-slate-500/60 focus:ring-2 focus:ring-purple-400/30",
                      "transform hover:scale-[1.02] focus:scale-[1.02] transition-transform duration-300"
                    )}
                  >
                    <SelectValue
                      placeholder={
                        loadingPrograms
                          ? "กำลังโหลด..."
                          : "เลือกระบบที่เกิดปัญหา"
                      }
                    >
                      {loadingPrograms ? (
                        <div className="flex items-center gap-3 text-slate-400">
                          <Loader2 className="h-5 w-5 animate-spin" />
                          <span>กำลังโหลด...</span>
                        </div>
                      ) : (
                        <span
                          className={cn(
                            "flex items-center gap-3",
                            program ? "text-slate-100" : "text-slate-400"
                          )}
                        >
                          {program && (
                            <Monitor className="h-4 w-4 text-purple-400" />
                          )}
                          {program?.name || "เลือกโปรแกรม"}
                        </span>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl bg-slate-800/95 backdrop-blur-xl border-slate-600/50 shadow-2xl">
                    {loadingPrograms ? (
                      <SelectItem
                        value="loading"
                        disabled
                        className="text-slate-400 py-4"
                      >
                        <div className="flex items-center gap-3">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>กำลังโหลดโปรแกรม...</span>
                        </div>
                      </SelectItem>
                    ) : programs.length === 0 ? (
                      <SelectItem
                        value="empty"
                        disabled
                        className="text-slate-400 py-4"
                      >
                        <div className="flex items-center gap-3">
                          <AlertCircle className="h-4 w-4" />
                          <span>ไม่พบโปรแกรมที่ใช้งานได้</span>
                        </div>
                      </SelectItem>
                    ) : (
                      programs.map((program) => (
                        <SelectItem
                          key={program.id}
                          value={program.id.toString()}
                          className="text-slate-100 focus:bg-slate-700/70 py-4 rounded-xl m-1 transition-all duration-200 hover:bg-slate-700/50"
                        >
                          <div className="flex items-center gap-3">
                            <Monitor className="h-4 w-4 text-purple-400" />
                            <span className="font-medium">{program.name}</span>
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {program && (
                  <div className="flex items-center gap-3 text-green-400 text-sm bg-green-900/30 px-4 py-3 rounded-xl border border-green-500/30 backdrop-blur-sm animate-fadeIn">
                    <CheckCircle2 className="h-4 w-4 animate-bounce" />
                    <span className="font-medium">
                      เลือกโปรแกรมแล้ว: {program.name}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced Problem Description */}
            <div className="space-y-5 group">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-orange-500/30 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
                  <div className="relative p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-xl transform group-hover:scale-105 transition-all duration-300">
                    <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                </div>
                <div>
                  <Label
                    htmlFor="text"
                    className="text-base sm:text-lg font-bold text-slate-100 block"
                  >
                    รายละเอียดปัญหา{" "}
                    <span className="text-red-400 animate-pulse">*</span>
                  </Label>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    อธิบายปัญหาให้ละเอียดเพื่อการแก้ไขที่รวดเร็ว
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="relative">
                  <Textarea
                    id="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className={cn(
                      "min-h-[140px] sm:min-h-[160px] text-base sm:text-lg border-2 rounded-2xl transition-all duration-500 resize-none p-4",
                      "bg-slate-700/40 backdrop-blur-xl text-slate-100 placeholder:text-slate-400",
                      "shadow-xl hover:shadow-2xl",
                      text.trim()
                        ? "border-green-400/60 focus:border-green-400 bg-green-900/20 shadow-green-500/20 ring-2 ring-green-400/20"
                        : "border-slate-600/40 focus:border-orange-400 hover:border-slate-500/60 focus:ring-2 focus:ring-orange-400/30",
                      "transform hover:scale-[1.01] focus:scale-[1.01] transition-transform duration-300"
                    )}
                    placeholder="📝 อธิบายปัญหาที่พบ เช่น:&#10;• ข้อความ error ที่ปรากฏ&#10;• ขั้นตอนที่ทำก่อนเกิดปัญหา&#10;• ผลกระทบที่เกิดขึ้น&#10;• เวลาที่เกิดปัญหา"
                    maxLength={500}
                    required
                  />
                  <div className="absolute bottom-4 right-4">
                    <div
                      className={cn(
                        "text-xs px-3 py-1 rounded-full backdrop-blur-sm border transition-all duration-300",
                        text.length > 450
                          ? "text-orange-300 bg-orange-900/40 border-orange-500/30"
                          : text.length > 0
                          ? "text-green-300 bg-green-900/40 border-green-500/30"
                          : "text-slate-400 bg-slate-700/40 border-slate-600/30"
                      )}
                    >
                      {text.length}/500
                    </div>
                  </div>
                </div>

                {text.trim() && (
                  <div className="flex items-center gap-3 text-green-400 text-sm bg-green-900/30 px-4 py-3 rounded-xl border border-green-500/30 backdrop-blur-sm animate-fadeIn">
                    <CheckCircle2 className="h-4 w-4 animate-bounce" />
                    <span className="font-medium">กรอกรายละเอียดเรียบร้อย</span>
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced Image Upload */}
            <div className="space-y-5 group">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-green-500/30 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
                  <div className="relative p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-xl transform group-hover:scale-105 transition-all duration-300">
                    <Camera className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <Label className="text-base sm:text-lg font-bold text-slate-100">
                      แนบรูปภาพประกอบ
                    </Label>
                    <Badge className="text-xs bg-slate-600/50 text-slate-300 border-slate-500/50 px-3 py-1 rounded-full">
                      ไม่บังคับ
                    </Badge>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    ถ่ายรูปหรือเลือกจากแกลเลอรี่ (สูงสุด 9 รูป)
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="border-2 border-dashed border-slate-600/40 rounded-2xl p-4 sm:p-8 hover:border-slate-500/60 transition-all duration-500 bg-slate-700/20 backdrop-blur-xl group-hover:bg-slate-700/30">
                  <CameraPicker onFilesCapture={handleFilesCapture} />
                </div>

                {/* Enhanced File Counter */}
                {capturedFiles.length > 0 && (
                  <div className="mt-4 flex items-center justify-between gap-4 text-sm text-green-400 bg-green-900/30 px-4 py-3 rounded-xl border border-green-500/30 backdrop-blur-sm animate-fadeIn">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-500/20 rounded-lg">
                        <Camera className="h-4 w-4 text-green-400" />
                      </div>
                      <div>
                        <span className="font-medium">
                          แนบรูปภาพแล้ว {capturedFiles.length} ไฟล์
                        </span>
                        <p className="text-xs text-green-300/80 mt-0.5">
                          ขนาดต้นฉบับ:{" "}
                          {(
                            capturedFiles.reduce(
                              (total, file) => total + file.size,
                              0
                            ) / 1024
                          ).toFixed(1)}{" "}
                          KB → จะส่งแบบบีบอัด
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-xs text-green-300">พร้อมส่ง</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced Submit Button */}
            <div className="pt-14 sm:pt-8">
              <div className="relative">
                <Button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    !reportby.trim() ||
                    !text.trim() ||
                    !program ||
                    isSuccess
                  }
                  className={cn(
                    "w-full h-16 sm:h-18 text-base sm:text-xl font-bold transition-all duration-500 rounded-2xl relative overflow-hidden",
                    isSuccess
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 shadow-green-500/25"
                      : "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700",
                    "shadow-2xl hover:shadow-3xl transform hover:scale-[1.02] active:scale-[0.98]",
                    "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
                    "focus:ring-4 focus:ring-blue-400/30 border border-white/20",
                    "text-white drop-shadow-lg group"
                  )}
                >
                  {/* Button Background Animation */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                  <div className="relative z-10">
                    {isSuccess ? (
                      <div className="flex items-center justify-center gap-4">
                        <CheckCircle2 className="h-6 w-6 sm:h-7 sm:w-7 text-white animate-bounce" />
                        <span>ส่งข้อมูลสำเร็จ!</span>
                      </div>
                    ) : isSubmitting ? (
                      <div className="flex items-center justify-center gap-4">
                        <Loader2 className="h-6 w-6 sm:h-7 sm:w-7 animate-spin" />
                        <span>กำลังส่งข้อมูล...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-4">
                        <Send className="h-6 w-6 sm:h-7 sm:w-7 group-hover:translate-x-1 transition-transform duration-300" />
                        <span>แจ้งปัญหา</span>
                      </div>
                    )}
                  </div>
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
