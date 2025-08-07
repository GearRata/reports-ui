export interface Task {
  id: string
  ip_phone: string
  department: string
  program: string
  problem: string
  solution: string
  status: "pending" | "solved" 
}

export interface TaskStats {
  total: number
  pending: number
  solved: number
}
