# Event manager

An interview project by Lakmoos from 14.05.2025 - 17.05.2025

## Description

Create a full-stack CRUD application for managing events. The application should have a REST API backend and a frontend built with a modern JavaScript framework, preferably React.

## My take

I chose NextJs for Frontend and backend. I will be using api routes instead of server functions.
I plan to use: 
    - Shadcn ui
    - TanStack Query 
    - Tanstack Form
For database I chose Neon, hosted on Vercel.
I plant to host this project on vercel as well.

## Getting Started

To initialize the db, type the following into SQL editor:
```sql
-- Create your events table if it doesn't exist
CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  "from" TIMESTAMP NOT NULL,
  "to" TIMESTAMP NOT NULL
);
```

To Insert few entries use: 
```sql
-- Insert your 5 events
INSERT INTO events (name, description, "from", "to") VALUES
  (
    'SolidJS Meetup Brno',
    'Meet other SolidJS enthusiasts and share your projects.',
    '2025-06-01 18:00:00',
    '2025-06-01 21:00:00'
  ),
  (
    'TypeScript Bootcamp',
    'A hands-on bootcamp for mastering TypeScript.',
    '2025-06-10 09:00:00',
    '2025-06-10 17:00:00'
  ),
  (
    'Frontend Friday',
    'Weekly frontend dev discussions and lightning talks.',
    '2025-06-13 16:00:00',
    '2025-06-13 19:00:00'
  ),
  (
    'Open Source Hackathon',
    'Collaborate and contribute to open source projects.',
    '2025-06-20 10:00:00',
    '2025-06-20 22:00:00'
  ),
  (
    'Summer Tech BBQ',
    'Networking, food, and tech talks in the park.',
    '2025-06-28 15:00:00',
    '2025-06-28 20:00:00'
  );
```

## To build for docker: 

add the following to the `next.config.js` file:

```js
// next.config.js
module.exports = {
  // ... rest of the configuration.
  output: "standalone",
};
```

This will build the project as a standalone app inside the Docker image.