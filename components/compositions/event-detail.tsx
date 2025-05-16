import React, { useState } from 'react'
import { Button } from '../ui/button';
import { Card, CardHeader, CardFooter, CardContent, CardTitle } from '../ui/card';
import { useForm } from '@tanstack/react-form';
import { format } from 'date-fns';
import { deleteEventMutationFn, updateEventMutationFn, useEvent } from '@/hooks/use-events';
import { EventDetailView } from './event-detail-view';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Spinner } from '../ui/spinner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Skeleton } from '../ui/skeleton';
import { useRouter } from 'next/navigation';

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
          <EventDetailForm
            isUpdating={isUpdating}
            onCancel={() => setIsEditing(false)}
            onSubmit={() => {
              form.handleSubmit();
            }}
          />
        )}
      </Card>
    </div>
  )

  function EventDetailForm({ onCancel, onSubmit, isUpdating }: { onCancel: () => void, onSubmit: () => void, isUpdating: boolean }) {
    return (
      <>
        <CardHeader>
          <form.Field
            name="name"
            validators={{ onChange: value => !value ? "Event name is required" : undefined }}
          >
            {field => (
              <div className="space-y-2">
                <Label htmlFor="event-name">Event Name</Label>
                <Input
                  id="event-name"
                  value={field.state.value}
                  onChange={e => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors && (
                  <p className="text-sm text-red-500">{field.state.meta.errors.join(', ')}</p>
                )}
              </div>
            )}
          </form.Field>
        </CardHeader>
        <CardContent className="space-y-4">
          <form.Field name="description">
            {field => (
              <div className="space-y-2">
                <Label htmlFor="event-desc">Description</Label>
                <Textarea
                  id="event-desc"
                  value={field.state.value || ''}
                  onChange={e => field.handleChange(e.target.value)}
                  rows={4}
                />
              </div>
            )}
          </form.Field>
          <div className="grid grid-cols-2 gap-4">
            <form.Field
              name="from"
              validators={{ onChange: value => !value ? "Start date is required" : undefined }}
            >
              {field => (
                <div className="space-y-2">
                  <Label htmlFor="event-from">From</Label>
                  <Input
                    id="event-from"
                    type="datetime-local"
                    value={field.state.value}
                    onChange={e => field.handleChange(e.target.value)}
                  />
                  {field.state.meta.errors && (
                    <p className="text-sm text-red-500">{field.state.meta.errors.join(', ')}</p>
                  )}
                </div>
              )}
            </form.Field>
            <form.Field
              name="to"
              validators={{
                onChange: value => !value ? "End date is required" : undefined,
                onChangeAsync: async ({ value, fieldApi }) => {
                  const fromValue = fieldApi.form.getFieldValue('from');
                  if (fromValue && value && new Date(value) <= new Date(fromValue)) {
                    return "End date must be after start date";
                  }
                  return undefined;
                }
              }}
            >
              {field => (
                <div className="space-y-2">
                  <Label htmlFor="event-to">To</Label>
                  <Input
                    id="event-to"
                    type="datetime-local"
                    value={field.state.value}
                    onChange={e => field.handleChange(e.target.value)}
                  />
                  {field.state.meta.errors && (
                    <p className="text-sm text-red-500">{field.state.meta.errors.join(', ')}</p>
                  )}
                </div>
              )}
            </form.Field>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onCancel} disabled={isUpdating}>
            Cancel
          </Button>
          <form.Subscribe selector={state => state}>
            {(state) => (
              <Button
                type="button"
                disabled={!state.canSubmit || isUpdating || state.isSubmitting}
                onClick={onSubmit}
              >
                {(isUpdating || state.isSubmitting) ? <Spinner className="mr-2" /> : null}
                {isUpdating || state.isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            )}
          </form.Subscribe>
        </CardFooter>
      </>
    );
  }
}

export default EventDetail