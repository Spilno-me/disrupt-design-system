import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '../../../lib/utils'
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
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        {/* Overlay */}
        <DialogPrimitive.Overlay
          className={cn(
            'fixed inset-0 z-50 bg-black/80',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0'
          )}
        />

        {/* Content */}
        <DialogPrimitive.Content
          className={cn(
            'fixed inset-4 z-50 flex flex-col',
            'bg-surface rounded-lg shadow-lg',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            className
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-default">
            <div className="flex flex-col gap-1">
              <DialogPrimitive.Title className="text-lg font-semibold text-primary">
                Invoice Preview
              </DialogPrimitive.Title>
              <DialogPrimitive.Description className="text-sm text-muted">
                {invoice.invoiceNumber} - {invoice.company.name}
              </DialogPrimitive.Description>
            </div>
            <DialogPrimitive.Close asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </Button>
            </DialogPrimitive.Close>
          </div>

          {/* PDF Viewer */}
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
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

// =============================================================================
// SUBCOMPONENTS
// =============================================================================

/** Placeholder when PDF is not available */
function PDFPlaceholder({ invoice }: { invoice: Invoice }) {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-mutedBg">
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
