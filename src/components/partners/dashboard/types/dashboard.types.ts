/**
 * Dashboard Types for Role-Based Partner Portal
 *
 * Supports three user roles with different KPIs and quick actions:
 * - System Admin: Full visibility across all partners
 * - Partner (Admin/Owner): Own sales + sub-partner data
 * - Sub-Partner (User): Own sales only
 *
 * @module partners/dashboard/types
 */

// =============================================================================
// USER ROLES
// =============================================================================

/**
 * User role determines:
 * - Which KPIs are displayed
 * - Data scope (all vs own)
 * - Available quick actions
 */
export type UserRole = 'system_admin' | 'partner' | 'sub_partner'

// =============================================================================
// NAVIGATION & FILTERING
// =============================================================================

/**
 * Filter criteria for page navigation from KPI clicks.
 * Converted to FilterState before passing to pages.
 */
export interface NavigationFilter {
  /** Lead/Request status filter */
  status?: string[]
  /** Lead priority filter */
  priority?: string[]
}

// =============================================================================
// DASHBOARD CONFIGURATION
// =============================================================================

/**
 * Handler callbacks for dashboard interactions.
 * Passed to useRoleDashboardConfig hook.
 */
export interface DashboardHandlers {
  /** Navigate to page with optional filter */
  onNavigate: (pageId: string, filters?: NavigationFilter) => void
  /** Open create lead dialog */
  onCreateLead: () => void
  /** Open create tenant request dialog/wizard */
  onCreateTenantRequest: () => void
  /** Open add partner dialog */
  onAddPartner: () => void
}

// =============================================================================
// MOCK DATA
// =============================================================================

/**
 * Mock data structure for dashboard KPIs.
 * Will be replaced with API data in production.
 */
export interface DashboardMockData {
  /** Total monthly revenue in dollars */
  monthlyRevenue: number
  /** Count of active tenants (for subtitle) */
  activeTenants: number
  /** Count of leads with status='new' */
  newLeadsCount: number
  /** Count of leads in progress (contacted, qualified) */
  inProgressLeadsCount: number
  /** Count of tenant requests pending review (System Admin) */
  submittedRequestsCount: number
  /** Count of approved tenant requests (Partner/Sub-Partner) */
  approvedRequestsCount: number
}

/**
 * Mock data organized by role.
 */
export interface RoleDashboardMockData {
  system_admin: DashboardMockData
  partner: DashboardMockData
  sub_partner: DashboardMockData
}
