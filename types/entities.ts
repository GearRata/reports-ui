

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