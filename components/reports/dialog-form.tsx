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
import { DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { useParams } from "next/navigation";
import { Branch, Department, Program } from "@/types/entities";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

export default function DialogForm() {
  const params = useParams();
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
  const notify = () => toast.success("แจ้งปัญหาเรียบร้อยแล้ว");

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

    const formData = {
      text,
      branch_id: branchID,
      department_id: departmentID,
      system_id: program?.id,
    };

    // Prepare Telegram message data
    const telegramData = {
      branchName: `${branch?.name || "Unknown Branch"}`,
      departmentName:  `${department?.name || "Unknown Department"}`,
      program: `${program?.name || "Unknown Program"}`,
      reportmessage: `${text}`,
      url: `https://www.youtube.com/watch?v=PCDYbzbYP4w&list=RDPCDYbzbYP4w&start_radio=1`,

    };

    try {
      // Send to both endpoints simultaneously
      const [problemResponse, telegramResponse] = await Promise.all([
        // 1. Send to problem/create API
        fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/v1/problem/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }),

        // 2. Send to Telegram API
        axios.post(`${process.env.NEXT_PUBLIC_API_BASE}/api/v1/telegramMessage`, telegramData),
      ]);

      // Check if both requests succeeded
      const problemSuccess = problemResponse.ok;
      const telegramSuccess = telegramResponse.status === 200;

      if (problemSuccess && telegramSuccess) {
        toast.success(
          "แจ้งปัญหาเรียบร้อยแล้ว และส่งแจ้งเตือนไปยัง Telegram แล้ว"
        );
        setText("");
        window.location.reload();
      } else if (problemSuccess) {
        toast.success("แจ้งปัญหาเรียบร้อยแล้ว (แต่ไม่สามารถส่ง Telegram ได้)");
        setText("");
        window.location.reload();
      } else {
        toast.error("ไม่สามารถแจ้งปัญหาได้ กรุณาลองใหม่อีกครั้ง");
        console.error("Failed to submit task");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">
        {loadingDepartment ? (
          <span className="animate-pulse bg-gray-200 rounded h-6 w-32 inline-block"></span>
        ) : (
          department?.name || "Loading..."
        )}{" "}
        /{" "}
        {loadingBranch ? (
          <span className="animate-pulse bg-gray-200 rounded h-6 w-24 inline-block"></span>
        ) : (
          branch?.name || "Loading..."
        )}
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="program" className="text-right">
              Program
            </Label>
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
              <SelectTrigger className="col-span-3">
                <SelectValue
                  placeholder={
                    loadingPrograms ? "Loading..." : "Select Program"
                  }
                >
                  {loadingPrograms
                    ? "Loading..."
                    : program?.name || "Select Program"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {loadingPrograms ? (
                  <SelectItem value="loading" disabled>
                    Loading programs...
                  </SelectItem>
                ) : programs.length === 0 ? (
                  <SelectItem value="empty" disabled>
                    No programs available
                  </SelectItem>
                ) : (
                  programs.map((program) => (
                    <SelectItem key={program.id} value={program.id.toString()}>
                      {program.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="text" className="text-right">
              Text
            </Label>
            <Textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="col-span-3"
              placeholder="อธิบายปัญหาที่พบเกี่ยวกับโปรแกรมนี้.."
              required
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => window.location.reload()}
          >
            ยกเลิก
          </Button>
          <Button type="submit" onClick={notify}>
            แจ้งปัญหา
          </Button>
          <Toaster />
        </DialogFooter>
      </form>
    </div>
  );
}
