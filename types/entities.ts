import { LargeNumberLike } from "crypto"
import { ReactNode } from "react"

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