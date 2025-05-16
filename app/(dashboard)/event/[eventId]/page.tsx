'use client'

import { use } from 'react'
import EventDetail from '@/components/compositions/event-detail'


export default function EventPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = use(params)

  return (

    <EventDetail eventId={eventId} />
  )
}
