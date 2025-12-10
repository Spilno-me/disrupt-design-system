import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Pencil, Eye } from 'lucide-react'
import { Button } from '../../../components/ui/button'
import { EditInvoiceDialog } from '../../../components/partners/invoices/EditInvoiceDialog'
import { InvoicePreviewSheet } from '../../../components/partners/invoices/InvoicePreviewSheet'
import type { Invoice } from '../../../components/partners/invoices/types'

// =============================================================================
// STORY CONFIGURATION
// =============================================================================

const meta: Meta = {
  title: 'Pages/Partner/InvoicesManagement/Dialogs',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# Invoice Dialogs

This showcase demonstrates all the dialog components used in the Invoice Management system.

## Components
- **EditInvoiceDialog**: Edit invoice details like payment terms and notes
- **InvoicePreviewSheet**: Full preview of invoice with line items
        `,
      },
    },
  },
}

export default meta
type Story = StoryObj

// =============================================================================
// MOCK DATA
// =============================================================================

const mockInvoice: Invoice = {
  id: '1',
  invoiceNumber: 'INV-2025-1208-0172',
  status: 'draft',
  invoiceDate: '2025-12-08',
  dueDate: '2026-01-07',
  company: {
    name: 'Fine Goods Corp.',
    address: '233 Orlov Street',
    city: 'New York',
    state: 'NY',
    zip: '09440',
    country: 'US',
    email: 'email@finegoods.io',
    phone: '(155) 580-8934',
  },
  metadata: {
    companySize: 'Enterprise',
    employees: 5011000,
    totalUsers: 670,
    pricingVersion: 'v19-2025-12-08',
  },
  description: 'Tenant provisioning for Fine Goods corp.',
  lineItems: [
    {
      id: 'li-1',
      description: 'Platform Base (ENTERPRISE, Annual)',
      type: 'platform',
      quantity: 1,
      unitPrice: 26000,
      total: 26000,
      metadata: { billingCycle: 'annual', tier: 'Enterprise' },
    },
    {
      id: 'li-2',
      description: 'Premium Process (Annual)',
      type: 'process',
      quantity: 1,
      unitPrice: 3000,
      total: 3000,
      metadata: { billingCycle: 'annual' },
    },
    {
      id: 'li-3',
      description: 'Viewer License (Annual)',
      type: 'license',
      quantity: 400,
      unitPrice: 120,
      total: 48000,
      metadata: { billingCycle: 'annual' },
    },
    {
      id: 'li-4',
      description: 'Contributor License (Annual)',
      type: 'license',
      quantity: 200,
      unitPrice: 360,
      total: 72000,
      metadata: { billingCycle: 'annual' },
    },
    {
      id: 'li-5',
      description: 'Power User License (Annual)',
      type: 'license',
      quantity: 50,
      unitPrice: 720,
      total: 36000,
      metadata: { billingCycle: 'annual' },
    },
    {
      id: 'li-6',
      description: 'Creator License (Annual)',
      type: 'license',
      quantity: 20,
      unitPrice: 1800,
      total: 36000,
      metadata: { billingCycle: 'annual' },
    },
  ],
  subtotal: 221000,
  total: 221000,
  paymentTerms: 'net_30',
  notes:
    'Tenant provisioning for Fine Goods corp. Contact: email@finegoods.io VAT: Article 196 reverse charge applies for EU customers.',
  pdfUrl: '/mock-invoice.pdf',
  createdAt: '2025-12-08T10:00:00Z',
  updatedAt: '2025-12-08T10:00:00Z',
}

const sentInvoice: Invoice = {
  ...mockInvoice,
  id: '2',
  status: 'sent',
  invoiceNumber: 'INV-2025-1027-8234',
}

const paidInvoice: Invoice = {
  ...mockInvoice,
  id: '3',
  status: 'paid',
  invoiceNumber: 'INV-2025-0928-1122',
  total: 150000,
}

// =============================================================================
// EDIT INVOICE DIALOG STORIES
// =============================================================================

function EditInvoiceDialogDemo() {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex flex-col items-center gap-4">
      <h3 className="font-semibold text-primary">Edit Invoice Dialog</h3>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        <Pencil className="w-4 h-4 mr-2" />
        Edit Invoice
      </Button>

      <EditInvoiceDialog
        invoice={mockInvoice}
        open={open}
        onOpenChange={setOpen}
        onSubmit={(data) => {
          console.log('Saving invoice:', data)
          alert('Invoice saved!')
        }}
      />

      <div className="text-sm text-secondary text-center max-w-xs">
        Edit payment terms and notes for draft invoices
      </div>
    </div>
  )
}

export const EditDialog: Story = {
  render: () => <EditInvoiceDialogDemo />,
}

function EditInvoiceDialogOpen() {
  const [open, setOpen] = useState(true)

  return (
    <EditInvoiceDialog
      invoice={mockInvoice}
      open={open}
      onOpenChange={setOpen}
      onSubmit={(data) => {
        console.log('Saving:', data)
        alert('Saved!')
      }}
    />
  )
}

export const EditDialogOpen: Story = {
  render: () => <EditInvoiceDialogOpen />,
}

// =============================================================================
// INVOICE PREVIEW SHEET STORIES
// =============================================================================

function InvoicePreviewSheetDemo() {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex flex-col items-center gap-4">
      <h3 className="font-semibold text-primary">Invoice Preview Sheet</h3>
      <Button variant="accent" onClick={() => setOpen(true)}>
        <Eye className="w-4 h-4 mr-2" />
        Preview Invoice
      </Button>

      <InvoicePreviewSheet
        invoice={mockInvoice}
        open={open}
        onOpenChange={setOpen}
      />

      <div className="text-sm text-secondary text-center max-w-xs">
        Full invoice preview with company details, line items, and totals
      </div>
    </div>
  )
}

export const PreviewSheet: Story = {
  render: () => <InvoicePreviewSheetDemo />,
}

function InvoicePreviewSheetOpen() {
  const [open, setOpen] = useState(true)

  return (
    <InvoicePreviewSheet
      invoice={mockInvoice}
      open={open}
      onOpenChange={setOpen}
    />
  )
}

export const PreviewSheetOpen: Story = {
  render: () => <InvoicePreviewSheetOpen />,
}

function SentInvoicePreview() {
  const [open, setOpen] = useState(true)

  return (
    <InvoicePreviewSheet
      invoice={sentInvoice}
      open={open}
      onOpenChange={setOpen}
    />
  )
}

export const PreviewSheetSent: Story = {
  render: () => <SentInvoicePreview />,
}

function PaidInvoicePreview() {
  const [open, setOpen] = useState(true)

  return (
    <InvoicePreviewSheet
      invoice={paidInvoice}
      open={open}
      onOpenChange={setOpen}
    />
  )
}

export const PreviewSheetPaid: Story = {
  render: () => <PaidInvoicePreview />,
}

// =============================================================================
// ALL DIALOGS SHOWCASE
// =============================================================================

function AllDialogsShowcase() {
  const [editOpen, setEditOpen] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)

  return (
    <div className="flex flex-col items-center gap-8 p-8">
      <h2 className="text-xl font-semibold text-primary">Invoice Dialogs Showcase</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Edit Dialog */}
        <div className="flex flex-col items-center gap-3 p-6 border border-default rounded-lg">
          <div className="w-12 h-12 rounded-lg bg-mutedBg flex items-center justify-center">
            <Pencil className="w-6 h-6 text-secondary" />
          </div>
          <h3 className="font-medium text-primary">Edit Invoice</h3>
          <p className="text-sm text-secondary text-center">
            Modify payment terms and notes
          </p>
          <Button variant="secondary" onClick={() => setEditOpen(true)}>
            Open Dialog
          </Button>
        </div>

        {/* Preview Sheet */}
        <div className="flex flex-col items-center gap-3 p-6 border border-default rounded-lg">
          <div className="w-12 h-12 rounded-lg bg-teal/10 flex items-center justify-center">
            <Eye className="w-6 h-6 text-teal" />
          </div>
          <h3 className="font-medium text-primary">Invoice Preview</h3>
          <p className="text-sm text-secondary text-center">
            Full invoice with line items
          </p>
          <Button variant="accent" onClick={() => setPreviewOpen(true)}>
            Open Sheet
          </Button>
        </div>
      </div>

      <EditInvoiceDialog
        invoice={mockInvoice}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSubmit={(data) => {
          console.log('Save:', data)
          alert('Invoice updated!')
        }}
      />

      <InvoicePreviewSheet
        invoice={mockInvoice}
        open={previewOpen}
        onOpenChange={setPreviewOpen}
      />
    </div>
  )
}

export const AllDialogs: Story = {
  render: () => <AllDialogsShowcase />,
}
