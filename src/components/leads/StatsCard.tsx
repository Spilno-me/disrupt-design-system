import * as React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '../../lib/utils'
import { AppCard } from '../ui/app-card'

// =============================================================================
// TYPES
// =============================================================================

export type TrendDirection = 'up' | 'down' | 'neutral'

export interface StatsCardProps {
  /** Title/label for the stat */
  title: string
  /** Main value to display */
  value: string | number
  /** Trend text (e.g., "+12%", "-2h") */
  trend?: string
  /** Direction of the trend */
  trendDirection?: TrendDirection
  /** Optional description text below value */
  description?: string
  /** Click handler for filtering (makes card interactive) */
  onClick?: () => void
  /** Whether this widget is currently active/selected */
  active?: boolean
  /** Additional className */
  className?: string
}

// =============================================================================
// STATS CARD COMPONENT
// =============================================================================

/**
 * StatsCard - A card displaying a key metric with optional trend indicator
 *
 * Used in dashboards to show KPIs like Total Leads, Conversion Rate, etc.
 * Follows the Figma design with white background, border, and shadow.
 *
 * @example
 * ```tsx
 * <StatsCard
 *   title="Total Leads"
 *   value={6}
 *   trend="+12%"
 *   trendDirection="up"
 * />
 * ```
 */
export function StatsCard({
  title,
  value,
  trend,
  trendDirection = 'neutral',
  description,
  onClick,
  active,
  className,
}: StatsCardProps) {
  const isInteractive = !!onClick

  return (
    <AppCard
      variant="default"
      shadow="md"
      className={cn(
        'gap-1 px-5 py-4',
        isInteractive && 'cursor-pointer transition-all',
        isInteractive && 'hover:border-accent hover:shadow-lg',
        isInteractive && 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
        active && 'ring-2 ring-accent border-accent',
        className
      )}
      onClick={onClick}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      aria-pressed={isInteractive ? active : undefined}
      onKeyDown={
        isInteractive
          ? (e: React.KeyboardEvent) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onClick?.()
              }
            }
          : undefined
      }
    >
      {/* Header row with title and trend */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm text-muted font-medium">{title}</span>
        {trend && <TrendBadge trend={trend} direction={trendDirection} />}
      </div>

      {/* Main value */}
      <div className="text-2xl font-semibold text-primary">{value}</div>

      {/* Optional description */}
      {description && <p className="text-xs text-muted">{description}</p>}
    </AppCard>
  )
}

// =============================================================================
// TREND BADGE SUBCOMPONENT
// =============================================================================

interface TrendBadgeProps {
  trend: string
  direction: TrendDirection
}

function TrendBadge({ trend, direction }: TrendBadgeProps) {
  const Icon = direction === 'down' ? TrendingDown : TrendingUp

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-md border',
        direction === 'up' && 'text-success border-success/30 bg-success-light',
        direction === 'down' && 'text-error border-error/30 bg-error-light',
        direction === 'neutral' && 'text-muted border-default bg-muted-bg'
      )}
    >
      {direction !== 'neutral' && <Icon className="w-3 h-3" />}
      {trend}
    </span>
  )
}

export default StatsCard
