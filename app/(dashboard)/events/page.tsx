"use client";

import { EventList } from "@/components/compositions/event-list";
import { useSearchedEvents } from "@/hooks/use-events";
import { Event } from "@/lib/db";
import { startOfToday } from "date-fns";

export default function EventsPage() {
  const { data: events, isLoading, error } = useSearchedEvents({
    startDate: startOfToday(),
  });

  const renderContent = (events: Event[] | undefined, isLoading: boolean, error: Error | null) => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-[50vh]">
          <p>Loading...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex justify-center items-center h-[50vh]">
          <p>Error: {error.message}</p>
        </div>
      );
    }

    return <EventList events={events} />;
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Upcoming Events</h1>
        {renderContent(events, isLoading, error)}
      </div>
    </main>
  );
}