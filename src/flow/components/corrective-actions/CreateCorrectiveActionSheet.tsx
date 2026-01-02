/**
 * CreateCorrectiveActionSheet
 *
 * Sheet component for creating a new corrective action.
 * Multi-step form with validation for all required EMEX fields.
 */

import { useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { PRIORITY_CONFIG, VALID_PRIORITIES } from './helpers'
import type {
  CorrectiveActionPriority,
  UserReference,
  LocationReference,
  DepartmentReference,
  DictionaryReference,
} from './types'

export interface CreateCorrectiveActionSheetProps {
  /** Whether the sheet is open */
  open: boolean
  /** Handler for open state changes */
  onOpenChange: (open: boolean) => void
  /** Submit handler */
  onSubmit: (data: CreateCorrectiveActionData) => void | Promise<void>
  /** Available action types */
  actionTypes?: DictionaryReference[]
  /** Available categories */
  categories?: DictionaryReference[]
  /** Available source types */
  sourceTypes?: DictionaryReference[]
  /** Available users for assignment */
  users?: UserReference[]
  /** Available departments */
  departments?: DepartmentReference[]
  /** Available locations */
  locations?: LocationReference[]
  /** Loading state */
  isLoading?: boolean
}

export interface CreateCorrectiveActionData {
  title: string
  description: string
  priority: CorrectiveActionPriority
  dueDate: string
  actionOwnerId?: string
  responsibleDepartmentId?: string
  locationId?: string
  actionTypeId?: string
  categoryId?: string
  sourceTypeId?: string
  sourceReferenceNumber?: string
  rootCauseAnalysis?: string
  implementationPlan?: string
  verificationMethod?: string
  successCriteria?: string
  estimatedCost?: number
}

export function CreateCorrectiveActionSheet({
  open,
  onOpenChange,
  onSubmit,
  actionTypes = [],
  categories = [],
  sourceTypes = [],
  users = [],
  departments = [],
  locations = [],
  isLoading = false,
}: CreateCorrectiveActionSheetProps) {
  // Form state
  const [formData, setFormData] = useState<Partial<CreateCorrectiveActionData>>({
    priority: 'medium',
  })
  const [error, setError] = useState<string | null>(null)

  const updateField = <K extends keyof CreateCorrectiveActionData>(
    field: K,
    value: CreateCorrectiveActionData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validation
    if (!formData.title?.trim()) {
      setError('Title is required')
      return
    }
    if (!formData.description?.trim()) {
      setError('Description is required')
      return
    }
    if (!formData.dueDate) {
      setError('Due date is required')
      return
    }

    try {
      await onSubmit({
        title: formData.title.trim(),
        description: formData.description.trim(),
        priority: formData.priority || 'medium',
        dueDate: formData.dueDate,
        actionOwnerId: formData.actionOwnerId,
        responsibleDepartmentId: formData.responsibleDepartmentId,
        locationId: formData.locationId,
        actionTypeId: formData.actionTypeId,
        categoryId: formData.categoryId,
        sourceTypeId: formData.sourceTypeId,
        sourceReferenceNumber: formData.sourceReferenceNumber?.trim(),
        rootCauseAnalysis: formData.rootCauseAnalysis?.trim(),
        implementationPlan: formData.implementationPlan?.trim(),
        verificationMethod: formData.verificationMethod?.trim(),
        successCriteria: formData.successCriteria?.trim(),
        estimatedCost: formData.estimatedCost,
      })
      // Reset form
      setFormData({ priority: 'medium' })
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create action')
    }
  }

  const handleCancel = () => {
    setFormData({ priority: 'medium' })
    setError(null)
    onOpenChange(false)
  }

  // Calculate min date (today)
  const today = new Date().toISOString().split('T')[0]

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Create Corrective Action</SheetTitle>
          <SheetDescription>
            Create a new corrective or preventive action
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-6">
          {/* Core Information */}
          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-primary">
              Core Information
            </h3>

            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Brief descriptive title"
                value={formData.title || ''}
                onChange={(e) => updateField('title', e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Detailed description of the corrective action..."
                value={formData.description || ''}
                onChange={(e) => updateField('description', e.target.value)}
                rows={3}
                disabled={isLoading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority">Priority *</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(v) =>
                    updateField('priority', v as CorrectiveActionPriority)
                  }
                  disabled={isLoading}
                >
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {VALID_PRIORITIES.map((p) => (
                      <SelectItem key={p} value={p}>
                        {PRIORITY_CONFIG[p].label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date *</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate || ''}
                  onChange={(e) => updateField('dueDate', e.target.value)}
                  min={today}
                  disabled={isLoading}
                />
              </div>
            </div>
          </section>

          <Separator />

          {/* Classification */}
          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-primary">Classification</h3>

            <div className="grid grid-cols-2 gap-4">
              {actionTypes.length > 0 && (
                <div className="space-y-2">
                  <Label htmlFor="actionType">Action Type</Label>
                  <Select
                    value={formData.actionTypeId}
                    onValueChange={(v) => updateField('actionTypeId', v)}
                    disabled={isLoading}
                  >
                    <SelectTrigger id="actionType">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {actionTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {categories.length > 0 && (
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.categoryId}
                    onValueChange={(v) => updateField('categoryId', v)}
                    disabled={isLoading}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {sourceTypes.length > 0 && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sourceType">Source Type</Label>
                  <Select
                    value={formData.sourceTypeId}
                    onValueChange={(v) => updateField('sourceTypeId', v)}
                    disabled={isLoading}
                  >
                    <SelectTrigger id="sourceType">
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      {sourceTypes.map((source) => (
                        <SelectItem key={source.id} value={source.id}>
                          {source.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sourceRef">Source Reference</Label>
                  <Input
                    id="sourceRef"
                    placeholder="e.g., INC-2025-042"
                    value={formData.sourceReferenceNumber || ''}
                    onChange={(e) =>
                      updateField('sourceReferenceNumber', e.target.value)
                    }
                    disabled={isLoading}
                  />
                </div>
              </div>
            )}
          </section>

          <Separator />

          {/* Assignment */}
          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-primary">Assignment</h3>

            <div className="grid grid-cols-2 gap-4">
              {users.length > 0 && (
                <div className="space-y-2">
                  <Label htmlFor="owner">Action Owner</Label>
                  <Select
                    value={formData.actionOwnerId}
                    onValueChange={(v) => updateField('actionOwnerId', v)}
                    disabled={isLoading}
                  >
                    <SelectTrigger id="owner">
                      <SelectValue placeholder="Select owner" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.firstName} {user.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {departments.length > 0 && (
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select
                    value={formData.responsibleDepartmentId}
                    onValueChange={(v) =>
                      updateField('responsibleDepartmentId', v)
                    }
                    disabled={isLoading}
                  >
                    <SelectTrigger id="department">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {locations.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Select
                  value={formData.locationId}
                  onValueChange={(v) => updateField('locationId', v)}
                  disabled={isLoading}
                >
                  <SelectTrigger id="location">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((loc) => (
                      <SelectItem key={loc.id} value={loc.id}>
                        {loc.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </section>

          <Separator />

          {/* Implementation Details */}
          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-primary">
              Implementation Details
            </h3>

            <div className="space-y-2">
              <Label htmlFor="rootCause">Root Cause Analysis</Label>
              <Textarea
                id="rootCause"
                placeholder="Describe the root cause..."
                value={formData.rootCauseAnalysis || ''}
                onChange={(e) => updateField('rootCauseAnalysis', e.target.value)}
                rows={2}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="implementationPlan">Implementation Plan</Label>
              <Textarea
                id="implementationPlan"
                placeholder="Steps to implement the corrective action..."
                value={formData.implementationPlan || ''}
                onChange={(e) => updateField('implementationPlan', e.target.value)}
                rows={3}
                disabled={isLoading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="verification">Verification Method</Label>
                <Input
                  id="verification"
                  placeholder="How to verify success"
                  value={formData.verificationMethod || ''}
                  onChange={(e) => updateField('verificationMethod', e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cost">Estimated Cost ($)</Label>
                <Input
                  id="cost"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formData.estimatedCost || ''}
                  onChange={(e) =>
                    updateField(
                      'estimatedCost',
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="successCriteria">Success Criteria</Label>
              <Input
                id="successCriteria"
                placeholder="What defines success?"
                value={formData.successCriteria || ''}
                onChange={(e) => updateField('successCriteria', e.target.value)}
                disabled={isLoading}
              />
            </div>
          </section>

          {/* Error message */}
          {error && (
            <div className="rounded-lg bg-error/10 border border-error/20 p-3 text-sm text-error">
              {error}
            </div>
          )}
        </form>

        <SheetFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? 'Creating...' : 'Create Action'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export default CreateCorrectiveActionSheet
