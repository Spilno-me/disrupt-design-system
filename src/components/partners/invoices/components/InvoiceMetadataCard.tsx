import * as React from 'react'
import { AppCard, AppCardContent, AppCardHeader, AppCardTitle, AppCardDescription } from '../../../ui/app-card'
import type { Invoice } from '../types'

// =============================================================================
// TYPES
// =============================================================================

export interface InvoiceMetadataCardProps {
  /** Invoice metadata */
  metadata?: Invoice['metadata']
}

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * InvoiceMetadataCard - Displays company metadata (size, employees, users)
 *
 * Read-only - metadata is not editable on invoice.
 */
export function InvoiceMetadataCard({ metadata }: InvoiceMetadataCardProps) {
  // Don't render if no metadata
  if (!metadata) return null

  // Don't render if all values are empty
  const hasData = metadata.companySize || metadata.employees || metadata.totalUsers || metadata.pricingVersion
  if (!hasData) return null

  return (
    <AppCard shadow="sm" role="group" aria-labelledby="metadata-heading">
      <AppCardHeader>
        <AppCardTitle id="metadata-heading" className="text-lg">Company Details</AppCardTitle>
        <AppCardDescription>Additional customer information</AppCardDescription>
      </AppCardHeader>
      <AppCardContent>
        <div className="grid grid-cols-2 gap-3">
          {metadata.companySize && (
            <MetadataItem label="Company Size" value={metadata.companySize} />
          )}
          {metadata.employees && (
            <MetadataItem label="Employees" value={metadata.employees.toLocaleString()} />
          )}
          {metadata.totalUsers && (
            <MetadataItem label="Total Users" value={metadata.totalUsers.toLocaleString()} />
          )}
          {metadata.pricingVersion && (
            <MetadataItem label="Pricing" value={metadata.pricingVersion} />
          )}
        </div>
      </AppCardContent>
    </AppCard>
  )
}

/** Metadata item display */
function MetadataItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 rounded-lg bg-muted-bg">
      <div className="text-xs text-muted mb-1">{label}</div>
      <div className="text-sm font-medium text-primary">{value}</div>
    </div>
  )
}

export default InvoiceMetadataCard
