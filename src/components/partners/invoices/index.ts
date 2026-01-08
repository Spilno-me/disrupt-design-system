// =============================================================================
// INVOICES MODULE EXPORTS
// =============================================================================

// Types
export type {
  Invoice,
  InvoiceStatus,
  LineItem,
  LineItemType,
  PaymentTerms,
  InvoiceAction,
} from './types'

export {
  formatCurrency,
  formatDate,
  getPaymentTermsLabel,
  getDaysUntilDue,
  isInvoiceOverdue,
} from './types'

// Components
export { InvoiceCard } from './InvoiceCard'
export type { InvoiceCardProps } from './InvoiceCard'

export { InvoicesDataTable } from './InvoicesDataTable'
export type { InvoicesDataTableProps } from './InvoicesDataTable'

/**
 * @deprecated Use InvoiceDetailPage instead. This sheet will be removed in v3.
 */
export { InvoicePreviewSheet } from './InvoicePreviewSheet'
export type { InvoicePreviewSheetProps } from './InvoicePreviewSheet'

export { InvoicePDFDialog } from './InvoicePDFDialog'
export type { InvoicePDFDialogProps } from './InvoicePDFDialog'

/**
 * @deprecated Use InvoiceDetailPage instead. This dialog will be removed in v3.
 */
export { EditInvoiceDialog } from './EditInvoiceDialog'
export type { EditInvoiceDialogProps, EditInvoiceFormData } from './EditInvoiceDialog'

export { InvoicesPage } from './InvoicesPage'
export type { InvoicesPageProps } from './InvoicesPage'

// New: Full-page invoice detail (replaces sheet + dialog)
export { InvoiceDetailPage } from './pages'
export type { InvoiceDetailPageProps, InvoiceFormData, InvoicePageMode } from './pages'

// New: Invoice detail card components
export * from './components'

// Hooks
export { useInvoicesState } from './useInvoicesState'

// Default export
export { InvoicesPage as default } from './InvoicesPage'
