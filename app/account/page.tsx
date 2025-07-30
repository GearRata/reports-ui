"use client"

import type React from "react"
import { useState, useMemo } from "react"
import { UserStatsCards } from "@/components/user/user-stats"
import { UserTable } from "@/components/user/user-table"
import { UserForm } from "@/components/user/user-form"
import type { User, UserStats } from "@/types/user"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { SiteHeader } from "@/components/layout/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

function AccountPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // // Load initial data
  // useEffect(() => {
  //   setUsers(usersData as User[])
  // }, [])

  // Calculate stats
  const stats: UserStats = useMemo(() => {
    const total = users.length
    const admins = users.filter((u) => u.role === "admin").length
    const regularUsers = users.filter((u) => u.role === "user").length
    return { total, admins, users: regularUsers }
  }, [users])

  // Sort users with admin role at the top
  const sortedUsers = useMemo(() => {
    return [...users].sort((a, b) => {
      // Define role priority (lower number = higher priority)
      const rolePriority = {
        admin: 1,
        user: 2,
      }

      // First sort by role priority
      const roleComparison = rolePriority[a.role] - rolePriority[b.role]
      if (roleComparison !== 0) {
        return roleComparison
      }
      return a.username.localeCompare(b.username) 
    })
  }, [users])

  // Paginate sorted users
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize
    return sortedUsers.slice(startIndex, endIndex)
  }, [sortedUsers, currentPage, pageSize])

  const handleAddUser = () => {
    setEditingUser(null)
    setIsFormOpen(true)
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setIsFormOpen(true)
  }

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter((u) => u.id !== userId))
  }

  const handleUserSubmit = (userData: Omit<User, "id" | "created_at"> & { id?: string }) => {
    if (editingUser) {
      // Update existing user
      setUsers(
        users.map((u) =>
          u.id === editingUser.id
            ? ({
                ...userData,
                id: editingUser.id,
              } as User)
            : u,
        ),
      )
    } else {
      // Add new user
      const newUser: User = {
        ...userData,
        id: `USER-${Math.floor(Math.random() * 10000)
          .toString()
          .padStart(3, "0")}`,
        created_at: new Date().toISOString(),
      } as User
      setUsers([newUser, ...users])
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize)
    setCurrentPage(1)
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 60)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
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
                    <Button onClick={handleAddUser}>
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

                <UserForm
                  open={isFormOpen}
                  onOpenChange={setIsFormOpen}
                  user={editingUser}
                  onSubmit={handleUserSubmit}
                />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default AccountPage
