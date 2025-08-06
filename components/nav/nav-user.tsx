"use client"

import {
  IconDotsVertical,
  IconLogout,
  IconUserCircle,
} from "@tabler/icons-react"
import { useEffect, useState } from "react"
import Link from 'next/link'

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function NavUser({
  user: initialUser,
}: {
  user: {
    name: string
    avatar: string
  }
}) {
  const { isMobile } = useSidebar()
  const [user, setUser] = useState(initialUser)

  useEffect(() => {
    // Try to get user from localStorage or cookie
    let userData = null
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("user")
      if (stored) {
        try {
          userData = JSON.parse(stored)
        } catch {}
      }
    }
    if (userData && userData.role === "user") {
      setUser({
        name: userData.username,
        avatar: "https://github.com/evilrabbit.png" // หรือจะใช้ avatar จาก userData ก็ได้
      })
    }
  }, [])

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className=" p-3 inset-shadow-sm inset-shadow-blue-600"
            >
              <Avatar>
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="text-muted-foreground truncate text-xs">
                </span>
              </div>
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg"></AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="text-muted-foreground truncate text-xs">
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
            <Link href="/account" className="flex items-center gap-2">
              <DropdownMenuItem className="w-full cursor-pointer">
                  <IconUserCircle /> 
                  <p>Account</p>
              </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <Link href="/" className="flex items-center gap-2"> 
            <DropdownMenuItem className="w-full cursor-pointer">
                <IconLogout /> 
                <p>Logout</p>
            </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
