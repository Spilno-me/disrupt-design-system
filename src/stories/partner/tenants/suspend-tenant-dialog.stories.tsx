import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { SuspendTenantDialog } from '../../../components/tenants'
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

const meta: Meta<typeof SuspendTenantDialog> = {
  title: 'Partner/Tenants/SuspendTenantDialog',
  component: SuspendTenantDialog,
  ...MOLECULE_META,
  parameters: {
    ...MOLECULE_META.parameters,
    docs: {
      description: {
        component: moleculeDescription(`Confirmation dialog for suspending a tenant.

## Features
- Warning icon with yellow background
- Clear confirmation message with tenant name
- Impact statement showing affected user count
- Tenant details summary (package, revenue, users, contact)
- Cancel and Suspend buttons
- Loading state during suspension

## UX Pattern
Uses Dialog (centered modal) per dialog-usage-rules.md:
Confirmation dialogs = Dialog pattern for focused destructive actions.

## Warning
Destructive action - uses warning icon and destructive button variant.`),
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof SuspendTenantDialog>

// =============================================================================
// MOCK DATA
// =============================================================================

const enterpriseTenant = MOCK_TENANTS.find((t) => t.subscriptionPackage === 'enterprise' && t.status === 'active')!
const professionalTenant = MOCK_TENANTS.find((t) => t.subscriptionPackage === 'professional' && t.status === 'active')!
const smallTenant = MOCK_TENANTS.find((t) => t.userCount < 10)!

// =============================================================================
// INTERACTIVE WRAPPER
// =============================================================================

interface DialogWrapperProps {
  tenant: Tenant
  buttonLabel?: string
}

function DialogWrapper({ tenant, buttonLabel = 'Suspend Tenant' }: DialogWrapperProps) {
  const [open, setOpen] = React.useState(false)
  const [suspending, setSuspending] = React.useState(false)

  const handleConfirm = async () => {
    setSuspending(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setSuspending(false)
    setOpen(false)
    alert(`Suspended: ${tenant.companyName}`)
  }

  return (
    <>
      <Button variant="destructive" onClick={() => setOpen(true)}>
        {buttonLabel}
      </Button>
      <SuspendTenantDialog
        tenant={tenant}
        open={open}
        onOpenChange={setOpen}
        onConfirm={handleConfirm}
        isSuspending={suspending}
      />
    </>
  )
}

// =============================================================================
// STORIES
// =============================================================================

/**
 * Default suspend confirmation for an enterprise tenant.
 * Click the button to open the dialog.
 */
export const Default: Story = {
  render: () => <DialogWrapper tenant={enterpriseTenant} />,
}

/**
 * High-impact suspension - enterprise tenant with many users.
 */
export const HighImpact: Story = {
  render: () => <DialogWrapper tenant={enterpriseTenant} buttonLabel="Suspend Enterprise (High Impact)" />,
  parameters: {
    docs: {
      description: {
        story: 'Enterprise tenant with 45+ users - shows significant impact.',
      },
    },
  },
}

/**
 * Medium-impact suspension - professional tenant.
 */
export const MediumImpact: Story = {
  render: () => <DialogWrapper tenant={professionalTenant} buttonLabel="Suspend Professional" />,
}

/**
 * Low-impact suspension - small tenant with few users.
 */
export const LowImpact: Story = {
  render: () => <DialogWrapper tenant={smallTenant} buttonLabel="Suspend Small Tenant" />,
  parameters: {
    docs: {
      description: {
        story: 'Small tenant with fewer than 10 users.',
      },
    },
  },
}

/**
 * Dialog opened by default for documentation screenshots.
 */
export const OpenByDefault: Story = {
  render: () => {
    const [open, setOpen] = React.useState(true)
    return (
      <SuspendTenantDialog
        tenant={enterpriseTenant}
        open={open}
        onOpenChange={setOpen}
        onConfirm={async () => alert('Suspended!')}
      />
    )
  },
}

/**
 * Dialog in suspending state with disabled buttons.
 */
export const Suspending: Story = {
  render: () => {
    const [open, setOpen] = React.useState(true)
    return (
      <SuspendTenantDialog
        tenant={enterpriseTenant}
        open={open}
        onOpenChange={setOpen}
        onConfirm={async () => {}}
        isSuspending={true}
      />
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Dialog during suspension - buttons disabled, confirm shows "Suspending..."',
      },
    },
  },
}

/**
 * AllStates - Visual comparison of different impact levels.
 */
export const AllStates: Story = {
  render: () => (
    <div className="space-y-8 p-8 bg-page min-h-screen">
      <StorySection title="High Impact - Enterprise" description="45+ users affected">
        <DialogWrapper tenant={enterpriseTenant} buttonLabel="Suspend High Impact" />
      </StorySection>

      <StorySection title="Medium Impact - Professional" description="12-20 users affected">
        <DialogWrapper tenant={professionalTenant} buttonLabel="Suspend Medium Impact" />
      </StorySection>

      <StorySection title="Low Impact - Small Tenant" description="<10 users affected">
        <DialogWrapper tenant={smallTenant} buttonLabel="Suspend Low Impact" />
      </StorySection>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Compare suspension impact across different tenant sizes.',
      },
    },
  },
}
