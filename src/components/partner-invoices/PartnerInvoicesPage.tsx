"use client"

/**
 * PartnerInvoicesPage - Read-only overview of all generated invoices
 * @module partner-invoices/PartnerInvoicesPage
 *
 * Per spec (06_invoices.md):
 * - READ-ONLY page (no create/edit/delete)
 * - Fast lookup for sold services and pricing
 * - Status overview of issued invoices
 * - Shortcut to view/download invoice documents
 *
 * Table Columns (per spec Section: Invoices Table):
 * 1. Reference (invoice reference number)
 * 2. Company / Tenant (company name bold, contact below)
 * 3. Contact (email + phone)
 * 4. Status (badge)
 * 5. Monthly Amount
 * 6. Annual Amount
 * 7. Created Date
 * 8. Actions (...)
 */

import * as React from "react"
import { useState, useMemo, useCallback } from "react"
import {
  FileText,
  Eye,
  Download,
  ExternalLink,
  Building2,
  Mail,
  Phone,
} from "lucide-react"
import { cn } from "../../lib/utils"
import { formatCurrency } from "../../lib/format"

// Types
import type {
  PartnerInvoice,
  PartnerInvoicesPageProps,
  PartnerInvoicesStats,
  PartnerInvoiceAction,
} from "./types"
import { STATUS_LABELS, STATUS_BADGE_VARIANTS } from "./types"

// Data
import {
  MOCK_PARTNER_INVOICES,
  MOCK_PARTNER_INVOICES_STATS,
  generatePartnerInvoicesStats,
} from "./data/mock-invoices"

// Constants
import { PARTNER_INVOICE_FILTER_GROUPS } from "./constants/filter.constants"

// UI Components
import { Badge } from "../ui/badge"
import { DataTable, type ColumnDef } from "../ui/DataTable"
import { SearchFilter } from "../shared/SearchFilter/SearchFilter"
import type { FilterState } from "../shared/SearchFilter/types"
import { PageActionPanel } from "../ui/PageActionPanel"
import { ActionTile } from "../ui/ActionTile"

// Dialogs
import { ViewInvoiceDialog } from "./ViewInvoiceDialog"

// Re-export for external consumers
export type { PartnerInvoice, PartnerInvoicesPageProps, PartnerInvoicesStats }
export { MOCK_PARTNER_INVOICES, MOCK_PARTNER_INVOICES_STATS }

// =============================================================================
// CONSTANTS
// =============================================================================

const EMPTY_FILTER_STATE: FilterState = {
  status: [],
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

// =============================================================================
// MAIN COMPONENT
// =============================================================================

/**
 * PartnerInvoicesPage - Full page layout for viewing invoices
 *
 * Features (per spec 06_invoices.md):
 * - Search by company name + primary contact name
 * - Status filter (multi-select)
 * - Data table with spec-compliant columns
 * - Actions: View, View PDF, Download PDF
 * - Pagination with 10/25/50 page sizes
 * - READ-ONLY (no edit/delete)
 */
export function PartnerInvoicesPage({
  invoices: initialInvoices = MOCK_PARTNER_INVOICES,
  stats: initialStats,
  onViewInvoice,
  onViewPDF,
  onDownloadPDF,
  loading = false,
  className,
}: PartnerInvoicesPageProps) {
  // Compute stats from invoices (or use provided stats)
  // Note: Stats are computed but KPI widgets not in MVP spec - kept for future use
  const _stats: PartnerInvoicesStats = useMemo(() => {
    return initialStats ?? generatePartnerInvoicesStats(initialInvoices)
  }, [initialStats, initialInvoices])

  // Filter state
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTER_STATE)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Selection state (for row checkboxes)
  const [selectedInvoices, setSelectedInvoices] = useState<Set<string>>(new Set())

  // Dialog states
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<PartnerInvoice | null>(null)

  // Filter invoices based on search and filters (per spec: search by company + contact)
  const filteredInvoices = useMemo(() => {
    return initialInvoices.filter((invoice) => {
      // Search filter - company name + contact person (per spec Section: Search)
      const matchesSearch =
        searchQuery === "" ||
        invoice.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.contactName.toLowerCase().includes(searchQuery.toLowerCase())

      // Status filter
      const matchesStatus =
        filters.status?.length === 0 || filters.status?.includes(invoice.status)

      return matchesSearch && matchesStatus
    })
  }, [initialInvoices, searchQuery, filters])

  // Paginated invoices
  const paginatedInvoices = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return filteredInvoices.slice(startIndex, startIndex + pageSize)
  }, [filteredInvoices, currentPage, pageSize])

  // Handle filter changes
  const handleFiltersChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters)
    setCurrentPage(1)
  }, [])

  // Handle search change
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }, [])

  // Handle view invoice
  const handleViewInvoiceClick = useCallback((invoice: PartnerInvoice) => {
    if (onViewInvoice) {
      onViewInvoice(invoice)
    } else {
      setSelectedInvoice(invoice)
      setViewDialogOpen(true)
    }
  }, [onViewInvoice])

  // Handle PDF actions
  const handleViewPDF = useCallback((invoice: PartnerInvoice) => {
    if (onViewPDF) {
      onViewPDF(invoice)
    } else if (invoice.pdfUrl) {
      window.open(invoice.pdfUrl, "_blank")
    }
  }, [onViewPDF])

  const handleDownloadPDF = useCallback((invoice: PartnerInvoice) => {
    if (onDownloadPDF) {
      onDownloadPDF(invoice)
    } else if (invoice.pdfUrl) {
      // Create a temporary link to trigger download
      const link = document.createElement("a")
      link.href = invoice.pdfUrl
      link.download = `${invoice.reference}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }, [onDownloadPDF])

  // Handle action click
  const handleActionClick = useCallback((invoice: PartnerInvoice, action: PartnerInvoiceAction) => {
    switch (action) {
      case "view":
        handleViewInvoiceClick(invoice)
        break
      case "view_pdf":
        handleViewPDF(invoice)
        break
      case "download_pdf":
        handleDownloadPDF(invoice)
        break
    }
  }, [handleViewInvoiceClick, handleViewPDF, handleDownloadPDF])

  // Row click handler
  const handleRowClick = useCallback((invoice: PartnerInvoice) => {
    handleViewInvoiceClick(invoice)
  }, [handleViewInvoiceClick])

  // Render action buttons (Salvador UX Rule: ≤3 actions = all visible, no menu)
  // Actions: View, View PDF, Download PDF = 3 total → all visible as ActionTiles
  const renderActionsButtons = useCallback((invoice: PartnerInvoice) => (
    <div className="flex items-center justify-end gap-1">
      <ActionTile
        variant="info"
        size="xs"
        aria-label="View Invoice"
        onClick={(e) => {
          e.stopPropagation()
          handleActionClick(invoice, "view")
        }}
        data-testid={`partner-invoice-action-view-${invoice.id}`}
      >
        <Eye className="h-4 w-4" />
      </ActionTile>
      {invoice.pdfUrl && (
        <>
          <ActionTile
            variant="neutral"
            size="xs"
            aria-label="View as PDF"
            onClick={(e) => {
              e.stopPropagation()
              handleActionClick(invoice, "view_pdf")
            }}
            data-testid={`partner-invoice-action-view-pdf-${invoice.id}`}
          >
            <ExternalLink className="h-4 w-4" />
          </ActionTile>
          <ActionTile
            variant="neutral"
            size="xs"
            aria-label="Download PDF"
            onClick={(e) => {
              e.stopPropagation()
              handleActionClick(invoice, "download_pdf")
            }}
            data-testid={`partner-invoice-action-download-${invoice.id}`}
          >
            <Download className="h-4 w-4" />
          </ActionTile>
        </>
      )}
    </div>
  ), [handleActionClick])

  // Column definitions (per spec Section 8.1: Invoices Table > Columns)
  // Column widths (using string values for DataTable compatibility)
  const COLUMN_WIDTHS = { actions: "130px" } as const

  const columns: ColumnDef<PartnerInvoice>[] = useMemo(() => [
    // 1. Reference
    {
      id: "reference",
      header: "Reference",
      sortable: true,
      sortValue: (row) => row.reference,
      accessor: (row) => (
        <span className="font-medium text-primary">{row.reference}</span>
      ),
    },
    // 2. Company / Tenant
    {
      id: "company",
      header: "Company / Tenant",
      sortable: true,
      sortValue: (row) => row.companyName,
      accessor: (row) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted-bg shrink-0">
            <Building2 className="h-4 w-4 text-muted" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-medium text-primary truncate">{row.companyName}</span>
            <span className="text-xs text-muted truncate">{row.contactName}</span>
          </div>
        </div>
      ),
    },
    // 3. Contact
    {
      id: "contact",
      header: "Contact",
      accessor: (row) => (
        <div className="flex flex-col gap-0.5 text-sm">
          <div className="flex items-center gap-1.5 text-primary">
            <Mail className="h-3.5 w-3.5 text-muted shrink-0" />
            <span className="truncate">{row.contactEmail}</span>
          </div>
          {row.contactPhone && (
            <div className="flex items-center gap-1.5 text-muted">
              <Phone className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{row.contactPhone}</span>
            </div>
          )}
        </div>
      ),
    },
    // 4. Status
    {
      id: "status",
      header: "Status",
      sortable: true,
      sortValue: (row) => row.status,
      accessor: (row) => (
        <Badge variant={STATUS_BADGE_VARIANTS[row.status]}>
          {STATUS_LABELS[row.status]}
        </Badge>
      ),
    },
    // 5. Monthly Amount
    {
      id: "monthlyAmount",
      header: "Monthly Amount",
      sortable: true,
      sortValue: (row) => row.monthlyAmount,
      align: "right",
      accessor: (row) => (
        <span className="text-sm font-medium text-primary">
          {formatCurrency(row.monthlyAmount)}
        </span>
      ),
    },
    // 6. Annual Amount
    {
      id: "annualAmount",
      header: "Annual Amount",
      sortable: true,
      sortValue: (row) => row.annualAmount,
      align: "right",
      accessor: (row) => (
        <span className="text-sm font-medium text-primary">
          {formatCurrency(row.annualAmount)}
        </span>
      ),
    },
    // 7. Created Date
    {
      id: "createdDate",
      header: "Created Date",
      sortable: true,
      sortValue: (row) => row.createdDate.getTime(),
      accessor: (row) => (
        <span className="text-sm text-primary">{formatDate(row.createdDate)}</span>
      ),
    },
    // 8. Actions (Salvador rule: ≤3 = all visible buttons)
    {
      id: "actions",
      header: "Actions",
      align: "right",
      sticky: "right",
      width: COLUMN_WIDTHS.actions,
      accessor: (row) => renderActionsButtons(row),
    },
  ], [renderActionsButtons])

  return (
    <main
      data-slot="partner-invoices-page"
      data-testid="partner-invoices-page"
      className={cn("min-h-screen", className)}
    >
      <div className="flex flex-col gap-6 p-4 md:p-6">
        {/* Page Header (per spec Section: Page Header) */}
        <PageActionPanel
          icon={<FileText className="w-6 h-6 md:w-8 md:h-8" />}
          iconClassName="text-accent"
          title="Invoices"
          subtitle="View and track all generated invoices across tenant requests and active tenants."
        />

        {/* Glass container for main content */}
        <section className="rounded-xl border-2 border-accent bg-white/40 dark:bg-black/40 backdrop-blur-[4px] shadow-md">
          <div className="flex flex-col gap-4 p-4 md:p-6">
            {/* Search and Filter Bar (per spec Section: Search + Filters) */}
            <SearchFilter
              placeholder="Search by company or contact"
              value={searchQuery}
              onChange={handleSearchChange}
              filterGroups={PARTNER_INVOICE_FILTER_GROUPS}
              filters={filters}
              onFiltersChange={handleFiltersChange}
              className="bg-surface border border-default rounded-lg"
              data-testid="partner-invoices-search-filter"
            />

            {/* Data Table (per spec Section: Invoices Table) */}
            <DataTable
              data={paginatedInvoices}
              columns={columns}
              getRowId={(row) => row.id}
              selectable
              selectedRows={selectedInvoices}
              onSelectionChange={setSelectedInvoices}
              loading={loading}
              hoverable
              bordered
              onRowClick={handleRowClick}
              pagination
              currentPage={currentPage}
              totalItems={filteredInvoices.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={(size) => {
                setPageSize(size)
                setCurrentPage(1)
              }}
              pageSizeOptions={[10, 25, 50]}
              data-testid="partner-invoices-table"
              emptyState={
                <div className="flex flex-col items-center py-8">
                  <div className="w-16 h-16 mb-4 rounded-full bg-muted-bg flex items-center justify-center">
                    <FileText className="h-8 w-8 text-muted" />
                  </div>
                  <h3 className="text-lg font-semibold text-primary mb-2">
                    {searchQuery || (filters.status?.length ?? 0) > 0
                      ? "No invoices found"
                      : "No invoices yet"}
                  </h3>
                  <p className="text-muted text-sm max-w-sm text-center">
                    {searchQuery || (filters.status?.length ?? 0) > 0
                      ? "No invoices match your search criteria. Try adjusting your filters."
                      : "Invoices will appear here once tenant requests are submitted."}
                  </p>
                </div>
              }
            />
          </div>
        </section>
      </div>

      {/* View Invoice Dialog */}
      <ViewInvoiceDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        invoice={selectedInvoice}
        onViewPDF={handleViewPDF}
        onDownloadPDF={handleDownloadPDF}
      />
    </main>
  )
}

export default PartnerInvoicesPage
