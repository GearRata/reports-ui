export interface Task {
  id: string
  ip_phone: string
  department: string
  program: string
  problem: string
  solution: string
  status: "in_progress" | "done" 
}

export interface TaskStats {
  total: number
  in_progress: number
  done: number
}
