import * as React from "react"

import { cn } from "../../lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Base styles - mobile-first with 44px min height (touch standard), desktop 40px
        "flex h-12 md:h-10 w-full min-w-0 rounded-sm border border-default bg-surface px-4 py-3 md:px-3 md:py-2 text-base md:text-sm text-primary font-sans shadow-sm transition-[color,box-shadow] outline-none",
        // Password field styling - larger text and wider letter spacing for better readability
        type === "password" && "text-lg tracking-[0.15em]",
        // Placeholder - 16px minimum on mobile to prevent iOS zoom
        "placeholder:text-tertiary placeholder:text-base md:placeholder:text-sm placeholder:tracking-normal",
        // Selection
        "selection:bg-accent-strong selection:text-inverse",
        // File input
        "file:text-primary file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
        // Focus state - accent
        "focus-visible:border-accent focus-visible:ring-accent/20 focus-visible:ring-[3px]",
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

export { Input }
