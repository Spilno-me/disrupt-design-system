/**
 * CreateCategoryDialog - Dialog for creating new dictionary categories
 *
 * Form includes category name and optional description.
 * Follows DDS dialog patterns with fieldset grouping.
 */

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { Plus, Loader2, Database } from 'lucide-react'
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../../../components/ui/form'
import type { CreateCategoryFormData } from '../types'

// =============================================================================
// TYPES
// =============================================================================

interface CreateCategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CreateCategoryFormData) => Promise<void>
  isSubmitting?: boolean
}

// =============================================================================
// COMPONENT
// =============================================================================

export function CreateCategoryDialog({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting = false,
}: CreateCategoryDialogProps) {
  const form = useForm<CreateCategoryFormData>({
    defaultValues: {
      name: '',
      description: '',
    },
  })

  const descriptionValue = form.watch('description') || ''

  // Reset form when dialog closes
  React.useEffect(() => {
    if (!open) {
      form.reset()
    }
  }, [open, form])

  // Handle form submission
  const handleSubmit = React.useCallback(
    async (data: CreateCategoryFormData) => {
      await onSubmit(data)
    },
    [onSubmit]
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-accent/10">
              <Plus className="size-5 text-accent" />
            </div>
            <div>
              <DialogTitle>Create New Category</DialogTitle>
            </div>
          </div>
          <DialogDescription className="pt-2">
            Add a new category to organize your dictionary entries.
            Categories help group related dictionary values together.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col gap-6"
          >
            {/* Category Details Fieldset */}
            <fieldset className="rounded-lg border border-default p-4 space-y-4">
              <legend className="flex items-center gap-2 px-2 text-sm font-medium text-primary">
                <Database className="size-4" />
                Category Details
              </legend>

              <FormField
                control={form.control}
                name="name"
                rules={{
                  required: 'Category name is required',
                  minLength: {
                    value: 2,
                    message: 'Category name must be at least 2 characters',
                  },
                  maxLength: {
                    value: 50,
                    message: 'Category name must be less than 50 characters',
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Name *</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Database className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-tertiary pointer-events-none" />
                        <Input
                          placeholder="e.g., Issue Types, Priority Levels, Status Options"
                          className="pl-10 md:pl-10"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Enter a descriptive name for your category. A unique code will be
                      generated automatically.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                      <Database className="size-4" />
                      Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Optional description for this category"
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
                disabled={isSubmitting}
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

CreateCategoryDialog.displayName = 'CreateCategoryDialog'

export default CreateCategoryDialog
