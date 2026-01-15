import * as React from "react"
import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { Eye } from "lucide-react"
import { Button } from "../../../components/ui/button"
import { ViewInvoiceDialog, MOCK_PARTNER_INVOICES } from "../../../components/partner-invoices"
import type { PartnerInvoice } from "../../../components/partner-invoices"
import { ORGANISM_META, organismDescription } from "../../_infrastructure"

// =============================================================================
// STORY CONFIGURATION
// =============================================================================

const meta: Meta<typeof ViewInvoiceDialog> = {
  title: "Partner/Invoices/ViewInvoiceDialog",
  component: ViewInvoiceDialog,
  ...ORGANISM_META,
  parameters: {
    ...ORGANISM_META.parameters,
    layout: "centered",
    docs: {
      description: {
        component: organismDescription(`Read-only dialog for viewing Partner Invoice details.

## Features (per spec 06_invoices.md)
- Displays invoice reference and status
- Company/tenant information
- Contact details (name, email, phone)
- Pricing breakdown (monthly & annual amounts)
- Actions: View as PDF, Download PDF

## Usage
Used when clicking "View Invoice" from the PartnerInvoicesPage actions menu
or when clicking a row in the table.`),
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof ViewInvoiceDialog>

// =============================================================================
// MOCK DATA
// =============================================================================

const activeInvoice = MOCK_PARTNER_INVOICES.find((i) => i.status === "active")!
const overdueInvoice = MOCK_PARTNER_INVOICES.find((i) => i.status === "overdue")!
const pendingInvoice = MOCK_PARTNER_INVOICES.find((i) => i.status === "pending_payment")!
const draftInvoice = MOCK_PARTNER_INVOICES.find((i) => i.status === "draft")!
const suspendedInvoice = MOCK_PARTNER_INVOICES.find((i) => i.status === "suspended")!

// Invoice without PDF
const noPdfInvoice: PartnerInvoice = {
  ...draftInvoice,
  pdfUrl: undefined,
}

// =============================================================================
// STORIES
// =============================================================================

function ViewInvoiceDialogDemo({ invoice }: { invoice: PartnerInvoice }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex flex-col items-center gap-4">
      <Button variant="accent" onClick={() => setOpen(true)}>
        <Eye className="w-4 h-4 mr-2" />
        View Invoice
      </Button>

      <ViewInvoiceDialog
        invoice={invoice}
        open={open}
        onOpenChange={setOpen}
        onViewPDF={(inv) => {
          console.log("View PDF:", inv.reference)
          alert(`Opening PDF for ${inv.reference}`)
        }}
        onDownloadPDF={(inv) => {
          console.log("Download PDF:", inv.reference)
          alert(`Downloading PDF for ${inv.reference}`)
        }}
      />

      <div className="text-sm text-muted text-center max-w-xs">
        Click to open the ViewInvoiceDialog
      </div>
    </div>
  )
}

function OpenDialogDemo({ invoice }: { invoice: PartnerInvoice }) {
  const [open, setOpen] = useState(true)

  return (
    <ViewInvoiceDialog
      invoice={invoice}
      open={open}
      onOpenChange={setOpen}
      onViewPDF={(inv) => alert(`View PDF: ${inv.reference}`)}
      onDownloadPDF={(inv) => alert(`Download PDF: ${inv.reference}`)}
    />
  )
}

/**
 * Default dialog with active invoice.
 */
export const Default: Story = {
  render: () => <ViewInvoiceDialogDemo invoice={activeInvoice} />,
}

/**
 * Dialog pre-opened with active invoice.
 */
export const ActiveInvoice: Story = {
  render: () => <OpenDialogDemo invoice={activeInvoice} />,
  parameters: {
    docs: {
      description: {
        story: "Active invoice with success status badge and PDF actions available.",
      },
    },
  },
}

/**
 * Dialog with overdue invoice.
 */
export const OverdueInvoice: Story = {
  render: () => <OpenDialogDemo invoice={overdueInvoice} />,
  parameters: {
    docs: {
      description: {
        story: "Overdue invoice showing warning status.",
      },
    },
  },
}

/**
 * Dialog with pending payment invoice.
 */
export const PendingPayment: Story = {
  render: () => <OpenDialogDemo invoice={pendingInvoice} />,
  parameters: {
    docs: {
      description: {
        story: "Invoice pending payment - awaiting customer payment.",
      },
    },
  },
}

/**
 * Dialog with draft invoice.
 */
export const DraftInvoice: Story = {
  render: () => <OpenDialogDemo invoice={draftInvoice} />,
  parameters: {
    docs: {
      description: {
        story: "Draft invoice - not yet submitted.",
      },
    },
  },
}

/**
 * Dialog with suspended invoice.
 */
export const SuspendedInvoice: Story = {
  render: () => <OpenDialogDemo invoice={suspendedInvoice} />,
  parameters: {
    docs: {
      description: {
        story: "Suspended invoice showing destructive status badge.",
      },
    },
  },
}

/**
 * Dialog with invoice that has no PDF.
 */
export const NoPDF: Story = {
  render: () => <OpenDialogDemo invoice={noPdfInvoice} />,
  parameters: {
    docs: {
      description: {
        story: "Invoice without PDF - shows message that PDF is not available.",
      },
    },
  },
}
