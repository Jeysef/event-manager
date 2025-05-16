"use client"

import React, { useEffect, useState } from "react"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useForm } from "@tanstack/react-form"
import { createEventMutationFn } from "@/hooks/use-events"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { cn } from "@/lib/utils"
import { TimePicker } from "../ui/time-picker"
import Link from "next/link"
import { DatePicker } from "../ui/date-picker"
import { useRouter } from "next/navigation"

export default function EventForm() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const now = new Date()
  const pad = (n: number) => n.toString().padStart(2, "0")
  const [fromDate, setFromDate] = useState<Date | undefined>(now)
  const [toDate, setToDate] = useState<Date | undefined>(now)
  const [fromTime, setFromTime] = useState<string>(`${pad(now.getHours())}:00`)
  const [toTime, setToTime] = useState<string>(`${pad(now.getHours() + 1)}:00`)


  const { mutate: createEvent, isPending: isCreating } = useMutation({
    mutationFn: createEventMutationFn,
    onMutate: async (newEvent) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["events"] })
      // Snapshot the previous value
      const previousEvents = queryClient.getQueryData(["events"])
      // Optimistically update to the new value
      queryClient.setQueryData(["events"], (old: any) => {
        if (Array.isArray(old)) {
          return [...old, newEvent]
        }
        return [old]
      })
      return { previousEvents }
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (_err, _newEvent, context) => {
      if (context?.previousEvents) {
        queryClient.setQueryData(["events"], context.previousEvents)
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["events"] }),
    onSuccess: () => {
      form.reset();
      router.push("/");
    },
  })

  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
      from: "",
      to: "",
    },
    onSubmit: async ({ value }) => {
      createEvent({
        name: value.name,
        description: value.description,
        from: new Date(value.from),
        to: new Date(value.to),
      })
    },
  })

  // Update form values when date/time changes
  useEffect(() => {
    if (fromDate) {
      const fromDateTime = new Date(fromDate)
      const [hours, minutes] = fromTime.split(":").map(Number)
      fromDateTime.setHours(hours, minutes)
      form.setFieldValue("from", fromDateTime.toISOString())
    }

    if (toDate) {
      const toDateTime = new Date(toDate)
      const [hours, minutes] = toTime.split(":").map(Number)
      toDateTime.setHours(hours, minutes)
      form.setFieldValue("to", toDateTime.toISOString())
    }
  }, [fromDate, toDate, fromTime, toTime, form])

  return (
    <div className="max-w-md mx-auto w-full h-full content-center">
      <Card className="border-0 shadow-none">
        <CardContent className="p-0 space-y-4">
          <div className="border-b pb-3">
            <form.Field name="name">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor="event-name">Event Name</Label>
                  <Input
                    id="event-name"
                    className="border-b focus-visible:ring-0 focus-visible:ring-offset-0"
                    placeholder="Title"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </div>
              )}
            </form.Field>
          </div>

          <form.Field name="description">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="event-desc">Description</Label>
                <Textarea
                  id="event-desc"
                  value={field.state.value || ""}
                  onChange={(e) => field.handleChange(e.target.value)}
                  rows={3}
                  className="resize-none"
                />
              </div>
            )}
          </form.Field>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <DatePicker date={fromDate} setDate={setFromDate} />
              <TimePicker value={fromTime} onChange={setFromTime} />
            </div>

            <div className="text-gray-400">→</div>

            <div className="space-y-1">
              <DatePicker date={toDate} setDate={setToDate} />
              <TimePicker value={toTime} onChange={setToTime} />
            </div>
          </div>

          <div className="flex justify-end pt-4 gap-x-4">
            <form.Subscribe selector={(state) => state}>
              {(state) => (
                <>
                  <Link
                    type="button"
                    href={"/"}
                    className={cn(buttonVariants({ variant: "outline" }), "rounded-full ml-2", isCreating || state.isSubmitting && "opacity-50")}
                    onClick={() => form.reset()}
                  >
                    Cancel
                  </Link>
                  <Button
                    type="button"
                    className="rounded-full"
                    disabled={!state.canSubmit || isCreating || state.isSubmitting}
                    onClick={() => form.handleSubmit()}
                  >
                    {isCreating || state.isSubmitting ? <Spinner className="mr-2" /> : null}
                    {isCreating || state.isSubmitting ? "Saving..." : "Save"}
                  </Button>
                </>
              )}
            </form.Subscribe>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}