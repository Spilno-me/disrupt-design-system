/**
 * UserPreviewCard - Quick preview card for HoverCard
 *
 * Shows user details on hover without navigation.
 */

import * as React from 'react'
import { Mail, Phone, Briefcase, Building2, Shield } from 'lucide-react'
import { cn } from '../../../../lib/utils'
import { Badge } from '../../../../components/ui/badge'
import { Button } from '../../../../components/ui/button'
import type { User, USER_STATUS_CONFIG } from '../types'

// =============================================================================
// TYPES
// =============================================================================

interface UserPreviewCardProps {
  user: User
  className?: string
  onViewProfile?: () => void
  onSendEmail?: () => void
}

// =============================================================================
// STATUS CONFIG
// =============================================================================

const STATUS_CONFIG: Record<
  User['status'],
  { label: string; variant: 'success' | 'secondary' | 'warning' | 'destructive' }
> = {
  active: { label: 'Active', variant: 'success' },
  inactive: { label: 'Inactive', variant: 'secondary' },
  pending: { label: 'Pending', variant: 'warning' },
  locked: { label: 'Locked', variant: 'destructive' },
}

// =============================================================================
// COMPONENT
// =============================================================================

export function UserPreviewCard({
  user,
  className,
  onViewProfile,
  onSendEmail,
}: UserPreviewCardProps) {
  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
  const fullName = `${user.firstName} ${user.lastName}`

  return (
    <div data-slot="user-preview-card" className={cn('space-y-4', className)}>
      {/* Header with avatar */}
      <div className="flex items-start gap-3">
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={fullName}
            className="size-12 rounded-full object-cover"
          />
        ) : (
          <div className="flex size-12 items-center justify-center rounded-full bg-accent text-lg font-semibold text-inverse">
            {initials}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-primary truncate">{fullName}</h4>
            <Badge
              variant={STATUS_CONFIG[user.status].variant}
              size="sm"
              shape="pill"
            >
              {STATUS_CONFIG[user.status].label}
            </Badge>
          </div>
          <p className="text-sm text-secondary">{user.jobTitle}</p>
        </div>
      </div>

      {/* Contact info */}
      <div className="space-y-2">
        <a
          href={`mailto:${user.email}`}
          className="flex items-center gap-2 text-sm text-secondary hover:text-accent"
        >
          <Mail className="size-4 text-tertiary" />
          <span className="truncate">{user.email}</span>
        </a>

        {user.phone && (
          <a
            href={`tel:${user.phone}`}
            className="flex items-center gap-2 text-sm text-secondary hover:text-accent"
          >
            <Phone className="size-4 text-tertiary" />
            <span>{user.phone}</span>
          </a>
        )}

        <div className="flex items-center gap-2 text-sm text-secondary">
          <Building2 className="size-4 text-tertiary" />
          <span>{user.department}</span>
        </div>
      </div>

      {/* Roles summary */}
      {user.roleAssignments.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-primary">
            <Shield className="size-4 text-tertiary" />
            <span>Roles</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {user.roleAssignments.slice(0, 3).map((ra) => (
              <Badge key={ra.id} variant="secondary" size="sm">
                {ra.role.name}
              </Badge>
            ))}
            {user.roleAssignments.length > 3 && (
              <Badge variant="outline" size="sm">
                +{user.roleAssignments.length - 3} more
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Last login */}
      {user.lastLoginAt && (
        <p className="text-xs text-tertiary">
          Last login: {new Date(user.lastLoginAt).toLocaleString()}
        </p>
      )}

      {/* Actions */}
      {(onViewProfile || onSendEmail) && (
        <div className="flex gap-2 pt-2 border-t border-default">
          {onViewProfile && (
            <Button variant="outline" size="sm" onClick={onViewProfile} className="flex-1">
              View Profile
            </Button>
          )}
          {onSendEmail && (
            <Button
              variant="outline"
              size="sm"
              onClick={onSendEmail}
              className="flex-1"
            >
              <Mail className="mr-2 size-4" />
              Email
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

UserPreviewCard.displayName = 'UserPreviewCard'

export default UserPreviewCard
