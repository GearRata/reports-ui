"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SiteHeader } from "@/components/layout/site-header";
import { UserStatsCards } from "@/components/user/user-stats";
import { UserTable } from "@/components/user/user-table";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useUsers, deleteUser } from "@/app/api/account";
import type { User, UserStats } from "@/types/user";

export default function AccountPage() {
  const router = useRouter();
  const { users, loading, refreshUsers } = useUsers();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Convert UserData to User format
  const convertedUsers: User[] = useMemo(() => 
    users.map(user => ({
      id: user.id.toString(),
      username: user.username,
      password: user.plain_password,
      role: user.role
    })), [users]
  );

  // Calculate stats
  const stats: UserStats = useMemo(() => ({
    total: convertedUsers.length,
    admins: convertedUsers.filter(u => u.role === "admin").length,
    users: convertedUsers.filter(u => u.role === "user").length
  }), [convertedUsers]);

  // Pagination
  const sortedUsers = convertedUsers;
  const paginatedUsers = sortedUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleAddUser = () => {
    router.push("/account/create");
  };

  const handleEditUser = (user: User) => {
    router.push(`/account/edit/${user.id}`);
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      deleteUser(Number(userId))
        .then(() => {
          toast.success("User deleted successfully");
          refreshUsers();
        })
        .catch(() => {
          toast.error("Error deleting user");
        });
    }
  };



  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <SidebarProvider
        style={{
          "--sidebar-width": "calc(var(--spacing) * 60)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties}
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-6">
                <div className="flex justify-center items-center h-64">Loading...</div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 60)",
        "--header-height": "calc(var(--spacing) * 12)",
      } as React.CSSProperties}
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader title="Accout"/>
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-6">
              <div className="container mx-auto space-y-6">
                <div className="flex flex-col gap-2">
                  <h1 className="text-3xl font-bold tracking-tight">Account Management</h1>
                  <p className="text-muted-foreground">Manage user accounts, roles, and permissions</p>
                </div>

                <UserStatsCards stats={stats} />

                <div className="space-y-4">
                  <div className="flex justify-end">
                    <Button className="text-white" onClick={handleAddUser}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add User
                    </Button>
                  </div>
                  <UserTable
                    users={paginatedUsers}
                    onEditUser={handleEditUser}
                    onDeleteUser={handleDeleteUser}
                    currentPage={currentPage}
                    pageSize={pageSize}
                    totalItems={sortedUsers.length}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                  />
                </div>


              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}