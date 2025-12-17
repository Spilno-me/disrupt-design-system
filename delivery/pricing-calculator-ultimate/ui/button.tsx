import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../lib/utils"

/**
 * Button - Standalone button component with DDS variants
 * Includes custom 'accent' variant for teal brand color
 */

const buttonVariants = cva(
  "flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium font-sans transition-all cursor-pointer disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-[3px] focus-visible:ring-accent/30 focus-visible:border-accent",
  {
    variants: {
      variant: {
        // Primary - Dark background
        default:
          "bg-inverse-bg text-inverse shadow-sm hover:bg-inverse-bg/90",
        // Destructive - Error/danger state
        destructive:
          "bg-error text-inverse shadow-sm hover:bg-error/90 focus-visible:ring-error/30",
        // Outline - Bordered variant
        outline:
          "border border-default bg-surface text-primary shadow-sm hover:bg-page",
        // Secondary - Light background
        secondary:
          "bg-muted-bg text-secondary shadow-sm hover:bg-muted-bg/80",
        // Ghost - Transparent until hover
        ghost:
          "text-primary hover:bg-page",
        // Link - Text only
        link: "text-accent underline-offset-4 hover:underline",
        // Accent - Teal/brand secondary (DDS custom variant)
        accent:
          "bg-accent-strong text-inverse shadow-sm hover:bg-accent-strong/90",
      },
      size: {
        default: "h-12 md:h-10 px-6 py-3 md:py-2 has-[>svg]:px-4",
        sm: "h-11 md:h-9 px-4 py-2 has-[>svg]:px-3",
        lg: "h-14 md:h-12 px-8 py-3 has-[>svg]:px-6",
        icon: "size-12 md:size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface ButtonProps extends React.ComponentProps<"button">, VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
