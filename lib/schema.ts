import { z } from "zod";

export const EventSchema = z.object({
  id: z.number(),
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().nullable(),
  from: z.coerce.date(),
  to: z.coerce.date(),
});

export const FormEventSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().nullable(),
  fromDate: z.coerce.date(),
  fromTime: z.string().regex(/^\d{2}:\d{2}$/, { message: "Invalid time format" }),
  toDate: z.coerce.date(),
  toTime: z.string().regex(/^\d{2}:\d{2}$/, { message: "Invalid time format" }),
});

export const ApiFormEventSchema = EventSchema.omit({ id: true });

export type Event = z.infer<typeof EventSchema>;
export type FormEvent = z.infer<typeof FormEventSchema>;
export type ApiFormEvent = z.infer<typeof ApiFormEventSchema>;