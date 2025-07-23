

export interface Branch {
  id: number
  name: string
}

export interface Department {
  branch_id: number
  id: number
  name: string
  branch_name: string
}

export interface Program {
  id: number
  name: string
}

export interface IPPhone {
  branch_id: number
  branch_name: string
  department_name: string
  department_id: number
  id: number
  number: number
  name: string
}

export interface RequestIpPhone {
  branch_id: number
  department_id: number
  number: number
  name: string
}


export interface Task {
  id: number
  phone_id: number
  text: string
  status: number  // เปลี่ยนจาก string เป็น number
}

export interface TaskWithPhone extends Task {
  branch_id: number
  department_id: number
  branch_name: string
  department_name: string
  number: number
  phone_name: string
  system_id: number      // เปลี่ยนจาก program_id
  system_name: string    // เปลี่ยนจาก program_name
}

export interface TaskStats {
  total: number
  pending: number
  solved: number
}

export interface DashboardData {
  success: boolean
  message: string
  chartdata: {
    yearStats: Array<{
      year: string
      months: Array<{
        month: string
        branches: Array<{
          branchId: number
          branchName: string
          total_problems: number
          departments: Array<{
            departmentId: number
            departmentName: string
            total_problems: number
            ipphones: Array<{
              ipphoneId: number
              ipphoneName: string
              total_problems: number
              programs: Array<{
                programId: number
                programName: string
                total_problems: number
              }>
            }>
          }>
        }>
      }>
    }>
  }
  branches: Array<{
    id: number
    name: string
    created_at: string
    updated_at: string
  }>
  departments: Array<{
    id: number
    name: string
    branch_id: number
    branch_name: string
    created_at: string
    updated_at: string
  }>
  ip_phones: Array<{
    id: number
    number: number
    name: string
    department_id: number
    department_name: string
    branch_id: number
    branch_name: string
    created_at: string
    updated_at: string
  }>
  programs: Array<{
    id: number
    name: string
    created_at: string
    updated_at: string
  }>
  tasks: Array<{
    id: number
    phone_id: number
    number: number
    phone_name: string
    system_id: number
    system_name: string | null
    department_id: number
    department_name: string
    branch_id: number
    branch_name: string
    text: string
    status: number
    created_at: string
    updated_at: string
    month: string
    year: string
  }>
}