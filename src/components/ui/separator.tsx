import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"

import { cn } from "../../lib/utils"
import { ALIAS } from "../../constants/designTokens"

/**
 * Separator component for visual division of content. Built on Radix UI Separator primitive.
 *
 * ATOM: Accepts data-testid via props. Consumer provides context-specific testId.
 *
 * Features:
 * - Horizontal (default) or vertical orientation
 * - Semantic or decorative (for accessibility)
 * - 1px line using teal (DEEP_CURRENT[500] = #08A4BD)
 * - Dashed variant available via .separator-dashed CSS class (same teal, used on website)
 *
 * @example
 * ```tsx
 * // Horizontal separator (default) - teal solid line
 * <Separator />
 *
 * // Vertical separator
 * <Separator orientation="vertical" />
 *
 * // Dashed separator (website style) - same teal, dashed pattern
 * <div className="separator-dashed" />
 *
 * // With data-testid (consumer provides context)
 * <Separator data-testid="section-divider" />
 *
 * // Semantic separator (announced to screen readers)
 * <Separator decorative={false} />
 * ```
 */
function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        className
      )}
      style={{ backgroundColor: ALIAS.border.accent }}
      {...props}
    />
  )
}

Separator.displayName = "Separator"

export { Separator }
