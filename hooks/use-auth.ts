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
      console.log("Login Response:", data);

      if (!res.ok || !data.success || !data.data?.data) {
        console.error("Login failed:", data);
        return null;
      }

      const userData = data.data.data; // Access nested data
      const userObj: User = {
        id: userData.id || "",
        username: userData.username,
        password: "", // never store password
        role: userData.role,
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

