import { cn } from "@/lib/utils"
import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"
import { Button } from "./button"
import { format } from "date-fns"
import { Calendar } from "./calendar"

interface DatePickerProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
}

function DatePicker({ date, setDate }: DatePickerProps) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className={cn("justify-start text-left font-normal px-3 py-1", !date && "text-muted-foreground")}
        >
          {date ? format(date, "EEE, dd MMM") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(date) => {
            setDate(date)
            setOpen(false)
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}

export { DatePicker }