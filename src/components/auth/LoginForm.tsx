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

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
})

export type LoginFormValues = z.infer<typeof loginSchema>

// =============================================================================
// LOGIN FORM TYPES
// =============================================================================

export interface LoginFormProps {
  /** Company/product name displayed in the header */
  companyName?: string
  /** Callback when form is submitted with valid data */
  onSubmit?: (values: LoginFormValues) => void | Promise<void>
  /** Callback when "Forgot password" link is clicked */
  onForgotPassword?: () => void
  /** Loading state for submit button */
  isLoading?: boolean
  /** Optional className */
  className?: string
}

// =============================================================================
// LOGIN FORM COMPONENT
// =============================================================================

export function LoginForm({
  companyName = "Acme Inc",
  onSubmit,
  onForgotPassword,
  isLoading = false,
  className,
}: LoginFormProps) {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const handleSubmit = async (values: LoginFormValues) => {
    await onSubmit?.(values)
  }

  return (
    <div className={cn("flex flex-col", className)}>
      {/* Header */}
      <div className="mb-6 text-center">
        <p className="text-sm text-muted">
          Login to your {companyName} account
        </p>
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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

          {/* Password field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Password</FormLabel>
                  {onForgotPassword && (
                    <button
                      type="button"
                      onClick={onForgotPassword}
                      className="text-sm text-primary underline hover:text-link"
                    >
                      Forgot your password?
                    </button>
                  )}
                </div>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    autoComplete="current-password"
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
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </Form>
    </div>
  )
}
