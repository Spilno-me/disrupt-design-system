import { ReactNode } from 'react'
import { cn } from '../../lib/utils'
import { Header, HeaderProps, NavItem } from '../ui/Header'
import { Footer, FooterLink } from './Footer'

// =============================================================================
// TYPES
// =============================================================================

export interface PageLayoutProps {
  /** Page content */
  children: ReactNode
  /** Custom header component (overrides default Header) */
  header?: ReactNode
  /** Custom footer component (overrides default Footer) */
  footer?: ReactNode
  /** Show the default Header (ignored if custom header provided) */
  showHeader?: boolean
  /** Show the default Footer (ignored if custom footer provided) */
  showFooter?: boolean
  /** Main content max-width */
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full' | 'container'
  /** Add padding to main content */
  padded?: boolean
  /** Background color */
  background?: 'white' | 'cream' | 'transparent'
  /** Additional class name for main element */
  className?: string

  // Header props (passed to default Header)
  /** Navigation items for header */
  navItems?: NavItem[]
  /** Show contact button in header */
  showContactButton?: boolean
  /** Contact button text */
  contactButtonText?: string
  /** Contact button path */
  contactButtonPath?: string
  /** Callback when logo is clicked */
  onLogoClick?: () => void
  /** Callback when contact button is clicked */
  onContactClick?: HeaderProps['onContactClick']
  /** Callback when a nav item is clicked */
  onNavItemClick?: HeaderProps['onNavItemClick']
  /** Custom render function for nav links (for router integration) */
  renderNavLink?: HeaderProps['renderNavLink']
  /** Custom render function for contact button link */
  renderContactLink?: HeaderProps['renderContactLink']

  // Footer props (passed to default Footer)
  /** Company name for footer */
  companyName?: string
  /** Footer links */
  footerLinks?: FooterLink[]
}

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * Reusable Page Layout with header, main content, and footer.
 * Provides consistent page structure with configurable max-width.
 * Includes Header and Footer by default.
 */
export function PageLayout({
  children,
  header,
  footer,
  showHeader = true,
  showFooter = true,
  maxWidth = 'full',
  padded = false,
  background = 'white',
  className,
  // Header props
  navItems,
  showContactButton = true,
  contactButtonText,
  contactButtonPath,
  onLogoClick,
  onContactClick,
  onNavItemClick,
  renderNavLink,
  renderContactLink,
  // Footer props
  companyName = 'Disrupt Inc.',
  footerLinks,
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
    white: 'bg-surface',
    cream: 'bg-page',
    transparent: 'bg-transparent',
  }

  // Determine what header to render
  const renderHeader = () => {
    if (header !== undefined) {
      return header // Custom header (including null to hide)
    }
    if (showHeader) {
      return (
        <Header
          navItems={navItems}
          showContactButton={showContactButton}
          contactButtonText={contactButtonText}
          contactButtonPath={contactButtonPath}
          onLogoClick={onLogoClick}
          onContactClick={onContactClick}
          onNavItemClick={onNavItemClick}
          renderNavLink={renderNavLink}
          renderContactLink={renderContactLink}
        />
      )
    }
    return null
  }

  // Determine what footer to render
  const renderFooter = () => {
    if (footer !== undefined) {
      return footer // Custom footer (including null to hide)
    }
    if (showFooter) {
      return <Footer companyName={companyName} links={footerLinks} />
    }
    return null
  }

  return (
    <div className={cn('min-h-screen flex flex-col', bgClasses[background])}>
      {/* Header */}
      {renderHeader()}

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
      {renderFooter()}
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
