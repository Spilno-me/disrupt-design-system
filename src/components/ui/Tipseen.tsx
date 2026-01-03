"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { X } from "lucide-react"
import { cn } from "../../lib/utils"
import { Button } from "./button"

// =============================================================================
// TYPES
// =============================================================================

export type TipseenPosition = "top" | "right" | "bottom" | "left"
export type TipseenColor = "primary" | "inverted"

export interface TipseenProps {
  /** Content displayed inside the Tipseen */
  content: React.ReactNode
  /** Optional title/heading */
  title?: string
  /** Position relative to trigger */
  position?: TipseenPosition
  /** Color theme */
  color?: TipseenColor
  /** Distance from trigger in pixels */
  offset?: number
  /** Whether the Tipseen is visible (controlled mode) */
  open?: boolean
  /** Default open state (uncontrolled mode) */
  defaultOpen?: boolean
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void
  /** Hide the close button */
  hideCloseButton?: boolean
  /** Custom width */
  width?: number | string
  /** Primary action button */
  primaryAction?: {
    label: string
    onClick: () => void
  }
  /** Secondary/dismiss action */
  secondaryAction?: {
    label: string
    onClick: () => void
  }
  /** Step indicator (e.g., "1 of 3") */
  step?: {
    current: number
    total: number
  }
  /** Child element that triggers the Tipseen */
  children: React.ReactNode
  /** Additional className for the content */
  className?: string
}

// =============================================================================
// CONSTANTS
// =============================================================================

const TIPSEEN_Z_INDEX = 60
const DEFAULT_OFFSET = 8

const colorStyles: Record<TipseenColor, { bg: string; text: string; arrow: string; border: string }> = {
  primary: {
    bg: "bg-accent-light",
    text: "text-primary",
    arrow: "text-accent-light",
    border: "border-accent",
  },
  inverted: {
    bg: "bg-inverse-bg",
    text: "text-inverse",
    arrow: "text-inverse-bg",
    border: "border-transparent",
  },
}

// =============================================================================
// TIPSEEN CONTEXT
// =============================================================================

interface TipseenContextValue {
  color: TipseenColor
}

const TipseenContext = React.createContext<TipseenContextValue>({ color: "inverted" })

function useTipseenContext() {
  return React.useContext(TipseenContext)
}

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * Tipseen - Guided onboarding tooltip for feature discovery.
 *
 * @component MOLECULE
 *
 * @description
 * Unlike regular tooltips (which provide contextual help), Tipseen is designed
 * for onboarding flows and feature discovery. It's more prominent, supports
 * titles, actions, and step indicators.
 *
 * Inspired by monday.com's Vibe Design System Tipseen pattern.
 *
 * @example
 * ```tsx
 * <Tipseen
 *   content="Click here to create your first report"
 *   title="Getting Started"
 *   position="bottom"
 * >
 *   <Button>Create Report</Button>
 * </Tipseen>
 * ```
 *
 * @accessibility
 * - Keyboard accessible (Escape to dismiss)
 * - Screen readers announce content via role="tooltip"
 * - Close button has aria-label
 *
 * @see Tooltip - For contextual hover help
 */
function Tipseen({
  content,
  title,
  position = "bottom",
  color = "inverted",
  offset = DEFAULT_OFFSET,
  open,
  defaultOpen = false,
  onOpenChange,
  hideCloseButton = false,
  width,
  primaryAction,
  secondaryAction,
  step,
  children,
  className,
}: TipseenProps) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen)
  const isControlled = open !== undefined
  const isOpen = isControlled ? open : internalOpen

  const handleOpenChange = React.useCallback((newOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(newOpen)
    }
    onOpenChange?.(newOpen)
  }, [isControlled, onOpenChange])

  const handleClose = React.useCallback(() => {
    handleOpenChange(false)
  }, [handleOpenChange])

  const styles = colorStyles[color]

  return (
    <TipseenContext.Provider value={{ color }}>
      <TooltipPrimitive.Provider delayDuration={0}>
        <TooltipPrimitive.Root
          open={isOpen}
          onOpenChange={handleOpenChange}
          delayDuration={0}
          data-slot="tipseen"
        >
          <TooltipPrimitive.Trigger asChild data-slot="tipseen-trigger">
            {children}
          </TooltipPrimitive.Trigger>

          <TooltipPrimitive.Portal>
            <TooltipPrimitive.Content
              data-slot="tipseen-content"
              side={position}
              sideOffset={offset}
              style={{
                zIndex: TIPSEEN_Z_INDEX,
                width: width ? (typeof width === "number" ? `${width}px` : width) : undefined,
              }}
              className={cn(
                styles.bg,
                styles.text,
                styles.border,
                "rounded-lg shadow-lg border-2",
                "min-w-[200px] max-w-[320px] p-4",
                "animate-in fade-in-0 zoom-in-95",
                "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
                "data-[side=bottom]:slide-in-from-top-2",
                "data-[side=left]:slide-in-from-right-2",
                "data-[side=right]:slide-in-from-left-2",
                "data-[side=top]:slide-in-from-bottom-2",
                className
              )}
              onPointerDownOutside={(e) => e.preventDefault()}
            >
              {(title || !hideCloseButton) && (
                <div className="flex items-start justify-between gap-2 mb-2">
                  {title && (
                    <h4 data-slot="tipseen-title" className="font-sans font-semibold text-sm leading-tight">
                      {title}
                    </h4>
                  )}
                  {!hideCloseButton && (
                    <button
                      data-slot="tipseen-close"
                      onClick={handleClose}
                      className={cn(
                        "shrink-0 rounded-sm opacity-70 hover:opacity-100 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                        color === "inverted" ? "focus-visible:ring-inverse" : "focus-visible:ring-accent"
                      )}
                      aria-label="Close tip"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}

              <div className="font-sans text-sm leading-relaxed">{content}</div>

              {(step || primaryAction || secondaryAction) && (
                <div className={cn(
                  "flex items-center justify-between mt-4 pt-3 border-t",
                  color === "inverted" ? "border-inverse/20" : "border-accent/30"
                )}>
                  {step && (
                    <span data-slot="tipseen-step" className="text-xs opacity-70 font-sans">
                      {step.current} of {step.total}
                    </span>
                  )}
                  {(primaryAction || secondaryAction) && (
                    <div className={cn("flex items-center gap-2", !step && "ml-auto")}>
                      {secondaryAction && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={secondaryAction.onClick}
                          className={cn(
                            "text-xs h-7 px-2",
                            color === "inverted"
                              ? "text-inverse hover:bg-inverse/10"
                              : "text-primary hover:bg-accent/10"
                          )}
                        >
                          {secondaryAction.label}
                        </Button>
                      )}
                      {primaryAction && (
                        <Button
                          variant={color === "inverted" ? "secondary" : "accent"}
                          size="sm"
                          onClick={primaryAction.onClick}
                          className={cn(
                            "text-xs h-7 px-3",
                            color === "inverted" && "bg-inverse text-dark hover:bg-inverse/90"
                          )}
                        >
                          {primaryAction.label}
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              )}

              <TooltipPrimitive.Arrow
                className={cn("fill-current", styles.arrow)}
                width={12}
                height={6}
              />
            </TooltipPrimitive.Content>
          </TooltipPrimitive.Portal>
        </TooltipPrimitive.Root>
      </TooltipPrimitive.Provider>
    </TipseenContext.Provider>
  )
}
Tipseen.displayName = "Tipseen"

Tipseen.positions = {
  TOP: "top" as const,
  RIGHT: "right" as const,
  BOTTOM: "bottom" as const,
  LEFT: "left" as const,
}

Tipseen.colors = {
  PRIMARY: "primary" as const,
  INVERTED: "inverted" as const,
}

export { Tipseen, useTipseenContext }
export type { TipseenContextValue }
