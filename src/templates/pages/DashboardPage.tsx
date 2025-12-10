/**
 * DashboardPage - Reusable Dashboard Component for App Templates
 *
 * A fully customizable dashboard with KPIs, activity feed, and quick actions.
 */

import * as React from 'react'
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ArrowRight,
  Clock,
  CheckCircle2,
  Zap,
  Users,
  FileText,
  LucideIcon,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Skeleton } from '../../components/ui/Skeleton'
import { cn } from '../../lib/utils'

// =============================================================================
// TYPES
// =============================================================================

export interface KPICardData {
  id: string
  label: string
  value: string | number
  trend?: string
  trendDirection?: 'up' | 'down' | 'neutral'
  icon?: React.ReactNode
  onClick?: () => void
}

export interface ActivityItemData {
  id: string
  type: 'info' | 'success' | 'warning' | 'error' | string
  title: string
  description: string
  timestamp: string
  icon?: React.ReactNode
  onClick?: () => void
}

export interface QuickActionData {
  id: string
  label: string
  description?: string
  icon: React.ReactNode
  onClick: () => void
  variant?: 'default' | 'primary' | 'accent'
}

export interface DashboardPageProps {
  /** Page title */
  title?: string
  /** Subtitle or welcome message */
  subtitle?: string
  /** KPI cards data */
  kpis?: KPICardData[]
  /** Recent activity items */
  activity?: ActivityItemData[]
  /** Quick action buttons */
  quickActions?: QuickActionData[]
  /** Loading state */
  isLoading?: boolean
  /** Custom content to render below KPIs */
  children?: React.ReactNode
  /** Custom class name */
  className?: string
  /** Activity section title */
  activityTitle?: string
  /** Quick actions section title */
  actionsTitle?: string
  /** Number of KPI columns on large screens */
  kpiColumns?: 2 | 3 | 4
  /** Hide activity section */
  hideActivity?: boolean
  /** Hide quick actions section */
  hideQuickActions?: boolean
}

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

function KPICard({ kpi }: { kpi: KPICardData }) {
  const TrendIcon =
    kpi.trendDirection === 'up'
      ? TrendingUp
      : kpi.trendDirection === 'down'
      ? TrendingDown
      : AlertTriangle

  const trendColor =
    kpi.trendDirection === 'up'
      ? 'text-success'
      : kpi.trendDirection === 'down'
      ? 'text-warning'
      : 'text-muted'

  return (
    <Card
      className={cn(
        'bg-surface border-default transition-shadow',
        kpi.onClick && 'cursor-pointer hover:shadow-md'
      )}
      onClick={kpi.onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {kpi.icon && (
              <div className="p-2 rounded-lg bg-muted-bg">{kpi.icon}</div>
            )}
            <div>
              <p className="text-sm text-secondary">{kpi.label}</p>
              <p className="text-2xl font-bold text-primary">{kpi.value}</p>
            </div>
          </div>
          {kpi.trend && (
            <div className={cn('flex items-center gap-1 text-sm', trendColor)}>
              <TrendIcon className="w-4 h-4" />
              {kpi.trend}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function KPICardSkeleton() {
  return (
    <Card className="bg-surface border-default">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-8 w-16" />
          </div>
          <Skeleton className="h-6 w-12" />
        </div>
      </CardContent>
    </Card>
  )
}

const activityIcons: Record<string, LucideIcon> = {
  info: Clock,
  success: CheckCircle2,
  warning: Zap,
  error: AlertTriangle,
  lead: Users,
  invoice: FileText,
}

const activityColors: Record<string, string> = {
  info: 'text-teal',
  success: 'text-success',
  warning: 'text-warning',
  error: 'text-error',
  lead: 'text-info',
  invoice: 'text-secondary',
}

function ActivityCard({
  activity,
  onClick,
}: {
  activity: ActivityItemData
  onClick?: () => void
}) {
  const IconComponent = activityIcons[activity.type] || Clock
  const iconColor = activityColors[activity.type] || 'text-teal'

  return (
    <div
      className={cn(
        'flex items-center gap-3 p-3 rounded-lg bg-muted-bg',
        onClick && 'cursor-pointer hover:bg-surface-hover transition-colors'
      )}
      onClick={onClick || activity.onClick}
    >
      {activity.icon || <IconComponent className={cn('w-5 h-5', iconColor)} />}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-primary truncate">
          {activity.title}
        </p>
        <p className="text-xs text-secondary truncate">{activity.description}</p>
      </div>
      <span className="text-xs text-muted whitespace-nowrap">
        {activity.timestamp}
      </span>
    </div>
  )
}

function ActivitySkeleton() {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted-bg">
      <Skeleton className="w-5 h-5 rounded" />
      <div className="flex-1">
        <Skeleton className="h-4 w-3/4 mb-1" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <Skeleton className="h-3 w-12" />
    </div>
  )
}

function QuickActionButton({ action }: { action: QuickActionData }) {
  return (
    <Button
      variant={action.variant === 'primary' ? 'accent' : 'secondary'}
      className="w-full justify-between"
      onClick={action.onClick}
    >
      <span className="flex items-center gap-2">
        {action.icon}
        {action.label}
      </span>
      <ArrowRight className="w-4 h-4" />
    </Button>
  )
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

/**
 * DashboardPage - Reusable dashboard layout
 *
 * @example Basic usage
 * ```tsx
 * <DashboardPage
 *   title="Dashboard"
 *   subtitle="Welcome back, John"
 *   kpis={[
 *     { id: '1', label: 'Revenue', value: '$1.2M', trend: '+12%', trendDirection: 'up' },
 *     { id: '2', label: 'Users', value: 1234, trend: '+5%', trendDirection: 'up' },
 *   ]}
 *   activity={[
 *     { id: '1', type: 'success', title: 'New sale', description: 'Order #123', timestamp: '2h ago' },
 *   ]}
 *   quickActions={[
 *     { id: '1', label: 'Create Order', icon: <Plus />, onClick: () => {} },
 *   ]}
 * />
 * ```
 */
export function DashboardPage({
  title = 'Dashboard',
  subtitle,
  kpis = [],
  activity = [],
  quickActions = [],
  isLoading = false,
  children,
  className,
  activityTitle = 'Recent Activity',
  actionsTitle = 'Quick Actions',
  kpiColumns = 4,
  hideActivity = false,
  hideQuickActions = false,
}: DashboardPageProps) {
  const kpiGridClass =
    kpiColumns === 2
      ? 'grid-cols-1 sm:grid-cols-2'
      : kpiColumns === 3
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'

  return (
    <div className={cn('flex flex-col gap-6 p-6', className)}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h1 className="text-2xl font-semibold text-primary">{title}</h1>
        {subtitle && <span className="text-sm text-secondary">{subtitle}</span>}
      </div>

      {/* KPI Cards */}
      {(kpis.length > 0 || isLoading) && (
        <div className={cn('grid gap-4', kpiGridClass)}>
          {isLoading
            ? Array.from({ length: kpiColumns }).map((_, i) => (
                <KPICardSkeleton key={i} />
              ))
            : kpis.map((kpi) => <KPICard key={kpi.id} kpi={kpi} />)}
        </div>
      )}

      {/* Custom content */}
      {children}

      {/* Activity and Quick Actions */}
      {(!hideActivity || !hideQuickActions) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Activity Feed */}
          {!hideActivity && (
            <Card className="bg-surface border-default">
              <CardHeader>
                <CardTitle className="text-lg">{activityTitle}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <ActivitySkeleton key={i} />
                  ))
                ) : activity.length > 0 ? (
                  activity.map((item) => (
                    <ActivityCard key={item.id} activity={item} />
                  ))
                ) : (
                  <p className="text-sm text-muted text-center py-4">
                    No recent activity
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          {!hideQuickActions && (
            <Card className="bg-surface border-default">
              <CardHeader>
                <CardTitle className="text-lg">{actionsTitle}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))
                ) : quickActions.length > 0 ? (
                  quickActions.map((action) => (
                    <QuickActionButton key={action.id} action={action} />
                  ))
                ) : (
                  <p className="text-sm text-muted text-center py-4">
                    No quick actions configured
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}

export default DashboardPage
