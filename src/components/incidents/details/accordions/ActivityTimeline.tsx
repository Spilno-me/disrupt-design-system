/**
 * ActivityTimeline - Activity log with timeline visualization for incidents
 *
 * Displays activities grouped by date with a visual timeline connector.
 * Features search/filter, export, and expandable notes.
 *
 * UX Laws Applied:
 * - Miller's Law: Groups activities by date for cognitive chunking
 * - Gestalt Proximity: Timeline connector creates visual grouping
 * - Fitts' Law: 44px touch targets on mobile for interactive elements
 *
 * @example
 * ```tsx
 * <ActivityTimeline
 *   activities={activities}
 *   onExport={(activities) => downloadCsv(activities)}
 *   onUserClick={(user) => navigate(`/users/${user.id}`)}
 * />
 * ```
 */

import * as React from 'react'
import { useState, useMemo, useCallback } from 'react'
import {
  Download,
  ChevronDown,
  ChevronUp,
  Clock,
  RefreshCw,
  FileText,
  UserPlus,
  Settings,
  MessageCircle,
  CheckCircle,
  AlertCircle,
  Calendar,
} from 'lucide-react'
import { cn } from '../../../../lib/utils'
import { Button } from '../../../ui/button'
import { SearchFilter } from '../../../shared/SearchFilter'
import type { FilterGroup, FilterState } from '../../../shared/SearchFilter/types'
import type { IncidentPerson } from '../types'

// =============================================================================
// TYPES
// =============================================================================

/**
 * Extended activity type for timeline display
 */
export type ActivityTimelineType =
  | 'status_change'
  | 'document_upload'
  | 'comment'
  | 'assignment'
  | 'workflow_update'
  | 'approval'
  | 'rejection'

/**
 * Activity item for the timeline
 */
export interface TimelineActivity {
  id: string
  /** Activity type determines the icon */
  type: ActivityTimelineType
  /** Main activity description (e.g., "Status changed to "Review"") */
  title: string
  /** Optional detailed note/comment that can be expanded */
  note?: string
  /** Person who performed the activity */
  user: IncidentPerson
  /** ISO timestamp of the activity */
  timestamp: string
  /** Optional metadata for additional context */
  metadata?: {
    /** Old status value */
    fromStatus?: string
    /** New status value */
    toStatus?: string
    /** Document name if type is document_upload */
    documentName?: string
    /** Workflow name if type is workflow_update */
    workflowName?: string
  }
}

/**
 * Props for ActivityTimeline component
 */
export interface ActivityTimelineProps {
  /** List of activities to display */
  activities: TimelineActivity[]
  /** Callback when export button is clicked */
  onExport?: (activities: TimelineActivity[]) => void
  /** Callback when a user name is clicked */
  onUserClick?: (user: IncidentPerson) => void
  /** Maximum activities to show before pagination (default: all) */
  maxItems?: number
  /** Show search bar (default: true) */
  showSearch?: boolean
  /** Show export button (default: true) */
  showExport?: boolean
  /** Additional className */
  className?: string
}

// =============================================================================
// CONSTANTS
// =============================================================================

/**
 * Human-readable labels for activity types
 */
const ACTIVITY_TYPE_LABELS: Record<ActivityTimelineType, string> = {
  status_change: 'Status Change',
  document_upload: 'Document Upload',
  comment: 'Comment',
  assignment: 'Assignment',
  workflow_update: 'Workflow Update',
  approval: 'Approval',
  rejection: 'Rejection',
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Group activities by relative date (Today, Yesterday, X days ago)
 */
function groupActivitiesByDate(activities: TimelineActivity[]): Map<string, TimelineActivity[]> {
  const groups = new Map<string, TimelineActivity[]>()
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  // Sort activities by timestamp (newest first)
  const sorted = [...activities].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )

  sorted.forEach((activity) => {
    const activityDate = new Date(activity.timestamp)
    const activityDay = new Date(
      activityDate.getFullYear(),
      activityDate.getMonth(),
      activityDate.getDate()
    )

    let dateKey: string
    if (activityDay.getTime() === today.getTime()) {
      dateKey = 'Today'
    } else if (activityDay.getTime() === yesterday.getTime()) {
      dateKey = 'Yesterday'
    } else {
      const diffDays = Math.floor(
        (today.getTime() - activityDay.getTime()) / (1000 * 60 * 60 * 24)
      )
      dateKey = `${diffDays} days ago`
    }

    const existing = groups.get(dateKey) || []
    groups.set(dateKey, [...existing, activity])
  })

  return groups
}

/**
 * Format timestamp as relative time (e.g., "2h ago", "1d ago")
 */
function formatRelativeTime(timestamp: string): string {
  const now = new Date()
  const then = new Date(timestamp)
  const diffMs = now.getTime() - then.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  return `${diffDays}d ago`
}

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

/**
 * Activity type to icon mapping
 *
 * WCAG AA Contrast Fix:
 * - Light mode: -dark/-strong text variants for contrast on light tinted backgrounds
 * - Dark mode: Standard bright colors + accent-strong backgrounds (visible on dark surface)
 *
 * Background note: `bg-accent/10` uses surface elevation in dark mode (nearly invisible).
 * Using `dark:bg-accent-strong/15` ensures visible tinted backgrounds in both themes.
 */
const ACTIVITY_ICONS: Record<
  ActivityTimelineType,
  { icon: React.ComponentType<{ className?: string }>; colorClass: string }
> = {
  status_change: {
    icon: RefreshCw,
    colorClass: 'bg-accent-bg dark:bg-accent-strong/15 text-accent-dark dark:text-accent'
  },
  document_upload: {
    icon: FileText,
    colorClass: 'bg-info/10 dark:bg-info/15 text-info'
  },
  comment: {
    icon: MessageCircle,
    colorClass: 'bg-accent-bg dark:bg-accent-strong/15 text-accent-dark dark:text-accent'
  },
  assignment: {
    icon: UserPlus,
    colorClass: 'bg-warning/10 dark:bg-warning/15 text-warning-dark dark:text-warning'
  },
  workflow_update: {
    icon: Settings,
    colorClass: 'bg-secondary/10 dark:bg-secondary/15 text-secondary'
  },
  approval: {
    icon: CheckCircle,
    colorClass: 'bg-success/10 dark:bg-success/15 text-success-strong dark:text-success'
  },
  rejection: {
    icon: AlertCircle,
    colorClass: 'bg-error/10 dark:bg-error/15 text-error'
  },
}

/**
 * Icon component for activity type
 */
function ActivityIcon({ type }: { type: ActivityTimelineType }) {
  const { icon: Icon, colorClass } = ACTIVITY_ICONS[type] || ACTIVITY_ICONS.status_change

  return (
    <div
      className={cn(
        'size-8 rounded-full flex items-center justify-center flex-shrink-0',
        colorClass
      )}
    >
      <Icon className="size-4" aria-hidden="true" />
    </div>
  )
}

/**
 * Date group header with calendar icon
 */
function DateHeader({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 py-2">
      <div className="flex items-center gap-1.5 px-2 py-1 bg-muted-bg rounded-md">
        <Calendar className="size-3.5 text-tertiary" aria-hidden="true" />
        <span className="text-xs font-medium text-secondary">{label}</span>
      </div>
    </div>
  )
}

/**
 * Expandable note component
 */
function ExpandableNote({ note }: { note: string }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const shouldTruncate = note.length > 150

  return (
    <div className="mt-2 ml-0 md:ml-11">
      <div className="bg-muted-bg/50 rounded-lg px-3 py-2">
        <p
          className={cn(
            'text-sm text-primary leading-relaxed',
            !isExpanded && shouldTruncate && 'line-clamp-2'
          )}
        >
          &ldquo;{note}&rdquo;
        </p>
        {shouldTruncate && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 mt-1 text-xs font-medium text-link hover:text-link-hover transition-colors min-h-[44px] md:min-h-0"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="size-3" />
                Show less
              </>
            ) : (
              <>
                <ChevronDown className="size-3" />
                Show more
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}

/**
 * Single activity item in the timeline
 */
function ActivityItem({
  activity,
  onUserClick,
  isLast,
}: {
  activity: TimelineActivity
  onUserClick?: (user: IncidentPerson) => void
  isLast: boolean
}) {
  return (
    <div className="relative flex gap-3 pb-4">
      {/* Timeline connector line - uses border color for visibility in both themes */}
      {!isLast && (
        <div
          className="absolute left-4 top-8 bottom-0 w-px"
          style={{ backgroundColor: 'var(--border)' }}
          aria-hidden="true"
        />
      )}

      {/* Icon */}
      <ActivityIcon type={activity.type} />

      {/* Content */}
      <div className="flex-1 min-w-0 pt-1">
        {/* Title and user */}
        <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
          <span className="text-sm text-primary">{activity.title}</span>
          {activity.user && (
            <>
              <span className="text-sm text-secondary">by</span>
              {onUserClick ? (
                <button
                  onClick={() => onUserClick(activity.user)}
                  className="text-sm font-medium text-link hover:text-link-hover hover:underline transition-colors min-h-[44px] md:min-h-0 flex items-center"
                >
                  {activity.user.name}
                </button>
              ) : (
                <span className="text-sm font-medium text-link">{activity.user.name}</span>
              )}
            </>
          )}
        </div>

        {/* Expandable note */}
        {activity.note && <ExpandableNote note={activity.note} />}

        {/* Timestamp - uses text-secondary for WCAG AA contrast (5.7:1 in dark mode) */}
        <div className="flex items-center gap-1 mt-1.5">
          <Clock className="size-3 text-secondary" aria-hidden="true" />
          <span className="text-xs text-secondary">{formatRelativeTime(activity.timestamp)}</span>
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

/**
 * ActivityTimeline - Activity log with timeline visualization
 *
 * Features:
 * - Date grouping (Today, Yesterday, X days ago)
 * - Timeline connector visualization
 * - Expandable notes
 * - Search/filter functionality
 * - Export capability
 * - Mobile responsive (44px touch targets)
 */
export function ActivityTimeline({
  activities,
  onExport,
  onUserClick,
  maxItems,
  showSearch = true,
  showExport = true,
  className,
}: ActivityTimelineProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<FilterState>({})
  const [showAll, setShowAll] = useState(false)

  // Filter groups for SearchFilter
  const filterGroups: FilterGroup[] = useMemo(() => [
    {
      key: 'type',
      label: 'Activity Type',
      options: Object.entries(ACTIVITY_TYPE_LABELS).map(([id, label]) => ({ id, label })),
    },
  ], [])

  // Handlers with state reset
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value)
    setShowAll(false)
  }, [])

  const handleFiltersChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters)
    setShowAll(false)
  }, [])

  // Filter activities based on search query and filters
  const filteredActivities = useMemo(() => {
    return activities.filter((activity) => {
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        const matchesSearch =
          activity.title.toLowerCase().includes(query) ||
          activity.user.name.toLowerCase().includes(query) ||
          activity.note?.toLowerCase().includes(query) ||
          activity.type.toLowerCase().includes(query)
        if (!matchesSearch) return false
      }

      // Type filter (from FilterState)
      const selectedTypes = filters.type || []
      if (selectedTypes.length > 0 && !selectedTypes.includes(activity.type)) return false

      return true
    })
  }, [activities, searchQuery, filters])

  // Apply max items limit if set and not showing all
  const displayedActivities = useMemo(() => {
    if (!maxItems || showAll) return filteredActivities
    return filteredActivities.slice(0, maxItems)
  }, [filteredActivities, maxItems, showAll])

  // Group activities by date
  const groupedActivities = useMemo(
    () => groupActivitiesByDate(displayedActivities),
    [displayedActivities]
  )

  // Handle export
  const handleExport = useCallback(() => {
    if (onExport) {
      onExport(filteredActivities)
    }
  }, [onExport, filteredActivities])

  const hasMoreItems = maxItems && filteredActivities.length > maxItems && !showAll
  const isFiltered = searchQuery.trim().length > 0 || Object.values(filters).some(arr => arr.length > 0)

  return (
    <div className={cn('flex flex-col', className)} data-slot="activity-timeline">
      {/* Search, Filters & Export */}
      {(showSearch || showExport) && (
        <div className="flex items-center gap-3 mb-4">
          {/* SearchFilter */}
          {showSearch && (
            <div className="flex-1">
              <SearchFilter
                placeholder="Search activities..."
                value={searchQuery}
                onChange={handleSearchChange}
                filterGroups={filterGroups}
                filters={filters}
                onFiltersChange={handleFiltersChange}
                size="compact"
              />
            </div>
          )}

          {/* Export button */}
          {showExport && onExport && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="h-9 gap-2 whitespace-nowrap flex-shrink-0"
              data-testid="activity-export-button"
            >
              <Download className="size-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          )}
        </div>
      )}

      {/* Results count when filtered */}
      {isFiltered && (
        <p className="text-xs text-secondary mb-3">
          {filteredActivities.length} result{filteredActivities.length !== 1 ? 's' : ''} found
        </p>
      )}

      {/* Empty state */}
      {displayedActivities.length === 0 && (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Clock className="size-8 text-tertiary mb-2" />
          <p className="text-sm text-secondary">
            {isFiltered ? 'No activities match your filters' : 'No activities yet'}
          </p>
          {isFiltered && (
            <p className="text-xs text-tertiary mt-1">
              Try adjusting your search or filters
            </p>
          )}
        </div>
      )}

      {/* Timeline content */}
      {displayedActivities.length > 0 && (
        <div className="space-y-2">
          {Array.from(groupedActivities.entries()).map(([dateKey, dateActivities]) => (
            <div key={dateKey}>
              {/* Date header */}
              <DateHeader label={dateKey} />

              {/* Activities for this date - border-accent-strong maintains teal in both themes */}
              <div className="ml-2 pl-2 border-l-2 border-accent-strong">
                {dateActivities.map((activity, index) => (
                  <ActivityItem
                    key={activity.id}
                    activity={activity}
                    onUserClick={onUserClick}
                    isLast={index === dateActivities.length - 1}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Show more button */}
      {hasMoreItems && (
        <button
          onClick={() => setShowAll(true)}
          className="flex items-center justify-center gap-1 mt-4 py-3 text-sm font-medium text-link hover:text-link-hover transition-colors"
          data-testid="activity-show-more"
        >
          <ChevronDown className="size-4" />
          Show {filteredActivities.length - maxItems} more activities
        </button>
      )}
    </div>
  )
}

export default ActivityTimeline
