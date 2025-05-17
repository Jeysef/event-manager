import { createEvent, getEvents } from "@/lib/db";
import { ApiFormEventSchema } from "@/lib/schema";

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
  // Validate eventData using Zod
  const parsed = ApiFormEventSchema.safeParse(eventData);
  if (!parsed.success) {
    return Response.json({ errors: parsed.error.flatten() }, { status: 400 });
  }
  // Zod already coerces dates, but ensure Date objects
  const validData = parsed.data;
  const newEvent = await createEvent(validData);
  return Response.json(newEvent, { status: 201 });
}
