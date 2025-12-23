/**
 * IncidentReportingFlow - Responsive incident reporting wizard
 *
 * Displays a multi-step wizard for reporting incidents:
 * - Desktop: Side sheet that slides in from the right
 * - Mobile: Could be extended to full-page navigation
 *
 * @example
 * ```tsx
 * const [open, setOpen] = useState(false)
 *
 * <Button onClick={() => setOpen(true)}>Report Incident</Button>
 *
 * <IncidentReportingFlow
 *   open={open}
 *   onOpenChange={setOpen}
 *   onSubmit={(data) => console.log('Submitted:', data)}
 *   locations={[
 *     { value: 'bldg-a', label: 'Building A', group: 'Main Campus' },
 *     { value: 'bldg-b', label: 'Building B', group: 'Main Campus' },
 *   ]}
 * />
 * ```
 */

import * as React from 'react'
import { useState, useCallback } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '../ui/sheet'
import { IncidentWizard } from './IncidentWizard'
import {
  type IncidentFormData,
  DEFAULT_FORM_DATA,
  type LocationOption,
} from './types'

// =============================================================================
// TYPES
// =============================================================================

export interface IncidentReportingFlowProps {
  /** Whether the sheet/dialog is open */
  open: boolean
  /** Callback when open state changes */
  onOpenChange: (open: boolean) => void
  /** Callback when form is submitted */
  onSubmit: (data: IncidentFormData) => void | Promise<void>
  /** Pre-populated form data (for editing) */
  initialData?: Partial<IncidentFormData>
  /** Available locations for the location picker */
  locations?: LocationOption[]
  /** Custom title (default: "Report Incident") */
  title?: string
  /** Custom description (default: "Complete all steps...") */
  description?: string
}

// =============================================================================
// COMPONENT
// =============================================================================

export function IncidentReportingFlow({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  locations = [],
  title = 'Report Incident',
  description = 'Complete all steps to submit your incident report',
}: IncidentReportingFlowProps) {
  // Form state
  const [formData, setFormData] = useState<IncidentFormData>(() => ({
    ...DEFAULT_FORM_DATA,
    ...initialData,
  }))

  // Reset form when closed
  const handleOpenChange = useCallback((newOpen: boolean) => {
    if (!newOpen) {
      // Reset to initial state when closing
      setFormData({ ...DEFAULT_FORM_DATA, ...initialData })
    }
    onOpenChange(newOpen)
  }, [onOpenChange, initialData])

  // Update form data
  const handleUpdate = useCallback((updates: Partial<IncidentFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }))
  }, [])

  // Handle form submission
  const handleSubmit = useCallback(async () => {
    await onSubmit(formData)
    handleOpenChange(false)
  }, [formData, onSubmit, handleOpenChange])

  // Handle cancel
  const handleCancel = useCallback(() => {
    handleOpenChange(false)
  }, [handleOpenChange])

  // Desktop: Sheet from right
  // Mobile: For now, also use Sheet (could be extended to full-page route)
  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="right"
        hideCloseButton
        className="w-full max-w-[600px] sm:max-w-[600px]"
      >
        <SheetHeader className="px-6 pt-6 pb-0 shrink-0">
          <SheetTitle className="text-xl font-semibold">{title}</SheetTitle>
          <SheetDescription className="text-sm text-emphasis">
            {description}
          </SheetDescription>
        </SheetHeader>

        <IncidentWizard
          data={formData}
          onUpdate={handleUpdate}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          locations={locations}
        />
      </SheetContent>
    </Sheet>
  )
}

IncidentReportingFlow.displayName = 'IncidentReportingFlow'

export default IncidentReportingFlow
