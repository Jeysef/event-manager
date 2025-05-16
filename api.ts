import axios from "axios";
import { Event } from "./lib/db";

const api = axios.create({
  baseURL: "/api",
});

export const eventsApi = {
  getEvents: async (params?: {
    search?: Event["name"];
    startDate?: Event["from"];
    endDate?: Event["to"];
  }): Promise<Event[]> => {
    const { data } = await api.get("/events", { params });
    return data;
  },

  getEvent: async (id: string): Promise<Event> => {
    const { data } = await api.get(`/events/${id}`);
    return data;
  },

  createEvent: async (eventData: Omit<Event, "id">): Promise<Event> => {
    const { data } = await api.post("/events", eventData);
    return data;
  },

  updateEvent: async (id: string, eventData: Partial<Event>): Promise<Event> => {
    const { data } = await api.patch(`/events/${id}`, eventData);
    return data;
  },

  deleteEvent: async (id: string): Promise<void> => {
    await api.delete(`/events/${id}`);
  },
};