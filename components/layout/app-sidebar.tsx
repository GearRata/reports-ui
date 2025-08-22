"use client"

import * as React from "react"
import { Building2, Users, Phone, FolderCheck , BarChart3, BadgeAlert  } from "lucide-react"
import Image from 'next/image'
import Link from 'next/link'

import { NavMain } from "@/components/nav/nav-main"
import { NavUser } from "@/components/nav/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"


const data = {
  user: { 
      name: "Admin",
      avatar: "https://github.com/shadcn.png",

    },

  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: BarChart3,
    },
     {
      title: "Tasks",
      url: "/tasks",
      icon: FolderCheck,
    },
    {
      title: "Branch Offices",
      url: "/branches",
      icon: Building2,
    },
       {
      title: "IP Phones",
      url: "/phone",
      icon: Phone,
    },
    {
      title: "Departments",
      url: "/department",
      icon: Users,
    },
    {
      title: "Problem",
      url: "/program",
      icon: BadgeAlert,
    },
    
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5 my-2 w-full ">
              <Link href="/dashboard" className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <Image src="/LOGO-NOPADOL.png" alt="" width={30} height={30}/>
                  <span className="text-base font-semibold">NOPADOL</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
