/**
 * UserStatsCards - Compact Admin Dashboard Stats
 *
 * Two-section design:
 * 1. Compact summary strip with basic counts
 * 2. Actionable alerts + Role distribution visualization
 *
 * EHS-focused metrics for admin efficiency
 */

import * as React from 'react'
import {
  Users,
  UserCheck,
  UserPlus,
  ShieldCheck,
  Lock,
  UserX,
  ShieldAlert,
  AlertTriangle,
  Award,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react'
import { cn } from '../../../../lib/utils'
import type { UserStats } from '../types'

// =============================================================================
// TYPES
// =============================================================================

interface UserStatsCardsProps {
  stats: UserStats
  className?: string
}

// =============================================================================
// MINI STAT (Ultra-compact inline stat)
// =============================================================================

interface MiniStatProps {
  icon: React.ReactNode
  value: number | string
  label: string
  trend?: {
    direction: 'up' | 'down' | 'stable'
    percentage: number
  }
}

function MiniStat({ icon, value, label, trend }: MiniStatProps) {
  const TrendIcon =
    trend?.direction === 'up'
      ? TrendingUp
      : trend?.direction === 'down'
        ? TrendingDown
        : Minus

  const trendColor =
    trend?.direction === 'up'
      ? 'text-success'
      : trend?.direction === 'down'
        ? 'text-error'
        : 'text-tertiary'

  return (
    <div className="flex items-center gap-2">
      <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted-bg">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="flex items-baseline gap-1">
          <span className="text-base font-semibold text-primary tabular-nums">{value}</span>
          {trend && (
            <div className={cn('flex items-center gap-0.5 text-[10px]', trendColor)}>
              <TrendIcon className="size-2.5" />
              <span>{trend.percentage}%</span>
            </div>
          )}
        </div>
        <p className="text-[10px] text-tertiary leading-tight">{label}</p>
      </div>
    </div>
  )
}

// =============================================================================
// ALERT METRIC (Actionable with severity indicator)
// =============================================================================

interface AlertMetricProps {
  icon: React.ReactNode
  iconClassName?: string
  value: number | string
  label: string
  severity: 'critical' | 'warning' | 'info' | 'success'
  subtext?: string
}

function AlertMetric({ icon, iconClassName, value, label, severity, subtext }: AlertMetricProps) {
  // Colored glass effect - bg color/20, border color/40 (+20% for contrast), shadow for lift
  // Same opacity works for both light and dark - semantic colors already have dark mode variants
  const severityStyles = {
    critical: 'bg-error/20 backdrop-blur-[2px] border-2 border-error/40 shadow-sm',
    warning: 'bg-warning/20 backdrop-blur-[2px] border-2 border-warning/40 shadow-sm',
    info: 'bg-info/20 backdrop-blur-[2px] border-2 border-info/40 shadow-sm',
    success: 'bg-success/20 backdrop-blur-[2px] border-2 border-success/40 shadow-sm',
  }

  const valueStyles = {
    critical: 'text-error',
    warning: 'text-warning',
    info: 'text-info',
    success: 'text-success',
  }

  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-lg px-2.5 py-1.5 transition-all',
        severityStyles[severity]
      )}
    >
      <div className={cn('size-3.5 shrink-0', iconClassName)}>{icon}</div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-1">
          <span className={cn('text-base font-semibold tabular-nums', valueStyles[severity])}>
            {value}
          </span>
          <span className="text-[11px] text-secondary truncate">{label}</span>
        </div>
        {subtext && <p className="text-[10px] text-tertiary truncate">{subtext}</p>}
      </div>
    </div>
  )
}

// =============================================================================
// ROLE DISTRIBUTION (Compact visualization)
// =============================================================================

function RoleDistribution({
  distribution,
}: {
  distribution: UserStats['roleDistribution']
}) {
  const colors = [
    'bg-success',
    'bg-warning',
    'bg-info',
    'bg-accent',
    'bg-error',
    'bg-tertiary',
  ]

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <ShieldCheck className="size-4 text-info" />
        <span className="text-xs font-medium text-secondary">Role Distribution</span>
        <span className="text-xs text-tertiary">({distribution.length} roles)</span>
      </div>

      {/* Stacked bar */}
      <div className="flex h-2.5 w-full gap-0.5 overflow-hidden rounded-full bg-muted-bg">
        {distribution.slice(0, 6).map((item, index) => (
          <div
            key={item.roleName}
            className={cn('h-full transition-all', colors[index % colors.length])}
            style={{ width: `${item.percentage}%` }}
            title={`${item.roleName}: ${item.count} (${item.percentage}%)`}
          />
        ))}
      </div>

      {/* Compact legend */}
      <div className="flex flex-wrap gap-x-3 gap-y-0.5">
        {distribution.slice(0, 5).map((item, index) => (
          <div key={item.roleName} className="flex items-center gap-1">
            <div className={cn('size-1.5 rounded-full', colors[index % colors.length])} />
            <span className="text-[10px] text-tertiary">{item.roleName}</span>
            <span className="text-[10px] text-quaternary">({item.count})</span>
          </div>
        ))}
        {distribution.length > 5 && (
          <span className="text-[10px] text-tertiary">+{distribution.length - 5}</span>
        )}
      </div>
    </div>
  )
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function UserStatsCards({ stats, className }: UserStatsCardsProps) {
  const activePercentage =
    stats.totalUsers > 0 ? Math.round((stats.activeUsers / stats.totalUsers) * 100) : 0

  // Determine severity levels for actionable metrics
  const lockedSeverity = (stats.lockedAccounts ?? 0) > 0 ? 'critical' : 'success'
  const inactiveSeverity =
    (stats.inactiveUsers ?? 0) > 10 ? 'warning' : (stats.inactiveUsers ?? 0) > 0 ? 'info' : 'success'
  const twoFactorSeverity =
    (stats.twoFactorPercentage ?? 0) >= 80
      ? 'success'
      : (stats.twoFactorPercentage ?? 0) >= 50
        ? 'warning'
        : 'critical'
  const failedLoginSeverity =
    (stats.failedLogins24h ?? 0) > 10
      ? 'critical'
      : (stats.failedLogins24h ?? 0) > 0
        ? 'warning'
        : 'success'
  const certSeverity =
    (stats.expiringCertifications ?? 0) > 5
      ? 'critical'
      : (stats.expiringCertifications ?? 0) > 0
        ? 'warning'
        : 'success'

  return (
    <div data-slot="user-stats-cards" className={cn('flex flex-col gap-2', className)}>
      {/* Row 1: Summary strip + Role Distribution - glass with teal border */}
      <div className="flex flex-col gap-2 lg:flex-row lg:items-stretch">
        {/* Summary counts - compact strip (Depth 3 glass with shadow) */}
        {/* Light: white glass, Dark: black glass */}
        <div className="flex flex-wrap items-center gap-4 rounded-lg border-2 border-accent bg-white/20 dark:bg-black/20 backdrop-blur-[2px] shadow-sm px-4 py-2.5 lg:gap-6">
          <MiniStat
            icon={<Users className="size-3.5 text-accent" />}
            value={stats.totalUsers}
            label="Total Users"
            trend={stats.trend}
          />
          <div className="h-8 w-px bg-border hidden sm:block" />
          <MiniStat
            icon={<UserCheck className="size-3.5 text-success" />}
            value={stats.activeUsers}
            label={`Active (${activePercentage}%)`}
          />
          <div className="h-8 w-px bg-border hidden sm:block" />
          <MiniStat
            icon={<UserPlus className="size-3.5 text-warning" />}
            value={stats.pendingInvites}
            label="Pending"
          />
        </div>

        {/* Role Distribution - flexible width (Depth 3 glass with shadow) */}
        {/* Light: white glass, Dark: black glass */}
        <div className="flex-1 rounded-lg border-2 border-accent bg-white/20 dark:bg-black/20 backdrop-blur-[2px] shadow-sm px-4 py-2.5">
          <RoleDistribution distribution={stats.roleDistribution} />
        </div>
      </div>

      {/* Row 2: Actionable Admin Metrics */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
        <AlertMetric
          icon={<Lock className="size-4 text-error" />}
          value={stats.lockedAccounts ?? 0}
          label="Locked"
          severity={lockedSeverity}
          subtext={stats.lockedAccounts ? 'Need attention' : 'All clear'}
        />
        <AlertMetric
          icon={<UserX className="size-4 text-warning" />}
          value={stats.inactiveUsers ?? 0}
          label="Inactive 30d+"
          severity={inactiveSeverity}
          subtext="Review access"
        />
        <AlertMetric
          icon={<ShieldAlert className="size-4 text-info" />}
          value={`${stats.twoFactorPercentage ?? 0}%`}
          label="2FA Enabled"
          severity={twoFactorSeverity}
          subtext="Security posture"
        />
        <AlertMetric
          icon={<AlertTriangle className="size-4 text-warning" />}
          value={stats.failedLogins24h ?? 0}
          label="Failed (24h)"
          severity={failedLoginSeverity}
          subtext="Login attempts"
        />
        <AlertMetric
          icon={<Award className="size-4 text-accent" />}
          value={stats.expiringCertifications ?? 0}
          label="Certs Expiring"
          severity={certSeverity}
          subtext="Within 30 days"
        />
      </div>
    </div>
  )
}

UserStatsCards.displayName = 'UserStatsCards'

export default UserStatsCards
