import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from 'date-fns';
import { ChevronRight } from 'lucide-react';
import { Event } from '@/lib/db';
import Link from 'next/link';

interface EventCardProps {
  event: Event;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const startDate = new Date(event.from);
  const endDate = new Date(event.to);

  const formatTimeRange = () => {
    const start = format(startDate, 'HH:mm');
    const end = format(endDate, 'HH:mm');
    return `${start} - ${end}`;
  };

  return (
    <Link className='contents' href={`/event/${event.id}`}>
      <Card
        className="mb-2 bg-indigo-100 hover:bg-indigo-200 transition-colors py-2 relative flex-row items-center"
      >
        <div className='flex-col flex-1'>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-lg">{event.name}</CardTitle>
            <CardDescription className="flex items-center text-xs">
              {formatTimeRange()}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-2">
            <p className="text-sm text-muted-foreground">{event.description}</p>
          </CardContent>
        </div>
        <ChevronRight size={16} className="text-muted-foreground m-3" />
      </Card>
    </Link>
  );
};
