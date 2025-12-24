/**
 * UserActivitySheet - Slide-over panel for user activity timeline
 *
 * Shows login history, permission changes, and other user events.
 */

import * as React from 'react'
import {
  LogIn,
  LogOut,
  Key,
  ShieldPlus,
  ShieldMinus,
  MapPin,
  UserCog,
  UserPen,
  UserPlus,
  History,
} from 'lucide-react'
import { cn } from '../../../../lib/utils'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '../../../../components/ui/sheet'
import type { User, UserActivity, UserActivityType } from '../types'

// =============================================================================
// TYPES
// =============================================================================

interface UserActivitySheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: User | null
  activities: UserActivity[]
}

// =============================================================================
// ICON MAP
// =============================================================================

const ACTIVITY_ICONS: Record<UserActivityType, React.ElementType> = {
  login: LogIn,
  logout: LogOut,
  password_change: Key,
  role_assigned: ShieldPlus,
  role_removed: ShieldMinus,
  scope_changed: MapPin,
  status_changed: UserCog,
  profile_updated: UserPen,
  created: UserPlus,
}

const ACTIVITY_COLORS: Record<UserActivityType, string> = {
  login: 'text-success bg-success/10',
  logout: 'text-secondary bg-muted-bg',
  password_change: 'text-warning bg-warning/10',
  role_assigned: 'text-accent bg-accent/10',
  role_removed: 'text-error bg-error/10',
  scope_changed: 'text-info bg-info/10',
  status_changed: 'text-warning bg-warning/10',
  profile_updated: 'text-accent bg-accent/10',
  created: 'text-success bg-success/10',
}

const ACTIVITY_LABELS: Record<UserActivityType, string> = {
  login: 'Logged in',
  logout: 'Logged out',
  password_change: 'Password changed',
  role_assigned: 'Role assigned',
  role_removed: 'Role removed',
  scope_changed: 'Scope changed',
  status_changed: 'Status changed',
  profile_updated: 'Profile updated',
  created: 'Account created',
}

// =============================================================================
// ACTIVITY ITEM COMPONENT
// =============================================================================

interface ActivityItemProps {
  activity: UserActivity
  isLast: boolean
}

function ActivityItem({ activity, isLast }: ActivityItemProps) {
  const Icon = ACTIVITY_ICONS[activity.type] || History
  const colorClasses = ACTIVITY_COLORS[activity.type] || 'text-tertiary bg-muted-bg'
  const label = ACTIVITY_LABELS[activity.type] || activity.type

  const formattedDate = new Date(activity.timestamp).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })

  return (
    <div className="relative flex gap-4 pb-6">
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-5 top-10 h-[calc(100%-24px)] w-px bg-border-default" />
      )}

      {/* Icon */}
      <div
        className={cn(
          'relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full',
          colorClasses
        )}
      >
        <Icon className="size-5" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pt-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-medium text-primary">{activity.title || label}</p>
            {activity.details && (
              <p className="mt-0.5 text-sm text-secondary">{activity.details}</p>
            )}
          </div>
          <time className="shrink-0 text-xs text-tertiary">{formattedDate}</time>
        </div>

        {/* Performed by */}
        <p className="mt-1 text-xs text-tertiary">
          by {activity.performedBy.name}
        </p>
      </div>
    </div>
  )
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function UserActivitySheet({
  open,
  onOpenChange,
  user,
  activities,
}: UserActivitySheetProps) {
  if (!user) return null

  const fullName = `${user.firstName} ${user.lastName}`

  // Group activities by date
  const groupedActivities = React.useMemo(() => {
    const groups: Record<string, UserActivity[]> = {}

    activities.forEach((activity) => {
      const date = new Date(activity.timestamp).toLocaleDateString(undefined, {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })

      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(activity)
    })

    return Object.entries(groups)
  }, [activities])

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-accent/10">
              <History className="size-5 text-accent" />
            </div>
            <div>
              <SheetTitle>Activity History</SheetTitle>
              <SheetDescription>{fullName}</SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="mt-6">
          {activities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <History className="size-12 text-tertiary" />
              <p className="mt-4 font-medium text-primary">No activity yet</p>
              <p className="mt-1 text-sm text-secondary">
                User activity will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {groupedActivities.map(([date, dateActivities]) => (
                <div key={date}>
                  {/* Date header */}
                  <h3 className="mb-4 text-xs font-medium uppercase tracking-wide text-tertiary">
                    {date}
                  </h3>

                  {/* Activities */}
                  <div>
                    {dateActivities.map((activity, index) => (
                      <ActivityItem
                        key={activity.id}
                        activity={activity}
                        isLast={index === dateActivities.length - 1}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

UserActivitySheet.displayName = 'UserActivitySheet'

export default UserActivitySheet
