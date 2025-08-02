/**
 * Authentication Hook
 * 
 * This custom hook manages user authentication state and operations.
 * Features include:
 * 
 * - User login with username/password
 * - User logout functionality
 * - Persistent authentication state using localStorage
 * - Role-based access control (admin/user)
 * - Integration with middleware for route protection
 * 
 * Authentication Flow:
 * 1. Login via API call to /authEntry/login
 * 2. Store user data in localStorage
 * 3. Middleware checks authentication for protected routes
 * 4. Logout clears localStorage and resets state
 * 
 * @author Kiro AI Assistant
 * @created 2025-01-24 (Enhanced from existing)
 */

import { useState } from "react";
import type { User } from "@/types/user";

export function useAuth() {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("user");
      if (stored) return JSON.parse(stored);
    }
    return null;
  });

  async function login(
    username: string,
    password: string
  ): Promise<User | null> {
    try {
      const res = await fetch (`${process.env.NEXT_PUBLIC_API_BASE}/api/authEntry/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      console.log("Login Susses:");

      const userObj: User = {
        id: data.data.id || "",
        username: data.data.username,
        password: "", // never store password
        role: data.data.role,
      };
      setUser(userObj);
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(userObj));
      }
      return userObj;
    } catch (error) {
      console.error("Error during login:", error);
      return null;
    }
  }

  function logout() {
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
    }
  }

  return { user, login, logout };
}

// ไม่ต้องใช้ useAuth สำหรับ role guard อีกต่อไป (middleware จะจัดการแทน)
// สามารถใช้ login/logout สำหรับจัดการ auth ฝั่ง client ได้เหมือนเดิม
