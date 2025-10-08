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

      console.log("Login Response Status:", res.status);
      console.log("Login Response Headers:", Object.fromEntries(res.headers.entries()));
      console.log("Login Response Data:", data);

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
      
      // เก็บ token จาก header และ set cookie แบบ manual
      const token = res.headers.get("token");
      if (token && typeof window !== "undefined") {
        // ตรวจสอบว่าใช้ HTTPS หรือไม่
        const isSecure = window.location.protocol === 'https:';
        const secureFlag = isSecure ? '; Secure' : '';
        const sameSiteFlag = isSecure ? '; SameSite=None' : '; SameSite=Lax';
        
        // ตั้ง auth_token cookie
        document.cookie = `auth_token=${token}; path=/; max-age=86400${sameSiteFlag}${secureFlag}`;
        
        console.log("Set auth_token cookie:", `auth_token=${token}; path=/; max-age=86400${sameSiteFlag}${secureFlag}`);
      }
      
      return userObj;
    } catch (error) {
      console.error("Error during login:", error);
      return null;
    }
  }

  async function logout() {
    try {
      // เรียก backend logout API
      await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/authEntry/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Error logging out:", error);
    }
    
    setUser(null);
    // ลบ cookies
    if (typeof window !== "undefined") {
      document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  }

  return { user, login, logout };
}
