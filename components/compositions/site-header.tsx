"use client"

import { SidebarIcon } from "lucide-react"

import { SearchForm } from "@/components/compositions/search-form"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useSidebar } from "@/components/ui/sidebar"

export function SiteHeader() {
  const { toggleSidebar } = useSidebar()

  return (
    <header className="flex sticky top-0 z-50 w-full items-center border-b bg-background">
      <div className="flex h-(--header-height) w-full items-center gap-2 px-4">
        <div className="grid text-left text-sm leading-tight pe-8">
          <span className="truncate font-semibold">Event manager</span>
          <span className="truncate text-xs">interview project</span>
        </div>
        <Button
          className="h-8 w-8"
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
        >
          <SidebarIcon />
        </Button>
        <Separator orientation="vertical" className="mr-2 h-4" />
        <SearchForm className="w-full sm:mx-auto sm:w-96" />
      </div>
    </header>
  )
}
