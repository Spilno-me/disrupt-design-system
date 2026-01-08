import * as React from 'react'
import { AppCard, AppCardContent, AppCardHeader, AppCardTitle, AppCardDescription } from '../../../ui/app-card'
import { formatCurrency, getPaymentTermsLabel } from '../types'
import type { PaymentTerms } from '../types'

// =============================================================================
// TYPES
// =============================================================================

export interface InvoiceTotalsCardProps {
  /** Subtotal before tax */
  subtotal: number
  /** Tax amount (optional) */
  tax?: number
  /** Total amount */
  total: number
  /** Payment terms */
  paymentTerms: PaymentTerms
}

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * InvoiceTotalsCard - Displays invoice totals with prominent styling
 *
 * Read-only - totals are calculated from line items.
 */
export function InvoiceTotalsCard({
  subtotal,
  tax,
  total,
  paymentTerms,
}: InvoiceTotalsCardProps) {
  return (
    <AppCard shadow="sm" role="group" aria-labelledby="totals-heading">
      <AppCardHeader>
        <AppCardTitle id="totals-heading" className="text-lg">Amount Due</AppCardTitle>
        <AppCardDescription>Invoice summary</AppCardDescription>
      </AppCardHeader>
      <AppCardContent>
        <div className="p-4 rounded-lg bg-accent-bg border border-accent">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm text-muted mb-1">Total Amount</div>
              <div className="text-3xl font-bold text-primary">{formatCurrency(total)}</div>
            </div>
            <span className="inline-flex px-3 py-1.5 text-sm font-medium rounded bg-surface border border-default text-primary">
              {getPaymentTermsLabel(paymentTerms)}
            </span>
          </div>

          {/* Breakdown */}
          <div className="pt-3 border-t border-accent/30 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted">Subtotal:</span>
              <span className="font-medium text-primary">{formatCurrency(subtotal)}</span>
            </div>
            {tax !== undefined && tax > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted">Tax:</span>
                <span className="font-medium text-primary">{formatCurrency(tax)}</span>
              </div>
            )}
          </div>
        </div>
      </AppCardContent>
    </AppCard>
  )
}

export default InvoiceTotalsCard
