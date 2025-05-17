"use client"
import { EventForm } from '@/components/compositions/event-form';
import { createEventMutationFn } from '@/hooks/use-events';
import { Event } from '@/lib/db';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React from 'react'
import { toast } from 'sonner';

export default function EventFormCreate() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate: createEvent, isPending: isCreating } = useMutation({
    mutationFn: createEventMutationFn,
    onMutate: async (newEvent) => {
      await queryClient.cancelQueries({ queryKey: ["events"] });
      const previousEvents = queryClient.getQueryData(["events"]);
      queryClient.setQueryData(["events"], (old: Event[]) => {
        if (Array.isArray(old)) {
          return [...old, newEvent];
        }
        return [old];
      });
      return { previousEvents };
    },
    onError: (_err, _newEvent, context) => {
      if (context?.previousEvents) {
        queryClient.setQueryData(["events"], context.previousEvents);
      }
      toast.error("Error creating event");
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["events"] }),
    onSuccess: () => {
      router.push("/");
    },
  });

  function handleCreateAction({ name, description, from, to }: { name: string; description?: string | null; from: Date; to: Date }) {
    createEvent({ name, description: description ?? '', from, to });
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold text-center">Create Event</h1>
      <EventForm
        onSubmitAction={handleCreateAction}
        isPending={isCreating}
        submitLabel="Save"
        cancelLabel="Cancel"
      />
    </div>
  );
}