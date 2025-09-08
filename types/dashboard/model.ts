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