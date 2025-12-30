"use client"

import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"

import { cn } from "../../lib/utils"

export interface SwitchProps extends React.ComponentProps<typeof SwitchPrimitive.Root> {}

/**
 * Switch component for binary toggle states. Built on Radix UI Switch primitive.
 *
 * ATOM: Accepts data-testid via props. Consumer provides context-specific testId.
 *
 * Features:
 * - Radix UI primitive (keyboard navigation, accessibility)
 * - Smooth sliding animation
 * - Visual feedback for checked/unchecked states
 * - Focus visible states
 * - Disabled state handling
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Switch />
 * <Switch defaultChecked />
 *
 * // Controlled
 * const [enabled, setEnabled] = useState(false)
 * <Switch checked={enabled} onCheckedChange={setEnabled} />
 *
 * // With label
 * <div className="flex items-center gap-2">
 *   <Switch id="notifications" />
 *   <Label htmlFor="notifications">Enable notifications</Label>
 * </div>
 *
 * // With data-testid (consumer provides context)
 * <Switch
 *   id="dark-mode"
 *   data-testid="dark-mode-switch"
 * />
 *
 * // Disabled state
 * <Switch disabled />
 * ```
 */
function Switch({
  className,
  ...props
}: SwitchProps) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        // Base styles - pill shape track
        "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors",
        // Unchecked state - muted background
        "bg-muted",
        // Checked state - accent fill
        "data-[state=checked]:bg-accent-strong",
        // Focus state - uses design token
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
        // Disabled state
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          // Thumb - circular knob that slides
          "pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform",
          // Position based on state
          "data-[state=unchecked]:translate-x-0",
          "data-[state=checked]:translate-x-4"
        )}
      />
    </SwitchPrimitive.Root>
  )
}

Switch.displayName = "Switch"

export { Switch }
