import { useState } from "react";
import type { User } from "@/types/user";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);

  async function login(
    username: string,
    password: string
  ): Promise<User | null> {
    try {
      const res = await fetch (`${process.env.NEXT_PUBLIC_API_BASE}/api/authEntry/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include", // รับ session_cookie จาก server
      });
      const data = await res.json();


      if (!res.ok || !data.success || !data.data) {
        console.error("Login failed:", data);
        return null;
      }

      // อ่าน user data จาก response headers
      const headerUsername = res.headers.get("X-User-Username");
      const headerRole = res.headers.get("X-User-Role");
      
      const userObj: User = {
        id: data.data.id || "",
        username: headerUsername || data.data.username,
        password: "",
        role: headerRole || data.data.role,
      };
      setUser(userObj);
      
      // Backend ส่ง session_cookie มาให้แล้วผ่าน Set-Cookie header
      // Browser จะจัดการ cookie อัตโนมัติผ่าน credentials: "include"
      // ไม่ต้องเก็บ token เพราะ Backend จัดการ session ด้วย cookie (HttpOnly)
      
      return userObj;
    } catch (error) {
      console.error("Error during login:", error);
      return null;
    }
  }

  async function logout() {
    try {
      // เรียก backend logout API
      // Backend จะลบ session_cookie ให้เอง
      await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/authEntry/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Error logging out:", error);
    }
    
    setUser(null);
    // ไม่ต้องลบอะไรเพราะ Backend จัดการ cookie ทั้งหมด
  }

  return { user, login, logout };
}
