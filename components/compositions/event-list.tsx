"use client"

import React from "react"
import { EventCard } from "./event-card"
import { format, isToday, isTomorrow } from "date-fns"
import type { Event } from "@/lib/db"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface EventListProps {
  events: Event[] | undefined
}

export const EventList: React.FC<EventListProps> = ({ events }) => {
  // Group events by date for display
  const groupedEvents = React.useMemo(() => {
    const groups: Record<string, Event[]> = {}

    events?.forEach((event) => {
      const date = new Date(event.from)
      let groupKey = "upcoming"

      if (isToday(date)) {
        groupKey = "today"
      } else if (isTomorrow(date)) {
        groupKey = "tomorrow"
      } else {
        const formattedDate = format(date, "dd.MMM")
        groupKey = formattedDate
      }

      if (!groups[groupKey]) {
        groups[groupKey] = []
      }

      groups[groupKey].push(event)
    })

    return groups
  }, [events])

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {Object.keys(groupedEvents).length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">No events found</div>
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-0 top-0 bottom-0 w-px bg-border" />

          <Accordion type="multiple" defaultValue={Object.keys(groupedEvents)} className="space-y-8">
            {Object.entries(groupedEvents).map(([date, dateEvents]) => (
              <AccordionItem key={date} value={date} className="border-none">
                <div className="relative">
                  <div className="pl-8">
                    {/* Date header with accordion trigger */}
                    <AccordionTrigger className="-ml-10 py-2 text-base font-semibold hover:no-underline justify-end flex-row-reverse items-center [&>svg]:bg-accent [&>svg]:rounded-full [&>svg]:outline-2 [&>svg]:-rotate-90 [&[data-state=open]>svg]:rotate-0">
                      {date === "today" ? "Today" : date === "tomorrow" ? "Tomorrow" : date}
                    </AccordionTrigger>

                    <AccordionContent>
                      {dateEvents.map((event) => (
                        <EventCard event={event} key={event.id} />
                      ))}
                    </AccordionContent>
                  </div>
                </div>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}
    </div>
  )
}
