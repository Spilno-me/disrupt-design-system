/**
 * Action Materializer
 *
 * Renders action intentions (confirm, acknowledge, navigate) as appropriate
 * UI components based on resolution constraints:
 *
 * - Normal urgency → Simple button
 * - High urgency → Emphasized button
 * - Critical urgency → Confirmation dialog
 */

import * as React from 'react'
import { useState } from 'react'
import { AlertTriangle, Check, X } from 'lucide-react'
import { Button } from '../../../components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog'
import type { PatternMaterializer, MaterializerProps } from './types'
import { getFieldLabel } from './types'

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

/**
 * Simple confirmation buttons (Yes/No)
 */
function ConfirmationButtons({
  resolution,
  value,
  onChange,
  onSubmit,
  disabled,
}: MaterializerProps) {
  const label = getFieldLabel(resolution.sourceIntention)
  const isConfirmed = value === true

  const handleConfirm = () => {
    onChange(true)
    onSubmit?.()
  }

  const handleDecline = () => {
    onChange(false)
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm font-medium text-primary">{label}</p>
      <div className="flex gap-3">
        <Button
          type="button"
          variant={isConfirmed ? 'default' : 'outline'}
          onClick={handleConfirm}
          disabled={disabled}
          className="flex-1"
        >
          <Check className="w-4 h-4 mr-2" />
          Confirm
        </Button>
        <Button
          type="button"
          variant={value === false ? 'destructive' : 'outline'}
          onClick={handleDecline}
          disabled={disabled}
          className="flex-1"
        >
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
      </div>
    </div>
  )
}

/**
 * Confirmation dialog for critical actions
 */
function ConfirmationDialog({
  resolution,
  onChange,
  onSubmit,
  disabled,
}: MaterializerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const label = getFieldLabel(resolution.sourceIntention)
  const description = resolution.sourceIntention.subject.description

  const handleConfirm = () => {
    onChange(true)
    setIsOpen(false)
    onSubmit?.()
  }

  const handleCancel = () => {
    onChange(false)
    setIsOpen(false)
  }

  return (
    <>
      <Button
        type="button"
        variant="destructive"
        onClick={() => setIsOpen(true)}
        disabled={disabled}
      >
        <AlertTriangle className="w-4 h-4 mr-2" />
        {label}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-error" />
              {label}
            </DialogTitle>
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirm}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

/**
 * Acknowledge button (single action)
 */
function AcknowledgeButton({
  resolution,
  onChange,
  onSubmit,
  disabled,
}: MaterializerProps) {
  const label = getFieldLabel(resolution.sourceIntention)

  const handleClick = () => {
    onChange(true)
    onSubmit?.()
  }

  return (
    <Button
      type="button"
      variant="default"
      onClick={handleClick}
      disabled={disabled}
    >
      {label}
    </Button>
  )
}

/**
 * Navigate button
 */
function NavigateButton({
  resolution,
  onChange,
  onSubmit,
  disabled,
}: MaterializerProps) {
  const label = getFieldLabel(resolution.sourceIntention)

  const handleClick = () => {
    onChange(true)
    onSubmit?.()
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleClick}
      disabled={disabled}
    >
      {label}
    </Button>
  )
}

// =============================================================================
// ACTION MATERIALIZER
// =============================================================================

export const ActionMaterializer: PatternMaterializer = {
  pattern: 'action',

  canHandle: (resolution) => resolution.manifestation.pattern === 'action',

  render: (props) => {
    const { resolution } = props
    const { action } = resolution.sourceIntention
    const { urgency } = resolution.appliedConstraints.context

    // Critical urgency: Show dialog
    if (urgency === 'critical' && action === 'confirm') {
      return <ConfirmationDialog {...props} />
    }

    // Confirm action: Yes/No buttons
    if (action === 'confirm') {
      return <ConfirmationButtons {...props} />
    }

    // Navigate action
    if (action === 'navigate') {
      return <NavigateButton {...props} />
    }

    // Acknowledge action
    return <AcknowledgeButton {...props} />
  },
}
