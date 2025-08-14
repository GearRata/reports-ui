"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X, Filter, ChevronDown, CircleX } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { TasksNewTable } from "@/components/tables/tasks-new-table";
import { TaskNewForm } from "@/components/form/TaskForm";
import {
  useAssign,
  useTasksNewPaginated,
  useBranchesForDropdown,
  useDepartmentsForDropdown,
  useProgramsForDropdown,
  useIPPhonesForDropdown,
  addTaskNew,
  updateTaskNew,
  deleteTaskNew,
} from "@/api/route";
import { PaginationWrapper } from "@/components/pagination/pagination-wrapper";
import { PaginationErrorBoundary } from "@/components/error-boundary/pagination-error-boundary";
import type { TaskWithPhone } from "@/types/entities";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SiteHeader } from "@/components/layout/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

function Page() {
  const {
    tasks,
    currentPage,
    pageSize,
    totalItems,
    totalPages,
    loading,
    error,
    goToPage,
    changePageSize,
    refreshTasks,
  } = useTasksNewPaginated({ page: 1, limit: 10 });

  // Use dropdown-specific hooks for filter options

  const { ipPhones } = useIPPhonesForDropdown();
  const { programs } = useProgramsForDropdown();
  const { branches } = useBranchesForDropdown();
  const { departments } = useDepartmentsForDropdown();

  // Helper function to get all possible search terms for status
  const getStatusSearchTerms = (status: number): string[] => {
    if (status === 0) {
      return [
        "pending",
        "รอดำเนินการ",
        "รอ",
        "wait",
        "waiting",
        "ยังไม่เสร็จ",
        "ยังไม่แล้ว",
        "กำลังดำเนินการ",
        "0",
      ];
    } else {
      return [
        "solved",
        "เสร็จสิ้น",
        "เสร็จ",
        "done",
        "completed",
        "finished",
        "success",
        "สำเร็จ",
        "เรียบร้อย",
        "1",
      ];
    }
  };

  // Search and filter states
  const {
    assingTo: assignTo,
  } = useAssign();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBranch, setSelectedBranch] = useState<string>("all");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [selectedProgram, setSelectedProgram] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  // Form states
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskWithPhone | null>(null);



  console.log("Assign:", assignTo);
  console.log("Tasks:", tasks);

  const handleAddTask = () => {
    setEditingTask(null);
    setIsTaskFormOpen(true);
  };

  const handleEditTask = (task: TaskWithPhone) => {
    setEditingTask(task);
    setIsTaskFormOpen(true);
  };

  const handleTaskSubmit = async (data: {
    phone_id: number | null;
    system_id: number;
    text: string;
    status: number;
    assign_id?: number | null;
    id?: number;
  }) => {
    try {
      console.log("Submitting task data:", data);
      console.log("assign_id being sent:", data.assign_id);
      const assignPerson = data.assign_id ? assignTo.find(p => p.id === data.assign_id) : null;
      console.log("assign_name being sent:", assignPerson?.name);

      if (data.id) {
        // หาชื่อจาก assign_id
        const assignPerson = data.assign_id ? assignTo.find(p => p.id === data.assign_id) : null;
        const assignName = assignPerson ? assignPerson.name : null;
        
        await updateTaskNew(data.id, {
          phone_id: data.phone_id,
          system_id: data.system_id,
          text: data.text,
          status: data.status,
          assign_to: assignName,  // ส่งชื่อแทน id
          telegram: true,
        });


      } else {
        // หาชื่อจาก assign_id สำหรับ task ใหม่
        const assignPerson = data.assign_id ? assignTo.find(p => p.id === data.assign_id) : null;
        const assignName = assignPerson ? assignPerson.name : null;
        
        await addTaskNew({
          phone_id: data.phone_id,
          system_id: data.system_id,
          text: data.text,
          status: data.status,
          assign_to: assignName,  // ส่งชื่อแทน id
          telegram: true,
        });


      }
      refreshTasks();
      setIsTaskFormOpen(false);
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

  // Clear all filters
  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedBranch("all");
    setSelectedDepartment("all");
    setSelectedProgram("all");
    setSelectedStatus("all");
  };

  // Check if any filters are active
  const hasActiveFilters =
    searchQuery ||
    selectedBranch !== "all" ||
    selectedDepartment !== "all" ||
    selectedProgram !== "all" ||
    selectedStatus !== "all";

  // Get departments filtered by selected branch
  const filteredDepartments =
    selectedBranch !== "all"
      ? departments.filter(
          (dept) => dept.branch_id === parseInt(selectedBranch)
        )
      : departments;

  // Note: Server-side filtering will be implemented later
  // For now, we'll use client-side filtering with paginated data
  const filteredTasks = tasks.filter((task) => {
    // Text search filter
    const matchesSearch =
      !searchQuery ||
      (task.number + "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.phone_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.department_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.system_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getStatusSearchTerms(task.status).some((term) =>
        term.toLowerCase().includes(searchQuery.toLowerCase())
      ) ||
      task.branch_name.toLowerCase().includes(searchQuery.toLowerCase());

    // Branch filter
    const matchesBranch =
      selectedBranch === "all" || task.branch_id === parseInt(selectedBranch);

    // Department filter
    const matchesDepartment =
      selectedDepartment === "all" ||
      task.department_id === parseInt(selectedDepartment);

    // Program filter
    const matchesProgram =
      selectedProgram === "all" || task.system_id === parseInt(selectedProgram);

    // Status filter
    const matchesStatus =
      selectedStatus === "all" || task.status === parseInt(selectedStatus);

    return (
      matchesSearch &&
      matchesBranch &&
      matchesDepartment &&
      matchesProgram &&
      matchesStatus
    );
  });

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
                {/* Header with search, filters and add button */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-1 items-center  space-x-2 ">
                      <Input
                        placeholder="ค้นหางาน..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-8 w-[150px] lg:w-[300px]"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowFilters(!showFilters)}
                        className="h-8"
                      >
                        <Filter className="h-4 w-4 mr-2" />
                        ตัวกรอง
                        {showFilters === false ? (
                          <ChevronDown />
                        ) : (
                          <CircleX className="text-red-500" />
                        )}
                      </Button>
                      {hasActiveFilters && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={clearAllFilters}
                          className="h-8 text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-4 w-4 mr-1" />
                          ล้างตัวกรอง
                        </Button>
                      )}
                    </div>
                    <Button
                      onClick={handleAddTask}
                      size="sm"
                      className="ml-auto h-8 text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      AddTask
                    </Button>
                  </div>

                  {/* Filter Panel */}
                  {showFilters && (
                    <div className="flex gap-4 p-4 bg-muted/50 rounded-lg border">
                      <div className="space-y-2 ">
                        <label className="text-sm font-medium">สาขา</label>
                        <Select
                          value={selectedBranch}
                          onValueChange={(value) => {
                            setSelectedBranch(value);
                            setSelectedDepartment("all"); // Reset department when branch changes
                          }}
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue placeholder="เลือกสาขา" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">ทุกสาขา</SelectItem>
                            {branches.map((branch) => (
                              <SelectItem
                                key={branch.id}
                                value={branch.id.toString()}
                              >
                                {branch.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">แผนก</label>
                        <Select
                          value={selectedDepartment}
                          onValueChange={setSelectedDepartment}
                          disabled={
                            selectedBranch !== "all" &&
                            filteredDepartments.length === 0
                          }
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue placeholder="เลือกแผนก" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">ทุกแผนก</SelectItem>
                            {filteredDepartments.map((department) => (
                              <SelectItem
                                key={department.id}
                                value={department.id.toString()}
                              >
                                {department.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">โปรแกรม</label>
                        <Select
                          value={selectedProgram}
                          onValueChange={setSelectedProgram}
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue placeholder="เลือกโปรแกรม" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">ทุกโปรแกรม</SelectItem>
                            {programs.map((program) => (
                              <SelectItem
                                key={program.id}
                                value={program.id.toString()}
                              >
                                {program.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">สถานะ</label>
                        <Select
                          value={selectedStatus}
                          onValueChange={setSelectedStatus}
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue placeholder="เลือกสถานะ" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">ทุกสถานะ</SelectItem>
                            <SelectItem value="0">รอดำเนินการ</SelectItem>
                            <SelectItem value="1">เสร็จสิ้น</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  {/* Active Filters Display */}
                  {hasActiveFilters && (
                    <div className="flex flex-wrap gap-2">
                      {searchQuery && (
                        <Badge
                          variant="secondary"
                          className="flex justify-between items-center gap-2 w-[15%] h-10"
                        >
                          <div>ค้นหา: {searchQuery}</div>
                          <Button
                            className="h-6 w-6 bg-red-500 rounded-full text-white cursor-pointer hover:bg-red-700 "
                            onClick={() => setSearchQuery("")}
                          >
                            <X />
                          </Button>
                        </Badge>
                      )}
                      {selectedBranch !== "all" && (
                        <Badge
                          variant="secondary"
                          className="flex justify-between items-center gap-2 w-[18%] h-10"
                        >
                          <div>
                            สาขา:{" "}
                            {
                              branches.find(
                                (b) => b.id.toString() === selectedBranch
                              )?.name
                            }
                          </div>
                          <Button
                            className="h-6 w-6 bg-red-500 rounded-full text-white cursor-pointer hover:bg-red-700"
                            onClick={() => setSelectedBranch("all")}
                          >
                            <X />
                          </Button>
                        </Badge>
                      )}
                      {selectedDepartment !== "all" && (
                        <Badge
                          variant="secondary"
                          className="flex justify-between items-center gap-2 w-[18%] h-10"
                        >
                          <div>
                            แผนก:{" "}
                            {
                              departments.find(
                                (d) => d.id.toString() === selectedDepartment
                              )?.name
                            }
                          </div>
                          <Button
                            className="h-6 w-6 bg-red-500 rounded-full text-white cursor-pointer hover:bg-red-700"
                            onClick={() => setSelectedDepartment("all")}
                          >
                            <X />
                          </Button>
                        </Badge>
                      )}
                      {selectedProgram !== "all" && (
                        <Badge
                          variant="secondary"
                          className="flex justify-between items-center gap-2 w-[18%] h-10"
                        >
                          <div>
                            โปรแกรม:{" "}
                            {
                              programs.find(
                                (p) => p.id.toString() === selectedProgram
                              )?.name
                            }
                          </div>
                          <Button
                            className="h-6 w-6 bg-red-500 rounded-full text-white cursor-pointer hover:bg-red-700"
                            onClick={() => setSelectedProgram("all")}
                          >
                            <X />
                          </Button>
                        </Badge>
                      )}
                      {selectedStatus !== "all" && (
                        <Badge
                          variant="secondary"
                          className="flex justify-between items-center gap-2 w-[18%] h-10"
                        >
                          <div>
                            สถานะ:{" "}
                            {selectedStatus === "0"
                              ? "รอดำเนินการ"
                              : "เสร็จสิ้น"}
                          </div>
                          <Button
                            className="h-6 w-6 bg-red-500 rounded-full text-white cursor-pointer hover:bg-red-700"
                            onClick={() => setSelectedStatus("all")}
                          >
                            <X />
                          </Button>
                        </Badge>
                      )}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <PaginationErrorBoundary onRetry={refreshTasks}>
                    <TasksNewTable
                      tasks={filteredTasks}
                      onEditTask={handleEditTask}
                      onDeleteTask={handleDeleteTask}
                      loading={loading}
                      error={error}
                    />

                    {!loading && !error && (
                      <PaginationWrapper
                        currentPage={currentPage}
                        pageSize={pageSize}
                        totalItems={totalItems}
                        totalPages={totalPages}
                        onPageChange={goToPage}
                        onPageSizeChange={changePageSize}
                        disabled={loading}
                        itemName="งาน"
                        pageSizeOptions={[10, 20, 50, 100]}
                      />
                    )}
                  </PaginationErrorBoundary>
                </div>

                {/* Form */}
                <TaskNewForm
                  open={isTaskFormOpen}
                  onOpenChange={setIsTaskFormOpen}
                  task={editingTask}
                  onSubmit={handleTaskSubmit}
                  ipPhones={ipPhones}
                  programs={programs}
                  assignTo={assignTo}
                />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default Page;
