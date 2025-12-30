/**
 * PersonCard - Directory person display card
 *
 * Shows person info with quick contact actions.
 * Supports compact (list) and full (detail) variants.
 */

import * as React from 'react'
import { Mail, Phone, User, ExternalLink, ArrowUpRight } from 'lucide-react'
import { cn } from '../../../../lib/utils'
import { Badge } from '../../../../components/ui/badge'
import { Button } from '../../../../components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../../../components/ui/tooltip'
import { ROLE_LEVEL_CONFIG } from '../../users/types'
import { ComplianceBadge } from '../../training/components/ComplianceBadge'
import type { PersonCardProps, DirectoryPerson, AssignmentType } from '../types'

// Assignment type badge config
const ASSIGNMENT_TYPE_CONFIG: Record<AssignmentType, { label: string; className: string }> = {
  direct: { label: 'D', className: 'bg-accent/10 text-accent border-accent/30' },
  inherited: { label: 'I', className: 'bg-muted-bg text-secondary border-default' },
}

/**
 * Get initials from first and last name
 */
function getInitials(firstName: string, lastName: string): string {
  return `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase()
}

/**
 * Simple Avatar component with initials fallback
 */
function PersonAvatar({
  avatarUrl,
  initials,
  className,
}: {
  avatarUrl?: string
  initials: string
  className?: string
}) {
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt=""
        className={cn('rounded-full object-cover bg-muted-bg', className)}
      />
    )
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full bg-accent/10 text-accent font-medium',
        className
      )}
    >
      {initials}
    </div>
  )
}

export function PersonCard({
  person,
  currentLocation,
  variant = 'compact',
  onClick,
  onEmail,
  onCall,
  onViewProfile,
}: PersonCardProps) {
  const initials = getInitials(person.firstName, person.lastName)
  const fullName = `${person.firstName} ${person.lastName}`
  const roleLevelConfig = ROLE_LEVEL_CONFIG[person.roleLevel]
  const assignmentConfig = ASSIGNMENT_TYPE_CONFIG[person.assignmentType]

  const handleEmailClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onEmail?.(person.email)
  }

  const handleCallClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (person.phone) {
      onCall?.(person.phone)
    }
  }

  const handleViewProfile = (e: React.MouseEvent) => {
    e.stopPropagation()
    onViewProfile?.(person.id)
  }

  if (variant === 'compact') {
    return (
      <div
        className={cn(
          'group flex items-center gap-3 p-3 rounded-lg transition-colors',
          'bg-surface hover:bg-muted-bg/50 cursor-pointer',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong'
        )}
        onClick={onClick}
        tabIndex={0}
        role="button"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onClick?.()
          }
        }}
      >
        {/* Avatar */}
        <PersonAvatar
          avatarUrl={person.avatarUrl}
          initials={initials}
          className="size-10 shrink-0 text-sm"
        />

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-primary truncate">
              {fullName}
            </span>
            {/* Assignment type badge */}
            <Badge
              variant="outline"
              size="sm"
              className={cn('text-[10px] px-1 py-0', assignmentConfig.className)}
            >
              {assignmentConfig.label}
            </Badge>
            {/* Training compliance badge */}
            {person.trainingStatus && (
              <ComplianceBadge
                status={person.trainingStatus.complianceStatus}
                size="sm"
              />
            )}
          </div>
          <p className="text-xs text-secondary truncate">
            {person.jobTitle} • {person.department}
          </p>
        </div>

        {/* Quick actions (visible on hover) */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="size-8 p-0"
                onClick={handleEmailClick}
              >
                <Mail className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Send email</TooltipContent>
          </Tooltip>

          {person.phone && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="size-8 p-0"
                  onClick={handleCallClick}
                >
                  <Phone className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Call</TooltipContent>
            </Tooltip>
          )}

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="size-8 p-0"
                onClick={handleViewProfile}
              >
                <User className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>View profile</TooltipContent>
          </Tooltip>
        </div>
      </div>
    )
  }

  // Full variant (for detail views)
  return (
    <div
      className={cn(
        'flex flex-col gap-4 p-4 rounded-xl border border-default bg-surface',
        'hover:border-accent/30 hover:shadow-sm transition-all cursor-pointer'
      )}
      onClick={onClick}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick?.()
        }
      }}
    >
      {/* Header */}
      <div className="flex items-start gap-4">
        <PersonAvatar
          avatarUrl={person.avatarUrl}
          initials={initials}
          className="size-14 shrink-0 text-lg"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base font-semibold text-primary">
              {fullName}
            </h3>
            <Badge
              variant="outline"
              size="sm"
              className={cn('text-xs', assignmentConfig.className)}
            >
              {person.assignmentType === 'direct' ? 'Direct' : 'Inherited'}
            </Badge>
          </div>
          <p className="text-sm text-secondary mt-0.5">
            {person.jobTitle}
          </p>
          <p className="text-xs text-tertiary">
            {person.department}
          </p>
        </div>

        {/* Badges */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Training compliance badge */}
          {person.trainingStatus && (
            <Tooltip>
              <TooltipTrigger>
                <ComplianceBadge
                  status={person.trainingStatus.complianceStatus}
                  size="sm"
                />
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-xs">
                  <p className="font-medium mb-1">Training Compliance</p>
                  <p>{person.trainingStatus.completed}/{person.trainingStatus.totalRequired} completed</p>
                  {person.trainingStatus.overdue > 0 && (
                    <p className="text-destructive">{person.trainingStatus.overdue} overdue</p>
                  )}
                  {person.trainingStatus.expiringSoon > 0 && (
                    <p className="text-warning">{person.trainingStatus.expiringSoon} expiring soon</p>
                  )}
                  {person.trainingStatus.nextExpiration && (
                    <p className="mt-1 text-secondary">
                      Next: {person.trainingStatus.nextExpiration.courseName} ({person.trainingStatus.nextExpiration.daysUntil}d)
                    </p>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          )}
          {/* Role level badge */}
          <Badge variant={roleLevelConfig.badgeVariant} size="sm">
            {roleLevelConfig.label}
          </Badge>
        </div>
      </div>

      {/* Inherited source */}
      {person.assignmentType === 'inherited' && person.inheritedFrom && (
        <div className="flex items-center gap-2 text-xs text-secondary bg-muted-bg/50 rounded-md px-3 py-2">
          <ArrowUpRight className="size-3" />
          <span>Inherited from {person.inheritedFrom}</span>
        </div>
      )}

      {/* Contact actions */}
      <div className="flex items-center gap-2 pt-2 border-t border-default">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 gap-1.5"
          onClick={handleEmailClick}
        >
          <Mail className="size-4" />
          Email
        </Button>

        {person.phone && (
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-1.5"
            onClick={handleCallClick}
          >
            <Phone className="size-4" />
            Call
          </Button>
        )}

        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5"
          onClick={handleViewProfile}
        >
          <ExternalLink className="size-4" />
          Profile
        </Button>
      </div>
    </div>
  )
}

PersonCard.displayName = 'PersonCard'

export default PersonCard
