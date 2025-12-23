import * as React from 'react'
import { useState, useEffect } from 'react'
import { cn } from '../../lib/utils'
import { MadeWithLove } from './MadeWithLove'
import { ALIAS } from '../../constants/designTokens'

// =============================================================================
// TYPES
// =============================================================================

export interface AppFooterProps extends React.HTMLAttributes<HTMLElement> {
  /** Color mode for MadeWithLove component: 'auto' (default) detects from theme */
  colorMode?: 'dark' | 'light' | 'auto'
  /** Show compact mobile version */
  compactOnMobile?: boolean
  /** Visual variant: 'default' shows full footer, 'wave-only' shows only the wave animation */
  variant?: 'default' | 'wave-only'
}

// =============================================================================
// WAVE PATTERN BACKGROUND (matches header - animated ocean wave)
// =============================================================================

/**
 * Animated wave pattern with glass background (matches AppHeader style)
 *
 * Features:
 * - Glass blur background layer
 * - Single stroke-only wave line
 * - Wave contained within footer bounds
 */
function WavePattern() {
  // Detect dark mode for color adaptation
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

  // Color adaptation for wave gradient using ALIAS tokens
  const gradientStart = isDarkMode ? ALIAS.wave.dark.start : ALIAS.wave.light.start
  const gradientEnd = isDarkMode ? ALIAS.wave.dark.end : ALIAS.wave.light.end

  // Glass background (matching AppHeader WavePattern exactly)
  /* eslint-disable no-restricted-syntax -- Glassmorphism requires specific rgba opacity for glass effect */
  const glassBackground = isDarkMode
    ? 'linear-gradient(0deg, rgba(20, 22, 30, 0.85) 0%, rgba(29, 31, 42, 0.7) 100%)'
    : 'rgba(255, 255, 255, 0.15)'
  /* eslint-enable no-restricted-syntax */

  // Wave SVG - stroke only, contained within 40px height
  // Path oscillates from y=8 to y=32 (amplitude 24px), stroke 4px stays within bounds
  const waveSvg = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="40" viewBox="0 0 1600 40" preserveAspectRatio="none"><defs><linearGradient id="fwg" x1="0%" x2="100%" y1="0%" y2="0%"><stop stop-color="${gradientStart}" offset="0%"/><stop stop-color="${gradientEnd}" offset="50%"/><stop stop-color="${gradientStart}" offset="100%"/></linearGradient></defs><path fill="none" stroke="url(#fwg)" stroke-width="4" stroke-linecap="round" d="M0 8 c200 0 300 24 400 24 c100 0 200-24 400-24 c200 0 300 24 400 24 c100 0 200-24 400-24"/></svg>`)}`

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* CSS keyframes for wave animation */}
      <style>{`
        @keyframes footer-wave-scroll {
          0% { transform: translateX(0) translateZ(0); }
          100% { transform: translateX(-1600px) translateZ(0); }
        }
      `}</style>

      {/* Glass background layer - matches AppHeader WavePattern exactly */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: glassBackground,
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
      />

      {/* Single wave line - subtle, almost not there */}
      <div className="absolute inset-0 z-10 flex items-center opacity-30">
        <div
          className="absolute left-0 h-[40px]"
          style={{
            // eslint-disable-next-line no-restricted-syntax -- Animation width: 4× tile width (1600px) for seamless scroll
            width: '6400px',
            backgroundImage: `url("${waveSvg}")`,
            backgroundRepeat: 'repeat-x',
            backgroundSize: '1600px 40px',
            animation: 'footer-wave-scroll 40s linear infinite',
          }}
        />
      </div>
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
 * // Wave-only: transparent background, no border, wave + content visible
 * <AppFooter variant="wave-only" />
 *
 * // With custom data-testid
 * <AppFooter data-testid="custom-footer" />
 * ```
 *
 * **Props:**
 * - `colorMode`: 'dark' (default) for light backgrounds, 'light' for dark backgrounds
 * - `compactOnMobile`: true (default) scales down on mobile, false keeps full size
 * - `variant`: 'default' shows full footer, 'wave-only' removes background/border (transparent)
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
  variant = 'default',
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

  // Note: variant prop kept for backward compatibility but currently unused
  // The gradient border now always shows regardless of variant
  void variant

  return (
    <footer
      className={cn(
        'relative flex items-center justify-between overflow-hidden',
        // No border class - gradient border is rendered separately
        // Mobile: compact height (32px = 8 * 4px grid), Desktop: normal height
        compactOnMobile ? 'h-8 md:h-auto md:py-3 px-4 md:px-6' : 'px-6 py-3',
        className
      )}
      data-slot="footer"
      {...props}
    >
      {/* Wave pattern background (matches header) */}
      <WavePattern />

      {/* Gradient border on top edge - matches AppHeader style (always visible) */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none bg-gradient-to-r from-transparent via-default to-transparent z-20"
        data-slot="footer-border"
      />

      {/* Content wrapper - z-20 to be ABOVE wave line (z-10) */}
      <div className="relative z-20 flex items-center justify-between w-full">
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
