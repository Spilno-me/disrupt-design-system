/**
 * ClassificationStep - Step 1 of Incident Wizard
 *
 * Fields:
 * - Category (required) - Type of incident
 * - Severity (required) - How serious
 * - Title (required) - Brief summary
 */

import * as React from 'react'
import { WizardStepHeader, WizardStepSection } from '../../provisioning/WizardStep'
import { Label } from '../../ui/label'
import { Input } from '../../ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select'
import { cn } from '../../../lib/utils'
import {
  type StepProps,
  INCIDENT_CATEGORIES,
  SEVERITY_LEVELS,
} from '../types'

// =============================================================================
// COMPONENT
// =============================================================================

export function ClassificationStep({ data, onUpdate }: StepProps) {
  return (
    <div className="space-y-8">
      <WizardStepHeader
        title="Classify the Incident"
        description="Help us understand what type of incident occurred and its severity"
      />

      <WizardStepSection className="space-y-6">
        {/* Category */}
        <div className="space-y-2">
          <Label htmlFor="category" className="text-sm font-medium">
            Incident Category <span className="text-error">*</span>
          </Label>
          <Select
            value={data.category}
            onValueChange={(value) => onUpdate({ category: value as typeof data.category })}
          >
            <SelectTrigger id="category" className="w-full">
              <SelectValue placeholder="Select incident type" />
            </SelectTrigger>
            <SelectContent>
              {INCIDENT_CATEGORIES.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Severity */}
        <div className="space-y-2">
          <Label htmlFor="severity" className="text-sm font-medium">
            Severity Level <span className="text-error">*</span>
          </Label>
          <Select
            value={data.severity}
            onValueChange={(value) => onUpdate({ severity: value as typeof data.severity })}
          >
            <SelectTrigger id="severity" className="w-full">
              <SelectValue placeholder="Select severity" />
            </SelectTrigger>
            <SelectContent>
              {SEVERITY_LEVELS.map((sev) => (
                <SelectItem key={sev.value} value={sev.value}>
                  <span className="flex items-center gap-2">
                    <span
                      className={cn(
                        'w-2 h-2 rounded-full',
                        sev.color === 'error' && 'bg-error',
                        sev.color === 'aging' && 'bg-aging',
                        sev.color === 'warning' && 'bg-warning',
                        sev.color === 'success' && 'bg-success'
                      )}
                    />
                    {sev.label}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {data.severity && (
            <p className="text-xs text-emphasis mt-1">
              {data.severity === 'critical' && 'Immediate action required. Life-threatening or major damage.'}
              {data.severity === 'high' && 'Urgent attention needed. Significant injury or damage risk.'}
              {data.severity === 'medium' && 'Needs attention soon. Moderate risk if unaddressed.'}
              {data.severity === 'low' && 'Minor incident. Low risk, can be addressed in normal course.'}
            </p>
          )}
        </div>

        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title" className="text-sm font-medium">
            Incident Title <span className="text-error">*</span>
          </Label>
          <Input
            id="title"
            placeholder="Brief summary of what happened"
            value={data.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            maxLength={100}
          />
          <p className="text-xs text-emphasis">
            {data.title.length}/100 characters
          </p>
        </div>
      </WizardStepSection>
    </div>
  )
}

ClassificationStep.displayName = 'ClassificationStep'

export default ClassificationStep
