import { ReactNode } from 'react'
import { cn } from '../../lib/utils'

// =============================================================================
// TYPES
// =============================================================================

export interface PageLayoutProps {
  /** Page content */
  children: ReactNode
  /** Header component */
  header?: ReactNode
  /** Footer component */
  footer?: ReactNode
  /** Main content max-width */
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full' | 'container'
  /** Add padding to main content */
  padded?: boolean
  /** Background color */
  background?: 'white' | 'cream' | 'transparent'
  /** Additional class name for main element */
  className?: string
}

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * Reusable Page Layout with header, main content, and footer.
 * Provides consistent page structure with configurable max-width.
 */
export function PageLayout({
  children,
  header,
  footer,
  maxWidth = 'container',
  padded = true,
  background = 'white',
  className,
}: PageLayoutProps) {
  const maxWidthClasses = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    full: 'max-w-full',
    container: 'max-w-[1440px]',
  }

  const bgClasses = {
    white: 'bg-white',
    cream: 'bg-cream',
    transparent: 'bg-transparent',
  }

  return (
    <div className={cn('min-h-screen flex flex-col', bgClasses[background])}>
      {/* Header */}
      {header}

      {/* Main Content */}
      <main
        className={cn(
          'flex-1 mx-auto w-full',
          maxWidthClasses[maxWidth],
          padded && 'px-4 sm:px-6',
          className
        )}
      >
        {children}
      </main>

      {/* Footer */}
      {footer}
    </div>
  )
}

// =============================================================================
// CONTAINER COMPONENT
// =============================================================================

export interface ContainerProps {
  /** Content */
  children: ReactNode
  /** Max-width variant */
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full' | 'container'
  /** Add horizontal padding */
  padded?: boolean
  /** Additional class name */
  className?: string
}

/**
 * Container component for consistent max-width and padding.
 */
export function Container({
  children,
  maxWidth = 'container',
  padded = true,
  className,
}: ContainerProps) {
  const maxWidthClasses = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    full: 'max-w-full',
    container: 'max-w-[1440px]',
  }

  return (
    <div
      className={cn(
        'mx-auto w-full',
        maxWidthClasses[maxWidth],
        padded && 'px-4 sm:px-6',
        className
      )}
    >
      {children}
    </div>
  )
}
