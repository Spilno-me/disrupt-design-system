import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { ViewTenantDialog } from '../../../components/tenants'
import type { Tenant } from '../../../components/tenants'
import { MOCK_TENANTS } from '../../../components/tenants/data/mock-tenants'
import { Button } from '../../../components/ui/button'
import {
  MOLECULE_META,
  moleculeDescription,
  StorySection,
} from '../../_infrastructure'

// =============================================================================
// STORY CONFIGURATION
// =============================================================================

const meta: Meta<typeof ViewTenantDialog> = {
  title: 'Partner/Tenants/ViewTenantDialog',
  component: ViewTenantDialog,
  ...MOLECULE_META,
  parameters: {
    ...MOLECULE_META.parameters,
    docs: {
      description: {
        component: moleculeDescription(`Dialog for viewing tenant details.

## Features
- Displays company name with Building icon
- Status and subscription package badges
- Contact information section
- Subscription details (revenue, users, created date)
- Action buttons: Edit, Suspend/Activate

## UX Pattern
Uses Dialog (centered modal) instead of Sheet per dialog-usage-rules.md:
4-7 display fields = Dialog pattern for quick-scan view-only content.`),
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof ViewTenantDialog>

// =============================================================================
// MOCK DATA
// =============================================================================

const activeTenant = MOCK_TENANTS.find((t) => t.status === 'active' && t.subscriptionPackage === 'enterprise')!
const suspendedTenant = MOCK_TENANTS.find((t) => t.status === 'suspended')!
const overdueTenant = MOCK_TENANTS.find((t) => t.status === 'overdue')!

// =============================================================================
// INTERACTIVE WRAPPER
// =============================================================================

interface DialogWrapperProps {
  tenant: Tenant
  buttonLabel?: string
}

function DialogWrapper({ tenant, buttonLabel = 'View Tenant' }: DialogWrapperProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>{buttonLabel}</Button>
      <ViewTenantDialog
        tenant={tenant}
        open={open}
        onOpenChange={setOpen}
        onEdit={(t) => alert(`Edit: ${t.companyName}`)}
        onSuspend={(t) => alert(`Suspend: ${t.companyName}`)}
        onActivate={(t) => alert(`Activate: ${t.companyName}`)}
      />
    </>
  )
}

// =============================================================================
// STORIES
// =============================================================================

/**
 * Default view - Active enterprise tenant.
 * Click the button to open the dialog.
 */
export const Default: Story = {
  render: () => <DialogWrapper tenant={activeTenant} />,
}

/**
 * Active tenant with Edit and Suspend buttons.
 */
export const ActiveTenant: Story = {
  render: () => <DialogWrapper tenant={activeTenant} buttonLabel="View Active Tenant" />,
}

/**
 * Suspended tenant with Activate button instead of Suspend.
 */
export const SuspendedTenant: Story = {
  render: () => <DialogWrapper tenant={suspendedTenant} buttonLabel="View Suspended Tenant" />,
}

/**
 * Overdue tenant with warning status badge.
 */
export const OverdueTenant: Story = {
  render: () => <DialogWrapper tenant={overdueTenant} buttonLabel="View Overdue Tenant" />,
}

/**
 * Dialog opened by default for documentation screenshots.
 */
export const OpenByDefault: Story = {
  render: () => {
    const [open, setOpen] = React.useState(true)
    return (
      <ViewTenantDialog
        tenant={activeTenant}
        open={open}
        onOpenChange={setOpen}
        onEdit={(t) => alert(`Edit: ${t.companyName}`)}
        onSuspend={(t) => alert(`Suspend: ${t.companyName}`)}
      />
    )
  },
}

/**
 * AllStates - Visual comparison of different tenant statuses.
 */
export const AllStates: Story = {
  render: () => (
    <div className="space-y-8 p-8 bg-page min-h-screen">
      <StorySection title="Active Enterprise Tenant" description="Shows Edit and Suspend buttons">
        <DialogWrapper tenant={activeTenant} buttonLabel="View Active" />
      </StorySection>

      <StorySection title="Suspended Tenant" description="Shows Edit and Activate buttons">
        <DialogWrapper tenant={suspendedTenant} buttonLabel="View Suspended" />
      </StorySection>

      <StorySection title="Overdue Tenant" description="Shows warning status with Edit and Suspend">
        <DialogWrapper tenant={overdueTenant} buttonLabel="View Overdue" />
      </StorySection>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Compare different tenant status states and their available actions.',
      },
    },
  },
}
