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

const setInitialPasswordSchema = z
  .object({
    temporaryPassword: z.string().min(1, "Temporary password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export type SetInitialPasswordFormValues = z.infer<typeof setInitialPasswordSchema>

// =============================================================================
// SET INITIAL PASSWORD FORM TYPES
// =============================================================================

export interface SetInitialPasswordFormProps {
  /** Callback when form is submitted with valid data */
  onSubmit?: (values: SetInitialPasswordFormValues) => void | Promise<void>
  /** Loading state for submit button */
  isLoading?: boolean
  /** Optional className */
  className?: string
}

// =============================================================================
// SET INITIAL PASSWORD FORM COMPONENT
// =============================================================================

export function SetInitialPasswordForm({
  onSubmit,
  isLoading = false,
  className,
}: SetInitialPasswordFormProps) {
  const form = useForm<SetInitialPasswordFormValues>({
    resolver: zodResolver(setInitialPasswordSchema),
    defaultValues: {
      temporaryPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  const handleSubmit = async (values: SetInitialPasswordFormValues) => {
    await onSubmit?.(values)
  }

  return (
    <div className={cn("flex flex-col", className)}>
      {/* Header */}
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-semibold text-primary">Set your password</h1>
        <p className="mt-2 text-sm text-muted">
          Enter your temporary password and create a new one
        </p>
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          {/* Temporary password field */}
          <FormField
            control={form.control}
            name="temporaryPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Temporary password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter temporary password from email"
                    autoComplete="current-password"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
            {isLoading ? "Setting password..." : "Set password"}
          </Button>
        </form>
      </Form>
    </div>
  )
}
