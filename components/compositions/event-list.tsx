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
      let groupKey;

      if (isToday(date)) {
        groupKey = `Today (${format(date, "dd.MMM")})`
      } else if (isTomorrow(date)) {
        groupKey = `Tomorrow (${format(date, "dd.MMM")})`
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
        <div className="relative gap-y-8">
          {/* Timeline line */}
          <div className="absolute left-0 top-0 bottom-0 w-px bg-border" />
          {Object.entries(groupedEvents).map(([date, dateEvents]) => (
            <Accordion type="single" defaultValue={date} collapsible key={date}>
              <AccordionItem value={date} className="border-none">
                <div className="relative">
                  <div className="pl-8">
                    <AccordionTrigger className="-ml-10 py-2 text-base font-semibold hover:no-underline justify-end flex-row-reverse items-center [&>svg]:bg-accent [&>svg]:rounded-full [&>svg]:outline-2 [&>svg]:-rotate-90 [&[data-state=open]>svg]:rotate-0">
                      {date}
                    </AccordionTrigger>

                    <AccordionContent>
                      {dateEvents.map((event) => (
                        <EventCard event={event} key={event.id} />
                      ))}
                    </AccordionContent>
                  </div>
                </div>
              </AccordionItem>
            </Accordion>
          ))}
        </div>
      )}
    </div>
  )
}
