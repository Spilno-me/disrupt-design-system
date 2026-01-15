/**
 * TenantsContent - Tenants tab content for Partner Portal (V2)
 *
 * Upgraded to use TenantsPageV2 with:
 * - Tabbed interface (Direct Tenants / Passive Income)
 * - Unified onChangeStatus callback
 * - Role-based tab visibility
 *
 * @since v2.0
 */

import * as React from 'react'
import {
  TenantsPageV2,
  type Tenant,
  type PassiveIncomeTenant,
  type ChangeStatusFormData,
  type UserRole,
  type TenantsStatsV2,
} from '../../../components/tenants'

export interface TenantsContentProps {
  /** Tenants data */
  tenants: Tenant[]
  /** Passive income data (sub-partner earnings) */
  passiveIncomeData?: PassiveIncomeTenant[]
  /** V2 Stats data */
  stats?: TenantsStatsV2
  /** Current user role for tab visibility */
  userRole?: UserRole
  /** Callback when viewing tenant details */
  onViewTenant?: (tenant: Tenant) => void
  /** Callback when tenant status is changed (unified) */
  onChangeStatus?: (tenant: Tenant, data: ChangeStatusFormData) => void
  /** Loading state */
  loading?: boolean
}

export function TenantsContent({
  tenants,
  passiveIncomeData,
  stats,
  userRole = 'partner-admin',
  onViewTenant,
  onChangeStatus,
  loading,
}: TenantsContentProps) {
  return (
    <TenantsPageV2
      tenants={tenants}
      passiveIncomeData={passiveIncomeData}
      stats={stats}
      userRole={userRole}
      onViewTenant={onViewTenant}
      onChangeStatus={onChangeStatus}
      loading={loading}
    />
  )
}
