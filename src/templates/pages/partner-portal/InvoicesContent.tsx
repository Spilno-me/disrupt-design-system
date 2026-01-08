/**
 * InvoicesContent - Invoices tab content for Partner Portal
 *
 * Manages invoice listing and actions.
 */

import * as React from 'react'
import { InvoicesPage } from '../../../components/partners/invoices/InvoicesPage'
import type { Invoice, InvoiceAction } from '../../../components/partners/invoices/types'
import type { PartnerPortalStats } from './types'

export interface InvoicesContentProps {
  /** Invoices data */
  invoices: Invoice[]
  /** Stats for invoices */
  stats?: PartnerPortalStats['invoices']
  /** Callback when invoice is clicked */
  onInvoiceClick?: (invoice: Invoice) => void
  /** Callback when invoice action is triggered */
  onInvoiceAction?: (invoice: Invoice, action: InvoiceAction) => void
  /** Callback when updating an invoice */
  onUpdateInvoice?: (invoice: Invoice) => void
}

export function InvoicesContent({
  invoices,
  stats,
  onInvoiceClick,
  onInvoiceAction,
  onUpdateInvoice,
}: InvoicesContentProps) {
  return (
    <InvoicesPage
      invoices={invoices}
      stats={stats}
      onInvoiceClick={onInvoiceClick}
      onInvoiceAction={onInvoiceAction}
      onUpdateInvoice={onUpdateInvoice}
    />
  )
}
