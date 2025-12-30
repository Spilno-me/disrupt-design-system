/**
 * CopyButton - A button to copy text to clipboard
 *
 * Provides visual feedback when content is copied and supports
 * accessible labeling and test IDs.
 *
 * @component ATOM
 * @testId copy-button (default), or custom via data-testid prop
 */

import * as React from 'react'
import { Copy, Check } from 'lucide-react'
import { cn } from '../../lib/utils'
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from './tooltip'

// =============================================================================
// TYPES
// =============================================================================

export interface CopyButtonProps {
  /** The text value to copy to clipboard */
  value: string
  /** Accessible label for the button (shown in tooltip) */
  label?: string
  /** Additional CSS classes */
  className?: string
  /** Test ID for automated testing */
  'data-testid'?: string
}

// =============================================================================
// COMPONENT
// =============================================================================

export function CopyButton({
  value,
  label = 'Copy to clipboard',
  className,
  'data-testid': testId = 'copy-button',
}: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = React.useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation()
      try {
        await navigator.clipboard.writeText(value)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        console.error('Failed to copy:', err)
      }
    },
    [value]
  )

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? 'Copied' : label}
          data-testid={testId}
          className={cn(
            'inline-flex items-center justify-center size-6 rounded-sm',
            'text-secondary hover:text-primary hover:bg-muted-bg',
            'transition-colors duration-150',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
            className
          )}
        >
          {copied ? (
            <Check className="size-3.5 text-success" />
          ) : (
            <Copy className="size-3.5" />
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent>{copied ? 'Copied!' : label}</TooltipContent>
    </Tooltip>
  )
}

CopyButton.displayName = 'CopyButton'

export default CopyButton
