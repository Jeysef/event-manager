import { useQuery } from "@tanstack/react-query";
import { analyticsApi } from "../api";

export function useEventsCount() {
  console.log("🚀 ~ useEventsCount ~ useEventsCount:", analyticsApi.getEventsCount)
  return useQuery({
    queryKey: ["eventsCount"],
    queryFn: () => analyticsApi.getEventsCount(),
    staleTime: 1000, // 1 second
  });
}