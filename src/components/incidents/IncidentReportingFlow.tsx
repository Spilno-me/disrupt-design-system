/**
 * IncidentReportingFlow - Full-page incident reporting wizard
 *
 * Clean, focused experience for multi-step incident reporting.
 * No distractions, no filler content - just the task at hand.
 *
 * @example
 * ```tsx
 * // As a route/page
 * <IncidentReportingFlow
 *   onSubmit={(data) => saveIncident(data)}
 *   onCancel={() => navigate('/incidents')}
 *   locations={locationOptions}
 * />
 *
 * // As an overlay (full-screen modal)
 * <IncidentReportingFlow
 *   open={open}
 *   onOpenChange={setOpen}
 *   onSubmit={handleSubmit}
 *   onCancel={() => {}}
 *   variant="overlay"
 * />
 * ```
 */

import * as React from 'react'
import { useState, useCallback } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { ArrowLeft, X } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Button } from '../ui/button'
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
  /** Callback when form is submitted */
  onSubmit: (data: IncidentFormData) => void | Promise<void>
  /** Callback when user cancels/goes back (required for 'page' variant) */
  onCancel?: () => void
  /** Pre-populated form data (for editing) */
  initialData?: Partial<IncidentFormData>
  /** Available locations for the location picker */
  locations?: LocationOption[]
  /** Page title */
  title?: string
  /** Variant: 'page' renders inline, 'overlay' renders as full-screen modal */
  variant?: 'page' | 'overlay'
  /** For overlay variant: whether the overlay is open */
  open?: boolean
  /** For overlay variant: callback when open state changes */
  onOpenChange?: (open: boolean) => void
}

// =============================================================================
// PAGE CONTENT (shared between variants)
// =============================================================================

interface PageContentProps {
  formData: IncidentFormData
  onUpdate: (updates: Partial<IncidentFormData>) => void
  onSubmit: () => void | Promise<void>
  onCancel: () => void
  locations: LocationOption[]
  title: string
  showCloseButton?: boolean
}

function PageContent({
  formData,
  onUpdate,
  onSubmit,
  onCancel,
  locations,
  title,
  showCloseButton,
}: PageContentProps) {
  return (
    <div className="min-h-screen bg-page flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-surface/95 backdrop-blur-sm border-b border-default">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <button
            onClick={onCancel}
            className="flex items-center gap-2 text-sm text-secondary hover:text-primary transition-colors -ml-2 px-2 py-1.5 rounded-lg hover:bg-muted-bg"
          >
            <ArrowLeft className="size-4" />
            <span className="hidden sm:inline">Back</span>
          </button>

          <h1 className="text-base font-semibold text-primary">{title}</h1>

          {showCloseButton ? (
            <DialogPrimitive.Close asChild>
              <Button variant="ghost" size="sm" className="size-8 p-0 -mr-2">
                <X className="size-4" />
                <span className="sr-only">Close</span>
              </Button>
            </DialogPrimitive.Close>
          ) : (
            <div className="w-16" /> // Spacer for centering
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <div className="max-w-2xl w-full mx-auto px-4 sm:px-6 py-8 flex-1 flex flex-col">
          {/* Wizard Card */}
          <div className="bg-surface rounded-xl border border-default shadow-sm flex-1 flex flex-col min-h-0">
            <IncidentWizard
              data={formData}
              onUpdate={onUpdate}
              onSubmit={onSubmit}
              onCancel={onCancel}
              locations={locations}
            />
          </div>
        </div>
      </main>
    </div>
  )
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function IncidentReportingFlow({
  onSubmit,
  onCancel,
  initialData,
  locations = [],
  title = 'Report Incident',
  variant = 'page',
  open,
  onOpenChange,
}: IncidentReportingFlowProps) {
  // Form state
  const [formData, setFormData] = useState<IncidentFormData>(() => ({
    ...DEFAULT_FORM_DATA,
    ...initialData,
  }))

  // Update form data
  const handleUpdate = useCallback((updates: Partial<IncidentFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }))
  }, [])

  // Handle form submission
  const handleSubmit = useCallback(async () => {
    await onSubmit(formData)
    if (variant === 'overlay' && onOpenChange) {
      onOpenChange(false)
    }
  }, [formData, onSubmit, variant, onOpenChange])

  // Handle cancel
  const handleCancel = useCallback(() => {
    if (variant === 'overlay' && onOpenChange) {
      onOpenChange(false)
    } else {
      onCancel?.()
    }
  }, [variant, onOpenChange, onCancel])

  // Reset form when overlay closes
  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      if (!newOpen) {
        setFormData({ ...DEFAULT_FORM_DATA, ...initialData })
      }
      onOpenChange?.(newOpen)
    },
    [onOpenChange, initialData]
  )

  // Inline page variant
  if (variant === 'page') {
    return (
      <PageContent
        formData={formData}
        onUpdate={handleUpdate}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        locations={locations}
        title={title}
      />
    )
  }

  // Overlay variant (full-screen modal)
  return (
    <DialogPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Content
          className={cn(
            'fixed inset-0 z-50 bg-page',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:slide-out-to-bottom-4 data-[state=open]:slide-in-from-bottom-4',
            'duration-300'
          )}
        >
          <DialogPrimitive.Title className="sr-only">{title}</DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">
            Multi-step form to report an incident
          </DialogPrimitive.Description>
          <PageContent
            formData={formData}
            onUpdate={handleUpdate}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            locations={locations}
            title={title}
            showCloseButton
          />
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

IncidentReportingFlow.displayName = 'IncidentReportingFlow'

export default IncidentReportingFlow
