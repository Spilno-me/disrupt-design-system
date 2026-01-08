import { formatInvoiceCurrency } from '../../../lib/format'

// Re-export for backwards compatibility
export { formatInvoiceCurrency as formatCurrency }

// =============================================================================
// INVOICE TYPES
// =============================================================================

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'partially_paid'
export type LineItemType = 'platform' | 'process' | 'license'
export type PaymentTerms = 'net_15' | 'net_30' | 'net_60' | 'due_on_receipt'

export interface LineItem {
  /** Unique identifier for line item */
  id: string
  /** Description of the line item */
  description: string
  /** Type of line item (for badge display) */
  type: LineItemType
  /** Quantity */
  quantity: number
  /** Unit price */
  unitPrice: number
  /** Total (quantity * unitPrice) */
  total: number
  /** Additional metadata */
  metadata?: {
    /** Annual/Monthly billing cycle */
    billingCycle?: 'annual' | 'monthly'
    /** Enterprise/Professional tier */
    tier?: string
  }
}

export interface Invoice {
  /** Unique invoice ID */
  id: string
  /** Invoice number (e.g., INV-2025-1208-0172) */
  invoiceNumber: string
  /** Current status */
  status: InvoiceStatus
  /** Invoice date */
  invoiceDate: string
  /** Due date */
  dueDate: string
  /** Company/customer details */
  company: {
    name: string
    address?: string
    city?: string
    state?: string
    zip?: string
    country?: string
    email?: string
    phone?: string
  }
  /** Company metadata */
  metadata?: {
    companySize?: string
    employees?: number
    totalUsers?: number
    pricingVersion?: string
  }
  /** Description/memo */
  description?: string
  /** Line items */
  lineItems: LineItem[]
  /** Subtotal before taxes */
  subtotal: number
  /** Tax amount */
  tax?: number
  /** Total amount */
  total: number
  /** Payment terms */
  paymentTerms: PaymentTerms
  /** Notes/terms at bottom of invoice */
  notes?: string
  /** PDF URL (if available) */
  pdfUrl?: string
  /** When the invoice was created */
  createdAt: string
  /** When last updated */
  updatedAt: string
}

export type InvoiceAction = 'copy' | 'preview' | 'download' | 'edit' | 'mark_sent' | 'delete'

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/** Format date for display */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

/** Get payment terms display label */
export function getPaymentTermsLabel(terms: PaymentTerms): string {
  const labels: Record<PaymentTerms, string> = {
    net_15: 'Net 15',
    net_30: 'Net 30',
    net_60: 'Net 60',
    due_on_receipt: 'Due on Receipt',
  }
  return labels[terms]
}

/** Calculate days until due (negative if overdue) */
export function getDaysUntilDue(dueDate: string): number {
  const due = new Date(dueDate)
  const now = new Date()
  const diffTime = due.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

/** Check if invoice is overdue */
export function isInvoiceOverdue(invoice: Invoice): boolean {
  if (invoice.status === 'paid') return false
  return getDaysUntilDue(invoice.dueDate) < 0
}

export default Invoice
