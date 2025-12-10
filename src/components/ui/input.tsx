import * as React from "react"

import { cn } from "../../lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Base styles
        "flex h-input w-full min-w-0 rounded-sm border border-default bg-surface px-3 py-2 text-base text-primary font-sans shadow-sm transition-[color,box-shadow] outline-none md:text-sm",
        // Placeholder
        "placeholder:text-muted",
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
