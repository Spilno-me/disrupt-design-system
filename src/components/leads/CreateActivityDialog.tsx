import * as React from 'react'
import { useCallback, useState } from 'react'
import { Phone, Mail, Calendar, FileText, MessageSquare } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Button } from '../ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { DateTimePicker } from '../ui/date-time-picker'
import type { ActivityType } from './ActivityTimeline'

// =============================================================================
// TYPES
// =============================================================================

export interface CreateActivityFormData {
  /** Activity type */
  type: ActivityType
  /** Activity description */
  description: string
  /** Optional notes */
  notes?: string
  /** Scheduled date (for meetings/follow-ups) */
  scheduledDate?: Date
  /** Duration in minutes (for calls/meetings) */
  duration?: number
}

export interface CreateActivityDialogProps {
  /** Whether the dialog is open */
  open: boolean
  /** Callback when dialog should close */
  onOpenChange: (open: boolean) => void
  /** Lead ID this activity is for */
  leadId: string
  /** Lead name for display */
  leadName?: string
  /** Callback when activity is created */
  onSubmit: (data: CreateActivityFormData) => void | Promise<void>
  /** Additional className */
  className?: string
}

// =============================================================================
// CREATE ACTIVITY DIALOG COMPONENT
// =============================================================================

/**
 * CreateActivityDialog - Dialog for logging new lead activities
 *
 * Allows users to log calls, emails, meetings, notes, and follow-ups.
 * Supports scheduling future activities and adding duration for calls/meetings.
 *
 * @example
 * <CreateActivityDialog
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 *   leadId="lead-123"
 *   leadName="Acme Corp"
 *   onSubmit={(data) => createActivity(data)}
 * />
 */
export function CreateActivityDialog({
  open,
  onOpenChange,
  leadId: _leadId,
  leadName,
  onSubmit,
  className,
}: CreateActivityDialogProps) {
  const [formData, setFormData] = useState<CreateActivityFormData>({
    type: 'note',
    description: '',
    notes: '',
    scheduledDate: undefined,
    duration: undefined,
  })
  const [errors, setErrors] = useState<Partial<Record<keyof CreateActivityFormData, string>>>({})

  const activityTypes: {
    type: ActivityType
    label: string
    icon: React.ComponentType<{ className?: string }>
    colors: { selected: string; unselected: string; iconSelected: string; iconUnselected: string }
  }[] = [
    {
      type: 'call',
      label: 'Call',
      icon: Phone,
      colors: {
        selected: 'bg-info text-white border-info',
        unselected: 'bg-info-light dark:bg-info/20 border-info/30 text-info hover:border-info',
        iconSelected: 'text-white',
        iconUnselected: 'text-info',
      },
    },
    {
      type: 'email',
      label: 'Email',
      icon: Mail,
      colors: {
        selected: 'bg-accent-strong text-white border-accent-strong',
        unselected: 'bg-accent-bg dark:bg-accent/20 border-accent/30 text-accent hover:border-accent',
        iconSelected: 'text-white',
        iconUnselected: 'text-accent',
      },
    },
    {
      type: 'meeting',
      label: 'Meeting',
      icon: Calendar,
      colors: {
        selected: 'bg-warning-dark text-white border-warning-dark',
        unselected: 'bg-warning-light dark:bg-warning/20 border-warning/30 text-warning-dark dark:text-warning hover:border-warning',
        iconSelected: 'text-white',
        iconUnselected: 'text-warning-dark dark:text-warning',
      },
    },
    {
      type: 'note',
      label: 'Note',
      icon: FileText,
      colors: {
        selected: 'bg-slate-600 text-white border-slate-600 dark:bg-slate-400 dark:border-slate-400',
        unselected: 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-slate-400',
        iconSelected: 'text-white',
        iconUnselected: 'text-slate-600 dark:text-slate-300',
      },
    },
    {
      type: 'follow_up',
      label: 'Follow-up',
      icon: MessageSquare,
      colors: {
        selected: 'bg-muted text-white border-muted',
        unselected: 'bg-muted-bg dark:bg-muted/20 border-muted/30 text-muted hover:border-muted',
        iconSelected: 'text-white',
        iconUnselected: 'text-muted',
      },
    },
  ]

  const handleTypeSelect = useCallback((type: ActivityType) => {
    setFormData((prev) => ({ ...prev, type }))
    setErrors({})
  }, [])

  const handleChange = useCallback((field: keyof CreateActivityFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }, [errors])

  const validate = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof CreateActivityFormData, string>> = {}

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }

    if ((formData.type === 'meeting' || formData.type === 'follow_up') && !formData.scheduledDate) {
      newErrors.scheduledDate = 'Scheduled date is required for this activity type'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    await onSubmit(formData)
    
    // Reset form on success
    setFormData({ type: 'note', description: '', notes: '', scheduledDate: undefined, duration: undefined })
    setErrors({})
  }, [formData, onSubmit, validate])

  const handleClose = useCallback(() => {
    onOpenChange(false)
    setFormData({ type: 'note', description: '', notes: '', scheduledDate: undefined, duration: undefined })
    setErrors({})
  }, [onOpenChange])

  const showDuration = formData.type === 'call' || formData.type === 'meeting'
  const showScheduledDate = formData.type === 'meeting' || formData.type === 'follow_up'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn('sm:max-w-[500px]', className)}>
        <DialogHeader>
          <DialogTitle>Log Activity</DialogTitle>
          <DialogDescription>
            {leadName ? `Add an activity for ${leadName}` : 'Record a new activity for this lead'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Activity Type Selection */}
          <div className="space-y-2">
            <Label>Activity Type</Label>
            <div className="flex flex-wrap gap-2">
              {activityTypes.map(({ type, label, icon: Icon, colors }) => {
                const isSelected = formData.type === type
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleTypeSelect(type)}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors',
                      isSelected ? colors.selected : colors.unselected
                    )}
                  >
                    <Icon className={cn('w-4 h-4', isSelected ? colors.iconSelected : colors.iconUnselected)} />
                    {label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">
              Description <span className="text-error">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder="What happened or what was discussed..."
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
              className={cn(errors.description && 'border-error')}
            />
            {errors.description && (
              <p className="text-sm text-error">{errors.description}</p>
            )}
          </div>

          {/* Scheduled Date (for meetings/follow-ups) */}
          {showScheduledDate && (
            <div className="space-y-2">
              <Label>
                Scheduled Date <span className="text-error">*</span>
              </Label>
              <DateTimePicker
                value={formData.scheduledDate}
                onChange={(date) => setFormData((prev) => ({ ...prev, scheduledDate: date }))}
                placeholder="Select date and time"
                error={!!errors.scheduledDate}
              />
              {errors.scheduledDate && (
                <p className="text-sm text-error">{errors.scheduledDate}</p>
              )}
            </div>
          )}

          {/* Duration (for calls/meetings) */}
          {showDuration && (
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                min={1}
                max={480}
                placeholder="e.g., 30"
                value={formData.duration ?? ''}
                onChange={(e) => handleChange('duration', parseInt(e.target.value) || 0)}
              />
            </div>
          )}

          {/* Additional Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any additional context or follow-up items..."
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              rows={2}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">
              Log Activity
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateActivityDialog
