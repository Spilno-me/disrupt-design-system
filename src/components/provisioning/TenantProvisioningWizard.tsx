// =============================================================================
// TENANT PROVISIONING WIZARD
// Main orchestrator component - coordinates steps, validation, and submission
// =============================================================================

// =============================================================================
// RE-EXPORTS FOR BACKWARDS COMPATIBILITY (CRITICAL - stories import these)
// =============================================================================
export type { TenantFormData, TenantProvisioningWizardProps } from './tenant-provisioning.types'

// Re-export API utilities for convenient import from main component
export { transformToApiRequest, transformFromApiResponse } from './tenant-provisioning.utils'
export type { TenantApiRequest, TenantApiResponse } from './tenant-provisioning.types'

// =============================================================================
// IMPORTS
// =============================================================================

import * as React from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { cn } from '../../lib/utils'
import { Wizard, useWizard } from './Wizard'
import { ALIAS } from '../../constants/designTokens'
import { WizardStepper, CompactStepper } from './WizardStepper'
import { WizardStep as WizardStepComponent } from './WizardStep'
import { WizardNavigation } from './WizardNavigation'
import type { TenantFormData, TenantProvisioningWizardProps } from './tenant-provisioning.types'
import { WIZARD_STEPS } from './tenant-provisioning.constants'
import { CompanyInfoStep, ContactBillingStep, PricingStep, ReviewPayStep } from './steps'

// =============================================================================
// MAIN WIZARD COMPONENT
// =============================================================================

/**
 * TenantProvisioningWizard - Multi-step wizard for tenant onboarding
 *
 * @component ORGANISM
 * @testId Named regions: `tenant-wizard-{section}`
 *
 * Test IDs:
 * - `tenant-wizard-form` - Root form element
 * - `tenant-wizard-stepper` - Desktop stepper container
 * - `tenant-wizard-stepper-mobile` - Mobile compact stepper
 * - `tenant-wizard-content` - Step content area
 * - `tenant-wizard-step-{n}` - Individual step containers (0-3)
 * - `tenant-wizard-navigation` - Navigation footer
 */
export function TenantProvisioningWizard({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
  commissionPercentage,
  skipValidation = false,
  className,
}: TenantProvisioningWizardProps) {
  const methods = useForm<TenantFormData>({
    defaultValues: {
      companyName: '',
      legalName: '',
      website: '',
      industry: '',
      employeeCount: '',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      contactTitle: '',
      billingStreet: '',
      billingCity: '',
      billingState: '',
      billingPostalCode: '',
      billingCountry: '',
      package: 'standard',
      viewerLicenses: 0,
      contributorLicenses: 0,
      powerUserLicenses: 0,
      creatorLicenses: 0,
      paymentMethod: 'invoice',
      acceptTerms: false,
      ...initialData,
    },
    mode: 'onChange',
  })

  const { trigger, handleSubmit } = methods

  // Validation rules per step
  const validateStep = async (step: number): Promise<boolean> => {
    if (skipValidation) return true

    switch (step) {
      case 0:
        return trigger(['companyName', 'industry', 'employeeCount'])
      case 1:
        return trigger([
          'contactName',
          'contactEmail',
          'billingStreet',
          'billingCity',
          'billingState',
          'billingPostalCode',
          'billingCountry',
        ])
      case 2:
        return trigger(['package'])
      case 3:
        return trigger(['paymentMethod', 'acceptTerms'])
      default:
        return true
    }
  }

  const handleFormSubmit = handleSubmit(async (data) => {
    // Validate terms acceptance (skip if skipValidation is enabled)
    if (!skipValidation && !data.acceptTerms) {
      methods.setError('acceptTerms', {
        type: 'manual',
        message: 'You must accept the terms to continue',
      })
      return
    }

    await onSubmit(data)
  })

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleFormSubmit} className={cn('flex flex-col h-full w-full', className)} data-testid="tenant-wizard-form">
        <div className="flex flex-col h-full w-full">
          <Wizard
            steps={WIZARD_STEPS}
            allowStepNavigation={true}
            className="flex flex-col h-full"
          >
            {/* Header with Stepper - gradient bottom border */}
            <div className="shrink-0 relative">
              {/* Desktop Stepper */}
              <div className="hidden md:block" data-testid="tenant-wizard-stepper">
                <WizardStepper clickable={true} className="max-w-3xl mx-auto" />
              </div>
              {/* Mobile Compact Stepper */}
              <div className="md:hidden" data-testid="tenant-wizard-stepper-mobile">
                <CompactStepper />
              </div>
              {/* Gradient border */}
              <div
                className="absolute bottom-0 left-0 right-0 h-px"
                style={{
                  background: `linear-gradient(90deg, transparent 0%, ${ALIAS.border.default} 50%, transparent 100%)`,
                }}
              />
            </div>

            {/* Step Content - scrollable area */}
            <div className="flex-1 min-h-0 overflow-auto px-4 md:px-8 lg:px-12 py-6 md:py-8" data-testid="tenant-wizard-content">
              <div className="w-full min-h-full flex flex-col">
                <WizardStepComponent step={0} data-testid="tenant-wizard-step-0">
                  <CompanyInfoStep />
                </WizardStepComponent>

                <WizardStepComponent step={1} data-testid="tenant-wizard-step-1">
                  <ContactBillingStep />
                </WizardStepComponent>

                <WizardStepComponent step={2} data-testid="tenant-wizard-step-2">
                  <PricingStep commissionPercentage={commissionPercentage} />
                </WizardStepComponent>

                <WizardStepComponent step={3} data-testid="tenant-wizard-step-3">
                  <ReviewPayStep commissionPercentage={commissionPercentage} />
                </WizardStepComponent>
              </div>
            </div>

            {/* Navigation buttons - pinned at bottom, outside scroll area */}
            <div className="shrink-0 px-4 md:px-8 lg:px-12 py-4 relative" data-testid="tenant-wizard-navigation">
              {/* Gradient border */}
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{
                  background: `linear-gradient(90deg, transparent 0%, ${ALIAS.border.default} 50%, transparent 100%)`,
                }}
              />
              <WizardNavigationWithValidation
                validateStep={validateStep}
                onCancel={onCancel}
                isSubmitting={isSubmitting}
              />
            </div>
          </Wizard>
        </div>
      </form>
    </FormProvider>
  )
}

// =============================================================================
// NAVIGATION WITH VALIDATION
// =============================================================================

interface WizardNavigationWithValidationProps {
  validateStep: (step: number) => Promise<boolean>
  onCancel?: () => void
  isSubmitting: boolean
}

function WizardNavigationWithValidation({
  validateStep,
  onCancel,
  isSubmitting,
}: WizardNavigationWithValidationProps) {
  const { currentStep } = useWizard()

  const handleNext = async (): Promise<boolean> => {
    const isValid = await validateStep(currentStep)
    return isValid
  }

  return (
    <WizardNavigation
      onCancel={onCancel}
      onNext={handleNext}
      submitLabel="Complete Purchase"
      isSubmitting={isSubmitting}
      disabled={isSubmitting}
      className="border-t-0 pt-0"
    />
  )
}
