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

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
})

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

// =============================================================================
// FORGOT PASSWORD FORM TYPES
// =============================================================================

export interface ForgotPasswordFormProps {
  /** Callback when form is submitted with valid data */
  onSubmit?: (values: ForgotPasswordFormValues) => void | Promise<void>
  /** Callback when "Back to login" link is clicked */
  onBackToLogin?: () => void
  /** Loading state for submit button */
  isLoading?: boolean
  /** Hide the header (useful when used inside a Dialog) */
  showHeader?: boolean
  /** Optional className */
  className?: string
}

// =============================================================================
// FORGOT PASSWORD FORM COMPONENT
// =============================================================================

export function ForgotPasswordForm({
  onSubmit,
  onBackToLogin,
  isLoading = false,
  showHeader = true,
  className,
}: ForgotPasswordFormProps) {
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

  const handleSubmit = async (values: ForgotPasswordFormValues) => {
    await onSubmit?.(values)
  }

  return (
    <div className={cn("flex flex-col", className)}>
      {/* Header */}
      {showHeader && (
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-primary">Forgot password</h1>
          <p className="mt-2 text-sm text-muted">
            Enter your email to receive a password reset link
          </p>
        </div>
      )}

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          {/* Email field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
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
            {isLoading ? "Sending..." : "Send reset link"}
          </Button>
        </form>
      </Form>

      {/* Back to login link */}
      <p className="mt-6 text-center text-sm text-primary">
        {onBackToLogin ? (
          <button
            type="button"
            onClick={onBackToLogin}
            className="font-medium underline hover:text-link"
          >
            Back to login
          </button>
        ) : (
          <span className="font-medium underline">Back to login</span>
        )}
      </p>
    </div>
  )
}
