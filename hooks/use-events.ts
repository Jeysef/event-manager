import { useQuery, useQueryClient } from "@tanstack/react-query";
import { eventsApi } from "../api";
import { useSearch } from "./use-search";
import { startOfToday } from "date-fns";

export function useEvents(params?: Parameters<typeof eventsApi.getEvents>[0]) {
  return useQuery({
    queryKey: ["events", params],
    queryFn: () => eventsApi.getEvents(params),
    staleTime: 1000, // 1 second
  });
}

export function useEvent(id: string) {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ["event", id],
    queryFn: () => eventsApi.getEvent(id),
    initialData: () => {
      // Search all cached "events" queries for the event
      const queries = queryClient.getQueriesData<any[]>({ queryKey: ["events"] });
      for (const [, events] of queries) {
        const found = events?.find((event) => String(event.id) === String(id));
        if (found) return found;
      }
      return undefined;
    },
  });
}

export const createEventMutationFn = (params: Parameters<typeof eventsApi.createEvent>[0]) => {
  return eventsApi.createEvent(params);
};

export const updateEventMutationFn = ({ id, params }: { id: string, params: Parameters<typeof eventsApi.updateEvent>[1] }) => {
  return eventsApi.updateEvent(id, params);
};

export const deleteEventMutationFn = (id: string) => {
  return eventsApi.deleteEvent(id);
};

export function useSearchedEvents() {
  const { search, startDate, endDate } = useSearch();


  return useEvents({
    search: search || undefined,
    startDate: startDate ?? startOfToday(),
    endDate: endDate ?? undefined,
  });
}