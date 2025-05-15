import { EventList } from "@/components/compositions/event-list";
import { Event } from "@/lib/db";

export default function Home() {
  const events: Event[] = [
    { id: 1, name: 'SolidJS Meetup Brno', description: 'Meet other SolidJS enthusiasts and share your projects.', from: new Date('2025-06-01T18:00:00'), to: new Date('2025-06-01T21:00:00') },
    { id: 2, name: 'TypeScript Bootcamp', description: 'A hands-on bootcamp for mastering TypeScript.', from: new Date('2025-06-10T09:00:00'), to: new Date('2025-06-10T17:00:00') },
    { id: 3, name: 'Frontend Friday', description: 'Weekly frontend dev discussions and lightning talks.', from: new Date('2025-06-13T16:00:00'), to: new Date('2025-06-13T19:00:00') },
    { id: 4, name: 'Open Source Hackathon', description: 'Collaborate and contribute to open source projects.', from: new Date('2025-06-20T10:00:00'), to: new Date('2025-06-20T22:00:00') },
    { id: 5, name: 'Summer Tech BBQ', description: 'Networking, food, and tech talks in the park.', from: new Date('2025-06-28T15:00:00'), to: new Date('2025-06-28T20:00:00') }
  ]

  return (
    <main className="flex h-[calc(100svh-var(--header-height)-1px)]! flex-col items-center justify-between p-24">
      <EventList events={events} />
    </main>
  );
}
