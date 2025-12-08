import { ReactNode } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '../../lib/utils'
import { Button } from '../ui/button'
import { useHeroTitleRotation } from '../../hooks/useHeroTitleRotation'
import { GRADIENTS } from '../../constants/designTokens'
import { ResponsivePicture, ResponsiveImageSets } from '../ui/ResponsivePicture'

// =============================================================================
// TYPES
// =============================================================================

export interface HeroSectionProps {
  /** Main hero title (used when rotatingTitles not provided) */
  title: string
  /** Optional rotating titles - enables slideshow animation */
  rotatingTitles?: string[]
  /** Rotation interval in ms (default: 4000) */
  rotationInterval?: number
  /** Subtitle text */
  subtitle?: string
  /** Primary CTA button text */
  primaryButtonText?: string
  /** Primary button click handler */
  onPrimaryButtonClick?: () => void
  /** Secondary CTA button text */
  secondaryButtonText?: string
  /** Secondary button click handler */
  onSecondaryButtonClick?: () => void
  /** Background image URL (simple) */
  backgroundImage?: string
  /** Responsive background images (optimized with AVIF/WebP/fallback) */
  responsiveBackgroundImage?: ResponsiveImageSets
  /** Background color when no image */
  backgroundColor?: 'dark' | 'primary' | 'gradient'
  /** Content alignment */
  alignment?: 'center' | 'left'
  /** Hero height */
  height?: 'small' | 'medium' | 'large' | 'full'
  /** Show gradient overlay on background image */
  showOverlay?: boolean
  /** Additional content below buttons */
  children?: ReactNode
  /** Additional class name */
  className?: string
}

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * Reusable Hero Section with configurable content and styling.
 * Supports background images, gradient overlays, rotating titles, and multiple CTAs.
 */
export function HeroSection({
  title,
  rotatingTitles,
  rotationInterval = 4000,
  subtitle,
  primaryButtonText,
  onPrimaryButtonClick,
  secondaryButtonText,
  onSecondaryButtonClick,
  backgroundImage,
  responsiveBackgroundImage,
  backgroundColor = 'dark',
  alignment = 'center',
  height = 'medium',
  showOverlay = true,
  children,
  className,
}: HeroSectionProps) {
  const heightClasses = {
    small: 'min-h-[300px] sm:min-h-[350px]',
    medium: 'min-h-[400px] sm:min-h-[450px] lg:min-h-[500px]',
    large: 'min-h-[500px] sm:min-h-[600px] lg:min-h-[700px]',
    full: 'min-h-screen',
  }

  const bgColorClasses = {
    dark: 'bg-dark',
    primary: 'bg-primary',
    gradient: 'bg-gradient-to-br from-dark via-primary/80 to-dark',
  }

  const alignmentClasses = {
    center: 'items-center text-center',
    left: 'items-start text-left',
  }

  // Use rotating titles hook if rotatingTitles provided
  const currentIndex = useHeroTitleRotation(
    rotatingTitles?.length ?? 1,
    rotationInterval
  )

  const displayTitle = rotatingTitles ? rotatingTitles[currentIndex] : title
  const hasRotatingTitles = rotatingTitles && rotatingTitles.length > 1
  const hasBackgroundImage = backgroundImage || responsiveBackgroundImage

  return (
    <section
      className={cn(
        'relative overflow-hidden',
        heightClasses[height],
        !hasBackgroundImage && bgColorClasses[backgroundColor],
        className
      )}
      data-element="hero-section"
    >
      {/* Background Image - Responsive (optimized) */}
      {responsiveBackgroundImage && (
        <div className="absolute inset-0">
          <ResponsivePicture
            images={responsiveBackgroundImage}
            alt=""
            loading="eager"
            className="w-full h-full object-cover"
          />
          {showOverlay && (
            <div
              className="absolute inset-0"
              style={{
                background: GRADIENTS.heroOverlayStrong,
              }}
            />
          )}
        </div>
      )}

      {/* Background Image - Simple URL (legacy support) */}
      {backgroundImage && !responsiveBackgroundImage && (
        <div className="absolute inset-0">
          <img
            src={backgroundImage}
            alt=""
            className="w-full h-full object-cover"
          />
          {showOverlay && (
            <div
              className="absolute inset-0"
              style={{
                background: GRADIENTS.heroOverlayStrong,
              }}
            />
          )}
        </div>
      )}

      {/* Content */}
      <div
        className={cn(
          'relative z-10 flex flex-col justify-center h-full px-4 sm:px-6 py-16',
          alignmentClasses[alignment]
        )}
      >
        <div className="max-w-[1440px] mx-auto w-full">
          {/* Title - with optional rotation animation */}
          {hasRotatingTitles ? (
            <div
              className={cn(
                'relative h-[60px] sm:h-[70px] lg:h-[80px] mb-4',
                alignment === 'center' && 'max-w-4xl mx-auto'
              )}
            >
              <AnimatePresence mode="wait">
                <motion.h1
                  key={currentIndex}
                  initial={{ opacity: 0, y: -30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 30 }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                  className="absolute inset-0 flex items-center justify-center font-display font-bold text-white text-3xl sm:text-4xl lg:text-5xl leading-tight tracking-wide"
                >
                  {displayTitle}
                </motion.h1>
              </AnimatePresence>
            </div>
          ) : (
            <h1
              className={cn(
                'font-display font-bold text-white text-3xl sm:text-4xl lg:text-5xl leading-tight tracking-wide mb-4',
                alignment === 'center' && 'max-w-4xl mx-auto'
              )}
            >
              {displayTitle}
            </h1>
          )}

          {/* Subtitle */}
          {subtitle && (
            <p
              className={cn(
                'text-teal font-display font-medium text-base sm:text-lg lg:text-xl mb-8',
                alignment === 'center' && 'max-w-2xl mx-auto'
              )}
            >
              {subtitle}
            </p>
          )}

          {/* Buttons */}
          {(primaryButtonText || secondaryButtonText) && (
            <div
              className={cn(
                'flex gap-4 mb-8',
                alignment === 'center' && 'justify-center'
              )}
            >
              {secondaryButtonText && (
                <Button variant="outline" onClick={onSecondaryButtonClick}>
                  {secondaryButtonText}
                </Button>
              )}
              {primaryButtonText && (
                <Button variant="contact" onClick={onPrimaryButtonClick}>
                  {primaryButtonText}
                </Button>
              )}
            </div>
          )}

          {/* Additional content */}
          {children}
        </div>
      </div>
    </section>
  )
}
