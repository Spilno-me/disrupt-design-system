/**
 * RequirementsTab - Training requirements configuration tab
 *
 * Displays training requirements with filtering and management capabilities.
 * Requirements define who needs what training (by role, location, or package).
 *
 * @example
 * ```tsx
 * <RequirementsTab
 *   requirements={requirements}
 *   courses={courses}
 *   packages={packages}
 *   onRequirementCreate={handleCreate}
 * />
 * ```
 */

import * as React from 'react'
import {
  Search,
  Plus,
  Building2,
  Users,
  Package,
  AlertTriangle,
  Calendar,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  CheckCircle2,
  XCircle,
  BookOpen,
  Clock,
} from 'lucide-react'
import { cn } from '../../../../lib/utils'
import { Button } from '../../../../components/ui/button'
import { Input } from '../../../../components/ui/input'
import { Badge } from '../../../../components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../../components/ui/dropdown-menu'
import { QuickFilter, QuickFilterItem } from '../../../../components/ui/QuickFilter'
import type {
  TrainingRequirement,
  RequirementsTabProps,
} from '../types'
import { REQUIREMENT_SCOPE_CONFIG, REQUIREMENT_PRIORITY_CONFIG } from '../types'

// =============================================================================
// TYPES
// =============================================================================

type RequirementFilter = 'all' | 'active' | 'inactive'

// =============================================================================
// QUICK FILTER CONFIG
// =============================================================================

const QUICK_FILTERS: Array<{
  id: RequirementFilter
  label: string
  variant?: 'default' | 'info' | 'warning' | 'primary'
}> = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active', variant: 'info' },
  { id: 'inactive', label: 'Inactive', variant: 'default' },
]

// =============================================================================
// SCOPE ICON HELPER
// =============================================================================

const ScopeIcon: React.FC<{ scopeType: string; className?: string }> = ({ scopeType, className }) => {
  switch (scopeType) {
    case 'role':
      return <Users className={cn('size-4', className)} />
    case 'location':
      return <Building2 className={cn('size-4', className)} />
    case 'package':
      return <Package className={cn('size-4', className)} />
    case 'role_location':
      return (
        <div className={cn('flex items-center -space-x-1', className)}>
          <Users className="size-3" />
          <Building2 className="size-3" />
        </div>
      )
    default:
      return null
  }
}

// =============================================================================
// REQUIREMENT CARD
// =============================================================================

interface RequirementCardProps {
  requirement: TrainingRequirement
  onView?: () => void
  onEdit?: () => void
  onToggle?: () => void
  onDelete?: () => void
}

function RequirementCard({
  requirement,
  onView,
  onEdit,
  onToggle,
  onDelete,
}: RequirementCardProps) {
  const scopeConfig = REQUIREMENT_SCOPE_CONFIG[requirement.scopeType]
  const priorityConfig = REQUIREMENT_PRIORITY_CONFIG[requirement.priority]

  // Get scope description
  const getScopeDescription = (): string => {
    const parts: string[] = []
    if (requirement.roles?.length) {
      parts.push(`${requirement.roles.length} role${requirement.roles.length > 1 ? 's' : ''}`)
    }
    if (requirement.locationNames?.length) {
      parts.push(`${requirement.locationNames.length} location${requirement.locationNames.length > 1 ? 's' : ''}`)
    }
    return parts.length > 0 ? parts.join(', ') : 'All users'
  }

  return (
    <div
      className={cn(
        'group relative flex flex-col gap-3 p-4 rounded-lg transition-all duration-200',
        'bg-white/20 dark:bg-black/20 backdrop-blur-[2px]',
        'border-2',
        requirement.isActive ? 'border-accent/30 hover:border-accent/50' : 'border-default hover:border-accent/30',
        'hover:shadow-md'
      )}
    >
      {/* Header: Name + Status + Actions */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-primary truncate">{requirement.name}</h3>
            <Badge
              variant={
                requirement.priority === 'critical'
                  ? 'destructive'
                  : requirement.priority === 'high'
                  ? 'warning'
                  : 'secondary'
              }
              size="sm"
            >
              {priorityConfig?.label || requirement.priority}
            </Badge>
          </div>
          {requirement.description && (
            <p className="text-sm text-secondary mt-1 line-clamp-2">
              {requirement.description}
            </p>
          )}
        </div>

        {/* Status + Menu */}
        <div className="flex items-center gap-2">
          {requirement.isActive ? (
            <Badge variant="success" size="sm" className="gap-1">
              <CheckCircle2 className="size-3" />
              Active
            </Badge>
          ) : (
            <Badge variant="secondary" size="sm" className="gap-1">
              <XCircle className="size-3" />
              Inactive
            </Badge>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onView && (
                <DropdownMenuItem onClick={onView}>
                  <Eye className="size-4 mr-2" />
                  View Details
                </DropdownMenuItem>
              )}
              {onEdit && (
                <DropdownMenuItem onClick={onEdit}>
                  <Pencil className="size-4 mr-2" />
                  Edit
                </DropdownMenuItem>
              )}
              {onToggle && (
                <DropdownMenuItem onClick={onToggle}>
                  {requirement.isActive ? (
                    <>
                      <XCircle className="size-4 mr-2" />
                      Deactivate
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="size-4 mr-2" />
                      Activate
                    </>
                  )}
                </DropdownMenuItem>
              )}
              {onDelete && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={onDelete}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="size-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Info Row */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
        {/* Scope Type */}
        <div className="flex items-center gap-1.5 text-secondary">
          <ScopeIcon scopeType={requirement.scopeType} className="text-tertiary" />
          <span>{scopeConfig?.label || requirement.scopeType}</span>
        </div>

        {/* Course/Package */}
        {requirement.course && (
          <div className="flex items-center gap-1.5 text-secondary">
            <BookOpen className="size-3.5 text-accent" />
            <span className="font-medium">{requirement.course.name}</span>
          </div>
        )}
        {requirement.package && (
          <div className="flex items-center gap-1.5 text-secondary">
            <Package className="size-3.5 text-accent" />
            <span className="font-medium">{requirement.package.name}</span>
          </div>
        )}

        {/* Applies To */}
        <div className="flex items-center gap-1.5 text-secondary">
          <Users className="size-3.5 text-tertiary" />
          <span>{getScopeDescription()}</span>
        </div>

        {/* Grace Period */}
        <div className="flex items-center gap-1.5 text-secondary">
          <Clock className="size-3.5 text-tertiary" />
          <span>{requirement.gracePeriodDays} day grace</span>
        </div>

        {/* Affected Users */}
        {requirement.affectedUsers !== undefined && (
          <div className="flex items-center gap-1.5 text-secondary">
            <span className="text-accent font-medium">{requirement.affectedUsers}</span>
            <span>affected</span>
          </div>
        )}
      </div>
    </div>
  )
}

// =============================================================================
// COMPONENT
// =============================================================================

export function RequirementsTab({
  requirements,
  courses,
  packages,
  roles,
  locations,
  isLoading = false,
  onRequirementCreate,
  onRequirementUpdate,
  onRequirementDelete,
  onRequirementToggle,
  onViewRequirement,
}: RequirementsTabProps) {
  const [activeFilter, setActiveFilter] = React.useState<RequirementFilter>('all')
  const [searchQuery, setSearchQuery] = React.useState('')

  // Filter requirements
  const filteredRequirements = React.useMemo(() => {
    let result = requirements

    // Apply status filter
    if (activeFilter === 'active') {
      result = result.filter((req) => req.isActive)
    } else if (activeFilter === 'inactive') {
      result = result.filter((req) => !req.isActive)
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (req) =>
          req.name.toLowerCase().includes(query) ||
          req.description?.toLowerCase().includes(query) ||
          req.course?.name.toLowerCase().includes(query) ||
          req.package?.name.toLowerCase().includes(query)
      )
    }

    return result
  }, [requirements, activeFilter, searchQuery])

  // Calculate counts for filters
  const counts = React.useMemo(() => {
    return {
      all: requirements.length,
      active: requirements.filter((r) => r.isActive).length,
      inactive: requirements.filter((r) => !r.isActive).length,
    }
  }, [requirements])

  // Stats
  const stats = React.useMemo(() => {
    const activeReqs = filteredRequirements.filter((r) => r.isActive)
    return {
      totalAffected: activeReqs.reduce((sum, r) => sum + (r.affectedUsers || 0), 0),
      avgGracePeriod: activeReqs.length > 0
        ? Math.round(activeReqs.reduce((sum, r) => sum + r.gracePeriodDays, 0) / activeReqs.length)
        : 0,
      criticalCount: activeReqs.filter((r) => r.priority === 'critical').length,
    }
  }, [filteredRequirements])

  return (
    <div data-slot="requirements-tab" className="space-y-6">
      {/* Filters Row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Quick Filters */}
        <QuickFilter fullBleed className="sm:w-auto">
          {QUICK_FILTERS.map((filter) => (
            <QuickFilterItem
              key={filter.id}
              label={filter.label}
              selected={activeFilter === filter.id}
              onClick={() => setActiveFilter(filter.id)}
              count={counts[filter.id]}
              variant={filter.variant}
              size="xs"
            />
          ))}
        </QuickFilter>

        {/* Search + Add */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-tertiary" />
            <Input
              placeholder="Search requirements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          {onRequirementCreate && (
            <Button onClick={() => onRequirementCreate({} as any)} className="gap-1.5">
              <Plus className="size-4" />
              <span className="hidden sm:inline">Add Requirement</span>
            </Button>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-secondary">
        {filteredRequirements.length} {filteredRequirements.length === 1 ? 'requirement' : 'requirements'}
        {activeFilter !== 'all' && ` (${activeFilter})`}
        {searchQuery && ` matching "${searchQuery}"`}
      </div>

      {/* Requirements List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-28 rounded-lg bg-muted-bg/50 animate-pulse"
            />
          ))}
        </div>
      ) : filteredRequirements.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="size-16 rounded-full bg-muted-bg flex items-center justify-center mb-4">
            <AlertTriangle className="size-8 text-tertiary" />
          </div>
          <h3 className="text-lg font-medium text-primary mb-1">No requirements found</h3>
          <p className="text-sm text-secondary max-w-sm">
            {searchQuery
              ? `No requirements match "${searchQuery}". Try adjusting your search.`
              : 'No requirements configured. Add a requirement to define who needs training.'}
          </p>
          {onRequirementCreate && !searchQuery && (
            <Button onClick={() => onRequirementCreate({} as any)} className="mt-4 gap-1.5">
              <Plus className="size-4" />
              Add Requirement
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredRequirements.map((req) => (
            <RequirementCard
              key={req.id}
              requirement={req}
              onView={onViewRequirement ? () => onViewRequirement(req.id) : undefined}
              onEdit={onRequirementUpdate ? () => onRequirementUpdate(req.id, {} as any) : undefined}
              onToggle={onRequirementToggle ? () => onRequirementToggle(req.id, !req.isActive) : undefined}
              onDelete={onRequirementDelete ? () => onRequirementDelete(req.id) : undefined}
            />
          ))}
        </div>
      )}

      {/* Stats Summary */}
      {filteredRequirements.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-lg bg-muted-bg/50 border border-accent/10">
          <div className="flex items-center gap-2 text-sm">
            <Users className="size-4 text-accent" />
            <span className="text-secondary">Total affected:</span>
            <span className="font-medium text-primary">{stats.totalAffected} users</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="size-4 text-tertiary" />
            <span className="text-secondary">Avg grace period:</span>
            <span className="font-medium text-primary">{stats.avgGracePeriod} days</span>
          </div>
          {stats.criticalCount > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <AlertTriangle className="size-4 text-destructive" />
              <span className="text-destructive font-medium">{stats.criticalCount} critical</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

RequirementsTab.displayName = 'RequirementsTab'

export default RequirementsTab
