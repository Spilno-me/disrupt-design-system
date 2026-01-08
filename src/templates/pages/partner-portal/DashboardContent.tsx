/**
 * DashboardContent - Dashboard tab content for Partner Portal
 *
 * Renders the dashboard page with KPIs, activity, and quick actions.
 */

import * as React from 'react'
import { DashboardPage } from '../DashboardPage'
import type { DashboardConfig } from './types'
import type { KPICardData, QuickActionData } from '../DashboardPage'

export interface DashboardContentProps {
  /** User's first name for greeting */
  userName: string
  /** Custom dashboard configuration */
  dashboardConfig?: DashboardConfig
  /** Role-based KPIs (fallback) */
  roleKpis: KPICardData[]
  /** Role-based quick actions (fallback) */
  roleQuickActions: QuickActionData[]
}

export function DashboardContent({
  userName,
  dashboardConfig,
  roleKpis,
  roleQuickActions,
}: DashboardContentProps) {
  return (
    <DashboardPage
      title="Dashboard"
      subtitle={`Welcome back, ${userName}`}
      kpis={dashboardConfig?.kpis ?? roleKpis}
      activity={dashboardConfig?.activity ?? []}
      quickActions={dashboardConfig?.quickActions ?? roleQuickActions}
    />
  )
}
