import { useQuery } from "@tanstack/react-query";
import { eventsApi } from "../api";

export function useEvents(params?: Parameters<typeof eventsApi.getEvents>[0]) {
  return useQuery({
    queryKey: ["events", params],
    queryFn: () => eventsApi.getEvents(params),
  });
}

export function useCreateEvent(params: Parameters<typeof eventsApi.createEvent>[0]) {
  return useQuery({
    queryKey: ["createEvent", params],
    queryFn: () => eventsApi.createEvent(params),
  });
}

export function useUpdateEvent(id: string, params: Parameters<typeof eventsApi.updateEvent>[1]) {
  return useQuery({
    queryKey: ["updateEvent", id, params],
    queryFn: () => eventsApi.updateEvent(id, params),
  });
}