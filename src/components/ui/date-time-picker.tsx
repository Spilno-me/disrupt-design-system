import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon, Clock } from "lucide-react"

import { cn } from "../../lib/utils"
import { Button } from "./button"
import { Calendar } from "./calendar"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"

// =============================================================================
// TIME INPUT COMPONENT
// =============================================================================

interface TimeInputProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

function TimeInput({ value, onChange, disabled }: TimeInputProps) {
  const [hours, minutes] = value.split(":").map(s => s.padStart(2, "0"))
  const hourRef = React.useRef<HTMLInputElement>(null)
  const minuteRef = React.useRef<HTMLInputElement>(null)

  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newHour = e.target.value.replace(/\D/g, "").slice(-2)
    const numHour = parseInt(newHour, 10)

    if (numHour > 23) newHour = "23"
    if (newHour.length === 2) {
      minuteRef.current?.focus()
      minuteRef.current?.select()
    }

    onChange(`${newHour.padStart(2, "0")}:${minutes}`)
  }

  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newMinute = e.target.value.replace(/\D/g, "").slice(-2)
    const numMinute = parseInt(newMinute, 10)

    if (numMinute > 59) newMinute = "59"

    onChange(`${hours}:${newMinute.padStart(2, "0")}`)
  }

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    type: "hour" | "minute"
  ) => {
    const target = e.currentTarget
    const currentValue = parseInt(target.value, 10) || 0

    if (e.key === "ArrowUp") {
      e.preventDefault()
      if (type === "hour") {
        const newHour = currentValue >= 23 ? 0 : currentValue + 1
        onChange(`${String(newHour).padStart(2, "0")}:${minutes}`)
      } else {
        const newMinute = currentValue >= 59 ? 0 : currentValue + 1
        onChange(`${hours}:${String(newMinute).padStart(2, "0")}`)
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      if (type === "hour") {
        const newHour = currentValue <= 0 ? 23 : currentValue - 1
        onChange(`${String(newHour).padStart(2, "0")}:${minutes}`)
      } else {
        const newMinute = currentValue <= 0 ? 59 : currentValue - 1
        onChange(`${hours}:${String(newMinute).padStart(2, "0")}`)
      }
    } else if (e.key === "ArrowRight" && type === "hour") {
      if (target.selectionStart === target.value.length) {
        e.preventDefault()
        minuteRef.current?.focus()
        minuteRef.current?.select()
      }
    } else if (e.key === "ArrowLeft" && type === "minute") {
      if (target.selectionStart === 0) {
        e.preventDefault()
        hourRef.current?.focus()
        hourRef.current?.select()
      }
    } else if (e.key === "Backspace" && type === "minute" && target.value === "00") {
      e.preventDefault()
      hourRef.current?.focus()
      hourRef.current?.select()
    }
  }

  const inputClasses = cn(
    "w-8 text-center bg-transparent text-sm font-medium",
    "text-[var(--color-primary)]", // Force color via CSS variable (ABYSS[900])
    "focus:outline-none focus:bg-accent/10 rounded",
    "selection:bg-accent selection:text-on-status",
    disabled && "opacity-50 cursor-not-allowed"
  )

  return (
    <div className="flex items-center gap-2 rounded-lg border border-default bg-surface px-3 py-2">
      <Clock className="h-4 w-4 text-muted shrink-0" />
      <div className="flex items-center">
        <input
          ref={hourRef}
          type="text"
          inputMode="numeric"
          value={hours}
          onChange={handleHourChange}
          onKeyDown={(e) => handleKeyDown(e, "hour")}
          onFocus={(e) => e.target.select()}
          disabled={disabled}
          className={inputClasses}
          maxLength={2}
          aria-label="Hours"
        />
        <span className="text-muted font-medium">:</span>
        <input
          ref={minuteRef}
          type="text"
          inputMode="numeric"
          value={minutes}
          onChange={handleMinuteChange}
          onKeyDown={(e) => handleKeyDown(e, "minute")}
          onFocus={(e) => e.target.select()}
          disabled={disabled}
          className={inputClasses}
          maxLength={2}
          aria-label="Minutes"
        />
      </div>
    </div>
  )
}

// =============================================================================
// DATE TIME PICKER
// =============================================================================

export interface DateTimePickerProps {
  /** Selected date value */
  value?: Date
  /** Callback when date changes */
  onChange?: (date: Date | undefined) => void
  /** Placeholder text */
  placeholder?: string
  /** Disable the picker */
  disabled?: boolean
  /** Show time picker */
  showTime?: boolean
  /** Additional className */
  className?: string
  /** Error state */
  error?: boolean
}

export function DateTimePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  disabled = false,
  showTime = true,
  className,
  error = false,
}: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [time, setTime] = React.useState(() => {
    if (value) {
      return format(value, "HH:mm")
    }
    return "09:00"
  })

  // Sync time state when value changes externally
  React.useEffect(() => {
    if (value) {
      setTime(format(value, "HH:mm"))
    }
  }, [value])

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const [hours, minutes] = time.split(":").map(Number)
      date.setHours(hours, minutes, 0, 0)
      onChange?.(date)
    } else {
      onChange?.(undefined)
    }
  }

  const handleTimeChange = (newTime: string) => {
    setTime(newTime)

    if (value && newTime) {
      const [hours, minutes] = newTime.split(":").map(Number)
      const newDate = new Date(value)
      newDate.setHours(hours, minutes, 0, 0)
      onChange?.(newDate)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted",
            error && "border-error",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? (
            showTime ? format(value, "PPP 'at' HH:mm") : format(value, "PPP")
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={handleDateSelect}
          initialFocus
        />
        {showTime && (
          <div className="border-t border-default p-3">
            <TimeInput
              value={time}
              onChange={handleTimeChange}
              disabled={disabled}
            />
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}

export default DateTimePicker
