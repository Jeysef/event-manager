import { getMonthlyEventsCounts } from "@/lib/db";

// GET /api/events/count
export async function GET() {
  const events = await getMonthlyEventsCounts()

  return Response.json(events);
}
