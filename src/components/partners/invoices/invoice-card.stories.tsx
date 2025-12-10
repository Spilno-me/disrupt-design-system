import type { Meta, StoryObj } from '@storybook/react'
import { InvoiceCard } from './InvoiceCard'
import type { Invoice, InvoiceAction } from './types'

const meta: Meta<typeof InvoiceCard> = {
  title: 'Partner/Invoices/InvoiceCard',
  component: InvoiceCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# Invoice Card

A mobile-friendly card component for displaying invoice information.

## Features
- Status badge with color coding
- Invoice number and company name
- Total amount with line item count
- Invoice and due dates
- Payment terms badge
- Action dropdown menu
- Draft invoices have dashed border
        `,
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-[360px]">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof InvoiceCard>

// =============================================================================
// BASE INVOICE DATA
// =============================================================================

const baseInvoice: Invoice = {
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
  description: 'Tenant provisioning for Fine Goods corp.',
  lineItems: [
    {
      id: 'li-1',
      description: 'Platform Base (ENTERPRISE, Annual)',
      type: 'platform',
      quantity: 1,
      unitPrice: 26000,
      total: 26000,
    },
    {
      id: 'li-2',
      description: 'Viewer License (Annual)',
      type: 'license',
      quantity: 400,
      unitPrice: 120,
      total: 48000,
    },
  ],
  subtotal: 74000,
  total: 74000,
  paymentTerms: 'net_30',
  createdAt: '2025-12-08T10:00:00Z',
  updatedAt: '2025-12-08T10:00:00Z',
}

// =============================================================================
// STORIES
// =============================================================================

export const Default: Story = {
  args: {
    invoice: baseInvoice,
    onClick: (invoice) => console.log('Invoice clicked:', invoice),
    onActionClick: (invoice, action) => console.log('Action:', action, invoice),
  },
}

export const Draft: Story = {
  args: {
    invoice: {
      ...baseInvoice,
      status: 'draft',
    },
    onClick: (invoice) => console.log('Invoice clicked:', invoice),
    onActionClick: (invoice, action) => console.log('Action:', action, invoice),
  },
}

export const Sent: Story = {
  args: {
    invoice: {
      ...baseInvoice,
      status: 'sent',
    },
    onClick: (invoice) => console.log('Invoice clicked:', invoice),
    onActionClick: (invoice, action) => console.log('Action:', action, invoice),
  },
}

export const Paid: Story = {
  args: {
    invoice: {
      ...baseInvoice,
      status: 'paid',
    },
    onClick: (invoice) => console.log('Invoice clicked:', invoice),
  },
}

export const Overdue: Story = {
  args: {
    invoice: {
      ...baseInvoice,
      status: 'overdue',
      invoiceDate: '2025-10-15',
      dueDate: '2025-11-14',
    },
    onClick: (invoice) => console.log('Invoice clicked:', invoice),
  },
}

export const PartiallyPaid: Story = {
  args: {
    invoice: {
      ...baseInvoice,
      status: 'partially_paid',
    },
    onClick: (invoice) => console.log('Invoice clicked:', invoice),
  },
}

export const HighValue: Story = {
  args: {
    invoice: {
      ...baseInvoice,
      total: 250000,
      lineItems: [
        ...baseInvoice.lineItems,
        {
          id: 'li-3',
          description: 'Creator License (Annual)',
          type: 'license',
          quantity: 100,
          unitPrice: 1800,
          total: 180000,
        },
      ],
    },
    onClick: (invoice) => console.log('Invoice clicked:', invoice),
  },
}

export const ZeroValue: Story = {
  args: {
    invoice: {
      ...baseInvoice,
      total: 0,
      subtotal: 0,
      lineItems: [
        {
          id: 'li-1',
          description: 'Platform Base (Starter, Annual)',
          type: 'platform',
          quantity: 0,
          unitPrice: 0,
          total: 0,
        },
      ],
    },
    onClick: (invoice) => console.log('Invoice clicked:', invoice),
  },
}

export const LongCompanyName: Story = {
  args: {
    invoice: {
      ...baseInvoice,
      company: {
        ...baseInvoice.company,
        name: 'International Manufacturing & Distribution Solutions Corporation Ltd.',
      },
    },
    onClick: (invoice) => console.log('Invoice clicked:', invoice),
  },
}

export const WithDescription: Story = {
  args: {
    invoice: {
      ...baseInvoice,
      description:
        'Annual enterprise agreement including platform access, premium support, and 670 user licenses across multiple departments.',
    },
    onClick: (invoice) => console.log('Invoice clicked:', invoice),
  },
}

export const Net60PaymentTerms: Story = {
  args: {
    invoice: {
      ...baseInvoice,
      paymentTerms: 'net_60',
    },
    onClick: (invoice) => console.log('Invoice clicked:', invoice),
  },
}

export const DueOnReceipt: Story = {
  args: {
    invoice: {
      ...baseInvoice,
      paymentTerms: 'due_on_receipt',
    },
    onClick: (invoice) => console.log('Invoice clicked:', invoice),
  },
}

export const ManyLineItems: Story = {
  args: {
    invoice: {
      ...baseInvoice,
      lineItems: [
        {
          id: 'li-1',
          description: 'Platform Base (ENTERPRISE, Annual)',
          type: 'platform',
          quantity: 1,
          unitPrice: 26000,
          total: 26000,
        },
        {
          id: 'li-2',
          description: 'Premium Process (Annual)',
          type: 'process',
          quantity: 1,
          unitPrice: 3000,
          total: 3000,
        },
        {
          id: 'li-3',
          description: 'Viewer License (Annual)',
          type: 'license',
          quantity: 400,
          unitPrice: 120,
          total: 48000,
        },
        {
          id: 'li-4',
          description: 'Contributor License (Annual)',
          type: 'license',
          quantity: 200,
          unitPrice: 360,
          total: 72000,
        },
        {
          id: 'li-5',
          description: 'Power User License (Annual)',
          type: 'license',
          quantity: 50,
          unitPrice: 720,
          total: 36000,
        },
        {
          id: 'li-6',
          description: 'Creator License (Annual)',
          type: 'license',
          quantity: 20,
          unitPrice: 1800,
          total: 36000,
        },
      ],
      total: 221000,
    },
    onClick: (invoice) => console.log('Invoice clicked:', invoice),
  },
}

export const GridView: Story = {
  render: () => (
    <div className="grid grid-cols-1 gap-4 w-[800px]">
      <div className="grid grid-cols-2 gap-4">
        <InvoiceCard
          invoice={baseInvoice}
          onClick={(invoice) => console.log('Clicked:', invoice)}
        />
        <InvoiceCard
          invoice={{ ...baseInvoice, id: '2', status: 'sent', invoiceNumber: 'INV-2025-1207-0234' }}
          onClick={(invoice) => console.log('Clicked:', invoice)}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <InvoiceCard
          invoice={{
            ...baseInvoice,
            id: '3',
            status: 'paid',
            invoiceNumber: 'INV-2025-1206-0189',
            total: 150000,
          }}
          onClick={(invoice) => console.log('Clicked:', invoice)}
        />
        <InvoiceCard
          invoice={{
            ...baseInvoice,
            id: '4',
            status: 'overdue',
            invoiceNumber: 'INV-2025-1015-0567',
            invoiceDate: '2025-10-15',
            dueDate: '2025-11-14',
            total: 25000,
          }}
          onClick={(invoice) => console.log('Clicked:', invoice)}
        />
      </div>
    </div>
  ),
}

export const AllStatuses: Story = {
  render: () => (
    <div className="space-y-4 w-[360px]">
      {(['draft', 'sent', 'paid', 'overdue', 'partially_paid'] as const).map((status, index) => (
        <InvoiceCard
          key={status}
          invoice={{
            ...baseInvoice,
            id: String(index + 1),
            status,
            invoiceNumber: `INV-2025-${status.toUpperCase()}-${String(index + 1).padStart(4, '0')}`,
          }}
          onClick={(invoice) => console.log('Clicked:', invoice)}
        />
      ))}
    </div>
  ),
}
