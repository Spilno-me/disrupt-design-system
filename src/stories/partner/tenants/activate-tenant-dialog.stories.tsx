import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { ActivateTenantDialog } from '../../../components/tenants'
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

const meta: Meta<typeof ActivateTenantDialog> = {
  title: 'Partner/Tenants/ActivateTenantDialog',
  component: ActivateTenantDialog,
  ...MOLECULE_META,
  parameters: {
    ...MOLECULE_META.parameters,
    docs: {
      description: {
        component: moleculeDescription(`Confirmation dialog for activating a suspended tenant.

## Features
- Success icon with green background (CheckCircle)
- Clear confirmation message with tenant name
- Impact statement showing users to restore
- Tenant details summary (package, previous revenue, users, contact)
- Cancel and Activate buttons
- Loading state during activation

## UX Pattern
Uses Dialog (centered modal) per dialog-usage-rules.md:
Confirmation dialogs = Dialog pattern for focused positive actions.

## Visual
Uses success variant (green icon/accent button) to indicate positive action.`),
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof ActivateTenantDialog>

// =============================================================================
// MOCK DATA
// =============================================================================

// Create suspended variants for testing
const suspendedEnterprise: Tenant = {
  ...MOCK_TENANTS.find((t) => t.subscriptionPackage === 'enterprise')!,
  status: 'suspended',
  monthlyRevenue: 0,
}

const suspendedProfessional: Tenant = {
  ...MOCK_TENANTS.find((t) => t.subscriptionPackage === 'professional')!,
  status: 'suspended',
  monthlyRevenue: 0,
}

const suspendedSmall: Tenant = {
  ...MOCK_TENANTS.find((t) => t.userCount < 10)!,
  status: 'suspended',
  monthlyRevenue: 0,
}

// =============================================================================
// INTERACTIVE WRAPPER
// =============================================================================

interface DialogWrapperProps {
  tenant: Tenant
  buttonLabel?: string
}

function DialogWrapper({ tenant, buttonLabel = 'Activate Tenant' }: DialogWrapperProps) {
  const [open, setOpen] = React.useState(false)
  const [activating, setActivating] = React.useState(false)

  const handleConfirm = async () => {
    setActivating(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setActivating(false)
    setOpen(false)
    alert(`Activated: ${tenant.companyName}`)
  }

  return (
    <>
      <Button variant="accent" onClick={() => setOpen(true)}>
        {buttonLabel}
      </Button>
      <ActivateTenantDialog
        tenant={tenant}
        open={open}
        onOpenChange={setOpen}
        onConfirm={handleConfirm}
        isActivating={activating}
      />
    </>
  )
}

// =============================================================================
// STORIES
// =============================================================================

/**
 * Default activate confirmation for a suspended enterprise tenant.
 * Click the button to open the dialog.
 */
export const Default: Story = {
  render: () => <DialogWrapper tenant={suspendedEnterprise} />,
}

/**
 * High-impact activation - enterprise tenant with many users to restore.
 */
export const HighImpact: Story = {
  render: () => <DialogWrapper tenant={suspendedEnterprise} buttonLabel="Activate Enterprise (High Impact)" />,
  parameters: {
    docs: {
      description: {
        story: 'Enterprise tenant with 45+ users - shows significant restoration impact.',
      },
    },
  },
}

/**
 * Medium-impact activation - professional tenant.
 */
export const MediumImpact: Story = {
  render: () => <DialogWrapper tenant={suspendedProfessional} buttonLabel="Activate Professional" />,
}

/**
 * Low-impact activation - small tenant with few users.
 */
export const LowImpact: Story = {
  render: () => <DialogWrapper tenant={suspendedSmall} buttonLabel="Activate Small Tenant" />,
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
      <ActivateTenantDialog
        tenant={suspendedEnterprise}
        open={open}
        onOpenChange={setOpen}
        onConfirm={async () => alert('Activated!')}
      />
    )
  },
}

/**
 * Dialog in activating state with disabled buttons.
 */
export const Activating: Story = {
  render: () => {
    const [open, setOpen] = React.useState(true)
    return (
      <ActivateTenantDialog
        tenant={suspendedEnterprise}
        open={open}
        onOpenChange={setOpen}
        onConfirm={async () => {}}
        isActivating={true}
      />
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Dialog during activation - buttons disabled, confirm shows "Activating..."',
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
      <StorySection title="High Impact - Enterprise" description="45+ users to restore">
        <DialogWrapper tenant={suspendedEnterprise} buttonLabel="Activate High Impact" />
      </StorySection>

      <StorySection title="Medium Impact - Professional" description="12-20 users to restore">
        <DialogWrapper tenant={suspendedProfessional} buttonLabel="Activate Medium Impact" />
      </StorySection>

      <StorySection title="Low Impact - Small Tenant" description="<10 users to restore">
        <DialogWrapper tenant={suspendedSmall} buttonLabel="Activate Low Impact" />
      </StorySection>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Compare activation impact across different tenant sizes.',
      },
    },
  },
}
