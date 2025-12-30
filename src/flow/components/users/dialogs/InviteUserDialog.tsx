/**
 * InviteUserDialog - Compact admin dialog for sending user invitations
 *
 * UX Improvements:
 * - Compact design (no scrolling modal)
 * - Only essential fields visible
 * - Glass layering for depth
 * - Sheet option for mobile
 *
 * Design decisions:
 * - 5 required fields only (within Miller's 7±2)
 * - Optional fields collapsed by default
 * - Proper glass/shadow depth per DDS rules
 */

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { Mail, Loader2, Send, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../components/ui/select'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../../../components/ui/form'
import type { Role } from '../types'

// =============================================================================
// TYPES
// =============================================================================

export interface InviteUserFormData {
  email: string
  firstName: string
  lastName: string
  roleId: string
  locationId: string
  /** Optional: pre-set job title */
  jobTitle?: string
  /** Optional: pre-set department */
  department?: string
  /** Custom message to include in invitation email */
  customMessage?: string
}

export interface LocationOption {
  id: string
  name: string
  type: string
}

export interface InviteUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Available roles for assignment */
  roles: Role[]
  /** Available locations for assignment */
  locations: LocationOption[]
  /** Callback when invitation is sent */
  onInvite: (data: InviteUserFormData) => Promise<void>
  /** Loading state */
  isSubmitting?: boolean
}

// =============================================================================
// SUCCESS STATE
// =============================================================================

interface InviteSuccessProps {
  email: string
  onClose: () => void
  onInviteAnother: () => void
}

function InviteSuccess({ email, onClose, onInviteAnother }: InviteSuccessProps) {
  return (
    <div className="flex flex-col items-center text-center py-6 space-y-4">
      {/* Success icon with glass effect */}
      <div className="flex size-16 items-center justify-center rounded-full bg-success/20 dark:bg-success/20 border-2 border-success/40 shadow-md">
        <CheckCircle2 className="size-8 text-success" />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-primary">Invitation Sent!</h3>
        <p className="text-sm text-secondary max-w-sm">
          An invitation email has been sent to{' '}
          <span className="font-medium text-primary">{email}</span>.
          They'll receive instructions to set up their account.
        </p>
      </div>
      <div className="flex gap-3 pt-2">
        <Button variant="outline" onClick={onClose}>
          Done
        </Button>
        <Button onClick={onInviteAnother}>
          <Mail className="size-4 mr-2" />
          Invite Another
        </Button>
      </div>
    </div>
  )
}

// =============================================================================
// COMPONENT
// =============================================================================

export function InviteUserDialog({
  open,
  onOpenChange,
  roles,
  locations,
  onInvite,
  isSubmitting = false,
}: InviteUserDialogProps) {
  const [showSuccess, setShowSuccess] = React.useState(false)
  const [invitedEmail, setInvitedEmail] = React.useState('')
  const [showOptional, setShowOptional] = React.useState(false)

  const form = useForm<InviteUserFormData>({
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      roleId: '',
      locationId: '',
      jobTitle: '',
      department: '',
      customMessage: '',
    },
  })

  const handleSubmit = React.useCallback(
    async (data: InviteUserFormData) => {
      await onInvite(data)
      setInvitedEmail(data.email)
      setShowSuccess(true)
    },
    [onInvite]
  )

  const handleInviteAnother = React.useCallback(() => {
    form.reset()
    setShowSuccess(false)
    setInvitedEmail('')
    setShowOptional(false)
  }, [form])

  const handleClose = React.useCallback(() => {
    onOpenChange(false)
    // Reset after close animation
    setTimeout(() => {
      form.reset()
      setShowSuccess(false)
      setInvitedEmail('')
      setShowOptional(false)
    }, 200)
  }, [onOpenChange, form])

  // Reset form when dialog closes
  React.useEffect(() => {
    if (!open) {
      setTimeout(() => {
        form.reset()
        setShowSuccess(false)
        setInvitedEmail('')
        setShowOptional(false)
      }, 200)
    }
  }, [open, form])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Dialog with proper glass layering: Depth 1 (Elevated) */}
      <DialogContent className="max-w-md bg-white/60 dark:bg-black/60 backdrop-blur-[8px] border-2 border-accent shadow-lg">
        {showSuccess ? (
          <InviteSuccess
            email={invitedEmail}
            onClose={handleClose}
            onInviteAnother={handleInviteAnother}
          />
        ) : (
          <>
            <DialogHeader>
              <div className="flex items-center gap-3">
                {/* Icon with glass effect */}
                <div className="flex size-10 items-center justify-center rounded-lg bg-accent/20 dark:bg-accent/20 border-2 border-accent/40">
                  <Mail className="size-5 text-accent" />
                </div>
                <div>
                  <DialogTitle>Invite User</DialogTitle>
                  <DialogDescription>
                    Send an invitation to join your organization
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                {/* Email - Most important field first */}
                <FormField
                  control={form.control}
                  name="email"
                  rules={{
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Please enter a valid email',
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="employee@company.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Name row - Compact 2-column */}
                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="firstName"
                    rules={{ required: 'Required' }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="First" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    rules={{ required: 'Required' }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Last" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Role & Location row - Compact 2-column */}
                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="roleId"
                    rules={{ required: 'Required' }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {roles.map((role) => (
                              <SelectItem key={role.id} value={role.id}>
                                {role.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="locationId"
                    rules={{ required: 'Required' }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {locations.map((location) => (
                              <SelectItem key={location.id} value={location.id}>
                                {location.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Optional fields - Collapsible */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setShowOptional(!showOptional)}
                    className="flex items-center gap-2 text-sm text-secondary hover:text-primary transition-colors w-full"
                  >
                    {showOptional ? (
                      <ChevronUp className="size-4" />
                    ) : (
                      <ChevronDown className="size-4" />
                    )}
                    <span>Optional details</span>
                  </button>

                  {showOptional && (
                    <div className="mt-3 space-y-3 pt-3 border-t border-default">
                      <div className="grid grid-cols-2 gap-3">
                        <FormField
                          control={form.control}
                          name="jobTitle"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-secondary">Job Title</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Manager" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="department"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-secondary">Department</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Operations" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="customMessage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-secondary">Personal Message</FormLabel>
                            <FormControl>
                              <Input placeholder="Welcome to the team!" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>

                <DialogFooter className="pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <Loader2 className="mr-2 size-4 animate-spin" />
                    ) : (
                      <Send className="mr-2 size-4" />
                    )}
                    Send Invitation
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

InviteUserDialog.displayName = 'InviteUserDialog'

export default InviteUserDialog
