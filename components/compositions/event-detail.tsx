import React, { useState } from 'react'
import { Card, CardHeader, CardContent, CardTitle } from '../ui/card';
import { useForm } from '@tanstack/react-form';
import { format } from 'date-fns';
import { deleteEventMutationFn, updateEventMutationFn, useEvent } from '@/hooks/use-events';
import { EventDetailView } from './event-detail-view';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Skeleton } from '../ui/skeleton';
import { useRouter } from 'next/navigation';
import { EventForm } from './event-form';

function EventDetail({ eventId }: { eventId: string }) {

  const { data: event, isLoading, error } = useEvent(eventId)

  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate: updateEvent, isPending: isUpdating } = useMutation({
    mutationFn: updateEventMutationFn,
    onMutate: async ({ id, params }) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ['event', id] });
      // Snapshot the previous value
      const previousEvent = queryClient.getQueryData(['event', id]);
      // Optimistically update to the new value
      queryClient.setQueryData(['event', id], (old: any) => ({ ...old, ...params }));
      return { previousEvent };
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (_err, variables, context) => {
      if (context?.previousEvent) {
        queryClient.setQueryData(['event', variables.id], context.previousEvent)
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
    onSuccess: (_) => {
      setIsEditing(false);
    },
  });
  const { mutate: deleteEvent } = useMutation({
    mutationFn: deleteEventMutationFn,
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ['events'] });
      const previousEvents = queryClient.getQueryData(['events']);
      queryClient.setQueryData(['events'], (old: any) => Array.isArray(old) ? old.filter((e: any) => `${e.id}` !== id) : old);
      return { previousEvents };
    },
    onError: (_err, _id, context) => {
      if (context?.previousEvents) {
        queryClient.setQueryData(['events'], context.previousEvents);
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['events'] }),
    onSuccess: () => {
      router.push('/');
    },
  });

  const form = useForm({
    defaultValues: {
      name: event?.name || '',
      description: event?.description || '',
      from: event?.from ? format(event.from, "yyyy-MM-dd'T'HH:mm") : '',
      to: event?.to ? format(event.to, "yyyy-MM-dd'T'HH:mm") : ''
    },
    onSubmit: async ({ value }) => {
      if (!event) return

      updateEvent({
        id: `${event.id}`,
        params: {
          name: value.name,
          description: value.description,
          from: new Date(value.from),
          to: new Date(value.to)
        }
      })
    }
  })


  const EventDetailSkeleton = () => (
    <>
      <CardHeader>
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/2 mt-2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-24 w-full" />
        <div className="mt-4 space-y-2">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      </CardContent>
    </>
  )

  const EventDetailError = () => (
    <>
      <CardHeader>
        <CardTitle>Error Loading Event</CardTitle>
      </CardHeader>
      <CardContent>
        <p>There was a problem loading this event. Please try again later.</p>
      </CardContent>
    </>
  )

  const EventDetailNotFound = () => (
    <>
      <CardHeader>
        <CardTitle>Event Not Found</CardTitle>
      </CardHeader>
      <CardContent>
        <p>The requested event could not be found.</p>
      </CardContent>
    </>
  )

  return (
    <div className="max-w-2xl mx-auto p-6 w-full">
      <Card>
        {isLoading ? (
          <EventDetailSkeleton />
        ) : error ? (
          <EventDetailError />
        ) : !event ? (
          <EventDetailNotFound />
        ) : !isEditing ? (
          <EventDetailView
            event={event}
            onEdit={() => setIsEditing(true)}
            onDelete={() => {
              deleteEvent(`${event.id}`);
            }}
          />
        ) : (
          <EventForm
            initialValues={{
              name: event.name,
              description: event.description,
              from: event.from,
              to: event.to,
            }}
            isPending={isUpdating}
            onCancel={() => setIsEditing(false)}
            onSubmitAction={({ name, description, from, to }) => {
              updateEvent({
                id: `${event.id}`,
                params: { name, description, from, to },
              });
            }}
            submitLabel="Save Changes"
            cancelLabel="Cancel"
          />
        )}
      </Card>
    </div>
  )
}

export default EventDetail