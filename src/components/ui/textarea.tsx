import * as React from "react"

import { cn } from "../../lib/utils"

export interface TextareaProps extends React.ComponentProps<"textarea"> {}

/**
 * Textarea component for multi-line text entry.
 *
 * ATOM: Accepts data-testid via props. Consumer provides context-specific testId.
 *
 * Features:
 * - Auto-sizing (field-sizing-content)
 * - Mobile-friendly (larger text on mobile)
 * - Full accessibility support (aria-invalid, focus-visible, disabled)
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Textarea placeholder="Enter description" />
 *
 * // With data-testid (consumer provides context)
 * <Textarea
 *   data-testid="lead-notes-textarea"
 *   placeholder="Add notes"
 * />
 *
 * // With label
 * <Label htmlFor="description">Description</Label>
 * <Textarea
 *   id="description"
 *   data-testid="profile-description-textarea"
 * />
 * ```
 */
function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        // Base styles - inputs use darker bg (muted-bg) as they represent "holes" per depth rule
        "flex field-sizing-content min-h-textarea w-full rounded-sm border border-default bg-muted-bg px-3 py-3 text-base text-primary font-sans shadow-inner transition-[color,box-shadow] outline-none md:text-sm",
        // Placeholder
        "placeholder:text-tertiary",
        // Focus state - uses design token (now dark blue for high contrast)
        "focus-visible:border-ring focus-visible:ring-ring/40 focus-visible:ring-4",
        // Error state
        "aria-invalid:ring-error/20 aria-invalid:border-error",
        // Disabled state
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

Textarea.displayName = "Textarea"

export { Textarea }
