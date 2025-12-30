/**
 * ComplianceTab - Training compliance dashboard tab
 *
 * Displays organization-wide training compliance status with:
 * - Stats cards for compliance overview
 * - User compliance list with filtering
 * - Actions for managing training records
 *
 * @example
 * ```tsx
 * <ComplianceTab
 *   stats={trainingStats}
 *   userCompliance={userComplianceData}
 *   onViewUser={handleViewUser}
 * />
 * ```
 */

import * as React from 'react'
import {
  Search,
  Users,
  CheckCircle2,
  Clock,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  User,
  Calendar,
  Eye,
  ClipboardList,
} from 'lucide-react'
import { cn } from '../../../../lib/utils'
import { Button } from '../../../../components/ui/button'
import { Input } from '../../../../components/ui/input'
import { Badge } from '../../../../components/ui/badge'
import { QuickFilter, QuickFilterItem } from '../../../../components/ui/QuickFilter'
import { ComplianceBadge } from '../components/ComplianceBadge'
import { ExpirationIndicator } from '../components/ExpirationIndicator'
import type { ComplianceTabProps, UserComplianceStatus, ComplianceStatus } from '../types'

// =============================================================================
// TYPES
// =============================================================================

type ComplianceFilter = 'all' | 'compliant' | 'expiring_soon' | 'non_compliant'

// =============================================================================
// QUICK FILTER CONFIG
// =============================================================================

const QUICK_FILTERS: Array<{
  id: ComplianceFilter
  label: string
  variant?: 'default' | 'info' | 'warning' | 'primary'
}> = [
  { id: 'all', label: 'All Users' },
  { id: 'compliant', label: 'Compliant', variant: 'info' },
  { id: 'expiring_soon', label: 'Expiring', variant: 'warning' },
  { id: 'non_compliant', label: 'Non-Compliant', variant: 'primary' },
]

// =============================================================================
// STAT CARD
// =============================================================================

interface StatCardProps {
  label: string
  value: number
  icon: React.ReactNode
  variant: 'success' | 'warning' | 'destructive' | 'default'
  trend?: 'up' | 'down' | 'stable'
  trendValue?: number
}

function StatCard({ label, value, icon, variant, trend, trendValue }: StatCardProps) {
  const variantStyles = {
    success: 'border-success/30 bg-success/5',
    warning: 'border-warning/30 bg-warning/5',
    destructive: 'border-destructive/30 bg-destructive/5',
    default: 'border-accent/20 bg-muted-bg/50',
  }

  const iconStyles = {
    success: 'text-success',
    warning: 'text-warning',
    destructive: 'text-destructive',
    default: 'text-accent',
  }

  return (
    <div
      className={cn(
        'flex flex-col gap-2 p-4 rounded-lg border-2 transition-all',
        variantStyles[variant]
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-secondary">{label}</span>
        <div className={cn('size-8 rounded-full flex items-center justify-center bg-white/50 dark:bg-black/20', iconStyles[variant])}>
          {icon}
        </div>
      </div>
      <div className="flex items-end justify-between">
        <span className="text-3xl font-bold text-primary">{value}</span>
        {trend && trendValue !== undefined && (
          <div
            className={cn(
              'flex items-center gap-1 text-xs font-medium',
              trend === 'up' ? 'text-success' : trend === 'down' ? 'text-destructive' : 'text-tertiary'
            )}
          >
            {trend === 'up' ? (
              <TrendingUp className="size-3" />
            ) : trend === 'down' ? (
              <TrendingDown className="size-3" />
            ) : (
              <Minus className="size-3" />
            )}
            {trendValue}%
          </div>
        )}
      </div>
    </div>
  )
}

// =============================================================================
// USER COMPLIANCE CARD
// =============================================================================

interface UserComplianceCardProps {
  compliance: UserComplianceStatus
  onView?: () => void
  onRecordCompletion?: () => void
}

function UserComplianceCard({ compliance, onView, onRecordCompletion }: UserComplianceCardProps) {
  // Calculate days until next expiration
  const daysUntilExpiration = compliance.nextExpirationDate
    ? Math.ceil((new Date(compliance.nextExpirationDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : undefined

  return (
    <div
      className={cn(
        'group relative flex items-center gap-4 p-4 rounded-lg transition-all duration-200',
        'bg-white/20 dark:bg-black/20 backdrop-blur-[2px]',
        'border-2 hover:border-accent/30',
        compliance.overallStatus === 'compliant'
          ? 'border-success/20'
          : compliance.overallStatus === 'expiring_soon'
          ? 'border-warning/20'
          : 'border-destructive/20'
      )}
    >
      {/* User Avatar/Icon */}
      <div className="flex-shrink-0 size-12 rounded-full bg-muted-bg flex items-center justify-center">
        <User className="size-6 text-tertiary" />
      </div>

      {/* User Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-primary truncate">User #{compliance.userId.slice(-4)}</span>
          <ComplianceBadge status={compliance.overallStatus} size="sm" />
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-secondary">
          <span className="text-success">{compliance.compliantCount} completed</span>
          {compliance.expiringSoonCount > 0 && (
            <span className="text-warning">{compliance.expiringSoonCount} expiring</span>
          )}
          {compliance.nonCompliantCount > 0 && (
            <span className="text-destructive">{compliance.nonCompliantCount} overdue</span>
          )}
        </div>
      </div>

      {/* Next Expiration */}
      {daysUntilExpiration !== undefined && compliance.nextExpiringCourseName && (
        <div className="hidden sm:flex flex-col items-end gap-1 text-right">
          <ExpirationIndicator daysUntil={daysUntilExpiration} variant="badge" />
          <span className="text-xs text-tertiary truncate max-w-[120px]">
            {compliance.nextExpiringCourseName}
          </span>
        </div>
      )}

      {/* Progress */}
      <div className="hidden md:flex flex-col items-end gap-1">
        <span className="text-2xl font-bold text-primary">
          {compliance.compliancePercentage}%
        </span>
        <span className="text-xs text-tertiary">compliance</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {onView && (
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={onView}
          >
            <Eye className="size-4" />
          </Button>
        )}
        {onRecordCompletion && compliance.nonCompliantCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={onRecordCompletion}
          >
            <ClipboardList className="size-4" />
            Record
          </Button>
        )}
      </div>
    </div>
  )
}

// =============================================================================
// COMPONENT
// =============================================================================

export function ComplianceTab({
  stats,
  userCompliance,
  locationCompliance,
  roleCompliance,
  isLoading = false,
  onViewUser,
  onRecordCompletion,
  onWaiveRequirement,
}: ComplianceTabProps) {
  const [activeFilter, setActiveFilter] = React.useState<ComplianceFilter>('all')
  const [searchQuery, setSearchQuery] = React.useState('')

  // Filter users
  const filteredUsers = React.useMemo(() => {
    let result = userCompliance

    // Apply status filter
    if (activeFilter !== 'all') {
      result = result.filter((user) => user.overallStatus === activeFilter)
    }

    // Apply search filter (by user ID for now)
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter((user) => user.userId.toLowerCase().includes(query))
    }

    // Sort by compliance status (worst first)
    result = [...result].sort((a, b) => {
      const statusOrder: Record<ComplianceStatus, number> = {
        non_compliant: 0,
        expiring_soon: 1,
        compliant: 2,
        not_applicable: 3,
      }
      return statusOrder[a.overallStatus] - statusOrder[b.overallStatus]
    })

    return result
  }, [userCompliance, activeFilter, searchQuery])

  // Calculate counts for filters
  const counts = React.useMemo(() => {
    return {
      all: userCompliance.length,
      compliant: userCompliance.filter((u) => u.overallStatus === 'compliant').length,
      expiring_soon: userCompliance.filter((u) => u.overallStatus === 'expiring_soon').length,
      non_compliant: userCompliance.filter((u) => u.overallStatus === 'non_compliant').length,
    }
  }, [userCompliance])

  // Stats from props or calculated
  const complianceStats = stats?.compliance ?? {
    totalUsers: counts.all,
    compliantUsers: counts.compliant,
    expiringSoonUsers: counts.expiring_soon,
    nonCompliantUsers: counts.non_compliant,
    overallPercentage: counts.all > 0 ? Math.round((counts.compliant / counts.all) * 100) : 0,
  }

  return (
    <div data-slot="compliance-tab" className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Users"
          value={complianceStats.totalUsers}
          icon={<Users className="size-5" />}
          variant="default"
        />
        <StatCard
          label="Compliant"
          value={complianceStats.compliantUsers}
          icon={<CheckCircle2 className="size-5" />}
          variant="success"
          trend={stats?.trend?.direction}
          trendValue={stats?.trend?.percentage}
        />
        <StatCard
          label="Expiring Soon"
          value={complianceStats.expiringSoonUsers}
          icon={<Clock className="size-5" />}
          variant="warning"
        />
        <StatCard
          label="Non-Compliant"
          value={complianceStats.nonCompliantUsers}
          icon={<AlertTriangle className="size-5" />}
          variant="destructive"
        />
      </div>

      {/* Overall Progress */}
      <div className="p-4 rounded-lg bg-muted-bg/50 border border-accent/10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-secondary">Overall Compliance</span>
          <span className="text-lg font-bold text-primary">{complianceStats.overallPercentage}%</span>
        </div>
        <div className="h-3 rounded-full bg-surface-hover overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-500',
              complianceStats.overallPercentage >= 90
                ? 'bg-success'
                : complianceStats.overallPercentage >= 70
                ? 'bg-warning'
                : 'bg-destructive'
            )}
            style={{ width: `${complianceStats.overallPercentage}%` }}
          />
        </div>
      </div>

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

        {/* Search */}
        <div className="relative flex-1 sm:w-64 sm:flex-none">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-tertiary" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-secondary">
        {filteredUsers.length} {filteredUsers.length === 1 ? 'user' : 'users'}
        {activeFilter !== 'all' && ` (${activeFilter.replace('_', ' ')})`}
        {searchQuery && ` matching "${searchQuery}"`}
      </div>

      {/* User Compliance List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-20 rounded-lg bg-muted-bg/50 animate-pulse" />
          ))}
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="size-16 rounded-full bg-muted-bg flex items-center justify-center mb-4">
            <Search className="size-8 text-tertiary" />
          </div>
          <h3 className="text-lg font-medium text-primary mb-1">No users found</h3>
          <p className="text-sm text-secondary max-w-sm">
            {searchQuery
              ? `No users match "${searchQuery}". Try adjusting your search.`
              : 'No users in this compliance category.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredUsers.map((user) => (
            <UserComplianceCard
              key={user.userId}
              compliance={user}
              onView={onViewUser ? () => onViewUser(user.userId) : undefined}
              onRecordCompletion={onRecordCompletion ? () => onRecordCompletion({} as any) : undefined}
            />
          ))}
        </div>
      )}
    </div>
  )
}

ComplianceTab.displayName = 'ComplianceTab'

export default ComplianceTab
