export interface IpPhoneData {
  branch_id: number
  branch_name: string
  department_name: string
  department_id: number
  id: number
  number: number
  name: string
}

export type IpPhoneDataId = number

export interface AddIpPhone {
  branch_id: number
  department_id: number
  number: number
  name: string
}

export interface UpdateIpPhone {
  number: number;
  name: string;
  branch_id: number;
  department_id: number
}

export type DeleteIpPhone = number;