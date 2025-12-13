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
        // Base styles
        "flex field-sizing-content min-h-textarea w-full rounded-sm border border-default bg-surface px-3 py-3 text-base text-primary font-sans shadow-sm transition-[color,box-shadow] outline-none md:text-sm",
        // Placeholder
        "placeholder:text-tertiary",
        // Focus state - accent
        "focus-visible:border-accent focus-visible:ring-accent/20 focus-visible:ring-[3px]",
        // Error state
        "aria-invalid:ring-error/20 aria-invalid:border-error",
        // Disabled state
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted-bg",
        className
      )}
      {...props}
    />
  )
}

Textarea.displayName = "Textarea"

export { Textarea }
