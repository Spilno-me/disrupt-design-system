import * as React from "react"

import { cn } from "../../lib/utils"

export interface InputProps extends React.ComponentProps<"input"> {}

/**
 * Input component for text entry, password, email, and other input types.
 *
 * ATOM: Accepts data-testid via props. Consumer provides context-specific testId.
 *
 * Features:
 * - Mobile-first responsive (44px touch target on mobile, 40px desktop)
 * - Password field optimization (larger text, wider spacing for readability)
 * - iOS-optimized (16px placeholder prevents zoom)
 * - File input styling
 * - Full accessibility support (aria-invalid, focus-visible, disabled)
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Input type="text" placeholder="Enter name" />
 * <Input type="email" placeholder="Email" />
 * <Input type="password" placeholder="Password" />
 *
 * // With data-testid (consumer provides context)
 * <Input
 *   type="email"
 *   data-testid="login-email-input"
 *   placeholder="Email"
 * />
 * <Input
 *   type="password"
 *   data-testid="login-password-input"
 * />
 *
 * // In forms with labels
 * <Label htmlFor="email">Email</Label>
 * <Input
 *   id="email"
 *   type="email"
 *   data-testid="profile-email-input"
 * />
 *
 * // Error state
 * <Input
 *   type="email"
 *   aria-invalid="true"
 *   data-testid="email-input"
 * />
 * ```
 */
function Input({ className, type, ...props }: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Base styles - mobile-first with 44px min height (touch standard), desktop 40px
        // Inputs use darker bg (muted-bg) as they represent "holes" - recessed areas per depth rule
        "flex h-12 md:h-10 w-full min-w-0 rounded-sm border border-default bg-muted-bg px-4 py-3 md:px-3 md:py-2 text-base md:text-sm text-primary font-sans shadow-inner transition-[color,box-shadow] outline-none",
        // Password field styling - larger text and wider letter spacing for better readability
        type === "password" && "text-lg tracking-[0.15em]",
        // Placeholder - 16px minimum on mobile to prevent iOS zoom
        "placeholder:text-tertiary placeholder:text-base md:placeholder:text-sm placeholder:tracking-normal",
        // Selection
        "selection:bg-accent-strong selection:text-inverse",
        // File input
        "file:text-primary file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
        // Focus state - uses design token (now dark blue for high contrast)
        "focus-visible:border-ring focus-visible:ring-ring/40 focus-visible:ring-4",
        // Error state
        "aria-invalid:ring-error/20 aria-invalid:border-error",
        // Disabled state
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

Input.displayName = "Input"

export { Input }
