/**
 * Logo and Pattern Assets
 *
 * Exports all logo and pattern assets as properly resolved URLs
 * that work when the package is installed via npm.
 *
 * @module assets/logos
 */

// Import logos as URLs (Vite will handle the paths)
import flowLogoLight from '../../public/logos/flow-logo-full-light.svg'
import flowLogoDark from '../../public/logos/flow-logo-full-dark.svg'
import marketLogoLight from '../../public/logos/market-logo-full-ligh.svg'
import marketLogoDark from '../../public/logos/market-logo-full-dark.svg'
import partnerLogoLight from '../../public/logos/partner-logo-full-light.svg'
import partnerLogoDark from '../../public/logos/partner-logo-full-dark.svg'
import disruptLogo from '../../public/disrupt-logo.svg'
import dPixelsDark from '../../public/logos/D-pixels-dark-full.svg'
import dPixelsLight from '../../public/logos/D-pixels-light-full.svg'

// Import patterns
import wavePatternSvg from '../../public/patterns/wave-pattern.svg'
import wavePatternPng from '../../public/patterns/wave-pattern.png'
import wavyLinePattern from '../../public/patterns/wavy-line-pattern.svg'

// =============================================================================
// LOGO EXPORTS
// =============================================================================

/**
 * Product logos for Flow, Market, and Partner
 * Each product has light and dark variants
 */
export const LOGOS = {
  flow: {
    light: flowLogoLight,
    dark: flowLogoDark,
  },
  market: {
    light: marketLogoLight,
    dark: marketLogoDark,
  },
  partner: {
    light: partnerLogoLight,
    dark: partnerLogoDark,
  },
  disrupt: disruptLogo,
  dPixels: {
    light: dPixelsLight,
    dark: dPixelsDark,
  },
} as const

/**
 * Pattern assets for backgrounds
 */
export const PATTERNS = {
  wave: wavePatternSvg,
  waveLines: wavePatternPng, // Figma pattern - multiple wavy lines
  wavyLine: wavyLinePattern,
} as const

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type ProductLogoType = keyof typeof LOGOS
export type PatternType = keyof typeof PATTERNS
