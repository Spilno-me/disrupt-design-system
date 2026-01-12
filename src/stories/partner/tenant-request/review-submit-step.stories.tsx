/**
 * ReviewSubmitStep Stories
 *
 * Step 3 of TenantRequestWizard - Review and submit.
 *
 * @module stories/partner/tenant-request
 */

import type { Meta, StoryObj } from '@storybook/react'
import { fn, expect, userEvent, within } from 'storybook/test'
import { useForm, FormProvider } from 'react-hook-form'
import { ReviewSubmitStep } from '../../../components/partners/TenantRequest/steps/ReviewSubmitStep'
import type { TenantRequestFormData } from '../../../components/partners/TenantRequest'

// =============================================================================
// MOCK DATA
// =============================================================================

const mockFormData: Partial<TenantRequestFormData> = {
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
  organizationSize: 'mid_market',
  selectedPackage: 'premium',
  viewerLicenses: 10,
  contributorLicenses: 5,
  powerUserLicenses: 2,
  creatorLicenses: 1,
  status: 'draft',
}

// =============================================================================
// WRAPPER COMPONENT
// =============================================================================

function StepWrapper({
  defaultValues,
  referenceNumber,
  createdAt,
  onViewInvoice,
  onPrintInvoice,
}: {
  defaultValues?: Partial<TenantRequestFormData>
  referenceNumber?: string
  createdAt?: string
  onViewInvoice?: () => void
  onPrintInvoice?: () => void
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
      organizationSize: '',
      selectedPackage: '',
      viewerLicenses: 0,
      contributorLicenses: 0,
      powerUserLicenses: 0,
      creatorLicenses: 0,
      status: 'draft',
      ...defaultValues,
    },
    mode: 'onBlur',
  })

  return (
    <FormProvider {...methods}>
      <form className="p-6 max-w-4xl mx-auto bg-page min-h-screen">
        <ReviewSubmitStep
          referenceNumber={referenceNumber}
          createdAt={createdAt}
          onViewInvoice={onViewInvoice}
          onPrintInvoice={onPrintInvoice}
        />
      </form>
    </FormProvider>
  )
}

// =============================================================================
// META
// =============================================================================

const meta: Meta<typeof ReviewSubmitStep> = {
  title: 'Partner/TenantRequest/Steps/ReviewSubmitStep',
  component: ReviewSubmitStep,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# ReviewSubmitStep

Step 3 of the TenantRequestWizard - read-only summary with collapsible sections.

## Sections (Collapsible)

1. **Company Information** - Company name, legal name, website, industry
2. **Contact Information** - Full name, email, phone, job title
3. **Billing Information** - Collapsed by default, all address fields
4. **Pricing Summary** - Organization size, package, licenses, totals

## Features

- Collapsible sections with chevron icons (▼/▶)
- Status dropdown (Draft / Submit for Approval)
- Invoice preview buttons (View / Print)
- Reference number and created date display
        `,
      },
    },
  },
  argTypes: {
    onViewInvoice: { action: 'viewInvoice' },
    onPrintInvoice: { action: 'printInvoice' },
  },
}

export default meta
type Story = StoryObj<typeof ReviewSubmitStep>

// =============================================================================
// STORIES
// =============================================================================

/**
 * Full review with all data
 */
export const Default: Story = {
  render: () => (
    <StepWrapper
      defaultValues={mockFormData}
      referenceNumber="TR-2024-001234"
      createdAt="January 9, 2024"
      onViewInvoice={fn()}
      onPrintInvoice={fn()}
    />
  ),
}

/**
 * Minimal data (no billing, no licenses)
 */
export const Minimal: Story = {
  render: () => (
    <StepWrapper
      defaultValues={{
        companyName: 'Simple Co',
        industry: 'Retail',
        contactName: 'Jane Doe',
        contactEmail: 'jane@simple.com',
        contactPhone: '555-1234',
        organizationSize: 'micro',
        status: 'draft',
      }}
      onViewInvoice={fn()}
      onPrintInvoice={fn()}
    />
  ),
}

/**
 * Without reference number (new request)
 */
export const NewRequest: Story = {
  render: () => (
    <StepWrapper
      defaultValues={mockFormData}
      onViewInvoice={fn()}
      onPrintInvoice={fn()}
    />
  ),
}

/**
 * Mobile viewport
 */
export const Mobile: Story = {
  render: () => (
    <StepWrapper
      defaultValues={mockFormData}
      referenceNumber="TR-2024-001234"
      createdAt="January 9, 2024"
      onViewInvoice={fn()}
      onPrintInvoice={fn()}
    />
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
}

/**
 * Interaction test: Toggle collapsible sections
 */
export const InteractionCollapsible: Story = {
  render: () => (
    <StepWrapper
      defaultValues={mockFormData}
      referenceNumber="TR-2024-001234"
      createdAt="January 9, 2024"
      onViewInvoice={fn()}
      onPrintInvoice={fn()}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Click to expand billing section (collapsed by default)
    const billingToggle = canvas.getByTestId('review-billing-toggle')
    await userEvent.click(billingToggle)

    // Verify billing info is now visible
    await expect(canvas.getByText('Street Address')).toBeInTheDocument()

    // Click again to collapse
    await userEvent.click(billingToggle)
  },
}

/**
 * Interaction test: Change status
 */
export const InteractionStatus: Story = {
  render: () => (
    <StepWrapper
      defaultValues={mockFormData}
      referenceNumber="TR-2024-001234"
      createdAt="January 9, 2024"
      onViewInvoice={fn()}
      onPrintInvoice={fn()}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Click status dropdown
    const statusSelect = canvas.getByTestId('status-select')
    await userEvent.click(statusSelect)

    // Select "Submit for Approval"
    await userEvent.click(canvas.getByText('Submit for Approval'))

    // Verify selection changed
    await expect(statusSelect).toHaveTextContent('Submit for Approval')
  },
}
