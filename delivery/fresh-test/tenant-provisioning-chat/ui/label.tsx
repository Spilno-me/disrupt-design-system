import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"

import { cn } from "../lib/utils"

export interface LabelProps extends React.ComponentProps<typeof LabelPrimitive.Root> {}

/**
 * Label component for form inputs. Built on Radix UI Label primitive.
 *
 * ATOM: Accepts data-testid via props. Consumer provides context-specific testId.
 *
 * Features:
 * - Automatic accessibility (associates with input via htmlFor)
 * - Peer-based disabled state handling
 * - Group-based disabled state handling
 * - Proper cursor states
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Label htmlFor="email">Email</Label>
 * <Input id="email" type="email" />
 *
 * // With data-testid (consumer provides context)
 * <Label htmlFor="email" data-testid="login-email-label">
 *   Email Address
 * </Label>
 * <Input id="email" data-testid="login-email-input" />
 *
 * // Required field
 * <Label htmlFor="password">
 *   Password <span className="text-error">*</span>
 * </Label>
 * ```
 */
function Label({
  className,
  ...props
}: LabelProps) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

Label.displayName = "Label"

export { Label }
