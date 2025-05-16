import { deleteEvent, getEvent, updateEvent } from "@/lib/db";

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
  // TODO: Validate eventData
  eventData.from = new Date(eventData.from);
  eventData.to = new Date(eventData.to);
  const updatedEvent = await updateEvent(Number(eventId), eventData);
  return Response.json(updatedEvent);
}

// DELETE /api/event/[eventId]
export async function DELETE(_: Request, { params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  await deleteEvent(Number(eventId));
  return Response.json({ message: "Event deleted successfully" });
}