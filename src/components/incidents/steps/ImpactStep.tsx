/**
 * ImpactStep - Step 4 of Incident Wizard
 *
 * Fields:
 * - Injury Involved (boolean) - Was anyone injured?
 * - Medical Attention (boolean) - Was medical treatment needed?
 * - Witnesses (array) - Who else saw it?
 */

import * as React from 'react'
import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { WizardStepHeader, WizardStepSection } from '../../provisioning/WizardStep'
import { Label } from '../../ui/label'
import { Input } from '../../ui/input'
import { Button } from '../../ui/button'
import { Checkbox } from '../../ui/checkbox'
import { cn } from '../../../lib/utils'
import { type StepProps } from '../types'

// =============================================================================
// COMPONENT
// =============================================================================

export function ImpactStep({ data, onUpdate }: StepProps) {
  const [newWitness, setNewWitness] = useState('')

  const addWitness = () => {
    const trimmed = newWitness.trim()
    if (trimmed && !data.witnesses.includes(trimmed)) {
      onUpdate({ witnesses: [...data.witnesses, trimmed] })
      setNewWitness('')
    }
  }

  const removeWitness = (witness: string) => {
    onUpdate({ witnesses: data.witnesses.filter((w) => w !== witness) })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addWitness()
    }
  }

  return (
    <div className="space-y-8">
      <WizardStepHeader
        title="Impact Assessment"
        description="Help us understand the human impact of this incident"
      />

      <WizardStepSection title="Injury Information" className="space-y-4">
        {/* Injury Involved */}
        <div className="flex items-center gap-3 py-3 border-b border-default">
          <Checkbox
            id="injuryInvolved"
            checked={data.injuryInvolved}
            onCheckedChange={(checked: boolean) => {
              onUpdate({
                injuryInvolved: checked,
                // Reset medical attention if no injury
                medicalAttention: checked ? data.medicalAttention : false,
              })
            }}
          />
          <div className="space-y-0.5 flex-1">
            <Label htmlFor="injuryInvolved" className="text-sm font-medium cursor-pointer">
              Was anyone injured?
            </Label>
            <p className="text-xs text-emphasis">
              Include minor injuries that may not require treatment
            </p>
          </div>
        </div>

        {/* Medical Attention - only show if injury involved */}
        {data.injuryInvolved && (
          <div className="flex items-center gap-3 py-3 border-b border-default animate-in fade-in-0 slide-in-from-top-2">
            <Checkbox
              id="medicalAttention"
              checked={data.medicalAttention}
              onCheckedChange={(checked: boolean) => onUpdate({ medicalAttention: checked })}
            />
            <div className="space-y-0.5 flex-1">
              <Label htmlFor="medicalAttention" className="text-sm font-medium cursor-pointer">
                Medical attention required?
              </Label>
              <p className="text-xs text-emphasis">
                First aid, medical evaluation, or hospital visit
              </p>
            </div>
          </div>
        )}

        {/* Injury status summary */}
        {data.injuryInvolved && (
          <div
            className={cn(
              'p-3 rounded-lg text-sm animate-in fade-in-0',
              data.medicalAttention
                ? 'bg-error-light text-error-strong'
                : 'bg-warning-light text-warning-strong'
            )}
          >
            {data.medicalAttention
              ? 'Injury with medical attention required - This will be flagged as high priority.'
              : 'Injury reported - Please provide details in the description.'}
          </div>
        )}
      </WizardStepSection>

      <WizardStepSection title="Witnesses" className="space-y-4">
        <p className="text-sm text-emphasis">
          Add names of anyone who witnessed the incident. They may be contacted for additional information.
        </p>

        {/* Add witness input */}
        <div className="flex gap-2">
          <Input
            placeholder="Enter witness name"
            value={newWitness}
            onChange={(e) => setNewWitness(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={addWitness}
            disabled={!newWitness.trim()}
          >
            <Plus className="h-4 w-4" />
            <span className="sr-only">Add witness</span>
          </Button>
        </div>

        {/* Witness list */}
        {data.witnesses.length > 0 && (
          <div className="mt-4 space-y-2">
            {data.witnesses.map((witness, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-muted-bg rounded-lg"
              >
                <span className="text-sm">{witness}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => removeWitness(witness)}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove {witness}</span>
                </Button>
              </div>
            ))}
          </div>
        )}

        {data.witnesses.length === 0 && (
          <p className="text-xs text-emphasis mt-2">
            No witnesses added yet. This field is optional.
          </p>
        )}
      </WizardStepSection>
    </div>
  )
}

ImpactStep.displayName = 'ImpactStep'

export default ImpactStep
