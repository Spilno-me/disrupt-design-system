/**
 * CompletionFormDialog
 *
 * Dialog for submitting completion of a corrective action.
 * Captures completion notes, effectiveness assessment, and evidence upload.
 */

import { useState } from 'react'
import { Upload, X, FileText } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { EFFECTIVENESS_CONFIG } from './helpers'
import type { CorrectiveAction, EffectivenessAssessment, EvidenceFile } from './types'

export interface CompletionFormDialogProps {
  /** Whether the dialog is open */
  open: boolean
  /** Handler for open state changes */
  onOpenChange: (open: boolean) => void
  /** The corrective action to complete */
  action: CorrectiveAction
  /** Submit handler */
  onSubmit: (data: CompletionFormData) => void | Promise<void>
  /** Loading state */
  isLoading?: boolean
}

export interface CompletionFormData {
  actionId: string
  completionNotes: string
  effectivenessAssessment: EffectivenessAssessment
  evidenceFiles: File[]
}

// Allowed effectiveness values for completion submission
const COMPLETION_EFFECTIVENESS_OPTIONS: EffectivenessAssessment[] = [
  'too-early',
  'not-effective',
  'partially-effective',
  'effective',
  'highly-effective',
]

export function CompletionFormDialog({
  open,
  onOpenChange,
  action,
  onSubmit,
  isLoading = false,
}: CompletionFormDialogProps) {
  const [completionNotes, setCompletionNotes] = useState('')
  const [effectiveness, setEffectiveness] = useState<EffectivenessAssessment>('too-early')
  const [files, setFiles] = useState<File[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setFiles((prev) => [...prev, ...newFiles])
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validation
    if (!completionNotes.trim()) {
      setError('Please provide completion notes')
      return
    }

    try {
      await onSubmit({
        actionId: action.id,
        completionNotes: completionNotes.trim(),
        effectivenessAssessment: effectiveness,
        evidenceFiles: files,
      })
      // Reset form
      setCompletionNotes('')
      setEffectiveness('too-early')
      setFiles([])
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit completion')
    }
  }

  const handleCancel = () => {
    setCompletionNotes('')
    setEffectiveness('too-early')
    setFiles([])
    setError(null)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Submit Completion</DialogTitle>
          <DialogDescription>
            Complete action{' '}
            <span className="font-mono text-primary">
              {action.referenceNumber}
            </span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Action title reminder */}
          <div className="rounded-lg bg-muted-bg p-3">
            <p className="text-sm font-medium text-primary">{action.title}</p>
          </div>

          {/* Completion notes */}
          <div className="space-y-2">
            <Label htmlFor="completionNotes">Completion Notes *</Label>
            <Textarea
              id="completionNotes"
              placeholder="Describe the actions taken and results achieved..."
              value={completionNotes}
              onChange={(e) => setCompletionNotes(e.target.value)}
              rows={4}
              required
              disabled={isLoading}
            />
          </div>

          {/* Effectiveness assessment */}
          <div className="space-y-2">
            <Label htmlFor="effectiveness">Effectiveness Assessment *</Label>
            <Select
              value={effectiveness}
              onValueChange={(v) => setEffectiveness(v as EffectivenessAssessment)}
              disabled={isLoading}
            >
              <SelectTrigger id="effectiveness">
                <SelectValue placeholder="Select effectiveness" />
              </SelectTrigger>
              <SelectContent>
                {COMPLETION_EFFECTIVENESS_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {EFFECTIVENESS_CONFIG[option].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-tertiary">
              {EFFECTIVENESS_CONFIG[effectiveness].description}
            </p>
          </div>

          {/* Evidence upload */}
          <div className="space-y-2">
            <Label>Evidence Files (Optional)</Label>
            <div className="border-2 border-dashed border-default rounded-lg p-4">
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
                id="evidence-upload"
                disabled={isLoading}
              />
              <label
                htmlFor="evidence-upload"
                className="flex flex-col items-center justify-center cursor-pointer"
              >
                <Upload className="h-8 w-8 text-tertiary mb-2" />
                <span className="text-sm text-secondary">
                  Click to upload evidence files
                </span>
                <span className="text-xs text-tertiary mt-1">
                  PDF, images, or documents
                </span>
              </label>
            </div>

            {/* File list */}
            {files.length > 0 && (
              <div className="space-y-2 mt-3">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded bg-surface border border-default p-2"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="h-4 w-4 text-tertiary shrink-0" />
                      <span className="text-sm text-primary truncate">
                        {file.name}
                      </span>
                      <span className="text-xs text-tertiary shrink-0">
                        ({(file.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => removeFile(index)}
                      disabled={isLoading}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove file</span>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Success criteria reminder if present */}
          {action.successCriteria && (
            <div className="rounded-lg bg-info/10 border border-info/20 p-3">
              <div className="text-xs text-info font-medium mb-1">
                Success Criteria
              </div>
              <p className="text-sm text-primary">{action.successCriteria}</p>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="rounded-lg bg-error/10 border border-error/20 p-3 text-sm text-error">
              {error}
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Submitting...' : 'Submit Completion'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CompletionFormDialog
