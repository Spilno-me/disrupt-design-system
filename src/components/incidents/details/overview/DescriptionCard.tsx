/**
 * DescriptionCard - Long description card for incident overview
 *
 * Displays the incident description with truncation and expansion.
 * Uses line-clamp for consistent truncation with "Show more" toggle.
 *
 * @example
 * ```tsx
 * <DescriptionCard
 *   description="Maintenance personnel observed that an unusual odor was present..."
 *   maxLines={6}
 * />
 * ```
 */

import * as React from 'react'
import { useState, useRef, useEffect } from 'react'
import { cn } from '../../../../lib/utils'
import {
  AppCard,
  AppCardHeader,
  AppCardTitle,
  AppCardContent,
} from '../../../ui/app-card'
import type { DescriptionCardProps } from '../types'

/**
 * DescriptionCard - Expandable description display
 */
export function DescriptionCard({
  title = 'Description',
  description,
  maxLines = 6,
  className,
}: DescriptionCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [showToggle, setShowToggle] = useState(false)
  const textRef = useRef<HTMLParagraphElement>(null)

  // Check if text is truncated
  useEffect(() => {
    const checkTruncation = () => {
      if (textRef.current) {
        const element = textRef.current
        // Compare scrollHeight with clientHeight to detect truncation
        setShowToggle(element.scrollHeight > element.clientHeight)
      }
    }

    checkTruncation()

    // Re-check on resize
    window.addEventListener('resize', checkTruncation)
    return () => window.removeEventListener('resize', checkTruncation)
  }, [description, maxLines])

  // Dynamic line-clamp class
  const lineClampClass = expanded ? '' : `line-clamp-${maxLines}`

  return (
    <AppCard shadow="md" className={cn('h-full', className)}>
      <AppCardHeader>
        <AppCardTitle>{title}</AppCardTitle>
      </AppCardHeader>

      <AppCardContent>
        <p
          ref={textRef}
          className={cn(
            'text-sm text-secondary leading-relaxed',
            lineClampClass
          )}
          style={!expanded ? { WebkitLineClamp: maxLines, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' } : undefined}
        >
          {description}
        </p>

        {/* Show more/less toggle */}
        {showToggle && (
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className={cn(
              'mt-2 text-sm font-medium text-link',
              // Responsive touch targets with negative margin to maintain visual spacing
              'py-2 lg:py-1 -my-2 lg:-my-1',
              'px-2 -mx-2',
              'hover:underline',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:rounded-sm',
              'rounded-sm'
            )}
            aria-expanded={expanded}
            aria-label={expanded ? 'Show less of description' : 'Show more of description'}
          >
            {expanded ? 'Show less' : 'Show more...'}
          </button>
        )}
      </AppCardContent>
    </AppCard>
  )
}

export default DescriptionCard
