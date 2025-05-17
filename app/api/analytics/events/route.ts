import { getEventsCount } from "@/lib/db";

// GET /api/events/count
export async function GET() {
  const events = await getEventsCount()
  console.log("🚀 ~ GET ~ events:", events)
  return Response.json(events);
}
