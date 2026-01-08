/**
 * TenantRequestsContent - Tenant requests tab content for Partner Portal
 *
 * Displays tenant provisioning requests with stats and data table.
 */

import * as React from 'react'
import { StatsCard } from '../../../components/shared/StatsCard'
import { DataTable, ColumnDef } from '../../../components/ui/DataTable'
import { Badge } from '../../../components/ui/badge'
import { DataTableStatusDot, TENANT_REQUEST_DOT_STATUS_MAP } from '../../../components/ui/table'
import { MOCK_TENANT_REQUESTS } from './mock-data'
import type { TenantRequest } from './types'

/** Column definitions for tenant requests table */
const TENANT_REQUEST_COLUMNS: ColumnDef<TenantRequest>[] = [
  {
    id: 'requestNumber',
    header: 'Request #',
    accessor: (row) => <span className="font-mono text-sm">{row.requestNumber}</span>,
  },
  {
    id: 'companyName',
    header: 'Company',
    accessor: (row) => (
      <div>
        <div className="font-medium text-primary">{row.companyName}</div>
        <div className="text-sm text-muted">{row.contactName}</div>
      </div>
    ),
    sortable: true,
  },
  {
    id: 'pricingTier',
    header: 'Tier',
    accessor: (row) => (
      <Badge variant={row.pricingTier === 'enterprise' ? 'default' : 'secondary'}>
        {row.pricingTier.charAt(0).toUpperCase() + row.pricingTier.slice(1)}
      </Badge>
    ),
  },
  {
    id: 'estimatedValue',
    header: 'Value',
    accessor: (row) => (
      <span className="font-medium">${row.estimatedValue.toLocaleString()}</span>
    ),
    align: 'right',
    sortable: true,
  },
  {
    id: 'status',
    header: 'Status',
    accessor: (row) => (
      <DataTableStatusDot status={row.status} mapping={TENANT_REQUEST_DOT_STATUS_MAP} />
    ),
    align: 'left',
  },
  {
    id: 'submittedAt',
    header: 'Submitted',
    accessor: (row) => row.submittedAt,
    sortable: true,
  },
]

export interface TenantRequestsContentProps {
  /** Optional custom requests data (defaults to mock) */
  requests?: TenantRequest[]
  /** Callback when a request row is clicked */
  onRequestClick?: (request: TenantRequest) => void
}

export function TenantRequestsContent({
  requests = MOCK_TENANT_REQUESTS,
  onRequestClick,
}: TenantRequestsContentProps) {
  // Calculate stats from data
  const stats = React.useMemo(() => ({
    total: requests.length,
    pendingReview: requests.filter((r) => r.status === 'pending_review').length,
    approved: requests.filter((r) => r.status === 'approved').length,
    inProgress: requests.filter(
      (r) => r.status === 'pending_payment' || r.status === 'provisioning'
    ).length,
  }), [requests])

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-primary">Tenant Requests</h1>
        <p className="text-secondary mt-1">
          Review and manage tenant provisioning requests
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Requests" value={stats.total} />
        <StatsCard
          title="Pending Review"
          value={stats.pendingReview}
          trend={`${stats.pendingReview}`}
          trendDirection="neutral"
        />
        <StatsCard
          title="Approved"
          value={stats.approved}
          trend="+2"
          trendDirection="up"
        />
        <StatsCard title="In Progress" value={stats.inProgress} />
      </div>

      {/* Data Table */}
      <div className="bg-surface rounded-lg border border-default overflow-hidden">
        <DataTable
          data={requests}
          columns={TENANT_REQUEST_COLUMNS}
          getRowId={(row) => row.id}
          onRowClick={onRequestClick ?? ((row) => console.log('Request clicked:', row))}
          emptyState={
            <div className="text-center py-12">
              <p className="text-muted">No tenant requests found</p>
            </div>
          }
        />
      </div>
    </div>
  )
}
