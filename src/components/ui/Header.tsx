import * as React from 'react'
import { AnimatedLogo } from './AnimatedLogo'
import { MobileMenu } from './MobileMenu'
import { ElectricButtonWrapper } from './GlassEffect'
import { Button } from './button'
import { cn } from '../../lib/utils'
import { SHADOWS } from '../../constants/designTokens'
import { useHeaderContrast } from '../../hooks/useHeaderContrast'

// =============================================================================
// CONSTANTS
// =============================================================================

/** Nav item height class */
const NAV_ITEM_HEIGHT = 'h-9'

/** Nav item padding class */
const NAV_ITEM_PADDING = 'px-4 py-2'

/** Nav item border radius class */
const NAV_BORDER_RADIUS = 'rounded-[12px]'

/** Mobile nav item border radius class */
const MOBILE_BORDER_RADIUS = 'rounded-[8px]'

/** Header z-index class */
const HEADER_Z_INDEX = 'z-50'

/** Header backdrop blur class */
const HEADER_BLUR = 'backdrop-blur-[10px]'

/** Logo height class */
const LOGO_HEIGHT = 'h-[54px]'

/** Logo width class */
const LOGO_WIDTH = 'w-[178px]'

/** Max content width class */
const MAX_CONTENT_WIDTH = 'max-w-[1440px]'

/** Data slot identifier for header root */
const DATA_SLOT = 'header'

// =============================================================================
// TYPES
// =============================================================================

export interface NavItem {
  /** Display label for the nav item */
  label: string
  /** Path/href for navigation */
  path: string
  /** Whether this item is currently active */
  isActive?: boolean
}

export interface HeaderProps {
  /** Navigation items to display */
  navItems?: NavItem[]
  /** Whether to show the contact button */
  showContactButton?: boolean
  /** Text for the contact button */
  contactButtonText?: string
  /** Contact button href/path */
  contactButtonPath?: string
  /** Logo alt text */
  logoAlt?: string
  /** Whether to show the tagline in the logo */
  showLogoTagline?: boolean
  /** Color mode for contrast on different backgrounds. Use 'auto' to detect based on scroll position. */
  colorMode?: 'dark' | 'light' | 'auto'
  /** Callback when logo is clicked */
  onLogoClick?: () => void
  /** Callback when contact button is clicked */
  onContactClick?: (e: React.MouseEvent) => void
  /** Callback when a nav item is clicked */
  onNavItemClick?: (item: NavItem, e: React.MouseEvent) => void
  /** Custom render function for nav links (for router integration) */
  renderNavLink?: (item: NavItem, children: React.ReactNode) => React.ReactNode
  /** Custom render function for contact button link */
  renderContactLink?: (children: React.ReactNode) => React.ReactNode
  /** Additional className for the header */
  className?: string
  /** Additional className for the nav container */
  navClassName?: string
  /** Disable portal for mobile menu (for Storybook/testing) */
  disableMobileMenuPortal?: boolean
}

// =============================================================================
// DEFAULT NAV ITEMS
// =============================================================================

const DEFAULT_NAV_ITEMS: NavItem[] = [
  { label: 'Home', path: '/' },
  { label: 'Product', path: '/product' },
  { label: 'About', path: '/about' },
]

// =============================================================================
// HEADER COMPONENT
// =============================================================================

export function Header({
  navItems = DEFAULT_NAV_ITEMS,
  showContactButton = true,
  contactButtonText = "Let's Talk",
  contactButtonPath = '/#contact',
  logoAlt = 'Disrupt Logo',
  showLogoTagline = true,
  colorMode = 'auto',
  onLogoClick,
  onContactClick,
  onNavItemClick,
  renderNavLink,
  renderContactLink,
  className,
  navClassName,
  disableMobileMenuPortal = false,
}: HeaderProps) {
  // Auto-detect color mode based on scroll position
  const autoColorMode = useHeaderContrast()

  // Use auto-detected mode if colorMode is 'auto', otherwise use the provided value
  const effectiveColorMode = colorMode === 'auto' ? autoColorMode : colorMode

  // Text color based on background
  const navTextColor = effectiveColorMode === 'dark' ? 'text-primary' : 'text-inverse'

  // Default link renderer (simple anchor)
  const defaultRenderNavLink = (item: NavItem, children: React.ReactNode) => (
    <a
      href={item.path}
      onClick={(e) => onNavItemClick?.(item, e)}
      className={cn(
        NAV_ITEM_HEIGHT,
        NAV_ITEM_PADDING,
        NAV_BORDER_RADIUS,
        'text-sm font-sans font-medium leading-[1.43] transition-colors flex items-center justify-center gap-2 cursor-pointer',
        navTextColor,
        !item.isActive && 'hover:bg-surface/10'
      )}
    >
      {children}
    </a>
  )

  const defaultRenderContactLink = (children: React.ReactNode) => (
    <a href={contactButtonPath} onClick={onContactClick}>
      {children}
    </a>
  )

  const navLinkRenderer = renderNavLink ?? defaultRenderNavLink
  const contactLinkRenderer = renderContactLink ?? defaultRenderContactLink

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0',
        HEADER_Z_INDEX,
        HEADER_BLUR,
        'bg-surface/70 border-b border-accent',
        className
      )}
      style={{ boxShadow: SHADOWS.header }}
      data-slot={DATA_SLOT}
    >
      <nav
        className={cn('flex items-center gap-4 py-4 px-4 sm:px-6', navClassName)}
        data-slot="header-nav"
      >
        <div className={cn('w-full', MAX_CONTENT_WIDTH, 'mx-auto flex items-center justify-between gap-4')}>
          {/* Logo */}
          <div className="flex items-center overflow-visible" data-slot="header-logo">
            <AnimatedLogo
              className={cn(LOGO_HEIGHT, LOGO_WIDTH, 'cursor-pointer overflow-visible')}
              onClick={onLogoClick}
              alt={logoAlt}
              colorMode={effectiveColorMode}
              showTagline={showLogoTagline}
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-5">
            <div className="flex items-center gap-1">
              {navItems.map((item) => (
                <ElectricButtonWrapper
                  key={item.path}
                  className="nav-item"
                  isActive={item.isActive}
                  colorMode={effectiveColorMode}
                >
                  {navLinkRenderer(
                    item,
                    <span
                      className={cn(
                        NAV_ITEM_HEIGHT,
                        NAV_ITEM_PADDING,
                        NAV_BORDER_RADIUS,
                        'text-sm font-sans font-medium leading-[1.43] transition-colors flex items-center justify-center gap-2 cursor-pointer',
                        navTextColor,
                        !item.isActive && 'hover:bg-surface/10'
                      )}
                    >
                      {item.label}
                    </span>
                  )}
                </ElectricButtonWrapper>
              ))}
            </div>

            {/* Contact Button */}
            {showContactButton && (
              <ElectricButtonWrapper colorMode={effectiveColorMode}>
                <Button
                  asChild
                  size="sm"
                  className="bg-inverse-bg text-inverse hover:bg-inverse-bg/90"
                >
                  {contactLinkRenderer(contactButtonText)}
                </Button>
              </ElectricButtonWrapper>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <MobileMenu onItemClick={() => {}} disablePortal={disableMobileMenuPortal}>
              <div className="flex flex-col gap-2 mb-4">
                {navItems.map((item) => (
                  <React.Fragment key={item.path}>
                    {navLinkRenderer(
                      item,
                      <span
                        className={cn(
                          'px-4 py-3',
                          MOBILE_BORDER_RADIUS,
                          'text-base font-medium cursor-pointer block w-full',
                          item.isActive
                            ? 'bg-accent/10 text-accent'
                            : 'text-primary hover:bg-surface/10'
                        )}
                      >
                        {item.label}
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Mobile Contact Button */}
              {showContactButton && (
                <ElectricButtonWrapper className="w-full">
                  {contactLinkRenderer(
                    <span className={cn('w-full h-11', NAV_ITEM_PADDING, NAV_BORDER_RADIUS, 'text-base font-medium cursor-pointer bg-inverse-bg text-inverse flex items-center justify-center')}>
                      {contactButtonText}
                    </span>
                  )}
                </ElectricButtonWrapper>
              )}
            </MobileMenu>
          </div>
        </div>
      </nav>
    </header>
  )
}
Header.displayName = 'Header'

export default Header
