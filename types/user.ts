export interface User {
  id: string
  username: string
  password: string
  role: "admin" | "user"
  created_at: string
}

export interface UserStats {
  total: number
  admins: number
  users: number
}
