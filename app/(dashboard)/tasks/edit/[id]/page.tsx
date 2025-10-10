/* eslint-disable @next/next/no-img-element */
"use client";

import type React from "react";
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter, useParams } from "next/navigation";
import { getTaskNewById, updateTaskNew } from "@/hooks/useTasks";
import { useAssign } from "@/hooks/useAssign";
import { useType } from "@/hooks/useTypes";
import { useProgramsForDropdown } from "@/hooks/usePrograms";
import { useIPPhonesForDropdown } from "@/hooks/usePhones";
import { useDepartmentsForDropdown } from "@/hooks/useDepartments";
import type { TaskWithPhone } from "@/types/entities";
import { ArrowLeft, ChevronsUpDown, Check } from 'lucide-react';
import { cn } from "@/lib/utils";

function EditTaskPage() {
  const router = useRouter();
  const params = useParams();
  const taskId = params.id as string;

  const { ipPhones } = useIPPhonesForDropdown();
  const { programs } = useProgramsForDropdown();
  const { types } = useType();
  const { assignTo: assignTo } = useAssign();
  const { departments } = useDepartmentsForDropdown();

  const [task, setTask] = useState<TaskWithPhone | null>(null);
  const [phoneId, setPhoneId] = useState<string>("");
  const [programID, setProgramID] = useState<string>("");
  const [reportBy, setReportBy] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [issue, setIssue] = useState<string>("");
  const [text, setText] = useState("");
  const [status, setStatus] = useState<string>("");
  const [assignId, setAssignId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [phoneElse, setPhoneElse] = useState<string>("");
  const [departmentId, setDepartmentId] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [departmentOpen, setDepartmentOpen] = useState(false);

  // Load the specific task data
  useEffect(() => {
    const loadTask = async () => {
      if (taskId) {
        try {
          const taskData = await getTaskNewById(Number(taskId));
          setTask(taskData);
          setReportBy(taskData.reported_by);
          setPhoneId(taskData.phone_id ? taskData.phone_id.toString() : "0");
          setPhoneElse(taskData.phone_else || "");
          setDepartmentId(taskData.department_id ? taskData.department_id.toString() : "");
          setProgramID(
            taskData.system_id !== null && taskData.system_id !== undefined
              ? taskData.system_id.toString()
              : "null"
          );
          setType(taskData.issue_type ? taskData.issue_type.toString() : "");
          setIssue(taskData.issue_else ? taskData.issue_else.toString() : "");
          setText(taskData.text);
          setStatus(taskData.status.toString());
          setAssignId(taskData.assignedto_id);
          // Find assign ID from assign name
          const assignPerson = assignTo.find(
            (p) => p.name === taskData.assign_to
          );
          setAssignId(assignPerson ? assignPerson.id.toString() : "");

          setLoading(false);
        } catch (error) {
          console.error("Error loading task:", error);
          setLoading(false);
        }
      }
    };

    loadTask();
  }, [taskId, assignTo]);

  const filteredPrograms = useMemo(() => {
    if (!type) return [];
    return programs.filter((program) => program.type_id === Number(type));
  }, [programs, type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task) return;

    setIsSubmitting(true);

    try {
      const assignPerson = assignId
        ? assignTo.find((p) => p.id === Number(assignId))
        : null;
      const assignName = assignPerson ? assignPerson.name : null;
      const assignToId = assignPerson ? assignPerson.id : 0;

      await updateTaskNew(task.id, {
        reported_by: reportBy,
        phone_id:
          phoneId && phoneId !== "" && phoneId !== "0"
            ? Number(phoneId)
            : 0,
        phone_else: phoneId === "0" ? phoneElse : "",
        department_id: phoneId === "0" ? Number(departmentId) : 0,
        system_id: Number(programID),
        issue_type: Number(type),
        issue_else: issue,
        text,
        status: Number(status),
        assign_to: assignName,
        assignedto_id: assignToId,
        telegram: true,
      });

      // Navigate back to tasks page
      router.push("/tasks");
    } catch (error) {
      console.error("Error updating task:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/tasks");
  };

  if (loading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading task...</p>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Task not found</p>
          <Button onClick={handleCancel}>Back to Tasks</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-6">
          <div className="container mx-auto max-w-2xl">
              <div className="flex mb-3">
                <Button variant="outline" onClick={() => router.back()}><ArrowLeft/>Back</Button>
              </div>
            {/* Edit Task Form */}
            <Card>
              <CardHeader>
                <CardTitle>Edit Task #{task.ticket_no || task.id}</CardTitle>
                <CardDescription>
                  Update the task details below.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Report By Section */}
                  <div className="space-y-2">
                    <Label htmlFor="reportby">ชื่อผู้แจ้ง</Label>
                    <input
                      type="text"
                      id="reportby"
                      className="w-full border-1 rounded-md p-1.5"
                      value={reportBy}
                      onChange={(e) => setReportBy(e.target.value)}
                      placeholder="ไม่ได้ระบุชื่อผู้รายงาน"
                    />
                  </div>
                  {/* IP Phone Selection */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone_id">IP Phone</Label>
                      <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-full justify-between"
                          >
                            {phoneId ? (
                              phoneId === "0" ? (
                                "ไม่มีเบอร์"
                              ) : (
                                (() => {
                                  const phone = ipPhones.find(
                                    (phone) => phone.id.toString() === phoneId
                                  );
                                  return phone
                                    ? `${phone.number} - ${phone.name}`
                                    : "Select Phone ID...";
                                })()
                              )
                            ) : (
                              <span className="text-muted-foreground">
                                Select Phone IP
                              </span>
                            )}
                            <ChevronsUpDown className="opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
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
                                    setPhoneId("0");
                                    setOpen(false);
                                  }}
                                >
                                  ไม่มีเบอร์
                                  <Check
                                    className={cn(
                                      "ml-auto",
                                      phoneId === "0"
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                </CommandItem>
                                {ipPhones.map((phone) => (
                                  <CommandItem
                                    key={phone.id}
                                    value={`${phone.number} ${phone.name}`}
                                    onSelect={() => {
                                      setPhoneId(phone.id.toString());
                                      setOpen(false);
                                    }}
                                  >
                                    {phone.number} - {phone.name}
                                    <Check
                                      className={cn(
                                        "ml-auto",
                                        phoneId === phone.id.toString()
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* Phone Else Input - แสดงเมื่อเลือก "ไม่มีเบอร์" */}
                    {phoneId === "0" && (
                      <div className="space-y-2">
                        <Label htmlFor="phone_else">เบอร์โทรศัพท์</Label>
                        <input
                          type="text"
                          id="phone_else"
                          className="w-full border-1 rounded-md p-1.5"
                          value={phoneElse}
                          onChange={(e) => setPhoneElse(e.target.value)}
                          placeholder="กรอกเบอร์โทรศัพท์ (เช่น 081-234-5678)"
                        />
                      </div>
                    )}
                    {phoneId === "0" && (
                      <div className="space-y-2">
                        <Label htmlFor="department_id">Department</Label>
                        <Popover
                          open={departmentOpen}
                          onOpenChange={setDepartmentOpen}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={departmentOpen}
                              className="w-full justify-between"
                            >
                              {departmentId ? (
                                (() => {
                                  const department = departments.find(
                                    (department) =>
                                      department.id.toString() === departmentId
                                  );
                                  return department
                                    ? `${department.name}`
                                    : "Select Department...";
                                })()
                              ) : (
                                <span className="text-muted-foreground">
                                  Select Department
                                </span>
                              )}
                              <ChevronsUpDown className="opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0">
                            <Command>
                              <CommandInput
                                placeholder="Search department..."
                                className="h-9"
                              />
                              <CommandList>
                                <CommandEmpty>
                                  No Department found.
                                </CommandEmpty>
                                <CommandGroup>
                                  {departments.map((department) => (
                                    <CommandItem
                                      key={department.id}
                                      value={`${department.number} ${department.name}`}
                                      onSelect={() => {
                                        setDepartmentId(
                                          department.id.toString()
                                        );
                                        setDepartmentOpen(false);
                                      }}
                                    >
                                      {department.name}
                                      <Check
                                        className={cn(
                                          "ml-auto",
                                          departmentId ===
                                            department.id.toString()
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </div>
                    )}
                  </div>

                  {/* Type Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select
                      value={type}
                      onValueChange={(value) => setType(value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {types.map((type) => (
                          <SelectItem key={type.id} value={type.id.toString()}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <input type="hidden" name="type" value={type} required />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="program_id">Problem</Label>
                      <Select
                        value={programID}
                        onValueChange={(value) => setProgramID(value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Program" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">อื่นๆ</SelectItem>
                          {filteredPrograms.map((program) => (
                            <SelectItem
                              key={program.id}
                              value={program.id.toString()}
                            >
                              {program.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <input
                        type="hidden"
                        name="program_id"
                        value={programID}
                        required
                      />
                    </div>

                    <div>
                      {programID === "0" && (
                        <div className="space-y-2">
                          <Label htmlFor="type">ปัญหาอื่นๆ</Label>
                          <input
                            type="text"
                            id="type"
                            className="w-full border-1 rounded-md p-1.5"
                            value={issue}
                            onChange={(e) => setIssue(e.target.value)}
                            placeholder="ไม่ได้ระบุปัญหาที่พบ"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Task Description */}
                  <div className="space-y-2">
                    <Label htmlFor="text">Task Description</Label>
                    <Textarea
                      id="text"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Describe the task in detail..."
                      required
                      rows={4}
                    />
                  </div>

                  {/* Assign To Selection */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Status Selection */}
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={status}
                        onValueChange={(value) => setStatus(value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Pending</SelectItem>
                          <SelectItem value="1">Progress</SelectItem>
                          <SelectItem value="2">Done</SelectItem>
                        </SelectContent>
                      </Select>
                      <input
                        type="hidden"
                        name="status"
                        value={status}
                        required
                      />
                    </div>

                    {/* Assign To Selection */}

                    <div className="space-y-2">
                      <Label htmlFor="assign_to">Assign To</Label>
                      <Select
                        value={assignId}
                        onValueChange={(value) => setAssignId(value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select AssignTo" />
                        </SelectTrigger>
                        <SelectContent>
                          {task?.status === 0 ? (
                            assignTo.map((assign) => (
                              <SelectItem
                                key={assign.id}
                                value={assign.id.toString()}
                              >
                                {assign.name}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem
                              disabled
                              value={
                                assignTo
                                  .find((a) => a.name === task.assign_to)
                                  ?.id.toString() || "completed"
                              }
                            >
                              {task?.assign_to || "Completed"}
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <input
                        type="hidden"
                        name="assign_to"
                        value={assignId}
                        required
                      />
                    </div>
                  </div>

                  {/* แสดงรูปภาพที่มีอยู่ */}
                  {task.file_paths &&
                    Object.keys(task.file_paths).length > 0 && (
                      <div className="space-y-2">
                        <Label>รูปภาพที่แนบมา</Label>
                        <div className="grid grid-cols-3 gap-2 max-w-md">
                          {Object.entries(task.file_paths).map(([key, url]) => (
                            <div key={key} className="relative aspect-square">
                              <img
                                src={url}
                                alt={`Task image ${key}`}
                                className="w-full h-full object-cover rounded-md border"
                                onError={(e) => {
                                  console.error("Image failed to load:", url);
                                  e.currentTarget.src =
                                    "/placeholder-image.png";
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Form Actions */}
                  <div className="flex justify-end gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting || !programID || !text}
                      className="text-white"
                    >
                      {isSubmitting ? "Updating..." : "Update Task"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditTaskPage;
