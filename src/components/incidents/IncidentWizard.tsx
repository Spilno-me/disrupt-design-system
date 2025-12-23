/**
 * IncidentWizard - Multi-step wizard for incident reporting
 *
 * Contains all 5 steps with stepper navigation:
 * 1. Classification - Category, Severity, Title
 * 2. Description - What happened, Immediate actions
 * 3. Location & Time - Where, When
 * 4. Impact - Injury, Medical, Witnesses
 * 5. Evidence & Review - Photos, Notes, Summary
 */

import * as React from 'react'
import { useState } from 'react'
import { Wizard, WizardContent } from '../provisioning/Wizard'
import { CompactStepper } from '../provisioning/WizardStepper'
import { WizardStep } from '../provisioning/WizardStep'
import { WizardFooter } from '../provisioning/WizardNavigation'
import { Separator } from '../ui/separator'
import { ClassificationStep } from './steps/ClassificationStep'
import { DescriptionStep } from './steps/DescriptionStep'
import { LocationStep } from './steps/LocationStep'
import { ImpactStep } from './steps/ImpactStep'
import { EvidenceStep } from './steps/EvidenceStep'
import {
  type IncidentFormData,
  type LocationOption,
  INCIDENT_WIZARD_STEPS,
} from './types'

// =============================================================================
// TYPES
// =============================================================================

interface IncidentWizardProps {
  /** Current form data */
  data: IncidentFormData
  /** Update form data */
  onUpdate: (updates: Partial<IncidentFormData>) => void
  /** Submit the form */
  onSubmit: () => void | Promise<void>
  /** Cancel and close */
  onCancel: () => void
  /** Available locations */
  locations?: LocationOption[]
}

// =============================================================================
// VALIDATION
// =============================================================================

function validateStep(step: number, data: IncidentFormData): boolean {
  switch (step) {
    case 0: // Classification
      return !!data.category && !!data.severity && data.title.trim().length > 0
    case 1: // Description
      return data.description.trim().length > 0
    case 2: // Location & Time
      return data.location.trim().length > 0 && !!data.dateTime
    case 3: // Impact
      return true // No required fields
    case 4: // Evidence
      return true // No required fields
    default:
      return true
  }
}

// =============================================================================
// COMPONENT
// =============================================================================

export function IncidentWizard({
  data,
  onUpdate,
  onSubmit,
  onCancel,
  locations = [],
}: IncidentWizardProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  // Validate current step before allowing navigation
  const handleNext = (): boolean => {
    if (!validateStep(currentStep, data)) {
      // Could show validation errors here
      return false
    }
    return true
  }

  // Handle final submission
  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      await onSubmit()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Wizard
      steps={[...INCIDENT_WIZARD_STEPS]}
      onStepChange={setCurrentStep}
      className="flex flex-col flex-1 min-h-0"
    >
      {/* Stepper - Always use CompactStepper in sheet (constrained width) */}
      <div className="shrink-0">
        <CompactStepper className="border-b border-default" />
      </div>

      {/* Scrollable content area */}
      <WizardContent className="flex-1 min-h-0 overflow-y-auto px-6 py-6">
        <WizardStep step={0}>
          <ClassificationStep data={data} onUpdate={onUpdate} />
        </WizardStep>

        <WizardStep step={1}>
          <DescriptionStep data={data} onUpdate={onUpdate} />
        </WizardStep>

        <WizardStep step={2}>
          <LocationStep data={data} onUpdate={onUpdate} locations={locations} />
        </WizardStep>

        <WizardStep step={3}>
          <ImpactStep data={data} onUpdate={onUpdate} />
        </WizardStep>

        <WizardStep step={4}>
          <EvidenceStep data={data} onUpdate={onUpdate} />
        </WizardStep>
      </WizardContent>

      {/* Footer navigation - shrink-0 keeps it visible */}
      <div className="shrink-0">
        <Separator />
      </div>
      <WizardFooter
        sticky={false}
        onCancel={onCancel}
        onNext={handleNext}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitLabel="Submit Report"
        disabled={!validateStep(currentStep, data)}
        className="px-6 shrink-0"
      />
    </Wizard>
  )
}

IncidentWizard.displayName = 'IncidentWizard'

export default IncidentWizard
