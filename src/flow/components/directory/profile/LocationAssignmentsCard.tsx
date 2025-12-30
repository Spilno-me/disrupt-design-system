/**
 * LocationAssignmentsCard - Work locations card for user profile
 *
 * Shows all locations where user has role assignments.
 */

import * as React from 'react'
import { MapPin, ChevronRight, Badge as BadgeIcon } from 'lucide-react'
import { cn } from '../../../../lib/utils'
import { Badge } from '../../../../components/ui/badge'
import type { UserProfileData } from '../types'
import type { RoleAssignment, LocationScope } from '../../users/types'

interface LocationAssignmentsCardProps {
  /** User profile data */
  profile: UserProfileData
  /** Callback when location is clicked */
  onLocationClick?: (locationId: string) => void
}

interface LocationAssignmentItemProps {
  assignment: RoleAssignment
  isPrimary: boolean
  onClick?: () => void
}

function LocationAssignmentItem({
  assignment,
  isPrimary,
  onClick,
}: LocationAssignmentItemProps) {
  return (
    <div className="space-y-2 py-3 border-b border-default last:border-b-0">
      {assignment.scopes.map((scope, index) => (
        <button
          key={scope.id}
          type="button"
          className={cn(
            'w-full flex items-center gap-3 p-3 rounded-lg transition-colors',
            'hover:bg-muted-bg/50 text-left',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong',
            onClick && 'cursor-pointer'
          )}
          onClick={onClick}
          disabled={!onClick}
        >
          <div
            className={cn(
              'flex items-center justify-center size-10 rounded-full shrink-0',
              isPrimary && index === 0
                ? 'bg-accent/10'
                : 'bg-muted-bg'
            )}
          >
            <MapPin
              className={cn(
                'size-5',
                isPrimary && index === 0 ? 'text-accent' : 'text-tertiary'
              )}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-primary truncate">
                {scope.locationName}
              </p>
              {isPrimary && index === 0 && (
                <Badge variant="success" size="sm">
                  Primary
                </Badge>
              )}
            </div>
            <p className="text-xs text-secondary truncate">
              {scope.locationPath.join(' → ')}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" size="sm" className="gap-1">
                <BadgeIcon className="size-3" />
                {assignment.role.name}
              </Badge>
              {scope.includeChildren && (
                <Badge variant="secondary" size="sm">
                  + Children
                </Badge>
              )}
            </div>
          </div>

          {onClick && (
            <ChevronRight className="size-4 text-tertiary shrink-0" />
          )}
        </button>
      ))}
    </div>
  )
}

export function LocationAssignmentsCard({
  profile,
  onLocationClick,
}: LocationAssignmentsCardProps) {
  if (profile.roleAssignments.length === 0) {
    return (
      <div className="p-4 bg-surface border border-default rounded-xl">
        <h3 className="text-sm font-semibold text-primary mb-3">
          Work Locations
        </h3>
        <div className="py-6 text-center">
          <MapPin className="size-8 text-tertiary mx-auto mb-2" />
          <p className="text-sm text-secondary">No locations assigned</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 bg-surface border border-default rounded-xl">
      <h3 className="text-sm font-semibold text-primary mb-3">
        Work Locations
      </h3>

      <div>
        {profile.roleAssignments.map((assignment, index) => (
          <LocationAssignmentItem
            key={assignment.id}
            assignment={assignment}
            isPrimary={index === 0}
            onClick={
              onLocationClick && assignment.scopes[0]
                ? () => onLocationClick(assignment.scopes[0].locationId)
                : undefined
            }
          />
        ))}
      </div>
    </div>
  )
}

LocationAssignmentsCard.displayName = 'LocationAssignmentsCard'

export default LocationAssignmentsCard
