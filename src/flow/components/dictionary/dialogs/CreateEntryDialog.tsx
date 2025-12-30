/**
 * CreateEntryDialog - Dialog for creating new dictionary entries
 *
 * Shows category context, auto-generates code from value.
 * Follows DDS dialog patterns with fieldset grouping.
 */

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { Plus, Loader2, Database, Tag, Code2, FileText, GitBranch } from 'lucide-react'
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
import type { DictionaryCategory, DictionaryEntry, CreateEntryFormData } from '../types'
import { generateCode, getValidParentOptions, getEntryDepth, buildEntryTree, MAX_ENTRY_DEPTH } from '../types'

// =============================================================================
// TYPES
// =============================================================================

interface CreateEntryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category: DictionaryCategory | null
  onSubmit: (data: CreateEntryFormData) => Promise<void>
  isSubmitting?: boolean
  /** All entries in the current category (for parent selection) */
  entries?: DictionaryEntry[]
  /** Default values for pre-filling the form (e.g., when duplicating an entry) */
  defaultValues?: {
    value?: string
    description?: string
    parentId?: string | null
  }
}

// =============================================================================
// COMPONENT
// =============================================================================

export function CreateEntryDialog({
  open,
  onOpenChange,
  category,
  onSubmit,
  isSubmitting = false,
  entries = [],
  defaultValues,
}: CreateEntryDialogProps) {
  const form = useForm<Omit<CreateEntryFormData, 'categoryId'>>({
    defaultValues: {
      value: '',
      description: '',
      parentId: null,
    },
  })

  // Get valid parent options (entries that can have children)
  const parentOptions = React.useMemo(() => {
    if (!entries.length) return []
    // Build tree first to get proper depth info
    const tree = buildEntryTree(entries)
    return getValidParentOptions(tree)
  }, [entries])

  const valueInput = form.watch('value') || ''
  const descriptionValue = form.watch('description') || ''

  // Generate code preview from category code + value
  const generatedCode = React.useMemo(() => {
    if (!valueInput.trim() || !category) return ''
    return generateCode(valueInput, category.code)
  }, [valueInput, category])

  // Reset form when dialog closes, apply defaultValues when opening with them
  React.useEffect(() => {
    if (!open) {
      form.reset({ value: '', description: '', parentId: null })
    } else if (defaultValues) {
      // Pre-fill form with defaultValues (e.g., when duplicating)
      // Append "(Copy)" to value to indicate it's a duplicate
      form.reset({
        value: defaultValues.value ? `${defaultValues.value} (Copy)` : '',
        description: defaultValues.description || '',
        parentId: defaultValues.parentId ?? null,
      })
    }
  }, [open, form, defaultValues])

  // Handle form submission
  const handleSubmit = React.useCallback(
    async (data: Omit<CreateEntryFormData, 'categoryId'>) => {
      if (!category) return
      await onSubmit({
        ...data,
        categoryId: category.id,
      })
    },
    [onSubmit, category]
  )

  if (!category) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-accent/10">
              <Plus className="size-5 text-accent" />
            </div>
            <DialogTitle>Create New Dictionary Entry</DialogTitle>
          </div>
          <DialogDescription className="pt-2">
            Add a new dictionary entry to organize and standardize your system values.
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
                Dictionary Entry Details
              </legend>

              {/* Category (read-only) */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-primary">Category</label>
                <div className="flex items-center gap-2 rounded-md border border-default bg-muted-bg/50 px-3 py-2">
                  <Database className="size-4 text-tertiary" />
                  <span className="text-sm font-medium text-primary">
                    {category.name}
                  </span>
                </div>
                <p className="text-xs text-secondary">
                  Items are created in the selected category. Use the category filter to select a different category before creating new items.
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
                          {parentOptions.map((entry) => {
                            const depth = getEntryDepth(parentOptions, entry.id)
                            return (
                              <SelectItem
                                key={entry.id}
                                value={entry.id}
                                style={{ paddingLeft: `${8 + depth * 12}px` }}
                              >
                                {entry.value}
                              </SelectItem>
                            )
                          })}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-secondary">
                        Select a parent to create a nested entry (max {MAX_ENTRY_DEPTH} levels deep)
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Display Value */}
              <FormField
                control={form.control}
                name="value"
                rules={{
                  required: 'Display value is required',
                  minLength: {
                    value: 1,
                    message: 'Display value is required',
                  },
                  maxLength: {
                    value: 100,
                    message: 'Display value must be less than 100 characters',
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Value *</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Tag className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-tertiary pointer-events-none" />
                        <Input
                          placeholder="e.g., High Priority, Active"
                          className="pl-10 md:pl-10"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Generated Code Preview */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-primary">
                  <Code2 className="size-4" />
                  Generated Code
                </label>
                <div className="flex items-center gap-2 rounded-md border border-default bg-muted-bg/50 px-3 py-2">
                  <Code2 className="size-4 text-tertiary" />
                  <code className="font-mono text-sm text-secondary">
                    {generatedCode || 'Enter a value to see generated code'}
                  </code>
                </div>
                <p className="text-xs text-secondary">
                  Code will be automatically generated from the display value with category prefix (e.g., category-value)
                </p>
              </div>

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
                        placeholder="Optional description for this dictionary entry"
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
                disabled={isSubmitting || !valueInput.trim()}
                className="flex-1 sm:flex-none gap-2"
              >
                {isSubmitting ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Plus className="size-4" />
                )}
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

CreateEntryDialog.displayName = 'CreateEntryDialog'

export default CreateEntryDialog
