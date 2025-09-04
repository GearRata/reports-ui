export interface DepartmentData {
    branch_id: number;
    id: number;
    name: string;
    branch_name: string;
}

export type DepartmentDataId = number;

export interface AddDepartment {
    name: string;
    branch_id: number;
}

export interface UpdateDepartment {
    name: string;
    branch_id: number;
}

export type DeleteDepartment = number;
