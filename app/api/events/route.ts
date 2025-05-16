import { createEvent, getEvents } from "@/lib/db";

// GET /api/events
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  
  const events = await getEvents({
    search: search || undefined,
    startDate: startDate ? new Date(startDate) : undefined,
    endDate: endDate ? new Date(endDate) : undefined
  });
  
  return Response.json(events);
}

// POST /api/events
export async function POST(request: Request) {
  const eventData = await request.json();
  // TODO: Validate eventData
  eventData.from = new Date(eventData.from);
  eventData.to = new Date(eventData.to);
  const newEvent = await createEvent(eventData);
  return Response.json(newEvent, { status: 201 });
}
