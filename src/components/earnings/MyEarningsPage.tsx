"use client"

import * as React from "react"
import { useState, useMemo } from "react"
import {
  Wallet,
  DollarSign,
  TrendingUp,
} from "lucide-react"
import { cn } from "../../lib/utils"
import { formatCurrency } from "../../lib/format"

// Extracted modules
import type { Earning, EarningsSummary, MyEarningsPageProps } from "./types"
import { MOCK_EARNINGS, MOCK_EARNINGS_SUMMARY } from "./data/mock-earnings"

// UI components
import { Badge } from "../ui/badge"
import { DataTable, type ColumnDef } from "../ui/DataTable"
import { DataTableStatusDot, type DotStatusMapping } from "../ui/table"
import { PageActionPanel } from "../ui/PageActionPanel"
import { StatsCard } from "../shared/StatsCard"

// Re-export types and data for external consumers
export type { Earning, EarningsSummary, MyEarningsPageProps }
export { MOCK_EARNINGS, MOCK_EARNINGS_SUMMARY }

// =============================================================================
// STATUS MAPPING
// =============================================================================

export const EARNING_DOT_STATUS_MAP: DotStatusMapping = {
  paid: { label: "Paid", variant: "success" },
  pending: { label: "Pending", variant: "warning" },
  processing: { label: "Processing", variant: "info" },
}

// =============================================================================
// HELPERS
// =============================================================================

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date)
}

const getTypeVariant = (type: Earning["type"]) => {
  switch (type) {
    case "direct":
      return "default" as const
    case "passive":
      return "info" as const
    default:
      return "secondary" as const
  }
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

/**
 * MyEarningsPage - Partner earnings dashboard page
 *
 * Features:
 * - Summary cards showing key earnings metrics
 * - Data table with earnings history
 * - Pagination
 */
export function MyEarningsPage({
  summary = MOCK_EARNINGS_SUMMARY,
  earnings = MOCK_EARNINGS,
  loading = false,
  className,
}: MyEarningsPageProps) {
  // State
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Paginated earnings
  const paginatedEarnings = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return earnings.slice(startIndex, startIndex + pageSize)
  }, [earnings, currentPage, pageSize])

  // Column definitions
  const columns: ColumnDef<Earning>[] = [
    {
      id: "date",
      header: "Date",
      sortable: true,
      sortValue: (row) => row.date,
      accessor: (row) => (
        <span className="text-sm text-primary">{formatDate(row.date)}</span>
      ),
    },
    {
      id: "tenant",
      header: "Tenant",
      sortable: true,
      sortValue: (row) => row.tenantName,
      accessor: (row) => (
        <span className="font-medium text-primary">{row.tenantName}</span>
      ),
    },
    {
      id: "type",
      header: "Type",
      sortable: true,
      sortValue: (row) => row.type,
      accessor: (row) => (
        <Badge variant={getTypeVariant(row.type)} className="capitalize">
          {row.type}
        </Badge>
      ),
    },
    {
      id: "amount",
      header: "Amount",
      sortable: true,
      sortValue: (row) => row.amount,
      align: "right",
      accessor: (row) => (
        <span className="text-sm font-semibold text-primary">
          {formatCurrency(row.amount)}
        </span>
      ),
    },
    {
      id: "status",
      header: "Status",
      sortable: true,
      sortValue: (row) => row.status,
      accessor: (row) => <DataTableStatusDot status={row.status} mapping={EARNING_DOT_STATUS_MAP} />,
    },
  ]

  return (
    <main
      data-slot="my-earnings-page"
      data-testid="my-earnings-page"
      className={cn("min-h-screen", className)}
    >
      {/* Content */}
      <div className="flex flex-col gap-6 p-4 md:p-6">
        {/* Page Action Panel */}
        <PageActionPanel
          icon={<Wallet className="w-6 h-6 md:w-8 md:h-8" />}
          iconClassName="text-accent"
          title="My Earnings"
          subtitle="Track your commissions and payouts"
        />

        {/* Summary Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" data-testid="my-earnings-summary-cards">
          <StatsCard
            title="Total Earnings"
            value={formatCurrency(summary.totalEarnings)}
            trend="+15%"
            trendDirection="up"
            data-testid="my-earnings-total-card"
          />
          <StatsCard
            title="Direct Commission"
            value={formatCurrency(summary.directCommission)}
            description="From your direct sales"
            data-testid="my-earnings-direct-card"
          />
          <StatsCard
            title="Passive Commission"
            value={formatCurrency(summary.passiveCommission)}
            description="From sub-partner sales"
            data-testid="my-earnings-passive-card"
          />
          <StatsCard
            title="Pending Payouts"
            value={formatCurrency(summary.pendingPayouts)}
            description="Awaiting processing"
            data-testid="my-earnings-pending-card"
          />
        </div>

        {/* Glass container for earnings table */}
        <section className="rounded-xl border-2 border-accent bg-white/40 dark:bg-black/40 backdrop-blur-[4px] shadow-md">
          <div className="flex flex-col gap-4 p-4 md:p-6">
            {/* Section Header */}
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-accent" />
              <h2 className="text-lg font-semibold text-primary">Earnings History</h2>
            </div>

            {/* Data Table */}
            <DataTable
              data={paginatedEarnings}
              columns={columns}
              getRowId={(row) => row.id}
              loading={loading}
              hoverable
              bordered
              // Pagination embedded in table footer
              pagination
              currentPage={currentPage}
              totalItems={earnings.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={(size) => {
                setPageSize(size)
                setCurrentPage(1)
              }}
              pageSizeOptions={[10, 25, 50]}
              data-testid="my-earnings-table"
              emptyState={
                <div className="flex flex-col items-center py-8">
                  <div className="w-16 h-16 mb-4 rounded-full bg-muted-bg flex items-center justify-center">
                    <DollarSign className="h-8 w-8 text-muted" />
                  </div>
                  <h3 className="text-lg font-semibold text-primary mb-2">
                    No earnings yet
                  </h3>
                  <p className="text-muted text-sm max-w-sm text-center">
                    Your commission earnings will appear here once tenants are active.
                  </p>
                </div>
              }
            />
          </div>
        </section>
      </div>
    </main>
  )
}

export default MyEarningsPage
