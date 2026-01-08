import * as React from 'react'
import { AppCard, AppCardContent, AppCardHeader, AppCardTitle, AppCardDescription } from '../../../ui/app-card'
import { Label } from '../../../ui/label'
import { Textarea } from '../../../ui/textarea'

// =============================================================================
// TYPES
// =============================================================================

export interface InvoiceNotesCardProps {
  /** Invoice notes/terms */
  notes?: string
  /** Invoice description */
  description?: string
  /** Whether in edit mode */
  isEditing?: boolean
  /** Form register function (for edit mode) */
  register?: any
}

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * InvoiceNotesCard - Displays/edits invoice notes and description
 */
export function InvoiceNotesCard({
  notes,
  description,
  isEditing = false,
  register,
}: InvoiceNotesCardProps) {
  // Don't render in view mode if no content
  if (!isEditing && !notes && !description) return null

  if (isEditing) {
    return (
      <AppCard shadow="sm" role="group" aria-labelledby="notes-heading">
        <AppCardHeader>
          <AppCardTitle id="notes-heading" className="text-lg">Notes & Description</AppCardTitle>
          <AppCardDescription>Additional information for this invoice</AppCardDescription>
        </AppCardHeader>
        <AppCardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm text-primary">
              Description / Memo
            </Label>
            <Textarea
              id="description"
              placeholder="Enter invoice description..."
              {...register?.('description')}
              className="min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm text-primary">
              Notes / Terms
            </Label>
            <Textarea
              id="notes"
              placeholder="Enter payment terms or additional notes..."
              {...register?.('notes')}
              className="min-h-[80px]"
            />
          </div>
        </AppCardContent>
      </AppCard>
    )
  }

  // View mode
  return (
    <AppCard shadow="sm" role="group" aria-labelledby="notes-heading">
      <AppCardHeader>
        <AppCardTitle id="notes-heading" className="text-lg">Notes & Description</AppCardTitle>
      </AppCardHeader>
      <AppCardContent className="space-y-4">
        {description && (
          <div>
            <h4 className="text-sm font-semibold text-primary mb-2">Description</h4>
            <p className="text-sm text-primary leading-relaxed">{description}</p>
          </div>
        )}
        {notes && (
          <div className="p-4 rounded-lg bg-muted-bg border border-subtle">
            <h4 className="text-sm font-semibold text-primary mb-2">Notes</h4>
            <p className="text-sm text-muted leading-relaxed whitespace-pre-wrap">
              {notes}
            </p>
          </div>
        )}
      </AppCardContent>
    </AppCard>
  )
}

export default InvoiceNotesCard
