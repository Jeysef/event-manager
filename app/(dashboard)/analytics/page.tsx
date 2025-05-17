"use client"

import EventChart from "@/components/compositions/analytics-chart"
import { useAnalytics } from "@/hooks/use-analytics"

export default function Home() {
  const { data: eventData } = useAnalytics()


  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Event Analytics Dashboard</h1>
      {eventData && eventData.length > 0 ? (
        <EventChart data={eventData} />
      ) : (
        <p>No event data available</p>
      )}
    </main>
  )
}
