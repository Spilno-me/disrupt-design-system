import { useState, useRef, useEffect } from 'react'
import { cn } from '../../lib/utils'
import { SkeletonImage } from './Skeleton'
import { SHADOWS } from '../../constants/designTokens'
import { ResponsivePicture, type ResponsiveImageSets } from './ResponsivePicture'

// =============================================================================
// CONSTANTS
// =============================================================================

/** Intersection observer root margin for lazy loading pre-fetch */
const INTERSECTION_ROOT_MARGIN = '200px'

/** Intersection observer threshold for visibility detection */
const INTERSECTION_THRESHOLD = 0.01

/** Tailwind class for fade-in transition duration */
const FADE_TRANSITION_CLASS = 'duration-500'

/** Fallback message shown when image fails to load */
const IMAGE_UNAVAILABLE_MESSAGE = 'Image unavailable'

// =============================================================================
// TYPES
// =============================================================================

/** Supported aspect ratios for image containers */
type AspectRatio = 'square' | '4/3' | '16/9' | 'auto'

interface OptimizedImageProps extends React.ComponentProps<'div'> {
  /** Responsive image sources */
  sources: ResponsiveImageSets
  /** Alt text for accessibility */
  alt: string
  /** Priority loading (above-the-fold images) */
  priority?: boolean
  /** Aspect ratio for skeleton placeholder */
  aspectRatio?: AspectRatio
  /** Apply shadow styling */
  withShadow?: boolean
}

interface SimpleOptimizedImageProps extends React.ComponentProps<'div'> {
  /** Original image source */
  src: string
  /** Alt text */
  alt: string
  /** Priority loading */
  priority?: boolean
  /** Aspect ratio */
  aspectRatio?: AspectRatio
  /** Apply shadow */
  withShadow?: boolean
}

interface ImageErrorFallbackProps extends React.ComponentProps<'div'> {
  /** Aspect ratio for fallback container */
  aspectRatio: AspectRatio
  /** Apply shadow styling */
  withShadow?: boolean
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Returns Tailwind class for aspect ratio
 */
function getAspectRatioClass(aspectRatio: AspectRatio): string {
  switch (aspectRatio) {
    case 'square':
      return 'aspect-square'
    case '4/3':
      return 'aspect-[4/3]'
    case '16/9':
      return 'aspect-video'
    default:
      return ''
  }
}

// =============================================================================
// HOOKS
// =============================================================================

/**
 * Custom hook for lazy loading with Intersection Observer
 *
 * @param ref - Reference to the element to observe
 * @param enabled - Whether lazy loading is enabled (false = immediate visibility)
 * @returns Boolean indicating if element is in view
 */
function useIntersectionObserver(
  ref: React.RefObject<HTMLElement | null>,
  enabled: boolean
): boolean {
  const [isInView, setIsInView] = useState(!enabled)

  useEffect(() => {
    if (!enabled || !ref.current) return

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
        rootMargin: INTERSECTION_ROOT_MARGIN,
        threshold: INTERSECTION_THRESHOLD,
      }
    )

    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [enabled, ref])

  return isInView
}

// =============================================================================
// COMPONENTS
// =============================================================================

/**
 * ImageErrorFallback - Fallback UI when image fails to load
 *
 * @component ATOM
 *
 * @description
 * Displays a placeholder with error message when image cannot be loaded.
 * Maintains aspect ratio consistency with the expected image.
 */
function ImageErrorFallback({
  aspectRatio,
  className,
  withShadow,
  ...props
}: ImageErrorFallbackProps) {
  return (
    <div
      data-slot="image-error-fallback"
      className={cn(
        'w-full rounded-lg bg-surface-muted flex items-center justify-center',
        getAspectRatioClass(aspectRatio),
        className
      )}
      style={withShadow ? { boxShadow: SHADOWS.image } : undefined}
      {...props}
    >
      <span className="text-tertiary text-sm">{IMAGE_UNAVAILABLE_MESSAGE}</span>
    </div>
  )
}

ImageErrorFallback.displayName = 'ImageErrorFallback'

/**
 * OptimizedImage - Performance-optimized responsive image component
 *
 * @component MOLECULE
 *
 * @description
 * Optimized image component with:
 * - Lazy loading with Intersection Observer
 * - WebP/AVIF format support with fallbacks
 * - Responsive srcset for mobile/tablet/desktop
 * - Skeleton loading placeholder
 * - Smooth fade-in animation
 *
 * @example
 * ```tsx
 * <OptimizedImage
 *   sources={heroImageSources}
 *   alt="Hero banner"
 *   priority={true}
 *   aspectRatio="16/9"
 * />
 * ```
 *
 * @testid
 * - `data-slot="optimized-image"` - Root container
 *
 * @accessibility
 * - Alt text required for screen readers
 * - Lazy loading respects prefers-reduced-motion (browser native)
 */
function OptimizedImage({
  sources,
  alt,
  className,
  priority = false,
  aspectRatio = '4/3',
  withShadow = true,
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const isInView = useIntersectionObserver(containerRef, !priority)

  if (hasError) {
    return (
      <ImageErrorFallback
        aspectRatio={aspectRatio}
        className={className}
        withShadow={withShadow}
      />
    )
  }

  return (
    <div
      ref={containerRef}
      data-slot="optimized-image"
      className={cn('relative overflow-hidden rounded-lg', className)}
      style={withShadow ? { boxShadow: SHADOWS.image } : undefined}
      {...props}
    >
      {!isLoaded && (
        <SkeletonImage
          aspectRatio={aspectRatio}
          className="absolute inset-0 z-10"
        />
      )}

      {isInView && (
        <ResponsivePicture
          images={sources}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={cn(
            'transition-opacity',
            FADE_TRANSITION_CLASS,
            isLoaded ? 'opacity-100' : 'opacity-0'
          )}
        />
      )}
    </div>
  )
}

OptimizedImage.displayName = 'OptimizedImage'

/**
 * SimpleOptimizedImage - Optimized image for single-source images
 *
 * @component MOLECULE
 *
 * @description
 * Simpler optimized image for images without pre-generated responsive versions.
 * Still includes lazy loading and skeleton placeholder.
 *
 * @example
 * ```tsx
 * <SimpleOptimizedImage
 *   src="/images/logo.png"
 *   alt="Company logo"
 *   aspectRatio="square"
 * />
 * ```
 *
 * @testid
 * - `data-slot="simple-optimized-image"` - Root container
 *
 * @accessibility
 * - Alt text required for screen readers
 */
function SimpleOptimizedImage({
  src,
  alt,
  className,
  priority = false,
  aspectRatio = '4/3',
  withShadow = true,
  ...props
}: SimpleOptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const isInView = useIntersectionObserver(containerRef, !priority)

  if (hasError) {
    return (
      <ImageErrorFallback
        aspectRatio={aspectRatio}
        className={className}
        withShadow={withShadow}
      />
    )
  }

  return (
    <div
      ref={containerRef}
      data-slot="simple-optimized-image"
      className={cn('relative overflow-hidden rounded-lg', className)}
      style={withShadow ? { boxShadow: SHADOWS.image } : undefined}
      {...props}
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
            'w-full h-auto object-cover transition-opacity',
            FADE_TRANSITION_CLASS,
            isLoaded ? 'opacity-100' : 'opacity-0'
          )}
        />
      )}
    </div>
  )
}

SimpleOptimizedImage.displayName = 'SimpleOptimizedImage'

// =============================================================================
// EXPORTS
// =============================================================================

export { OptimizedImage, SimpleOptimizedImage, ImageErrorFallback }
export type { OptimizedImageProps, SimpleOptimizedImageProps, AspectRatio }
