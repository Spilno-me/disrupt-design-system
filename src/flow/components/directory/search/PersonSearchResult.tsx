/**
 * PersonSearchResult - Compact person result row for search dropdown
 *
 * Displays: Avatar, Name, Job Title, Department, Location pill
 */

import * as React from 'react'
import { User, MapPin } from 'lucide-react'
import { cn } from '../../../../lib/utils'
import { Badge } from '../../../../components/ui/badge'
import { highlightMatch } from '../utils/searchUtils'
import type { DirectoryPerson } from '../types'

export interface PersonSearchResultProps {
  /** Person data */
  person: DirectoryPerson
  /** Search query for highlighting */
  query: string
  /** Location name where person works */
  locationName?: string
  /** Whether this result is keyboard-selected */
  isSelected?: boolean
  /** Click handler */
  onClick: () => void
}

/**
 * Render text with highlighted matches
 */
function HighlightedText({
  text,
  query,
  className,
}: {
  text: string
  query: string
  className?: string
}) {
  const segments = highlightMatch(text, query)

  return (
    <span className={className}>
      {segments.map((segment, i) =>
        segment.isMatch ? (
          <mark
            key={i}
            className="bg-warning/30 text-inherit rounded-sm px-0.5"
          >
            {segment.text}
          </mark>
        ) : (
          <span key={i}>{segment.text}</span>
        )
      )}
    </span>
  )
}

export function PersonSearchResult({
  person,
  query,
  locationName,
  isSelected = false,
  onClick,
}: PersonSearchResultProps) {
  const fullName = `${person.firstName} ${person.lastName}`

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors rounded-md',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset',
        isSelected
          ? 'bg-accent/10 text-primary'
          : 'hover:bg-surface-hover text-primary'
      )}
      data-slot="person-search-result"
    >
      {/* Avatar */}
      <div className="flex items-center justify-center size-8 rounded-full bg-accent/10 border border-accent/20 shrink-0">
        {person.avatarUrl ? (
          <img
            src={person.avatarUrl}
            alt=""
            className="size-8 rounded-full object-cover"
          />
        ) : (
          <User className="size-4 text-accent" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <HighlightedText
            text={fullName}
            query={query}
            className="text-sm font-medium truncate"
          />
          {/* Status indicator */}
          {person.status !== 'active' && (
            <Badge
              variant="outline"
              size="sm"
              className={cn(
                'shrink-0 text-[10px]',
                person.status === 'pending' && 'bg-warning/10 text-warning-dark border-warning/30',
                person.status === 'inactive' && 'bg-muted-bg text-secondary border-default',
                person.status === 'locked' && 'bg-error/10 text-error border-error/30'
              )}
            >
              {person.status}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-secondary truncate">
          <HighlightedText text={person.jobTitle} query={query} />
          <span className="text-tertiary">in</span>
          <HighlightedText text={person.department} query={query} />
        </div>
      </div>

      {/* Location pill */}
      {locationName && (
        <Badge
          variant="outline"
          size="sm"
          className="bg-muted-bg text-secondary border-default gap-1 shrink-0 max-w-32"
        >
          <MapPin className="size-3" />
          <span className="truncate">{locationName}</span>
        </Badge>
      )}
    </button>
  )
}

PersonSearchResult.displayName = 'PersonSearchResult'
