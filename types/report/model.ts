export interface Task {
  id: number
  phone_id: number
  text: string
  status: "pending" | "solved"
}

export interface TaskWithPhone extends Task {
   branch_id: number
   department_id: number
  branch_name: string
  department_name: string
  number: number
  phone_number?: string
  phone_name?: string
}