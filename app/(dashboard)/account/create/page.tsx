"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { createUser } from "@/hooks/useAccount";

export default function CreateUserPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "admin" as "admin" | "user"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await createUser(formData);
      toast.success("User created successfully");
      router.push("/account");
    } catch {
      toast.error("Error creating user");
    } finally {
      setLoading(false);
    }
  };

  return (
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-6">
              <div className="container mx-auto max-w-2xl">
                <div className="flex items-center gap-4 mb-6">
                 
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight">Create User</h1>
                    <p className="text-muted-foreground">Add a new user to the system</p>
                  </div>
                </div>

                <Card>
              
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="username" className="mb-3">Username</Label>
                        <Input
                          id="username"
                          value={formData.username}
                          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="password"  className="mb-3">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="role"  className="mb-3">Role</Label>
                        <Select value={formData.role} onValueChange={(value: "admin" | "user") => setFormData({ ...formData, role: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="user">User</SelectItem>            
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex justify-end space-x-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => router.back()}>
                          Cancel
                        </Button>
                        <Button className="text-white" type="submit" disabled={loading}>
                          {loading ? "Creating..." : "Create User"}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
  );
}