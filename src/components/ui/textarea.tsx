import * as React from "react"

import { cn } from "../../lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        // Base styles
        "flex field-sizing-content min-h-textarea w-full rounded-sm border border-slate bg-white px-3 py-3 text-base text-dark font-sans shadow-sm transition-[color,box-shadow] outline-none md:text-sm",
        // Placeholder
        "placeholder:text-muted",
        // Focus state - teal accent
        "focus-visible:border-teal focus-visible:ring-teal/20 focus-visible:ring-[3px]",
        // Error state
        "aria-invalid:ring-error/20 aria-invalid:border-error",
        // Disabled state
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-lightPurple",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
