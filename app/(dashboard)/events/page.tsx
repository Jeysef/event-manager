"use client";

import { EventList } from "@/components/compositions/event-list";
import { useSearchedEvents } from "@/hooks/use-events";
import { startOfToday } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Event } from "@/lib/db";

enum Tab {
  UPCOMING = "UPCOMING",
  PREVIOUS = "PREVIOUS",
}

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState(Tab.UPCOMING);

  const { data: events, isLoading, error } = useSearchedEvents({
    startDate: activeTab === Tab.UPCOMING ? startOfToday() : undefined,
    endDate: activeTab === Tab.UPCOMING ? undefined : startOfToday(),
  });



  const renderContent = (events: Event[] | undefined, isLoading: boolean, error: any) => {
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
        <h1 className="text-2xl font-bold mb-6 text-center">Events</h1>
        <Tabs defaultValue={Tab.UPCOMING} onValueChange={(value) => setActiveTab(value as Tab)}>
          <TabsList className="grid w-full grid-cols-2 mb-6 max-w-3xl mx-auto">
            <TabsTrigger value={Tab.UPCOMING}>Upcoming Events</TabsTrigger>
            <TabsTrigger value={Tab.PREVIOUS}>Previous Events</TabsTrigger>
          </TabsList>
          <TabsContent value={Tab.UPCOMING}>
            {renderContent(events, isLoading, error)}
          </TabsContent>
          <TabsContent value={Tab.PREVIOUS}>
            {renderContent(events, isLoading, error)}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}