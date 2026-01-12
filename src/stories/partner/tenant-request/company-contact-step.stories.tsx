/**
 * CompanyContactStep Stories
 *
 * Step 1 of TenantRequestWizard - Company and contact information.
 *
 * @module stories/partner/tenant-request
 */

import type { Meta, StoryObj } from '@storybook/react'
import { useForm, FormProvider } from 'react-hook-form'
import { CompanyContactStep } from '../../../components/partners/TenantRequest/steps/CompanyContactStep'
import type { TenantRequestFormData } from '../../../components/partners/TenantRequest'

// =============================================================================
// WRAPPER COMPONENT
// =============================================================================

function StepWrapper({
  defaultValues,
  disabled,
}: {
  defaultValues?: Partial<TenantRequestFormData>
  disabled?: boolean
}) {
  const methods = useForm<TenantRequestFormData>({
    defaultValues: {
      companyName: '',
      legalName: '',
      website: '',
      industry: '',
      contactName: '',
      contactTitle: '',
      contactEmail: '',
      contactPhone: '',
      billingStreet: '',
      billingCity: '',
      billingState: '',
      billingPostalCode: '',
      billingCountry: '',
      ...defaultValues,
    },
    mode: 'onBlur',
  })

  return (
    <FormProvider {...methods}>
      <form className="p-6 max-w-4xl mx-auto bg-page min-h-screen">
        <CompanyContactStep disabled={disabled} />
      </form>
    </FormProvider>
  )
}

// =============================================================================
// META
// =============================================================================

const meta: Meta<typeof CompanyContactStep> = {
  title: 'Partner/TenantRequest/Steps/CompanyContactStep',
  component: CompanyContactStep,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# CompanyContactStep

Step 1 of the TenantRequestWizard - collects company information, primary contact, and optional billing address.

## Sections

1. **Company Information** - Company name, legal name, website, industry
2. **Primary Contact** - Full name, email, phone, job title
3. **Billing Information** - Collapsible section with address fields (all optional)

## Validation Rules

- **Company Name**: Required, 2-150 chars, allows \`& . , - ' ( ) /\`
- **Full Name**: Required, 2+ words, NO DIGITS
- **Email**: Required, valid format, max 254 chars
- **Phone**: Required, min 7 digits
- **Job Title**: Optional, NO DIGITS
- **Billing City/State**: Optional, NO DIGITS
- **Postal Code**: Optional, DIGITS ONLY
        `,
      },
    },
  },
  decorators: [
    (Story) => <Story />,
  ],
}

export default meta
type Story = StoryObj<typeof CompanyContactStep>

// =============================================================================
// STORIES
// =============================================================================

/**
 * Empty form state
 */
export const Default: Story = {
  render: () => <StepWrapper />,
}

/**
 * Pre-filled form data
 */
export const Prefilled: Story = {
  render: () => (
    <StepWrapper
      defaultValues={{
        companyName: 'Acme Corporation',
        legalName: 'Acme Corporation Inc.',
        website: 'https://acme.example.com',
        industry: 'Technology',
        contactName: 'John Smith',
        contactEmail: 'john@acme.example.com',
        contactPhone: '+1 (555) 123-4567',
        contactTitle: 'Director of Operations',
        billingStreet: '123 Main Street',
        billingCity: 'San Francisco',
        billingState: 'California',
        billingPostalCode: '94102',
        billingCountry: 'United States',
      }}
    />
  ),
}

/**
 * Disabled state (read-only)
 */
export const Disabled: Story = {
  render: () => (
    <StepWrapper
      defaultValues={{
        companyName: 'Acme Corporation',
        industry: 'Technology',
        contactName: 'John Smith',
        contactEmail: 'john@acme.example.com',
        contactPhone: '+1 (555) 123-4567',
      }}
      disabled
    />
  ),
}

/**
 * Mobile viewport
 */
export const Mobile: Story = {
  render: () => <StepWrapper />,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
}
