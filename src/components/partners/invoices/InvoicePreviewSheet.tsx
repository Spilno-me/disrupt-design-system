import * as React from 'react'
import { X, Building2, Mail, Phone, MapPin } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '../../ui/sheet'
import { Button } from '../../ui/button'
import { cn } from '../../../lib/utils'
import type { Invoice, LineItem } from './types'
import { formatCurrency, formatDate, getPaymentTermsLabel } from './types'

// =============================================================================
// TYPES
// =============================================================================

export interface InvoicePreviewSheetProps {
  /** Whether the sheet is open */
  open: boolean
  /** Callback when open state changes */
  onOpenChange: (open: boolean) => void
  /** Invoice to display */
  invoice: Invoice | null
  /** Additional className */
  className?: string
}

// =============================================================================
// INVOICE PREVIEW SHEET COMPONENT
// =============================================================================

/**
 * InvoicePreviewSheet - Quick preview panel for invoice details
 *
 * Displays invoice details in a sliding panel from the right side.
 * Shows company info, line items, totals, and metadata.
 */
export function InvoicePreviewSheet({
  open,
  onOpenChange,
  invoice,
  className,
}: InvoicePreviewSheetProps) {
  if (!invoice) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className={cn('w-full sm:max-w-2xl overflow-y-auto', className)}
        hideCloseButton
      >
        {/* Header */}
        <SheetHeader className="border-b border-subtle pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <SheetTitle className="text-xl font-semibold text-primary">
                Invoice {invoice.invoiceNumber}
              </SheetTitle>
              <StatusBadge status={invoice.status} />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </SheetHeader>

        {/* Content */}
        <div className="flex flex-col gap-6 py-6">
          {/* Bill To Section */}
          <section>
            <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
              Bill To
            </h3>
            <div className="flex flex-col gap-2 p-4 rounded-lg bg-muted-bg border border-subtle">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-muted flex-shrink-0" />
                <span className="font-semibold text-primary">{invoice.company.name}</span>
              </div>
              {invoice.company.address && (
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-muted flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-primary">
                    <div>{invoice.company.address}</div>
                    {(invoice.company.city || invoice.company.state || invoice.company.zip) && (
                      <div>
                        {invoice.company.city}
                        {invoice.company.state && `, ${invoice.company.state}`}
                        {invoice.company.zip && ` ${invoice.company.zip}`}
                      </div>
                    )}
                    {invoice.company.country && <div>{invoice.company.country}</div>}
                  </div>
                </div>
              )}
              {invoice.company.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted flex-shrink-0" />
                  <span className="text-sm text-primary">{invoice.company.email}</span>
                </div>
              )}
              {invoice.company.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted flex-shrink-0" />
                  <span className="text-sm text-primary">{invoice.company.phone}</span>
                </div>
              )}
            </div>
          </section>

          {/* Total Amount */}
          <section className="flex items-center justify-between p-4 rounded-lg bg-accent-bg border border-accent">
            <div>
              <div className="text-sm text-muted mb-1">Total Amount</div>
              <div className="text-3xl font-bold text-primary">{formatCurrency(invoice.total)}</div>
            </div>
            <span className="inline-flex px-3 py-1.5 text-sm font-medium rounded bg-surface border border-default text-primary">
              {getPaymentTermsLabel(invoice.paymentTerms)}
            </span>
          </section>

          {/* Metadata Grid */}
          {invoice.metadata && (
            <section className="grid grid-cols-2 gap-3">
              {invoice.metadata.companySize && (
                <MetadataItem label="Company Size" value={invoice.metadata.companySize} />
              )}
              {invoice.metadata.employees && (
                <MetadataItem label="Employees" value={invoice.metadata.employees.toLocaleString()} />
              )}
              {invoice.metadata.totalUsers && (
                <MetadataItem label="Total Users" value={invoice.metadata.totalUsers.toLocaleString()} />
              )}
              {invoice.metadata.pricingVersion && (
                <MetadataItem label="Pricing" value={invoice.metadata.pricingVersion} />
              )}
            </section>
          )}

          {/* Dates */}
          <section className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-muted-bg">
              <div className="text-xs text-muted mb-1">Invoice Date</div>
              <div className="text-sm font-medium text-primary">{formatDate(invoice.invoiceDate)}</div>
            </div>
            <div className="p-3 rounded-lg bg-muted-bg">
              <div className="text-xs text-muted mb-1">Due Date</div>
              <div className="text-sm font-medium text-primary">{formatDate(invoice.dueDate)}</div>
            </div>
          </section>

          {/* Description */}
          {invoice.description && (
            <section>
              <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">
                Description
              </h3>
              <p className="text-sm text-primary leading-relaxed">{invoice.description}</p>
            </section>
          )}

          {/* Line Items Table */}
          <section>
            <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
              Line Items
            </h3>
            <div className="border border-default rounded-lg overflow-hidden">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-2 px-4 py-3 bg-muted-bg border-b border-default text-xs font-semibold text-primary uppercase tracking-wider">
                <div className="col-span-5">Description</div>
                <div className="col-span-2 text-center">Qty</div>
                <div className="col-span-2 text-right">Unit Price</div>
                <div className="col-span-3 text-right">Total</div>
              </div>
              {/* Table Body */}
              <div className="bg-surface">
                {invoice.lineItems.map((item, index) => (
                  <LineItemRow
                    key={item.id}
                    item={item}
                    isLast={index === invoice.lineItems.length - 1}
                  />
                ))}
              </div>
              {/* Totals */}
              <div className="border-t-2 border-default bg-muted-bg">
                {invoice.tax !== undefined && (
                  <div className="grid grid-cols-12 gap-2 px-4 py-2 text-sm">
                    <div className="col-span-9 text-right text-muted">Subtotal:</div>
                    <div className="col-span-3 text-right font-medium text-primary">
                      {formatCurrency(invoice.subtotal)}
                    </div>
                  </div>
                )}
                {invoice.tax !== undefined && (
                  <div className="grid grid-cols-12 gap-2 px-4 py-2 text-sm">
                    <div className="col-span-9 text-right text-muted">Tax:</div>
                    <div className="col-span-3 text-right font-medium text-primary">
                      {formatCurrency(invoice.tax)}
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-12 gap-2 px-4 py-3 text-base border-t border-default">
                  <div className="col-span-9 text-right font-semibold text-primary">Total:</div>
                  <div className="col-span-3 text-right font-bold text-primary">
                    {formatCurrency(invoice.total)}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Notes */}
          {invoice.notes && (
            <section className="p-4 rounded-lg bg-muted-bg border border-subtle">
              <h3 className="text-sm font-semibold text-primary mb-2">Notes</h3>
              <p className="text-sm text-muted leading-relaxed whitespace-pre-wrap">
                {invoice.notes}
              </p>
            </section>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

// =============================================================================
// SUBCOMPONENTS
// =============================================================================

/** Status badge */
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
    <span className={cn('inline-flex items-center gap-1.5 px-3 py-1 text-sm font-medium rounded', config.className)}>
      {config.showDot && <span className="w-2 h-2 rounded-full bg-current" />}
      {config.label}
    </span>
  )
}

/** Metadata item */
function MetadataItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 rounded-lg bg-muted-bg">
      <div className="text-xs text-muted mb-1">{label}</div>
      <div className="text-sm font-medium text-primary">{value}</div>
    </div>
  )
}

/** Line item row */
function LineItemRow({ item, isLast }: { item: LineItem; isLast: boolean }) {
  return (
    <div
      className={cn(
        'grid grid-cols-12 gap-2 px-4 py-3',
        !isLast && 'border-b border-subtle'
      )}
    >
      <div className="col-span-5">
        <div className="font-medium text-primary text-sm mb-1">{item.description}</div>
        <div className="flex items-center gap-2">
          <LineItemTypeBadge type={item.type} />
          {item.metadata?.billingCycle && (
            <span className="text-xs text-muted capitalize">({item.metadata.billingCycle})</span>
          )}
        </div>
      </div>
      <div className="col-span-2 text-center text-sm text-primary">{item.quantity}</div>
      <div className="col-span-2 text-right text-sm text-primary">{formatCurrency(item.unitPrice)}</div>
      <div className="col-span-3 text-right font-semibold text-sm text-primary">
        {formatCurrency(item.total)}
      </div>
    </div>
  )
}

/** Line item type badge */
function LineItemTypeBadge({ type }: { type: LineItem['type'] }) {
  const typeConfig = {
    platform: {
      label: 'Platform',
      className: 'bg-info-light text-info',
    },
    process: {
      label: 'Process',
      className: 'bg-accent-bg text-accent',
    },
    license: {
      label: 'License',
      className: 'bg-success-light text-success',
    },
  }

  const config = typeConfig[type]

  return (
    <span className={cn('inline-flex px-2 py-0.5 text-xs font-medium rounded', config.className)}>
      {config.label}
    </span>
  )
}

export default InvoicePreviewSheet
