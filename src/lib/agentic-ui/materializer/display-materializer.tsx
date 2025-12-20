/**
 * Display Materializer
 *
 * Renders display intentions (review, wait) as appropriate
 * UI components for showing information to users.
 */

import * as React from 'react'
import { Info, FileText, Loader2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card'
import { cn } from '../../../lib/utils'
import type { PatternMaterializer, MaterializerProps } from './types'
import { getFieldLabel } from './types'

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Safely render an unknown value as a string
 */
function renderValue(value: unknown): string | null {
  if (value === null || value === undefined) return null
  if (typeof value === 'object') return JSON.stringify(value, null, 2)
  return String(value)
}

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

/**
 * Information card for review
 */
function ReviewCard({
  resolution,
  className,
}: MaterializerProps) {
  const label = getFieldLabel(resolution.sourceIntention)
  const description = resolution.sourceIntention.subject.description
  const value = resolution.sourceIntention.subject.value

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-accent" />
          <CardTitle className="text-base">{label}</CardTitle>
        </div>
        {description && (
          <CardDescription>{description}</CardDescription>
        )}
      </CardHeader>
      {renderValue(value) && (
        <CardContent>
          <div className="text-sm text-primary whitespace-pre-wrap">
            {renderValue(value)}
          </div>
        </CardContent>
      )}
    </Card>
  )
}

/**
 * Loading/waiting state
 */
function WaitingState({
  resolution,
  className,
}: MaterializerProps) {
  const label = getFieldLabel(resolution.sourceIntention)
  const description = resolution.sourceIntention.subject.description

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4 p-6 rounded-lg bg-muted-bg',
        className
      )}
      role="status"
      aria-live="polite"
    >
      <Loader2 className="w-8 h-8 text-accent animate-spin" />
      <div className="text-center">
        <p className="font-medium text-primary">{label}</p>
        {description && (
          <p className="text-sm text-secondary mt-1">{description}</p>
        )}
      </div>
    </div>
  )
}

/**
 * Simple information display
 */
function InfoDisplay({
  resolution,
  className,
}: MaterializerProps) {
  const label = getFieldLabel(resolution.sourceIntention)
  const description = resolution.sourceIntention.subject.description
  const value = resolution.sourceIntention.subject.value

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-lg bg-accent-bg border border-accent/20',
        className
      )}
      role="region"
      aria-label={label}
    >
      <Info className="w-5 h-5 text-accent shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-primary">{label}</p>
        {description && (
          <p className="text-sm text-secondary mt-1">{description}</p>
        )}
        {renderValue(value) && (
          <p className="text-sm text-primary mt-2">
            {renderValue(value)}
          </p>
        )}
      </div>
    </div>
  )
}

// =============================================================================
// DISPLAY MATERIALIZER
// =============================================================================

export const DisplayMaterializer: PatternMaterializer = {
  pattern: 'display',

  canHandle: (resolution) => resolution.manifestation.pattern === 'display',

  render: (props) => {
    const { resolution } = props
    const { action } = resolution.sourceIntention

    // Wait action: Loading state
    if (action === 'wait') {
      return <WaitingState {...props} />
    }

    // Review action: Card with content
    if (action === 'review') {
      return <ReviewCard {...props} />
    }

    // Default: Info display
    return <InfoDisplay {...props} />
  },
}
