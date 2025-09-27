export interface UserData {
  id: number;
  username: string;
  role: "admin" | "user";
  created_at: string;
  plain_password: string;
}

export interface CreateUserData {
  username: string;
  password: string;
  role: "admin" | "user";
}

export interface UpdateUserData {
  id: number;
  username: string;
  password?: string;
  role: "admin" | "user";
}