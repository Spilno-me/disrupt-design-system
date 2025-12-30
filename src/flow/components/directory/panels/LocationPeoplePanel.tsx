/**
 * LocationPeoplePanel - Right panel showing people at selected location
 *
 * Features:
 * - Location header with breadcrumb
 * - Toggle for inherited vs direct users
 * - People list grouped by role level
 * - Empty state when no location selected
 */

import * as React from 'react'
import { MapPin, Users, Eye, EyeOff, ChevronRight } from 'lucide-react'
import { cn } from '../../../../lib/utils'
import { Button } from '../../../../components/ui/button'
import { Badge } from '../../../../components/ui/badge'
import { Skeleton } from '../../../../components/ui/Skeleton'
import { PeopleList } from '../people/PeopleList'
import type {
  LocationPeoplePanelProps,
  LocationWithPeople,
  DirectoryPerson,
} from '../types'

/**
 * Empty state when no location is selected - Glass styling
 */
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-16 text-center px-6">
      <div className="flex size-16 items-center justify-center rounded-full bg-white/40 dark:bg-black/40 backdrop-blur-[4px] border-2 border-accent/20 shadow-sm mb-4">
        <Users className="size-8 text-accent" />
      </div>
      <h3 className="text-lg font-semibold text-primary mb-2">
        Select a location
      </h3>
      <p className="text-sm text-secondary max-w-sm">
        Choose a location from the tree to view the people working there.
      </p>
    </div>
  )
}

/**
 * Loading skeleton
 */
function LoadingState() {
  return (
    <div className="space-y-6 p-4">
      <div className="space-y-2">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    </div>
  )
}

export function LocationPeoplePanel({
  location,
  peopleByLevel,
  showInherited,
  isLoading = false,
  onToggleInherited,
  onPersonClick,
  onViewProfile,
}: LocationPeoplePanelProps) {
  if (isLoading) {
    return <LoadingState />
  }

  if (!location) {
    return <EmptyState />
  }

  // Flatten people from all role levels
  const allPeople = peopleByLevel.flatMap((g) => g.people)

  // Count direct vs inherited
  const directCount = allPeople.filter((p) => p.assignmentType === 'direct').length
  const inheritedCount = allPeople.filter((p) => p.assignmentType === 'inherited').length

  const handleEmail = (email: string) => {
    window.location.href = `mailto:${email}`
  }

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header - Glass depth 2 with elevation */}
      <div className="px-4 py-4 border-b border-accent/20 bg-white/40 dark:bg-black/40 backdrop-blur-[4px] sticky top-0 z-10">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {/* Location name */}
            <div className="flex items-center gap-2">
              <MapPin className="size-5 text-accent-strong shrink-0" />
              <h2 className="text-lg font-semibold text-primary truncate">
                {location.name}
              </h2>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-3 mt-2 text-sm">
              <Badge
                variant="outline"
                size="sm"
                className="bg-accent/10 text-accent border-accent/30 gap-1"
              >
                <Users className="size-3" />
                {directCount} direct
              </Badge>
              {inheritedCount > 0 && (
                <Badge
                  variant="outline"
                  size="sm"
                  className="bg-muted-bg text-secondary border-default gap-1"
                >
                  <Users className="size-3" />
                  {inheritedCount} inherited
                </Badge>
              )}
            </div>
          </div>

          {/* Inherited toggle */}
          {inheritedCount > 0 && (
            <Button
              size="sm"
              variant={showInherited ? 'secondary' : 'outline'}
              onClick={() => onToggleInherited(!showInherited)}
              className="gap-1.5 shrink-0"
            >
              {showInherited ? (
                <>
                  <Eye className="size-4" />
                  <span className="hidden sm:inline">Show all</span>
                </>
              ) : (
                <>
                  <EyeOff className="size-4" />
                  <span className="hidden sm:inline">Direct only</span>
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* People list */}
      <div className="flex-1 overflow-auto p-4">
        <PeopleList
          people={allPeople}
          showInherited={showInherited}
          onPersonClick={onPersonClick}
          onEmail={handleEmail}
          onCall={handleCall}
          onViewProfile={onViewProfile}
        />
      </div>
    </div>
  )
}

LocationPeoplePanel.displayName = 'LocationPeoplePanel'

export default LocationPeoplePanel
