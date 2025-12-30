/**
 * PeopleList - Main list component for directory people
 *
 * Displays people grouped by role level with collapsible sections.
 * Handles filtering between direct and inherited users.
 */

import * as React from 'react'
import { Users } from 'lucide-react'
import { PeopleGroupSection } from './PeopleGroupSection'
import { ROLE_LEVEL_CONFIG, type RoleLevel } from '../../users/types'
import type { DirectoryPerson, PeopleByRoleLevel } from '../types'

interface PeopleListProps {
  /** People to display */
  people: DirectoryPerson[]
  /** Whether to show inherited users */
  showInherited: boolean
  /** Callbacks */
  onPersonClick: (person: DirectoryPerson) => void
  onEmail: (email: string) => void
  onCall?: (phone: string) => void
  onViewProfile: (userId: string) => void
}

/**
 * Group people by their role level for hierarchical display
 */
function groupPeopleByRoleLevel(
  people: DirectoryPerson[],
  showInherited: boolean
): PeopleByRoleLevel[] {
  // Filter by assignment type if needed
  const filteredPeople = showInherited
    ? people
    : people.filter((p) => p.assignmentType === 'direct')

  // Create groups for each role level
  const groups: PeopleByRoleLevel[] = (
    [1, 2, 3, 4, 5] as RoleLevel[]
  ).map((level) => {
    const config = ROLE_LEVEL_CONFIG[level]
    return {
      level,
      label: config.label,
      description: config.description,
      badgeVariant: config.badgeVariant,
      iconColor: config.iconColor,
      people: filteredPeople.filter((p) => p.roleLevel === level),
    }
  })

  // Filter out empty groups
  return groups.filter((g) => g.people.length > 0)
}

export function PeopleList({
  people,
  showInherited,
  onPersonClick,
  onEmail,
  onCall,
  onViewProfile,
}: PeopleListProps) {
  const groupedPeople = React.useMemo(
    () => groupPeopleByRoleLevel(people, showInherited),
    [people, showInherited]
  )

  if (groupedPeople.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-muted-bg mb-3">
          <Users className="size-6 text-tertiary" />
        </div>
        <p className="text-sm font-medium text-primary mb-1">
          No people found
        </p>
        <p className="text-xs text-secondary">
          {showInherited
            ? 'No users are assigned to this location'
            : 'No direct assignments. Try showing inherited users.'}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {groupedPeople.map((group) => (
        <PeopleGroupSection
          key={group.level}
          group={group}
          defaultExpanded={true}
          onPersonClick={onPersonClick}
          onEmail={onEmail}
          onCall={onCall}
          onViewProfile={onViewProfile}
        />
      ))}
    </div>
  )
}

PeopleList.displayName = 'PeopleList'

export default PeopleList
