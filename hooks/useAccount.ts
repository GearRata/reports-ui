"use client";

import { useEffect, useState } from "react";
import type { UserData, CreateUserData,UpdateUserData } from "@/types/account/model"


// Hook to fetch all users
export function useUsers() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/authEntry/users`);
      const data = await response.json();
      if (data.success) {
        setUsers(data.data || []);
      } else {
        setError("Failed to fetch users");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return { users, loading, error, refreshUsers: fetchUsers };
}

// Get user by ID
export async function getUserById(id: number) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/authEntry/user/${id}`);
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
}

// Create user
export async function createUser(userData: CreateUserData) {
  try {
    const endpoint = userData.role === "admin" ? "registerAdmin" : "registerUser";
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/authEntry/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) throw new Error("Failed to create user");
    return await response.json();
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

// Update user
export async function updateUser(userData: UpdateUserData) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/authEntry/updateUser`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) throw new Error("Failed to update user");
    return await response.json();
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}

// Delete user
export async function deleteUser(id: number) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
  
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/authEntry/deleteUser`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to delete user: ${errorText}`);
    }
    
    return true;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Delete operation timed out');
    }
    console.error("Error deleting user:", error);
    throw error;
  }
}

// Logout
export async function logout() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/authEntry/logout`, {
      method: "POST",
    });
    return response.ok;
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
}