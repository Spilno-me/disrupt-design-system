import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { InvoiceDetailPage, type InvoiceFormData, type InvoicePageMode } from '../../../components/partners/invoices/pages'
import type { Invoice } from '../../../components/partners/invoices/types'
import { PAGE_META, pageDescription } from '../../_infrastructure'

// =============================================================================
// STORY CONFIGURATION
// =============================================================================

const meta: Meta<typeof InvoiceDetailPage> = {
  title: 'Partner/Pages/InvoiceDetailPage',
  component: InvoiceDetailPage,
  ...PAGE_META,
  parameters: {
    ...PAGE_META.parameters,
    layout: 'fullscreen',
    docs: {
      description: {
        component: pageDescription(`Full-page invoice detail view with view/edit mode toggle.

## Features
- **View Mode**: Read-only display of invoice details with all sections
- **Edit Mode**: Editable form for draft invoices (company info, dates, line items)
- **Mode Toggle**: Seamless switching between view and edit modes
- **Section Cards**: Bill To, Invoice Details, Metadata, Totals, Line Items, Notes
- **Responsive**: Mobile-first design with adaptive layout

## Usage
Replaces InvoicePreviewSheet (view) and EditInvoiceDialog (edit) for better UX on complex forms.

## Navigation
- Back button returns to invoice list
- Edit button switches to edit mode (draft invoices only)
- Save button submits changes and returns to view mode
- Cancel button discards changes and returns to view mode`),
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof InvoiceDetailPage>

// =============================================================================
// MOCK DATA
// =============================================================================

const mockDraftInvoice: Invoice = {
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
    employees: 5011,
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

const mockSentInvoice: Invoice = {
  ...mockDraftInvoice,
  id: '2',
  status: 'sent',
  invoiceNumber: 'INV-2025-1027-8234',
}

const mockPaidInvoice: Invoice = {
  ...mockDraftInvoice,
  id: '3',
  status: 'paid',
  invoiceNumber: 'INV-2025-0928-1122',
}

const mockOverdueInvoice: Invoice = {
  ...mockDraftInvoice,
  id: '4',
  status: 'overdue',
  invoiceNumber: 'INV-2025-0815-5544',
  dueDate: '2025-09-15',
}

const mockMinimalInvoice: Invoice = {
  id: '5',
  invoiceNumber: 'INV-2025-1215-0001',
  status: 'draft',
  invoiceDate: '2025-12-15',
  dueDate: '2026-01-15',
  company: {
    name: 'Minimal Corp',
    email: 'contact@minimal.com',
  },
  lineItems: [
    {
      id: 'li-1',
      description: 'Basic Service',
      type: 'platform',
      quantity: 1,
      unitPrice: 1000,
      total: 1000,
    },
  ],
  subtotal: 1000,
  total: 1000,
  paymentTerms: 'net_30',
  createdAt: '2025-12-15T10:00:00Z',
  updatedAt: '2025-12-15T10:00:00Z',
}

// =============================================================================
// VIEW MODE STORIES
// =============================================================================

function ViewModeDemo() {
  const handleSubmit = async (data: InvoiceFormData) => {
    console.log('Form submitted:', data)
    alert('Invoice updated!')
  }

  const handleBack = () => {
    alert('Back to invoices list')
  }

  const handleDownloadPDF = (invoice: Invoice) => {
    alert(`Downloading PDF for ${invoice.invoiceNumber}`)
  }

  return (
    <InvoiceDetailPage
      invoice={mockDraftInvoice}
      mode="view"
      onSubmit={handleSubmit}
      onBack={handleBack}
      onDownloadPDF={handleDownloadPDF}
    />
  )
}

export const ViewMode: Story = {
  render: () => <ViewModeDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Default view mode displaying all invoice details in read-only format.',
      },
    },
  },
}

// =============================================================================
// EDIT MODE STORIES
// =============================================================================

function EditModeDemo() {
  const handleSubmit = async (data: InvoiceFormData) => {
    console.log('Form submitted:', data)
    alert('Invoice saved!')
  }

  const handleBack = () => {
    alert('Back to invoices list')
  }

  return (
    <InvoiceDetailPage
      invoice={mockDraftInvoice}
      mode="edit"
      onSubmit={handleSubmit}
      onBack={handleBack}
    />
  )
}

export const EditMode: Story = {
  render: () => <EditModeDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Edit mode for draft invoices with editable company info, dates, and line items.',
      },
    },
  },
}

// =============================================================================
// MODE TOGGLE STORY
// =============================================================================

function ModeToggleDemo() {
  const [mode, setMode] = useState<InvoicePageMode>('view')

  const handleSubmit = async (data: InvoiceFormData) => {
    console.log('Form submitted:', data)
    setMode('view')
    alert('Invoice saved!')
  }

  const handleBack = () => {
    alert('Back to invoices list')
  }

  return (
    <InvoiceDetailPage
      invoice={mockDraftInvoice}
      mode={mode}
      onSubmit={handleSubmit}
      onBack={handleBack}
      onModeChange={setMode}
    />
  )
}

export const ModeToggle: Story = {
  render: () => <ModeToggleDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Interactive demo showing mode toggle between view and edit. Click Edit button to switch to edit mode.',
      },
    },
  },
}

// =============================================================================
// STATUS VARIANT STORIES
// =============================================================================

function SentInvoiceDemo() {
  return (
    <InvoiceDetailPage
      invoice={mockSentInvoice}
      mode="view"
      onSubmit={async () => {}}
      onBack={() => alert('Back')}
    />
  )
}

export const SentInvoice: Story = {
  render: () => <SentInvoiceDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Sent invoice status - Edit button is not available for non-draft invoices.',
      },
    },
  },
}

function PaidInvoiceDemo() {
  return (
    <InvoiceDetailPage
      invoice={mockPaidInvoice}
      mode="view"
      onSubmit={async () => {}}
      onBack={() => alert('Back')}
    />
  )
}

export const PaidInvoice: Story = {
  render: () => <PaidInvoiceDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Paid invoice status with success styling.',
      },
    },
  },
}

function OverdueInvoiceDemo() {
  return (
    <InvoiceDetailPage
      invoice={mockOverdueInvoice}
      mode="view"
      onSubmit={async () => {}}
      onBack={() => alert('Back')}
    />
  )
}

export const OverdueInvoice: Story = {
  render: () => <OverdueInvoiceDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Overdue invoice status with error styling.',
      },
    },
  },
}

// =============================================================================
// MINIMAL DATA STORY
// =============================================================================

function MinimalDataDemo() {
  const [mode, setMode] = useState<InvoicePageMode>('view')

  return (
    <InvoiceDetailPage
      invoice={mockMinimalInvoice}
      mode={mode}
      onSubmit={async (data) => {
        console.log('Saved:', data)
        setMode('view')
      }}
      onBack={() => alert('Back')}
      onModeChange={setMode}
    />
  )
}

export const MinimalData: Story = {
  render: () => <MinimalDataDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Invoice with minimal data - no metadata, notes, or description. Shows graceful handling of optional fields.',
      },
    },
  },
}

// =============================================================================
// LOADING STATE STORY
// =============================================================================

function SubmittingDemo() {
  return (
    <InvoiceDetailPage
      invoice={mockDraftInvoice}
      mode="edit"
      onSubmit={async () => {
        await new Promise((resolve) => setTimeout(resolve, 3000))
      }}
      onBack={() => alert('Back')}
      isSubmitting={true}
    />
  )
}

export const Submitting: Story = {
  render: () => <SubmittingDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Edit mode with submitting state - Save button shows loading state.',
      },
    },
  },
}

// =============================================================================
// NO INVOICE STORY
// =============================================================================

function NoInvoiceDemo() {
  return (
    <InvoiceDetailPage
      invoice={null}
      mode="view"
      onSubmit={async () => {}}
      onBack={() => alert('Back to list')}
    />
  )
}

export const NoInvoice: Story = {
  render: () => <NoInvoiceDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Empty state when no invoice is selected.',
      },
    },
  },
}
