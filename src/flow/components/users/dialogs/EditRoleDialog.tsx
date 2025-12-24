/**
 * EditRoleDialog - Dialog for editing existing custom roles
 *
 * Pre-populated with role's existing data and permissions.
 * Only available for custom roles (system roles cannot be edited).
 */

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { Edit2, Loader2, Search, Shield } from 'lucide-react'
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
  Role,
  EditRoleFormData,
  EnhancedPermission,
  PermissionResource,
} from '../types'

// =============================================================================
// TYPES
// =============================================================================

interface EditRoleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  role: Role | null
  availablePermissions: EnhancedPermission[]
  onSubmit: (data: EditRoleFormData) => Promise<void>
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
// HELPER: Extract permission IDs from role
// =============================================================================

function extractPermissionIds(role: Role): Set<string> {
  const ids = new Set<string>()
  role.permissions.forEach((permission) => {
    permission.actions.forEach((action) => {
      ids.add(`${permission.resource}-${action}`)
    })
  })
  return ids
}

// =============================================================================
// COMPONENT
// =============================================================================

export function EditRoleDialog({
  open,
  onOpenChange,
  role,
  availablePermissions,
  onSubmit,
  isSubmitting = false,
}: EditRoleDialogProps) {
  const [showDevMode, setShowDevMode] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedPermissions, setSelectedPermissions] = React.useState<
    Set<string>
  >(new Set())

  const form = useForm<Omit<EditRoleFormData, 'permissions'>>({
    defaultValues: {
      id: '',
      name: '',
      description: '',
    },
  })

  // Initialize form and permissions when role changes or dialog opens
  React.useEffect(() => {
    if (open && role) {
      form.reset({
        id: role.id,
        name: role.name,
        description: role.description || '',
      })
      setSelectedPermissions(extractPermissionIds(role))
      setSearchQuery('')
      setShowDevMode(false)
    }
  }, [open, role, form])

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
    async (data: Omit<EditRoleFormData, 'permissions'>) => {
      if (!role) return
      await onSubmit({
        ...data,
        id: role.id,
        permissions: Array.from(selectedPermissions),
      })
    },
    [onSubmit, role, selectedPermissions]
  )

  if (!role) return null

  // System roles cannot be edited
  if (role.isSystem) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-warning/10">
                <Shield className="size-5 text-warning" />
              </div>
              <div>
                <DialogTitle>Cannot Edit System Role</DialogTitle>
                <DialogDescription>
                  System roles are protected and cannot be modified
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <p className="text-sm text-secondary">
              The role "{role.name}" is a system role required for core
              application functionality. System roles cannot be modified or
              deleted.
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  const selectedCount = selectedPermissions.size

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-accent/10">
              <Edit2 className="size-5 text-accent" />
            </div>
            <div>
              <DialogTitle>Edit Role</DialogTitle>
              <DialogDescription>
                Modify the role configuration and permissions
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
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-tertiary" />
                  <Input
                    type="search"
                    placeholder="Search permissions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Checkbox
                    id="dev-mode-edit"
                    checked={showDevMode}
                    onCheckedChange={(checked) => setShowDevMode(checked as boolean)}
                  />
                  <Label
                    htmlFor="dev-mode-edit"
                    className="text-xs text-secondary cursor-pointer"
                  >
                    Dev Mode
                  </Label>
                </div>
              </div>

              {/* Permission Groups - Scrollable */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {groupedPermissions.size === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-default bg-muted-bg/30 py-8">
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
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

EditRoleDialog.displayName = 'EditRoleDialog'

export default EditRoleDialog
