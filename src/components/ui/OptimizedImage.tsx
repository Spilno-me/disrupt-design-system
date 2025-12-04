import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { SkeletonImage } from './Skeleton'
import { SHADOWS } from '@/constants/designTokens'
import { ResponsivePicture, type ResponsiveImageSets } from './ResponsivePicture'

// =============================================================================
// TYPES
// =============================================================================

interface OptimizedImageProps {
  /** Responsive image sources */
  sources: ResponsiveImageSets
  /** Alt text for accessibility */
  alt: string
  /** Additional CSS classes */
  className?: string
  /** Priority loading (above-the-fold images) */
  priority?: boolean
  /** Aspect ratio for skeleton placeholder */
  aspectRatio?: 'square' | '4/3' | '16/9' | 'auto'
  /** Apply shadow styling */
  withShadow?: boolean
}

// =============================================================================
// HOOKS
// =============================================================================

function useIntersectionObserver(
  ref: React.RefObject<HTMLElement | null>,
  enabled: boolean
) {
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
      { rootMargin: '200px', threshold: 0.01 }
    )

    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [enabled, ref])

  return isInView
}

// =============================================================================
// SHARED COMPONENTS
// =============================================================================

function ImageErrorFallback({
  aspectRatio,
  className,
  withShadow,
}: {
  aspectRatio: OptimizedImageProps['aspectRatio']
  className?: string
  withShadow?: boolean
}) {
  return (
    <div
      className={cn(
        'w-full rounded-lg bg-muted/20 flex items-center justify-center',
        aspectRatio === 'square' && 'aspect-square',
        aspectRatio === '4/3' && 'aspect-[4/3]',
        aspectRatio === '16/9' && 'aspect-video',
        className
      )}
      style={withShadow ? { boxShadow: SHADOWS.image } : undefined}
    >
      <span className="text-muted text-sm">Image unavailable</span>
    </div>
  )
}

// =============================================================================
// OPTIMIZED IMAGE COMPONENT
// =============================================================================

/**
 * Optimized image component with:
 * - Lazy loading with Intersection Observer
 * - WebP/AVIF format support with fallbacks
 * - Responsive srcset for mobile/tablet/desktop
 * - Skeleton loading placeholder
 * - Smooth fade-in animation
 */
export function OptimizedImage({
  sources,
  alt,
  className = '',
  priority = false,
  aspectRatio = '4/3',
  withShadow = true,
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
      className={cn('relative overflow-hidden rounded-lg', className)}
      style={withShadow ? { boxShadow: SHADOWS.image } : undefined}
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
            'transition-opacity duration-500',
            isLoaded ? 'opacity-100' : 'opacity-0'
          )}
        />
      )}
    </div>
  )
}

// =============================================================================
// SIMPLE OPTIMIZED IMAGE (for images without multiple sizes)
// =============================================================================

interface SimpleOptimizedImageProps {
  /** Original image source */
  src: string
  /** Alt text */
  alt: string
  /** Additional CSS classes */
  className?: string
  /** Priority loading */
  priority?: boolean
  /** Aspect ratio */
  aspectRatio?: 'square' | '4/3' | '16/9' | 'auto'
  /** Apply shadow */
  withShadow?: boolean
}

/**
 * Simpler optimized image for images without pre-generated responsive versions.
 * Still includes lazy loading and skeleton placeholder.
 */
export function SimpleOptimizedImage({
  src,
  alt,
  className = '',
  priority = false,
  aspectRatio = '4/3',
  withShadow = true,
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
      className={cn('relative overflow-hidden rounded-lg', className)}
      style={withShadow ? { boxShadow: SHADOWS.image } : undefined}
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
            'w-full h-auto object-cover transition-opacity duration-500',
            isLoaded ? 'opacity-100' : 'opacity-0'
          )}
        />
      )}
    </div>
  )
}
