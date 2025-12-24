/**
 * UserStatsCards - KPI statistics display
 *
 * Shows 4 key metrics: Total Users, Active Users, Pending Invites, Role Distribution
 */

import * as React from 'react'
import { Users, UserCheck, UserPlus, ShieldCheck, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '../../../../lib/utils'
import type { UserStats } from '../types'

// =============================================================================
// TYPES
// =============================================================================

interface UserStatsCardsProps {
  stats: UserStats
  className?: string
}

interface StatCardProps {
  icon: React.ReactNode
  iconBg: string
  label: string
  value: number | string
  subValue?: string
  trend?: {
    direction: 'up' | 'down' | 'stable'
    percentage: number
  }
}

// =============================================================================
// STAT CARD
// =============================================================================

function StatCard({ icon, iconBg, label, value, subValue, trend }: StatCardProps) {
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
    <div className="flex flex-col gap-3 rounded-lg border border-default bg-surface p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className={cn('flex size-10 items-center justify-center rounded-lg', iconBg)}>
          {icon}
        </div>
        {trend && (
          <div className={cn('flex items-center gap-1 text-sm', trendColor)}>
            <TrendIcon className="size-4" />
            <span>{trend.percentage}%</span>
          </div>
        )}
      </div>

      <div>
        <p className="text-2xl font-semibold text-primary">{value}</p>
        <p className="text-sm text-secondary">{label}</p>
        {subValue && <p className="mt-1 text-xs text-tertiary">{subValue}</p>}
      </div>
    </div>
  )
}

// =============================================================================
// ROLE DISTRIBUTION BAR
// =============================================================================

function RoleDistributionBar({
  distribution,
}: {
  distribution: UserStats['roleDistribution']
}) {
  // Colors for the distribution bars
  const colors = [
    'bg-accent',
    'bg-success',
    'bg-warning',
    'bg-info',
    'bg-error',
    'bg-tertiary',
  ]

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-default bg-surface p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex size-10 items-center justify-center rounded-lg bg-info/10">
          <ShieldCheck className="size-5 text-info" />
        </div>
      </div>

      <div>
        <p className="text-2xl font-semibold text-primary">{distribution.length}</p>
        <p className="text-sm text-secondary">Role Distribution</p>
      </div>

      {/* Mini bar chart */}
      <div className="mt-1 flex h-2 w-full gap-0.5 overflow-hidden rounded-full bg-muted-bg">
        {distribution.slice(0, 5).map((item, index) => (
          <div
            key={item.roleName}
            className={cn('h-full transition-all', colors[index % colors.length])}
            style={{ width: `${item.percentage}%` }}
            title={`${item.roleName}: ${item.count} users (${item.percentage}%)`}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-2">
        {distribution.slice(0, 3).map((item, index) => (
          <div key={item.roleName} className="flex items-center gap-1.5">
            <div className={cn('size-2 rounded-full', colors[index % colors.length])} />
            <span className="text-xs text-tertiary">{item.roleName}</span>
          </div>
        ))}
        {distribution.length > 3 && (
          <span className="text-xs text-tertiary">+{distribution.length - 3} more</span>
        )}
      </div>
    </div>
  )
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function UserStatsCards({ stats, className }: UserStatsCardsProps) {
  const activePercentage = stats.totalUsers > 0
    ? Math.round((stats.activeUsers / stats.totalUsers) * 100)
    : 0

  return (
    <div
      data-slot="user-stats-cards"
      className={cn('grid grid-cols-2 gap-4 md:grid-cols-4', className)}
    >
      {/* Total Users */}
      <StatCard
        icon={<Users className="size-5 text-accent" />}
        iconBg="bg-accent/10"
        label="Total Users"
        value={stats.totalUsers}
        trend={stats.trend}
      />

      {/* Active Users */}
      <StatCard
        icon={<UserCheck className="size-5 text-success" />}
        iconBg="bg-success/10"
        label="Active Users"
        value={stats.activeUsers}
        subValue={`${activePercentage}% of total`}
      />

      {/* Pending Invites */}
      <StatCard
        icon={<UserPlus className="size-5 text-warning" />}
        iconBg="bg-warning/10"
        label="Pending Invites"
        value={stats.pendingInvites}
        subValue={stats.pendingInvites > 0 ? 'Awaiting activation' : 'No pending invites'}
      />

      {/* Role Distribution */}
      <RoleDistributionBar distribution={stats.roleDistribution} />
    </div>
  )
}

UserStatsCards.displayName = 'UserStatsCards'

export default UserStatsCards
