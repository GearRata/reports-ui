"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";
import type { TaskWithPhone } from "@/types/entities";
import { MdDone } from "react-icons/md";
import { LuClock } from "react-icons/lu";
// import { MdAssignmentInd } from "react-icons/md"
import moment from "moment";
import "moment/locale/th"; // Import Thai locale
// import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAssign } from "@/lib/api/assign";


interface TasksNewTableProps {
  tasks: TaskWithPhone[];
  onEditTask: (task: TaskWithPhone) => void;
  onDeleteTask: (taskId: number) => void;
  onShowTask: (task: TaskWithPhone) => void;
  onAssignChange?: (taskId: number, assignTo: string) => void;
  loading?: boolean;
  error?: string | null;
}

const statusColors: Record<number, string> = {
  1: "bg-orange-400 rounded-full font-medium text-white flex items-center gap-2",
  0: "bg-green-400 rounded-full font-medium text-white flex items-center gap-2",
};

const statusLabels: Record<number, string> = {
  1: "Pending",
  0: "Done",
};

export function TasksNewTable({
  tasks,
  onEditTask,
  onDeleteTask,
  onShowTask,
  onAssignChange,
  loading = false,
  error = null,
}: TasksNewTableProps) {
  // Set Thai locale for moment
  moment.locale("th");

  const { assignTo } = useAssign();
  
  
  // Function to format time in Thai
  const formatTimeAgo = (dateString: string) => {
    const now = moment();
    const taskTime = moment(dateString);
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
    return moment(dateString).format("DD/MM/YYYY HH:mm");
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
            <TableHead>ชื่อผู้แจ้ง</TableHead>
            <TableHead>Phone Name</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Program</TableHead>
            <TableHead>Branch</TableHead>
            <TableHead>Text</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Assign To</TableHead>
            <TableHead>Actions</TableHead>
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
                onClick={() => onShowTask(task)}
                className="cursor-pointer"
              >
                {/* <TableCell className="font-medium">{index + 1}</TableCell> */}
                <TableCell className="font-medium ">
                  <Badge className="rounded-full font-medium text-white text-center w-8 bg-indigo-500">
                    {filterAlphabet(task.system_type)}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">
                  {task.ticket_no || `#${task.id}`}
                </TableCell>
                <TableCell>{task.reported_by}</TableCell>
                <TableCell>{task.phone_name || "-"}</TableCell>
                <TableCell>{task.department_name || "-"}</TableCell>
                <TableCell>{task.system_name || "อื่นๆ"}</TableCell>
                <TableCell>{task.branch_name || "-"}</TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {task.text}
                </TableCell>
                <TableCell>
                  <Badge
                    className={statusColors[task.status ? 0 : 1 || "pending"]}
                  >
                    <div className="flex items-center gap-1">
                      {task.status ? (
                        <MdDone className="w-3 h-3" />
                      ) : (
                        <LuClock className="w-3 h-3" />
                      )}
                      {statusLabels[task.status ? 0 : 1 || "pending"]}
                    </div>
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    className={`rounded-full font-medium text-white flex items-center gap-2 ${
                      task.status ? "bg-green-400" : "bg-orange-400"
                    }`}
                  >
                    {task.status ? (
                      <MdDone className="w-4 h-4" />
                    ) : (
                      <LuClock className="w-3 h-3" />
                    )}
                    {task.status
                      ? task.updated_at
                        ? formatFixedTime(task.updated_at)
                        : "-"
                      : task.created_at
                      ? formatTimeAgo(task.created_at)
                      : "-"}
                  </Badge>
                </TableCell>

                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Select
                    value={task.assign_to}
                    onValueChange={(value) => {
                      if (onAssignChange) {
                        onAssignChange(task.id, value === "unassigned" ? "" : value);
                      }
                    }}
                  >
                    <SelectTrigger className="w-[150px]">
                      <SelectValue  placeholder="เลือกผู้รับผิดชอบ" />
                    </SelectTrigger>
                    <SelectContent >
                      {assignTo && assignTo.length > 0 ? (
                        assignTo.map((assign) => (
                          <SelectItem key={assign.id} value={assign.name}>
                            {assign.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-data" disabled>
                          ไม่มีข้อมูลผู้รับผิดชอบ
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </TableCell>

                <TableCell>
                  <Button
                    onClick={(e) => {e.stopPropagation(); onEditTask(task);}}
                    disabled={loading}
                    className="cursor-pointer mr-2 bg-(--accent) text-white hover:bg-(--popover) hover:scale-105 "
                  >
                    <Pencil className=" h-4 w-4" />
                  </Button>
                  <Button
                    onClick={(e) => {e.stopPropagation(); onDeleteTask(task.id);}}
                    disabled={loading}
                    className="cursor-pointer mr-2 bg-red-500 text-white hover:bg-red-600 hover:scale-105 "
                  >
                    <Trash className=" h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
