import * as React from 'react'
import { Copy, Eye, Download, Pencil, Send } from 'lucide-react'
import { DataTable, ColumnDef, SortDirection, RowPriority } from '../../ui/DataTable'
import { Button } from '../../ui/button'
import { cn } from '../../../lib/utils'
import type { Invoice, InvoiceAction } from './types'
import { formatCurrency, formatDate, getPaymentTermsLabel } from './types'

// =============================================================================
// TYPES
// =============================================================================

export interface InvoicesDataTableProps {
  /** Array of invoices to display */
  invoices: Invoice[]
  /** Selected invoice IDs */
  selectedInvoices?: Set<string>
  /** Callback when selection changes */
  onSelectionChange?: (selectedIds: Set<string>) => void
  /** Callback when an invoice row is clicked */
  onInvoiceClick?: (invoice: Invoice) => void
  /** Callback when an action button is clicked */
  onActionClick?: (invoice: Invoice, action: InvoiceAction) => void
  /** Current sort column */
  sortColumn?: string | null
  /** Current sort direction */
  sortDirection?: SortDirection
  /** Callback when sort changes */
  onSortChange?: (column: string, direction: SortDirection) => void
  /** Loading state */
  loading?: boolean
  /** Additional className */
  className?: string
}

// =============================================================================
// INVOICES DATA TABLE COMPONENT
// =============================================================================

/**
 * InvoicesDataTable - Desktop table view for invoices
 *
 * Displays invoices in a sortable, selectable table with action buttons.
 * Uses the generic DataTable component with invoice-specific columns.
 */
export function InvoicesDataTable({
  invoices,
  selectedInvoices,
  onSelectionChange,
  onInvoiceClick,
  onActionClick,
  sortColumn,
  sortDirection,
  onSortChange,
  loading = false,
  className,
}: InvoicesDataTableProps) {
  // Define columns - using CSS property values for DataTable API (not hardcoded styling)
  /* eslint-disable no-restricted-syntax */
  const columns: ColumnDef<Invoice>[] = [
    {
      id: "invoiceNumber",
      header: "Invoice",
      accessor: (invoice) => (
        <div className="flex items-center gap-2">
          <span className="font-medium text-primary">{invoice.invoiceNumber}</span>
        </div>
      ),
      sortable: true,
      sortValue: (invoice) => invoice.invoiceNumber,
      minWidth: "180px",
    },
    {
      id: "status",
      header: "Status",
      accessor: (invoice) => <StatusCell status={invoice.status} />,
      sortable: true,
      sortValue: (invoice) => invoice.status,
      minWidth: "140px",
    },
    {
      id: "company",
      header: "Company",
      accessor: (invoice) => (
        <div className="flex flex-col">
          <span className="font-medium text-primary">{invoice.company.name}</span>
          {invoice.description && (
            <span className="text-xs text-muted truncate max-w-[200px]">{invoice.description}</span>
          )}
        </div>
      ),
      sortable: true,
      sortValue: (invoice) => invoice.company.name,
      minWidth: "200px",
    },
    {
      id: "total",
      header: "Amount",
      accessor: (invoice) => (
        <div className="flex flex-col">
          <span className="font-semibold text-primary">{formatCurrency(invoice.total)}</span>
          <span className="text-xs text-muted">
            {invoice.lineItems.length} item{invoice.lineItems.length !== 1 ? "s" : ""}
          </span>
        </div>
      ),
      sortable: true,
      sortValue: (invoice) => invoice.total,
      minWidth: "140px",
      align: "right",
    },
    {
      id: "dates",
      header: "Dates",
      accessor: (invoice) => (
        <div className="flex flex-col gap-1 text-xs">
          <div className="flex items-center gap-1">
            <span className="text-muted">Invoice:</span>
            <span className="text-primary">{formatDate(invoice.invoiceDate)}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-muted">Due:</span>
            <span className="text-primary">{formatDate(invoice.dueDate)}</span>
          </div>
        </div>
      ),
      sortable: true,
      sortValue: (invoice) => invoice.dueDate,
      minWidth: "180px",
    },
    {
      id: "terms",
      header: "Terms",
      accessor: (invoice) => (
        <span className="inline-flex px-2 py-1 text-xs font-medium rounded bg-mutedBg text-primary">
          {getPaymentTermsLabel(invoice.paymentTerms)}
        </span>
      ),
      minWidth: "100px",
      align: "center",
    },
    {
      id: "actions",
      header: "Actions",
      accessor: (invoice) => (
        <ActionsCell
          invoice={invoice}
          onAction={onActionClick}
        />
      ),
      minWidth: "240px",
      align: "right",
    },
  ]
  /* eslint-enable no-restricted-syntax */

  // Map invoice status to row priority for colored borders
  const getRowPriority = (invoice: Invoice): RowPriority => {
    switch (invoice.status) {
      case 'draft':
        return 'draft'
      case 'overdue':
        return 'critical'
      case 'partially_paid':
        return 'medium'
      case 'sent':
        return 'low'
      case 'paid':
        return 'none'
      default:
        return null
    }
  }

  return (
    <DataTable
      data={invoices}
      columns={columns}
      getRowId={(invoice) => invoice.id}
      selectable
      selectedRows={selectedInvoices}
      onSelectionChange={onSelectionChange}
      onRowClick={onInvoiceClick}
      sortColumn={sortColumn}
      sortDirection={sortDirection}
      onSortChange={onSortChange}
      loading={loading}
      hoverable
      bordered
      getRowPriority={getRowPriority}
      className={className}
      emptyState={
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 mb-4 rounded-full bg-mutedBg flex items-center justify-center">
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
          <h3 className="text-lg font-semibold text-primary mb-2">No invoices found</h3>
          <p className="text-sm text-secondary">Create your first invoice to get started</p>
        </div>
      }
    />
  )
}

// =============================================================================
// CELL COMPONENTS
// =============================================================================

/** Status badge cell */
function StatusCell({ status }: { status: Invoice['status'] }) {
  const statusConfig = {
    draft: {
      label: 'Draft',
      className: 'bg-mutedBg text-primary border border-default',
      showDot: true,
    },
    sent: {
      label: 'Sent',
      className: 'bg-infoLight text-info',
      showDot: false,
    },
    paid: {
      label: 'Paid',
      className: 'bg-successLight text-success',
      showDot: false,
    },
    overdue: {
      label: 'Overdue',
      className: 'bg-errorLight text-error',
      showDot: false,
    },
    partially_paid: {
      label: 'Partially Paid',
      className: 'bg-warningLight text-warning',
      showDot: false,
    },
  }

  const config = statusConfig[status]

  return (
    <span className={cn('inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded', config.className)}>
      {config.showDot && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
      {config.label}
    </span>
  )
}

/** Actions cell with icon buttons */
function ActionsCell({
  invoice,
  onAction,
}: {
  invoice: Invoice
  onAction?: (invoice: Invoice, action: InvoiceAction) => void
}) {
  const isDraft = invoice.status === 'draft'

  return (
    <div className="flex items-center gap-1 justify-end" onClick={(e) => e.stopPropagation()}>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={(e) => {
          e.stopPropagation()
          onAction?.(invoice, 'copy')
        }}
        title="Copy Invoice"
      >
        <Copy className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={(e) => {
          e.stopPropagation()
          onAction?.(invoice, 'preview')
        }}
        title="Preview"
      >
        <Eye className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={(e) => {
          e.stopPropagation()
          onAction?.(invoice, 'download')
        }}
        title="Download PDF"
      >
        <Download className="h-4 w-4" />
      </Button>
      {isDraft && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation()
              onAction?.(invoice, 'edit')
            }}
            title="Edit"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="accent"
            size="sm"
            className="h-8 px-3"
            onClick={(e) => {
              e.stopPropagation()
              onAction?.(invoice, 'mark_sent')
            }}
          >
            <Send className="h-3.5 w-3.5 mr-1.5" />
            Mark Sent
          </Button>
        </>
      )}
    </div>
  )
}

export default InvoicesDataTable
