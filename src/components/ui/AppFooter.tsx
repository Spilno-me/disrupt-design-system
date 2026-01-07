import * as React from 'react'
import { useState, useEffect } from 'react'
import { cn } from '../../lib/utils'
import { MadeWithLove } from './MadeWithLove'
import { ALIAS } from '../../constants/designTokens'

// =============================================================================
// CONSTANTS
// =============================================================================

/** Footer height in pixels - compact mobile version (8 * 4px grid) */
const FOOTER_HEIGHT_COMPACT_PX = 32

/** Mobile scale factor for MadeWithLove logo */
const MOBILE_LOGO_SCALE = 0.5

/** Wave animation tile width for seamless scrolling */
const WAVE_TILE_WIDTH_PX = 1600

/** Wave animation total width (4× tile for seamless loop) */
const WAVE_ANIMATION_WIDTH_PX = 6400

/** Wave SVG height in pixels */
const WAVE_SVG_HEIGHT_PX = 40

/** Wave animation duration in seconds */
const WAVE_ANIMATION_DURATION_S = 40

/** Wave opacity (0-100 scale for CSS class) */
const WAVE_OPACITY_PERCENT = 30

/** Wave SVG stroke width */
const WAVE_STROKE_WIDTH_PX = 4

// =============================================================================
// TYPES
// =============================================================================

/**
 * AppFooter component props
 * @extends React.HTMLAttributes<HTMLElement> - Supports all standard HTML footer attributes
 */
/** AppFooter props - DDS owns all styling, no className allowed */
export interface AppFooterProps {
  /** Color mode for MadeWithLove component: 'auto' (default) detects from theme */
  colorMode?: 'dark' | 'light' | 'auto'
  /** Show compact mobile version */
  compactOnMobile?: boolean
  /** Visual variant: 'default' shows full footer, 'wave-only' shows only the wave animation */
  variant?: 'default' | 'wave-only'
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Checks if dark mode is enabled by inspecting document classes.
 * Supports both html and body class detection for Storybook compatibility.
 */
function checkDarkModeEnabled(): boolean {
  return document.documentElement.classList.contains('dark') ||
         document.body.classList.contains('dark')
}

/**
 * Creates a MutationObserver to watch for dark mode class changes.
 * @param callback - Function to call when dark mode changes
 * @returns Cleanup function to disconnect observer
 */
function createDarkModeObserver(callback: () => void): () => void {
  const observer = new MutationObserver(callback)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
  observer.observe(document.body, { attributes: true, attributeFilter: ['class'] })
  return () => observer.disconnect()
}

/**
 * Returns wave gradient colors based on dark mode state.
 * @param isDarkMode - Current dark mode state
 */
function getWaveGradientColors(isDarkMode: boolean): { start: string; end: string } {
  return {
    start: isDarkMode ? ALIAS.wave.dark.start : ALIAS.wave.light.start,
    end: isDarkMode ? ALIAS.wave.dark.end : ALIAS.wave.light.end,
  }
}

/**
 * Returns glass background style for wave pattern.
 * @param isDarkMode - Current dark mode state
 */
function getGlassBackground(isDarkMode: boolean): string {
  /* eslint-disable no-restricted-syntax -- Glassmorphism requires specific rgba opacity for glass effect */
  // Reduced opacity for more transparent glass effect - allows background grid to show through
  // Light: 30% white, Dark: 30-40% dark
  return isDarkMode
    ? 'linear-gradient(0deg, rgba(20, 22, 30, 0.4) 0%, rgba(29, 31, 42, 0.3) 100%)'
    : 'rgba(255, 255, 255, 0.3)'
  /* eslint-enable no-restricted-syntax */
}

/**
 * Generates SVG data URI for wave pattern.
 * @param gradientStart - Start color for gradient
 * @param gradientEnd - End color for gradient
 */
function generateWaveSvgDataUri(gradientStart: string, gradientEnd: string): string {
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${WAVE_TILE_WIDTH_PX}" height="${WAVE_SVG_HEIGHT_PX}" viewBox="0 0 ${WAVE_TILE_WIDTH_PX} ${WAVE_SVG_HEIGHT_PX}" preserveAspectRatio="none"><defs><linearGradient id="fwg" x1="0%" x2="100%" y1="0%" y2="0%"><stop stop-color="${gradientStart}" offset="0%"/><stop stop-color="${gradientEnd}" offset="50%"/><stop stop-color="${gradientStart}" offset="100%"/></linearGradient></defs><path fill="none" stroke="url(#fwg)" stroke-width="${WAVE_STROKE_WIDTH_PX}" stroke-linecap="round" d="M0 8 c200 0 300 24 400 24 c100 0 200-24 400-24 c200 0 300 24 400 24 c100 0 200-24 400-24"/></svg>`
  return `data:image/svg+xml,${encodeURIComponent(svgContent)}`
}

/**
 * Gets the current year for copyright display.
 */
function getCurrentYear(): number {
  return new Date().getFullYear()
}

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

/**
 * CSS keyframes for wave animation.
 * @component ATOM
 */
function WaveKeyframes() {
  return (
    <style>{`
      @keyframes footer-wave-scroll {
        0% { transform: translateX(0) translateZ(0); }
        100% { transform: translateX(-${WAVE_TILE_WIDTH_PX}px) translateZ(0); }
      }
    `}</style>
  )
}
WaveKeyframes.displayName = 'WaveKeyframes'

/**
 * Glass background layer for wave pattern.
 * @component ATOM
 */
function WaveGlassBackground({ isDarkMode }: { isDarkMode: boolean }) {
  return (
    <div
      className="absolute inset-0 z-0"
      data-slot="wave-glass"
      style={{
        background: getGlassBackground(isDarkMode),
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    />
  )
}
WaveGlassBackground.displayName = 'WaveGlassBackground'

/**
 * Single animated wave layer.
 * @component ATOM
 */
function WaveLayer({ waveSvg }: { waveSvg: string }) {
  return (
    <div
      // Static classes only - dynamic values moved to inline style
      className="absolute left-0"
      data-slot="wave-layer"
      style={{
        height: WAVE_SVG_HEIGHT_PX,
        opacity: WAVE_OPACITY_PERCENT / 100,
        width: WAVE_ANIMATION_WIDTH_PX,
        backgroundImage: `url("${waveSvg}")`,
        backgroundRepeat: 'repeat-x',
        backgroundSize: `${WAVE_TILE_WIDTH_PX}px ${WAVE_SVG_HEIGHT_PX}px`,
        animation: `footer-wave-scroll ${WAVE_ANIMATION_DURATION_S}s linear infinite`,
      }}
    />
  )
}
WaveLayer.displayName = 'WaveLayer'

/**
 * Animated wave pattern with glass background (matches AppHeader style).
 *
 * Features:
 * - Glass blur background layer
 * - Single stroke-only wave line
 * - Wave contained within footer bounds
 *
 * @component ATOM
 */
function WavePattern() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const updateDarkMode = () => setIsDarkMode(checkDarkModeEnabled())
    updateDarkMode()
    return createDarkModeObserver(updateDarkMode)
  }, [])

  const { start, end } = getWaveGradientColors(isDarkMode)
  const waveSvg = generateWaveSvgDataUri(start, end)

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      data-slot="wave-pattern"
    >
      <WaveKeyframes />
      <WaveGlassBackground isDarkMode={isDarkMode} />
      <div className="absolute inset-0 z-10 flex items-center">
        <WaveLayer waveSvg={waveSvg} />
      </div>
    </div>
  )
}
WavePattern.displayName = 'WavePattern'

/**
 * Gradient border on top edge of footer.
 * @component ATOM
 */
function FooterBorder() {
  return (
    <div
      className="absolute top-0 left-0 right-0 h-px pointer-events-none bg-gradient-to-r from-transparent via-default to-transparent z-20"
      data-slot="footer-border"
    />
  )
}
FooterBorder.displayName = 'FooterBorder'

/**
 * Copyright text with year.
 * @component ATOM
 */
function CopyrightText({
  compactOnMobile,
}: {
  compactOnMobile: boolean
}) {
  return (
    <p
      className={cn(
        'font-medium text-secondary',
        compactOnMobile ? 'text-[10px] md:text-xs' : 'text-xs'
      )}
      data-slot="copyright"
    >
      © {getCurrentYear()} Disrupt Software Inc. All Rights reserved.
    </p>
  )
}
CopyrightText.displayName = 'CopyrightText'

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * AppFooter - Simple in-app footer with MadeWithLove branding
 *
 * @component MOLECULE (contains MadeWithLove atom)
 *
 * A footer component that provides consistent branding across Disrupt products.
 * Features animated wave pattern background matching AppHeader style.
 *
 * ## Features
 * - Responsive design: compact on mobile, full on desktop
 * - Wave pattern background (matches AppHeader)
 * - MadeWithLove logo on left, copyright text on right
 * - Automatic current year display
 *
 * ## Usage Examples
 *
 * ### Default (auto-detects theme)
 * ```tsx
 * <AppFooter />
 * ```
 *
 * ### Light mode (on dark background)
 * ```tsx
 * <AppFooter colorMode="light" />
 * ```
 *
 * ### Full size on mobile (no compact mode)
 * ```tsx
 * <AppFooter compactOnMobile={false} />
 * ```
 *
 * ### Wave-only variant
 * ```tsx
 * <AppFooter variant="wave-only" />
 * ```
 *
 *
 * ## Testing
 * Use these data-slot attributes for testing:
 * - `data-slot="footer"` - Main footer container
 * - `data-slot="wave-pattern"` - Wave background container
 * - `data-slot="wave-glass"` - Glass backdrop layer
 * - `data-slot="wave-layer"` - Animated wave element
 * - `data-slot="footer-border"` - Top gradient border
 * - `data-slot="footer-content"` - Content wrapper
 * - `data-slot="copyright"` - Copyright text
 *
 * ## Accessibility
 * - Uses semantic `<footer>` element
 * - Copyright text uses `text-secondary` (8.7:1 contrast) for readability
 * - Wave pattern background is decorative (pointer-events-none)
 *
 * @example
 * ```tsx
 * // Basic usage
 * <AppFooter />
 *
 * // With all options
 * <AppFooter
 *   colorMode="auto"
 *   compactOnMobile={true}
 *   variant="default"
 * />
 * ```
 */
export function AppFooter({
  colorMode = 'auto',
  compactOnMobile = true,
  variant = 'default',
}: AppFooterProps) {
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const updateDarkMode = () => setIsDarkMode(checkDarkModeEnabled())
    updateDarkMode()
    return createDarkModeObserver(updateDarkMode)
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
        compactOnMobile
          ? `h-${FOOTER_HEIGHT_COMPACT_PX / 4} md:h-auto md:py-3 px-4 md:px-6`
          : 'px-6 py-3'
      )}
      data-slot="footer"
    >
      {/* Wave pattern background (matches header) */}
      <WavePattern />

      {/* Gradient border on top edge */}
      <FooterBorder />

      {/* Content wrapper - z-20 to be ABOVE wave line (z-10) */}
      <div
        className="relative z-20 flex items-center justify-between w-full"
        data-slot="footer-content"
      >
        {/* Left: MadeWithLove */}
        <MadeWithLove
          colorMode={effectiveColorMode}
          className={compactOnMobile ? `scale-[${MOBILE_LOGO_SCALE}] origin-left md:scale-100` : ''}
        />

        {/* Right: Copyright text */}
        <CopyrightText compactOnMobile={compactOnMobile} />
      </div>
    </footer>
  )
}

AppFooter.displayName = 'AppFooter'

// =============================================================================
// EXPORTS
// =============================================================================

export default AppFooter
export { WavePattern, FooterBorder, CopyrightText }
