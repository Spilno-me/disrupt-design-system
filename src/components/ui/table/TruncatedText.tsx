"use client"

import * as React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { Tooltip, TooltipTrigger, TooltipContent } from "../tooltip"
import { cn } from "../../../lib/utils"

// =============================================================================
// CONSTANTS
// =============================================================================

/** Default maximum width for tooltip content */
const DEFAULT_TOOLTIP_MAX_WIDTH = "400px"

/** Data slot attribute for testing */
const DATA_SLOT = "truncated-text"

/** Base styles for the truncated text span */
const TEXT_BASE_STYLES = "block truncate"

// =============================================================================
// TYPES
// =============================================================================

/**
 * Props for the TruncatedText component.
 * Extends HTMLSpanElement attributes for maximum flexibility.
 */
export interface TruncatedTextProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  /** The text content to display */
  children: string
  /** Maximum width for tooltip content */
  tooltipMaxWidth?: string
}

// =============================================================================
// COMPONENTS
// =============================================================================

/**
 * TruncatedText - Text that truncates with ellipsis and shows tooltip when truncated.
 *
 * A utility component that intelligently handles text overflow. The text fills
 * available width naturally and truncates with ellipsis when the container is
 * too narrow. A tooltip appears ONLY when the text is actually truncated,
 * detected via scrollWidth > clientWidth comparison.
 *
 * @component ATOM
 * @category Data Display
 *
 * @example
 * ```tsx
 * // Basic usage in a table cell
 * <TruncatedText>This is a very long text that might need truncation</TruncatedText>
 *
 * // With custom tooltip width
 * <TruncatedText tooltipMaxWidth="600px">
 *   Very long content that needs a wider tooltip
 * </TruncatedText>
 *
 * // With custom className
 * <TruncatedText className="text-secondary">
 *   Secondary styled truncated text
 * </TruncatedText>
 * ```
 *
 * @features
 * - Text fills available width naturally
 * - Truncates with ellipsis when container is too narrow
 * - Tooltip appears ONLY when text is actually truncated
 * - Re-checks truncation state on window resize
 *
 * @accessibility
 * - Full text accessible via tooltip for truncated content
 * - Tooltip triggers on hover and focus for keyboard users
 * - No visual information hidden from assistive technologies
 */
export function TruncatedText({
  children,
  className,
  tooltipMaxWidth = DEFAULT_TOOLTIP_MAX_WIDTH,
  ...props
}: TruncatedTextProps) {
  const textRef = useRef<HTMLSpanElement>(null)
  const [isTruncated, setIsTruncated] = useState(false)
  // RAF throttle ref - matches pattern from useHeaderContrast.ts
  const tickingRef = useRef(false)

  const checkTruncation = useCallback(() => {
    const element = textRef.current
    if (element) {
      // scrollWidth > clientWidth means text is overflowing (truncated)
      setIsTruncated(element.scrollWidth > element.clientWidth)
    }
  }, [])

  useEffect(() => {
    checkTruncation()

    // RAF-throttled resize handler - prevents layout thrashing with many TruncatedText instances
    const throttledCheck = () => {
      if (!tickingRef.current) {
        requestAnimationFrame(() => {
          try {
            checkTruncation()
          } finally {
            tickingRef.current = false
          }
        })
        tickingRef.current = true
      }
    }

    // Re-check on window resize (table columns may change width)
    window.addEventListener("resize", throttledCheck)
    return () => window.removeEventListener("resize", throttledCheck)
  }, [checkTruncation, children])

  const textElement = (
    <span
      ref={textRef}
      data-slot={DATA_SLOT}
      className={cn(TEXT_BASE_STYLES, "text-primary", className)}
      {...props}
    >
      {children}
    </span>
  )

  // Only wrap in Tooltip if text is actually truncated
  if (!isTruncated) {
    return textElement
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{textElement}</TooltipTrigger>
      <TooltipContent side="top" sideOffset={4} style={{ maxWidth: tooltipMaxWidth }}>
        {children}
      </TooltipContent>
    </Tooltip>
  )
}

TruncatedText.displayName = "TruncatedText"

// =============================================================================
// EXPORTS
// =============================================================================

export default TruncatedText
