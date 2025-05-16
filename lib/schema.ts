import { z } from "zod";

export const EventSchema = z.object({
  id: z.number(),
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().nullable(),
  from: z.coerce.date(),
  to: z.coerce.date(),
});

export const FormEventSchema = EventSchema.omit({ id: true });



export type Event = z.infer<typeof EventSchema>;
export type FormEvent = z.infer<typeof FormEventSchema>;