"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { TasksNewTable } from "@/components/tables/tasks-new-table";
import { TaskNewForm } from "@/components/entities-form";
import {
  usePrograms,
  useTasksNew,
  useIPPhones,
  addTaskNew,
  updateTaskNew,
  deleteTaskNew,
} from "@/api/route";
import type { TaskWithPhone } from "@/types/entities";

import { AppSidebar } from "@/components/layout/app-sidebar";
import { SiteHeader } from "@/components/layout/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

function Page() {
  const { tasks, refreshTasks } = useTasksNew();
  const { ipPhones } = useIPPhones();
  const { programs } = usePrograms();
  const [searchQuery, setSearchQuery] = useState("");
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskWithPhone | null>(null);

  const handleAddTask = () => {
    setEditingTask(null);
    setIsTaskFormOpen(true);
  };

  const handleEditTask = (task: TaskWithPhone) => {
    setEditingTask(task);
    setIsTaskFormOpen(true);
  };

  const handleTaskSubmit = async (data: {
    phone_id: number;
    system_id: number;
    text: string;
    status: number;
    id?: number;
  }) => {
    try {
      if (data.id) {
        await updateTaskNew(data.id, {
          phone_id: data.phone_id,
          system_id: data.system_id,
          text: data.text,
          status: data.status,
        });
      } else {
        await addTaskNew({
          phone_id: data.phone_id,
          system_id: data.system_id,
          text: data.text,
          status: data.status,
        });
      }
      refreshTasks();
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await deleteTaskNew(id);
      refreshTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Filter tasks
  const filteredTasks = tasks.filter(
    (task) =>
      task.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.phone_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.phone_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.status?toString().toLowerCase().includes(searchQuery.toLowerCase()):false
  );


  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 60)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader title="Tasks" />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-6">
              <div className="container mx-auto space-y-6">
                {/* Header with search and add button */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-1 items-center space-x-2">
                    <Input
                      placeholder="Filter tasks..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-8 w-[150px] lg:w-[450px]"
                    />
                  </div>
                  <Button
                    onClick={handleAddTask}
                    size="sm"
                    className="ml-auto h-8"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Task
                  </Button>
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <TasksNewTable
                    tasks={filteredTasks}
                    onEditTask={handleEditTask}
                    onDeleteTask={handleDeleteTask}
                  />
                </div>

                {/* Form */}
                <TaskNewForm
                  open={isTaskFormOpen}
                  onOpenChange={setIsTaskFormOpen}
                  task={editingTask}
                  onSubmit={handleTaskSubmit}
                  ipPhones={ipPhones}
                  programs={programs}/>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default Page;
