import { useQuery } from "@tanstack/react-query";
import { analyticsApi } from "../api";

export function useAnalytics() {
  return useQuery({
    queryKey: ["analytics"],
    queryFn: () => analyticsApi.getEventsAnalytics(),
    staleTime: 1000, // 1 second
  });
}