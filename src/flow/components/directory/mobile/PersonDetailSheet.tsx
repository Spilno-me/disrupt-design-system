/**
 * PersonDetailSheet - Bottom sheet for mobile person details
 *
 * Renders person details in a bottom sheet that slides up from the bottom.
 * Shows contact info, role, and quick actions.
 *
 * Features:
 * - 60vh height for comfortable viewing
 * - Drag handle for visual affordance
 * - Quick contact actions (email, call)
 * - Link to full profile page
 */

import * as React from 'react'
import { GripHorizontal, Mail, Phone, ExternalLink, ArrowUpRight, User } from 'lucide-react'
import { cn } from '../../../../lib/utils'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '../../../../components/ui/sheet'
import { Button } from '../../../../components/ui/button'
import { Badge } from '../../../../components/ui/badge'
import { ROLE_LEVEL_CONFIG } from '../../users/types'
import type { PersonDetailSheetProps, DirectoryPerson, AssignmentType } from '../types'

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
        'flex items-center justify-center rounded-full bg-accent/10 text-accent font-semibold',
        className
      )}
    >
      {initials}
    </div>
  )
}

function getInitials(firstName: string, lastName: string): string {
  return `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase()
}

export function PersonDetailSheet({
  person,
  location,
  open,
  onOpenChange,
  onViewProfile,
  onEmail,
  onCall,
}: PersonDetailSheetProps) {
  if (!person) return null

  const initials = getInitials(person.firstName, person.lastName)
  const fullName = `${person.firstName} ${person.lastName}`
  const roleLevelConfig = ROLE_LEVEL_CONFIG[person.roleLevel]

  const handleEmail = () => {
    onEmail(person.email)
    onOpenChange(false)
  }

  const handleCall = () => {
    if (person.phone && onCall) {
      onCall(person.phone)
      onOpenChange(false)
    }
  }

  const handleViewProfile = () => {
    onViewProfile(person.id)
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="h-auto max-h-[70vh] rounded-t-2xl flex flex-col overflow-hidden"
        hideCloseButton
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="flex items-center justify-center w-12 h-1.5 rounded-full bg-muted-bg">
            <GripHorizontal className="size-4 text-tertiary" />
          </div>
        </div>

        {/* Header */}
        <SheetHeader className="px-4 pb-4 border-b border-default">
          <div className="flex items-center gap-4">
            <PersonAvatar
              avatarUrl={person.avatarUrl}
              initials={initials}
              className="size-16 text-xl"
            />
            <div className="flex-1 min-w-0">
              <SheetTitle className="text-lg font-semibold text-primary truncate">
                {fullName}
              </SheetTitle>
              <p className="text-sm text-secondary truncate">
                {person.jobTitle}
              </p>
              <p className="text-xs text-tertiary truncate">
                {person.department}
              </p>
            </div>
            <Badge variant={roleLevelConfig.badgeVariant} size="sm" className="shrink-0">
              {roleLevelConfig.label}
            </Badge>
          </div>
        </SheetHeader>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 space-y-4">
          {/* Assignment info */}
          <div className="flex items-center gap-2 text-sm text-secondary bg-muted-bg/50 rounded-lg px-3 py-2.5">
            <Badge
              variant="outline"
              size="sm"
              className={cn(
                person.assignmentType === 'direct'
                  ? 'bg-accent/10 text-accent border-accent/30'
                  : 'bg-muted-bg text-secondary border-default'
              )}
            >
              {person.assignmentType === 'direct' ? 'Direct' : 'Inherited'}
            </Badge>
            {location && (
              <span className="truncate">at {location.name}</span>
            )}
            {person.assignmentType === 'inherited' && person.inheritedFrom && (
              <span className="flex items-center gap-1 text-xs">
                <ArrowUpRight className="size-3" />
                from {person.inheritedFrom}
              </span>
            )}
          </div>

          {/* Contact details */}
          <div className="space-y-3">
            {/* Email */}
            <div className="flex items-center gap-3 p-3 rounded-lg border border-default">
              <div className="flex items-center justify-center size-10 rounded-full bg-accent/10">
                <Mail className="size-5 text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-tertiary">Email</p>
                <p className="text-sm font-medium text-primary truncate">
                  {person.email}
                </p>
              </div>
            </div>

            {/* Phone */}
            {person.phone && (
              <div className="flex items-center gap-3 p-3 rounded-lg border border-default">
                <div className="flex items-center justify-center size-10 rounded-full bg-accent/10">
                  <Phone className="size-5 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-tertiary">Phone</p>
                  <p className="text-sm font-medium text-primary">
                    {person.phone}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-default flex gap-3">
          <Button
            className="flex-1 gap-2"
            onClick={handleEmail}
          >
            <Mail className="size-4" />
            Email
          </Button>

          {person.phone && onCall && (
            <Button
              variant="secondary"
              className="flex-1 gap-2"
              onClick={handleCall}
            >
              <Phone className="size-4" />
              Call
            </Button>
          )}

          <Button
            variant="outline"
            className="gap-2"
            onClick={handleViewProfile}
          >
            <User className="size-4" />
            Profile
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

PersonDetailSheet.displayName = 'PersonDetailSheet'

export default PersonDetailSheet
