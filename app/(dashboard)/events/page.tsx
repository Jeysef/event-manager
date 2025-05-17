"use client";

import { EventList } from "@/components/compositions/event-list";
import { useSearchedEvents } from "@/hooks/use-events";

export default function EventsPage() {
  const { data: events, isLoading, error } = useSearchedEvents();

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Upcoming Events</h1>
        {isLoading ? (
          <div className="flex justify-center items-center h-screen">
            <p>Loading...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-screen">
            <p>Error: {error.message}</p>
          </div>
        ) : (
          <EventList events={events} />
        )}
      </div>
    </main>
  );
}