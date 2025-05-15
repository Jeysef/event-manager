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
        className="mb-2 cursor-pointer hover:bg-slate-50 transition-colors py-2 relative flex-row items-center"
      >
        <div className='flex-col flex-1'>

          <CardHeader>
            <CardTitle>{event.name}</CardTitle>
            {event.description ? <CardDescription>{event.description}</CardDescription> : null}
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              {formatTimeRange()}
            </div>
          </CardContent>
        </div>
        <ChevronRight size={16} className="text-muted-foreground m-3" />
      </Card>
    </Link>
  );
};
