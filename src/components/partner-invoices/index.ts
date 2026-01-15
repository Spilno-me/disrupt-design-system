/**
 * Partner Invoices Module Exports
 * @module partner-invoices
 *
 * Read-only invoice overview for Partner Portal
 * Per spec: 06_invoices.md
 */

// Main page component
export { PartnerInvoicesPage, MOCK_PARTNER_INVOICES, MOCK_PARTNER_INVOICES_STATS } from "./PartnerInvoicesPage"
export { default as PartnerInvoicesPageDefault } from "./PartnerInvoicesPage"

// Dialog components
export { ViewInvoiceDialog } from "./ViewInvoiceDialog"

// Types
export type {
  PartnerInvoiceStatus,
  PartnerInvoice,
  PartnerInvoiceStatData,
  PartnerInvoicesStats,
  PartnerInvoicesPageProps,
  PartnerInvoiceAction,
} from "./types"

export { STATUS_LABELS, STATUS_BADGE_VARIANTS } from "./types"

export type { ViewInvoiceDialogProps } from "./ViewInvoiceDialog"

// Data
export { generatePartnerInvoicesStats } from "./data/mock-invoices"

// Constants
export { PARTNER_INVOICE_FILTER_GROUPS } from "./constants/filter.constants"
