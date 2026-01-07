/**
 * Partner Dashboard - Role-Based KPI Dashboard
 *
 * Provides role-specific KPIs and quick actions for:
 * - System Admin: All partners overview
 * - Partner: Own + sub-partner data
 * - Sub-Partner: Own data only
 *
 * @example
 * ```tsx
 * import { useRoleDashboardConfig, UserRole, MOCK_DASHBOARD_DATA } from '@/components/partners/dashboard'
 *
 * const { kpis, quickActions } = useRoleDashboardConfig({
 *   userRole: 'partner',
 *   handlers: { onNavigate, onCreateLead, ... },
 *   data: MOCK_DASHBOARD_DATA.partner
 * })
 * ```
 *
 * @module partners/dashboard
 */

// Types
export type {
  UserRole,
  NavigationFilter,
  DashboardHandlers,
  DashboardMockData,
  RoleDashboardMockData,
} from './types/dashboard.types'

// Hooks
export { useRoleDashboardConfig } from './hooks/useRoleDashboardConfig'

// Data
export { MOCK_DASHBOARD_DATA } from './data/mock-dashboard-data'
