/**
 * Mock Dashboard Data by Role
 *
 * Sample data for the Partner Portal Dashboard KPIs.
 * Each role sees different data scopes:
 * - System Admin: Aggregate across all partners
 * - Partner: Own sales + sub-partner aggregates
 * - Sub-Partner: Own data only
 *
 * @module partners/dashboard/data/mock-dashboard-data
 */

import type { RoleDashboardMockData } from '../types/dashboard.types'

/**
 * Mock dashboard data organized by user role.
 * Replace with API data in production.
 */
export const MOCK_DASHBOARD_DATA: RoleDashboardMockData = {
  // System Admin sees aggregate data across all partners
  system_admin: {
    monthlyRevenue: 156000,
    activeTenants: 47,
    newLeadsCount: 12,
    inProgressLeadsCount: 8,
    submittedRequestsCount: 4, // Requests pending admin review
    approvedRequestsCount: 6, // N/A for admin but included for type consistency
  },

  // Partner sees their own + sub-partner aggregated data
  partner: {
    monthlyRevenue: 48000,
    activeTenants: 12,
    newLeadsCount: 5,
    inProgressLeadsCount: 3,
    submittedRequestsCount: 0, // N/A for partner but included for type consistency
    approvedRequestsCount: 2, // Requests approved and ready for provisioning
  },

  // Sub-Partner sees only their own data
  sub_partner: {
    monthlyRevenue: 12000,
    activeTenants: 4,
    newLeadsCount: 2,
    inProgressLeadsCount: 1,
    submittedRequestsCount: 0, // N/A
    approvedRequestsCount: 1,
  },
}
