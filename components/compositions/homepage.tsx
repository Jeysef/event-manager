"use client"

import { useMemo, useState } from "react"
import { endOfMonth, format, isSameDay, isSameMonth, startOfMonth, addDays, startOfDay, endOfDay, areIntervalsOverlapping, differenceInMinutes } from "date-fns"
import { useEvents } from "@/hooks/use-events"
import { EventCard } from "./event-card"
import { Calendar } from "../ui/calendar"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../ui/card"
import { Button, buttonVariants } from "../ui/button"
import { EventCardSkeleton } from "./event-card-skeleton"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Event } from "@/lib/db"

export default function Homepage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [month, setMonth] = useState<Date>(new Date())

  // Get the first and last day of the current month
  const monthStart = startOfMonth(month)
  const monthEnd = endOfMonth(month)

  // Fetch all events for the current month view
  const { data: events, isLoading } = useEvents({
    startDate: monthStart,
    endDate: monthEnd,
  })

  const datesWithEvents = useMemo(() => {
    const map = new Map<string, Event[]>()
    if (!events) return map

    let currentDay = startOfDay(monthStart)
    const endDay = startOfDay(monthEnd)

    while (currentDay <= endDay) {
      const dayStart = currentDay
      const dayEnd = endOfDay(currentDay)

      if (events) {
        events.forEach(event => {
          const eventStart = new Date(event.from)
          const eventEnd = new Date(event.to)
          if (
            areIntervalsOverlapping(
              { start: eventStart, end: eventEnd },
              { start: dayStart, end: dayEnd }
            )
          ) {
            const key = format(dayStart, "yyyy-MM-dd")
            if (!map.has(key)) map.set(key, [])
            map.get(key)!.push(event)
          }
        })
      }

      currentDay = addDays(currentDay, 1)
    }

    return map
  }, [events, monthStart, monthEnd])

  // Events for the currently selected day
  const selectedDayEvents = useMemo(() => {
    if (!events) return []
    const key = format(selectedDate, "yyyy-MM-dd")
    return (datesWithEvents.get(key) || []).slice().sort(
      (a, b) => differenceInMinutes(new Date(a.from), new Date(b.from))
    )
  }, [datesWithEvents, selectedDate, events])


  const dayHasEvents = (day: Date) => {
    return datesWithEvents.has(format(day, "yyyy-MM-dd"))
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="md:col-span-2 lg:col-span-3 flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle>Calendar</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 pb-6">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                onMonthChange={setMonth}
                month={month}
                className="w-full h-full"
                classNames={{
                  months: "flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:space-x-4 sm:space-x-0",
                  month: "space-y-4 w-full",
                  caption: "flex justify-center pt-1 relative items-center mb-4",
                  caption_label: "text-lg font-semibold",
                  nav: "space-x-1 flex items-center",
                  nav_button: "h-9 w-9 bg-transparent p-0 hover:opacity-70",
                  nav_button_previous: "absolute left-1",
                  nav_button_next: "absolute right-1",
                  table: "w-full border-collapse",
                  head_row: "flex w-full",
                  head_cell: "w-full text-muted-foreground rounded-md font-normal text-sm",
                  row: "flex w-full mt-6 justify-around",
                  cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md",
                  day: "h-12 w-12 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground rounded-md bg-indigo-100",
                  day_selected:
                    "text-primary-foreground  hover:text-primary-foreground focus:text-primary-foreground ring-4 ring-primary bg-indigo-100 text-primary-foreground",
                  day_today: "bg-accent text-accent-foreground",
                  day_outside:
                    "day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground opacity-50 !bg-gray-300",
                  day_disabled: "text-muted-foreground opacity-50",
                  day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                  day_hidden: "invisible",
                }}
                components={{
                  DayContent: ({ date }) => (
                    <div className={cn("relative flex h-12 w-12 items-center justify-center p-0 rounded-md", {"bg-indigo-300": dayHasEvents(date)})}>
                      <span className="font-semibold text-indigo-900">{date.getDate()}</span>
                    </div>
                  ),
                }}
              />
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1">
          <Card className="md:col-span-1 flex flex-col">
            <CardHeader className="pb-2 grid-flow-col">
              <CardTitle>Events for {format(selectedDate, "MMMM d, yyyy")}</CardTitle>
              <CardDescription>{selectedDayEvents.length} events scheduled</CardDescription>
              <Button
                variant="outline"
                className="ml-auto col-span-2 row-span-full"
                onClick={() => {
                  setSelectedDate(new Date())
                  setMonth(new Date())
                }}
                disabled={isSameDay(selectedDate, new Date())}
              >
                Today
              </Button>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto">
              <div className="mb-4 flex justify-end">
                <Link href="/event" className={buttonVariants()}>
                  + Create New Event
                </Link>
              </div>
              <div className="space-y-4">
                {!isSameMonth(selectedDate, month) ? (
                  <p className="text-muted-foreground text-center py-8">
                    Please select a day in the current month to view events.
                  </p>
                ) : isLoading ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="space-y-2">
                      <EventCardSkeleton />
                      <EventCardSkeleton />
                    </div>
                  ))
                ) : selectedDayEvents.length > 0 ? (
                  selectedDayEvents.map((event) => <EventCard key={event.id} event={event} />)
                ) : (
                  <p className="text-muted-foreground text-center py-8">No events scheduled for this day</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
