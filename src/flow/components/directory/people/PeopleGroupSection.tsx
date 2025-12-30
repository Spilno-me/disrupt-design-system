/**
 * PeopleGroupSection - Group of people by role level
 *
 * Collapsible section showing people with same role level.
 * Used in LocationPeoplePanel to organize by hierarchy.
 */

import * as React from 'react'
import { useState } from 'react'
import { ChevronDown, Users } from 'lucide-react'
import { cn } from '../../../../lib/utils'
import { Badge } from '../../../../components/ui/badge'
import { PersonCard } from './PersonCard'
import type { PeopleByRoleLevel, DirectoryPerson } from '../types'

interface PeopleGroupSectionProps {
  /** Group data with role level info and people */
  group: PeopleByRoleLevel
  /** Whether section is initially expanded */
  defaultExpanded?: boolean
  /** Callbacks */
  onPersonClick: (person: DirectoryPerson) => void
  onEmail: (email: string) => void
  onCall?: (phone: string) => void
  onViewProfile: (userId: string) => void
}

export function PeopleGroupSection({
  group,
  defaultExpanded = true,
  onPersonClick,
  onEmail,
  onCall,
  onViewProfile,
}: PeopleGroupSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  if (group.people.length === 0) return null

  return (
    <div className="space-y-2">
      {/* Section header */}
      <button
        type="button"
        className={cn(
          'w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors',
          'hover:bg-muted-bg/50',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong'
        )}
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
      >
        {/* Collapse chevron */}
        <ChevronDown
          className={cn(
            'size-4 text-tertiary transition-transform duration-200',
            !isExpanded && '-rotate-90'
          )}
        />

        {/* Level indicator */}
        <div
          className={cn(
            'flex items-center justify-center size-6 rounded-full',
            'bg-accent/10'
          )}
        >
          <Users className={cn('size-3.5', group.iconColor)} />
        </div>

        {/* Label and description */}
        <div className="flex-1 text-left">
          <span className={cn('text-sm font-semibold', group.iconColor)}>
            {group.label}
          </span>
          <span className="text-xs text-tertiary ml-2 hidden sm:inline">
            {group.description}
          </span>
        </div>

        {/* Count badge */}
        <Badge variant="secondary" size="sm" className="shrink-0">
          {group.people.length}
        </Badge>
      </button>

      {/* People list */}
      {isExpanded && (
        <div className="space-y-1 pl-6 animate-in fade-in slide-in-from-top-1 duration-200">
          {group.people.map((person) => (
            <PersonCard
              key={person.id}
              person={person}
              variant="compact"
              onClick={() => onPersonClick(person)}
              onEmail={onEmail}
              onCall={onCall}
              onViewProfile={onViewProfile}
            />
          ))}
        </div>
      )}
    </div>
  )
}

PeopleGroupSection.displayName = 'PeopleGroupSection'

export default PeopleGroupSection
