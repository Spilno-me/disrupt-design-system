/**
 * TenantsStatsCardsRowV2 - V2 KPI stats row per spec Section 5.1
 * @module tenants/components/TenantsStatsCardsRowV2
 *
 * Widget structure (4 widgets, left-to-right):
 * 1. Active - CLICKABLE (filters to active tenants)
 * 2. MRR - INFORMATIONAL (shows Monthly Recurring Revenue)
 * 3. ARR - INFORMATIONAL (shows Annual Recurring Revenue = MRR × 12)
 * 4. Overdue - CLICKABLE (filters to overdue tenants)
 *
 * Per spec: MRR/ARR are for visibility only, not clickable.
 *
 * @since v2.0
 */

import { StatsCard } from "../../shared/StatsCard"
import { formatCompactCurrency } from "../../../lib/format"
import type { TenantsStatsV2, TenantWidgetFilterV2 } from "../types"

// =============================================================================
// TYPES
// =============================================================================

export interface TenantsStatsCardsRowV2Props {
  /** V2 Stats data (Active, MRR, ARR, Overdue) */
  stats: TenantsStatsV2
  /** Currently active widget filter (only 'active' | 'overdue' | null) */
  activeWidget: TenantWidgetFilterV2
  /** Callback when a clickable widget is clicked */
  onWidgetClick: (widget: TenantWidgetFilterV2) => void
}

// =============================================================================
// WIDGET CONFIG
// =============================================================================

const WIDGET_TITLES = {
  active: "Active Tenants",
  mrr: "MRR",
  arr: "ARR",
  overdue: "Overdue",
} as const

const WIDGET_DESCRIPTIONS = {
  mrr: "Monthly Recurring Revenue",
  arr: "Annual Recurring Revenue",
} as const

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * TenantsStatsCardsRowV2 - V2 widget row with MRR/ARR metrics
 *
 * @example
 * ```tsx
 * <TenantsStatsCardsRowV2
 *   stats={statsV2}
 *   activeWidget={activeWidget}
 *   onWidgetClick={handleWidgetClick}
 * />
 * ```
 */
export function TenantsStatsCardsRowV2({
  stats,
  activeWidget,
  onWidgetClick,
}: TenantsStatsCardsRowV2Props) {
  const handleActiveClick = () => onWidgetClick(activeWidget === "active" ? null : "active")
  const handleOverdueClick = () => onWidgetClick(activeWidget === "overdue" ? null : "overdue")

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {/* 1. Active - CLICKABLE */}
      <StatsCard
        title={WIDGET_TITLES.active}
        value={stats.active.value}
        trend={stats.active.trend}
        trendDirection={stats.active.trendDirection}
        onClick={handleActiveClick}
        active={activeWidget === "active"}
        data-testid="tenants-widget-active"
      />

      {/* 2. MRR - INFORMATIONAL (no onClick) */}
      <StatsCard
        title={WIDGET_TITLES.mrr}
        value={formatCompactCurrency(stats.mrr.value)}
        trendDirection={stats.mrr.trendDirection}
        description={WIDGET_DESCRIPTIONS.mrr}
        data-testid="tenants-widget-mrr"
      />

      {/* 3. ARR - INFORMATIONAL (no onClick) */}
      <StatsCard
        title={WIDGET_TITLES.arr}
        value={formatCompactCurrency(stats.arr.value)}
        trendDirection={stats.arr.trendDirection}
        description={WIDGET_DESCRIPTIONS.arr}
        data-testid="tenants-widget-arr"
      />

      {/* 4. Overdue - CLICKABLE */}
      <StatsCard
        title={WIDGET_TITLES.overdue}
        value={stats.overdue.value}
        trend={stats.overdue.trend}
        trendDirection={stats.overdue.trendDirection}
        onClick={handleOverdueClick}
        active={activeWidget === "overdue"}
        data-testid="tenants-widget-overdue"
      />
    </div>
  )
}

export default TenantsStatsCardsRowV2
