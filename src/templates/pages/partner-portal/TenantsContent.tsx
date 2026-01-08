/**
 * TenantsContent - Tenants tab content for Partner Portal
 *
 * Tenant management with view, edit, suspend, activate actions.
 */

import * as React from 'react'
import { TenantsPage } from '../../../components/tenants'
import type { Tenant, TenantFormData } from '../../../components/tenants'

export interface TenantsContentProps {
  /** Tenants data */
  tenants: Tenant[]
  /** Callback when viewing tenant details */
  onViewTenant?: (tenant: Tenant) => void
  /** Callback when editing a tenant */
  onEditTenant?: (tenant: Tenant, data: TenantFormData) => void
  /** Callback when suspending a tenant */
  onSuspendTenant?: (tenant: Tenant) => void
  /** Callback when activating a tenant */
  onActivateTenant?: (tenant: Tenant) => void
}

export function TenantsContent({
  tenants,
  onViewTenant,
  onEditTenant,
  onSuspendTenant,
  onActivateTenant,
}: TenantsContentProps) {
  return (
    <div className="p-6">
      <TenantsPage
        tenants={tenants}
        onViewTenant={onViewTenant}
        onEditTenant={onEditTenant}
        onSuspendTenant={onSuspendTenant}
        onActivateTenant={onActivateTenant}
      />
    </div>
  )
}
