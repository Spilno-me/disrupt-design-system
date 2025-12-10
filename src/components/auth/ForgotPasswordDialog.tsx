"use client"

import * as React from "react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog"
import {
  ForgotPasswordForm,
  type ForgotPasswordFormValues,
} from "./ForgotPasswordForm"

// =============================================================================
// FORGOT PASSWORD DIALOG TYPES
// =============================================================================

export interface ForgotPasswordDialogProps {
  /** Whether the dialog is open */
  open?: boolean
  /** Callback when the dialog open state changes */
  onOpenChange?: (open: boolean) => void
  /** Callback when form is submitted with valid data */
  onSubmit?: (values: ForgotPasswordFormValues) => void | Promise<void>
  /** Loading state for submit button */
  isLoading?: boolean
}

// =============================================================================
// FORGOT PASSWORD DIALOG COMPONENT
// =============================================================================

export function ForgotPasswordDialog({
  open,
  onOpenChange,
  onSubmit,
  isLoading = false,
}: ForgotPasswordDialogProps) {
  const handleBackToLogin = () => {
    onOpenChange?.(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="sr-only">
          <DialogTitle>Forgot password</DialogTitle>
          <DialogDescription>
            Enter your email to receive a password reset link
          </DialogDescription>
        </DialogHeader>
        <ForgotPasswordForm
          onSubmit={onSubmit}
          onBackToLogin={handleBackToLogin}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  )
}
