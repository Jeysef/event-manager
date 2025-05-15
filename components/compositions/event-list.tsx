import React from 'react';
import { EventCard } from './event-card';
import { format, isToday, isTomorrow } from 'date-fns';
import { Event } from '@/lib/db';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';


export type EventFilter = 'today' | 'tomorrow' | 'upcoming' | 'all';

interface EventListProps {
  events: Event[];
}

export const EventList: React.FC<EventListProps> = ({ events }) => {
  // Group events by date for display
  const groupedEvents = React.useMemo(() => {
    const groups: Record<string, Event[]> = {};

    events.forEach(event => {
      const date = new Date(event.from);
      let groupKey = 'upcoming';

      if (isToday(date)) {
        groupKey = 'today';
      } else if (isTomorrow(date)) {
        groupKey = 'tomorrow';
      } else {
        const formattedDate = format(date, 'dd.MMM');
        groupKey = formattedDate;
      }

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }

      groups[groupKey].push(event);
    });

    return groups;
  }, [events]);

  return (
    <Accordion type="multiple" className="space-y-4 w-full" defaultValue={Object.keys(groupedEvents)}>
      {Object.entries(groupedEvents).map(([date, dateEvents]) => (
        <AccordionItem value={date} key={date}>
          <AccordionTrigger className="text-sm font-medium mb-2 justify-start">
            <span className='flex order-2'>
              {date === 'today' ? 'Today' :
                date === 'tomorrow' ? 'Tomorrow' : date}
            </span>
          </AccordionTrigger>
          <AccordionContent className="space-y-1" >
            {dateEvents.map(event => (
              <div key={event.id} className="ml-2">
                <EventCard
                  event={event}
                />
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
      ))}

      {Object.keys(groupedEvents).length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No events found
        </div>
      )}
    </Accordion>
  );
};