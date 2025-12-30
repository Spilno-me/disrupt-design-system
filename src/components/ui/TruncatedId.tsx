/**
 * TruncatedId - Display truncated UUIDs/long IDs with copy functionality
 *
 * Shows a truncated version of a long ID with a copy button that appears on hover.
 * Clicking copies the full ID to clipboard with visual feedback.
 *
 * @component ATOM
 * @category Data Display
 *
 * @example
 * ```tsx
 * // Basic usage
 * <TruncatedId value="d1577519-cf6d-4a8b-9c3e-123456782aa38" />
 *
 * // Custom truncation
 * <TruncatedId value="long-string-here" startChars={6} endChars={4} />
 *
 * // Without copy button
 * <TruncatedId value="abc123" showCopy={false} />
 * ```
 */

import * as React from 'react'
import { useState, useCallback } from 'react'
import { Copy, Check } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Button } from './button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './tooltip'

// =============================================================================
// TYPES
// =============================================================================

export interface TruncatedIdProps {
  /** The full ID value */
  value: string
  /** Number of characters to show at start (default: 8) */
  startChars?: number
  /** Number of characters to show at end (default: 5) */
  endChars?: number
  /** Separator between start and end (default: "...") */
  separator?: string
  /** Whether to show copy button (default: true) */
  showCopy?: boolean
  /** Whether to show full ID on hover tooltip (default: true) */
  showTooltip?: boolean
  /** Additional className for the container */
  className?: string
  /** Additional className for the ID text */
  textClassName?: string
  /** Callback when ID is copied */
  onCopy?: (value: string) => void
}

// =============================================================================
// COMPONENT
// =============================================================================

export function TruncatedId({
  value,
  startChars = 8,
  endChars = 5,
  separator = '...',
  showCopy = true,
  showTooltip = true,
  className,
  textClassName,
  onCopy,
}: TruncatedIdProps) {
  const [copied, setCopied] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  // Determine if truncation is needed
  const minLength = startChars + endChars + separator.length
  const shouldTruncate = value.length > minLength

  // Generate display value
  const displayValue = shouldTruncate
    ? `${value.slice(0, startChars)}${separator}${value.slice(-endChars)}`
    : value

  // Handle copy
  const handleCopy = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation()
      try {
        await navigator.clipboard.writeText(value)
        setCopied(true)
        onCopy?.(value)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        console.error('Failed to copy:', err)
      }
    },
    [value, onCopy]
  )

  const idElement = (
    <span
      className={cn(
        'font-mono text-xs text-secondary tabular-nums',
        textClassName
      )}
    >
      {displayValue}
    </span>
  )

  return (
    <TooltipProvider>
      <div
        className={cn(
          'inline-flex items-center gap-1.5 group/id',
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* ID display with optional tooltip */}
        {showTooltip && shouldTruncate ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="cursor-help">{idElement}</span>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs">
              <span className="font-mono text-xs break-all">{value}</span>
            </TooltipContent>
          </Tooltip>
        ) : (
          idElement
        )}

        {/* Copy button */}
        {showCopy && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className={cn(
                  'size-6 p-0 transition-opacity',
                  isHovered || copied ? 'opacity-100' : 'opacity-0',
                  copied
                    ? 'text-success hover:text-success'
                    : 'text-secondary hover:text-primary'
                )}
              >
                {copied ? (
                  <Check className="size-3" />
                ) : (
                  <Copy className="size-3" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              {copied ? 'Copied!' : 'Copy ID'}
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  )
}

TruncatedId.displayName = 'TruncatedId'

export default TruncatedId
