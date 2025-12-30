/**
 * UndoToast - Transient notification with undo action
 *
 * Shows a toast at the bottom of the screen with a countdown timer
 * and an Undo button. Used for destructive actions like delete.
 *
 * @example
 * ```tsx
 * <UndoToast
 *   message="Entry deleted"
 *   onUndo={handleUndo}
 *   onComplete={handleConfirmDelete}
 *   duration={5000}
 * />
 * ```
 */

import * as React from 'react'
import { Undo2, X } from 'lucide-react'
import { cn } from '../../../lib/utils'
import { Button } from '../../../components/ui/button'

// =============================================================================
// TYPES
// =============================================================================

interface UndoToastProps {
  /** Message to display in the toast */
  message: string
  /** Called when user clicks Undo - should restore the item */
  onUndo: () => void
  /** Called when countdown completes - should execute the action */
  onComplete: () => void
  /** Called when toast is dismissed (X button) - same as onComplete */
  onDismiss?: () => void
  /** Duration in milliseconds before auto-completing (default: 5000) */
  duration?: number
  className?: string
}

// =============================================================================
// COMPONENT
// =============================================================================

export function UndoToast({
  message,
  onUndo,
  onComplete,
  onDismiss,
  duration = 5000,
  className,
}: UndoToastProps) {
  const [timeLeft, setTimeLeft] = React.useState(duration)
  const [isPaused, setIsPaused] = React.useState(false)

  // Countdown timer
  React.useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 100
        if (next <= 0) {
          clearInterval(interval)
          return 0
        }
        return next
      })
    }, 100)

    return () => clearInterval(interval)
  }, [isPaused])

  // Execute on complete
  React.useEffect(() => {
    if (timeLeft <= 0) {
      onComplete()
    }
  }, [timeLeft, onComplete])

  const handleUndo = React.useCallback(() => {
    setIsPaused(true)
    onUndo()
  }, [onUndo])

  const handleDismiss = React.useCallback(() => {
    setIsPaused(true)
    if (onDismiss) {
      onDismiss()
    } else {
      onComplete()
    }
  }, [onDismiss, onComplete])

  // Progress percentage (inverted - shows how much time is left)
  const progress = (timeLeft / duration) * 100
  const secondsLeft = Math.ceil(timeLeft / 1000)

  return (
    <div
      data-slot="undo-toast"
      role="alert"
      aria-live="polite"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={cn(
        'fixed bottom-6 left-1/2 -translate-x-1/2 z-50',
        'flex items-center gap-3 rounded-lg border border-default bg-inverse text-inverse-primary',
        'px-4 py-3 shadow-xl',
        'animate-in slide-in-from-bottom-4 fade-in duration-300',
        className
      )}
    >
      {/* Progress bar background */}
      <div
        className="absolute bottom-0 left-0 h-1 bg-accent/30 rounded-b-lg transition-all duration-100"
        style={{ width: `${progress}%` }}
      />
      {/* Active progress bar */}
      <div
        className="absolute bottom-0 left-0 h-1 bg-accent rounded-b-lg transition-all duration-100"
        style={{ width: `${progress}%`, opacity: isPaused ? 0.5 : 1 }}
      />

      {/* Message */}
      <span className="text-sm font-medium">{message}</span>

      {/* Countdown */}
      <span className="text-xs text-inverse-secondary tabular-nums min-w-[24px]">
        {secondsLeft}s
      </span>

      {/* Undo Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleUndo}
        className="gap-1.5 text-accent hover:text-accent hover:bg-accent/20 -mr-1"
      >
        <Undo2 className="size-4" />
        Undo
      </Button>

      {/* Dismiss Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={handleDismiss}
        className="size-6 text-inverse-secondary hover:text-inverse-primary hover:bg-white/10 -mr-2"
        aria-label="Dismiss"
      >
        <X className="size-4" />
      </Button>
    </div>
  )
}

UndoToast.displayName = 'UndoToast'

export default UndoToast
