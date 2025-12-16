import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"
import { useState } from "react"
import { DataTable, type ColumnDef } from "../components/ui/DataTable"
import {
  DataTableBadge,
  DataTableActions,
  DataTableMobileCard,
  PARTNER_STATUS_MAP,
  WORKFLOW_STATUS_MAP,
  REQUEST_STATUS_MAP,
  type ActionItem,
} from "../components/ui/table"
import {
  Edit,
  Trash,
  Eye,
  Plus,
  CheckCircle,
  XCircle,
} from "lucide-react"

// =============================================================================
// MOCK DATA
// =============================================================================

interface Partner {
  id: string
  companyName: string
  contactName: string
  contactEmail: string
  status: 'active' | 'inactive' | 'pending' | 'suspended'
  tier: string
  totalLeads: number
  conversionRate: number
  monthlyRevenue: number
}

const MOCK_PARTNERS: Partner[] = [
  {
    id: '1',
    companyName: 'Acme Corporation',
    contactName: 'John Smith',
    contactEmail: 'john@acme.com',
    status: 'active',
    tier: 'Premium',
    totalLeads: 156,
    conversionRate: 0.125,
    monthlyRevenue: 45200,
  },
  {
    id: '2',
    companyName: 'TechStart Inc',
    contactName: 'Sarah Johnson',
    contactEmail: 'sarah@techstart.com',
    status: 'pending',
    tier: 'Standard',
    totalLeads: 89,
    conversionRate: 0.098,
    monthlyRevenue: 12300,
  },
  {
    id: '3',
    companyName: 'Global Solutions Ltd',
    contactName: 'Michael Chen',
    contactEmail: 'michael@globalsolutions.com',
    status: 'active',
    tier: 'Master',
    totalLeads: 245,
    conversionRate: 0.178,
    monthlyRevenue: 78900,
  },
  {
    id: '4',
    companyName: 'Innovation Partners',
    contactName: 'Emily Davis',
    contactEmail: 'emily@innovationpartners.com',
    status: 'suspended',
    tier: 'Standard',
    totalLeads: 34,
    conversionRate: 0.045,
    monthlyRevenue: 5600,
  },
  {
    id: '5',
    companyName: 'NextGen Consulting',
    contactName: 'David Wilson',
    contactEmail: 'david@nextgen.com',
    status: 'inactive',
    tier: 'Starter',
    totalLeads: 12,
    conversionRate: 0.067,
    monthlyRevenue: 2100,
  },
]

// =============================================================================
// STORY META
// =============================================================================

const meta: Meta<typeof DataTable<Partner>> = {
  title: 'Shared/Data/DataTable Patterns',
  component: DataTable,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
# Unified DataTable System

Complete data table solution with composable sub-components:

## Components

- **DataTable** - Core table with sorting, selection, loading states
- **DataTableBadge** - Standardized status badges using design tokens
- **DataTableActions** - Action buttons with overflow menu and permissions
- **DataTableMobileCard** - Mobile-optimized card view

## Key Features

✅ **100% Token-Based** - Zero hardcoded colors or values
✅ **Mobile Responsive** - Auto-switches to card view on mobile
✅ **Permission-Based** - Built-in RBAC support
✅ **Consistent Actions** - Standard pattern across all tables
✅ **Accessible** - Tooltips, keyboard nav, ARIA labels
✅ **Composable** - Mix and match for any use case

## Philosophy

**Composition over Configuration** - Build from small, focused components instead of a monolithic table with 100 props.
        `,
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// =============================================================================
// STORIES
// =============================================================================

/**
 * Complete unified example showing all features working together
 */
export const UnifiedExample: Story = {
  name: "Unified Partner Table",
  render: () => {
    const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
    const [mockUser] = useState({ role: 'admin', isAdmin: true })

    // Define actions using unified pattern
    const actions: ActionItem<Partner>[] = [
      {
        id: 'view',
        label: 'View Details',
        icon: Eye,
        onClick: (row) => alert(`Viewing ${row.companyName}`),
      },
      {
        id: 'edit',
        label: 'Edit Partner',
        icon: Edit,
        onClick: (row) => alert(`Editing ${row.companyName}`),
        requires: 'admin',
      },
      {
        id: 'add-sub',
        label: 'Add Sub-Partner',
        icon: Plus,
        onClick: (row) => alert(`Adding sub-partner to ${row.companyName}`),
      },
      {
        id: 'approve',
        label: 'Approve Partner',
        icon: CheckCircle,
        onClick: (row) => alert(`Approving ${row.companyName}`),
        showWhen: (row) => row.status === 'pending',
        variant: 'accent',
      },
      {
        id: 'suspend',
        label: 'Suspend Partner',
        icon: XCircle,
        onClick: (row) => alert(`Suspending ${row.companyName}`),
        showWhen: (row) => row.status === 'active',
        confirm: 'Are you sure you want to suspend this partner? This will affect their access.',
      },
      {
        id: 'delete',
        label: 'Delete Partner',
        icon: Trash,
        onClick: (row) => alert(`Deleting ${row.companyName}`),
        variant: 'destructive',
        requires: 'admin',
        confirm: true,
      },
    ]

    // Define columns using unified components
    const columns: ColumnDef<Partner>[] = [
      {
        id: 'company',
        header: 'Company',
        accessor: (row) => (
          <div>
            <div className="font-semibold text-primary">{row.companyName}</div>
            <div className="text-sm text-secondary">{row.contactName}</div>
          </div>
        ),
        sortable: true,
        minWidth: '200px',
      },
      {
        id: 'contact',
        header: 'Email',
        accessor: (row) => (
          <div className="text-sm text-secondary">{row.contactEmail}</div>
        ),
        minWidth: '180px',
      },
      {
        id: 'tier',
        header: 'Tier',
        accessor: (row) => (
          <div className="text-sm text-primary font-medium">{row.tier}</div>
        ),
        sortable: true,
        width: '120px',
      },
      {
        id: 'status',
        header: 'Status',
        accessor: (row) => (
          <DataTableBadge status={row.status} mapping={PARTNER_STATUS_MAP} />
        ),
        sortable: true,
        width: '120px',
      },
      {
        id: 'leads',
        header: 'Leads',
        accessor: (row) => (
          <div className="text-sm font-medium text-primary text-center">
            {row.totalLeads}
          </div>
        ),
        sortable: true,
        width: '80px',
        align: 'center',
      },
      {
        id: 'conversion',
        header: 'Conversion',
        accessor: (row) => (
          <div className="text-sm font-medium text-primary text-center">
            {(row.conversionRate * 100).toFixed(1)}%
          </div>
        ),
        sortable: true,
        width: '110px',
        align: 'center',
      },
      {
        id: 'revenue',
        header: 'Monthly Revenue',
        accessor: (row) => (
          <div className="text-sm font-medium text-primary text-right">
            {formatCurrency(row.monthlyRevenue)}
          </div>
        ),
        sortable: true,
        width: '150px',
        align: 'right',
      },
      {
        id: 'actions',
        header: 'Actions',
        accessor: (row) => (
          <DataTableActions
            actions={actions}
            row={row}
            user={mockUser}
            maxVisible={2}
            align="right"
          />
        ),
        width: '120px',
        align: 'right',
        sticky: 'right',
      },
    ]

    return (
      <div className="space-y-4 p-6">
        <div>
          <h2 className="text-2xl font-bold text-primary mb-2">Partner Management</h2>
          <p className="text-sm text-secondary">
            Unified DataTable with standardized actions, status badges, and mobile support
          </p>
        </div>

        <DataTable
          data={MOCK_PARTNERS}
          columns={columns}
          getRowId={(row) => row.id}
          selectable
          selectedRows={selectedRows}
          onSelectionChange={setSelectedRows}
          stickyHeader
          hoverable
          bordered
          onRowClick={(row) => alert(`Clicked: ${row.companyName}`)}
        />

        {selectedRows.size > 0 && (
          <div className="text-sm text-secondary">
            Selected: {selectedRows.size} partner(s)
          </div>
        )}
      </div>
    )
  },
}

/**
 * DataTableBadge showcase - all status mappings
 */
export const BadgeShowcase: Story = {
  name: "Badge Variants",
  render: () => (
    <div className="space-y-8 p-6">
      <div>
        <h3 className="font-semibold text-primary mb-4">Partner Status</h3>
        <div className="flex gap-3 flex-wrap">
          <DataTableBadge status="active" mapping={PARTNER_STATUS_MAP} />
          <DataTableBadge status="inactive" mapping={PARTNER_STATUS_MAP} />
          <DataTableBadge status="pending" mapping={PARTNER_STATUS_MAP} />
          <DataTableBadge status="suspended" mapping={PARTNER_STATUS_MAP} />
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-primary mb-4">Workflow Status</h3>
        <div className="flex gap-3 flex-wrap">
          <DataTableBadge status="draft" mapping={WORKFLOW_STATUS_MAP} />
          <DataTableBadge status="submitted" mapping={WORKFLOW_STATUS_MAP} />
          <DataTableBadge status="approved" mapping={WORKFLOW_STATUS_MAP} />
          <DataTableBadge status="rejected" mapping={WORKFLOW_STATUS_MAP} />
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-primary mb-4">Request Status</h3>
        <div className="flex gap-3 flex-wrap">
          <DataTableBadge status="pending" mapping={REQUEST_STATUS_MAP} />
          <DataTableBadge status="processing" mapping={REQUEST_STATUS_MAP} />
          <DataTableBadge status="completed" mapping={REQUEST_STATUS_MAP} />
          <DataTableBadge status="failed" mapping={REQUEST_STATUS_MAP} />
        </div>
      </div>
    </div>
  ),
}

/**
 * DataTableActions showcase - different configurations
 */
export const ActionsShowcase: Story = {
  name: "Action Patterns",
  render: () => {
    const mockPartner = MOCK_PARTNERS[0]
    const mockUser = { role: 'admin', isAdmin: true }

    const basicActions: ActionItem<Partner>[] = [
      { id: 'view', label: 'View', icon: Eye, onClick: () => alert('View') },
      { id: 'edit', label: 'Edit', icon: Edit, onClick: () => alert('Edit') },
    ]

    const manyActions: ActionItem<Partner>[] = [
      { id: 'view', label: 'View', icon: Eye, onClick: () => alert('View') },
      { id: 'edit', label: 'Edit', icon: Edit, onClick: () => alert('Edit') },
      { id: 'add', label: 'Add Sub', icon: Plus, onClick: () => alert('Add') },
      { id: 'approve', label: 'Approve', icon: CheckCircle, onClick: () => alert('Approve'), variant: 'accent' },
      { id: 'delete', label: 'Delete', icon: Trash, onClick: () => alert('Delete'), variant: 'destructive' },
    ]

    return (
      <div className="space-y-8 p-6">
        <div>
          <h3 className="font-semibold text-primary mb-4">Basic Actions (2 buttons)</h3>
          <DataTableActions
            actions={basicActions}
            row={mockPartner}
            user={mockUser}
          />
        </div>

        <div>
          <h3 className="font-semibold text-primary mb-4">Many Actions (2 visible + overflow menu)</h3>
          <DataTableActions
            actions={manyActions}
            row={mockPartner}
            user={mockUser}
            maxVisible={2}
          />
        </div>

        <div>
          <h3 className="font-semibold text-primary mb-4">With Labels (Mobile Layout)</h3>
          <DataTableActions
            actions={manyActions}
            row={mockPartner}
            user={mockUser}
            maxVisible={3}
            showLabels
            layout="vertical"
          />
        </div>
      </div>
    )
  },
}

/**
 * Mobile card view
 */
export const MobileCardExample: Story = {
  name: "Mobile Card View",
  render: () => (
    <div className="space-y-4 p-6 max-w-md">
      {MOCK_PARTNERS.slice(0, 3).map(partner => (
        <DataTableMobileCard
          key={partner.id}
          title={partner.companyName}
          subtitle={partner.contactEmail}
          status={<DataTableBadge status={partner.status} mapping={PARTNER_STATUS_MAP} />}
          fields={[
            { label: 'Contact', value: partner.contactName },
            { label: 'Tier', value: partner.tier, primary: true },
            { label: 'Leads', value: partner.totalLeads },
            { label: 'Conversion', value: `${(partner.conversionRate * 100).toFixed(1)}%` },
            { label: 'Revenue', value: formatCurrency(partner.monthlyRevenue), primary: true },
          ]}
          actions={[
            { id: 'view', label: 'View', icon: Eye, onClick: () => alert('View') },
            { id: 'edit', label: 'Edit', icon: Edit, onClick: () => alert('Edit') },
            { id: 'delete', label: 'Delete', icon: Trash, onClick: () => alert('Delete'), variant: 'destructive' },
          ]}
          row={partner}
          user={{ role: 'admin' }}
          onTap={() => alert(`Tapped: ${partner.companyName}`)}
        />
      ))}
    </div>
  ),
}

/**
 * Complete responsive example
 */
export const ResponsiveComplete: Story = {
  name: "Complete Responsive Example",
  render: () => {
    const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
    const mockUser = { role: 'admin', isAdmin: true }

    const actions: ActionItem<Partner>[] = [
      { id: 'edit', label: 'Edit', icon: Edit, onClick: () => alert('Edit'), requires: 'admin' },
      { id: 'add', label: 'Add Sub-Partner', icon: Plus, onClick: () => alert('Add Sub') },
      { id: 'delete', label: 'Delete', icon: Trash, onClick: () => alert('Delete'), variant: 'destructive', requires: 'admin', confirm: true },
    ]

    const columns: ColumnDef<Partner>[] = [
      {
        id: 'company',
        header: 'Company',
        accessor: (row) => (
          <div>
            <div className="font-semibold text-primary">{row.companyName}</div>
            <div className="text-sm text-secondary">{row.contactName}</div>
          </div>
        ),
        sortable: true,
        minWidth: '200px',
      },
      {
        id: 'status',
        header: 'Status',
        accessor: (row) => <DataTableBadge status={row.status} mapping={PARTNER_STATUS_MAP} />,
        sortable: true,
        width: '120px',
      },
      {
        id: 'revenue',
        header: 'Revenue',
        accessor: (row) => (
          <div className="text-sm font-medium text-primary text-right">
            {formatCurrency(row.monthlyRevenue)}
          </div>
        ),
        sortable: true,
        width: '130px',
        align: 'right',
      },
      {
        id: 'actions',
        header: 'Actions',
        accessor: (row) => (
          <DataTableActions
            actions={actions}
            row={row}
            user={mockUser}
            maxVisible={2}
          />
        ),
        width: '120px',
        align: 'right',
        sticky: 'right',
      },
    ]

    return (
      <div className="space-y-4 p-6">
        <div>
          <h2 className="text-2xl font-bold text-primary mb-2">Partner Management</h2>
          <p className="text-sm text-secondary mb-4">
            This table demonstrates the unified system with token-based styling, standardized actions, and mobile responsiveness.
            Try resizing your browser window to see the mobile card view.
          </p>
          <p className="text-xs text-tertiary">
            💡 <strong>Tip:</strong> All colors from design tokens. All patterns consistent. Zero hardcoded values.
          </p>
        </div>

        <DataTable
          data={MOCK_PARTNERS}
          columns={columns}
          getRowId={(row) => row.id}
          selectable
          selectedRows={selectedRows}
          onSelectionChange={setSelectedRows}
          stickyHeader
          hoverable
          bordered
        />

        {selectedRows.size > 0 && (
          <div className="p-4 bg-accent-bg border border-accent rounded-lg">
            <p className="text-sm font-medium text-primary">
              {selectedRows.size} partner(s) selected
            </p>
          </div>
        )}
      </div>
    )
  },
}
