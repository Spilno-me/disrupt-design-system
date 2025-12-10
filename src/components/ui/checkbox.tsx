"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { CheckIcon } from "lucide-react"

import { cn } from "../../lib/utils"

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        // Base styles
        "peer size-4 shrink-0 rounded-xs border border-default bg-surface shadow-sm transition-shadow outline-none",
        // Checked state - uses brand primary
        "data-[state=checked]:bg-inverse-bg data-[state=checked]:text-inverse data-[state=checked]:border-inverse-bg",
        // Focus state - accent ring
        "focus-visible:border-accent focus-visible:ring-[3px] focus-visible:ring-accent/30",
        // Error state
        "aria-invalid:ring-error/20 aria-invalid:border-error",
        // Disabled state
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current transition-none"
      >
        <CheckIcon className="size-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
