import * as React from 'react'
import { MoreVertical, Copy, Eye, Download, Pencil, Send, Trash2, FileText } from 'lucide-react'
import { cn } from '../../../lib/utils'
import { Button } from '../../ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '../../ui/dropdown-menu'
import type { Invoice, InvoiceAction } from './types'
import { formatCurrency, formatDate, getPaymentTermsLabel } from './types'

// =============================================================================
// TYPES
// =============================================================================

export interface InvoiceCardProps {
  /** Invoice data */
  invoice: Invoice
  /** Callback when card is clicked */
  onClick?: (invoice: Invoice) => void
  /** Callback when an action is selected from the dropdown */
  onActionClick?: (invoice: Invoice, action: InvoiceAction) => void
  /** Additional className */
  className?: string
}

// =============================================================================
// INVOICE CARD COMPONENT
// =============================================================================

/**
 * InvoiceCard - Displays an invoice in a mobile-friendly card format
 *
 * Shows invoice number, status, company, amount, dates, and action menu.
 * Used in the mobile grid view.
 */
export function InvoiceCard({
  invoice,
  onClick,
  onActionClick,
  className,
}: InvoiceCardProps) {
  const handleClick = () => {
    onClick?.(invoice)
  }

  const handleAction = (action: InvoiceAction) => {
    onActionClick?.(invoice, action)
  }

  const isDraft = invoice.status === 'draft'

  return (
    <div
      className={cn(
        'flex flex-col gap-3 p-4 rounded-lg shadow-sm',
        'cursor-pointer hover:border-accent hover:shadow-md transition-all',
        isDraft ? 'border-2 border-default bg-muted-bg/50' : 'border border-default bg-surface',
        className
      )}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleClick()
        }
      }}
    >
      {/* Header: Invoice Number, Status, Actions */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {/* Invoice Icon */}
          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
            <FileText className="w-5 h-5 text-accent" />
          </div>

          {/* Invoice Number and Status */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-primary text-sm">{invoice.invoiceNumber}</span>
              <StatusBadge status={invoice.status} />
            </div>
            <div className="text-xs text-muted mt-0.5">
              {invoice.company.name}
            </div>
          </div>
        </div>

        {/* Actions */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 flex-shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[160px]">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation()
                handleAction('copy')
              }}
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy Invoice
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation()
                handleAction('preview')
              }}
            >
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation()
                handleAction('download')
              }}
            >
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </DropdownMenuItem>
            {isDraft && (
              <>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    handleAction('edit')
                  }}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    handleAction('mark_sent')
                  }}
                >
                  <Send className="mr-2 h-4 w-4" />
                  Mark Sent
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation()
                handleAction('delete')
              }}
              className="text-error focus:text-error"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Description */}
      {invoice.description && (
        <p className="text-sm text-muted line-clamp-2">
          {invoice.description}
        </p>
      )}

      {/* Amount Breakdown */}
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-primary">{formatCurrency(invoice.total)}</span>
        <span className="text-xs text-muted">
          {invoice.lineItems.length} item{invoice.lineItems.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Dates */}
      <div className="flex items-center justify-between pt-3 border-t border-subtle">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted">Invoice Date</span>
          <span className="text-sm text-primary font-medium">{formatDate(invoice.invoiceDate)}</span>
        </div>
        <div className="flex flex-col gap-1 text-right">
          <span className="text-xs text-muted">Due Date</span>
          <span className="text-sm text-primary font-medium">{formatDate(invoice.dueDate)}</span>
        </div>
      </div>

      {/* Payment Terms Badge */}
      <div className="flex items-center gap-2">
        <span className="inline-flex px-2 py-1 text-xs font-medium rounded bg-muted-bg text-primary">
          {getPaymentTermsLabel(invoice.paymentTerms)}
        </span>
      </div>
    </div>
  )
}

// =============================================================================
// SUBCOMPONENTS
// =============================================================================

/** Status badge with color coding */
function StatusBadge({ status }: { status: Invoice['status'] }) {
  const statusConfig = {
    draft: {
      label: 'Draft',
      className: 'bg-muted-bg text-primary border border-default',
      showDot: true,
    },
    sent: {
      label: 'Sent',
      className: 'bg-info-light text-info',
      showDot: false,
    },
    paid: {
      label: 'Paid',
      className: 'bg-success-light text-success',
      showDot: false,
    },
    overdue: {
      label: 'Overdue',
      className: 'bg-error-light text-error',
      showDot: false,
    },
    partially_paid: {
      label: 'Partially Paid',
      className: 'bg-warning-light text-warning',
      showDot: false,
    },
  }

  const config = statusConfig[status]

  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded', config.className)}>
      {config.showDot && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
      {config.label}
    </span>
  )
}

export default InvoiceCard
