import { useState, useRef, ReactNode } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '../../lib/utils'
import { GridBlobBackground } from '../ui/GridBlobCanvas'
import { HeroParticles } from '../ui/HeroParticles'
import { MouseParticleRenderer } from '../ui/MouseParticleRenderer'
import { BlurImage } from '../ui/BlurImage'
import { useHeroTitleRotation } from '../../hooks/useHeroTitleRotation'
import { useMouseParticles } from '../../hooks/useMouseParticles'

// =============================================================================
// TYPES
// =============================================================================

/** Image source with multiple formats */
interface ImageSource {
  webp: string
  avif: string
  fallback: string
}

/** Responsive image sets for mobile, tablet, and desktop */
export interface HeroBackgroundImage {
  mobile: ImageSource
  tablet: ImageSource
  desktop: ImageSource
  /** Tiny blurred placeholder for blur-up effect */
  placeholder: string
}

export interface HeroSectionProps {
  /** Main hero title (used when rotatingTitles not provided) */
  title: string
  /** Optional rotating titles - enables slideshow animation */
  rotatingTitles?: string[]
  /** Rotation interval in ms (default: 4000) */
  rotationInterval?: number
  /** Subtitle text */
  subtitle?: string
  /** Responsive background images with placeholder */
  backgroundImage: HeroBackgroundImage
  /** Content layout variant */
  layout?: 'center' | 'left-bottom' | 'two-column'
  /** Show particles effect */
  showParticles?: boolean
  /** Show grid blob background */
  showGridBlob?: boolean
  /** Additional content (e.g., bullet points for two-column layout) */
  children?: ReactNode
  /** Additional class name for section */
  className?: string
}

// =============================================================================
// GRADIENT OVERLAY
// =============================================================================

const HERO_GRADIENT = 'linear-gradient(0deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 30%, rgba(0,0,0,0.2) 50%, transparent 70%)'

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * Unified Hero Section component for all pages.
 * Supports different layouts: center (home), left-bottom (product), two-column (about).
 * Includes background image with blur-up loading, particles, and grid blob effects.
 */
export function HeroSection({
  title,
  rotatingTitles,
  rotationInterval = 4000,
  subtitle,
  backgroundImage,
  layout = 'center',
  showParticles = true,
  showGridBlob = true,
  children,
  className,
}: HeroSectionProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const heroFrameRef = useRef<HTMLDivElement>(null)

  // Title rotation hook
  const titlesCount = rotatingTitles?.length ?? 1
  const currentIndex = useHeroTitleRotation(titlesCount, rotationInterval)
  const displayTitle = rotatingTitles ? rotatingTitles[currentIndex] : title
  const hasRotatingTitles = rotatingTitles && rotatingTitles.length > 1

  // Mouse particles hook
  const { particles, handleMouseMove } = useMouseParticles({
    enabled: imageLoaded && showParticles,
    containerRef: heroFrameRef,
  })

  return (
    <section
      className={cn('relative mb-8 lg:mb-[56px] mt-[82px]', className)}
      data-element="hero-section"
      data-header-theme="light"
      onMouseMove={handleMouseMove}
    >
      {/* Grid Blob Background */}
      {showGridBlob && <GridBlobBackground scale={1.8} />}

      {/* Background Frame */}
      <div
        className="absolute inset-x-0 top-0 flex justify-center z-[1] px-0 sm:px-6"
        data-element="hero-bg-wrapper"
      >
        <div
          ref={heroFrameRef}
          className="w-full h-[380px] sm:h-[420px] lg:h-[499px] rounded-none sm:rounded-b-[10px] overflow-hidden relative max-w-[1440px]"
          data-element="hero-bg-frame"
          data-dark-background="true"
        >
          {/* Background Image with blur-up loading */}
          <BlurImage
            images={backgroundImage}
            placeholder={backgroundImage.placeholder}
            className="object-[center_30%] sm:object-center"
            onLoad={() => setImageLoaded(true)}
          />

          {/* Gradient overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: HERO_GRADIENT }}
          />

          {/* Particles */}
          {showParticles && imageLoaded && (
            <>
              <HeroParticles />
              <MouseParticleRenderer particles={particles} />
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div
        className="mx-auto relative z-[2] flex flex-col w-full h-[380px] sm:h-[420px] lg:h-[499px] pointer-events-none px-4 sm:px-6 max-w-[1440px]"
        data-element="hero-wrapper"
      >
        {/* Center Layout (Home page) */}
        {layout === 'center' && (
          <div
            className="w-full flex flex-col items-center justify-between relative h-full px-4 sm:px-6 lg:px-[36px] pt-[120px] sm:pt-[140px] lg:pt-[160px] pb-8 sm:pb-10 lg:pb-14"
            data-element="hero-container"
          >
            {/* Animated Title */}
            <div className="relative z-10 text-center w-full h-[80px] sm:h-[80px] lg:h-[100px]">
              {hasRotatingTitles ? (
                <AnimatePresence mode="wait">
                  <motion.h1
                    key={currentIndex}
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 30 }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                    className="absolute inset-0 flex items-center justify-center font-display font-bold text-inverse text-3xl sm:text-3xl lg:text-[48px] leading-[44px] sm:leading-[48px] lg:leading-[60px] tracking-[2.5px] sm:tracking-[3px] lg:tracking-[4px]"
                  >
                    {displayTitle}
                  </motion.h1>
                </AnimatePresence>
              ) : (
                <h1 className="absolute inset-0 flex items-center justify-center font-display font-bold text-inverse text-3xl sm:text-3xl lg:text-[48px] leading-[44px] sm:leading-[48px] lg:leading-[60px] tracking-[2.5px] sm:tracking-[3px] lg:tracking-[4px]">
                  {displayTitle}
                </h1>
              )}
            </div>

            {/* Subtitle */}
            {subtitle && (
              <p className="text-center text-accent-light font-display font-medium text-sm sm:text-base lg:text-lg max-w-[340px] sm:max-w-none z-10">
                {subtitle}
              </p>
            )}

            {children}
          </div>
        )}

        {/* Left-Bottom Layout (Product page) */}
        {layout === 'left-bottom' && (
          <div
            className="w-full flex flex-col items-start justify-end relative h-full px-4 sm:px-6 lg:px-[36px] pb-8 sm:pb-10 lg:pb-12"
            data-element="hero-container"
          >
            {/* Title */}
            <h1 className="font-display font-bold text-page text-[32px] sm:text-[32px] lg:text-[48px] leading-[44px] sm:leading-[48px] lg:leading-[60px] tracking-[2.5px] sm:tracking-[3px] lg:tracking-[4px] mb-4">
              {displayTitle}
            </h1>

            {/* Subtitle */}
            {subtitle && (
              <p className="font-display font-medium text-accent-light text-sm sm:text-base lg:text-lg">
                {subtitle}
              </p>
            )}

            {children}
          </div>
        )}

        {/* Two-Column Layout (About page) */}
        {layout === 'two-column' && (
          <div
            className="w-full flex flex-col items-start justify-center relative h-full px-4 sm:px-6 lg:px-[36px]"
            data-element="hero-container"
          >
            <div className="w-full flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 lg:gap-8">
              {/* Left Column - Animated Title */}
              <div className="lg:flex-1">
                <div className="relative h-[80px] sm:h-[100px] lg:h-[140px]">
                  {hasRotatingTitles ? (
                    <AnimatePresence mode="wait">
                      <motion.h1
                        key={currentIndex}
                        initial={{ opacity: 0, y: -40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 40 }}
                        transition={{ duration: 0.4, ease: 'easeInOut' }}
                        className="absolute inset-0 flex items-start font-display font-bold text-inverse text-[32px] sm:text-[40px] lg:text-[56px] leading-[1.15] tracking-[2px] sm:tracking-[3px] lg:tracking-[4px]"
                      >
                        {displayTitle}
                      </motion.h1>
                    </AnimatePresence>
                  ) : (
                    <h1 className="absolute inset-0 flex items-start font-display font-bold text-inverse text-[32px] sm:text-[40px] lg:text-[56px] leading-[1.15] tracking-[2px] sm:tracking-[3px] lg:tracking-[4px]">
                      {displayTitle}
                    </h1>
                  )}
                </div>
              </div>

              {/* Right Column - Subtitle & Children (bullet points) */}
              <div className="lg:max-w-[420px]">
                {subtitle && (
                  <p className="font-display font-medium text-accent-light text-sm sm:text-base lg:text-lg mb-5">
                    {subtitle}
                  </p>
                )}
                {children}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
