"use client";


import type React from "react";
import { useParams } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { TaskNewForm } from "@/components/entities-report";
import {
  useTasksNew,
  useIPPhones,
  usePrograms,
  addTaskDepartment,
} from "@/api/route";
import type { TaskWithPhone, Params } from "@/types/report/model";


function Page() {
  const params = useParams<Params>();
  const { branch, department } = params;
  const { tasks, refreshTasks } = useTasksNew();
  const { ipPhones } = useIPPhones();
  const { programs } = usePrograms();
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(true);
  const [editingTask, setEditingTask] = useState<TaskWithPhone | null>(null);
  

  const handleAddTask = () => {
    setEditingTask(null);
    setIsTaskFormOpen(true);
  };

  useEffect(() => {
  
  }, [branch, department]);


  const handleTaskSubmit = async (data: {
    phone_id: number;
    program_id: number;
    text: string;
    status: number;
    id?: number;
  }) => {
    try {
      if (data.id) {
        await addTaskDepartment({
          phone_id: data.phone_id,
          text: data.text,
          status: data.status === 1 ? "solved" : "pending",
          program_id: data.program_id,
        });
        
      }

      refreshTasks();
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  return (
    <>

    <div>
      <p>Branch ID: {branch}</p>
      <p>Department ID: {department}</p>
    </div>
      {/* Form */}
      <TaskNewForm
        open={isTaskFormOpen}
        onOpenChange={setIsTaskFormOpen}
        task={editingTask}
        onSubmit={handleTaskSubmit}
        ipPhones={ipPhones}
        programs={programs}
        branchParams={branch}
        departmentParams={department}
      />
    </>
  );
}

export default Page;
