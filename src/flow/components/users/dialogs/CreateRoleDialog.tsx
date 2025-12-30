/**
 * CreateRoleDialog - Dialog for creating new custom roles
 *
 * Two sections: Role Information + Permission Selection
 * Includes developer mode toggle and permission search.
 */

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { Plus, Loader2, Search, Shield } from 'lucide-react'
import { cn } from '../../../../lib/utils'
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
import { Label } from '../../../../components/ui/label'
import { Checkbox } from '../../../../components/ui/checkbox'
import { Badge } from '../../../../components/ui/badge'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../../../components/ui/form'
import { PermissionGroup } from '../permissions/PermissionGroup'
import type {
  CreateRoleFormData,
  EnhancedPermission,
  PermissionResource,
} from '../types'

// =============================================================================
// TYPES
// =============================================================================

interface CreateRoleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  availablePermissions: EnhancedPermission[]
  onSubmit: (data: CreateRoleFormData) => Promise<void>
  isSubmitting?: boolean
}

// =============================================================================
// HELPER: Group permissions by resource
// =============================================================================

function groupPermissionsByResource(
  permissions: EnhancedPermission[]
): Map<PermissionResource, EnhancedPermission[]> {
  const grouped = new Map<PermissionResource, EnhancedPermission[]>()

  permissions.forEach((permission) => {
    const existing = grouped.get(permission.resource) || []
    grouped.set(permission.resource, [...existing, permission])
  })

  return grouped
}

// =============================================================================
// COMPONENT
// =============================================================================

export function CreateRoleDialog({
  open,
  onOpenChange,
  availablePermissions,
  onSubmit,
  isSubmitting = false,
}: CreateRoleDialogProps) {
  const [showDevMode, setShowDevMode] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedPermissions, setSelectedPermissions] = React.useState<
    Set<string>
  >(new Set())

  const form = useForm<Omit<CreateRoleFormData, 'permissions'>>({
    defaultValues: {
      name: '',
      description: '',
    },
  })

  // Reset state when dialog closes
  React.useEffect(() => {
    if (!open) {
      form.reset()
      setSelectedPermissions(new Set())
      setSearchQuery('')
      setShowDevMode(false)
    }
  }, [open, form])

  // Filter permissions by search query
  const filteredPermissions = React.useMemo(() => {
    if (!searchQuery.trim()) return availablePermissions

    const search = searchQuery.toLowerCase()
    return availablePermissions.filter(
      (p) =>
        p.label.toLowerCase().includes(search) ||
        p.resource.toLowerCase().includes(search) ||
        p.description?.toLowerCase().includes(search)
    )
  }, [availablePermissions, searchQuery])

  // Group filtered permissions by resource
  const groupedPermissions = React.useMemo(
    () => groupPermissionsByResource(filteredPermissions),
    [filteredPermissions]
  )

  // Handle permission toggle
  const handlePermissionToggle = React.useCallback(
    (permissionId: string, checked: boolean) => {
      setSelectedPermissions((prev) => {
        const next = new Set(prev)
        if (checked) {
          next.add(permissionId)
        } else {
          next.delete(permissionId)
        }
        return next
      })
    },
    []
  )

  // Handle form submission
  const handleSubmit = React.useCallback(
    async (data: Omit<CreateRoleFormData, 'permissions'>) => {
      await onSubmit({
        ...data,
        permissions: Array.from(selectedPermissions),
      })
    },
    [onSubmit, selectedPermissions]
  )

  const selectedCount = selectedPermissions.size

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-success/10">
              <Plus className="size-5 text-success" />
            </div>
            <div>
              <DialogTitle>Create New Role</DialogTitle>
              <DialogDescription>
                Define a custom role with specific permissions
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col flex-1 overflow-hidden gap-6"
          >
            {/* Role Information Section */}
            <fieldset className="rounded-lg border border-default p-4 space-y-4">
              <legend className="flex items-center gap-2 px-2 text-sm font-medium text-primary">
                <Shield className="size-4" />
                Role Information
              </legend>

              <FormField
                control={form.control}
                name="name"
                rules={{
                  required: 'Role name is required',
                  minLength: {
                    value: 3,
                    message: 'Role name must be at least 3 characters',
                  },
                  maxLength: {
                    value: 50,
                    message: 'Role name must be less than 50 characters',
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role Name *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter role name..."
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>
                      A unique, descriptive name for this role
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
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe what this role is used for..."
                        className="resize-none"
                        rows={2}
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>
                      Optional description of the role's purpose
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </fieldset>

            {/* Permissions Section */}
            <fieldset className="rounded-lg border border-default p-4 flex flex-col flex-1 overflow-hidden">
              <legend className="flex items-center gap-2 px-2 text-sm font-medium text-primary">
                <Shield className="size-4" />
                Permissions
                <Badge variant="secondary" size="sm" className="ml-1">
                  {selectedCount} selected
                </Badge>
              </legend>

              {/* Search and Dev Mode */}
              <div className="flex items-center gap-3 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-tertiary pointer-events-none" />
                  <Input
                    type="search"
                    placeholder="Search permissions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 md:pl-10"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Checkbox
                    id="dev-mode-create"
                    checked={showDevMode}
                    onCheckedChange={(checked) => setShowDevMode(checked as boolean)}
                  />
                  <Label
                    htmlFor="dev-mode-create"
                    className="text-xs text-secondary cursor-pointer"
                  >
                    Dev Mode
                  </Label>
                </div>
              </div>

              {/* Permission Groups - Scrollable */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {groupedPermissions.size === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-default bg-surface py-8">
                    <Shield className="size-8 text-tertiary" />
                    <p className="text-sm text-secondary">
                      {searchQuery
                        ? 'No permissions match your search'
                        : 'No permissions available'}
                    </p>
                  </div>
                ) : (
                  Array.from(groupedPermissions.entries()).map(
                    ([resource, permissions]) => (
                      <PermissionGroup
                        key={resource}
                        resource={resource}
                        permissions={permissions}
                        selectedIds={Array.from(selectedPermissions)}
                        onToggle={handlePermissionToggle}
                        showBitmask={showDevMode}
                      />
                    )
                  )
                )}
              </div>
            </fieldset>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || selectedCount === 0}>
                {isSubmitting && (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                )}
                Create Role
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

CreateRoleDialog.displayName = 'CreateRoleDialog'

export default CreateRoleDialog
