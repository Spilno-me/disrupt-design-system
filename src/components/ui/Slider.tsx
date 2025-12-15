import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cn } from "../../lib/utils"
import { ALIAS } from "../../constants/designTokens"

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
  /** Show value display */
  showValue?: boolean
  /** Disabled state */
  disabled?: boolean
}

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * Slider - A customizable range slider built on Radix UI primitives.
 * Used in ROI calculators and other interactive components.
 * Responsive: larger touch targets on mobile, standard size on desktop.
 */
export function Slider({
  value,
  min,
  max,
  step = 1,
  label,
  unit,
  onChange,
  showValue = true,
  disabled = false,
  className,
  ...props
}: SliderProps) {
  const handleValueChange = (values: number[]) => {
    if (!disabled && onChange) {
      onChange(values[0])
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
            <span className="font-sans font-semibold text-base text-primary tracking-tight">
              {label}
            </span>
          )}
          {showValue && (
            <span className="font-sans font-bold text-base text-primary tracking-tight">
              {value} {unit}
            </span>
          )}
        </div>
      )}

      {/* Radix Slider - custom implementation for precise thumb/range alignment */}
      <div className="relative w-full h-8 lg:h-5 flex items-center">
        {/* Track background */}
        <div className="absolute inset-x-4 lg:inset-x-2.5 h-6 lg:h-4 rounded-full bg-surface-hover" />

        {/* Track fill (Range) */}
        <div
          className="absolute left-4 lg:left-2.5 h-6 lg:h-4 rounded-l-full"
          style={{
            backgroundColor: ALIAS.background.accentStrong,
            width: `calc(${((value - min) / (max - min)) * 100}% - ${((value - min) / (max - min)) * 16}px)`,
          }}
        />

        {/* Hidden Radix slider for interaction */}
        <SliderPrimitive.Root
          className="absolute inset-0 flex items-center select-none touch-none w-full"
          value={[value]}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          onValueChange={handleValueChange}
        >
          <SliderPrimitive.Track className="relative grow h-full">
            <SliderPrimitive.Range className="absolute h-full" />
          </SliderPrimitive.Track>
          <SliderPrimitive.Thumb
            className={cn(
              "block rounded-full shadow-md border-2",
              "w-8 h-8 lg:w-5 lg:h-5",
              "cursor-grab active:cursor-grabbing",
              "focus:outline-none focus-visible:ring-4 focus-visible:ring-ring/40",
              "bg-surface"
            )}
            style={{
              borderColor: ALIAS.border.accentDark,
            }}
            aria-label={label}
          />
        </SliderPrimitive.Root>
      </div>
    </div>
  )
}
