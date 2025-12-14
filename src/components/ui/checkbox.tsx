"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { CheckIcon } from "lucide-react"

import { cn } from "../../lib/utils"

export interface CheckboxProps extends React.ComponentProps<typeof CheckboxPrimitive.Root> {}

/**
 * Checkbox component for selections and toggles. Built on Radix UI Checkbox primitive.
 *
 * ATOM: Accepts data-testid via props. Consumer provides context-specific testId.
 *
 * Features:
 * - Radix UI primitive (keyboard navigation, accessibility)
 * - Checked state indicator
 * - Error state support (aria-invalid)
 * - Focus visible states
 * - Disabled state handling
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Checkbox />
 * <Checkbox defaultChecked />
 *
 * // With label
 * <div className="flex items-center gap-2">
 *   <Checkbox id="terms" />
 *   <Label htmlFor="terms">Accept terms</Label>
 * </div>
 *
 * // With data-testid (consumer provides context)
 * <Checkbox
 *   id="terms"
 *   data-testid="terms-checkbox"
 * />
 * <Label htmlFor="terms" data-testid="terms-label">
 *   I agree to the terms
 * </Label>
 *
 * // Error state
 * <Checkbox
 *   aria-invalid="true"
 *   data-testid="required-checkbox"
 * />
 * ```
 */
function Checkbox({
  className,
  ...props
}: CheckboxProps) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        // Base styles
        "peer size-4 shrink-0 rounded-xs border border-default bg-surface shadow-sm transition-shadow outline-none",
        // Checked state - uses brand primary
        "data-[state=checked]:bg-inverse-bg data-[state=checked]:text-inverse data-[state=checked]:border-inverse-bg",
        // Focus state - uses design token (now dark blue for high contrast)
        "focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/40",
        // Error state
        "aria-invalid:ring-error/20 aria-invalid:border-error",
        // Disabled state
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current transition-none"
      >
        <CheckIcon className="size-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

Checkbox.displayName = "Checkbox"

export { Checkbox }
