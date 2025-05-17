"use client"

import { useMemo } from "react"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

type EventData = {
  year: string
  month: string
  count: number
}


export default function EventChart({ data }: { data: EventData[] }) {
  // Format data for the chart and calculate total
  const { formattedData, totalEvents } = useMemo(() => {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]

    const formatted = data.map((item) => ({
      name: `${monthNames[Number.parseInt(item.month) - 1]} ${item.year}`,
      count: item.count,
      month: item.month,
      year: item.year,
    }))

    const total = data.reduce((sum, item) => sum + item.count, 0)

    return { formattedData: formatted, totalEvents: total }
  }, [data])

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="col-span-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Monthly Event Distribution</CardTitle>
              <CardDescription>Number of events per month</CardDescription>
            </div>
            <div className="bg-muted px-3 py-1 rounded-md">
              <span className="text-sm font-medium">Total Events: </span>
              <span className="text-lg font-bold">{totalEvents}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ChartContainer
            className="h-full"
              config={{
                events: {
                  label: "Events",
                  color: "var(--accent)",
                },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={formattedData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" name="Events" fill="var(--color-events)" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
