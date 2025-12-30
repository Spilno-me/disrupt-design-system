/**
 * UserProfilePage - Full user profile page
 *
 * Displays complete user information including:
 * - Profile header with avatar and quick actions
 * - Contact information card
 * - Work locations with role assignments
 * - Roles and permissions
 * - Bio/About section (if available)
 *
 * Responsive layout: 2-column on desktop, single column on mobile
 */

import * as React from 'react'
import { ChevronLeft, FileText } from 'lucide-react'
import { Button } from '../../../../components/ui/button'
import { Skeleton } from '../../../../components/ui/Skeleton'
import { ProfileHeader } from './ProfileHeader'
import { ContactCard } from './ContactCard'
import { LocationAssignmentsCard } from './LocationAssignmentsCard'
import { RolesCard } from './RolesCard'
import type { UserProfilePageProps } from '../types'

/**
 * Loading skeleton for profile page
 */
function ProfileSkeleton() {
  return (
    <div className="space-y-6 p-6">
      {/* Header skeleton */}
      <div className="flex items-center gap-6 p-6 bg-surface border border-default rounded-xl">
        <Skeleton className="size-24 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-20" />
        </div>
      </div>

      {/* Content skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
        <Skeleton className="h-48" />
        <Skeleton className="h-48" />
      </div>
    </div>
  )
}

export function UserProfilePage({
  profile,
  isLoading = false,
  onBack,
  onEmail,
  onCall,
  onTeamsChat,
  onSlackChat,
}: UserProfilePageProps) {
  if (isLoading) {
    return (
      <div className="min-h-full bg-canvas">
        {/* Back button */}
        <div className="sticky top-0 z-10 bg-canvas border-b border-default px-4 py-3">
          <Button variant="ghost" size="sm" className="gap-1.5" onClick={onBack}>
            <ChevronLeft className="size-4" />
            Back to Directory
          </Button>
        </div>
        <ProfileSkeleton />
      </div>
    )
  }

  const handleEmail = (email: string) => {
    window.location.href = `mailto:${email}`
    onEmail?.(email)
  }

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`
    onCall?.(phone)
  }

  const handleTeamsChat = (teamsEmail: string) => {
    // Open Teams chat (msteams: protocol or web link)
    window.open(`https://teams.microsoft.com/l/chat/0/0?users=${encodeURIComponent(teamsEmail)}`, '_blank')
    onTeamsChat?.(teamsEmail)
  }

  const handleSlackChat = (slackHandle: string) => {
    // Open Slack (slack: protocol or web link)
    window.open(`slack://user?team=&id=${slackHandle}`, '_blank')
    onSlackChat?.(slackHandle)
  }

  return (
    <div className="min-h-full bg-canvas">
      {/* Back button */}
      <div className="sticky top-0 z-10 bg-canvas border-b border-default px-4 py-3">
        <Button variant="ghost" size="sm" className="gap-1.5" onClick={onBack}>
          <ChevronLeft className="size-4" />
          Back to Directory
        </Button>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6 space-y-6 max-w-6xl mx-auto">
        {/* Profile header */}
        <ProfileHeader
          profile={profile}
          onEmail={handleEmail}
          onCall={handleCall}
          onTeamsChat={handleTeamsChat}
          onSlackChat={handleSlackChat}
        />

        {/* Two column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left column */}
          <div className="space-y-6">
            {/* Contact info */}
            <ContactCard
              profile={profile}
              onEmail={handleEmail}
              onCall={handleCall}
              onTeamsChat={handleTeamsChat}
              onSlackChat={handleSlackChat}
            />

            {/* Bio */}
            {profile.bio && (
              <div className="p-4 bg-surface border border-default rounded-xl">
                <h3 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
                  <FileText className="size-4" />
                  About
                </h3>
                <p className="text-sm text-secondary whitespace-pre-wrap">
                  {profile.bio}
                </p>
              </div>
            )}
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Work locations */}
            <LocationAssignmentsCard profile={profile} />

            {/* Roles */}
            <RolesCard profile={profile} />
          </div>
        </div>
      </div>
    </div>
  )
}

UserProfilePage.displayName = 'UserProfilePage'

export default UserProfilePage
