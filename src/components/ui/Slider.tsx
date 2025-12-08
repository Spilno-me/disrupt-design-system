import * as React from "react"
import { cn } from "../../lib/utils"
import { COLORS } from "../../constants/designTokens"

// =============================================================================
// TYPES
// =============================================================================

export interface SliderProps extends Omit<React.ComponentProps<"div">, "onChange"> {
  /** Current value */
  value: number
  /** Minimum value */
  min: number
  /** Maximum value */
  max: number
  /** Step increment */
  step?: number
  /** Label text */
  label?: string
  /** Unit text displayed after value (e.g., "Workers", "Tasks/Day") */
  unit?: string
  /** Callback when value changes */
  onChange?: (value: number) => void
  /** Track fill color (defaults to circleRed) */
  fillColor?: string
  /** Thumb border color (defaults to fillColor) */
  thumbColor?: string
  /** Show value display */
  showValue?: boolean
  /** Disabled state */
  disabled?: boolean
}

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * Slider - A customizable range slider with filled track and styled thumb.
 * Used in ROI calculators and other interactive components.
 */
export function Slider({
  value,
  min,
  max,
  step = 1,
  label,
  unit,
  onChange,
  fillColor = COLORS.circleRed,
  thumbColor,
  showValue = true,
  disabled = false,
  className,
  ...props
}: SliderProps) {
  const percentage = ((value - min) / (max - min)) * 100
  const actualThumbColor = thumbColor || fillColor

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!disabled && onChange) {
      onChange(Number(e.target.value))
    }
  }

  return (
    <div
      className={cn("flex flex-col gap-4", disabled && "opacity-50", className)}
      {...props}
    >
      {/* Label and Value */}
      {(label || showValue) && (
        <div className="flex justify-between items-center">
          {label && (
            <span className="font-sans font-semibold text-base text-dark tracking-tight">
              {label}
            </span>
          )}
          {showValue && (
            <span className="font-sans font-bold text-base text-dark tracking-tight">
              {value} {unit}
            </span>
          )}
        </div>
      )}

      {/* Slider Track */}
      <div className="relative h-4">
        {/* Track Background */}
        <div className="absolute inset-0 bg-slate-100 rounded-full" />

        {/* Track Fill */}
        <div
          className="absolute left-0 top-0 h-full rounded-full transition-all duration-150"
          style={{
            width: `${percentage}%`,
            backgroundColor: fillColor,
          }}
        />

        {/* Hidden Range Input */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />

        {/* Thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full shadow-md border-2 pointer-events-none transition-all duration-150"
          style={{
            left: `calc(${percentage}% - 10px)`,
            borderColor: actualThumbColor,
          }}
        />
      </div>
    </div>
  )
}
