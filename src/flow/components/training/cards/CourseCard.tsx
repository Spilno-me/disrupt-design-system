/**
 * CourseCard - Training course display card
 *
 * Displays training course information with category, delivery method,
 * duration, validity, and action buttons.
 *
 * @example
 * ```tsx
 * <CourseCard
 *   course={course}
 *   showActions
 *   onView={() => handleView(course.id)}
 *   onEdit={() => handleEdit(course.id)}
 * />
 * ```
 */

import * as React from 'react'
import {
  Shield,
  FileCheck,
  Award,
  Siren,
  Wrench,
  Leaf,
  UserPlus,
  Lightbulb,
  Monitor,
  Users,
  Video,
  Briefcase,
  Layers,
  ExternalLink,
  Clock,
  Calendar,
  Eye,
  Edit2,
  Trash2,
  Archive,
  Users2,
} from 'lucide-react'
import { cn } from '../../../../lib/utils'
import { Badge } from '../../../../components/ui/badge'
import { Button } from '../../../../components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../../../components/ui/tooltip'
import type { TrainingCourse, CourseCategory, DeliveryMethod } from '../types'
import { COURSE_STATUS_CONFIG, COURSE_CATEGORY_CONFIG, DELIVERY_METHOD_CONFIG } from '../types'

// =============================================================================
// TYPES
// =============================================================================

export interface CourseCardProps {
  /** Training course data */
  course: TrainingCourse
  /** Show status badge */
  showStatus?: boolean
  /** Show action buttons footer */
  showActions?: boolean
  /** Show assigned users count */
  showAssignedCount?: boolean
  /** View course details */
  onView?: () => void
  /** Edit course */
  onEdit?: () => void
  /** Archive course */
  onArchive?: () => void
  /** Delete course */
  onDelete?: () => void
  /** Additional class names */
  className?: string
}

// =============================================================================
// ICON MAPS
// =============================================================================

const CATEGORY_ICONS: Record<CourseCategory, typeof Shield> = {
  safety: Shield,
  compliance: FileCheck,
  certification: Award,
  emergency: Siren,
  equipment: Wrench,
  environmental: Leaf,
  onboarding: UserPlus,
  skills: Lightbulb,
}

const DELIVERY_ICONS: Record<DeliveryMethod, typeof Monitor> = {
  online: Monitor,
  instructor_led: Users,
  virtual: Video,
  on_the_job: Briefcase,
  blended: Layers,
  external: ExternalLink,
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  if (remainingMinutes === 0) return `${hours}h`
  return `${hours}h ${remainingMinutes}m`
}

function formatValidity(months: number | null): string {
  if (months === null) return 'Never expires'
  if (months === 12) return 'Annual'
  if (months === 24) return 'Biennial'
  if (months === 36) return '3 years'
  return `${months} months`
}

// =============================================================================
// COMPONENT
// =============================================================================

export function CourseCard({
  course,
  showStatus = true,
  showActions = false,
  showAssignedCount = true,
  onView,
  onEdit,
  onArchive,
  onDelete,
  className,
}: CourseCardProps) {
  const categoryConfig = COURSE_CATEGORY_CONFIG[course.category]
  const deliveryConfig = DELIVERY_METHOD_CONFIG[course.deliveryMethod]
  const statusConfig = COURSE_STATUS_CONFIG[course.status]
  const CategoryIcon = CATEGORY_ICONS[course.category]
  const DeliveryIcon = DELIVERY_ICONS[course.deliveryMethod]

  const hasActions = showActions && (onView || onEdit || onArchive || onDelete)

  return (
    <div
      data-slot="course-card"
      className={cn(
        // Depth 3 glass - content cards
        'flex flex-col rounded-lg bg-white/20 dark:bg-black/20 backdrop-blur-[2px] border-2 border-accent p-4 shadow-sm',
        'transition-shadow hover:shadow-md',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'flex size-10 items-center justify-center rounded-lg bg-opacity-10',
              categoryConfig.color.replace('text-', 'bg-') + '/10'
            )}
          >
            <CategoryIcon className={cn('size-5', categoryConfig.color)} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-primary truncate">{course.name}</h3>
              {course.isSystem && (
                <Badge variant="warning" size="sm">
                  System
                </Badge>
              )}
              {showStatus && (
                <Badge variant={statusConfig.variant} size="sm">
                  {statusConfig.label}
                </Badge>
              )}
            </div>
            <p className="text-sm text-tertiary">{course.code}</p>
          </div>
        </div>
      </div>

      {/* Description */}
      {course.description && (
        <p className="mt-3 text-sm text-secondary line-clamp-2">{course.description}</p>
      )}

      {/* Metadata */}
      <div className="mt-4 flex flex-wrap gap-3 text-sm">
        {/* Delivery Method */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1.5 text-secondary">
                <DeliveryIcon className="size-4 text-tertiary" />
                <span>{deliveryConfig.label}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>{deliveryConfig.description}</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Duration */}
        <div className="flex items-center gap-1.5 text-secondary">
          <Clock className="size-4 text-tertiary" />
          <span>{formatDuration(course.durationMinutes)}</span>
        </div>

        {/* Validity */}
        <div className="flex items-center gap-1.5 text-secondary">
          <Calendar className="size-4 text-tertiary" />
          <span>{formatValidity(course.validityMonths)}</span>
        </div>
      </div>

      {/* Tags & Category */}
      <div className="mt-4">
        <div className="flex flex-wrap gap-1">
          <Badge variant="outline" size="sm" className="font-normal">
            {categoryConfig.label}
          </Badge>
          {course.provider && (
            <Badge variant="outline" size="sm" className="font-normal">
              {course.provider}
            </Badge>
          )}
          {course.tags?.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="secondary" size="sm" className="font-normal">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Assigned Count */}
      {showAssignedCount && course.assignedCount !== undefined && (
        <div className="mt-3 flex items-center gap-2 text-sm text-secondary">
          <Users2 className="size-4 text-tertiary" />
          <span>
            {course.assignedCount} {course.assignedCount === 1 ? 'user' : 'users'} assigned
          </span>
        </div>
      )}

      {/* Actions Footer */}
      {hasActions && (
        <div className="mt-4 flex items-center gap-2 border-t border-accent/30 pt-3">
          {onView && (
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 min-h-9"
              onClick={onView}
              aria-label={`View ${course.name}`}
            >
              <Eye className="size-4" />
              View
            </Button>
          )}
          {onEdit && !course.isSystem && (
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 min-h-9"
              onClick={onEdit}
              aria-label={`Edit ${course.name}`}
            >
              <Edit2 className="size-4" />
              Edit
            </Button>
          )}
          {onArchive && course.status !== 'archived' && !course.isSystem && (
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 min-h-9"
              onClick={onArchive}
              aria-label={`Archive ${course.name}`}
            >
              <Archive className="size-4" />
              Archive
            </Button>
          )}
          {onDelete && !course.isSystem && (
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 min-h-9 text-error hover:text-error"
              onClick={onDelete}
              aria-label={`Delete ${course.name}`}
            >
              <Trash2 className="size-4" />
              Delete
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

CourseCard.displayName = 'CourseCard'

export default CourseCard
