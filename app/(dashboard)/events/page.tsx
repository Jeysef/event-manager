"use client";

import { EventList } from "@/components/compositions/event-list";
import { useSearchedEvents } from "@/hooks/use-events";

export default function EventsPage() {
  const { data: events, isLoading, error } = useSearchedEvents();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="flex flex-col gap-4 p-4">
      {events ? <EventList events={events} /> : <div>No events found</div>}
    </div>
  );
}