/**
 * useRoleDashboardConfig - Role-Based Dashboard Configuration Hook
 *
 * Generates KPIs and Quick Actions based on user role:
 * - System Admin: All partners view, "Submitted Requests" KPI
 * - Partner: Own + sub-partner data, "Approved Requests" KPI
 * - Sub-Partner: Own data only, "Approved Requests" KPI
 *
 * @module partners/dashboard/hooks/useRoleDashboardConfig
 */

import { useMemo } from 'react'
import { DollarSign, Users, ClipboardList, UserPlus, Zap } from 'lucide-react'
import type { KPICardData, QuickActionData, ActivityItemData } from '../../../../templates/pages/DashboardPage'
import { formatCurrency } from '../../../../lib/format'
import type { UserRole, DashboardHandlers, DashboardMockData } from '../types/dashboard.types'

// =============================================================================
// CONSTANTS
// =============================================================================

/** Lead statuses considered "in progress" - MVP uses single 'in_progress' status */
const LEAD_PROGRESS_STATUSES: string[] = ['in_progress']

// =============================================================================
// HOOK
// =============================================================================

interface UseRoleDashboardConfigProps {
  /** Current user's role */
  userRole: UserRole
  /** Callback handlers for dashboard interactions */
  handlers: DashboardHandlers
  /** Mock data for KPI values */
  data: DashboardMockData
}

interface UseRoleDashboardConfigResult {
  /** KPI cards for the dashboard */
  kpis: KPICardData[]
  /** Quick action buttons */
  quickActions: QuickActionData[]
  /** Activity feed items */
  activity: ActivityItemData[]
}

/**
 * Hook that returns role-specific dashboard configuration.
 *
 * @example
 * ```tsx
 * const { kpis, quickActions, activity } = useRoleDashboardConfig({
 *   userRole: 'partner',
 *   handlers: { onNavigate, onCreateLead, onCreateTenantRequest, onAddPartner },
 *   data: MOCK_DASHBOARD_DATA.partner
 * })
 * ```
 */
export function useRoleDashboardConfig({
  userRole,
  handlers,
  data,
}: UseRoleDashboardConfigProps): UseRoleDashboardConfigResult {
  // ---------------------------------------------------------------------------
  // KPIs (memoized to prevent re-renders)
  // ---------------------------------------------------------------------------
  const kpis = useMemo<KPICardData[]>(() => {
    const baseKpis: KPICardData[] = [
      // Revenue KPI - non-clickable with subtitle
      {
        id: 'revenue',
        label: 'Monthly Revenue',
        value: formatCurrency(data.monthlyRevenue),
        trend: '+12%',
        trendDirection: 'up',
        icon: <DollarSign className="w-5 h-5 text-success" />,
        subtitle: `${data.activeTenants} active tenants`,
        // No onClick - static display
      },
      // New Leads - clickable, navigates with filter
      {
        id: 'new-leads',
        label: 'New Leads',
        value: data.newLeadsCount,
        trend: data.newLeadsCount > 0 ? `+${data.newLeadsCount}` : undefined,
        trendDirection: data.newLeadsCount > 0 ? 'up' : 'neutral',
        icon: <Users className="w-5 h-5 text-info" />,
        onClick: () => handlers.onNavigate('leads', { status: ['new'] }),
      },
      // Leads in Progress - clickable, navigates with filter
      {
        id: 'leads-in-progress',
        label: 'Leads in Progress',
        value: data.inProgressLeadsCount,
        icon: <Users className="w-5 h-5 text-warning" />,
        onClick: () => handlers.onNavigate('leads', { status: LEAD_PROGRESS_STATUSES }),
      },
    ]

    // Role-specific 4th KPI
    if (userRole === 'system_admin') {
      // System Admin sees "Submitted Requests" (awaiting approval per spec)
      baseKpis.push({
        id: 'submitted-requests',
        label: 'Submitted Requests',
        value: data.submittedRequestsCount,
        icon: <ClipboardList className="w-5 h-5 text-accent" />,
        onClick: () => handlers.onNavigate('tenant-requests', { status: ['submitted'] }),
      })
    } else {
      // Partner and Sub-Partner see "Approved Requests"
      baseKpis.push({
        id: 'approved-requests',
        label: 'Approved Requests',
        value: data.approvedRequestsCount,
        trend: data.approvedRequestsCount > 0 ? `+${data.approvedRequestsCount}` : undefined,
        trendDirection: data.approvedRequestsCount > 0 ? 'up' : 'neutral',
        icon: <ClipboardList className="w-5 h-5 text-success" />,
        onClick: () => handlers.onNavigate('tenant-requests', { status: ['approved'] }),
      })
    }

    return baseKpis
  }, [userRole, data, handlers])

  // ---------------------------------------------------------------------------
  // Quick Actions (filtered by role)
  // ---------------------------------------------------------------------------
  const quickActions = useMemo<QuickActionData[]>(() => {
    const actions: QuickActionData[] = [
      // Create Lead - available to all roles
      {
        id: 'create-lead',
        label: 'Create Lead',
        icon: <Users className="w-4 h-4" />,
        onClick: handlers.onCreateLead,
        variant: 'primary',
      },
      // Create Tenant Request - available to all roles
      {
        id: 'create-tenant-request',
        label: 'Create Tenant Request',
        icon: <Zap className="w-4 h-4" />,
        onClick: handlers.onCreateTenantRequest,
      },
    ]

    // Add Partner - only for System Admin and Partner
    if (userRole === 'system_admin' || userRole === 'partner') {
      actions.push({
        id: 'add-partner',
        label: userRole === 'partner' ? 'Add Sub-Partner' : 'Add Partner',
        icon: <UserPlus className="w-4 h-4" />,
        onClick: handlers.onAddPartner,
      })
    }

    return actions
  }, [userRole, handlers])

  // ---------------------------------------------------------------------------
  // Activity (static for now, could be role-filtered in future)
  // ---------------------------------------------------------------------------
  const activity = useMemo<ActivityItemData[]>(() => [], [])

  return { kpis, quickActions, activity }
}
