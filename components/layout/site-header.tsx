"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/modetoggle/modetoggle"
interface SiteHeaderProps {
  title?: string
}

export function SiteHeader({ title = "Dashboard" }: SiteHeaderProps) {
  return (
    <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <div className="flex items-center justify-between w-full gap-2">
        <h1 className="text-lg font-semibold">{title}</h1>
        <ModeToggle />
      </div>
    </header>
  )
}