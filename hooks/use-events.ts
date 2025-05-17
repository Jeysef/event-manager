import { useQuery, useQueryClient } from "@tanstack/react-query";
import { eventsApi } from "../api";
import { useSearch } from "./use-search";
import { startOfToday } from "date-fns";

export function useEvents(params?: Parameters<typeof eventsApi.getEvents>[0]) {
  return useQuery({
    queryKey: ["events", params],
    queryFn: () => eventsApi.getEvents(params),
  });
}

export function useEvent(id: string) {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ["event", id],
    queryFn: () => eventsApi.getEvent(id),
    initialData: () => {
      // Try to get the event from the cached events list
      const events = queryClient.getQueryData<any[]>(["events", {}]);
      return events?.find((event) => String(event.id) === String(id));
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