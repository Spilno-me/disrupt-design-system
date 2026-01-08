import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { EditTenantDialog } from '../../../components/tenants'
import type { Tenant, TenantFormData } from '../../../components/tenants'
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

const meta: Meta<typeof EditTenantDialog> = {
  title: 'Partner/Tenants/EditTenantDialog',
  component: EditTenantDialog,
  ...MOLECULE_META,
  parameters: {
    ...MOLECULE_META.parameters,
    docs: {
      description: {
        component: moleculeDescription(`Form dialog for editing tenant details.

## Features
- Company Information section (company name, subscription package)
- Contact Information section (contact name, contact email)
- Form validation with error messages
- Cancel and Update buttons
- Loading state during submission

## Form Fields (4 total)
- Company Name (required)
- Subscription Package (dropdown: starter/professional/enterprise)
- Contact Name (required)
- Contact Email (required, email validation)

## UX Pattern
Uses Dialog (centered modal) per dialog-usage-rules.md:
4 editable fields = Dialog pattern for focused form editing.`),
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof EditTenantDialog>

// =============================================================================
// MOCK DATA
// =============================================================================

const enterpriseTenant = MOCK_TENANTS.find((t) => t.subscriptionPackage === 'enterprise')!
const professionalTenant = MOCK_TENANTS.find((t) => t.subscriptionPackage === 'professional')!
const starterTenant = MOCK_TENANTS.find((t) => t.subscriptionPackage === 'starter')!

// =============================================================================
// INTERACTIVE WRAPPER
// =============================================================================

interface DialogWrapperProps {
  tenant: Tenant
  buttonLabel?: string
  isSubmitting?: boolean
}

function DialogWrapper({ tenant, buttonLabel = 'Edit Tenant', isSubmitting = false }: DialogWrapperProps) {
  const [open, setOpen] = React.useState(false)
  const [submitting, setSubmitting] = React.useState(isSubmitting)

  const handleSubmit = async (data: TenantFormData) => {
    setSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setSubmitting(false)
    setOpen(false)
    alert(`Updated: ${data.companyName}`)
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>{buttonLabel}</Button>
      <EditTenantDialog
        tenant={tenant}
        open={open}
        onOpenChange={setOpen}
        onSubmit={handleSubmit}
        isSubmitting={submitting}
      />
    </>
  )
}

// =============================================================================
// STORIES
// =============================================================================

/**
 * Default edit form for an enterprise tenant.
 * Click the button to open the dialog.
 */
export const Default: Story = {
  render: () => <DialogWrapper tenant={enterpriseTenant} />,
}

/**
 * Edit dialog for enterprise package tenant.
 */
export const EnterpriseTenant: Story = {
  render: () => <DialogWrapper tenant={enterpriseTenant} buttonLabel="Edit Enterprise" />,
}

/**
 * Edit dialog for professional package tenant.
 */
export const ProfessionalTenant: Story = {
  render: () => <DialogWrapper tenant={professionalTenant} buttonLabel="Edit Professional" />,
}

/**
 * Edit dialog for starter package tenant.
 */
export const StarterTenant: Story = {
  render: () => <DialogWrapper tenant={starterTenant} buttonLabel="Edit Starter" />,
}

/**
 * Dialog opened by default for documentation screenshots.
 */
export const OpenByDefault: Story = {
  render: () => {
    const [open, setOpen] = React.useState(true)
    return (
      <EditTenantDialog
        tenant={enterpriseTenant}
        open={open}
        onOpenChange={setOpen}
        onSubmit={async (data) => alert(`Submitted: ${data.companyName}`)}
      />
    )
  },
}

/**
 * Form in submitting state with disabled buttons.
 */
export const Submitting: Story = {
  render: () => {
    const [open, setOpen] = React.useState(true)
    return (
      <EditTenantDialog
        tenant={enterpriseTenant}
        open={open}
        onOpenChange={setOpen}
        onSubmit={async () => {}}
        isSubmitting={true}
      />
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Form during submission - buttons disabled, submit shows "Saving..."',
      },
    },
  },
}

/**
 * AllStates - Visual comparison of different tenant packages in edit mode.
 */
export const AllStates: Story = {
  render: () => (
    <div className="space-y-8 p-8 bg-page min-h-screen">
      <StorySection title="Enterprise Package" description="Highest tier subscription">
        <DialogWrapper tenant={enterpriseTenant} buttonLabel="Edit Enterprise" />
      </StorySection>

      <StorySection title="Professional Package" description="Mid-tier subscription">
        <DialogWrapper tenant={professionalTenant} buttonLabel="Edit Professional" />
      </StorySection>

      <StorySection title="Starter Package" description="Entry-level subscription">
        <DialogWrapper tenant={starterTenant} buttonLabel="Edit Starter" />
      </StorySection>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Compare edit dialog for different subscription packages.',
      },
    },
  },
}
