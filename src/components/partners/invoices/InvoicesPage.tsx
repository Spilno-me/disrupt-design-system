import * as React from 'react'
import { useState, useMemo, useCallback } from 'react'
import { cn } from '../../../lib/utils'
import { StatsCard } from '../../leads/StatsCard'
import { InvoiceCard } from './InvoiceCard'
import { InvoicesDataTable } from './InvoicesDataTable'
import { InvoicePreviewSheet } from './InvoicePreviewSheet'
import { InvoicePDFDialog } from './InvoicePDFDialog'
import { EditInvoiceDialog, EditInvoiceFormData } from './EditInvoiceDialog'
import { SearchFilter } from '../../shared/SearchFilter/SearchFilter'
import type { FilterGroup, FilterState } from '../../shared/SearchFilter/types'
import { Pagination } from '../../ui/Pagination'
import { SortDirection } from '../../ui/DataTable'
import type { Invoice, InvoiceAction } from './types'

// =============================================================================
// INVOICES FILTER CONFIGURATION
// =============================================================================

const INVOICES_FILTER_GROUPS: FilterGroup[] = [
  {
    key: 'status',
    label: 'Status',
    options: [
      { id: 'draft', label: 'Draft' },
      { id: 'sent', label: 'Sent' },
      { id: 'paid', label: 'Paid' },
      { id: 'overdue', label: 'Overdue' },
      { id: 'partially_paid', label: 'Partially Paid' },
    ],
  },
  {
    key: 'terms',
    label: 'Payment Terms',
    options: [
      { id: 'net_15', label: 'Net 15' },
      { id: 'net_30', label: 'Net 30' },
      { id: 'net_60', label: 'Net 60' },
      { id: 'due_on_receipt', label: 'Due on Receipt' },
    ],
  },
]

// =============================================================================
// TYPES
// =============================================================================

export interface InvoicesPageProps {
  /** Array of invoices to display */
  invoices: Invoice[]
  /** Stats to display at top */
  stats?: {
    totalInvoices?: { value: number; trend?: string; trendDirection?: 'up' | 'down' | 'neutral' }
    draft?: { value: number; trend?: string; trendDirection?: 'up' | 'down' | 'neutral' }
    unpaid?: { value: number; trend?: string; trendDirection?: 'up' | 'down' | 'neutral' }
    overdue?: { value: number; trend?: string; trendDirection?: 'up' | 'down' | 'neutral' }
    totalRevenue?: { value: string; trend?: string; trendDirection?: 'up' | 'down' | 'neutral' }
  }
  /** Callback when an invoice is clicked */
  onInvoiceClick?: (invoice: Invoice) => void
  /** Callback when invoice action is clicked */
  onInvoiceAction?: (invoice: Invoice, action: InvoiceAction) => void
  /** Callback when an invoice is updated */
  onUpdateInvoice?: (invoice: Invoice, data: EditInvoiceFormData) => void | Promise<void>
  /** Page title */
  title?: string
  /** Default page size */
  defaultPageSize?: number
  /** Loading state */
  loading?: boolean
  /** Additional className */
  className?: string
}

// =============================================================================
// INVOICES PAGE COMPONENT
// =============================================================================

/**
 * InvoicesPage - Full page layout for managing invoices
 *
 * Includes:
 * - Stats cards row showing KPIs
 * - Search and filter bar
 * - Data table for desktop (md+)
 * - Card grid for mobile (< md)
 * - Pagination
 * - Quick preview sheet
 * - PDF preview dialog
 * - Edit invoice dialog
 */
export function InvoicesPage({
  invoices,
  stats,
  onInvoiceClick,
  onInvoiceAction,
  onUpdateInvoice,
  title = 'Invoices',
  defaultPageSize = 10,
  loading = false,
  className,
}: InvoicesPageProps) {
  // Dialog/sheet states
  const [previewSheetOpen, setPreviewSheetOpen] = useState(false)
  const [pdfDialogOpen, setPdfDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  // Filter state
  const [searchValue, setSearchValue] = useState('')
  const [filters, setFilters] = useState<FilterState>({
    status: [],
    terms: [],
  })

  // Selection state
  const [selectedInvoices, setSelectedInvoices] = useState<Set<string>>(new Set())

  // Sort state
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(defaultPageSize)

  // Filter invoices based on current filters
  const filteredInvoices = useMemo(() => {
    return invoices.filter((invoice) => {
      // Search filter
      if (searchValue) {
        const searchLower = searchValue.toLowerCase()
        const matchesSearch =
          invoice.invoiceNumber.toLowerCase().includes(searchLower) ||
          invoice.company.name.toLowerCase().includes(searchLower) ||
          (invoice.description?.toLowerCase().includes(searchLower) ?? false)
        if (!matchesSearch) return false
      }

      // Status filter
      if (filters.status.length > 0 && !filters.status.includes(invoice.status)) {
        return false
      }

      // Terms filter
      if (filters.terms.length > 0 && !filters.terms.includes(invoice.paymentTerms)) {
        return false
      }

      return true
    })
  }, [invoices, searchValue, filters])

  // Sort filtered invoices
  const sortedInvoices = useMemo(() => {
    if (!sortColumn || !sortDirection) return filteredInvoices

    return [...filteredInvoices].sort((a, b) => {
      let valueA: string | number | null = null
      let valueB: string | number | null = null

      switch (sortColumn) {
        case 'invoiceNumber':
          valueA = a.invoiceNumber
          valueB = b.invoiceNumber
          break
        case 'company':
          valueA = a.company.name.toLowerCase()
          valueB = b.company.name.toLowerCase()
          break
        case 'total':
          valueA = a.total
          valueB = b.total
          break
        case 'status':
          valueA = a.status
          valueB = b.status
          break
        case 'dates':
          valueA = new Date(a.dueDate).getTime()
          valueB = new Date(b.dueDate).getTime()
          break
        default:
          return 0
      }

      if (valueA == null && valueB == null) return 0
      if (valueA == null) return 1
      if (valueB == null) return -1

      let comparison = 0
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        comparison = valueA.localeCompare(valueB)
      } else {
        comparison = valueA < valueB ? -1 : valueA > valueB ? 1 : 0
      }

      return sortDirection === 'desc' ? -comparison : comparison
    })
  }, [filteredInvoices, sortColumn, sortDirection])

  // Paginate sorted invoices
  const paginatedInvoices = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return sortedInvoices.slice(startIndex, startIndex + pageSize)
  }, [sortedInvoices, currentPage, pageSize])

  // Handle filter changes
  const handleFiltersChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters)
    setCurrentPage(1)
  }, [])

  // Handle sort change
  const handleSortChange = useCallback((column: string, direction: SortDirection) => {
    setSortColumn(direction ? column : null)
    setSortDirection(direction)
  }, [])

  // Handle page size change
  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPageSize(newPageSize)
    setCurrentPage(1)
  }, [])

  // Handle invoice actions
  const handleInvoiceAction = useCallback(
    (invoice: Invoice, action: InvoiceAction) => {
      setSelectedInvoice(invoice)

      switch (action) {
        case 'copy':
          // Copy to clipboard
          navigator.clipboard.writeText(invoice.invoiceNumber)
          break
        case 'preview':
          setPreviewSheetOpen(true)
          break
        case 'download':
          // Download PDF
          if (invoice.pdfUrl) {
            window.open(invoice.pdfUrl, '_blank')
          }
          break
        case 'edit':
          if (invoice.status === 'draft') {
            setEditDialogOpen(true)
          }
          break
        case 'mark_sent':
          // Mark as sent
          onInvoiceAction?.(invoice, action)
          break
        case 'delete':
          // Delete invoice
          onInvoiceAction?.(invoice, action)
          break
      }

      // Also call the parent callback
      onInvoiceAction?.(invoice, action)
    },
    [onInvoiceAction]
  )

  // Handle card click (opens preview)
  const handleCardClick = useCallback((invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setPreviewSheetOpen(true)
    onInvoiceClick?.(invoice)
  }, [onInvoiceClick])

  // Handle update invoice
  const handleUpdateInvoice = useCallback(async (data: EditInvoiceFormData) => {
    if (!selectedInvoice || !onUpdateInvoice) return
    setIsUpdating(true)
    try {
      await onUpdateInvoice(selectedInvoice, data)
      setEditDialogOpen(false)
    } finally {
      setIsUpdating(false)
    }
  }, [selectedInvoice, onUpdateInvoice])

  return (
    <div className={cn('min-h-full', className)}>
      {/* Content - no extra background, page background comes from shell */}
      <div className="flex flex-col gap-6 p-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-primary">
            {title} ({sortedInvoices.length})
          </h1>
          {selectedInvoices.size > 0 && (
            <span className="text-sm text-muted">
              {selectedInvoices.size} invoice{selectedInvoices.size > 1 ? 's' : ''} selected
            </span>
          )}
        </div>

        {/* Stats Cards Row */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {stats.totalInvoices && (
              <StatsCard
                title="Total Invoices"
                value={stats.totalInvoices.value}
                trend={stats.totalInvoices.trend}
                trendDirection={stats.totalInvoices.trendDirection}
              />
            )}
            {stats.draft && (
              <StatsCard
                title="Draft"
                value={stats.draft.value}
                trend={stats.draft.trend}
                trendDirection={stats.draft.trendDirection}
              />
            )}
            {stats.unpaid && (
              <StatsCard
                title="Unpaid"
                value={stats.unpaid.value}
                trend={stats.unpaid.trend}
                trendDirection={stats.unpaid.trendDirection}
              />
            )}
            {stats.overdue && (
              <StatsCard
                title="Overdue"
                value={stats.overdue.value}
                trend={stats.overdue.trend}
                trendDirection={stats.overdue.trendDirection}
              />
            )}
            {stats.totalRevenue && (
              <StatsCard
                title="Total Revenue"
                value={stats.totalRevenue.value}
                trend={stats.totalRevenue.trend}
                trendDirection={stats.totalRevenue.trendDirection}
              />
            )}
          </div>
        )}

        {/* Search and Filter Bar */}
        <SearchFilter
          placeholder="Search invoices..."
          value={searchValue}
          onChange={(value) => {
            setSearchValue(value)
            setCurrentPage(1)
          }}
          filterGroups={INVOICES_FILTER_GROUPS}
          filters={filters}
          onFiltersChange={handleFiltersChange}
        />

        {/* Desktop: Data Table (hidden on mobile) */}
        <div className="hidden md:block">
          <InvoicesDataTable
            invoices={paginatedInvoices}
            selectedInvoices={selectedInvoices}
            onSelectionChange={setSelectedInvoices}
            onInvoiceClick={handleCardClick}
            onActionClick={handleInvoiceAction}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            onSortChange={handleSortChange}
            loading={loading}
          />
        </div>

        {/* Mobile: Card Grid (hidden on desktop) */}
        <div className="md:hidden">
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-48 bg-muted-bg rounded-lg animate-pulse" />
              ))}
            </div>
          ) : paginatedInvoices.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {paginatedInvoices.map((invoice) => (
                <InvoiceCard
                  key={invoice.id}
                  invoice={invoice}
                  onClick={handleCardClick}
                  onActionClick={handleInvoiceAction}
                />
              ))}
            </div>
          ) : (
            <EmptyState searchValue={searchValue} />
          )}
        </div>

        {/* Pagination */}
        {sortedInvoices.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalItems={sortedInvoices.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={handlePageSizeChange}
            showPageSizeSelector
            showResultsText
            showFirstLastButtons
          />
        )}
      </div>

      {/* Invoice Preview Sheet */}
      <InvoicePreviewSheet
        open={previewSheetOpen}
        onOpenChange={setPreviewSheetOpen}
        invoice={selectedInvoice}
      />

      {/* PDF Preview Dialog */}
      <InvoicePDFDialog
        open={pdfDialogOpen}
        onOpenChange={setPdfDialogOpen}
        invoice={selectedInvoice}
      />

      {/* Edit Invoice Dialog */}
      {selectedInvoice?.status === 'draft' && (
        <EditInvoiceDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          invoice={selectedInvoice}
          onSubmit={handleUpdateInvoice}
          isSubmitting={isUpdating}
        />
      )}
    </div>
  )
}

// =============================================================================
// EMPTY STATE
// =============================================================================

function EmptyState({ searchValue }: { searchValue: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 mb-4 rounded-full bg-muted-bg flex items-center justify-center">
        <svg
          className="w-8 h-8 text-secondary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-primary mb-2">
        {searchValue ? 'No invoices found' : 'No invoices yet'}
      </h3>
      <p className="text-sm text-secondary max-w-sm">
        {searchValue
          ? `No invoices match your search "${searchValue}". Try adjusting your filters.`
          : 'Get started by creating your first invoice.'}
      </p>
    </div>
  )
}

export default InvoicesPage
