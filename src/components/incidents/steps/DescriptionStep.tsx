/**
 * DescriptionStep - Step 2 of Incident Wizard
 *
 * Fields:
 * - Description (required) - Detailed account of what happened
 * - Immediate Actions (optional) - What was done right away
 */

import * as React from 'react'
import { WizardStepHeader, WizardStepSection } from '../../provisioning/WizardStep'
import { Label } from '../../ui/label'
import { Textarea } from '../../ui/textarea'
import { type StepProps } from '../types'

// =============================================================================
// COMPONENT
// =============================================================================

export function DescriptionStep({ data, onUpdate }: StepProps) {
  return (
    <div className="space-y-8">
      <WizardStepHeader
        title="Describe the Incident"
        description="Provide details about what happened and any immediate actions taken"
      />

      <WizardStepSection className="space-y-6">
        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-medium">
            What Happened? <span className="text-error">*</span>
          </Label>
          <Textarea
            id="description"
            placeholder="Describe the incident in detail. Include what led up to it, what happened, and the outcome."
            value={data.description}
            onChange={(e) => onUpdate({ description: e.target.value })}
            className="min-h-[150px] resize-y"
          />
          <p className="text-xs text-emphasis">
            Be as specific as possible. Include names, equipment involved, and sequence of events.
          </p>
        </div>

        {/* Immediate Actions */}
        <div className="space-y-2">
          <Label htmlFor="immediateActions" className="text-sm font-medium">
            Immediate Actions Taken
          </Label>
          <Textarea
            id="immediateActions"
            placeholder="What was done immediately after the incident? First aid, area secured, supervisor notified, etc."
            value={data.immediateActions}
            onChange={(e) => onUpdate({ immediateActions: e.target.value })}
            className="min-h-[100px] resize-y"
          />
          <p className="text-xs text-emphasis">
            Optional, but helps understand the response to the incident.
          </p>
        </div>
      </WizardStepSection>
    </div>
  )
}

DescriptionStep.displayName = 'DescriptionStep'

export default DescriptionStep
