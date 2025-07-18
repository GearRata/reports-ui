import React, { useEffect, useState, useCallback } from 'react'
import { Label } from '../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Textarea } from '../ui/textarea'
import { DialogFooter } from '../ui/dialog'
import { Button } from '../ui/button'
import { useRouter, useParams } from "next/navigation"
import { Branch, Department, Program } from '@/types/entities'

export default function DialogForm() {
  const params = useParams()
  const [branchID, setBranchID] = useState(0);
  const [departmentID, setDepartmentID] = useState(0);
  const [text, setText] = useState("");
  const [department, setDepartment] = useState<Department | undefined>();
  const [program, setProgram] = useState<Program | undefined>();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loadingPrograms, setLoadingPrograms] = useState(false);

  // useCallback เพื่อป้องกันการสร้างฟังก์ชันใหม่ใน re-render
  const loadProgram = useCallback(async () => {
    setLoadingPrograms(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/v1/program/list`)
      const data = await response.json()
      if (data.data && data.data.length > 0) {
        setPrograms(data.data)
        // เลือกข้อมูลชุดแรกโดยอัตโนมัติ
        setProgram(data.data[0])
      } else {
        setPrograms([])
        setProgram(undefined)
      }
    } catch (error) {
      console.error("Error loading programs:", error)
      setPrograms([])
      setProgram(undefined)
    } finally {
      setLoadingPrograms(false)
    }
  }, [])

  const loadDepartment = useCallback(async () => {
    if (departmentID <= 0) return
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/v1/department/${departmentID}`)
      const data = await response.json() 
      if (data.data) {
        setDepartment(data.data)
      }
    } catch (error) {
      console.error("Error loading department:", error) 
    }
  }, [departmentID])

  // useEffect สำหรับ set parameters จาก URL
  useEffect(() => {
    let branchParam = params.branch
    let departmentParam = params.department
    let branchId = Number(branchParam)
    let departmentId = Number(departmentParam)
    setBranchID(branchId)
    setDepartmentID(departmentId)
  }, [params])

  // useEffect สำหรับโหลดข้อมูล programs (โหลดครั้งเดียวตอน mount)
  useEffect(() => {
    loadProgram()
  }, [loadProgram])

  // useEffect สำหรับโหลดข้อมูล department เมื่อ departmentID เปลี่ยน
  useEffect(() => {
    loadDepartment()
  }, [loadDepartment])



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const formData = {
      text,
      branch_id: branchID,
      department_id: departmentID,
      program_id: program?.id
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/v1/problem/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      
      if (response.ok) {
        // รีเซ็ตฟอร์มหลังจากส่งสำเร็จ
        setText("")
        // โหลดข้อมูลใหม่
        
        window.location.reload()
      } else {
        console.error("Failed to submit task")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
    }
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">{department?.name} / {department?.branch_name}</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="program" className="text-right">
                Program
              </Label>
              <Select
                value={program?.id?.toString() || ""}
                onValueChange={(value) => {
                  const selectedProgram = programs.find(p => p.id.toString() === value)
                  setProgram(selectedProgram)
                }}
                disabled={loadingPrograms}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder={loadingPrograms ? "Loading..." : "Select Program"}>
                    {loadingPrograms ? "Loading..." : program?.name || "Select Program"}
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
              Cancel
            </Button>
            <Button type="submit">
              Create Task
            </Button>
          </DialogFooter>
        </form>
    </div>
  )
}
