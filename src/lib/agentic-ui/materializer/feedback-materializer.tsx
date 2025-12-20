/**
 * Feedback Materializer
 *
 * Renders feedback intentions (alert) as appropriate
 * UI components for system communication.
 */

import * as React from 'react'
import { AlertTriangle, AlertCircle, CheckCircle2, Info, X } from 'lucide-react'
import { cn } from '../../../lib/utils'
import type { PatternMaterializer, MaterializerProps } from './types'
import { getFieldLabel } from './types'

// =============================================================================
// TYPES
// =============================================================================

type AlertVariant = 'info' | 'success' | 'warning' | 'error'

// =============================================================================
// HELPERS
// =============================================================================

function getAlertVariant(resolution: MaterializerProps['resolution']): AlertVariant {
  const { urgency } = resolution.appliedConstraints.context
  const iconHint = resolution.sourceIntention.subject.iconHint

  if (iconHint === 'success') return 'success'
  if (iconHint === 'error' || urgency === 'critical') return 'error'
  if (iconHint === 'warning' || urgency === 'high') return 'warning'
  return 'info'
}

function getAlertIcon(variant: AlertVariant) {
  switch (variant) {
    case 'success':
      return <CheckCircle2 className="w-5 h-5" />
    case 'warning':
      return <AlertTriangle className="w-5 h-5" />
    case 'error':
      return <AlertCircle className="w-5 h-5" />
    default:
      return <Info className="w-5 h-5" />
  }
}

const VARIANT_STYLES: Record<AlertVariant, string> = {
  info: 'bg-accent-bg border-accent/30 text-accent',
  success: 'bg-success-bg border-success/30 text-success',
  warning: 'bg-warning-bg border-warning/30 text-warning',
  error: 'bg-error-bg border-error/30 text-error',
}

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

/**
 * Alert banner
 */
function AlertBanner({
  resolution,
  onChange,
  className,
}: MaterializerProps) {
  const label = getFieldLabel(resolution.sourceIntention)
  const description = resolution.sourceIntention.subject.description
  const variant = getAlertVariant(resolution)
  const dismissable = resolution.manifestation.traits.dismissable
  const liveRegion = resolution.manifestation.traits.liveRegion

  const [isDismissed, setIsDismissed] = React.useState(false)

  if (isDismissed) return null

  const handleDismiss = () => {
    setIsDismissed(true)
    onChange?.(true) // Signal that alert was dismissed
  }

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-lg border',
        VARIANT_STYLES[variant],
        className
      )}
      role="alert"
      aria-live={liveRegion ?? 'polite'}
    >
      <div className="shrink-0 mt-0.5">
        {getAlertIcon(variant)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium">{label}</p>
        {description && (
          <p className="text-sm opacity-90 mt-1">{description}</p>
        )}
      </div>
      {dismissable && (
        <button
          type="button"
          onClick={handleDismiss}
          className="shrink-0 p-1 rounded hover:bg-black/10 transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

/**
 * Inline status indicator
 */
function StatusIndicator({
  resolution,
  className,
}: MaterializerProps) {
  const label = getFieldLabel(resolution.sourceIntention)
  const variant = getAlertVariant(resolution)

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium',
        VARIANT_STYLES[variant],
        className
      )}
      role="status"
    >
      {getAlertIcon(variant)}
      <span>{label}</span>
    </div>
  )
}

// =============================================================================
// FEEDBACK MATERIALIZER
// =============================================================================

export const FeedbackMaterializer: PatternMaterializer = {
  pattern: 'feedback',

  canHandle: (resolution) => resolution.manifestation.pattern === 'feedback',

  render: (props) => {
    const { resolution } = props
    const { elevated, contained } = resolution.manifestation.traits

    // Elevated: Full banner alert
    if (elevated || contained) {
      return <AlertBanner {...props} />
    }

    // Default: Inline status
    return <StatusIndicator {...props} />
  },
}
