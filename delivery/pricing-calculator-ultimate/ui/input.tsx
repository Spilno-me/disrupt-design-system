import * as React from "react"
import { cn } from "../lib/utils"

export interface InputProps extends React.ComponentProps<"input"> {}

/**
 * Input - Text input component
 * Mobile-first with 44px touch target on mobile, 40px on desktop
 */
function Input({ className, type, ...props }: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Base styles - mobile-first
        "flex h-12 md:h-10 w-full min-w-0 rounded-sm border border-default bg-surface px-4 py-3 md:px-3 md:py-2 text-base md:text-sm text-primary font-sans shadow-sm transition-[color,box-shadow] outline-none",
        // Password field styling
        type === "password" && "text-lg tracking-[0.15em]",
        // Placeholder
        "placeholder:text-tertiary placeholder:text-base md:placeholder:text-sm placeholder:tracking-normal",
        // Selection
        "selection:bg-accent-strong selection:text-inverse",
        // File input
        "file:text-primary file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
        // Focus state
        "focus-visible:border-ring focus-visible:ring-ring/40 focus-visible:ring-4",
        // Error state
        "aria-invalid:ring-error/20 aria-invalid:border-error",
        // Disabled state
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted-bg",
        className
      )}
      {...props}
    />
  )
}

Input.displayName = "Input"

export { Input }
