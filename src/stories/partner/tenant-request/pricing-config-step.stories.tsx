/**
 * PricingConfigStep Stories
 *
 * Step 2 of TenantRequestWizard - Services and pricing configuration.
 *
 * @module stories/partner/tenant-request
 */

import type { Meta, StoryObj } from '@storybook/react'
import { useForm, FormProvider } from 'react-hook-form'
import { PricingConfigStep } from '../../../components/partners/TenantRequest/steps/PricingConfigStep'
import type { TenantRequestFormData } from '../../../components/partners/TenantRequest'
import type { PartnerCommissionStatus } from '../../../components/partners/types/pricing.types'

// =============================================================================
// MOCK DATA
// =============================================================================

const mockCommissionStatus: PartnerCommissionStatus = {
  partnerId: 'partner-001',
  tier: 1,
  rate: 0.10,
  ytdSales: 75000,
  amountToNextTier: 175000,
  tierUpgradeDate: null,
  dealCount: 12,
  year: 2024,
}

// =============================================================================
// WRAPPER COMPONENT
// =============================================================================

function StepWrapper({
  defaultValues,
  commissionStatus,
  showCommission = true,
  disabled,
}: {
  defaultValues?: Partial<TenantRequestFormData>
  commissionStatus?: PartnerCommissionStatus | null
  showCommission?: boolean
  disabled?: boolean
}) {
  const methods = useForm<TenantRequestFormData>({
    defaultValues: {
      organizationSize: '',
      selectedPackage: '',
      viewerLicenses: 0,
      contributorLicenses: 0,
      powerUserLicenses: 0,
      creatorLicenses: 0,
      ...defaultValues,
    },
    mode: 'onBlur',
  })

  return (
    <FormProvider {...methods}>
      <form className="p-6 max-w-6xl mx-auto bg-page min-h-screen">
        <PricingConfigStep
          commissionStatus={commissionStatus}
          showCommission={showCommission}
          disabled={disabled}
        />
      </form>
    </FormProvider>
  )
}

// =============================================================================
// META
// =============================================================================

const meta: Meta<typeof PricingConfigStep> = {
  title: 'Partner/TenantRequest/Steps/PricingConfigStep',
  component: PricingConfigStep,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# PricingConfigStep

Step 2 of the TenantRequestWizard - configures pricing based on organization size, process packages, and user licenses.

## Sections

1. **Organization Size** - Required dropdown with 6 tiers (Micro → Large Enterprise)
2. **Process Package** - Radio-style cards (Standard/Premium/Advanced/Industry)
3. **User Licenses** - Number steppers for each license tier
4. **Pricing Summary** - Real-time calculation in sticky sidebar
5. **Commission Preview** - Partner's commission preview (optional)

## Organization Size Tiers

| Tier | Users | Annual Price |
|------|-------|--------------|
| Micro | 1-10 | $3,000 |
| Small | 11-50 | $5,000 |
| Mid-Market | 51-100 | $7,000 |
| Upper Mid-Market | 101-250 | $10,000 |
| Enterprise | 251-500 | $13,000 |
| Large Enterprise | 500+ | $18,000 |
        `,
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof PricingConfigStep>

// =============================================================================
// STORIES
// =============================================================================

/**
 * Empty form state with commission preview
 */
export const Default: Story = {
  render: () => <StepWrapper commissionStatus={mockCommissionStatus} />,
}

/**
 * Pre-configured pricing
 */
export const Configured: Story = {
  render: () => (
    <StepWrapper
      commissionStatus={mockCommissionStatus}
      defaultValues={{
        organizationSize: 'mid_market',
        selectedPackage: 'premium',
        viewerLicenses: 10,
        contributorLicenses: 5,
        powerUserLicenses: 2,
        creatorLicenses: 1,
      }}
    />
  ),
}

/**
 * Without commission preview (customer-facing)
 */
export const WithoutCommission: Story = {
  render: () => (
    <StepWrapper
      commissionStatus={null}
      showCommission={false}
      defaultValues={{
        organizationSize: 'enterprise',
        selectedPackage: 'advanced',
      }}
    />
  ),
}

/**
 * Disabled state
 */
export const Disabled: Story = {
  render: () => (
    <StepWrapper
      commissionStatus={mockCommissionStatus}
      disabled
      defaultValues={{
        organizationSize: 'small',
        selectedPackage: 'standard',
        viewerLicenses: 5,
      }}
    />
  ),
}

/**
 * Mobile viewport
 */
export const Mobile: Story = {
  render: () => <StepWrapper commissionStatus={mockCommissionStatus} />,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
}
