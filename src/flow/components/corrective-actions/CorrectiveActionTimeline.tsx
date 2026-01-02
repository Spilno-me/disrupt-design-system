/**
 * CorrectiveActionTimeline
 *
 * Timeline/history view showing all events for a corrective action.
 * Visualizes the workflow progression with icons and timestamps.
 */

import { TIMELINE_EVENT_CONFIG, formatDateTime, getUserDisplayName } from './helpers'
import type { TimelineEvent } from './types'
import { cn } from '@/lib/utils'

export interface CorrectiveActionTimelineProps {
  /** Timeline events */
  events: TimelineEvent[]
  /** Show user avatars */
  showAvatars?: boolean
  /** Maximum events to show (0 = all) */
  maxEvents?: number
  /** Additional CSS classes */
  className?: string
}

const variantColors = {
  info: 'bg-info text-info-foreground',
  success: 'bg-success text-success-foreground',
  warning: 'bg-warning text-warning-foreground',
  destructive: 'bg-error text-error-foreground',
  secondary: 'bg-muted-bg text-secondary',
}

const variantLineColors = {
  info: 'bg-info/30',
  success: 'bg-success/30',
  warning: 'bg-warning/30',
  destructive: 'bg-error/30',
  secondary: 'bg-muted-bg',
}

export function CorrectiveActionTimeline({
  events,
  showAvatars = true,
  maxEvents = 0,
  className,
}: CorrectiveActionTimelineProps) {
  // Sort events by timestamp (newest first)
  const sortedEvents = [...events].sort((a, b) => {
    const dateA = new Date(a.timestamp).getTime()
    const dateB = new Date(b.timestamp).getTime()
    return dateB - dateA
  })

  // Limit events if maxEvents is set
  const displayEvents = maxEvents > 0 ? sortedEvents.slice(0, maxEvents) : sortedEvents

  if (displayEvents.length === 0) {
    return (
      <div className={cn('text-sm text-secondary text-center py-8', className)}>
        No timeline events
      </div>
    )
  }

  return (
    <div className={cn('relative', className)}>
      {/* Timeline line */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-default" />

      <div className="space-y-6">
        {displayEvents.map((event, index) => {
          const config = TIMELINE_EVENT_CONFIG[event.type]
          const Icon = config.icon
          const isLast = index === displayEvents.length - 1

          return (
            <div key={event.id} className="relative flex gap-4 pl-0">
              {/* Icon bubble */}
              <div
                className={cn(
                  'relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                  variantColors[config.variant]
                )}
              >
                <Icon className="h-4 w-4" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pt-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-primary">
                    {config.label}
                  </span>
                  {event.user && showAvatars && (
                    <span className="text-sm text-secondary">
                      by {getUserDisplayName(event.user)}
                    </span>
                  )}
                </div>

                {/* Details/changes */}
                {event.details && (
                  <p className="text-sm text-secondary mt-1">{event.details}</p>
                )}

                {/* Value changes */}
                {(event.previousValue || event.newValue) && (
                  <div className="text-sm mt-1">
                    {event.previousValue && (
                      <span className="text-tertiary line-through mr-2">
                        {event.previousValue}
                      </span>
                    )}
                    {event.newValue && (
                      <span className="text-primary">{event.newValue}</span>
                    )}
                  </div>
                )}

                {/* Timestamp */}
                <time className="text-xs text-tertiary mt-1 block">
                  {formatDateTime(event.timestamp)}
                </time>
              </div>
            </div>
          )
        })}
      </div>

      {/* Show more indicator */}
      {maxEvents > 0 && events.length > maxEvents && (
        <div className="text-center mt-4">
          <span className="text-sm text-secondary">
            +{events.length - maxEvents} more events
          </span>
        </div>
      )}
    </div>
  )
}

export default CorrectiveActionTimeline
