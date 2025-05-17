"use client"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface TimePickerProps {
  value: string
  onChange: (time: string) => void
  className?: string
}

export function TimePicker({ value, onChange, className }: TimePickerProps) {
  // This is a simplified time picker that just uses an input
  // You could expand this with a dropdown for hours/minutes if needed

  return (
    <div className={cn("flex items-end gap-2", className)}>
      <div className="grid gap-1 text-center">
        <Input
          type="time"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none bg-indigo-50"
        />
      </div>
    </div>
  )
}
