/**
 * CorrectiveActionHeader
 *
 * Header section for corrective action detail page.
 * Shows title, reference number, status, priority, and key metadata.
 */

import { ArrowLeft, Edit2, Clock, CalendarDays } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { CorrectiveActionStatusBadge } from './CorrectiveActionStatusBadge'
import { PriorityIndicator } from './PriorityIndicator'
import { DueDateDisplay } from './DueDateDisplay'
import { getUserDisplayName, formatDate } from './helpers'
import type { CorrectiveAction, CorrectiveActionPermissions } from './types'
import { cn } from '@/lib/utils'

export interface CorrectiveActionHeaderProps {
  /** Corrective action data */
  action: CorrectiveAction
  /** User permissions */
  permissions?: CorrectiveActionPermissions
  /** Back button handler */
  onBack?: () => void
  /** Edit button handler */
  onEdit?: () => void
  /** Additional CSS classes */
  className?: string
}

export function CorrectiveActionHeader({
  action,
  permissions = {
    canView: true,
    canEdit: true,
    canCreate: false,
    canDelete: false,
    canApprove: false,
    canRequestExtension: true,
  },
  onBack,
  onEdit,
  className,
}: CorrectiveActionHeaderProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {/* Top bar with back button and actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onBack && (
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          )}
          <span className="text-sm font-mono text-secondary">
            {action.referenceNumber}
          </span>
        </div>

        {permissions.canEdit && onEdit && (
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Edit2 className="h-4 w-4 mr-2" />
            Edit
          </Button>
        )}
      </div>

      {/* Title and status */}
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-primary">{action.title}</h1>
        <div className="flex flex-wrap items-center gap-3">
          <CorrectiveActionStatusBadge status={action.status} />
          <Separator orientation="vertical" className="h-5" />
          <PriorityIndicator priority={action.priority} />
        </div>
      </div>

      {/* Key dates row */}
      <div className="flex flex-wrap items-center gap-6 text-sm">
        {/* Due date */}
        <div className="flex items-center gap-2">
          <span className="text-secondary">Due:</span>
          <DueDateDisplay
            dueDate={action.dueDate}
            status={action.status}
            showOverdueBadge
          />
        </div>

        {/* Assigned date */}
        {action.assignedDate && (
          <div className="flex items-center gap-2 text-secondary">
            <CalendarDays className="h-4 w-4" />
            <span>Assigned: {formatDate(action.assignedDate)}</span>
          </div>
        )}

        {/* Completed date */}
        {action.completedDate && (
          <div className="flex items-center gap-2 text-success">
            <Clock className="h-4 w-4" />
            <span>Completed: {formatDate(action.completedDate)}</span>
          </div>
        )}
      </div>

      {/* Description */}
      <div className="bg-muted-bg rounded-lg p-4">
        <p className="text-sm text-primary leading-relaxed">
          {action.description}
        </p>
      </div>

      {/* Assignment info */}
      <div className="flex flex-wrap gap-6 text-sm">
        {action.actionOwner && (
          <div>
            <span className="text-secondary">Owner: </span>
            <span className="text-primary font-medium">
              {getUserDisplayName(action.actionOwner)}
            </span>
          </div>
        )}
        {action.responsibleDepartment && (
          <div>
            <span className="text-secondary">Department: </span>
            <span className="text-primary">{action.responsibleDepartment.name}</span>
          </div>
        )}
        {action.location && (
          <div>
            <span className="text-secondary">Location: </span>
            <span className="text-primary">{action.location.name}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default CorrectiveActionHeader
