"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { AlertTriangle, Circle } from "lucide-react"
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
import { LoginAccount } from "./PartnerLoginAccountsPage"

// =============================================================================
// TYPES
// =============================================================================

export interface ResetPasswordDialogProps {
  /** Whether the dialog is open */
  open: boolean
  /** Callback when dialog open state changes */
  onOpenChange: (open: boolean) => void
  /** Login account to reset password for */
  account: LoginAccount | null
  /** Callback when reset is confirmed */
  onConfirm: (mode: "generate" | "custom", customPassword?: string) => void | Promise<void>
  /** Whether the reset is currently in progress */
  isResetting?: boolean
}

// =============================================================================
// RADIO GROUP COMPONENTS (using Radix UI)
// =============================================================================

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("grid gap-3", className)}
      {...props}
      ref={ref}
    />
  )
})
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "aspect-square h-4 w-4 rounded-full border border-default text-accent",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "data-[state=checked]:border-accent data-[state=checked]:bg-accent",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <Circle className="h-2 w-2 fill-white text-white" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
})
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * ResetPasswordDialog - Dialog for resetting a login account's password
 *
 * Provides two options:
 * - Generate a secure password automatically
 * - Set a custom password manually
 *
 * Includes a note that the user will be required to change the password on first login.
 *
 * @example
 * ```tsx
 * <ResetPasswordDialog
 *   open={resetDialogOpen}
 *   onOpenChange={setResetDialogOpen}
 *   account={selectedAccount}
 *   onConfirm={(mode, password) => handleReset(mode, password)}
 *   isResetting={isResetting}
 * />
 * ```
 */
export function ResetPasswordDialog({
  open,
  onOpenChange,
  account,
  onConfirm,
  isResetting = false,
}: ResetPasswordDialogProps) {
  const [mode, setMode] = useState<"generate" | "custom">("generate")
  const [customPassword, setCustomPassword] = useState("")

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (open) {
      setMode("generate")
      setCustomPassword("")
    }
  }, [open])

  const handleConfirm = async () => {
    if (mode === "custom" && !customPassword.trim()) {
      return // Don't submit if custom password is empty
    }
    await onConfirm(mode, mode === "custom" ? customPassword : undefined)
  }

  if (!account) return null

  const fullName = `${account.firstName} ${account.lastName}`

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-primary">
            Reset Password
          </DialogTitle>
          <p className="text-sm text-muted pt-2">
            Reset password for{" "}
            <span className="font-semibold text-primary">{fullName}</span>{" "}
            ({account.email})
          </p>
        </DialogHeader>

        {/* Radio Options */}
        <div className="py-4">
          <RadioGroup value={mode} onValueChange={(value: string) => setMode(value as "generate" | "custom")}>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="generate" id="generate" />
              <Label htmlFor="generate" className="text-sm text-primary cursor-pointer font-normal">
                Generate secure password automatically
              </Label>
            </div>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="custom" id="custom" />
              <Label htmlFor="custom" className="text-sm text-primary cursor-pointer font-normal">
                Set custom password manually
              </Label>
            </div>
          </RadioGroup>

          {/* Custom Password Input */}
          {mode === "custom" && (
            <div className="mt-4 pl-7">
              <Input
                type="password"
                placeholder="Enter custom password"
                value={customPassword}
                onChange={(e) => setCustomPassword(e.target.value)}
                className="w-full"
              />
            </div>
          )}
        </div>

        {/* Warning Note */}
        <div className="flex items-start gap-3 rounded-lg bg-warning-light border border-warning/30 p-3">
          <AlertTriangle className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
          <p className="text-sm text-primary">
            <span className="font-medium">Note:</span> The user will be required to change this password on first login.
          </p>
        </div>

        <DialogFooter className="pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isResetting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="accent"
            onClick={handleConfirm}
            disabled={isResetting || (mode === "custom" && !customPassword.trim())}
          >
            {isResetting
              ? "Resetting..."
              : mode === "generate"
              ? "Generate Password"
              : "Set Password"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ResetPasswordDialog
