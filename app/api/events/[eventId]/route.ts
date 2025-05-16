import { deleteEvent, getEvent, updateEvent } from "@/lib/db";
import { FormEventSchema } from "@/lib/schema";

// GET /api/event/[eventId]
export async function GET(_: Request, { params }: { params: Promise<{ eventId: string }> }) {
  const {eventId} = await params;
  const event = await getEvent(Number(eventId));

  return Response.json(event);
}

// PATCH /api/event/[eventId]
export async function PATCH(request: Request, { params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  const eventData = await request.json();
  // Validate eventData using Zod
  const parsed = FormEventSchema.safeParse(eventData);
  if (!parsed.success) {
    return Response.json({ errors: parsed.error.flatten() }, { status: 400 });
  }
  // Zod already coerces dates, but ensure Date objects
  const validData = parsed.data;
  const updatedEvent = await updateEvent(Number(eventId), validData);
  return Response.json(updatedEvent);
}

// DELETE /api/event/[eventId]
export async function DELETE(_: Request, { params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  await deleteEvent(Number(eventId));
  return Response.json({ message: "Event deleted successfully" });
}