/**
 * CorrectiveActionCard
 *
 * Card display for corrective actions in grid/list views.
 * Shows key information: title, status, priority, owner, due date.
 */

import { MoreHorizontal, User, Building2, MapPin } from 'lucide-react'
import {
  AppCard,
  AppCardHeader,
  AppCardTitle,
  AppCardDescription,
  AppCardContent,
  AppCardFooter,
  AppCardAction,
} from '@/components/ui/app-card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { CorrectiveActionStatusBadge } from './CorrectiveActionStatusBadge'
import { PriorityIndicator } from './PriorityIndicator'
import { DueDateDisplay } from './DueDateDisplay'
import { getUserDisplayName, getUserInitials, PRIORITY_CONFIG } from './helpers'
import type { CorrectiveAction, CorrectiveActionPermissions } from './types'
import { cn } from '@/lib/utils'

export interface CorrectiveActionCardProps {
  /** Corrective action data */
  action: CorrectiveAction
  /** User permissions */
  permissions?: CorrectiveActionPermissions
  /** Card click handler */
  onClick?: (action: CorrectiveAction) => void
  /** Edit action handler */
  onEdit?: (action: CorrectiveAction) => void
  /** Delete action handler */
  onDelete?: (action: CorrectiveAction) => void
  /** Request extension handler */
  onRequestExtension?: (action: CorrectiveAction) => void
  /** Additional CSS classes */
  className?: string
}

export function CorrectiveActionCard({
  action,
  permissions = {
    canView: true,
    canEdit: true,
    canCreate: false,
    canDelete: false,
    canApprove: false,
    canRequestExtension: true,
  },
  onClick,
  onEdit,
  onDelete,
  onRequestExtension,
  className,
}: CorrectiveActionCardProps) {
  const priorityConfig = PRIORITY_CONFIG[action.priority]
  const ownerName = getUserDisplayName(action.actionOwner)
  const ownerInitials = getUserInitials(action.actionOwner)

  const handleCardClick = () => {
    if (onClick) onClick(action)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleCardClick()
    }
  }

  return (
    <AppCard
      shadow="sm"
      className={cn(
        'transition-shadow hover:shadow-md',
        onClick && 'cursor-pointer',
        // Priority border indicator
        'border-l-4',
        priorityConfig.borderClass,
        className
      )}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? 'button' : undefined}
      aria-label={onClick ? `View ${action.title}` : undefined}
    >
      <AppCardHeader>
        <div className="flex items-center gap-2">
          <span className="text-xs text-secondary font-mono">
            {action.referenceNumber}
          </span>
          <CorrectiveActionStatusBadge status={action.status} size="sm" />
        </div>
        <AppCardTitle className="line-clamp-2 text-base">
          {action.title}
        </AppCardTitle>
        <AppCardDescription className="line-clamp-2">
          {action.description}
        </AppCardDescription>
        <AppCardAction>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {permissions.canEdit && onEdit && (
                <DropdownMenuItem onClick={() => onEdit(action)}>
                  Edit
                </DropdownMenuItem>
              )}
              {permissions.canRequestExtension && onRequestExtension && (
                <DropdownMenuItem onClick={() => onRequestExtension(action)}>
                  Request Extension
                </DropdownMenuItem>
              )}
              {permissions.canDelete && onDelete && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onDelete(action)}
                    className="text-error"
                  >
                    Delete
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </AppCardAction>
      </AppCardHeader>

      <AppCardContent className="space-y-3">
        {/* Priority and Due Date row */}
        <div className="flex items-center justify-between gap-4">
          <PriorityIndicator priority={action.priority} size="sm" />
          <DueDateDisplay
            dueDate={action.dueDate}
            status={action.status}
            size="sm"
          />
        </div>

        {/* Category if present */}
        {action.category && (
          <div className="text-xs text-secondary">
            Category: {action.category.name}
          </div>
        )}
      </AppCardContent>

      <AppCardFooter className="justify-between border-t border-default pt-4">
        {/* Owner */}
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2">
              <Avatar size="sm">
                {action.actionOwner?.avatarUrl && (
                  <AvatarImage
                    src={action.actionOwner.avatarUrl}
                    alt={ownerName}
                  />
                )}
                <AvatarFallback>{ownerInitials}</AvatarFallback>
              </Avatar>
              <span className="text-sm text-secondary truncate max-w-[120px]">
                {ownerName}
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Action Owner: {ownerName}</p>
          </TooltipContent>
        </Tooltip>

        {/* Location/Department indicators */}
        <div className="flex items-center gap-2 text-tertiary">
          {action.responsibleDepartment && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Building2 className="h-4 w-4" />
              </TooltipTrigger>
              <TooltipContent>
                <p>{action.responsibleDepartment.name}</p>
              </TooltipContent>
            </Tooltip>
          )}
          {action.location && (
            <Tooltip>
              <TooltipTrigger asChild>
                <MapPin className="h-4 w-4" />
              </TooltipTrigger>
              <TooltipContent>
                <p>{action.location.name}</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </AppCardFooter>
    </AppCard>
  )
}

export default CorrectiveActionCard
