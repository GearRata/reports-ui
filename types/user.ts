export interface User {
  id: string
  username: string
  password: string
  role: "admin" | "user"
  
}

export interface UserStats {
  total: number
  admins: number
  users: number
}
