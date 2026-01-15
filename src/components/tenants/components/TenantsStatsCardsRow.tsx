/**
 * TenantsStatsCardsRow - Row of clickable KPI stats cards for Tenants page
 * @module tenants/components/TenantsStatsCardsRow
 *
 * Displays status-based KPI widgets:
 * - Total Tenants (clears all filters)
 * - Active
 * - Overdue
 * - Suspended
 *
 * Widget click applies status filter to the table.
 * Clicking active widget again removes that filter.
 */

import { StatsCard } from '../../shared/StatsCard'
import type { TenantsStats, TenantWidgetFilter } from '../types'

// =============================================================================
// TYPES
// =============================================================================

export interface TenantsStatsCardsRowProps {
  /** Stats data for each widget */
  stats: TenantsStats
  /** Currently active widget filter */
  activeWidget: TenantWidgetFilter
  /** Callback when a widget is clicked */
  onWidgetClick: (widget: TenantWidgetFilter) => void
}

// =============================================================================
// COMPONENT
// =============================================================================

export function TenantsStatsCardsRow({
  stats,
  activeWidget,
  onWidgetClick,
}: TenantsStatsCardsRowProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {/* Total Tenants - clears all widget filters */}
      <StatsCard
        title="Total Tenants"
        value={stats.total.value}
        trend={stats.total.trend}
        trendDirection={stats.total.trendDirection}
        onClick={() => onWidgetClick('all')}
        active={activeWidget === 'all'}
        data-testid="tenants-widget-total"
      />

      {/* Active */}
      <StatsCard
        title="Active"
        value={stats.active.value}
        trend={stats.active.trend}
        trendDirection={stats.active.trendDirection}
        onClick={() => onWidgetClick('active')}
        active={activeWidget === 'active'}
        data-testid="tenants-widget-active"
      />

      {/* Overdue */}
      <StatsCard
        title="Overdue"
        value={stats.overdue.value}
        trend={stats.overdue.trend}
        trendDirection={stats.overdue.trendDirection}
        onClick={() => onWidgetClick('overdue')}
        active={activeWidget === 'overdue'}
        data-testid="tenants-widget-overdue"
      />

      {/* Suspended */}
      <StatsCard
        title="Suspended"
        value={stats.suspended.value}
        trend={stats.suspended.trend}
        trendDirection={stats.suspended.trendDirection}
        onClick={() => onWidgetClick('suspended')}
        active={activeWidget === 'suspended'}
        data-testid="tenants-widget-suspended"
      />
    </div>
  )
}

export default TenantsStatsCardsRow
