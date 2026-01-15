/**
 * Type definitions for Partner Invoices page (per 06_invoices.md spec)
 * @module partner-invoices/types
 *
 * This is the Partner Portal Invoice Overview - a READ-ONLY page
 * showing invoices generated from Tenant Requests and Active Tenants.
 */

// =============================================================================
// STATUS TYPES (per spec Section: Filters > Status Filter)
// =============================================================================

/**
 * Invoice status - combines states from Tenant Requests and Active Tenants
 * These map to the tenant lifecycle stages
 */
export type PartnerInvoiceStatus =
  | "draft"           // Initial state, invoice created but not submitted
  | "submitted"       // Tenant request submitted for review
  | "approved"        // Tenant request approved, awaiting payment
  | "pending_payment" // Invoice sent, awaiting payment
  | "active"          // Tenant is active, payment received
  | "overdue"         // Payment past due date
  | "suspended"       // Tenant suspended due to non-payment

// =============================================================================
// CORE ENTITY (per spec Section: Invoices Table)
// =============================================================================

export interface PartnerInvoice {
  /** Unique identifier */
  id: string

  /** System-generated invoice reference number (e.g., INV-2025-001) */
  reference: string

  /** Company/organization name */
  companyName: string

  /** Primary contact person name */
  contactName: string

  /** Primary contact email */
  contactEmail: string

  /** Primary contact phone (optional) */
  contactPhone?: string

  /** Current invoice status */
  status: PartnerInvoiceStatus

  /** Monthly recurring amount in USD */
  monthlyAmount: number

  /** Annual total amount in USD (monthlyAmount * 12) */
  annualAmount: number

  /** Invoice generation/creation date */
  createdDate: Date

  /** Link to PDF document (optional) */
  pdfUrl?: string

  /** Source: from tenant request or active tenant */
  source: "tenant_request" | "active_tenant"

  /** Related tenant ID (if from active tenant) */
  tenantId?: string

  /** Related tenant request ID (if from request) */
  tenantRequestId?: string
}

// =============================================================================
// STATS TYPES (for KPI widgets if needed)
// =============================================================================

export interface PartnerInvoiceStatData {
  value: number
  trend?: string
  trendDirection?: "up" | "down" | "neutral"
}

export interface PartnerInvoicesStats {
  total: PartnerInvoiceStatData
  pendingPayment: PartnerInvoiceStatData
  active: PartnerInvoiceStatData
  overdue: PartnerInvoiceStatData
}

// =============================================================================
// PAGE PROPS
// =============================================================================

export interface PartnerInvoicesPageProps {
  /** Array of invoices to display */
  invoices?: PartnerInvoice[]
  /** Stats for KPI widget cards (optional) */
  stats?: PartnerInvoicesStats
  /** Callback when view action is clicked */
  onViewInvoice?: (invoice: PartnerInvoice) => void
  /** Callback when view PDF action is clicked */
  onViewPDF?: (invoice: PartnerInvoice) => void
  /** Callback when download PDF action is clicked */
  onDownloadPDF?: (invoice: PartnerInvoice) => void
  /** Loading state */
  loading?: boolean
  /** Additional className for the container */
  className?: string
}

// =============================================================================
// ACTION TYPES (per spec: read-only actions only)
// =============================================================================

export type PartnerInvoiceAction = "view" | "view_pdf" | "download_pdf"

// =============================================================================
// HELPER CONSTANTS
// =============================================================================

export const STATUS_LABELS: Record<PartnerInvoiceStatus, string> = {
  draft: "Draft",
  submitted: "Submitted",
  approved: "Approved",
  pending_payment: "Pending Payment",
  active: "Active",
  overdue: "Overdue",
  suspended: "Suspended",
}

export const STATUS_BADGE_VARIANTS: Record<PartnerInvoiceStatus, "default" | "secondary" | "success" | "warning" | "destructive" | "info"> = {
  draft: "secondary",
  submitted: "info",
  approved: "default",
  pending_payment: "warning",
  active: "success",
  overdue: "warning",
  suspended: "destructive",
}
