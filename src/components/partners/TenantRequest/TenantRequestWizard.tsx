/**
 * TenantRequestWizard - 3-Step wizard for creating tenant requests
 *
 * Steps:
 * 1. Company & Contact Information
 * 2. Services & Pricing Configuration
 * 3. Review & Submit
 *
 * Features:
 * - FormProvider with react-hook-form for state management
 * - Step validation before navigation
 * - Unsaved changes dialog (Save Draft / Discard / Cancel)
 * - Linear navigation (no step skipping)
 * - Progress indicator (33% → 66% → 100%)
 *
 * @module partners/TenantRequest/TenantRequestWizard
 */

import { useState, useCallback, useEffect } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { ArrowLeft } from 'lucide-react'
import { cn } from '../../../lib/utils'
import { Button } from '../../ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../../ui/dialog'
import { Wizard, WizardContent, useWizard, type WizardStep } from '../../provisioning/Wizard'
import { WizardStepper } from '../../provisioning/WizardStepper'
import { WizardNavigation } from '../../provisioning/WizardNavigation'
import { CompanyContactStep } from './steps/CompanyContactStep'
import { PricingConfigStep } from './steps/PricingConfigStep'
import { ReviewSubmitStep } from './steps/ReviewSubmitStep'
import type { TenantRequestFormData, PartnerCommissionStatus } from './tenant-request.types'

// =============================================================================
// CONSTANTS
// =============================================================================

const WIZARD_STEPS: WizardStep[] = [
  { id: 'company-contact', label: 'Company & Contact' },
  { id: 'pricing', label: 'Services & Pricing' },
  { id: 'review', label: 'Review & Submit' },
]

const DEFAULT_FORM_VALUES: TenantRequestFormData = {
  // Company
  companyName: '',
  legalName: '',
  website: '',
  industry: '',
  // Contact
  contactName: '',
  contactTitle: '',
  contactEmail: '',
  contactPhone: '',
  // Billing
  billingStreet: '',
  billingCity: '',
  billingState: '',
  billingPostalCode: '',
  billingCountry: '',
  // Pricing
  organizationSize: '',
  selectedPackage: '',
  viewerLicenses: 0,
  contributorLicenses: 0,
  powerUserLicenses: 0,
  creatorLicenses: 0,
  // Status
  status: 'draft',
}

// =============================================================================
// TYPES
// =============================================================================

export interface TenantRequestWizardProps {
  /** Initial form data for editing existing requests */
  initialData?: Partial<TenantRequestFormData>
  /** Reference number for existing request */
  referenceNumber?: string
  /** Created date for existing request */
  createdAt?: string
  /** Partner's commission status for preview */
  commissionStatus?: PartnerCommissionStatus | null
  /** Callback when wizard is cancelled/back pressed */
  onCancel?: () => void
  /** Callback when form is saved as draft */
  onSaveDraft?: (data: TenantRequestFormData) => void | Promise<void>
  /** Callback when form is submitted */
  onSubmit?: (data: TenantRequestFormData) => void | Promise<void>
  /** Callback to view invoice preview */
  onViewInvoice?: () => void
  /** Callback to print invoice */
  onPrintInvoice?: () => void
  /** Additional className */
  className?: string
}

// =============================================================================
// VALIDATION
// =============================================================================

/**
 * Get required fields for a specific step
 */
function getStepFields(step: number): (keyof TenantRequestFormData)[] {
  switch (step) {
    case 0:
      // Step 1: Required fields only
      return ['companyName', 'industry', 'contactName', 'contactEmail', 'contactPhone']
    case 1:
      // Step 2: Organization size is required
      return ['organizationSize']
    case 2:
      // Step 3: No additional required fields
      return []
    default:
      return []
  }
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function TenantRequestWizard({
  initialData,
  referenceNumber,
  createdAt,
  commissionStatus = null,
  onCancel,
  onSaveDraft,
  onSubmit,
  onViewInvoice,
  onPrintInvoice,
  className,
}: TenantRequestWizardProps) {
  // Form setup
  const methods = useForm<TenantRequestFormData>({
    defaultValues: { ...DEFAULT_FORM_VALUES, ...initialData },
    mode: 'onBlur', // Validate on blur + on submit
  })

  const {
    formState: { isDirty, isSubmitting },
    trigger,
    getValues,
    handleSubmit,
  } = methods

  // Unsaved changes dialog state
  const [showExitDialog, setShowExitDialog] = useState(false)

  // Browser beforeunload handler
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault()
        e.returnValue = '' // Required for Chrome
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isDirty])

  // Exit attempt handler (back button)
  const handleExitAttempt = useCallback(() => {
    if (isDirty) {
      setShowExitDialog(true)
    } else {
      onCancel?.()
    }
  }, [isDirty, onCancel])

  // Dialog handlers
  const handleDialogCancel = useCallback(() => {
    setShowExitDialog(false)
  }, [])

  const handleDialogDiscard = useCallback(() => {
    setShowExitDialog(false)
    onCancel?.()
  }, [onCancel])

  const handleDialogSaveDraft = useCallback(async () => {
    setShowExitDialog(false)
    const data = getValues()
    await onSaveDraft?.({ ...data, status: 'draft' })
  }, [getValues, onSaveDraft])

  // Step validation handler (passed to inner component)
  const validateStep = useCallback(
    async (step: number): Promise<boolean> => {
      const fields = getStepFields(step)
      if (fields.length === 0) return true

      const isValid = await trigger(fields)
      return isValid
    },
    [trigger]
  )

  // Form submission
  const handleFormSubmit = useCallback(
    async (data: TenantRequestFormData) => {
      if (data.status === 'submitted') {
        await onSubmit?.(data)
      } else {
        await onSaveDraft?.(data)
      }
    },
    [onSubmit, onSaveDraft]
  )

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className={cn('flex flex-col min-h-full', className)}
        data-testid="tenant-request-wizard"
      >
        <Wizard steps={WIZARD_STEPS} allowStepNavigation={false}>
          {/* Header */}
          <header className="px-6 py-4 border-b border-default">
            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleExitAttempt}
                aria-label="Go back"
                data-testid="wizard-back-btn"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-primary">
                  Create New Tenant Request
                </h1>
                <p className="text-sm text-secondary mt-0.5">
                  Fill out the required fields to build a tenant request for your customer
                </p>
              </div>
            </div>
          </header>

          {/* Progress Stepper */}
          <WizardStepper clickable={false} className="border-b border-default" />

          {/* Content */}
          <WizardContent className="flex-1 overflow-auto">
            <div className="p-6 max-w-5xl mx-auto">
              <WizardStepContent
                commissionStatus={commissionStatus}
                referenceNumber={referenceNumber}
                createdAt={createdAt}
                onViewInvoice={onViewInvoice}
                onPrintInvoice={onPrintInvoice}
              />
            </div>
          </WizardContent>

          {/* Navigation */}
          <div className="px-6 py-4 bg-surface border-t border-default">
            <WizardNavigationWithValidation
              validateStep={validateStep}
              isSubmitting={isSubmitting}
            />
          </div>
        </Wizard>

        {/* Unsaved Changes Dialog */}
        <Dialog open={showExitDialog} onOpenChange={setShowExitDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Leave setup?</DialogTitle>
              <DialogDescription>
                You have unsaved changes. Save this tenant request as a draft?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex gap-2 sm:justify-between">
              <Button
                type="button"
                variant="ghost"
                onClick={handleDialogCancel}
                data-testid="exit-dialog-cancel"
              >
                Cancel
              </Button>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDialogDiscard}
                  data-testid="exit-dialog-discard"
                >
                  Discard
                </Button>
                <Button
                  type="button"
                  variant="default"
                  onClick={handleDialogSaveDraft}
                  data-testid="exit-dialog-save"
                >
                  Save Draft
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </form>
    </FormProvider>
  )
}

// =============================================================================
// SUB-COMPONENTS (inside Wizard context)
// =============================================================================

interface WizardStepContentProps {
  commissionStatus?: PartnerCommissionStatus | null
  referenceNumber?: string
  createdAt?: string
  onViewInvoice?: () => void
  onPrintInvoice?: () => void
}

/**
 * WizardStepContent - Renders the appropriate step content
 * Must be rendered inside Wizard context
 */
function WizardStepContent({
  commissionStatus,
  referenceNumber,
  createdAt,
  onViewInvoice,
  onPrintInvoice,
}: WizardStepContentProps) {
  const { currentStep } = useWizard()

  switch (currentStep) {
    case 0:
      return <CompanyContactStep />
    case 1:
      return <PricingConfigStep commissionStatus={commissionStatus} />
    case 2:
      return (
        <ReviewSubmitStep
          referenceNumber={referenceNumber}
          createdAt={createdAt}
          onViewInvoice={onViewInvoice}
          onPrintInvoice={onPrintInvoice}
        />
      )
    default:
      return null
  }
}

interface WizardNavigationWithValidationProps {
  validateStep: (step: number) => Promise<boolean>
  isSubmitting: boolean
}

/**
 * WizardNavigationWithValidation - Navigation with step validation
 * Must be rendered inside Wizard context
 */
function WizardNavigationWithValidation({
  validateStep,
  isSubmitting,
}: WizardNavigationWithValidationProps) {
  const { currentStep } = useWizard()

  const handleNext = useCallback(async (): Promise<boolean> => {
    const isValid = await validateStep(currentStep)
    return isValid
  }, [currentStep, validateStep])

  return (
    <WizardNavigation
      backLabel="Previous"
      nextLabel="Continue"
      submitLabel="Save Request"
      showCancelOnFirst={false}
      onNext={handleNext}
      isSubmitting={isSubmitting}
    />
  )
}

TenantRequestWizard.displayName = 'TenantRequestWizard'
