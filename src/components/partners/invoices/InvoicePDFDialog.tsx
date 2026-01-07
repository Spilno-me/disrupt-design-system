import * as React from 'react'
import { X } from 'lucide-react'
import { cn } from '../../../lib/utils'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '../../ui/dialog'
import { Button } from '../../ui/button'
import type { Invoice } from './types'

// =============================================================================
// TYPES
// =============================================================================

export interface InvoicePDFDialogProps {
  /** Whether the dialog is open */
  open: boolean
  /** Callback when open state changes */
  onOpenChange: (open: boolean) => void
  /** Invoice to display PDF for */
  invoice: Invoice | null
  /** Additional className */
  className?: string
}

// =============================================================================
// INVOICE PDF DIALOG COMPONENT
// =============================================================================

/**
 * InvoicePDFDialog - Full-screen PDF preview dialog
 *
 * Uses DDS Dialog for consistent styling with animated gradient border,
 * standardized z-index, and iOS 26 compatibility.
 *
 * Displays the invoice PDF in a full-screen dialog with an embedded viewer.
 * Falls back to a placeholder if no PDF URL is available.
 */
export function InvoicePDFDialog({
  open,
  onOpenChange,
  invoice,
  className,
}: InvoicePDFDialogProps) {
  if (!invoice) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          // Hide DDS built-in close button (keep custom one in header)
          '[&_button.absolute]:hidden',
          // Override DDS centered positioning for fullscreen layout
          '!fixed !inset-4 !top-4 !left-4 !right-4 !bottom-4',
          '!translate-x-0 !translate-y-0 !max-w-none',
          // Reset inner wrapper for fullscreen (remove padding, gap, border-radius)
          '[&>div]:p-0 [&>div]:gap-0 [&>div]:rounded-none',
          'flex flex-col',
          className
        )}
      >
        {/* Header - custom padding since inner wrapper padding is reset */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-default">
          <div className="flex flex-col gap-1">
            <DialogTitle className="text-lg font-semibold">
              Invoice Preview
            </DialogTitle>
            <DialogDescription className="text-sm text-muted">
              {invoice.invoiceNumber} - {invoice.company.name}
            </DialogDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        {/* PDF Viewer - full remaining height */}
        <div className="flex-1 overflow-hidden">
          {invoice.pdfUrl ? (
            <iframe
              src={invoice.pdfUrl}
              className="w-full h-full border-0"
              title={`Invoice ${invoice.invoiceNumber} PDF`}
            />
          ) : (
            <PDFPlaceholder invoice={invoice} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

// =============================================================================
// SUBCOMPONENTS
// =============================================================================

/** Placeholder when PDF is not available */
function PDFPlaceholder({ invoice }: { invoice: Invoice }) {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-muted-bg">
      <div className="w-24 h-24 mb-6 rounded-full bg-surface flex items-center justify-center shadow-md">
        <svg
          className="w-12 h-12 text-muted"
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
      <h3 className="text-xl font-semibold text-primary mb-2">PDF Not Available</h3>
      <p className="text-sm text-muted text-center max-w-md mb-6">
        The PDF for invoice {invoice.invoiceNumber} is not yet available.
        {invoice.status === 'draft' && ' Generate the invoice to create a PDF.'}
      </p>
      <Button variant="accent" onClick={() => window.alert('PDF generation would happen here')}>
        Generate PDF
      </Button>
    </div>
  )
}

export default InvoicePDFDialog
