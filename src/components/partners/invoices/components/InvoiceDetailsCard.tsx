import * as React from 'react'
import { Calendar, CreditCard } from 'lucide-react'
import { AppCard, AppCardContent, AppCardHeader, AppCardTitle, AppCardDescription } from '../../../ui/app-card'
import { Input } from '../../../ui/input'
import { Label } from '../../../ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../ui/select'
import { cn } from '../../../../lib/utils'
import type { Invoice, InvoiceStatus, PaymentTerms } from '../types'
import { formatDate, getPaymentTermsLabel } from '../types'

// =============================================================================
// TYPES
// =============================================================================

export interface InvoiceDetailsCardProps {
  /** Invoice number */
  invoiceNumber: string
  /** Invoice status */
  status: InvoiceStatus
  /** Invoice date */
  invoiceDate: string
  /** Due date */
  dueDate: string
  /** Payment terms */
  paymentTerms: PaymentTerms
  /** Whether in edit mode */
  isEditing?: boolean
  /** Form register function (for edit mode) */
  register?: any
  /** Form setValue function (for edit mode) */
  setValue?: any
  /** Form watch function (for edit mode) */
  watch?: any
}

// =============================================================================
// SUBCOMPONENTS
// =============================================================================

/** Status badge with color coding */
function StatusBadge({ status }: { status: InvoiceStatus }) {
  const statusConfig: Record<InvoiceStatus, { label: string; className: string; showDot: boolean }> = {
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

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * InvoiceDetailsCard - Displays/edits invoice details (dates, status, terms)
 */
export function InvoiceDetailsCard({
  invoiceNumber,
  status,
  invoiceDate,
  dueDate,
  paymentTerms,
  isEditing = false,
  register,
  setValue,
  watch,
}: InvoiceDetailsCardProps) {
  const watchedPaymentTerms = watch?.('paymentTerms') || paymentTerms

  if (isEditing) {
    return (
      <AppCard shadow="sm" role="group" aria-labelledby="details-heading">
        <AppCardHeader>
          <AppCardTitle id="details-heading" className="text-lg">Invoice Details</AppCardTitle>
          <AppCardDescription>Invoice information and dates</AppCardDescription>
        </AppCardHeader>
        <AppCardContent className="space-y-4">
          {/* Invoice Number (read-only in edit) */}
          <div className="p-3 rounded-lg bg-muted-bg">
            <div className="text-xs text-muted mb-1">Invoice Number</div>
            <div className="text-sm font-medium text-primary">{invoiceNumber}</div>
          </div>

          {/* Status (read-only in edit) */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-primary">Status</span>
            <StatusBadge status={status} />
          </div>

          {/* Invoice Date */}
          <div className="space-y-2">
            <Label htmlFor="invoiceDate" className="text-sm text-primary flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-muted" />
              Invoice Date
            </Label>
            <Input
              id="invoiceDate"
              type="date"
              {...register?.('invoiceDate')}
            />
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <Label htmlFor="dueDate" className="text-sm text-primary flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-muted" />
              Due Date
            </Label>
            <Input
              id="dueDate"
              type="date"
              {...register?.('dueDate')}
            />
          </div>

          {/* Payment Terms */}
          <div className="space-y-2">
            <Label className="text-sm text-primary flex items-center gap-1.5">
              <CreditCard className="h-3.5 w-3.5 text-muted" />
              Payment Terms
            </Label>
            <Select
              value={watchedPaymentTerms}
              onValueChange={(value) => setValue?.('paymentTerms', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment terms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="net_15">Net 15</SelectItem>
                <SelectItem value="net_30">Net 30</SelectItem>
                <SelectItem value="net_60">Net 60</SelectItem>
                <SelectItem value="due_on_receipt">Due on Receipt</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </AppCardContent>
      </AppCard>
    )
  }

  // View mode
  return (
    <AppCard shadow="sm" role="group" aria-labelledby="details-heading">
      <AppCardHeader>
        <div className="flex items-center justify-between">
          <AppCardTitle id="details-heading" className="text-lg">Invoice Details</AppCardTitle>
          <StatusBadge status={status} />
        </div>
        <AppCardDescription>Invoice #{invoiceNumber}</AppCardDescription>
      </AppCardHeader>
      <AppCardContent>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-muted-bg">
            <div className="text-xs text-muted mb-1">Invoice Date</div>
            <div className="text-sm font-medium text-primary">{formatDate(invoiceDate)}</div>
          </div>
          <div className="p-3 rounded-lg bg-muted-bg">
            <div className="text-xs text-muted mb-1">Due Date</div>
            <div className="text-sm font-medium text-primary">{formatDate(dueDate)}</div>
          </div>
          <div className="col-span-2 p-3 rounded-lg bg-muted-bg">
            <div className="text-xs text-muted mb-1">Payment Terms</div>
            <div className="text-sm font-medium text-primary">{getPaymentTermsLabel(paymentTerms)}</div>
          </div>
        </div>
      </AppCardContent>
    </AppCard>
  )
}

export default InvoiceDetailsCard
