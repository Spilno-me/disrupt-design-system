import * as React from 'react'
import { Minus, Plus } from 'lucide-react'
import { cn } from '../../lib/utils'

// =============================================================================
// TYPES
// =============================================================================

export interface NumberStepperProps {
  /** Current value */
  value: number
  /** Callback when value changes */
  onChange: (value: number) => void
  /** Minimum value (default: 0) */
  min?: number
  /** Maximum value (default: 9999) */
  max?: number
  /** Step increment (default: 1) */
  step?: number
  /** Disable all interactions */
  disabled?: boolean
  /** Additional className for the container */
  className?: string
  /** Accessible label for the input */
  'aria-label'?: string
  /** ID for form association */
  id?: string
}

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * NumberStepper - Accessible number input with +/- buttons
 *
 * ATOM: Reusable quantity input for pricing, inventory, etc.
 *
 * Features:
 * - Large touch targets (44px mobile, 40px desktop)
 * - Direct keyboard entry in center input
 * - Hold +/- for rapid increment (250ms intervals)
 * - Min/max constraints with visual feedback
 * - Full accessibility support
 *
 * @example
 * ```tsx
 * <NumberStepper
 *   value={quantity}
 *   onChange={setQuantity}
 *   min={0}
 *   max={100}
 *   aria-label="Viewer licenses"
 * />
 * ```
 */
export function NumberStepper({
  value,
  onChange,
  min = 0,
  max = 9999,
  step = 1,
  disabled = false,
  className,
  'aria-label': ariaLabel,
  id,
}: NumberStepperProps) {
  const [inputValue, setInputValue] = React.useState(String(value))
  const intervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null)

  // Sync input value when external value changes
  React.useEffect(() => {
    setInputValue(String(value))
  }, [value])

  const clamp = (val: number) => Math.min(max, Math.max(min, val))

  const handleDecrement = () => {
    if (disabled) return
    const newValue = clamp(value - step)
    onChange(newValue)
  }

  const handleIncrement = () => {
    if (disabled) return
    const newValue = clamp(value + step)
    onChange(newValue)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    // Allow empty string for editing
    if (raw === '' || /^\d*$/.test(raw)) {
      setInputValue(raw)
      const parsed = parseInt(raw, 10)
      if (!isNaN(parsed)) {
        onChange(clamp(parsed))
      }
    }
  }

  const handleInputBlur = () => {
    // Reset to current value on blur if empty or invalid
    const parsed = parseInt(inputValue, 10)
    if (isNaN(parsed)) {
      setInputValue(String(value))
    } else {
      const clamped = clamp(parsed)
      onChange(clamped)
      setInputValue(String(clamped))
    }
  }

  // Hold-to-repeat for +/- buttons
  const startRepeat = (action: () => void) => {
    action() // Immediate first action
    intervalRef.current = setInterval(action, 150)
  }

  const stopRepeat = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  // Cleanup on unmount
  React.useEffect(() => {
    return () => stopRepeat()
  }, [])

  const atMin = value <= min
  const atMax = value >= max

  return (
    <div
      className={cn(
        // Glass-compatible container - transparent with subtle border
        'inline-flex items-center gap-0.5 rounded-lg',
        'bg-white/50 dark:bg-black/30 backdrop-blur-sm',
        'border border-default/50',
        disabled && 'opacity-50',
        className
      )}
      data-slot="number-stepper"
    >
      {/* Decrement Button */}
      {/* Note: onClick removed - onMouseDown/onTouchStart handle immediate action via startRepeat */}
      <button
        type="button"
        onMouseDown={() => startRepeat(handleDecrement)}
        onMouseUp={stopRepeat}
        onMouseLeave={stopRepeat}
        onTouchStart={() => startRepeat(handleDecrement)}
        onTouchEnd={stopRepeat}
        disabled={disabled || atMin}
        className={cn(
          // Base - large touch target
          'flex h-10 w-10 md:h-9 md:w-9 items-center justify-center rounded-l-md',
          'transition-all duration-150',
          // Enabled state - glass-compatible
          !atMin && !disabled
            ? 'hover:bg-white/60 dark:hover:bg-white/10 active:bg-white/80 text-primary'
            : 'text-muted cursor-not-allowed',
          // Focus
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset'
        )}
        aria-label="Decrease"
      >
        <Minus className="h-4 w-4" aria-hidden="true" />
      </button>

      {/* Center Input */}
      <input
        id={id}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        disabled={disabled}
        aria-label={ariaLabel}
        className={cn(
          // Base
          'w-16 h-10 md:h-9 text-center text-lg font-semibold',
          'bg-transparent border-0 outline-none',
          'text-primary',
          // Focus
          'focus-visible:bg-white/50 dark:focus-visible:bg-black/30 rounded-md',
          // Disabled
          'disabled:cursor-not-allowed'
        )}
      />

      {/* Increment Button */}
      {/* Note: onClick removed - onMouseDown/onTouchStart handle immediate action via startRepeat */}
      <button
        type="button"
        onMouseDown={() => startRepeat(handleIncrement)}
        onMouseUp={stopRepeat}
        onMouseLeave={stopRepeat}
        onTouchStart={() => startRepeat(handleIncrement)}
        onTouchEnd={stopRepeat}
        disabled={disabled || atMax}
        className={cn(
          // Base - large touch target
          'flex h-10 w-10 md:h-9 md:w-9 items-center justify-center rounded-r-md',
          'transition-all duration-150',
          // Enabled state - glass-compatible
          !atMax && !disabled
            ? 'hover:bg-white/60 dark:hover:bg-white/10 active:bg-white/80 text-primary'
            : 'text-muted cursor-not-allowed',
          // Focus
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset'
        )}
        aria-label="Increase"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  )
}

NumberStepper.displayName = 'NumberStepper'
