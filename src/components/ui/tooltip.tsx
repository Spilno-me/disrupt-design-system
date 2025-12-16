import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "../../lib/utils"

/**
 * Tooltip - Contextual information popup on hover/focus.
 *
 * @component MOLECULE (compound component with multiple sub-components)
 *
 * @description
 * Tooltips display brief, informative text when users hover over or focus on
 * an element. Built on Radix UI Tooltip for accessibility (keyboard support,
 * screen reader announcements, proper positioning).
 *
 * @example
 * ```tsx
 * // Basic tooltip
 * <Tooltip>
 *   <TooltipTrigger asChild>
 *     <Button>Hover me</Button>
 *   </TooltipTrigger>
 *   <TooltipContent>Helpful information</TooltipContent>
 * </Tooltip>
 *
 * // Tooltip with custom position
 * <Tooltip>
 *   <TooltipTrigger asChild>
 *     <Button>Left tooltip</Button>
 *   </TooltipTrigger>
 *   <TooltipContent side="left">On the left</TooltipContent>
 * </Tooltip>
 *
 * // Multiple tooltips with shared delay
 * <TooltipProvider delayDuration={300}>
 *   <Tooltip>...</Tooltip>
 *   <Tooltip>...</Tooltip>
 * </TooltipProvider>
 * ```
 *
 * @testid
 * Uses `data-slot` attributes for compound component testing:
 * - `data-slot="tooltip"` - Root container
 * - `data-slot="tooltip-trigger"` - Trigger element
 * - `data-slot="tooltip-content"` - Tooltip content panel
 * - `data-slot="tooltip-provider"` - Provider for shared config
 *
 * @example Testing
 * ```tsx
 * // Trigger tooltip
 * fireEvent.mouseEnter(screen.getByRole('button'));
 *
 * // Find tooltip content
 * await screen.findByRole('tooltip');
 *
 * // Find by data-slot
 * container.querySelector('[data-slot="tooltip-content"]');
 * ```
 *
 * @accessibility
 * - Keyboard accessible (focus triggers tooltip)
 * - Screen readers announce tooltip content
 * - Proper ARIA attributes (role="tooltip")
 * - Escape key dismisses tooltip
 *
 * @see TooltipContent - Content container with positioning options
 * @see TooltipTrigger - Element that triggers the tooltip
 * @see TooltipProvider - Shared configuration for multiple tooltips
 */

/** TooltipProvider - Shared configuration for multiple tooltips. */
function TooltipProvider({
  delayDuration = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  )
}
TooltipProvider.displayName = "TooltipProvider"

/** Tooltip - Root component that wraps trigger and content. */
function Tooltip({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root data-slot="tooltip" {...props} />
    </TooltipProvider>
  )
}
Tooltip.displayName = "Tooltip"

/** TooltipTrigger - Element that triggers the tooltip on hover/focus. */
function TooltipTrigger({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
}
TooltipTrigger.displayName = "TooltipTrigger"

/**
 * TooltipContent - Container for tooltip text.
 *
 * @param side - Position relative to trigger: "top" | "right" | "bottom" | "left" (default: "top")
 * @param sideOffset - Distance from trigger in pixels (default: 0)
 */
function TooltipContent({
  className,
  sideOffset = 0,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          // Dark background with light text for high contrast
          "bg-primary text-primary-foreground",
          // Animation
          "animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          // Slide direction based on position
          "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          // Layout and sizing
          "z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance",
          className
        )}
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow className="bg-primary fill-primary z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  )
}
TooltipContent.displayName = "TooltipContent"

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
