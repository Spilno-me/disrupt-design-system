import * as React from 'react'
import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { ChangeStatusDialog } from '../../../components/tenants/ChangeStatusDialog'
import { MOCK_TENANTS } from '../../../components/tenants'
import type { Tenant, ChangeStatusFormData } from '../../../components/tenants'
import { Button } from '../../../components/ui/button'
import {
  ORGANISM_META,
  organismDescription,
} from '../../_infrastructure'

// =============================================================================
// STORY CONFIGURATION
// =============================================================================

const meta: Meta<typeof ChangeStatusDialog> = {
  title: 'Partner/Tenants/ChangeStatusDialog',
  component: ChangeStatusDialog,
  ...ORGANISM_META,
  parameters: {
    ...ORGANISM_META.parameters,
    docs: {
      description: {
        component: organismDescription(`Unified modal for changing tenant status (per spec Section 11).

## Features
- **Status dropdown** - Active, Overdue, Suspended options
- **Note field** - Optional reason/internal note (max 1000 chars)
- **Suspension warning** - Shows when switching TO suspended status
- **Smart button** - Destructive variant when suspending, disabled until change

## Behavior
- Pre-selects current tenant status
- Save disabled until status actually changes
- Warning appears only when switching TO suspended (not when already suspended)
- Loading state prevents double-submit`),
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof ChangeStatusDialog>

// =============================================================================
// MOCK DATA
// =============================================================================

const activeTenant = MOCK_TENANTS.find((t) => t.status === 'active')!
const suspendedTenant = MOCK_TENANTS.find((t) => t.status === 'suspended')!
const overdueTenant = MOCK_TENANTS.find((t) => t.status === 'overdue')!

// =============================================================================
// INTERACTIVE WRAPPER
// =============================================================================

function InteractiveWrapper({ tenant }: { tenant: Tenant }) {
  const [open, setOpen] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleConfirm = async (t: Tenant, data: ChangeStatusFormData) => {
    setIsSubmitting(true)
    console.log('Change status:', t.companyName, data)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSubmitting(false)
    setOpen(false)
    alert(`Status changed to: ${data.status}${data.note ? `\nNote: ${data.note}` : ''}`)
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Dialog</Button>
      <ChangeStatusDialog
        open={open}
        onOpenChange={setOpen}
        tenant={tenant}
        onConfirm={handleConfirm}
        isSubmitting={isSubmitting}
      />
    </>
  )
}

// =============================================================================
// STORIES
// =============================================================================

/**
 * Default dialog with an active tenant.
 */
export const Default: Story = {
  render: () => <InteractiveWrapper tenant={activeTenant} />,
}

/**
 * Dialog for an active tenant - shows suspension warning when Suspended is selected.
 */
export const ActiveTenant: Story = {
  render: () => <InteractiveWrapper tenant={activeTenant} />,
  parameters: {
    docs: {
      description: {
        story: 'Active tenant. Select "Suspended" to see the warning message appear.',
      },
    },
  },
}

/**
 * Dialog for a suspended tenant - no warning needed (already suspended).
 */
export const SuspendedTenant: Story = {
  render: () => <InteractiveWrapper tenant={suspendedTenant} />,
  parameters: {
    docs: {
      description: {
        story: 'Suspended tenant. Can be reactivated to Active. No warning shown since already suspended.',
      },
    },
  },
}

/**
 * Dialog for an overdue tenant.
 */
export const OverdueTenant: Story = {
  render: () => <InteractiveWrapper tenant={overdueTenant} />,
  parameters: {
    docs: {
      description: {
        story: 'Overdue tenant. Common workflow: change to Active after payment received, or Suspended if unresolved.',
      },
    },
  },
}

/**
 * Dialog in loading/submitting state.
 */
export const Submitting: Story = {
  args: {
    open: true,
    tenant: activeTenant,
    isSubmitting: true,
    onOpenChange: () => {},
    onConfirm: async () => {},
  },
  parameters: {
    docs: {
      description: {
        story: 'Loading state while status change is being processed. Buttons are disabled.',
      },
    },
  },
}
