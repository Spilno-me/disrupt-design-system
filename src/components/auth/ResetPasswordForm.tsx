"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { cn } from "../../lib/utils"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form"

// =============================================================================
// FORM SCHEMA
// =============================================================================

const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>

// =============================================================================
// RESET PASSWORD FORM TYPES
// =============================================================================

export interface ResetPasswordFormProps {
  /** Callback when form is submitted with valid data */
  onSubmit?: (values: ResetPasswordFormValues) => void | Promise<void>
  /** Loading state for submit button */
  isLoading?: boolean
  /** Optional className */
  className?: string
}

// =============================================================================
// RESET PASSWORD FORM COMPONENT
// =============================================================================

export function ResetPasswordForm({
  onSubmit,
  isLoading = false,
  className,
}: ResetPasswordFormProps) {
  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  })

  const handleSubmit = async (values: ResetPasswordFormValues) => {
    await onSubmit?.(values)
  }

  return (
    <div className={cn("flex flex-col", className)}>
      {/* Header */}
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-semibold text-primary">Reset password</h1>
        <p className="mt-2 text-sm text-muted">
          Enter your new password
        </p>
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          {/* New password field */}
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter new password"
                    autoComplete="new-password"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Confirm password field */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Confirm new password"
                    autoComplete="new-password"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit button */}
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
            fullWidth
          >
            {isLoading ? "Resetting..." : "Reset password"}
          </Button>
        </form>
      </Form>
    </div>
  )
}
