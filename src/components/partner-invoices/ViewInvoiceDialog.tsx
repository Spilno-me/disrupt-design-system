"use client"

/**
 * ViewInvoiceDialog - Dialog for viewing Partner Invoice details
 * @module partner-invoices/ViewInvoiceDialog
 *
 * Per spec (06_invoices.md):
 * - Read-only view of invoice details
 * - Actions: View as PDF, Download PDF
 */

import * as React from "react"
import {
  Building2,
  Mail,
  Phone,
  User,
  Calendar,
  DollarSign,
  FileText,
  Download,
  ExternalLink,
} from "lucide-react"
import { Button } from "../ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"
import { Badge } from "../ui/badge"
import { formatCurrency } from "../../lib/format"
import type { PartnerInvoice } from "./types"
import { STATUS_LABELS, STATUS_BADGE_VARIANTS } from "./types"

// =============================================================================
// TYPES
// =============================================================================

export interface ViewInvoiceDialogProps {
  /** Whether the dialog is open */
  open: boolean
  /** Callback when dialog open state changes */
  onOpenChange: (open: boolean) => void
  /** Invoice to view */
  invoice: PartnerInvoice | null
  /** Callback when View PDF action is clicked */
  onViewPDF?: (invoice: PartnerInvoice) => void
  /** Callback when Download PDF action is clicked */
  onDownloadPDF?: (invoice: PartnerInvoice) => void
}

// =============================================================================
// HELPERS
// =============================================================================

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date)
}

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * ViewInvoiceDialog - Read-only dialog for viewing Partner Invoice details
 *
 * Per spec (06_invoices.md Section: Invoice View):
 * - Displays company & contact information
 * - Shows pricing breakdown (monthly/annual)
 * - Actions: View as PDF, Download PDF
 *
 * @example
 * ```tsx
 * <ViewInvoiceDialog
 *   open={viewDialogOpen}
 *   onOpenChange={setViewDialogOpen}
 *   invoice={selectedInvoice}
 *   onViewPDF={handleViewPDF}
 *   onDownloadPDF={handleDownloadPDF}
 * />
 * ```
 */
export function ViewInvoiceDialog({
  open,
  onOpenChange,
  invoice,
  onViewPDF,
  onDownloadPDF,
}: ViewInvoiceDialogProps) {
  if (!invoice) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg" data-testid="partner-invoices-view-dialog">
        <DialogHeader>
          <DialogTitle
            className="flex items-center gap-2 text-xl font-semibold text-primary"
            data-testid="partner-invoices-view-dialog-title"
          >
            <FileText className="h-5 w-5 text-accent" />
            Invoice {invoice.reference}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Badge */}
          <div className="flex items-center gap-2" data-testid="partner-invoices-view-dialog-status">
            <Badge variant={STATUS_BADGE_VARIANTS[invoice.status]}>
              {STATUS_LABELS[invoice.status]}
            </Badge>
            <span className="text-xs text-muted">
              Created {formatDate(invoice.createdDate)}
            </span>
          </div>

          {/* Company Section */}
          <div
            className="space-y-3 rounded-lg border border-default bg-surface p-4"
            data-testid="partner-invoices-view-dialog-company"
          >
            <h3 className="text-sm font-semibold text-primary">Company / Tenant</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Building2 className="h-4 w-4 text-muted shrink-0" />
                <span className="font-medium text-primary">{invoice.companyName}</span>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div
            className="space-y-3 rounded-lg border border-default bg-surface p-4"
            data-testid="partner-invoices-view-dialog-contact"
          >
            <h3 className="text-sm font-semibold text-primary">Contact Information</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted shrink-0" />
                <span className="text-primary">{invoice.contactName}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted shrink-0" />
                <span className="text-primary">{invoice.contactEmail}</span>
              </div>
              {invoice.contactPhone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted shrink-0" />
                  <span className="text-primary">{invoice.contactPhone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Pricing Section */}
          <div
            className="space-y-3 rounded-lg border border-default bg-surface p-4"
            data-testid="partner-invoices-view-dialog-pricing"
          >
            <h3 className="text-sm font-semibold text-primary">Pricing</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-muted">
                  <DollarSign className="h-3.5 w-3.5" />
                  Monthly Amount
                </div>
                <div className="text-lg font-semibold text-primary">
                  {formatCurrency(invoice.monthlyAmount)}
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-muted">
                  <Calendar className="h-3.5 w-3.5" />
                  Annual Amount
                </div>
                <div className="text-lg font-semibold text-primary">
                  {formatCurrency(invoice.annualAmount)}
                </div>
              </div>
            </div>
          </div>

          {/* Actions (per spec: View as PDF, Download PDF) */}
          <div className="flex gap-3 pt-4" data-testid="partner-invoices-view-dialog-actions">
            {invoice.pdfUrl && onViewPDF && (
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  onViewPDF(invoice)
                }}
                data-testid="partner-invoices-view-dialog-view-pdf-btn"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                View as PDF
              </Button>
            )}
            {invoice.pdfUrl && onDownloadPDF && (
              <Button
                variant="accent"
                className="flex-1"
                onClick={() => {
                  onDownloadPDF(invoice)
                }}
                data-testid="partner-invoices-view-dialog-download-pdf-btn"
              >
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
            )}
            {!invoice.pdfUrl && (
              <p className="text-sm text-muted italic">
                PDF not available for this invoice.
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ViewInvoiceDialog
