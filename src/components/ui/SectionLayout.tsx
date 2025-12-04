import { ReactNode, useState, useRef, useEffect } from 'react'
import { SkeletonImage } from './Skeleton'
import { GridBlobBackground } from './GridBlobCanvas'
import { ResponsiveImage } from './ResponsiveImage'
import { cn } from '../../lib/utils'

// =============================================================================
// SECTION WRAPPER
// =============================================================================

interface SectionWrapperProps {
  children: ReactNode
  /** Background color variant */
  background?: 'white' | 'cream'
  /** Show grid blob background animation */
  showBlob?: boolean
  /** Blob scale (default 1.5) */
  blobScale?: number
  /** Data attribute for section identification */
  dataElement?: string
  /** Header theme when this section is active: 'dark' = light bg (dark text), 'light' = dark bg (white text) */
  headerTheme?: 'dark' | 'light'
  className?: string
}

/**
 * Consistent section wrapper with background color, padding, borders, and optional blob.
 * Replaces repeated section element patterns across components.
 */
export function SectionWrapper({
  children,
  background = 'white',
  showBlob = false,
  blobScale = 1.5,
  dataElement,
  headerTheme,
  className = '',
}: SectionWrapperProps) {
  const bgClass = background === 'cream' ? 'bg-cream' : 'bg-white'
  const needsRelative = showBlob ? 'relative' : ''

  // Auto-detect header theme based on background if not specified
  const autoTheme = background === 'white' || background === 'cream' ? 'dark' : 'light'
  const finalHeaderTheme = headerTheme || autoTheme

  return (
    <section
      className={cn(
        bgClass,
        needsRelative,
        'py-8 sm:py-12 lg:py-16 border-y-dashed-figma overflow-hidden',
        className
      )}
      data-element={dataElement}
      data-header-theme={finalHeaderTheme}
    >
      {showBlob && <GridBlobBackground scale={blobScale} />}
      {children}
    </section>
  )
}

// =============================================================================
// SECTION CONTAINER
// =============================================================================

interface SectionContainerProps {
  children: ReactNode
  className?: string
}

/**
 * Standard section container with max-width and horizontal padding.
 * Replaces repeated `max-w-container mx-auto px-4 sm:px-6` pattern.
 */
export function SectionContainer({
  children,
  className = '',
}: SectionContainerProps) {
  return (
    <div className={`max-w-container mx-auto px-4 sm:px-6 ${className}`}>
      {children}
    </div>
  )
}

// =============================================================================
// TWO COLUMN LAYOUT
// =============================================================================

interface TwoColumnLayoutProps {
  children: ReactNode
  className?: string
  /** Reverse column order on desktop */
  reverse?: boolean
  /** Vertical alignment */
  align?: 'start' | 'center' | 'end'
}

/**
 * Two-column responsive layout (stacked on mobile, side-by-side on desktop).
 * Replaces repeated `flex flex-col lg:flex-row items-center gap-6 sm:gap-10 lg:gap-16` pattern.
 */
export function TwoColumnLayout({
  children,
  className = '',
  reverse = false,
  align = 'center',
}: TwoColumnLayoutProps) {
  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
  }

  const directionClass = reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'

  return (
    <div className={`flex flex-col ${directionClass} ${alignClasses[align]} gap-6 sm:gap-10 lg:gap-16 ${className}`}>
      {children}
    </div>
  )
}

// =============================================================================
// SECTION IMAGE
// =============================================================================

interface ImageSource {
  mobile: {
    webp: string
    avif: string
    fallback: string
  }
  tablet: {
    webp: string
    avif: string
    fallback: string
  }
  desktop?: {
    webp: string
    avif: string
    fallback: string
  }
}

interface SectionImageProps {
  /** Original image source (for simple usage) */
  src?: string
  /** Optimized responsive sources */
  sources?: ImageSource
  alt: string
  className?: string
  /** Priority loading for above-the-fold images */
  priority?: boolean
  /** Aspect ratio for skeleton */
  aspectRatio?: 'square' | '4/3' | '16/9' | 'auto'
}

/**
 * Section image with consistent styling (rounded corners, shadow).
 * Supports both simple src and optimized responsive sources.
 * Includes lazy loading, skeleton placeholder, and error handling.
 */
export function SectionImage({
  src,
  sources,
  alt,
  className = '',
  priority = false,
  aspectRatio = '4/3',
}: SectionImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(priority)
  const [hasError, setHasError] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (priority || !containerRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true)
            observer.disconnect()
          }
        })
      },
      {
        rootMargin: '200px',
        threshold: 0.01,
      }
    )

    observer.observe(containerRef.current)

    return () => observer.disconnect()
  }, [priority])

  if (hasError) {
    return (
      <div
        className={cn(
          'w-full rounded-none sm:rounded-lg bg-muted/20 flex items-center justify-center',
          'shadow-none sm:shadow-[0_4px_20px_rgba(0,0,0,0.08)]',
          aspectRatio === 'square' && 'aspect-square',
          aspectRatio === '4/3' && 'aspect-[4/3]',
          aspectRatio === '16/9' && 'aspect-video',
          aspectRatio === 'auto' && 'h-[300px]',
          className
        )}
      >
        <span className="text-muted text-sm">Image unavailable</span>
      </div>
    )
  }

  // Use optimized sources if provided
  if (sources) {
    return (
      <div
        ref={containerRef}
        className={cn(
          'relative overflow-hidden rounded-none sm:rounded-lg',
          'shadow-none sm:shadow-[0_4px_20px_rgba(0,0,0,0.08)]',
          'h-[280px] sm:h-auto',  // Fixed height on mobile, auto on tablet+
          className
        )}
      >
        {!isLoaded && (
          <SkeletonImage
            aspectRatio={aspectRatio}
            className="absolute inset-0 z-10"
          />
        )}

        {isInView && (
          <picture>
            {/* AVIF sources */}
            {sources.desktop && (
              <source
                media="(min-width: 1024px)"
                srcSet={sources.desktop.avif}
                type="image/avif"
              />
            )}
            <source
              media="(min-width: 768px)"
              srcSet={sources.tablet.avif}
              type="image/avif"
            />
            <source srcSet={sources.mobile.avif} type="image/avif" />

            {/* WebP sources */}
            {sources.desktop && (
              <source
                media="(min-width: 1024px)"
                srcSet={sources.desktop.webp}
                type="image/webp"
              />
            )}
            <source
              media="(min-width: 768px)"
              srcSet={sources.tablet.webp}
              type="image/webp"
            />
            <source srcSet={sources.mobile.webp} type="image/webp" />

            {/* Fallback */}
            <img
              src={sources.tablet.fallback}
              alt={alt}
              loading={priority ? 'eager' : 'lazy'}
              decoding={priority ? 'sync' : 'async'}
              onLoad={() => setIsLoaded(true)}
              onError={() => setHasError(true)}
              className={cn(
                'w-full h-full object-contain sm:object-cover sm:h-auto transition-opacity duration-500',
                isLoaded ? 'opacity-100' : 'opacity-0'
              )}
            />
          </picture>
        )}
      </div>
    )
  }

  // Simple src fallback
  return (
    <div
      ref={containerRef}
      className={cn(
        'relative overflow-hidden rounded-none sm:rounded-lg',
        'shadow-none sm:shadow-[0_4px_20px_rgba(0,0,0,0.08)]',
        'h-[280px] sm:h-auto',  // Fixed height on mobile, auto on tablet+
        className
      )}
    >
      {!isLoaded && (
        <SkeletonImage
          aspectRatio={aspectRatio}
          className="absolute inset-0 z-10"
        />
      )}

      {isInView && (
        <img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={cn(
            'w-full h-full object-contain sm:object-cover sm:h-auto transition-opacity duration-500',
            isLoaded ? 'opacity-100' : 'opacity-0'
          )}
        />
      )}
    </div>
  )
}

// =============================================================================
// SECTION HEADING
// =============================================================================

interface SectionHeadingProps {
  /** Main heading text */
  title: string
  /** Subheading text (teal color) */
  subtitle?: string
  /** Whether to show separator line after subtitle */
  showSeparator?: boolean
  /** Center align the heading group */
  centered?: boolean
  /** Hide separator on mobile */
  hideSeparatorOnMobile?: boolean
  className?: string
}

/**
 * Section heading group with title, subtitle, and optional separator.
 * Provides consistent typography and spacing.
 */
export function SectionHeading({
  title,
  subtitle,
  showSeparator = true,
  centered = false,
  hideSeparatorOnMobile = true,
  className = '',
}: SectionHeadingProps) {
  // Left-aligned on mobile, optionally centered on desktop
  const alignClass = centered ? 'lg:items-center lg:text-center' : ''
  const separatorClass = hideSeparatorOnMobile ? 'hidden sm:block' : ''

  return (
    <div className={`flex flex-col ${alignClass} ${className}`}>
      <h2 className="text-2xl sm:text-3xl lg:text-3xl font-display font-bold text-dark leading-[1.2] mb-2">
        {title}
      </h2>
      {subtitle && (
        <div className="lg:w-fit mb-4">
          <p className="text-sm sm:text-base lg:text-lg font-display font-medium text-teal">
            {subtitle}
          </p>
          {showSeparator && (
            <div className={`separator-dashed mt-4 w-full ${separatorClass}`} />
          )}
        </div>
      )}
    </div>
  )
}

// =============================================================================
// COLUMN
// =============================================================================

interface ColumnProps {
  children: ReactNode
  /** Width on desktop (default: 1/2) */
  width?: '1/2' | '45%' | '55%' | 'full'
  className?: string
}

/**
 * Column component for use within TwoColumnLayout.
 */
export function Column({ children, width = '1/2', className = '' }: ColumnProps) {
  const widthClass = {
    '1/2': 'w-full lg:w-1/2',
    '45%': 'w-full lg:w-[45%]',
    '55%': 'w-full lg:w-[55%]',
    'full': 'w-full',
  }[width]

  return (
    <div className={`${widthClass} ${className}`}>
      {children}
    </div>
  )
}

// =============================================================================
// CONTENT SECTION (Two-column image + text pattern)
// =============================================================================

interface ImageSource {
  mobile: { webp: string; avif: string; fallback: string }
  tablet: { webp: string; avif: string; fallback: string }
  desktop?: { webp: string; avif: string; fallback: string }
}

interface ContentSectionProps {
  /** Section title */
  title: string
  /** Section subtitle (teal) */
  subtitle: string
  /** Content - text paragraphs or custom content */
  children: ReactNode
  /** Responsive image sources */
  image: ImageSource
  /** Image alt text */
  imageAlt: string
  /** Background color */
  background?: 'white' | 'cream'
  /** Show blob background */
  showBlob?: boolean
  /** Image position on desktop (left or right) */
  imagePosition?: 'left' | 'right'
  /** Data element attribute */
  dataElement?: string
  /** Optional image className for positioning */
  imageClassName?: string
  /** Header theme when this section is active: 'dark' = light bg (dark text), 'light' = dark bg (white text) */
  headerTheme?: 'dark' | 'light'
}

/**
 * High-level two-column content section with image.
 * Handles the common pattern of title, subtitle, content, and image
 * with proper mobile/desktop layout switching.
 */
export function ContentSection({
  title,
  subtitle,
  children,
  image,
  imageAlt,
  background = 'white',
  showBlob = false,
  imagePosition = 'right',
  dataElement,
  imageClassName,
  headerTheme,
}: ContentSectionProps) {
  const isImageLeft = imagePosition === 'left'

  return (
    <SectionWrapper
      background={background}
      showBlob={showBlob}
      dataElement={dataElement}
      headerTheme={headerTheme}
    >
      <SectionContainer className={showBlob ? 'relative z-[1]' : ''}>
        {/* Mobile: Header first */}
        <div className="lg:hidden">
          <SectionHeading title={title} subtitle={subtitle} />
        </div>

        <TwoColumnLayout reverse={!isImageLeft}>
          {/* Image Column */}
          <Column className={isImageLeft ? 'order-first' : 'order-first lg:order-none'}>
            <div className="-mx-4 sm:mx-0">
              <ResponsiveImage
                images={image}
                alt={imageAlt}
                className={imageClassName}
              />
            </div>
          </Column>

          {/* Content Column */}
          <Column className="flex flex-col">
            {/* Desktop: Header inside column */}
            <div className="hidden lg:block">
              <SectionHeading title={title} subtitle={subtitle} />
            </div>
            {children}
          </Column>
        </TwoColumnLayout>
      </SectionContainer>
    </SectionWrapper>
  )
}
