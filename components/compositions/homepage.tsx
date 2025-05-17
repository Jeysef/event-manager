"use client"

import { useMemo, useState } from "react"
import { endOfMonth, format, isSameDay, startOfMonth } from "date-fns"
import { useEvents } from "@/hooks/use-events"
import { Skeleton } from "@/components/ui/skeleton"
import { EventCard } from "./event-card"
import { Calendar } from "../ui/calendar"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../ui/card"

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

  // Create a map of dates that have events
  const datesWithEvents = useMemo(() => {
    if (!events) return new Map()

    const dateMap = new Map()
    events.forEach((event) => {
      const eventDate = new Date(event.from)
      const dateKey = format(eventDate, "yyyy-MM-dd")

      if (!dateMap.has(dateKey)) {
        dateMap.set(dateKey, [])
      }
      dateMap.get(dateKey).push(event)
    })

    return dateMap
  }, [events])

  // Get events for the selected day
  const selectedDayEvents = useMemo(() => {
    if (!events) return []

    return events
      .filter((event) => isSameDay(new Date(event.from), selectedDate))
      .sort((a, b) => new Date(a.from).getTime() - new Date(b.from).getTime())
  }, [events, selectedDate])

  // Function to navigate to previous/next month


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
                  day: "h-12 w-12 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground rounded-md",
                  day_selected:
                    "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                  day_today: "bg-accent text-accent-foreground",
                  day_outside:
                    "day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground opacity-50",
                  day_disabled: "text-muted-foreground opacity-50",
                  day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                  day_hidden: "invisible",
                }}
                components={{
                  DayContent: ({ date }) => (
                    <div className="relative flex h-12 w-12 items-center justify-center p-0">
                      <span>{date.getDate()}</span>
                      {dayHasEvents(date) && (
                        <div className="absolute bottom-2 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-primary" />
                      )}
                    </div>
                  ),
                }}
              />
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1">
          <Card className="md:col-span-1 flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle>Events for {format(selectedDate, "MMMM d, yyyy")}</CardTitle>
              <CardDescription>{selectedDayEvents.length} events scheduled</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto">
              <div className="space-y-4">
                {/* Show prompt if selectedDate is not in the current month */}
                {selectedDate.getMonth() !== month.getMonth() || selectedDate.getFullYear() !== month.getFullYear() ? (
                  <p className="text-muted-foreground text-center py-8">
                    Please select a day in the current month to view events.
                  </p>
                ) : isLoading ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="space-y-2">
                      <Skeleton className="h-5 w-1/2" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
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
