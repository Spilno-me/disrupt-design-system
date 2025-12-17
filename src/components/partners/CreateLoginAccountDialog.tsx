"use client"

import * as React from "react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { cn } from "../../lib/utils"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog"
import { CreateLoginAccountData } from "./PartnerLoginAccountsPage"

// =============================================================================
// TYPES
// =============================================================================

export interface CreateLoginAccountDialogProps {
  /** Whether the dialog is open */
  open: boolean
  /** Callback when dialog open state changes */
  onOpenChange: (open: boolean) => void
  /** Callback when form is submitted */
  onSubmit: (data: CreateLoginAccountData) => void | Promise<void>
  /** Whether the form is currently submitting */
  isSubmitting?: boolean
}

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * CreateLoginAccountDialog - Dialog for creating a new login account
 *
 * Form fields:
 * - Email (required)
 * - First Name (required)
 * - Last Name (required)
 *
 * @example
 * ```tsx
 * <CreateLoginAccountDialog
 *   open={createDialogOpen}
 *   onOpenChange={setCreateDialogOpen}
 *   onSubmit={(data) => handleCreate(data)}
 *   isSubmitting={isCreating}
 * />
 * ```
 */
export function CreateLoginAccountDialog({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting = false,
}: CreateLoginAccountDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateLoginAccountData>({
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
    },
  })

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      reset({
        email: "",
        firstName: "",
        lastName: "",
      })
    }
  }, [open, reset])

  const handleFormSubmit = async (data: CreateLoginAccountData) => {
    await onSubmit(data)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-primary">
            Create Login Account
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 pt-2">
          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm text-primary">
              Email <span className="text-error">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="email@example.com"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              className={cn(errors.email && "border-error")}
            />
            {errors.email && (
              <p className="text-xs text-error">{errors.email.message}</p>
            )}
          </div>

          {/* Name Fields - Side by Side */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-sm text-primary">
                First Name <span className="text-error">*</span>
              </Label>
              <Input
                id="firstName"
                placeholder="First name"
                {...register("firstName", { required: "First name is required" })}
                className={cn(errors.firstName && "border-error")}
              />
              {errors.firstName && (
                <p className="text-xs text-error">{errors.firstName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-sm text-primary">
                Last Name <span className="text-error">*</span>
              </Label>
              <Input
                id="lastName"
                placeholder="Last name"
                {...register("lastName", { required: "Last name is required" })}
                className={cn(errors.lastName && "border-error")}
              />
              {errors.lastName && (
                <p className="text-xs text-error">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="accent"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Account"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateLoginAccountDialog
