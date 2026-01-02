/**
 * DueDateDisplay
 *
 * Displays due date with contextual styling based on urgency:
 * - Future: neutral styling
 * - Today: warning styling
 * - Overdue: error styling with badge
 * - Completed: success styling
 */

import { Calendar, AlertCircle, CheckCircle, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  formatDate,
  formatRelativeDate,
  getDueDateState,
  getDaysUntilDue,
  type DueDateState,
} from './helpers'
import type { CorrectiveActionStatus } from './types'
import { cn } from '@/lib/utils'

export interface DueDateDisplayProps {
  /** Due date */
  dueDate: Date | string
  /** Current status (affects display logic) */
  status: CorrectiveActionStatus
  /** Display format */
  format?: 'date' | 'relative' | 'both'
  /** Show icon */
  showIcon?: boolean
  /** Show overdue badge */
  showOverdueBadge?: boolean
  /** Size variant */
  size?: 'sm' | 'default' | 'lg'
  /** Additional CSS classes */
  className?: string
}

const sizeClasses = {
  sm: 'text-xs',
  default: 'text-sm',
  lg: 'text-base',
}

const iconSizes = {
  sm: 12,
  default: 14,
  lg: 16,
}

interface StateConfig {
  textClass: string
  icon: typeof Calendar
  badgeVariant?: 'destructive' | 'warning' | 'success'
  badgeLabel?: string
}

const STATE_CONFIG: Record<DueDateState, StateConfig> = {
  future: {
    textClass: 'text-secondary',
    icon: Calendar,
  },
  today: {
    textClass: 'text-warning',
    icon: Clock,
    badgeVariant: 'warning',
    badgeLabel: 'Due Today',
  },
  overdue: {
    textClass: 'text-error',
    icon: AlertCircle,
    badgeVariant: 'destructive',
    badgeLabel: 'Overdue',
  },
  completed: {
    textClass: 'text-success',
    icon: CheckCircle,
  },
}

export function DueDateDisplay({
  dueDate,
  status,
  format = 'date',
  showIcon = true,
  showOverdueBadge = true,
  size = 'default',
  className,
}: DueDateDisplayProps) {
  const state = getDueDateState(dueDate, status)
  const config = STATE_CONFIG[state]
  const Icon = config.icon
  const daysUntil = getDaysUntilDue(dueDate)

  const dateText = format === 'relative'
    ? formatRelativeDate(dueDate)
    : format === 'both'
    ? `${formatDate(dueDate)} (${formatRelativeDate(dueDate)})`
    : formatDate(dueDate)

  return (
    <div className={cn('inline-flex items-center gap-2', className)}>
      <div className={cn('inline-flex items-center gap-1.5', config.textClass)}>
        {showIcon && (
          <Icon size={iconSizes[size]} className="shrink-0" aria-hidden="true" />
        )}
        <span className={sizeClasses[size]}>{dateText}</span>
      </div>

      {showOverdueBadge && config.badgeVariant && config.badgeLabel && (
        <Badge variant={config.badgeVariant} className="text-xs">
          {config.badgeLabel}
          {state === 'overdue' && daysUntil !== null && (
            <span className="ml-1">({Math.abs(daysUntil)}d)</span>
          )}
        </Badge>
      )}
    </div>
  )
}

export default DueDateDisplay
