import * as React from "react"

import { cn } from "../../lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        // Base styles
        "flex field-sizing-content min-h-textarea w-full rounded-sm border border-default bg-surface px-3 py-3 text-base text-primary font-sans shadow-sm transition-[color,box-shadow] outline-none md:text-sm",
        // Placeholder
        "placeholder:text-muted",
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

export { Textarea }
