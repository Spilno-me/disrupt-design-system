import { ReactNode, useState, useEffect } from 'react'
import { cn } from '../../lib/utils'

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
 *
 * Features glass morphism effect that adapts to light/dark theme,
 * matching the AppHeader styling for visual consistency.
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
  // Detect dark mode for glass effect
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains('dark') ||
                     document.body.classList.contains('dark')
      setIsDarkMode(isDark)
    }
    checkDarkMode()

    const observer = new MutationObserver(checkDarkMode)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] })

    return () => observer.disconnect()
  }, [])

  const variantClasses = {
    default: '',
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

  // Glass background (matching AppHeader WavePattern exactly)
  /* eslint-disable no-restricted-syntax -- Glassmorphism requires specific rgba opacity for glass effect */
  const glassBackground = isDarkMode
    ? 'linear-gradient(0deg, rgba(20, 22, 30, 0.85) 0%, rgba(29, 31, 42, 0.7) 100%)'
    : 'rgba(255, 255, 255, 0.15)'
  /* eslint-enable no-restricted-syntax */

  return (
    <footer
      className={cn('relative py-3 sm:py-4 overflow-hidden', variantClasses[variant], className)}
      data-slot="footer"
    >
      {/* Glass background layer - matches AppHeader WavePattern structure */}
      {variant === 'default' && (
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            background: glassBackground,
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          }}
        />
      )}

      {/* Gradient border on top edge - matches AppHeader/AppSidebar style */}
      {variant === 'default' && (
        <div
          className="absolute top-0 left-0 right-0 h-px pointer-events-none bg-gradient-to-r from-transparent via-default to-transparent z-20"
          data-slot="footer-border"
        />
      )}

      {/* Content - on top of glass layer */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6">
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
