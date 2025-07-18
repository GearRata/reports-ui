"use client";


import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus } from "lucide-react"
import { Problem } from "@/components/department-table/problem"
import { TaskNewForm } from "@/components/entities-report"
import { useTasksNew, useIPPhones, useBranches, useDepartments, usePrograms, addTaskDepartment, deleteTaskNew } from "@/api/route"
import type { TaskWithPhone } from "@/types/report/model"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { SiteHeader } from "@/components/layout/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { useRouter, useParams } from "next/navigation"
import DialogForm from "@/components/reports/dialog-form"


function Page() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="w-full max-w-md">
        <DialogForm />
      </div>
    </div>
  )
}

export default Page;
