export interface TaskData {
    file_paths(file_paths: []): unknown
    assignto: string
    assignedto_id: number
    issue_type: number
    issue_else: string
    id: number
    phone_id: number
    text: string
    status: number  // เปลี่
    reported_by: string
    assign_to: string
    assign_name?: string
    assignId?: string
    ticket_no: string
    branch_id: number
    department_id: number
    branch_name: string
    department_name: string
    number: number
    phone_name: string
    system_id: number      // เปลี่ยนจาก program_id
    system_name: string    // เปลี่ยนจาก program_name
    system_type: string
    created_at: string
    updated_at: string
    telegram: boolean
}

export type TaskDataId = number;

export interface AddTask {
    reported_by: string;
    phone_id: number | null;
    issue_type: number;
    system_id: number;
    issue_else: string;
    text: string;
    status: number;
    assign_to?: string | null;
    telegram?: boolean;
    file_paths?: string[];
    images?: File[];
}

export interface UpdateTask {
    reported_by: string;
    phone_id: number | null;
    system_id: number;
    text: string;
    issue_type: number;
    issue_else?: string;
    status: number;
    assign_to?: string | null;
    assignedto_id?: number;
    telegram?: boolean;
    file_paths?: string[];
}

export type DeleteTask = number;