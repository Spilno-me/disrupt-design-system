import * as React from 'react'
import { AnimatedLogo } from './AnimatedLogo'
import { MobileMenu } from './MobileMenu'
import { ElectricButtonWrapper } from './GlassEffect'
import { Button } from './button'
import { cn } from '../../lib/utils'

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
  /** Color mode for contrast on different backgrounds */
  colorMode?: 'dark' | 'light'
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
  contactButtonText = 'Contact us',
  contactButtonPath = '/#contact',
  logoAlt = 'Disrupt Logo',
  showLogoTagline = true,
  colorMode = 'dark',
  onLogoClick,
  onContactClick,
  onNavItemClick,
  renderNavLink,
  renderContactLink,
  className,
  navClassName,
  disableMobileMenuPortal = false,
}: HeaderProps) {
  // Text color based on background
  const navTextColor = colorMode === 'dark' ? 'text-dark' : 'text-white'

  // Default link renderer (simple anchor)
  const defaultRenderNavLink = (item: NavItem, children: React.ReactNode) => (
    <a
      href={item.path}
      onClick={(e) => onNavItemClick?.(item, e)}
      className={cn(
        'h-9 px-4 py-2 rounded-[12px] text-sm font-sans font-medium leading-[1.43] transition-colors flex items-center justify-center gap-2 cursor-pointer',
        navTextColor,
        !item.isActive && 'hover:bg-white/10'
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
        'fixed top-0 left-0 right-0 z-50 backdrop-blur-[10px] bg-cream/30 border-b border-teal shadow-[0px_2px_4px_5px_rgba(0,0,0,0.15)]',
        className
      )}
      data-element="main-header"
    >
      <nav
        className={cn('flex items-center gap-4 py-4 px-4 sm:px-6', navClassName)}
        data-element="header-nav"
      >
        <div className="w-full max-w-[1440px] mx-auto flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center overflow-visible" data-element="header-logo">
            <AnimatedLogo
              className="h-[54px] w-[178px] cursor-pointer overflow-visible"
              onClick={onLogoClick}
              alt={logoAlt}
              colorMode={colorMode}
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
                  colorMode={colorMode}
                >
                  {navLinkRenderer(
                    item,
                    <span
                      className={cn(
                        'h-9 px-4 py-2 rounded-[12px] text-sm font-sans font-medium leading-[1.43] transition-colors flex items-center justify-center gap-2 cursor-pointer',
                        navTextColor,
                        !item.isActive && 'hover:bg-white/10'
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
              <ElectricButtonWrapper colorMode={colorMode}>
                <Button
                  asChild
                  size="sm"
                  className="bg-dark text-white hover:bg-dark/90"
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
                          'px-4 py-3 rounded-[8px] text-base font-medium cursor-pointer block w-full',
                          item.isActive
                            ? 'bg-teal/10 text-teal'
                            : 'text-dark hover:bg-white/10'
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
                    <span className="w-full h-11 px-4 py-2 rounded-[12px] text-base font-medium cursor-pointer bg-dark text-white flex items-center justify-center">
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

export default Header
