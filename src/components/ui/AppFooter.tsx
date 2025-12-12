import * as React from 'react'
import { cn } from '../../lib/utils'
import { ALIAS } from '../../constants/designTokens'
import { PATTERNS } from '../../assets/logos'
import { MadeWithLove } from './MadeWithLove'

// =============================================================================
// TYPES
// =============================================================================

export interface AppFooterProps {
  /** Color mode for MadeWithLove component */
  colorMode?: 'dark' | 'light'
  /** Additional className */
  className?: string
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
      {/* White overlay at 60% opacity - matches header */}
      <div
        className="absolute inset-0 bg-white/60"
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
 * Features:
 * - Responsive design: compact on mobile, full on desktop
 * - Pattern grid background
 * - MadeWithLove logo on left, copyright text on right
 */
export function AppFooter({
  colorMode = 'dark',
  className,
  compactOnMobile = true,
}: AppFooterProps) {
  const currentYear = new Date().getFullYear()

  return (
    <footer
      className={cn(
        'relative flex items-center justify-between border-t border-default/30',
        // Mobile: compact height, Desktop: normal height
        compactOnMobile ? 'h-[30px] md:h-auto md:py-3 px-4 md:px-6' : 'px-6 py-3',
        className
      )}
      style={{
        backgroundColor: ALIAS.background.surface,
      }}
      data-element="app-footer"
    >
      {/* Wave pattern background (matches header) */}
      <WavePattern />

      {/* Content wrapper */}
      <div className="relative z-10 flex items-center justify-between w-full">
        {/* Left: MadeWithLove */}
        <MadeWithLove
          colorMode={colorMode}
          className={compactOnMobile ? 'scale-[0.5] origin-left md:scale-100' : ''}
        />

        {/* Right: Copyright text (both mobile and desktop) */}
        <p className={cn(
          'font-medium text-muted',
          compactOnMobile ? 'text-[10px] md:text-xs' : 'text-xs'
        )}>
          © {currentYear} Disrupt Software Inc. All Rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default AppFooter
