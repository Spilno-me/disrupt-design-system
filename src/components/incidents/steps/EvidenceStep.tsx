/**
 * EvidenceStep - Step 5 of Incident Wizard
 *
 * Fields:
 * - Photos (file upload) - Evidence images
 * - Additional Notes (textarea) - Any other information
 * - Review Summary - Overview of all entered data
 */

import * as React from 'react'
import { useRef } from 'react'
import { Upload, X, Image, FileText, MapPin, Clock, AlertTriangle, Users } from 'lucide-react'
import { WizardStepHeader, WizardStepSection } from '../../provisioning/WizardStep'
import { Textarea } from '../../ui/textarea'
import { cn } from '../../../lib/utils'
import {
  type StepProps,
  INCIDENT_CATEGORIES,
  SEVERITY_LEVELS,
} from '../types'

// =============================================================================
// HELPERS
// =============================================================================

function getCategoryLabel(value: string): string {
  return INCIDENT_CATEGORIES.find((c) => c.value === value)?.label || value
}

function getSeverityLabel(value: string): string {
  return SEVERITY_LEVELS.find((s) => s.value === value)?.label || value
}

function getSeverityColor(value: string): string {
  const severity = SEVERITY_LEVELS.find((s) => s.value === value)
  if (!severity) return 'bg-slate'
  switch (severity.color) {
    case 'error': return 'bg-error'
    case 'aging': return 'bg-aging'
    case 'warning': return 'bg-warning'
    case 'success': return 'bg-success'
    default: return 'bg-slate'
  }
}

function formatDateTime(dateTime: string): string {
  if (!dateTime) return 'Not specified'
  try {
    return new Date(dateTime).toLocaleString()
  } catch {
    return dateTime
  }
}

// =============================================================================
// COMPONENT
// =============================================================================

export function EvidenceStep({ data, onUpdate }: StepProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const imageFiles = files.filter((f) => f.type.startsWith('image/'))
    onUpdate({ photos: [...data.photos, ...imageFiles] })
    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const removePhoto = (index: number) => {
    onUpdate({ photos: data.photos.filter((_, i) => i !== index) })
  }

  return (
    <div className="space-y-8">
      <WizardStepHeader
        title="Evidence & Review"
        description="Attach photos and review your report before submitting"
      />

      {/* Photo Upload */}
      <WizardStepSection title="Photo Evidence" className="space-y-4">
        <div className="space-y-4">
          {/* Upload area */}
          <div
            className={cn(
              'border-2 border-dashed border-default rounded-lg p-6 text-center cursor-pointer transition-colors',
              'hover:border-accent hover:bg-muted-bg/50'
            )}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                fileInputRef.current?.click()
              }
            }}
            tabIndex={0}
            role="button"
            aria-label="Upload photos"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
            <Upload className="h-8 w-8 mx-auto mb-2 text-emphasis" />
            <p className="text-sm font-medium">Click to upload photos</p>
            <p className="text-xs text-emphasis mt-1">
              PNG, JPG, or HEIC up to 10MB each
            </p>
          </div>

          {/* Photo previews */}
          {data.photos.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {data.photos.map((photo, index) => (
                <div key={index} className="relative group aspect-square">
                  <img
                    src={URL.createObjectURL(photo)}
                    alt={`Evidence ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute top-1 right-1 p-1 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3 text-white" />
                    <span className="sr-only">Remove photo</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          <p className="text-xs text-emphasis">
            {data.photos.length} photo{data.photos.length !== 1 ? 's' : ''} attached (optional)
          </p>
        </div>
      </WizardStepSection>

      {/* Additional Notes */}
      <WizardStepSection title="Additional Notes" className="space-y-2">
        <Textarea
          placeholder="Any other information that might be relevant..."
          value={data.additionalNotes}
          onChange={(e) => onUpdate({ additionalNotes: e.target.value })}
          className="min-h-[80px] resize-y"
        />
      </WizardStepSection>

      {/* Review Summary */}
      <WizardStepSection title="Review Your Report" className="space-y-4">
        <div className="bg-muted-bg rounded-lg p-6 space-y-4">
          {/* Classification */}
          <div className="flex items-start gap-3">
            <FileText className="h-5 w-5 text-emphasis shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-emphasis uppercase tracking-wide">Classification</p>
              <p className="text-sm font-medium truncate">{data.title || 'No title'}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-emphasis">{getCategoryLabel(data.category)}</span>
                <span className="text-emphasis">•</span>
                <span className="flex items-center gap-1 text-xs">
                  <span className={cn('w-2 h-2 rounded-full', getSeverityColor(data.severity))} />
                  {getSeverityLabel(data.severity)}
                </span>
              </div>
            </div>
          </div>

          {/* Location & Time */}
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-emphasis shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-emphasis uppercase tracking-wide">Location</p>
              <p className="text-sm">
                {data.location || 'Not specified'}
                {data.locationCode && ` (${data.locationCode})`}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-emphasis shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-emphasis uppercase tracking-wide">Date & Time</p>
              <p className="text-sm">{formatDateTime(data.dateTime)}</p>
            </div>
          </div>

          {/* Impact */}
          {(data.injuryInvolved || data.witnesses.length > 0) && (
            <>
              {data.injuryInvolved && (
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-error shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-emphasis uppercase tracking-wide">Injury</p>
                    <p className="text-sm text-error-strong">
                      Injury reported
                      {data.medicalAttention && ' - Medical attention required'}
                    </p>
                  </div>
                </div>
              )}

              {data.witnesses.length > 0 && (
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-emphasis shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-emphasis uppercase tracking-wide">Witnesses</p>
                    <p className="text-sm">{data.witnesses.join(', ')}</p>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Evidence */}
          {data.photos.length > 0 && (
            <div className="flex items-start gap-3">
              <Image className="h-5 w-5 text-emphasis shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-emphasis uppercase tracking-wide">Evidence</p>
                <p className="text-sm">{data.photos.length} photo{data.photos.length !== 1 ? 's' : ''} attached</p>
              </div>
            </div>
          )}
        </div>

        <p className="text-xs text-emphasis mt-4">
          Please review the information above before submitting. You can go back to any step to make changes.
        </p>
      </WizardStepSection>
    </div>
  )
}

EvidenceStep.displayName = 'EvidenceStep'

export default EvidenceStep
