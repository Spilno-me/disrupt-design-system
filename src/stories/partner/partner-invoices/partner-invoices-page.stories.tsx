import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import {
  PartnerInvoicesPage,
  MOCK_PARTNER_INVOICES,
  MOCK_PARTNER_INVOICES_STATS,
} from "../../../components/partner-invoices"
import type { PartnerInvoice, PartnerInvoicesStats } from "../../../components/partner-invoices"
import { PAGE_META, pageDescription } from "../../_infrastructure"

// =============================================================================
// STORY CONFIGURATION
// =============================================================================

const meta: Meta<typeof PartnerInvoicesPage> = {
  title: "Partner/Invoices/PartnerInvoicesPage",
  component: PartnerInvoicesPage,
  ...PAGE_META,
  parameters: {
    ...PAGE_META.parameters,
    layout: "fullscreen",
    docs: {
      description: {
        component: pageDescription(`Read-only invoice overview page per spec (06_invoices.md).

## Purpose
The **Invoices** page provides a **read-only overview of all generated invoices**
across **Tenant Requests** and **Active Tenants**.

It serves as:
- A fast lookup for sold services and pricing
- A status overview of issued invoices
- A shortcut to view or download invoice documents

This page does **not** manage payments or accounting logic.

## Features
- **PageActionPanel** header with FileText icon
- **Search** by company name or contact person
- **Status Filter** - Multi-select (7 statuses per MVP spec)
- **Data Table** with sortable columns
- **Actions dropdown** (... menu) per row: View, View PDF, Download PDF
- **Pagination** with 10/25/50 page sizes

## Table Columns (per spec)
1. Reference (invoice reference number)
2. Company / Tenant (company name + contact person)
3. Contact (email + phone)
4. Status (badge)
5. Monthly Amount (formatted currency)
6. Annual Amount (formatted currency)
7. Created Date
8. Actions (... dropdown menu)

## Status Types (MVP)
- Draft
- Submitted
- Approved
- Pending Payment
- Active
- Overdue
- Suspended`),
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof PartnerInvoicesPage>

// =============================================================================
// MOCK DATA VARIATIONS
// =============================================================================

const activeInvoices = MOCK_PARTNER_INVOICES.filter((i) => i.status === "active")
const overdueInvoices = MOCK_PARTNER_INVOICES.filter((i) => i.status === "overdue" || i.status === "suspended")
const pendingInvoices = MOCK_PARTNER_INVOICES.filter((i) =>
  ["draft", "submitted", "approved", "pending_payment"].includes(i.status)
)
const fewInvoices = MOCK_PARTNER_INVOICES.slice(0, 5)
const emptyInvoices: PartnerInvoice[] = []

// Custom stats for specific stories
const statsWithHighOverdue: PartnerInvoicesStats = {
  total: { value: 50 },
  pendingPayment: { value: 8, trend: "8", trendDirection: "neutral" },
  active: { value: 25, trend: "50%", trendDirection: "up" },
  overdue: { value: 12, trend: "12", trendDirection: "down" },
}

// =============================================================================
// STORIES
// =============================================================================

/**
 * Default page with all mock invoices and computed stats.
 * Shows search, filters, and full data table.
 */
export const Default: Story = {
  args: {
    invoices: MOCK_PARTNER_INVOICES,
    stats: MOCK_PARTNER_INVOICES_STATS,
  },
}

/**
 * Fully interactive page with all callbacks connected.
 * Try clicking rows, using search, filtering by status.
 */
export const Interactive: Story = {
  render: () => (
    <PartnerInvoicesPage
      invoices={MOCK_PARTNER_INVOICES}
      stats={MOCK_PARTNER_INVOICES_STATS}
      onViewInvoice={(invoice) => console.log("View:", invoice.reference)}
      onViewPDF={(invoice) => {
        console.log("View PDF:", invoice.reference)
        alert(`Opening PDF for ${invoice.reference}`)
      }}
      onDownloadPDF={(invoice) => {
        console.log("Download PDF:", invoice.reference)
        alert(`Downloading PDF for ${invoice.reference}`)
      }}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: `Fully interactive page with all callbacks connected.

**Try these interactions:**
- Use search to find by company or contact name
- Use status filter to narrow results
- Click a row to view invoice details
- Click Actions (⋯) menu → View Invoice / View PDF / Download PDF`,
      },
    },
  },
}

/**
 * Page showing only active invoices.
 */
export const ActiveOnly: Story = {
  args: {
    invoices: activeInvoices,
  },
  parameters: {
    docs: {
      description: {
        story: "Filtered view showing only active invoices. Stats are auto-computed from data.",
      },
    },
  },
}

/**
 * Page showing overdue and suspended invoices - warning scenario.
 */
export const OverdueAndSuspended: Story = {
  args: {
    invoices: overdueInvoices,
    stats: statsWithHighOverdue,
  },
  parameters: {
    docs: {
      description: {
        story: "Dashboard scenario with overdue and suspended invoices. Shows warning states.",
      },
    },
  },
}

/**
 * Page showing pending invoices (pipeline view).
 */
export const PendingPipeline: Story = {
  args: {
    invoices: pendingInvoices,
  },
  parameters: {
    docs: {
      description: {
        story: "View of invoices in the pipeline: Draft → Submitted → Approved → Pending Payment.",
      },
    },
  },
}

/**
 * Page with a small set of invoices.
 */
export const FewInvoices: Story = {
  args: {
    invoices: fewInvoices,
  },
  parameters: {
    docs: {
      description: {
        story: "Page with fewer invoices - pagination not needed.",
      },
    },
  },
}

/**
 * Empty state when no invoices exist.
 */
export const Empty: Story = {
  args: {
    invoices: emptyInvoices,
  },
  parameters: {
    docs: {
      description: {
        story: "Empty state when no invoices exist. Shows helpful message.",
      },
    },
  },
}

/**
 * Loading state during data fetch.
 */
export const Loading: Story = {
  args: {
    invoices: MOCK_PARTNER_INVOICES,
    stats: MOCK_PARTNER_INVOICES_STATS,
    loading: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Table shows loading skeleton while data is being fetched.",
      },
    },
  },
}

/**
 * Page in view-only mode (no action callbacks).
 */
export const ViewOnly: Story = {
  args: {
    invoices: MOCK_PARTNER_INVOICES,
    stats: MOCK_PARTNER_INVOICES_STATS,
    // No callbacks - uses built-in dialog
  },
  parameters: {
    docs: {
      description: {
        story: "Page without external callbacks. Uses built-in ViewInvoiceDialog.",
      },
    },
  },
}
