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
      const res = await fetch("http://192.168.0.192:5000/authEntry/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

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
    } catch (e) {
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
