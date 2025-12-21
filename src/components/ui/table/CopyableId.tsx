/**
 * CopyableId - Displays an ID with monospace font and copy functionality
 *
 * Uses JetBrains Mono font for technical IDs with a teal copy icon.
 * Clicking the icon copies the ID to clipboard with visual feedback.
 *
 * @figma https://www.figma.com/design/19jjsBQEpNsQaryNQgXedT/Flow-EHS
 */

import * as React from 'react'
import { useState, useCallback } from 'react'
import { Copy, Check } from 'lucide-react'
import { cn } from '../../../lib/utils'

export interface CopyableIdProps {
  /** The ID value to display and copy */
  id: string
  /** Additional className for the container */
  className?: string
  /** Callback when ID is copied */
  onCopy?: (id: string) => void
}

/**
 * CopyableId - ID display with copy-to-clipboard functionality
 *
 * Features:
 * - JetBrains Mono font for technical readability
 * - Teal copy icon (adapts to dark mode)
 * - Visual feedback on successful copy (icon changes to checkmark)
 * - Accessible with keyboard support
 *
 * @example
 * ```tsx
 * <CopyableId id="INC-516344565333" />
 *
 * // With callback
 * <CopyableId
 *   id="INC-516344565333"
 *   onCopy={(id) => toast(`Copied ${id}`)}
 * />
 * ```
 */
export function CopyableId({ id, className, onCopy }: CopyableIdProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(id)
      setCopied(true)
      onCopy?.(id)

      // Reset after 2 seconds
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy ID:', err)
    }
  }, [id, onCopy])

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5',
        className
      )}
    >
      {/* ID text with monospace font */}
      <span className="font-mono text-sm font-medium">
        {id}
      </span>

      {/* Copy button */}
      <button
        type="button"
        onClick={handleCopy}
        className={cn(
          'inline-flex items-center justify-center',
          'p-0.5 rounded transition-colors duration-200',
          'hover:bg-accent-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
          // Teal color: uses teal token which auto-adapts for dark mode
          // Light: DEEP_CURRENT[700] for contrast | Dark: DEEP_CURRENT[400]
          'text-teal dark:text-accent-strong',
          copied && 'text-success'
        )}
        aria-label={copied ? 'Copied!' : `Copy ID ${id}`}
        title={copied ? 'Copied!' : 'Copy to clipboard'}
      >
        {copied ? (
          <Check className="size-3.5" />
        ) : (
          <Copy className="size-3.5" />
        )}
      </button>
    </span>
  )
}

export default CopyableId
