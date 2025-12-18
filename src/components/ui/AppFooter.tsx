import * as React from 'react'
import { useState, useEffect } from 'react'
import { cn } from '../../lib/utils'
import { PATTERNS } from '../../assets/logos'
import { MadeWithLove } from './MadeWithLove'

// =============================================================================
// TYPES
// =============================================================================

export interface AppFooterProps extends React.HTMLAttributes<HTMLElement> {
  /** Color mode for MadeWithLove component: 'auto' (default) detects from theme */
  colorMode?: 'dark' | 'light' | 'auto'
  /** Show compact mobile version */
  compactOnMobile?: boolean
}

// =============================================================================
// WAVE PATTERN BACKGROUND (matches header)
// =============================================================================

function WavePattern() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {/* Wave pattern layer - scaled up vertically, repeated horizontally */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${PATTERNS.wave})`,
          backgroundRepeat: 'repeat-x',
          backgroundSize: '135px 269%',
          backgroundPosition: '0% 50%',
        }}
      />
      {/* Overlay at 60% opacity - matches header, uses surface color for dark mode support */}
      <div
        className="absolute inset-0 bg-surface/60"
      />
    </div>
  )
}

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * AppFooter - Simple in-app footer with MadeWithLove branding
 *
 * **Component Type:** MOLECULE (contains MadeWithLove atom)
 *
 * Features:
 * - Responsive design: compact on mobile, full on desktop
 * - Wave pattern background (matches AppHeader)
 * - MadeWithLove logo on left, copyright text on right
 * - Automatic current year display
 *
 * @example
 * ```tsx
 * // Default (dark mode)
 * <AppFooter />
 *
 * // Light mode (on dark background)
 * <AppFooter colorMode="light" />
 *
 * // Full size on mobile (no compact mode)
 * <AppFooter compactOnMobile={false} />
 *
 * // With custom data-testid
 * <AppFooter data-testid="custom-footer" />
 * ```
 *
 * **Props:**
 * - `colorMode`: 'dark' (default) for light backgrounds, 'light' for dark backgrounds
 * - `compactOnMobile`: true (default) scales down on mobile, false keeps full size
 * - Standard HTML attributes (className, style, etc.)
 *
 * **Testing:**
 * - Use `data-testid` prop for testing (auto-applies to root element)
 * - Component has `data-slot="footer"` for structural queries
 *
 * **Accessibility:**
 * - Uses semantic `<footer>` element
 * - Copyright text uses `text-secondary` (8.7:1 contrast) for readability even at small sizes
 * - Wave pattern background is decorative (pointer-events-none)
 *
 * @component
 * @testId Auto-generated from data-testid prop (MOLECULE pattern)
 */
export function AppFooter({
  colorMode = 'auto',
  className,
  compactOnMobile = true,
  ...props
}: AppFooterProps) {
  const currentYear = new Date().getFullYear()

  // Auto-detect dark mode from document class
  // Check both html and body for Storybook compatibility (Storybook applies to body)
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains('dark') ||
                     document.body.classList.contains('dark')
      setIsDarkMode(isDark)
    }
    checkDarkMode()

    // Watch for changes on both html and body
    const observer = new MutationObserver(checkDarkMode)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class']
    })

    return () => observer.disconnect()
  }, [])

  // Determine effective color mode for MadeWithLove
  // In dark theme, use 'light' (light text on dark bg), in light theme use 'dark' (dark text on light bg)
  const effectiveColorMode = colorMode === 'auto'
    ? (isDarkMode ? 'light' : 'dark')
    : colorMode

  return (
    <footer
      className={cn(
        'relative flex items-center justify-between border-t border-default/30 bg-surface',
        // Mobile: compact height (32px = 8 * 4px grid), Desktop: normal height
        compactOnMobile ? 'h-8 md:h-auto md:py-3 px-4 md:px-6' : 'px-6 py-3',
        className
      )}
      data-slot="footer"
      {...props}
    >
      {/* Wave pattern background (matches header) */}
      <WavePattern />

      {/* Content wrapper */}
      <div className="relative z-10 flex items-center justify-between w-full">
        {/* Left: MadeWithLove */}
        <MadeWithLove
          colorMode={effectiveColorMode}
          className={compactOnMobile ? 'scale-[0.5] origin-left md:scale-100' : ''}
        />

        {/* Right: Copyright text (both mobile and desktop) */}
        {/* Using text-secondary (8.7:1) instead of text-muted (~4.5:1) for 10px text */}
        <p className={cn(
          'font-medium text-secondary',
          compactOnMobile ? 'text-[10px] md:text-xs' : 'text-xs'
        )}>
          © {currentYear} Disrupt Software Inc. All Rights reserved.
        </p>
      </div>
    </footer>
  )
}

AppFooter.displayName = 'AppFooter'

export default AppFooter
