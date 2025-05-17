"use client";

import { EventList } from "@/components/compositions/event-list";
import { useSearchedEvents } from "@/hooks/use-events";

export default function EventsPage() {
  const { data: events, isLoading, error } = useSearchedEvents();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Upcoming Events</h1>
        <EventList events={events} />
      </div>
    </main>
  );
}