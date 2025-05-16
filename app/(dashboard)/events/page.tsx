"use client";

import { EventCard } from "@/components/compositions/event-card";
import { useSearchedEvents } from "@/hooks/use-events";

export default function EventsPage() {
  const { data: events, isLoading, error } = useSearchedEvents();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {events?.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}