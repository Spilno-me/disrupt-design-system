/**
 * InlineRenameInput - Inline text input for renaming nodes
 *
 * Automatically focuses and selects text on mount.
 * Commits on Enter, cancels on Escape or blur.
 */

import * as React from 'react'
import { cn } from '../../../lib/utils'

// =============================================================================
// TYPES
// =============================================================================

export interface InlineRenameInputProps {
  /** Node ID for testId generation */
  nodeId: string
  /** Initial value to edit */
  initialValue: string
  /** Called when edit is committed (Enter or blur with changes) */
  onComplete: (value: string) => void
  /** Called when edit is cancelled (Escape) */
  onCancel: () => void
  /** Additional class names */
  className?: string
}

// =============================================================================
// COMPONENT
// =============================================================================

export function InlineRenameInput({
  nodeId,
  initialValue,
  onComplete,
  onCancel,
  className,
}: InlineRenameInputProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [value, setValue] = React.useState(initialValue)

  // Focus and select on mount
  React.useEffect(() => {
    const input = inputRef.current
    if (input) {
      input.focus()
      input.select()
    }
  }, [])

  // Handle key events
  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        onComplete(value)
      } else if (e.key === 'Escape') {
        e.preventDefault()
        onCancel()
      }
    },
    [value, onComplete, onCancel]
  )

  // Handle blur - commit if changed, cancel if empty
  const handleBlur = React.useCallback(() => {
    if (value.trim()) {
      onComplete(value)
    } else {
      onCancel()
    }
  }, [value, onComplete, onCancel])

  // Handle change
  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value)
    },
    []
  )

  // Stop propagation to prevent node selection
  const handleClick = React.useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
  }, [])

  return (
    <input
      ref={inputRef}
      type="text"
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      onClick={handleClick}
      className={cn(
        'w-full px-1 py-0.5 text-sm rounded',
        'bg-surface border border-accent',
        'text-primary placeholder:text-muted',
        'focus:outline-none focus:ring-2 focus:ring-accent/30',
        className
      )}
      aria-label="Rename"
      data-testid={`workspace-input-${nodeId}`}
    />
  )
}

InlineRenameInput.displayName = 'InlineRenameInput'

export default InlineRenameInput
