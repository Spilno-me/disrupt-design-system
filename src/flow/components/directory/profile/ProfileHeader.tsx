/**
 * ProfileHeader - User profile page header
 *
 * Shows avatar, name, job title, department, status, and quick actions.
 */

import * as React from 'react'
import { Mail, Phone, MessageSquare } from 'lucide-react'
import { cn } from '../../../../lib/utils'
import { Button } from '../../../../components/ui/button'
import { Badge } from '../../../../components/ui/badge'
import { USER_STATUS_CONFIG, ROLE_LEVEL_CONFIG } from '../../users/types'
import type { UserProfileData } from '../types'

interface ProfileHeaderProps {
  /** User profile data */
  profile: UserProfileData
  /** Callback to send email */
  onEmail?: (email: string) => void
  /** Callback to make phone call */
  onCall?: (phone: string) => void
  /** Callback to open Teams chat */
  onTeamsChat?: (teamsEmail: string) => void
  /** Callback to open Slack chat */
  onSlackChat?: (slackHandle: string) => void
}

/**
 * Simple Avatar component with initials fallback
 */
function ProfileAvatar({
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
        'flex items-center justify-center rounded-full bg-accent/10 text-accent font-bold',
        className
      )}
    >
      {initials}
    </div>
  )
}

export function ProfileHeader({
  profile,
  onEmail,
  onCall,
  onTeamsChat,
  onSlackChat,
}: ProfileHeaderProps) {
  const statusConfig = USER_STATUS_CONFIG[profile.status]
  const roleLevelConfig = ROLE_LEVEL_CONFIG[profile.highestRoleLevel]

  const handleEmail = () => {
    onEmail?.(profile.email)
  }

  const handleCall = () => {
    if (profile.phone) {
      onCall?.(profile.phone)
    }
  }

  const handleTeamsChat = () => {
    if (profile.teamsEmail) {
      onTeamsChat?.(profile.teamsEmail)
    }
  }

  const handleSlackChat = () => {
    if (profile.slackHandle) {
      onSlackChat?.(profile.slackHandle)
    }
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 bg-surface border border-default rounded-xl">
      {/* Avatar */}
      <ProfileAvatar
        avatarUrl={profile.avatarUrl}
        initials={profile.initials}
        className="size-20 sm:size-24 text-2xl sm:text-3xl shrink-0"
      />

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <h1 className="text-xl sm:text-2xl font-bold text-primary">
            {profile.fullName}
          </h1>
          <Badge variant={statusConfig.variant} size="sm">
            {statusConfig.label}
          </Badge>
        </div>

        <p className="text-base text-secondary">
          {profile.jobTitle}
        </p>
        <p className="text-sm text-tertiary">
          {profile.department}
        </p>

        {/* Role level indicator */}
        <div className="flex items-center gap-2 mt-2">
          <Badge variant={roleLevelConfig.badgeVariant} size="sm">
            {roleLevelConfig.label}
          </Badge>
          {profile.isEmergencyContact && (
            <Badge variant="destructive" size="sm">
              Emergency Contact
            </Badge>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-2 shrink-0">
        <Button
          variant="default"
          size="sm"
          className="gap-1.5"
          onClick={handleEmail}
        >
          <Mail className="size-4" />
          <span className="hidden sm:inline">Email</span>
        </Button>

        {profile.phone && (
          <Button
            variant="secondary"
            size="sm"
            className="gap-1.5"
            onClick={handleCall}
          >
            <Phone className="size-4" />
            <span className="hidden sm:inline">Call</span>
          </Button>
        )}

        {(profile.teamsEmail || profile.slackHandle) && (
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={profile.teamsEmail ? handleTeamsChat : handleSlackChat}
          >
            <MessageSquare className="size-4" />
            <span className="hidden sm:inline">
              {profile.teamsEmail ? 'Teams' : 'Slack'}
            </span>
          </Button>
        )}
      </div>
    </div>
  )
}

ProfileHeader.displayName = 'ProfileHeader'

export default ProfileHeader
