import * as React from "react"
import { cn } from "../../lib/utils"
import { GridBlobBackground } from "../ui/GridBlobCanvas"

// =============================================================================
// AUTH LAYOUT TYPES
// =============================================================================

export interface AuthLayoutProps {
  /** Content to render (typically an auth form) */
  children: React.ReactNode
  /** Show the animated grid blob background */
  showBlob?: boolean
  /** Scale of the blob animation */
  blobScale?: number
  /** Maximum width of the content card */
  maxWidth?: "sm" | "md" | "lg"
  /** Optional className for the outer container */
  className?: string
}

// =============================================================================
// MAX WIDTH MAP
// =============================================================================

const maxWidthMap = {
  sm: "max-w-sm", // 384px
  md: "max-w-md", // 448px
  lg: "max-w-lg", // 512px
}

// =============================================================================
// AUTH LAYOUT COMPONENT
// =============================================================================

/**
 * AuthLayout - Consistent wrapper for all authentication pages
 *
 * Provides:
 * - Full-screen centered layout
 * - Optional animated grid blob background
 * - Consistent padding and responsive behavior
 *
 * @example
 * ```tsx
 * <AuthLayout showBlob>
 *   <LoginForm onSubmit={handleLogin} />
 * </AuthLayout>
 * ```
 */
export function AuthLayout({
  children,
  showBlob = true,
  blobScale = 1.2,
  maxWidth = "md",
  className,
}: AuthLayoutProps) {
  return (
    <div
      className={cn(
        "relative flex min-h-screen w-full items-center justify-center bg-page overflow-hidden",
        className
      )}
    >
      {/* Animated grid blob background */}
      {showBlob && <GridBlobBackground scale={blobScale} />}

      {/* Content container */}
      <div className={cn("relative z-10 w-full px-4 py-8", maxWidthMap[maxWidth])}>
        {children}
      </div>
    </div>
  )
}

// =============================================================================
// AUTH CARD COMPONENT
// =============================================================================

export interface AuthCardProps {
  /** Card content */
  children: React.ReactNode
  /** Optional className */
  className?: string
}

/**
 * AuthCard - Styled card container for auth forms
 *
 * @example
 * ```tsx
 * <AuthLayout>
 *   <AuthCard>
 *     <LoginForm />
 *   </AuthCard>
 * </AuthLayout>
 * ```
 */
export function AuthCard({ children, className }: AuthCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-default bg-surface p-6 shadow-sm sm:p-8",
        className
      )}
    >
      {children}
    </div>
  )
}
