"use client"

import * as React from "react"
import { useState } from "react"
import { cn } from "../../lib/utils"
import { GridBlobBackground } from "../ui/GridBlobCanvas"
import { LoginForm, type LoginFormValues } from "./LoginForm"
import { ForgotPasswordForm } from "./ForgotPasswordForm"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog"
import { SHADOWS } from "../../constants/designTokens"
import { LOGOS } from "../../assets/logos"
import { ExecutingAnimation } from "../ui/ExecutingAnimation"

// =============================================================================
// PRODUCT TYPES & CONFIG
// =============================================================================

/** Supported Disrupt product types */
export type ProductType = "flow" | "market" | "partner"

/** Product configuration with logo and display name */
interface ProductConfig {
  logo: string
  name: string
  tagline: string
}

/** Product configurations - matching AppHeader */
const PRODUCT_CONFIGS: Record<ProductType, ProductConfig> = {
  flow: {
    logo: LOGOS.flow.dark,
    name: "Disrupt Flow",
    tagline: "Smart EHS Automation",
  },
  market: {
    logo: LOGOS.market.dark,
    name: "Disrupt Market",
    tagline: "EHS Marketplace",
  },
  partner: {
    logo: LOGOS.partner.dark,
    name: "Disrupt Partner",
    tagline: "Partner Portal",
  },
}

// =============================================================================
// LOGIN PAGE TYPES
// =============================================================================

type PageState = "login" | "loading" | "success"

export interface LoginPageProps {
  /** Product to display logo for (flow, market, partner) */
  product?: ProductType
  /** Custom logo URL (overrides product logo) */
  customLogo?: string
  /** Custom logo alt text */
  logoAlt?: string
  /** Company/product name displayed in the form (auto-set from product if not provided) */
  companyName?: string
  /** Callback when login form is submitted - should return Promise */
  onLogin?: (values: LoginFormValues) => Promise<void>
  /** Callback when forgot password form is submitted */
  onForgotPassword?: (email: string) => Promise<void>
  /** Callback after successful login (for redirect) */
  onLoginSuccess?: () => void
  /** Callback when logo is clicked */
  onLogoClick?: () => void
  /** Terms of Service link */
  termsLink?: string
  /** Privacy Policy link */
  privacyLink?: string
  /** Scale of the blob animation */
  blobScale?: number
  /** Success message to display */
  successMessage?: string
  /** Duration to show success state before calling onLoginSuccess (ms) */
  successDuration?: number
  /** Custom hero image URL (overrides default Unsplash image) */
  heroImage?: string
  /** Hero image alt text */
  heroImageAlt?: string
  /** Position of the login form - "left" (default) or "right" */
  loginPosition?: "left" | "right"
  /** Optional className */
  className?: string
}

// =============================================================================
// PRODUCT LOGO COMPONENT
// =============================================================================

interface ProductLogoProps {
  product?: ProductType
  customLogo?: string
  alt?: string
  onClick?: () => void
}

function ProductLogo({ product, customLogo, alt, onClick }: ProductLogoProps) {
  const logoSrc = customLogo || (product ? PRODUCT_CONFIGS[product].logo : null)
  const logoAlt = alt || (product ? PRODUCT_CONFIGS[product].name : "Logo")

  if (!logoSrc) return null

  return (
    <div className="mb-6 flex justify-center">
      <img
        src={logoSrc}
        alt={logoAlt}
        className={cn(
          "h-12 w-auto",
          onClick && "cursor-pointer hover:opacity-80 transition-opacity"
        )}
        onClick={onClick}
      />
    </div>
  )
}

// =============================================================================
// SUCCESS STATE COMPONENT
// =============================================================================

interface SuccessStateProps {
  message: string
  product?: ProductType
  customLogo?: string
}

function SuccessState({ message, product, customLogo }: SuccessStateProps) {
  const logoSrc = customLogo || (product ? PRODUCT_CONFIGS[product].logo : null)

  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      {logoSrc && (
        <img src={logoSrc} alt="Logo" className="mb-6 h-12 w-auto" />
      )}
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
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
      <h2 className="text-xl font-semibold text-primary">Welcome!</h2>
      <p className="mt-2 text-sm text-muted">{message}</p>
    </div>
  )
}

// =============================================================================
// LOGIN PAGE COMPONENT
// =============================================================================

export function LoginPage({
  product,
  customLogo,
  logoAlt,
  companyName,
  onLogin,
  onForgotPassword,
  onLoginSuccess,
  onLogoClick,
  termsLink = "/terms",
  privacyLink = "/privacy",
  blobScale = 1.2,
  successMessage,
  successDuration = 1500,
  heroImage,
  heroImageAlt = "Team collaboration",
  loginPosition = "left",
  className,
}: LoginPageProps) {
  const [pageState, setPageState] = useState<PageState>("login")
  const [forgotDialogOpen, setForgotDialogOpen] = useState(false)
  const [forgotLoading, setForgotLoading] = useState(false)
  const [forgotSuccess, setForgotSuccess] = useState(false)

  // Derive company name from product if not explicitly provided
  const displayName = companyName || (product ? PRODUCT_CONFIGS[product].name : "Disrupt")

  // Default success message includes product name
  const displaySuccessMessage = successMessage || `Welcome to ${displayName}! Redirecting...`

  // Handle login submission
  const handleLogin = async (values: LoginFormValues) => {
    setPageState("loading")
    try {
      await onLogin?.(values)
      setPageState("success")
      // Wait then trigger redirect callback
      setTimeout(() => {
        onLoginSuccess?.()
      }, successDuration)
    } catch {
      setPageState("login")
    }
  }

  // Handle forgot password submission
  const handleForgotPassword = async ({ email }: { email: string }) => {
    setForgotLoading(true)
    try {
      await onForgotPassword?.(email)
      setForgotSuccess(true)
      // Auto close after showing success
      setTimeout(() => {
        setForgotDialogOpen(false)
        setForgotSuccess(false)
      }, 2000)
    } finally {
      setForgotLoading(false)
    }
  }

  // Reset forgot dialog state when closed
  const handleForgotDialogChange = (open: boolean) => {
    setForgotDialogOpen(open)
    if (!open) {
      setForgotSuccess(false)
    }
  }

  return (
    <div
      className={cn(
        "relative flex min-h-screen w-full overflow-hidden bg-page",
        className
      )}
    >
      {/* Animated grid blob background - full page */}
      <div className="absolute inset-0 z-0">
        <GridBlobBackground scale={blobScale} />
      </div>

      {/* Two-column grid layout */}
      <div className="grid lg:grid-cols-2 w-full relative z-10">
        {/* Login Form - order changes based on loginPosition prop */}
        <div
          className={cn(
            "relative flex flex-col items-center justify-center p-6 sm:p-8 lg:p-12",
            loginPosition === "right" ? "lg:order-2" : "lg:order-1"
          )}
          data-testid="login-form-section"
          data-position={loginPosition}
        >
          {/* Content container */}
          <div className="relative z-10 w-full max-w-md">
        {/* Main card */}
        <div
          className="rounded-xl border border-dashed border-default bg-surface p-5 sm:p-6 lg:p-8"
          style={{ boxShadow: SHADOWS.ambient }}
        >
          {/* Product Logo */}
          {pageState === "login" && (
            <ProductLogo
              product={product}
              customLogo={customLogo}
              alt={logoAlt}
              onClick={onLogoClick}
            />
          )}

          {/* Login form state */}
          {pageState === "login" && (
            <LoginForm
              companyName={displayName}
              onSubmit={handleLogin}
              onForgotPassword={() => setForgotDialogOpen(true)}
            />
          )}

          {/* Loading state */}
          {pageState === "loading" && (
            <div className="flex flex-col items-center justify-center py-12">
              <ExecutingAnimation className="w-32 h-32" />
              <p className="mt-4 text-sm text-muted">Signing you in...</p>
            </div>
          )}

          {/* Success state */}
          {pageState === "success" && (
            <SuccessState
              message={displaySuccessMessage}
              product={product}
              customLogo={customLogo}
            />
          )}
        </div>

        {/* Terms and privacy footer */}
        <p className="mt-6 text-center text-xs text-muted">
          By clicking continue, you agree to our{" "}
          <a href={termsLink} className="underline hover:text-link">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href={privacyLink} className="underline hover:text-link">
            Privacy Policy
          </a>
        </p>
        </div>
        </div>

        {/* Hero Section with Image - order changes based on loginPosition prop */}
        <div
          className={cn(
            "hidden lg:flex relative overflow-hidden",
            loginPosition === "right" ? "lg:order-1" : "lg:order-2"
          )}
          data-testid="hero-section"
          data-position={loginPosition}
        >
          {/* Hero image background */}
          <div className="absolute inset-0">
            <img
              src={heroImage || "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1920&q=80"}
              alt={heroImageAlt}
              className="w-full h-full object-cover opacity-40"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-surface/80 via-surface/70 to-transparent" />
          </div>

          {/* Hero content */}
          <div className="relative z-10 flex items-center justify-center w-full p-12">
            <div className="max-w-lg mx-auto space-y-8">
              {/* Main headline */}
              <div className="text-center space-y-4">
                <h2 className="text-4xl font-bold text-primary">
                  Welcome to {product ? PRODUCT_CONFIGS[product].name : "Disrupt"}
                </h2>
                <p className="text-lg text-muted">
                  {product === "partner"
                    ? "Manage your partnerships, track commissions, and grow your business with our comprehensive partner platform."
                    : product === "market"
                    ? "Discover and manage EHS solutions in our comprehensive marketplace platform."
                    : "Streamline your EHS workflows with intelligent automation and compliance tools."
                  }
                </p>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-3 gap-6 mt-12">
                <div className="text-center space-y-2">
                  <div className="text-4xl font-bold text-primary">
                    {product === "partner" ? "10K+" : "50K+"}
                  </div>
                  <div className="text-sm text-secondary">
                    {product === "partner" ? "Active Partners" : "Active Users"}
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-4xl font-bold text-primary">
                    {product === "partner" ? "$50M+" : "99.9%"}
                  </div>
                  <div className="text-sm text-secondary">
                    {product === "partner" ? "Commissions Paid" : "Uptime"}
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-4xl font-bold text-primary">
                    {product === "partner" ? "99.9%" : "24/7"}
                  </div>
                  <div className="text-sm text-secondary">
                    {product === "partner" ? "Uptime" : "Support"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Dialog */}
      <Dialog open={forgotDialogOpen} onOpenChange={handleForgotDialogChange}>
        <DialogContent className="sm:max-w-md">
          {forgotSuccess ? (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
                <svg
                  className="h-6 w-6 text-success"
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
              <DialogHeader>
                <DialogTitle>Check your email</DialogTitle>
                <DialogDescription>
                  We've sent a password reset link to your email address.
                </DialogDescription>
              </DialogHeader>
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Forgot password</DialogTitle>
                <DialogDescription>
                  Enter your email to receive a password reset link.
                </DialogDescription>
              </DialogHeader>
              <ForgotPasswordForm
                onSubmit={handleForgotPassword}
                onBackToLogin={() => setForgotDialogOpen(false)}
                isLoading={forgotLoading}
                showHeader={false}
              />
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
