import * as React from "react"

import { cn } from "../../lib/utils"
import { COLORS } from "../../constants/designTokens"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-dark-300 selection:bg-primary selection:text-primary-foreground flex h-input w-full min-w-0 rounded-sm border bg-white px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-accent focus-visible:ring-accent/20 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      style={{
        borderColor: COLORS.slate
      }}
      {...props}
    />
  )
}

export { Input }
