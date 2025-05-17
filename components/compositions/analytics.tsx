"use client"

import {
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useEventsCount } from "@/hooks/use-analytics"
import { Skeleton } from "../ui/skeleton"

export function Analytics() {

  const { data, isLoading, isError } = useEventsCount()
  const count = data?.count
  console.log("🚀 ~ Analytics ~ count:", count)
  if (isError || count === undefined) return;
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        Currently{" "}
        {isLoading ? <Skeleton className="h-4 w-1/4" /> : <span>{count}</span>}{" "}
        events
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
