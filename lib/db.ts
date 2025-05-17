import 'server-only';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { count, sql } from 'drizzle-orm';
import {
  pgTable,
  text,
  timestamp,
  serial,
  index
} from 'drizzle-orm/pg-core';
import { eq, ilike, gte, lte, and, SQL } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';

export const db = drizzle(neon(process.env.POSTGRES_URL!));

export const events = pgTable('events', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  from: timestamp('from').notNull(),
  to: timestamp('to').notNull(),
}, (table) => [
  index('name_idx').on(table.name),
  index('date_idx').on(table.from, table.to)
]);

export type Event = typeof events.$inferSelect;
export const insertEventSchema = createInsertSchema(events);

// CREATE
export async function createEvent(eventData: typeof insertEventSchema._type) {
  const [event] = await db.insert(events).values(eventData).returning();
  return event;
}

// READ
export async function getEvents(filters?: {
  search?: string;
  startDate?: Date;
  endDate?: Date;
}): Promise<Event[]> {
  let query = db.select().from(events);
  const conditions: SQL[] = [];

  if (filters?.search) {
    conditions.push(ilike(events.name, `%${filters.search}%`));
  }

  if (filters?.startDate) {
    conditions.push(gte(events.from, filters.startDate));
  }

  if (filters?.endDate) {
    conditions.push(lte(events.to, filters.endDate));
  }

  return query.where(conditions.length > 0 ? and(...conditions) : undefined).orderBy(events.from);
}

export async function getEvent(id: number) {
  const [event] = await db.select().from(events).where(eq(events.id, id));
  return event;
}

// COUNT
export async function getEventsCount() {
  const [result] = await db.select({ count: count(events.id) }).from(events);
  return result;
}

export async function getMonthlyEventsCounts() {
  const results = await db
    .select({
      year: sql<number>`EXTRACT(YEAR FROM ${events.from})`,
      month: sql<number>`EXTRACT(MONTH FROM ${events.from})`,
      count: count(events.id),
    })
    .from(events)
    .groupBy(sql`EXTRACT(YEAR FROM ${events.from}), EXTRACT(MONTH FROM ${events.from})`)
    .orderBy(sql`EXTRACT(YEAR FROM ${events.from}), EXTRACT(MONTH FROM ${events.from})`);
  return results;
}

// UPDATE
export async function updateEvent(id: number, eventData: Partial<Event>) {
  const [event] = await db
    .update(events)
    .set(eventData)
    .where(eq(events.id, id))
    .returning();
  return event;
}

// DELETE
export async function deleteEvent(id: number) {
  await db.delete(events).where(eq(events.id, id));
}
