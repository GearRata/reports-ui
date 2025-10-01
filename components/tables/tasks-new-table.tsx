"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Pencil,
  Trash,
  CircleEllipsis,
  Check,
  ChevronDown,
  SquareCheckBig,
} from "lucide-react";
// import type { TaskData } from "@/types/Task/model";
import type { TaskWithPhone } from "@/types/entities";
import { LuClock } from "react-icons/lu";
import moment from "moment-timezone";
import "moment/locale/th"; // Import Thai locale
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAssign } from "@/hooks/useAssign";
// import { useState } from "react";

interface TasksNewTableProps {
  tasks: TaskWithPhone[];
  onEditTask: (task: TaskWithPhone) => void;
  onDeleteTask: (taskId: number) => void;
  onShowTask: (task: TaskWithPhone) => void;
  onChat: (task: TaskWithPhone) => void;
  // onSolution:
  onAssignChange?: (
    taskId: number,
    assignTo: string,
    assignToId: number
  ) => void;
  onStatusFilterChange?: (status: string) => void;
  statusFilter?: string;
  loading?: boolean;
  error?: string | null;
}

const statusColors: Record<number, string> = {
  0: "bg-linear-to-r from-orange-500 to-yellow-500 rounded-full font-medium text-white flex items-center gap-2",
  1: "bg-linear-to-r from-cyan-500 to-sky-500 rounded-full font-medium text-white flex items-center gap-2",
  2: "bg-linear-to-r from-lime-500 to-emerald-500 rounded-full font-medium text-white flex items-center gap-2",
};

const statusLabels: Record<number, string> = {
  0: "Pending",
  1: "Progress",
  2: "Done",
};

export function TasksNewTable({
  tasks,
  onEditTask,
  onDeleteTask,
  onShowTask,
  onChat,
  onAssignChange,
  onStatusFilterChange,
  statusFilter = "all",
  loading = false,
  error = null,
}: TasksNewTableProps) {
  // Set Thai locale for moment
  moment.locale("th");

  const { assignTo } = useAssign();

  const handleStatusChange = (value: string) => {
    if (onStatusFilterChange) {
      onStatusFilterChange(value);
    }
  };

  // Function to format time in Thai timezone
  const formatTimeAgo = (dateString: string) => {
    // แปลง UTC timestamp เป็น Bangkok timezone
    const taskTime = moment.utc(dateString).tz("Asia/Bangkok");
    const now = moment.tz("Asia/Bangkok");

    const diffInMinutes = now.diff(taskTime, "minutes");
    const diffInHours = now.diff(taskTime, "hours");
    const diffInDays = now.diff(taskTime, "days");
    const diffInMonth = now.diff(taskTime, "months");
    const diffInYear = now.diff(taskTime, "years");

    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else if (diffInDays < 30) {
      return `${Math.floor(diffInDays / 7)} weeks ago`;
    } else if (diffInMonth < 12) {
      return `${diffInMonth} months ago`;
    } else {
      return `${diffInYear} years ago`;
    }
  };

  // Function to format fixed time (for completed tasks)
  const formatFixedTime = (dateString: string) => {
    const thaiLand = moment.utc(dateString).tz("Asia/Bangkok");
    return thaiLand.format("DD MMMM YYYY HH:mm");
  };

  const filterAlphabet = (str: string): string => {
    const wantMap: Record<string, string[]> = {
      hardware: ["H", "W"],
      software: ["S", "W"],
      request: ["R", "Q"],
    };

    const key = str.toLowerCase();
    const targets = wantMap[key] ?? [];
    if (targets.length === 0) return "";

    const need = new Set(targets.map((c) => c.toUpperCase()));
    const seen = new Set<string>();
    const out: string[] = [];

    for (let i = 0; i < str.length; i++) {
      const ch = str[i].toUpperCase();
      if (need.has(ch) && !seen.has(ch)) {
        seen.add(ch);
        out.push(ch);
        if (out.length === need.size) break; // เจอครบแล้วหยุด
      }
    }
    return out.join("");
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Ticket ID</TableHead>
            {/* <TableHead>Phone Number</TableHead> */}
            <TableHead>Name</TableHead>
            <TableHead>Number</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Program</TableHead>
            <TableHead>Branch</TableHead>
            <TableHead>Text</TableHead>
            <TableHead>
              <div className="flex items-center gap-2">
                <span>
                  {statusFilter === "all" ? (
                    <Badge className="h-6 rounded-2xl text-white font-bold bg-linear-to-r from-gray-500 to-zinc-600">
                      Status
                    </Badge>
                  ) : statusFilter === "pending" ? (
                    <Badge className="h-6 rounded-2xl text-white font-bold bg-linear-to-r from-orange-500 to-yellow-500">
                      Pending
                    </Badge>
                  ) : statusFilter === "progress" ? (
                    <Badge className="h-6 rounded-2xl text-white font-bold bg-linear-to-r from-cyan-500 to-blue-500">
                      Progress
                    </Badge>
                  ) : (
                    <Badge className="h-6 rounded-2xl text-white font-bold bg-linear-to-r from-lime-500 to-emerald-500">
                      Done
                    </Badge>
                  )}
                </span>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-6 w-6"
                      aria-label="Filter status"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="start" sideOffset={4}>
                    <DropdownMenuItem onClick={() => handleStatusChange("all")}>
                      All
                      {statusFilter === "all" && (
                        <Check className="ml-auto h-4 w-4" />
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleStatusChange("pending")}
                    >
                      Pending
                      {statusFilter === "pending" && (
                        <Check className="ml-auto h-4 w-4" />
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleStatusChange("progress")}
                    >
                      Progress
                      {statusFilter === "progress" && (
                        <Check className="ml-auto h-4 w-4" />
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleStatusChange("done")}
                    >
                      Done
                      {statusFilter === "done" && (
                        <Check className="ml-auto h-4 w-4" />
                      )}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Assign To</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={12} className="h-24 text-center">
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  กำลังโหลดข้อมูล...
                </div>
              </TableCell>
            </TableRow>
          ) : error ? (
            <TableRow>
              <TableCell colSpan={12} className="h-24 text-center text-red-500">
                เกิดข้อผิดพลาด: {error}
              </TableCell>
            </TableRow>
          ) : tasks.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={12}
                className="h-24 text-center text-muted-foreground"
              >
                ไม่พบข้อมูลงาน
              </TableCell>
            </TableRow>
          ) : (
            tasks.map((task) => (
              <TableRow
                key={task.id}
                onClick={() => onChat(task)}
                className="cursor-pointer"
              >
                {/* <TableCell className="font-medium">{index + 1}</TableCell> */}
                <TableCell className="font-medium ">
                  <Badge className="rounded-full font-medium text-white text-center w-8 bg-indigo-500">
                    {filterAlphabet(task.system_type)}
                  </Badge>
                </TableCell>
                <TableCell
                  className="font-medium hover:underline cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    onShowTask(task);
                  }}
                >
                  {task.ticket_no || `#${task.id}`}
                </TableCell>
                <TableCell>{task.reported_by}</TableCell>
                <TableCell>{task.phone_id === 0 ? task.phone_else : task.number}</TableCell>
                <TableCell>{task.phone_name || "-"}</TableCell>
                <TableCell>{task.department_name || "-"}</TableCell>
                <TableCell>{task.system_name || "อื่นๆ"}</TableCell>
                <TableCell>{task.branch_name || "-"}</TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {task.text}
                </TableCell>
                <TableCell>
                  <Badge
                    className={
                      statusColors[
                        task.status === 0 ? 0 : task.status === 1 ? 1 : 2
                      ]
                    }
                  >
                    <div className="flex items-center gap-2 h-5 font-bold">
                      {
                        statusLabels[
                          task.status === 0 ? 0 : task.status === 1 ? 1 : 2
                        ]
                      }
                    </div>
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    className={
                      statusColors[
                        task.status === 0 ? 0 : task.status === 1 ? 1 : 2
                      ]
                    }
                  >
                    <div className="flex items-center gap-1 h-5">
                      {task.status === 0 ? (
                        <LuClock className="w-4 h-4" />
                      ) : task.status === 1 ? (
                        <CircleEllipsis className="w-4 h-4" />
                      ) : (
                        <SquareCheckBig className="w-4 h-4" />
                      )}
                      {task.status === 0
                        ? formatTimeAgo(task.created_at)
                        : task.status === 1
                        ? formatTimeAgo(task.updated_at)
                        : formatFixedTime(task.updated_at)}
                    </div>
                  </Badge>
                </TableCell>

                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Select
                    value={
                      task.status === 0 || task.status === 1
                        ? assignTo
                            .find((a) => a.name === task.assign_to)
                            ?.id.toString() || "unassigned"
                        : assignTo
                            .find((a) => a.name === task.assign_to)
                            ?.id.toString() || "completed"
                    }
                    onValueChange={(value) => {
                      if (onAssignChange && value !== "unassigned") {
                        const selectedAssign = assignTo.find(
                          (a) => a.id.toString() === value
                        );
                        const assignName = selectedAssign
                          ? selectedAssign.name
                          : "";
                        const assignId = selectedAssign ? selectedAssign.id : 0;
                        onAssignChange(task.id, assignName, assignId);
                      }
                    }}
                  >
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="เลือกผู้รับผิดชอบ" />
                    </SelectTrigger>
                    <SelectContent>
                      {task.status === 0 || task.status === 1 ? (
                        <>
                          <SelectItem value="unassigned" disabled>
                            <span className="text-(--muted-foreground)">
                              เลือกผู้รับผิดชอบ
                            </span>
                          </SelectItem>
                          {assignTo && assignTo.length > 0 ? (
                            assignTo.map((assign) => (
                              <SelectItem
                                key={assign.id}
                                value={assign.id.toString()}
                              >
                                {assign.name}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="no-data" disabled>
                              ไม่มีข้อมูลผู้รับผิดชอบ
                            </SelectItem>
                          )}
                        </>
                      ) : (
                        <SelectItem
                          disabled
                          value={
                            assignTo
                              .find((a) => a.name === task.assign_to)
                              ?.id.toString() || "completed"
                          }
                        >
                          {task.assign_to || "เสร็จสิ้นแล้ว"}
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </TableCell>

                {task.status === 0 || task.status === 1 ? (
                  <TableCell>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditTask(task);
                      }}
                      disabled={loading}
                      className="cursor-pointer mr-2 bg-[#27272a] text-white hover:bg-[#18181b] hover:scale-105 "
                    >
                      <Pencil className=" h-4 w-4" />
                    </Button>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteTask(task.id);
                      }}
                      disabled={loading}
                      className="cursor-pointer mr-2 bg-red-500 text-white hover:bg-red-600 hover:scale-105 "
                    >
                      <Trash className=" h-4 w-4" />
                    </Button>
                  </TableCell>
                ) : (
                  <TableCell className="flex items-center justify-center gap-1">
                    <Check className="text-green-500 w-10 h-10" />
                    Success
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
