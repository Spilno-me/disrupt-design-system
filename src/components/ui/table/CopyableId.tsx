/**
 * CopyableId - Displays a technical ID with copy-to-clipboard functionality
 *
 * Atomic component for displaying IDs in tables and lists with one-click copy.
 * Uses monospace font for technical readability with visual feedback on copy.
 *
 * @component ATOM
 *
 * @example
 * ```tsx
 * // Basic usage
 * <CopyableId id="INC-516344565333" />
 *
 * // With callback
 * <CopyableId
 *   id="INC-516344565333"
 *   onCopy={(id) => toast(`Copied ${id}`)}
 * />
 *
 * // With custom styling
 * <CopyableId id="USR-001" className="text-xs" />
 * ```
 *
 * @testing
 * - `data-slot="copyable-id"` - Root container
 *
 * @accessibility
 * - Keyboard accessible copy button
 * - Dynamic aria-label indicates copy state
 * - Focus visible ring for keyboard navigation
 *
 * @figma https://www.figma.com/design/19jjsBQEpNsQaryNQgXedT/Flow-EHS
 */

import * as React from "react"
import { useState, useCallback } from "react"
import { Copy, Check, X } from "lucide-react"
import { cn } from "../../../lib/utils"

// ============== CONSTANTS ==============

/** Duration in ms to show success state before resetting */
const COPY_FEEDBACK_DURATION_MS = 2000

/** Icon size class for copy button */
const ICON_SIZE_CLASS = "size-3.5"

/** Data slot identifier for testing */
const DATA_SLOT = "copyable-id"

// ============== TYPES ==============

/**
 * Props for the CopyableId component
 */
export interface CopyableIdProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "id" | "onCopy"> {
  /** The ID value to display and copy */
  id: string
  /** Callback fired after successful copy */
  onCopy?: (id: string) => void
}

// ============== COMPONENTS ==============

/**
 * CopyableId - ID display with copy-to-clipboard functionality
 */
export function CopyableId({
  id,
  className,
  onCopy,
  ...props
}: CopyableIdProps) {
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>('idle')

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(id)
      setCopyState('copied')
      onCopy?.(id)
      setTimeout(() => setCopyState('idle'), COPY_FEEDBACK_DURATION_MS)
    } catch (err) {
      console.error("Failed to copy ID:", err)
      setCopyState('error')
      setTimeout(() => setCopyState('idle'), COPY_FEEDBACK_DURATION_MS)
    }
  }, [id, onCopy])

  return (
    <span
      data-slot={DATA_SLOT}
      className={cn("inline-flex items-center gap-1.5", className)}
      {...props}
    >
      <span className="font-mono text-sm font-medium text-primary">{id}</span>
      <button
        type="button"
        onClick={handleCopy}
        className={cn(
          "inline-flex items-center justify-center",
          "p-0.5 rounded transition-colors duration-200",
          "hover:bg-accent-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
          "text-muted",
          copyState === 'copied' && "text-success",
          copyState === 'error' && "text-error"
        )}
        aria-label={
          copyState === 'copied' ? "Copied!" :
          copyState === 'error' ? "Copy failed" :
          `Copy ID ${id}`
        }
        title={
          copyState === 'copied' ? "Copied!" :
          copyState === 'error' ? "Copy failed" :
          "Copy to clipboard"
        }
      >
        {copyState === 'copied' ? (
          <Check className={ICON_SIZE_CLASS} aria-hidden="true" />
        ) : copyState === 'error' ? (
          <X className={ICON_SIZE_CLASS} aria-hidden="true" />
        ) : (
          <Copy className={ICON_SIZE_CLASS} aria-hidden="true" />
        )}
      </button>
    </span>
  )
}

CopyableId.displayName = "CopyableId"

export default CopyableId
