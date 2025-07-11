import { useState } from "react"
import users from "@/data/users.json"
import type { User } from "@/types/user"

export function useAuth() {
  // Try to get user from localStorage
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("user")
      if (stored) return JSON.parse(stored)
    }
    return null
  })

  function login(username: string, password: string): User | null {
    const found = (users as User[]).find(
      (u) => u.username === username && u.password === password
    )
    if (found) {
      setUser(found)
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(found))
      }
      return found
    }
    return null
  }

  function logout() {
    setUser(null)
    if (typeof window !== "undefined") {
      localStorage.removeItem("user")
    }
  }

  return { user, login, logout }
}

// ไม่ต้องใช้ useAuth สำหรับ role guard อีกต่อไป (middleware จะจัดการแทน)
// สามารถใช้ login/logout สำหรับจัดการ auth ฝั่ง client ได้เหมือนเดิม
