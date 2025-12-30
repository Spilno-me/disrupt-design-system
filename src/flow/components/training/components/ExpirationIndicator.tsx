/**
 * ExpirationIndicator - Training expiration countdown
 *
 * Shows the time remaining until a training expires with
 * appropriate urgency indicators.
 *
 * @example
 * ```tsx
 * <ExpirationIndicator daysUntil={45} />
 * <ExpirationIndicator daysUntil={15} showIcon />
 * <ExpirationIndicator daysUntil={-5} /> // Shows "5 days overdue"
 * ```
 */

import * as React from 'react'
import { Clock, AlertCircle, CheckCircle, XCircle } from 'lucide-react'
import { cn } from '../../../../lib/utils'
import { Badge } from '../../../../components/ui/badge'

// =============================================================================
// TYPES
// =============================================================================

export interface ExpirationIndicatorProps {
  /** Days until expiration. Negative = overdue. Null = never expires. */
  daysUntil: number | null
  /** Show icon */
  showIcon?: boolean
  /** Display as badge or inline text */
  variant?: 'badge' | 'text'
  /** Additional class names */
  className?: string
  /** Custom warning threshold (default: 30 days) */
  warningThreshold?: number
  /** Custom critical threshold (default: 7 days) */
  criticalThreshold?: number
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function getExpirationLabel(daysUntil: number | null): string {
  if (daysUntil === null) return 'Never expires'
  if (daysUntil < 0) {
    const overdueDays = Math.abs(daysUntil)
    return overdueDays === 1 ? '1 day overdue' : `${overdueDays} days overdue`
  }
  if (daysUntil === 0) return 'Expires today'
  if (daysUntil === 1) return 'Expires tomorrow'
  if (daysUntil <= 30) return `${daysUntil} days`
  if (daysUntil <= 60) return `${Math.round(daysUntil / 7)} weeks`
  return `${Math.round(daysUntil / 30)} months`
}

type UrgencyLevel = 'success' | 'warning' | 'critical' | 'overdue' | 'neutral'

function getUrgencyLevel(
  daysUntil: number | null,
  warningThreshold: number,
  criticalThreshold: number
): UrgencyLevel {
  if (daysUntil === null) return 'neutral'
  if (daysUntil < 0) return 'overdue'
  if (daysUntil <= criticalThreshold) return 'critical'
  if (daysUntil <= warningThreshold) return 'warning'
  return 'success'
}

// =============================================================================
// STYLE CONFIGS
// =============================================================================

const URGENCY_STYLES: Record<UrgencyLevel, { text: string; badge: string; icon: typeof Clock }> = {
  success: {
    text: 'text-success',
    badge: 'bg-success-tint text-success-strong',
    icon: CheckCircle,
  },
  warning: {
    text: 'text-warning',
    badge: 'bg-warning-tint text-warning-dark',
    icon: Clock,
  },
  critical: {
    text: 'text-destructive',
    badge: 'bg-destructive-tint text-destructive',
    icon: AlertCircle,
  },
  overdue: {
    text: 'text-destructive',
    badge: 'bg-destructive text-inverse',
    icon: XCircle,
  },
  neutral: {
    text: 'text-tertiary',
    badge: 'bg-secondary text-secondary-foreground',
    icon: CheckCircle,
  },
}

// =============================================================================
// COMPONENT
// =============================================================================

export function ExpirationIndicator({
  daysUntil,
  showIcon = false,
  variant = 'text',
  className,
  warningThreshold = 30,
  criticalThreshold = 7,
}: ExpirationIndicatorProps) {
  const label = getExpirationLabel(daysUntil)
  const urgency = getUrgencyLevel(daysUntil, warningThreshold, criticalThreshold)
  const styles = URGENCY_STYLES[urgency]
  const Icon = styles.icon

  if (variant === 'badge') {
    return (
      <Badge
        variant="outline"
        className={cn(
          'gap-1 font-medium border-0',
          styles.badge,
          className
        )}
      >
        {showIcon && <Icon className="size-3" />}
        <span>{label}</span>
      </Badge>
    )
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 text-sm',
        styles.text,
        className
      )}
    >
      {showIcon && <Icon className="size-3.5" />}
      <span>{label}</span>
    </span>
  )
}

ExpirationIndicator.displayName = 'ExpirationIndicator'

export default ExpirationIndicator
