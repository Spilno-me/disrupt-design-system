import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { TenantProvisioningWizard, type TenantFormData } from './TenantProvisioningWizard'
import { Card, CardContent } from '../ui/card'
import { Button } from '../ui/button'

// =============================================================================
// META
// =============================================================================

const meta: Meta<typeof TenantProvisioningWizard> = {
  title: 'Partner/Provisioning/TenantProvisioningWizard',
  component: TenantProvisioningWizard,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
A complete tenant provisioning wizard for onboarding new customers.

## Features
- 4-step wizard flow: Company Info, Contact & Billing, Pricing, Review & Pay
- Form validation with react-hook-form
- Dynamic pricing calculation
- Package and license selection
- Payment method selection
- Partner commission display (optional)

## Usage
\`\`\`tsx
import { TenantProvisioningWizard } from '@/components/provisioning'

<TenantProvisioningWizard
  onSubmit={(data) => console.log('Submitted:', data)}
  onCancel={() => console.log('Cancelled')}
  commissionPercentage={15}  // Optional, for partner portal
/>
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    commissionPercentage: {
      control: { type: 'number', min: 0, max: 100 },
      description: 'Commission percentage to display (for partner portal)',
    },
    isSubmitting: {
      control: 'boolean',
      description: 'Whether submission is in progress',
    },
    skipValidation: {
      control: 'boolean',
      description: 'Skip validation on step navigation (for development/preview)',
    },
  },
}

export default meta
type Story = StoryObj<typeof TenantProvisioningWizard>

// =============================================================================
// DEFAULT STORY
// =============================================================================

function DefaultDemo() {
  const [result, setResult] = useState<TenantFormData | null>(null)

  if (result) {
    return (
      <div className="min-h-screen bg-page flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full">
          <CardContent className="pt-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-success-light flex items-center justify-center">
                <svg className="w-8 h-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-primary mb-2">
                Tenant Created Successfully!
              </h2>
              <p className="text-secondary">
                The tenant has been provisioned with the following details:
              </p>
            </div>

            <div className="bg-muted-bg rounded-lg p-4 mb-6">
              <pre className="text-xs text-primary overflow-auto max-h-96">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>

            <div className="flex justify-center">
              <Button onClick={() => setResult(null)}>
                Create Another Tenant
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <TenantProvisioningWizard
      onSubmit={(data) => {
        console.log('Submitted:', data)
        setResult(data)
      }}
      onCancel={() => console.log('Cancelled')}
    />
  )
}

export const Default: Story = {
  render: () => <DefaultDemo />,
}

// =============================================================================
// WITH PARTNER COMMISSION
// =============================================================================

function PartnerPortalDemo() {
  const [result, setResult] = useState<TenantFormData | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (data: TenantFormData) => {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsSubmitting(false)
    setResult(data)
  }

  if (result) {
    return (
      <div className="min-h-screen bg-page flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-success-light flex items-center justify-center">
              <svg className="w-8 h-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-primary mb-2">
              Tenant Created!
            </h2>
            <p className="text-secondary mb-4">
              You'll receive your commission of 15% for {result.companyName}.
            </p>
            <Button onClick={() => setResult(null)}>
              Create Another
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <TenantProvisioningWizard
      onSubmit={handleSubmit}
      onCancel={() => console.log('Cancelled')}
      commissionPercentage={15}
      isSubmitting={isSubmitting}
    />
  )
}

export const PartnerPortal: Story = {
  render: () => <PartnerPortalDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Wizard with partner commission display enabled. Partners see their commission percentage and amount on pricing and review steps.',
      },
    },
  },
}

// =============================================================================
// WITH INITIAL DATA
// =============================================================================

const PREFILLED_DATA: Partial<TenantFormData> = {
  companyName: 'Acme Safety Corp',
  legalName: 'Acme Safety Corporation Inc.',
  website: 'https://www.acmesafety.com',
  industry: 'Manufacturing',
  employeeCount: '201-500',
  contactName: 'John Smith',
  contactEmail: 'john.smith@acmesafety.com',
  contactPhone: '+1 (555) 123-4567',
  contactTitle: 'EHS Director',
  billingStreet: '123 Industrial Way',
  billingCity: 'Chicago',
  billingState: 'Illinois',
  billingPostalCode: '60601',
  billingCountry: 'United States',
  package: 'premium',
  viewerLicenses: 10,
  contributorLicenses: 5,
  powerUserLicenses: 2,
  creatorLicenses: 1,
}

export const WithInitialData: Story = {
  render: () => (
    <TenantProvisioningWizard
      initialData={PREFILLED_DATA}
      onSubmit={(data) => console.log('Submitted:', data)}
      onCancel={() => console.log('Cancelled')}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Wizard pre-populated with data, useful for editing existing tenants or resuming a saved draft.',
      },
    },
  },
}

// =============================================================================
// SUBMITTING STATE
// =============================================================================

function SubmittingDemo() {
  return (
    <TenantProvisioningWizard
      initialData={{
        ...PREFILLED_DATA,
        paymentMethod: 'invoice',
        acceptTerms: true,
      }}
      onSubmit={async () => {
        // Never resolves to keep loading state visible
        await new Promise(() => {})
      }}
      onCancel={() => console.log('Cancelled')}
      isSubmitting={true}
    />
  )
}

export const SubmittingState: Story = {
  render: () => <SubmittingDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Shows the wizard in a submitting state with disabled navigation and loading indicator.',
      },
    },
  },
}

// =============================================================================
// MOBILE VIEW
// =============================================================================

export const MobileView: Story = {
  render: () => (
    <TenantProvisioningWizard
      onSubmit={(data) => console.log('Submitted:', data)}
      onCancel={() => console.log('Cancelled')}
    />
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Mobile-optimized view with compact stepper.',
      },
    },
  },
}

// =============================================================================
// HIGH COMMISSION PARTNER
// =============================================================================

export const HighCommissionPartner: Story = {
  render: () => (
    <TenantProvisioningWizard
      initialData={{
        ...PREFILLED_DATA,
        package: 'advanced',
        viewerLicenses: 50,
        contributorLicenses: 25,
        powerUserLicenses: 10,
        creatorLicenses: 5,
      }}
      onSubmit={(data) => console.log('Submitted:', data)}
      onCancel={() => console.log('Cancelled')}
      commissionPercentage={25}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'High-value deal with 25% partner commission. Demonstrates commission calculation with larger license counts.',
      },
    },
  },
}

// =============================================================================
// PREVIEW MODE (SKIP VALIDATION)
// =============================================================================

export const PreviewMode: Story = {
  render: () => (
    <TenantProvisioningWizard
      onSubmit={(data) => console.log('Submitted:', data)}
      onCancel={() => console.log('Cancelled')}
      skipValidation
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Preview mode with validation disabled. Click through all steps without filling in required fields.',
      },
    },
  },
}
