import * as React from 'react'
import {
  Phone,
  Mail,
  Calendar,
  FileText,
  ArrowRight,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Clock,
} from 'lucide-react'
import { cn } from '../../lib/utils'

// =============================================================================
// TYPES
// =============================================================================

/** Activity types matching backend API */
export type ActivityType =
  | 'call'
  | 'email'
  | 'meeting'
  | 'note'
  | 'status_change'
  | 'follow_up'
  | 'converted'
  | 'lost'

/** Single activity entry */
export interface Activity {
  /** Unique identifier */
  id: string
  /** Type of activity */
  type: ActivityType
  /** Activity description */
  description: string
  /** When the activity occurred */
  createdAt: string
  /** Who performed the activity */
  performedBy?: string
  /** Additional metadata (e.g., old/new status for status_change) */
  metadata?: Record<string, unknown>
}

export interface ActivityTimelineProps {
  /** List of activities to display */
  activities: Activity[]
  /** Callback when an activity is clicked */
  onActivityClick?: (activity: Activity) => void
  /** Show loading skeleton */
  loading?: boolean
  /** Message to show when no activities */
  emptyMessage?: string
  /** Additional className */
  className?: string
}

// =============================================================================
// ACTIVITY TIMELINE COMPONENT
// =============================================================================

/**
 * ActivityTimeline - Displays a vertical timeline of lead activities
 *
 * Shows activities in chronological order with icons, timestamps, and metadata.
 * Used in lead detail views to show activity history.
 *
 * @example
 * <ActivityTimeline
 *   activities={[
 *     { id: '1', type: 'call', description: 'Discovery call', createdAt: '2024-01-15T10:30:00Z' },
 *   ]}
 *   onActivityClick={(activity) => console.log('Clicked', activity)}
 * />
 */
export function ActivityTimeline({
  activities,
  onActivityClick,
  loading = false,
  emptyMessage = 'No activities recorded yet',
  className,
}: ActivityTimelineProps) {
  if (loading) {
    return <ActivityTimelineSkeleton className={className} />
  }

  if (activities.length === 0) {
    return (
      <div className={cn('flex flex-col items-center justify-center py-12 text-center', className)}>
        <Clock className="w-12 h-12 text-muted mb-3" />
        <p className="text-muted">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className={cn('relative', className)}>
      {/* Activities */}
      <ul role="list" aria-label="Activity timeline">
        {activities.map((activity, index) => (
          <ActivityItem
            key={activity.id}
            activity={activity}
            onClick={onActivityClick}
            isLast={index === activities.length - 1}
          />
        ))}
      </ul>
    </div>
  )
}

// =============================================================================
// SUBCOMPONENTS
// =============================================================================

interface ActivityItemProps {
  activity: Activity
  onClick?: (activity: Activity) => void
  isLast: boolean
}

function ActivityItem({ activity, onClick, isLast }: ActivityItemProps) {
  const config = activityConfig[activity.type]
  const Icon = config.icon

  const handleClick = () => onClick?.(activity)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick()
    }
  }

  return (
    <li
      className={cn(
        'relative flex gap-4 pb-6',
        onClick && 'cursor-pointer hover:bg-hover rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 -mx-2 px-2'
      )}
      onClick={onClick ? handleClick : undefined}
      onKeyDown={onClick ? handleKeyDown : undefined}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {/* Icon with optional connector line */}
      <div className="relative flex-shrink-0">
        {/* Connector line to next item - only for non-last */}
        {!isLast && (
          <div
            className="absolute left-1/2 top-11 -bottom-6 w-px -translate-x-1/2 bg-border dark:bg-border-strong"
            aria-hidden="true"
          />
        )}
        {/* 44px touch target per Fitts's Law */}
        <div className={cn('relative z-10 flex items-center justify-center w-11 h-11 rounded-full', config.bgColor)}>
          <Icon className={cn('w-5 h-5', config.iconColor)} />
        </div>
      </div>

      {/* Content aligned to icon center: icon=44px, center=22px, line-height~20px, so pt ~12px */}
      <div className={cn('flex-1 pt-2.5', !isLast && 'border-b border-subtle pb-6')}>
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className={cn('text-sm font-medium', config.labelColor)}>{config.label}</span>
          <time className="text-xs text-muted">{formatTimestamp(activity.createdAt)}</time>
        </div>
        <p className="text-sm text-primary">{activity.description}</p>
        <div className="flex items-center gap-3 mt-2">
          {activity.performedBy && <span className="text-xs text-muted">by {activity.performedBy}</span>}
          {activity.metadata && <ActivityMetadata metadata={activity.metadata} type={activity.type} />}
        </div>
      </div>
    </li>
  )
}

function ActivityMetadata({ metadata, type }: { metadata: Record<string, unknown>; type: ActivityType }) {
  if (type === 'status_change' && metadata.oldStatus && metadata.newStatus) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-muted bg-muted-bg px-2 py-0.5 rounded">
        <span className="text-warning">{String(metadata.oldStatus)}</span>
        <ArrowRight className="w-3 h-3" />
        <span className="text-success">{String(metadata.newStatus)}</span>
      </span>
    )
  }
  if ((type === 'meeting' || type === 'call') && metadata.duration) {
    return <span className="text-xs text-muted bg-muted-bg px-2 py-0.5 rounded">{String(metadata.duration)} min</span>
  }
  return null
}

function ActivityTimelineSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('space-y-4', className)}>
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-4 animate-pulse">
          <div className="w-11 h-11 rounded-full bg-muted-bg flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="flex justify-between">
              <div className="h-4 w-20 bg-muted-bg rounded" />
              <div className="h-3 w-24 bg-muted-bg rounded" />
            </div>
            <div className="h-4 w-3/4 bg-muted-bg rounded" />
            <div className="h-3 w-1/4 bg-muted-bg rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}

// =============================================================================
// CONFIGURATION
// =============================================================================

interface ActivityConfigItem {
  label: string
  icon: React.ComponentType<{ className?: string }>
  bgColor: string
  iconColor: string
  labelColor: string
}

const activityConfig: Record<ActivityType, ActivityConfigItem> = {
  call: { label: 'Phone Call', icon: Phone, bgColor: 'bg-info-light dark:bg-info-muted', iconColor: 'text-info', labelColor: 'text-info' },
  email: { label: 'Email', icon: Mail, bgColor: 'bg-accent-bg dark:bg-accent-muted', iconColor: 'text-accent', labelColor: 'text-accent' },
  meeting: { label: 'Meeting', icon: Calendar, bgColor: 'bg-warning-light dark:bg-warning-muted', iconColor: 'text-warning-dark dark:text-warning', labelColor: 'text-warning-dark dark:text-warning' },
  note: { label: 'Note Added', icon: FileText, bgColor: 'bg-surface dark:bg-surface-dark', iconColor: 'text-secondary dark:text-tertiary', labelColor: 'text-secondary dark:text-tertiary' },
  status_change: { label: 'Status Changed', icon: ArrowRight, bgColor: 'bg-muted-bg dark:bg-surface-dark', iconColor: 'text-muted', labelColor: 'text-muted' },
  follow_up: { label: 'Follow-up', icon: MessageSquare, bgColor: 'bg-accent-bg dark:bg-accent-muted', iconColor: 'text-accent', labelColor: 'text-accent' },
  converted: { label: 'Converted', icon: CheckCircle2, bgColor: 'bg-success-light dark:bg-success-muted', iconColor: 'text-success', labelColor: 'text-success' },
  lost: { label: 'Lost', icon: XCircle, bgColor: 'bg-error-light dark:bg-error-muted', iconColor: 'text-error', labelColor: 'text-error' },
}

// =============================================================================
// HELPERS
// =============================================================================

function formatTimestamp(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  })
}

export default ActivityTimeline
