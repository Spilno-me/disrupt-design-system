import * as React from 'react'
import { StatsCard } from '../../shared/StatsCard'
import { InvoiceCard } from './InvoiceCard'
import { InvoicePreviewSheet } from './InvoicePreviewSheet'
import { InvoicePDFDialog } from './InvoicePDFDialog'
import { EditInvoiceDialog, EditInvoiceFormData } from './EditInvoiceDialog'
import type { Invoice, InvoiceAction } from './types'

// =============================================================================
// TYPES
// =============================================================================

interface StatValue {
  value: number | string
  trend?: string
  trendDirection?: 'up' | 'down' | 'neutral'
}

export interface InvoicesStats {
  totalInvoices?: StatValue
  draft?: StatValue
  unpaid?: StatValue
  overdue?: StatValue
  totalRevenue?: StatValue
}

// =============================================================================
// STATS CARDS
// =============================================================================

interface StatsCardsProps {
  stats: InvoicesStats
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
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
  )
}

// =============================================================================
// MOBILE INVOICE LIST
// =============================================================================

interface MobileInvoiceListProps {
  invoices: Invoice[]
  loading: boolean
  searchValue: string
  onCardClick: (invoice: Invoice) => void
  onActionClick: (invoice: Invoice, action: InvoiceAction) => void
}

export function MobileInvoiceList({
  invoices,
  loading,
  searchValue,
  onCardClick,
  onActionClick,
}: MobileInvoiceListProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-48 bg-muted-bg rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  if (invoices.length === 0) {
    return <EmptyState searchValue={searchValue} />
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {invoices.map((invoice) => (
        <InvoiceCard
          key={invoice.id}
          invoice={invoice}
          onClick={onCardClick}
          onActionClick={onActionClick}
        />
      ))}
    </div>
  )
}

// =============================================================================
// EMPTY STATE
// =============================================================================

interface EmptyStateProps {
  searchValue: string
}

export function EmptyState({ searchValue }: EmptyStateProps) {
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

// =============================================================================
// PAGE HEADER
// =============================================================================

interface PageHeaderProps {
  title: string
  totalCount: number
  selectedCount: number
}

export function PageHeader({ title, totalCount, selectedCount }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-semibold text-primary">
        {title} ({totalCount})
      </h1>
      {selectedCount > 0 && (
        <span className="text-sm text-muted">
          {selectedCount} invoice{selectedCount > 1 ? 's' : ''} selected
        </span>
      )}
    </div>
  )
}

// =============================================================================
// INVOICE DIALOGS
// =============================================================================

interface InvoiceDialogsProps {
  dialogState: {
    previewSheetOpen: boolean
    pdfDialogOpen: boolean
    editDialogOpen: boolean
    selectedInvoice: Invoice | null
    isUpdating: boolean
    setPreviewSheetOpen: (open: boolean) => void
    setPdfDialogOpen: (open: boolean) => void
    setEditDialogOpen: (open: boolean) => void
  }
  onUpdateInvoice: (data: EditInvoiceFormData) => Promise<void>
}

export function InvoiceDialogs({ dialogState, onUpdateInvoice }: InvoiceDialogsProps) {
  const {
    previewSheetOpen,
    pdfDialogOpen,
    editDialogOpen,
    selectedInvoice,
    isUpdating,
    setPreviewSheetOpen,
    setPdfDialogOpen,
    setEditDialogOpen,
  } = dialogState

  return (
    <>
      <InvoicePreviewSheet
        open={previewSheetOpen}
        onOpenChange={setPreviewSheetOpen}
        invoice={selectedInvoice}
      />

      <InvoicePDFDialog
        open={pdfDialogOpen}
        onOpenChange={setPdfDialogOpen}
        invoice={selectedInvoice}
      />

      {selectedInvoice?.status === 'draft' && (
        <EditInvoiceDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          invoice={selectedInvoice}
          onSubmit={onUpdateInvoice}
          isSubmitting={isUpdating}
        />
      )}
    </>
  )
}
