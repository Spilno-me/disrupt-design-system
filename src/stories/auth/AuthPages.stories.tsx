import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"

import { AuthLayout, AuthCard } from "../../components/auth/AuthLayout"
import { LoginForm } from "../../components/auth/LoginForm"
import { ForgotPasswordForm } from "../../components/auth/ForgotPasswordForm"
import { ResetPasswordForm } from "../../components/auth/ResetPasswordForm"
import { SetInitialPasswordForm } from "../../components/auth/SetInitialPasswordForm"
import { ForgotPasswordDialog } from "../../components/auth/ForgotPasswordDialog"
import { PAGE_META, pageDescription } from "../_infrastructure"

// =============================================================================
// META
// =============================================================================

const meta: Meta = {
  title: "Shared/Auth/AllFlows",
  ...PAGE_META,
  parameters: {
    ...PAGE_META.parameters,
    docs: {
      description: {
        component: pageDescription(`Complete authentication flow pages including login, forgot password, reset password, and initial password setup.

## Components
- **LoginForm**: Standard email/password login
- **ForgotPasswordForm**: Request password reset email
- **ResetPasswordForm**: Set new password from email link
- **SetInitialPasswordForm**: First-time password setup for new users
- **ForgotPasswordDialog**: Modal variant for password reset`),
      },
    },
  },
}

export default meta

// =============================================================================
// LOGIN PAGE
// =============================================================================

export const LoginPage: StoryObj = {
  name: "1. Login",
  render: () => {
    const [forgotOpen, setForgotOpen] = useState(false)

    return (
      <AuthLayout showBlob blobScale={1.2}>
        <AuthCard>
          <LoginForm
            companyName="Disrupt"
            onSubmit={async (values) => {
              console.log("Login:", values)
              // Simulate API call
              await new Promise((r) => setTimeout(r, 1000))
              alert(`Logged in as ${values.email}`)
            }}
            onForgotPassword={() => setForgotOpen(true)}
          />
        </AuthCard>

        <ForgotPasswordDialog
          open={forgotOpen}
          onOpenChange={setForgotOpen}
          onSubmit={async ({ email }) => {
            console.log("Reset email sent to:", email)
            await new Promise((r) => setTimeout(r, 1000))
            alert(`Password reset link sent to ${email}`)
            setForgotOpen(false)
          }}
        />
      </AuthLayout>
    )
  },
}

// =============================================================================
// FORGOT PASSWORD PAGE (STANDALONE)
// =============================================================================

export const ForgotPasswordPage: StoryObj = {
  name: "2. Forgot Password",
  render: () => {
    return (
      <AuthLayout showBlob blobScale={1.2}>
        <AuthCard>
          <ForgotPasswordForm
            onSubmit={async ({ email }) => {
              console.log("Reset email sent to:", email)
              await new Promise((r) => setTimeout(r, 1000))
              alert(`Password reset link sent to ${email}`)
            }}
            onBackToLogin={() => alert("Navigate back to login")}
          />
        </AuthCard>
      </AuthLayout>
    )
  },
}

// =============================================================================
// RESET PASSWORD PAGE (FROM EMAIL LINK)
// =============================================================================

export const ResetPasswordPage: StoryObj = {
  name: "3. Reset Password",
  render: () => {
    return (
      <AuthLayout showBlob blobScale={1.2}>
        <AuthCard>
          <ResetPasswordForm
            onSubmit={async ({ newPassword }) => {
              console.log("Password reset to:", newPassword)
              await new Promise((r) => setTimeout(r, 1000))
              alert("Password has been reset! Redirecting to login...")
            }}
          />
        </AuthCard>
      </AuthLayout>
    )
  },
}

// =============================================================================
// SET INITIAL PASSWORD PAGE (NEW USER)
// =============================================================================

export const SetInitialPasswordPage: StoryObj = {
  name: "4. Set Initial Password (New User)",
  render: () => {
    return (
      <AuthLayout showBlob blobScale={1.2}>
        <AuthCard>
          <SetInitialPasswordForm
            onSubmit={async ({ temporaryPassword, newPassword }) => {
              console.log("Temp password:", temporaryPassword)
              console.log("New password:", newPassword)
              await new Promise((r) => setTimeout(r, 1000))
              alert("Password set successfully! Welcome to the app.")
            }}
          />
        </AuthCard>
      </AuthLayout>
    )
  },
}

// =============================================================================
// COMPLETE AUTH FLOW (INTERACTIVE DEMO)
// =============================================================================

type AuthStep = "login" | "forgot" | "reset" | "initial" | "success"

export const CompleteAuthFlow: StoryObj = {
  name: "5. Complete Auth Flow (Demo)",
  render: () => {
    const [step, setStep] = useState<AuthStep>("login")
    const [isLoading, setIsLoading] = useState(false)

    const simulateAsync = async (nextStep: AuthStep) => {
      setIsLoading(true)
      await new Promise((r) => setTimeout(r, 1500))
      setIsLoading(false)
      setStep(nextStep)
    }

    return (
      <AuthLayout showBlob blobScale={1.2}>
        {/* Login Step */}
        {step === "login" && (
          <AuthCard>
            <LoginForm
              companyName="Disrupt"
              isLoading={isLoading}
              onSubmit={async () => {
                await simulateAsync("success")
              }}
              onForgotPassword={() => setStep("forgot")}
            />
          </AuthCard>
        )}

        {/* Forgot Password Step */}
        {step === "forgot" && (
          <AuthCard>
            <ForgotPasswordForm
              isLoading={isLoading}
              onSubmit={async () => {
                await simulateAsync("reset")
              }}
              onBackToLogin={() => setStep("login")}
            />
          </AuthCard>
        )}

        {/* Reset Password Step */}
        {step === "reset" && (
          <AuthCard>
            <ResetPasswordForm
              isLoading={isLoading}
              onSubmit={async () => {
                await simulateAsync("success")
              }}
            />
          </AuthCard>
        )}

        {/* Initial Password Step (New User) */}
        {step === "initial" && (
          <AuthCard>
            <SetInitialPasswordForm
              isLoading={isLoading}
              onSubmit={async () => {
                await simulateAsync("success")
              }}
            />
          </AuthCard>
        )}

        {/* Success State */}
        {step === "success" && (
          <AuthCard>
            <div className="text-center py-8">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
                <svg
                  className="h-8 w-8 text-success"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-primary mb-2">
                Success!
              </h2>
              <p className="text-muted mb-6">
                You have been authenticated successfully.
              </p>
              <button
                onClick={() => setStep("login")}
                className="text-sm text-link hover:underline"
              >
                Back to login demo
              </button>
            </div>
          </AuthCard>
        )}

        {/* Flow Navigation Indicator */}
        <div className="mt-6 flex justify-center gap-2">
          {(["login", "forgot", "reset", "initial", "success"] as AuthStep[]).map(
            (s) => (
              <button
                key={s}
                onClick={() => setStep(s)}
                className={`h-2 w-2 rounded-full transition-colors ${
                  step === s ? "bg-teal" : "bg-slate"
                }`}
                title={s}
              />
            )
          )}
        </div>
      </AuthLayout>
    )
  },
}

// =============================================================================
// WITHOUT BLOB BACKGROUND
// =============================================================================

export const WithoutBlobBackground: StoryObj = {
  name: "6. Without Blob Background",
  render: () => {
    return (
      <AuthLayout showBlob={false}>
        <AuthCard>
          <LoginForm
            companyName="Disrupt"
            onSubmit={async (values) => {
              console.log("Login:", values)
            }}
          />
        </AuthCard>
      </AuthLayout>
    )
  },
}
