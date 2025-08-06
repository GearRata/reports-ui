"use client";

import type { LucideIcon } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import Version from "@/components/Version";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
  }[];
}) {
  return (
    <div className="h-full flex flex-col items-center  justify-between">
      <SidebarGroup className=" fill-white drop-shadow-xl/50 rounded ">
        <SidebarGroupContent>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild tooltip={item.title} className="transition-all duration-300 ease-in-out hover:scale-105 ">
                  <Link href={item.url}>
                    <div className="flex items-center gap-2 justify-center ">
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </div>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
       <div className="text-gray-400 font-light text-sm">
          <Version />
        </div>
    </div>
  );
}
