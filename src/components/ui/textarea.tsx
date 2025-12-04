import * as React from "react"

import { cn } from "@/lib/utils"
import { COLORS } from "@/constants/designTokens"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "placeholder:text-dark-300 focus-visible:border-accent focus-visible:ring-accent/20 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex field-sizing-content min-h-textarea w-full rounded-sm border bg-white px-3 py-3 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      style={{
        borderColor: COLORS.slate
      }}
      {...props}
    />
  )
}

export { Textarea }
