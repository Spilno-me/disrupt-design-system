import * as React from 'react'
import { useState, useCallback } from 'react'
import { cn } from '../../../lib/utils'
import { InvoicesDataTable } from './InvoicesDataTable'
import { SearchFilter } from '../../shared/SearchFilter/SearchFilter'
import type { FilterGroup } from '../../shared/SearchFilter/types'
import { Pagination } from '../../ui/Pagination'
import type { Invoice, InvoiceAction } from './types'
import type { EditInvoiceFormData } from './EditInvoiceDialog'
import { useInvoicesState } from './useInvoicesState'
import {
  StatsCards,
  MobileInvoiceList,
  PageHeader,
  InvoiceDialogs,
  type InvoicesStats,
} from './InvoicesPageComponents'
import { InvoiceDetailPage, type InvoiceFormData, type InvoicePageMode } from './pages'

// =============================================================================
// CONSTANTS
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

const PAGE_SIZE_OPTIONS = [10, 25, 50]

// =============================================================================
// TYPES
// =============================================================================

export type InvoicesPageMode = 'list' | 'detail'

export interface InvoicesPageProps {
  /** Array of invoices to display */
  invoices: Invoice[]
  /** Stats to display at top */
  stats?: InvoicesStats
  /** Callback when an invoice is clicked */
  onInvoiceClick?: (invoice: Invoice) => void
  /** Callback when invoice action is clicked */
  onInvoiceAction?: (invoice: Invoice, action: InvoiceAction) => void
  /** Callback when an invoice is updated (from detail page) */
  onUpdateInvoice?: (invoice: Invoice, data: EditInvoiceFormData | InvoiceFormData) => void | Promise<void>
  /** Callback when PDF download is requested */
  onDownloadPDF?: (invoice: Invoice) => void
  /** Page title */
  title?: string
  /** Default page size */
  defaultPageSize?: number
  /** Loading state */
  loading?: boolean
  /** Additional className */
  className?: string
  /** Use page-based detail view (new) instead of sheet/dialog (deprecated) */
  useDetailPage?: boolean
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

/**
 * InvoicesPage - Full page layout for managing invoices
 *
 * Features:
 * - Stats cards row showing KPIs
 * - Search and filter bar
 * - Data table for desktop (md+)
 * - Card grid for mobile (< md)
 * - Pagination
 * - Quick preview sheet
 * - PDF preview dialog
 * - Edit invoice dialog
 *
 * @component PAGE
 */
export function InvoicesPage({
  invoices,
  stats,
  onInvoiceClick,
  onInvoiceAction,
  onUpdateInvoice,
  onDownloadPDF,
  title = 'Invoices',
  defaultPageSize = 10,
  loading = false,
  className,
  useDetailPage = true, // Default to new page-based view
}: InvoicesPageProps) {
  // Page-level navigation state
  const [pageMode, setPageMode] = useState<InvoicesPageMode>('list')
  const [detailInvoice, setDetailInvoice] = useState<Invoice | null>(null)
  const [detailMode, setDetailMode] = useState<InvoicePageMode>('view')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    dialogState,
    filterState,
    selectionState,
    sortState,
    paginationState,
    data,
    handlers,
  } = useInvoicesState({
    invoices,
    defaultPageSize,
    onInvoiceClick,
    onInvoiceAction,
    onUpdateInvoice,
  })

  // Navigate to detail page (new pattern)
  const handleNavigateToDetail = useCallback((invoice: Invoice, mode: InvoicePageMode = 'view') => {
    if (useDetailPage) {
      setDetailInvoice(invoice)
      setDetailMode(mode)
      setPageMode('detail')
      onInvoiceClick?.(invoice)
    } else {
      // Fallback to legacy sheet/dialog
      handlers.handleCardClick(invoice)
    }
  }, [useDetailPage, handlers, onInvoiceClick])

  // Handle invoice action with page navigation
  const handleInvoiceActionWithPage = useCallback((invoice: Invoice, action: InvoiceAction) => {
    if (useDetailPage) {
      switch (action) {
        case 'preview':
          handleNavigateToDetail(invoice, 'view')
          return
        case 'edit':
          if (invoice.status === 'draft') {
            handleNavigateToDetail(invoice, 'edit')
          }
          return
        case 'download':
          onDownloadPDF?.(invoice)
          return
        default:
          // Other actions (copy, mark_sent, delete) pass through
          handlers.handleInvoiceAction(invoice, action)
      }
    } else {
      handlers.handleInvoiceAction(invoice, action)
    }
    onInvoiceAction?.(invoice, action)
  }, [useDetailPage, handleNavigateToDetail, handlers, onInvoiceAction, onDownloadPDF])

  // Handle submit from detail page
  const handleDetailPageSubmit = useCallback(async (formData: InvoiceFormData) => {
    if (!detailInvoice || !onUpdateInvoice) return
    setIsSubmitting(true)
    try {
      await onUpdateInvoice(detailInvoice, formData)
      setDetailMode('view')
    } finally {
      setIsSubmitting(false)
    }
  }, [detailInvoice, onUpdateInvoice])

  // Handle back from detail page
  const handleBackToList = useCallback(() => {
    setPageMode('list')
    setDetailInvoice(null)
  }, [])

  // Render detail page if in detail mode
  if (pageMode === 'detail' && detailInvoice) {
    return (
      <InvoiceDetailPage
        invoice={detailInvoice}
        mode={detailMode}
        onSubmit={handleDetailPageSubmit}
        onBack={handleBackToList}
        onModeChange={setDetailMode}
        onDownloadPDF={onDownloadPDF}
        isSubmitting={isSubmitting}
      />
    )
  }

  // Render list view
  return (
    <div className={cn('min-h-full', className)}>
      <div className="flex flex-col gap-6 p-6">
        {/* Page Header */}
        <PageHeader
          title={title}
          totalCount={data.sortedInvoices.length}
          selectedCount={selectionState.selectedInvoices.size}
        />

        {/* Stats Cards Row */}
        {stats && <StatsCards stats={stats} />}

        {/* Search and Filter Bar */}
        <SearchFilter
          placeholder="Search invoices..."
          value={filterState.searchValue}
          onChange={filterState.handleSearchChange}
          filterGroups={INVOICES_FILTER_GROUPS}
          filters={filterState.filters}
          onFiltersChange={filterState.handleFiltersChange}
        />

        {/* Desktop: Data Table */}
        <div className="hidden md:block">
          <InvoicesDataTable
            invoices={data.paginatedInvoices}
            selectedInvoices={selectionState.selectedInvoices}
            onSelectionChange={selectionState.setSelectedInvoices}
            onInvoiceClick={(invoice) => handleNavigateToDetail(invoice, 'view')}
            onActionClick={handleInvoiceActionWithPage}
            sortColumn={sortState.sortColumn}
            sortDirection={sortState.sortDirection}
            onSortChange={sortState.handleSortChange}
            loading={loading}
            pagination
            currentPage={paginationState.currentPage}
            totalItems={data.sortedInvoices.length}
            pageSize={paginationState.pageSize}
            onPageChange={paginationState.setCurrentPage}
            onPageSizeChange={paginationState.handlePageSizeChange}
            pageSizeOptions={PAGE_SIZE_OPTIONS}
          />
        </div>

        {/* Mobile: Card Grid */}
        <div className="md:hidden">
          <MobileInvoiceList
            invoices={data.paginatedInvoices}
            loading={loading}
            searchValue={filterState.searchValue}
            onCardClick={(invoice) => handleNavigateToDetail(invoice, 'view')}
            onActionClick={handleInvoiceActionWithPage}
          />
        </div>

        {/* Mobile Pagination */}
        {data.sortedInvoices.length > 0 && (
          <div className="md:hidden">
            <Pagination
              currentPage={paginationState.currentPage}
              totalItems={data.sortedInvoices.length}
              pageSize={paginationState.pageSize}
              onPageChange={paginationState.setCurrentPage}
              onPageSizeChange={paginationState.handlePageSizeChange}
              showPageSizeSelector
              showResultsText
              showFirstLastButtons
            />
          </div>
        )}
      </div>

      {/* Legacy Dialogs (only shown when useDetailPage=false) */}
      {!useDetailPage && (
        <InvoiceDialogs
          dialogState={dialogState}
          onUpdateInvoice={handlers.handleUpdateInvoice}
        />
      )}
    </div>
  )
}

export default InvoicesPage
