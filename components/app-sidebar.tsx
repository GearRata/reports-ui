"use client"

import * as React from "react"
import {
  IconChartBar,
} from "@tabler/icons-react"
import Image from 'next/image'
import Link from 'next/link'

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
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
      title: "Summary",
      url: "../management/summary",
      icon: IconChartBar,
    },
    {
      title: "Branch Offices",
      url: "/branches/",
      icon: IconChartBar,
    },
     {
      title: "Departments",
      url: "/department/",
      icon: IconChartBar,
    },
    {
      title: "Program",
      url: "/program/",
      icon: IconChartBar,
    },
    {
      title: "IP Phones",
      url: "/phone/",
      icon: IconChartBar,
    },
    {
      title: "Tasks",
      url: "/tasks/",
      icon: IconChartBar,
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
                  <Image src="/logo.png" alt="" width={40} height={40} className="w-15 h-15"/>
                  <span className="text-base font-semibold">FixTrack</span>
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
