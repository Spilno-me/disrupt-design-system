/**
 * TruncatedText - Text that truncates with ellipsis and shows tooltip when truncated
 *
 * Features:
 * - Text fills available width naturally
 * - Truncates with ellipsis when container is too narrow
 * - Tooltip appears ONLY when text is actually truncated (detected via scrollWidth > clientWidth)
 * - Re-checks on window resize
 */

import * as React from 'react'
import { useState, useRef, useEffect, useCallback } from 'react'
import { Tooltip, TooltipTrigger, TooltipContent } from '../tooltip'
import { cn } from '../../../lib/utils'

export interface TruncatedTextProps {
  /** The text content to display */
  children: string
  /** Additional CSS classes */
  className?: string
  /** Maximum width for tooltip content */
  tooltipMaxWidth?: string
}

export function TruncatedText({
  children,
  className,
  tooltipMaxWidth = '400px',
}: TruncatedTextProps) {
  const textRef = useRef<HTMLSpanElement>(null)
  const [isTruncated, setIsTruncated] = useState(false)

  const checkTruncation = useCallback(() => {
    const element = textRef.current
    if (element) {
      // scrollWidth > clientWidth means text is overflowing (truncated)
      setIsTruncated(element.scrollWidth > element.clientWidth)
    }
  }, [])

  useEffect(() => {
    checkTruncation()

    // Re-check on window resize (table columns may change width)
    window.addEventListener('resize', checkTruncation)
    return () => window.removeEventListener('resize', checkTruncation)
  }, [checkTruncation, children])

  const textElement = (
    <span
      ref={textRef}
      className={cn('block truncate', className)}
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
      <TooltipTrigger asChild>
        {textElement}
      </TooltipTrigger>
      <TooltipContent side="top" sideOffset={4} style={{ maxWidth: tooltipMaxWidth }}>
        {children}
      </TooltipContent>
    </Tooltip>
  )
}

export default TruncatedText
