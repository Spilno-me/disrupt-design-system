/**
 * TenantRequestWizard Stories
 *
 * Stories demonstrating the 3-step tenant request wizard with:
 * - Company & Contact Information (Step 1)
 * - Services & Pricing Configuration (Step 2)
 * - Review & Submit (Step 3)
 *
 * @module stories/partner/tenant-request
 */

import type { Meta, StoryObj } from '@storybook/react'
import { fn, expect, userEvent, within } from 'storybook/test'
import { TenantRequestWizard } from '../../../components/partners/TenantRequest'
import type { TenantRequestFormData } from '../../../components/partners/TenantRequest'
import type { PartnerCommissionStatus } from '../../../components/partners/types/pricing.types'

// =============================================================================
// META
// =============================================================================

const meta: Meta<typeof TenantRequestWizard> = {
  title: 'Partner/TenantRequest/TenantRequestWizard',
  component: TenantRequestWizard,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# TenantRequestWizard

A 3-step wizard for creating tenant requests with organization-based pricing.

## Steps

1. **Company & Contact** - Company information and primary contact details
2. **Services & Pricing** - Organization size, process packages, and user licenses
3. **Review & Submit** - Read-only summary with status selection

## Features

- Form validation with react-hook-form
- Unsaved changes dialog (Save Draft / Discard / Cancel)
- Real-time pricing calculation
- Commission preview for partners
        `,
      },
    },
  },
  argTypes: {
    onCancel: { action: 'cancel' },
    onSaveDraft: { action: 'saveDraft' },
    onSubmit: { action: 'submit' },
    onViewInvoice: { action: 'viewInvoice' },
    onPrintInvoice: { action: 'printInvoice' },
  },
  decorators: [
    (Story) => (
      <div className="h-screen bg-page">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof TenantRequestWizard>

// =============================================================================
// MOCK DATA
// =============================================================================

const mockCommissionStatus: PartnerCommissionStatus = {
  partnerId: 'partner-001',
  tier: 1,
  rate: 10,
  ytdSales: 75000,
  amountToNextTier: 175000,
  tierUpgradeDate: null,
  dealCount: 5,
  year: 2026,
}

const mockPrefilledData: Partial<TenantRequestFormData> = {
  companyName: 'Acme Corporation',
  legalName: 'Acme Corporation Inc.',
  website: 'https://acme.example.com',
  industry: 'Technology',
  contactName: 'John Smith',
  contactEmail: 'john.smith@acme.example.com',
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
}

// =============================================================================
// STORIES
// =============================================================================

/**
 * Default wizard starting on Step 1 (Company & Contact)
 */
export const Default: Story = {
  args: {
    onCancel: fn(),
    onSaveDraft: fn(),
    onSubmit: fn(),
    commissionStatus: mockCommissionStatus,
  },
}

/**
 * Wizard with pre-filled data (editing existing request)
 */
export const Editing: Story = {
  args: {
    initialData: mockPrefilledData,
    referenceNumber: 'TR-2024-001234',
    createdAt: 'January 9, 2024',
    commissionStatus: mockCommissionStatus,
    onCancel: fn(),
    onSaveDraft: fn(),
    onSubmit: fn(),
    onViewInvoice: fn(),
    onPrintInvoice: fn(),
  },
}

/**
 * Wizard without commission preview (for Partner-facing view)
 */
export const WithoutCommission: Story = {
  args: {
    commissionStatus: null,
    onCancel: fn(),
    onSaveDraft: fn(),
    onSubmit: fn(),
  },
}

/**
 * Mobile viewport for responsive testing
 */
export const Mobile: Story = {
  args: {
    commissionStatus: mockCommissionStatus,
    onCancel: fn(),
    onSaveDraft: fn(),
    onSubmit: fn(),
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
}

/**
 * Interaction test: Fill Step 1 and navigate to Step 2
 */
export const InteractionStep1ToStep2: Story = {
  args: {
    commissionStatus: mockCommissionStatus,
    onCancel: fn(),
    onSaveDraft: fn(),
    onSubmit: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Fill required company fields
    const companyInput = canvas.getByTestId('company-name-input')
    await userEvent.type(companyInput, 'Test Company LLC')

    // Select industry
    const industrySelect = canvas.getByTestId('industry-select')
    await userEvent.click(industrySelect)
    await userEvent.click(canvas.getByText('Technology'))

    // Fill contact fields
    const contactNameInput = canvas.getByTestId('contact-name-input')
    await userEvent.type(contactNameInput, 'Jane Doe')

    const contactEmailInput = canvas.getByTestId('contact-email-input')
    await userEvent.type(contactEmailInput, 'jane@testcompany.com')

    const contactPhoneInput = canvas.getByTestId('contact-phone-input')
    await userEvent.type(contactPhoneInput, '+1 555 987 6543')

    // Click Continue
    const continueBtn = canvas.getByTestId('wizard-nav-next')
    await userEvent.click(continueBtn)

    // Should now be on Step 2 - verify org size selector is visible
    // Note: This assertion may need adjustment based on actual DOM
    await expect(canvas.getByText('Organization Size')).toBeInTheDocument()
  },
}

/**
 * Interaction test: Unsaved changes dialog
 */
export const InteractionUnsavedChanges: Story = {
  args: {
    onCancel: fn(),
    onSaveDraft: fn(),
    onSubmit: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Make a change to trigger dirty state
    const companyInput = canvas.getByTestId('company-name-input')
    await userEvent.type(companyInput, 'Unsaved Company')

    // Click back button
    const backBtn = canvas.getByTestId('wizard-back-btn')
    await userEvent.click(backBtn)

    // Verify dialog appears
    await expect(canvas.getByText('Leave setup?')).toBeInTheDocument()
    await expect(canvas.getByTestId('exit-dialog-save')).toBeInTheDocument()
    await expect(canvas.getByTestId('exit-dialog-discard')).toBeInTheDocument()
    await expect(canvas.getByTestId('exit-dialog-cancel')).toBeInTheDocument()
  },
}
