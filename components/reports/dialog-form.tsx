import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { useParams, useRouter } from "next/navigation";
import { useIPPhonesForDropdown } from "@/hooks/usePhones";
import { Branch, Department, Program, Type, IPPhone } from "@/types/entities";
import toast from "react-hot-toast";
import ImageCompressor from "@/components/images/ImageCompressor";
import CameraButton from "@/components/images/CameraButton";
import GalleryButton from "@/components/images/GalleryButton";
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
  CircuitBoard,
  MessageCircle,
  Phone,
  ChevronsUpDown,
  Smartphone,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function DialogForm() {
  const params = useParams();
  const router = useRouter();
  const { ipPhones } = useIPPhonesForDropdown();
  const [reportby, setReportBy] = useState<string>("");
  const [branchID, setBranchID] = useState(0);
  const [departmentID, setDepartmentID] = useState(0);
  const [text, setText] = useState("");
  const [department, setDepartment] = useState<Department | undefined>();
  const [phoneID, setPhoneID] = useState<IPPhone | undefined>();
  const [branch, setBranch] = useState<Branch | undefined>();
  const [programID, setProgramID] = useState<Program | undefined>();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [typeID, setTypeID] = useState<Type | undefined>();
  const [types, setTypes] = useState<Type[]>([]);
  const [loadingPrograms, setLoadingPrograms] = useState(false);
  const [loadingType, setLoadingType] = useState(false);
  const [loadingBranch, setLoadingBranch] = useState(false);
  const [loadingDepartment, setLoadingDepartment] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [capturedFiles, setCapturedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [issue, setIssue] = useState<string>("");
  const [phoneElse, setPhoneElse] = useState<string>("");
  const [open, setOpen] = React.useState(false);

  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);
  const [processing, setProcessing] = useState(false);

  const compressImage = (
    file: File,
    maxWidth: number = 400,
    quality: number = 0.3
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject(new Error("Canvas context not available"));
          return;
        }

        const img = new Image();
        const objectUrl = URL.createObjectURL(file);

        img.onload = () => {
          try {
            const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
            canvas.width = img.width * ratio;
            canvas.height = img.height * ratio;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            const compressedDataUrl = canvas.toDataURL("image/jpeg", quality);

            // Clean up object URL
            URL.revokeObjectURL(objectUrl);
            resolve(compressedDataUrl);
          } catch (error) {
            URL.revokeObjectURL(objectUrl);
            reject(error);
          }
        };

        img.onerror = () => {
          URL.revokeObjectURL(objectUrl);
          reject(new Error(`Failed to load image: ${file.name}`));
        };

        img.src = objectUrl;
      } catch (error) {
        reject(error);
      }
    });
  };

  const handleCamera = () => {
    cameraRef.current?.click();
  };

  const handleGallery = () => {
    galleryRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    console.log(`📷 Selected ${selectedFiles.length} files`);
    setProcessing(true);

    try {
      const fileArray = Array.from(selectedFiles);
      const compressedImages: string[] = [];
      const processedFiles: File[] = [];

      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i];
        console.log(
          `🔄 Processing file ${i + 1}/${fileArray.length}: ${file.name} (${(
            file.size / 1024
          ).toFixed(2)}KB)`
        );

        try {
          const compressed = await compressImage(file);
          if (compressed.length > 200 * 1024) {
            console.log(`🔄 File too large, super compressing...`);
            const superCompressed = await compressImage(file, 300, 0.2);
            compressedImages.push(superCompressed);
          } else {
            compressedImages.push(compressed);
          }
          processedFiles.push(file);
          console.log(`✅ Successfully processed file ${i + 1}`);
        } catch (error) {
          console.error(`❌ Error processing file ${i + 1}:`, error);
          toast.error(`ไม่สามารถประมวลผลรูปภาพ ${file.name} ได้`);
        }
      }

      const updatedImages = [...selectedImages, ...compressedImages];
      const updatedFiles = [...capturedFiles, ...processedFiles];
      const finalImages = updatedImages.slice(0, 9);
      const finalFiles = updatedFiles.slice(0, 9);

      if (updatedImages.length > 9) {
        toast.error("สามารถเลือกได้สูงสุด 9 รูปเท่านั้น");
      }

      console.log(
        `📊 Final result: ${finalImages.length} images, ${finalFiles.length} files`
      );
      setSelectedImages(finalImages);
      setCapturedFiles(finalFiles);

      if (cameraRef.current) cameraRef.current.value = "";
      if (galleryRef.current) galleryRef.current.value = "";
    } catch (error) {
      console.error("❌ Error processing images:", error);
      toast.error("เกิดข้อผิดพลาดขณะประมวลผลรูปภาพ");
    } finally {
      setProcessing(false);
    }
  };

  const handleImagesChange = (images: string[], files: File[]) => {
    setSelectedImages(images);
    setCapturedFiles(files);
  };

  // Check if form has unsaved changes
  const hasUnsavedChanges = useMemo(() => {
    return (
      reportby.trim() !== "" ||
      phoneID !== undefined ||
      phoneElse.trim() !== "" ||
      text.trim() !== "" ||
      (programID?.id === 0 && issue.trim() !== "") ||
      capturedFiles.length > 0
    );
  }, [reportby, phoneID, phoneElse, text, programID, issue, capturedFiles]);

  // Handle browser navigation warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges && !isSubmitting && !isSuccess) {
        e.preventDefault();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges, isSubmitting, isSuccess]);

  useEffect(() => {
    setProgramID(undefined); // ล้างโปรแกรมเดิม
    setIssue(""); // ล้างช่อง "ระบุปัญหาเพิ่มเติม"
  }, [typeID]);

  const filteredPrograms = useMemo(() => {
    if (!typeID) return [];
    return (programs || []).filter((p) => p.type_id === typeID.id);
  }, [programs, typeID]);

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
      } else {
        setPrograms([]);
        setProgramID(undefined);
      }
    } catch (error) {
      console.error("Error loading programs:", error);
      setPrograms([]);
      setProgramID(undefined);
    } finally {
      setLoadingPrograms(false);
    }
  }, []);

  const loadType = useCallback(async () => {
    setLoadingType(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/api/v1/program/type/list`
      );
      const data = await response.json();
      if (data.data && data.data.length > 0) {
        setTypes(data.data);
        setTypeID(data.data[0]);
      } else {
        setTypes([]);
        setTypeID(undefined);
      }
    } catch (error) {
      console.error("Error loading type:", error);
      setTypes([]);
      setTypeID(undefined);
    } finally {
      setLoadingType(false);
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

    // เช็คและแปลงค่า branch
    const branchId = Number(branchParam);
    if (!isNaN(branchId) && branchId === branchID) {
      return; // ค่าเท่ากัน ไม่ต้องอัปเดต
    }
    if (!isNaN(branchId)) {
      setBranchID(branchId);
    } else {
      console.warn("Invalid branch parameter:", branchParam);
      setBranchID(0);
    }

    // เช็คและแปลงค่า department
    const departmentId = Number(departmentParam);
    if (!isNaN(departmentId) && departmentId === departmentID) {
      return; // ค่าเท่ากัน ไม่ต้องอัปเดต
    }
    if (!isNaN(departmentId)) {
      setDepartmentID(departmentId);
    } else {
      console.warn("Invalid department parameter:", departmentParam);
      setDepartmentID(0);
    }
  }, [params, branchID, departmentID]);

  // useEffect สำหรับโหลดข้อมูล programs (โหลดครั้งเดียวตอน mount)
  useEffect(() => {
    loadProgram();
  }, [loadProgram]);

  // useEffect สำหรับโหลดข้อมูล Type (โหลดครั้งเดียวตอน mount)
  useEffect(() => {
    loadType();
  }, [loadType]);

  // useEffect สำหรับโหลดข้อมูล branch เมื่อ branchID เปลี่ยน
  useEffect(() => {
    loadBranch();
  }, [loadBranch]);

  // useEffect สำหรับโหลดข้อมูล department เมื่อ departmentID เปลี่ยน
  useEffect(() => {
    loadDepartment();
  }, [loadDepartment]);

  const handleSubmit = async (e: React.FormEvent) => {
    if (!text.trim() && selectedImages.length === 0) return;
    e.preventDefault();

    if (!reportby.trim()) {
      toast.error("กรุณากรอกชื่อผู้แจ้ง");
      return;
    }

    if (!phoneID) {
      toast.error("กรุณาเลือก IP Phone");
      return;
    }

    if (phoneID.id === 0 && !phoneElse.trim()) {
      toast.error("กรุณากรอกเบอร์โทรศัพท์");
      return;
    }

    if (!text.trim()) {
      toast.error("กรุณากรอกรายละเอียดปัญหา");
      return;
    }

    if (!programID) {
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
      if (phoneID && phoneID.id != null) {
        if (phoneID.id === 0) {
          fd.append("phone_id", "0");
          fd.append("phone_else", phoneElse.trim());
        } else {
          fd.append("phone_id", String(phoneID.id));
        }
      }
      if (programID && programID.id != null)
        fd.append("system_id", String(programID.id));
      if (typeID && typeID.id != null)
        fd.append("issue_type", String(typeID.id));
      if (programID?.id === 0 && issue.trim())
        fd.append("issue_else", issue.trim());
      fd.append("telegram", String(true));

      // Attach captured files (images) - ใช้ field name แยกตาม index
      if (capturedFiles && capturedFiles.length > 0) {
        console.log(`📸 Attaching ${capturedFiles.length} images to FormData`);
        capturedFiles.forEach((image, index) => {
          console.log(
            `📎 Adding image ${index + 1}: ${image.name} (${(
              image.size / 1024
            ).toFixed(2)}KB)`
          );
          // ใช้ field name แยกตาม index เช่น image_0, image_1, image_2
          fd.append(`image_${index}`, image);
        });
      }

      // Debug FormData contents
      console.log("📋 FormData contents:");
      for (const [key, value] of fd.entries()) {
        if (value instanceof File) {
          console.log(
            `${key}: ${value.name} (${(value.size / 1024).toFixed(2)}KB)`
          );
        } else {
          console.log(`${key}: ${value}`);
        }
      }

      console.log(
        `🚀 Sending problem create request with FormData (${capturedFiles.length} images)`
      );

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
        toast.error("กรุณากรอกข้อมูลให้ครบถ้วน");
        return;
      }

      const result = await response.json();
      console.log("Create API Response:", result);
      setIsSuccess(true);
      toast.success("แจ้งปัญหาเรียบร้อยแล้ว");
      router.push("/public/success");

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
            </div>

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
            {/* ==================== FIELD สำหรับกรอกชื่อผู้แจ้ง ====================*/}
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
                  </Label>
                </div>
              </div>
              <div className="space-y-3">
                <div className="relative">
                  <Input
                    type="text"
                    id="report_by"
                    value={reportby}
                    onChange={(e) => setReportBy(e.target.value)}
                    className={cn(
                      "h-14 sm:h-16 text-base sm:text-lg transition-all duration-500 border-2 rounded-2xl pl-4 pr-4",
                      "bg-slate-700/40 backdrop-blur-xl text-slate-100 placeholder:text-slate-600 placeholder:text-xl",
                      "shadow-xl hover:shadow-2xl",
                      "border-slate-600/40 focus:border-blue-400 hover:border-slate-500/60 focus:ring-2 focus:ring-blue-400/30",
                      "transform hover:scale-[1.02] focus:scale-[1.02] transition-transform duration-300"
                    )}
                    required
                  />
                </div>
              </div>
            </div>

            {/* ==================== DROPDOWN เลือก IP Phone ====================*/}

            <div className="space-y-5 group">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-purple-500/30 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
                  <div className="relative p-3 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl shadow-xl transform group-hover:scale-105 transition-all duration-300">
                    <Phone className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                </div>
                <div>
                  <Label
                    htmlFor="phone"
                    className="text-base sm:text-lg font-bold text-slate-100 block"
                  >
                    IP Phone
                  </Label>
                </div>
              </div>
              <div className="space-y-3">
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className={cn(
                        "w-full py-7 justify-start  text-base sm:text-lg transition-all duration-500 border-2 rounded-2xl pl-4 pr-4",
                        "bg-slate-700/40 backdrop-blur-xl text-slate-100 placeholder:text-slate-600",
                        "shadow-xl hover:shadow-2xl",
                        "border-slate-600/40 focus:border-blue-400 hover:border-slate-500/60 focus:ring-2 focus:ring-blue-400/30",
                        "transform hover:scale-[1.02] focus:scale-[1.02] transition-transform duration-300"
                      )}
                    >
                      {phoneID ? (
                        phoneID.id === 0 ? (
                          "ไม่มีเบอร์ IP Phone"
                        ) : (
                          `${phoneID.number} - ${phoneID.name}`
                        )
                      ) : (
                        <span className="text-slate-600">เลือก IP Phone</span>
                      )}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command className="bg-gradient-to-b from-slate-800/60 to-slate-900/80 backdrop-blur-xl">
                      <CommandInput
                        placeholder="Search phone..."
                        className="h-9"
                      />
                      <CommandList>
                        <CommandEmpty>No phone found.</CommandEmpty>
                        <CommandGroup>
                          <CommandItem
                            value="0"
                            onSelect={() => {
                              setPhoneID({
                                id: 0,
                                number: 0,
                                name: "ไม่ได้ระบุ Phone ID",
                                branch_id: 0,
                                branch_name: "",
                                department_id: 0,
                                department_name: "",
                              });
                              setOpen(false);
                            }}
                          >
                            ไม่มีเบอร์ IP Phone
                          </CommandItem>
                          {ipPhones.map((phone) => (
                            <CommandItem
                              key={phone.id}
                              value={`${phone.number} ${phone.name}`}
                              onSelect={() => {
                                setPhoneID(phone);
                                setOpen(false);
                              }}
                            >
                              {phone.number} - {phone.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                {/* ถ้าไม่มี IP Phone สามารถกรอกเองได้ */}
                {phoneID?.id === 0 && (
                  <div className="space-y-6 group">
                    <div className="flex items-center gap-4 mt-6">
                      <div className="relative">
                        <div className="absolute inset-0 bg-purple-500/30 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
                        <div className="relative p-3 bg-gradient-to-br from-lime-500 to-lime-600 rounded-2xl shadow-xl transform group-hover:scale-105 transition-all duration-300">
                          <Smartphone className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                        </div>
                      </div>
                      <div>
                        <Label
                          htmlFor="phone_else"
                          className="text-base sm:text-lg font-bold text-slate-100 block"
                        >
                          <span className="text-red-500">*</span>{" "}
                          กรอกเบอร์โทรศัพท์หรือ IP Phone
                        </Label>
                      </div>
                    </div>
                    <Input
                      type="text"
                      placeholder="หรือกรอกเบอร์โทรศัพท์เอง (เช่น 081-234-5678)"
                      value={phoneElse}
                      onChange={(e) => setPhoneElse(e.target.value)}
                      disabled={!phoneID || phoneID.id !== 0}
                      className={cn(
                        "h-14 sm:h-16 text-base sm:text-lg transition-all duration-500 border-2 rounded-2xl pl-4 pr-4",
                        "bg-slate-700/40 backdrop-blur-xl text-slate-100 placeholder:text-slate-600",
                        "shadow-xl hover:shadow-2xl",
                        "border-slate-600/40 focus:border-yellow-400 hover:border-slate-500/60 focus:ring-2 focus:ring-yellow-400/30",
                        "transform hover:scale-[1.02] focus:scale-[1.02] transition-transform duration-300",
                        (!phoneID || phoneID.id !== 0) &&
                          "opacity-50 cursor-not-allowed"
                      )}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* ==================== DROPDOWN เลือก Type ====================*/}
            <div className="space-y-5 group">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-purple-500/30 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
                  <div className="relative p-3 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl shadow-xl transform group-hover:scale-105 transition-all duration-300">
                    <CircuitBoard className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                </div>
                <div>
                  <Label
                    htmlFor="type"
                    className="text-base sm:text-lg font-bold text-slate-100 block"
                  >
                    Type
                  </Label>
                </div>
              </div>
              <div className="space-y-3">
                <Select
                  value={typeID?.id?.toString() || ""}
                  onValueChange={(value) => {
                    const selectedType = types.find(
                      (p) => p.id.toString() === value
                    );
                    setTypeID(selectedType);
                  }}
                  disabled={loadingType}
                >
                  <SelectTrigger
                    className={cn(
                      "w-full py-7 sm:h-16 text-base sm:text-lg border-2 rounded-2xl transition-all duration-500",
                      "bg-slate-700/40 backdrop-blur-xl text-slate-100 shadow-xl hover:shadow-2xl",
                      "border-slate-600/40 hover:border-slate-500/60 focus:ring-2 focus:ring-purple-400/30",
                      "transform hover:scale-[1.02] focus:scale-[1.02] transition-transform duration-300",
                      "data-[placeholder]:text-slate-600"
                    )}
                  >
                    <SelectValue
                      placeholder={
                        loadingType ? "กำลังโหลด..." : "เลือกชนิดปัญหา"
                      }
                    >
                      {loadingType ? (
                        <div className="flex items-center gap-3 text-slate-600">
                          <Loader2 className="h-5 w-5 animate-spin" />
                          <span>กำลังโหลด...</span>
                        </div>
                      ) : (
                        <span
                          className={cn(
                            "flex items-center gap-3",
                            typeID ? "text-slate-100" : "text-slate-600"
                          )}
                        >
                          {typeID && (
                            <Monitor className="h-4 w-4 text-purple-400" />
                          )}
                          {typeID?.name || "เลือกชนิดปัญหา"}
                        </span>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl bg-slate-800/95 backdrop-blur-xl border-slate-600/50 shadow-2xl">
                    {loadingType ? (
                      <SelectItem
                        value="loading"
                        disabled
                        className="text-slate-400 py-4"
                      >
                        <div className="flex items-center gap-3">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>กำลังโหลดชนิดปัญหา...</span>
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
                          <span>ไม่พบชนิดปัญหาที่ใช้งานได้</span>
                        </div>
                      </SelectItem>
                    ) : (
                      types.map((type) => (
                        <SelectItem
                          key={type.id}
                          value={type.id.toString()}
                          className="text-slate-100 focus:bg-slate-700/70 py-4 rounded-xl m-1 transition-all duration-200 hover:bg-slate-700/50"
                        >
                          <div className="flex items-center gap-3">
                            <Monitor className="h-4 w-4 text-purple-400" />
                            <span className="font-medium">{type.name}</span>
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* ==================== DROPDOWN เลือกปัญหา ====================*/}
            <div className="space-y-5 grid grid-cols-2 gap-4 place-content-center max-md:grid-cols-1">
              <div className="space-y-5 group">
                <div className="flex items-center gap-4 ">
                  <div className="relative p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-xl transform group-hover:scale-105 transition-all duration-300">
                    <Monitor className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>

                  <div>
                    <Label
                      htmlFor="program"
                      className="text-base sm:text-lg font-bold text-slate-100 block"
                    >
                      ระบบที่เกิดปัญหา
                    </Label>
                  </div>
                </div>
                <div className="mt-5">
                  <Select
                    value={programID?.id?.toString() || ""}
                    onValueChange={(value) => {
                      if (value === "0") {
                        setProgramID({ id: 0, name: "อื่นๆ", type_id: 0 });
                      } else {
                        const selectedProgram = filteredPrograms.find(
                          (p) => p.id.toString() === value
                        );
                        setProgramID(selectedProgram);
                      }
                    }}
                    disabled={!typeID}
                  >
                    <SelectTrigger
                      className={cn(
                        "w-full py-7 sm:h-16 text-base sm:text-lg border-2 rounded-2xl transition-all duration-500",
                        "bg-slate-700/40 backdrop-blur-xl text-slate-100 shadow-xl hover:shadow-2xl",
                        "border-slate-600/40 hover:border-slate-500/60 focus:ring-2 focus:ring-purple-400/30",
                        "transform hover:scale-[1.02] focus:scale-[1.02] transition-transform duration-300",
                        "data-[placeholder]:text-slate-600"
                      )}
                    >
                      <SelectValue
                        placeholder={
                          typeID
                            ? "เลือกระบบที่เกิดปัญหา..."
                            : "เลือชนิดปัญหาก่อน..."
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
                              programID ? "text-slate-100" : "text-slate-400"
                            )}
                          >
                            {programID && (
                              <Monitor className="h-4 w-4 text-purple-400" />
                            )}
                            {programID?.name || "เลือกโปรแกรม"}
                          </span>
                        )}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl bg-slate-800/95 backdrop-blur-xl border-slate-600/50 shadow-2xl">
                      <SelectItem
                        value="0"
                        className="text-slate-100 focus:bg-slate-700/70 py-4 rounded-xl m-1 transition-all duration-200 hover:bg-slate-700/50"
                      >
                        <div className="flex items-center gap-3">
                          <Monitor className="h-4 w-4 text-purple-400" />
                          <span className="font-medium">อื่นๆ</span>
                        </div>
                      </SelectItem>
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
                        filteredPrograms.map((program) => (
                          <SelectItem
                            key={program.id}
                            value={program.id.toString()}
                            className="text-slate-100 focus:bg-slate-700/70 py-4 rounded-xl m-1 transition-all duration-200 hover:bg-slate-700/50"
                          >
                            <div className="flex items-center gap-3">
                              <Monitor className="h-4 w-4 text-purple-400" />
                              <span className="font-medium">
                                {program.name}
                              </span>
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* ==================== FIELD กรอกปัญหาเพิ่มเติม ====================*/}
              <div className="space-y-5 group">
                {programID?.id === 0 && (
                  <>
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="absolute inset-0 bg-purple-500/30 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
                        <div className="relative p-3 bg-gradient-to-br from-lime-500 to-lime-600 rounded-2xl shadow-xl transform group-hover:scale-105 transition-all duration-300">
                          <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                        </div>
                      </div>
                      <div>
                        <Label
                          htmlFor="issue_else"
                          className="text-base sm:text-lg font-bold text-slate-100 block"
                        >
                          ระบุปัญหาเพิ่มเติม
                        </Label>
                      </div>
                    </div>
                    <input
                      type="text"
                      id="issue_else"
                      placeholder="ระบุปัญหาที่พบ..."
                      value={issue}
                      onChange={(e) => setIssue(e.target.value)}
                      className={cn(
                        "w-full h-16 sm:h-15 text-base sm:text-lg transition-all duration-500 border-2 rounded-2xl pl-4 pr-4",
                        "bg-slate-700/40 backdrop-blur-xl text-slate-100 placeholder:text-slate-600",
                        "shadow-xl hover:shadow-2xl",
                        "border-slate-600/40 focus:border-blue-400 hover:border-slate-500/60 focus:ring-2 focus:ring-blue-400/30",
                        "transform hover:scale-[1.02] focus:scale-[1.02] transition-transform duration-300"
                      )}
                    />
                  </>
                )}
              </div>
            </div>

            {/* ==================== TEXTAREA รายละเอียดปัญหา ====================*/}
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
                  </Label>
                </div>
              </div>
              <div className="space-y-4">
                <div className="relative">
                  <Textarea
                    id="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className={cn(
                      "min-h-[140px] sm:min-h-[160px] sm:text-xl border-2 rounded-2xl transition-all duration-500 resize-none p-4",
                      "bg-slate-700/40 backdrop-blur-xl text-slate-100 placeholder:text-slate-600 placeholder:text-lg",
                      "shadow-xl hover:shadow-2xl",
                      "border-slate-600/40 focus:border-orange-400 hover:border-slate-500/60 focus:ring-2 focus:ring-orange-400/30",
                      "transform hover:scale-[1.01] focus:scale-[1.01] transition-transform duration-300"
                    )}
                    placeholder="📝 อธิบายปัญหาที่พบ"
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
              </div>
            </div>

            {/* ==================== สำหรับใส่รูปภาพ ====================*/}
            <div className="space-y-5 group">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-green-500/30 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
                  <div className="relative p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-xl transform group-hover:scale-105 transition-all duration-300">
                    <Camera className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <Label className="text-base sm:text-lg font-bold text-slate-100">
                    แนบรูปภาพประกอบ
                  </Label>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    ถ่ายรูปหรือเลือกจากแกลเลอรี่ (สูงสุด 9 รูป)
                  </p>
                </div>
                {/* Camera and Gallery Buttons */}
                <div className="flex gap-4">
                  <div className="flex items-center gap-2 bg-slate-700/40 backdrop-blur-xl px-1.5 py-1 rounded-2xl border border-slate-600/40 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-120">
                    <GalleryButton
                      onClick={handleGallery}
                      disabled={processing || selectedImages.length >= 9}
                    />
                  </div>
                  <div className="flex items-center gap-2 bg-slate-700/40 backdrop-blur-xl px-1.5  rounded-2xl border border-slate-600/40 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-120">
                    <CameraButton
                      onClick={handleCamera}
                      disabled={processing || selectedImages.length >= 9}
                    />
                  </div>
                </div>
              </div>

              <ImageCompressor
                selectedImages={selectedImages}
                capturedFiles={capturedFiles}
                onImagesChange={handleImagesChange}
                processing={processing}
              />

              {/* Hidden File Inputs */}
              <input
                ref={cameraRef}
                type="file"
                accept="image/*"
                capture="environment"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
              <input
                ref={galleryRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
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
                    !programID ||
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
