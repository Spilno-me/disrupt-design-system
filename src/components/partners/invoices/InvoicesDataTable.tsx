import * as React from 'react'
import { Eye, Download, Pencil, Send, MoreHorizontal, Copy } from 'lucide-react'
import { DataTable, ColumnDef, SortDirection } from '../../ui/DataTable'
import type { Invoice, InvoiceAction } from './types'
import { formatCurrency, formatDate, getPaymentTermsLabel } from './types'
import { DataTableStatusDot, INVOICE_DOT_STATUS_MAP } from '../../ui/table'
import { ActionTile } from '../../ui/ActionTile'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu'
import { Button } from '../../ui/button'


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
  // Pagination props (forwarded to DataTable)
  /** Enable embedded pagination in table footer */
  pagination?: boolean
  /** Current page number (1-indexed) */
  currentPage?: number
  /** Total number of items (for pagination display) */
  totalItems?: number
  /** Number of items per page */
  pageSize?: number
  /** Callback when page changes */
  onPageChange?: (page: number) => void
  /** Callback when page size changes */
  onPageSizeChange?: (size: number) => void
  /** Available page size options */
  pageSizeOptions?: number[]
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
  // Pagination props
  pagination,
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions,
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
      accessor: (invoice) => <DataTableStatusDot status={invoice.status} mapping={INVOICE_DOT_STATUS_MAP} />,
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
        <span className="inline-flex px-2 py-1 text-xs font-medium rounded bg-muted-bg text-primary">
          {getPaymentTermsLabel(invoice.paymentTerms)}
        </span>
      ),
      minWidth: "100px",
      align: "center",
    },
    {
      id: "actions",
      header: "",
      accessor: (invoice) => {
        const isDraft = invoice.status === 'draft'

        // Rule: >3 actions = show 2 inline + "..." menu
        // Draft: 4 actions (Preview, Download, Edit, Mark as Sent) → 2 inline + menu
        // Non-draft: 2 actions (Preview, Download) → both inline

        if (isDraft) {
          return (
            <div className="flex items-center justify-end gap-1">
              <ActionTile
                variant="info"
                size="xs"
                aria-label="Preview Invoice"
                onClick={(e) => {
                  e.stopPropagation()
                  onActionClick?.(invoice, 'preview')
                }}
              >
                <Eye className="h-4 w-4" />
              </ActionTile>
              <ActionTile
                variant="info"
                size="xs"
                aria-label="Edit Invoice"
                onClick={(e) => {
                  e.stopPropagation()
                  onActionClick?.(invoice, 'edit')
                }}
              >
                <Pencil className="h-4 w-4" />
              </ActionTile>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenuItem onClick={() => onActionClick?.(invoice, 'download')}>
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onActionClick?.(invoice, 'mark_sent')}>
                    <Send className="h-4 w-4 mr-2" />
                    Mark as Sent
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )
        }

        // Non-draft: 3 actions (Preview, Download, Copy) → 2 inline + menu
        return (
          <div className="flex items-center justify-end gap-1">
            <ActionTile
              variant="info"
              size="xs"
              aria-label="Preview Invoice"
              onClick={(e) => {
                e.stopPropagation()
                onActionClick?.(invoice, 'preview')
              }}
            >
              <Eye className="h-4 w-4" />
            </ActionTile>
            <ActionTile
              variant="neutral"
              size="xs"
              aria-label="Download PDF"
              onClick={(e) => {
                e.stopPropagation()
                onActionClick?.(invoice, 'download')
              }}
            >
              <Download className="h-4 w-4" />
            </ActionTile>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                <DropdownMenuItem onClick={() => onActionClick?.(invoice, 'copy')}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Invoice Number
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
      width: "110px",
      align: "right",
      sticky: "right",
    },
  ]
  /* eslint-enable no-restricted-syntax */

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
      // Pagination props (forwarded)
      pagination={pagination}
      currentPage={currentPage}
      totalItems={totalItems}
      pageSize={pageSize}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      pageSizeOptions={pageSizeOptions}
      emptyState={
        <div className="flex flex-col items-center justify-center py-12">
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
          <h3 className="text-lg font-semibold text-primary mb-2">No invoices found</h3>
          <p className="text-sm text-secondary">Create your first invoice to get started</p>
        </div>
      }
    />
  )
}

export default InvoicesDataTable
