/**
 * EditEntryDialog - Dialog for editing dictionary entries
 *
 * Shows entry details with system item warning.
 * Follows DDS dialog patterns with fieldset grouping.
 */

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { Edit2, Loader2, Database, FileText, Info, Folder, Hash, GitBranch, AlertTriangle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../../components/ui/dialog'
import { Button } from '../../../../components/ui/button'
import { Input } from '../../../../components/ui/input'
import { Textarea } from '../../../../components/ui/textarea'
import { Badge } from '../../../../components/ui/badge'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../../../components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../components/ui/select'
import type { DictionaryCategory, DictionaryEntry, EditEntryFormData } from '../types'
import {
  buildEntryTree,
  getValidParentOptions,
  getEntryDepth,
  countEntryDescendants,
  MAX_ENTRY_DEPTH,
} from '../types'

// =============================================================================
// TYPES
// =============================================================================

interface EditEntryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category: DictionaryCategory | null
  entry: DictionaryEntry | null
  onSubmit: (data: EditEntryFormData) => Promise<void>
  isSubmitting?: boolean
  /** All entries in the current category (for parent selection) */
  entries?: DictionaryEntry[]
}

// =============================================================================
// COMPONENT
// =============================================================================

export function EditEntryDialog({
  open,
  onOpenChange,
  category,
  entry,
  onSubmit,
  isSubmitting = false,
  entries = [],
}: EditEntryDialogProps) {
  const form = useForm<EditEntryFormData>({
    defaultValues: {
      id: '',
      code: '',
      value: '',
      description: '',
      parentId: null,
    },
  })

  const descriptionValue = form.watch('description') || ''
  const currentParentId = form.watch('parentId')

  // Get valid parent options (exclude current entry and its descendants)
  const parentOptions = React.useMemo(() => {
    if (!entries.length || !entry) return []
    const tree = buildEntryTree(entries)
    return getValidParentOptions(tree, entry.id)
  }, [entries, entry])

  // Check if entry has children (for warning when changing parent)
  const hasChildren = React.useMemo(() => {
    if (!entry) return false
    return countEntryDescendants(entry) > 0 || entries.some((e) => e.parentId === entry.id)
  }, [entry, entries])

  // Check if parent is being changed
  const isParentChanging = React.useMemo(() => {
    if (!entry) return false
    return currentParentId !== entry.parentId
  }, [entry, currentParentId])

  // Initialize form when entry changes
  React.useEffect(() => {
    if (open && entry) {
      form.reset({
        id: entry.id,
        code: entry.code,
        value: entry.value,
        description: entry.description || '',
        parentId: entry.parentId,
      })
    }
  }, [open, entry, form])

  // Handle form submission
  const handleSubmit = React.useCallback(
    async (data: EditEntryFormData) => {
      await onSubmit(data)
    },
    [onSubmit]
  )

  if (!entry || !category) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-success/10">
              <Edit2 className="size-5 text-success" />
            </div>
            <DialogTitle>Edit Dictionary Item</DialogTitle>
          </div>
          <DialogDescription className="pt-2">
            Update the details for this dictionary item
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col gap-6"
          >
            {/* Entry Details Fieldset */}
            <fieldset className="rounded-lg border border-default p-4 space-y-4">
              <legend className="flex items-center gap-2 px-2 text-sm font-medium text-primary">
                <Database className="size-4" />
                Dictionary Item Details
              </legend>

              {/* Category (read-only) */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-primary">
                  <Folder className="size-4" />
                  Category
                </label>
                <div className="flex items-center justify-between rounded-md border border-default bg-muted-bg/50 px-3 py-2">
                  <span className="text-sm font-medium text-primary">
                    {category.name}
                  </span>
                  {category.type === 'system' && (
                    <Badge variant="secondary" size="sm">
                      System
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-secondary">
                  To move this item to another category, use the Move option from the actions menu.
                </p>
              </div>

              {/* Parent Entry (optional) */}
              {parentOptions.length > 0 && (
                <FormField
                  control={form.control}
                  name="parentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <GitBranch className="size-4" />
                        Parent Entry
                      </FormLabel>
                      <Select
                        value={field.value || '__none__'}
                        onValueChange={(value) => field.onChange(value === '__none__' ? null : value)}
                        disabled={isSubmitting}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="None (root entry)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="__none__">
                            <span className="text-tertiary">None (root entry)</span>
                          </SelectItem>
                          {parentOptions.map((parentEntry) => {
                            const depth = getEntryDepth(parentOptions, parentEntry.id)
                            return (
                              <SelectItem
                                key={parentEntry.id}
                                value={parentEntry.id}
                                style={{ paddingLeft: `${8 + depth * 12}px` }}
                              >
                                {parentEntry.value}
                              </SelectItem>
                            )
                          })}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-secondary">
                        Change parent to reorganize hierarchy (max {MAX_ENTRY_DEPTH} levels deep)
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Warning when changing parent with children */}
              {hasChildren && isParentChanging && (
                <div className="flex gap-3 rounded-lg border border-warning/30 bg-warning/5 p-3">
                  <AlertTriangle className="size-4 shrink-0 text-warning mt-0.5" />
                  <p className="text-sm text-warning">
                    This entry has child items. Moving it will also move all its descendants.
                  </p>
                </div>
              )}

              {/* Code */}
              <FormField
                control={form.control}
                name="code"
                rules={{
                  required: 'Code is required',
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code *</FormLabel>
                    <FormControl>
                      <Input
                        className="font-mono"
                        {...field}
                        disabled={isSubmitting || entry.isSystem}
                      />
                    </FormControl>
                    <div className="flex items-start gap-2 text-xs text-secondary">
                      <Info className="size-3.5 mt-0.5 shrink-0" />
                      <span>
                        Code is automatically generated from the value and must be unique across all categories.
                      </span>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Value */}
              <FormField
                control={form.control}
                name="value"
                rules={{
                  required: 'Value is required',
                  minLength: {
                    value: 1,
                    message: 'Value is required',
                  },
                  maxLength: {
                    value: 100,
                    message: 'Value must be less than 100 characters',
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Hash className="size-4" />
                      Value *
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                rules={{
                  maxLength: {
                    value: 200,
                    message: 'Description must be less than 200 characters',
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <FileText className="size-4" />
                      Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        className="resize-none"
                        rows={3}
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <div className="flex justify-end">
                      <span className="text-xs text-secondary">
                        {descriptionValue.length}/200 characters
                      </span>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* System Item Warning */}
              {entry.isSystem && (
                <div className="flex gap-3 rounded-lg border border-warning/30 bg-warning/5 p-3">
                  <Info className="size-4 shrink-0 text-warning mt-0.5" />
                  <p className="text-sm text-warning">
                    This is a system dictionary item. You have super admin permissions to modify it.
                  </p>
                </div>
              )}
            </fieldset>

            <DialogFooter className="gap-2 sm:gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
                className="flex-1 sm:flex-none"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="default"
                disabled={isSubmitting}
                className="flex-1 sm:flex-none gap-2"
              >
                {isSubmitting ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Database className="size-4" />
                )}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

EditEntryDialog.displayName = 'EditEntryDialog'

export default EditEntryDialog
