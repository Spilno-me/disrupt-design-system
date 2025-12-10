import { ReactNode } from 'react'
import { cn } from '../../lib/utils'
import { SHADOWS } from '../../constants/designTokens'

// =============================================================================
// TYPES
// =============================================================================

export interface FooterLink {
  label: string
  href: string
}

export interface FooterProps {
  /** Company/Website name */
  companyName?: string
  /** Copyright year */
  copyrightYear?: number
  /** Footer links (Privacy Policy, Terms, etc.) */
  links?: FooterLink[]
  /** Custom left content (replaces copyright) */
  leftContent?: ReactNode
  /** Custom right content (replaces links) */
  rightContent?: ReactNode
  /** Background style */
  variant?: 'default' | 'transparent' | 'dark'
  /** Additional class name */
  className?: string
}

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * Reusable Footer component with configurable content and styling.
 */
export function Footer({
  companyName = 'Company',
  copyrightYear = new Date().getFullYear(),
  links = [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ],
  leftContent,
  rightContent,
  variant = 'default',
  className,
}: FooterProps) {
  const variantStyles = {
    default: { boxShadow: SHADOWS.footer },
    transparent: {},
    dark: {},
  }

  const variantClasses = {
    default: 'bg-page/30 backdrop-blur-[10px]',
    transparent: 'bg-transparent',
    dark: 'bg-inverse-bg text-inverse',
  }

  const textClasses = {
    default: 'text-primary',
    transparent: 'text-primary',
    dark: 'text-inverse',
  }

  const linkClasses = {
    default: 'text-primary hover:text-accent',
    transparent: 'text-primary hover:text-accent',
    dark: 'text-white/80 hover:text-white',
  }

  return (
    <footer
      className={cn('py-3 sm:py-4', variantClasses[variant], className)}
      style={variantStyles[variant]}
      data-element="footer"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-2 sm:gap-4">
          {/* Left: Copyright */}
          <div className="order-2 md:order-1">
            {leftContent || (
              <p className={cn('text-xs sm:text-sm font-medium', textClasses[variant])}>
                Copyright {copyrightYear} © {companyName}
              </p>
            )}
          </div>

          {/* Right: Links */}
          <div className="order-1 md:order-2">
            {rightContent || (
              <div className="flex items-center gap-3 sm:gap-6 flex-wrap justify-center">
                {links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'transition-colors text-xs sm:text-sm font-medium',
                      linkClasses[variant]
                    )}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}
