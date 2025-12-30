import { forwardRef, useState, useRef, useEffect, useCallback } from 'react'
import { motion } from 'motion/react'
import { cn } from '../../lib/utils'

// =============================================================================
// CONSTANTS
// =============================================================================

/** Blur intensity for placeholder in pixels */
const PLACEHOLDER_BLUR_PX = 20

/** Scale factor for placeholder to prevent edge artifacts */
const PLACEHOLDER_SCALE = 1.1

/** Fade transition duration in seconds */
const FADE_DURATION_S = 0.4

/** Mobile breakpoint max-width in pixels */
const BREAKPOINT_MOBILE_MAX = 639

/** Tablet breakpoint max-width in pixels */
const BREAKPOINT_TABLET_MAX = 1023

/** Media query for mobile devices */
const MEDIA_QUERY_MOBILE = `(max-width: ${BREAKPOINT_MOBILE_MAX}px)`

/** Media query for tablet devices */
const MEDIA_QUERY_TABLET = `(max-width: ${BREAKPOINT_TABLET_MAX}px)`

// =============================================================================
// TYPES
// =============================================================================

/** Image source set for a single breakpoint with format variants */
export interface ImageSource {
  /** AVIF format source (best compression) */
  avif: string
  /** WebP format source (wide support) */
  webp: string
  /** Fallback format source (PNG/JPG) */
  fallback: string
}

/** Responsive image sources for different viewport sizes */
export interface ResponsiveImages {
  /** Mobile viewport images (≤639px) */
  mobile: ImageSource
  /** Tablet viewport images (640-1023px) */
  tablet: ImageSource
  /** Desktop viewport images (≥1024px) */
  desktop: ImageSource
}

export interface BlurImageProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onLoad'> {
  /** Responsive image sources for all breakpoints */
  images: ResponsiveImages
  /** Tiny base64 or URL placeholder for blur-up effect */
  placeholder: string
  /** Alt text for accessibility */
  alt?: string
  /** Callback fired when main image loads */
  onLoad?: () => void
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Creates responsive source elements for a specific image format.
 * Returns mobile and tablet media-constrained sources plus desktop default.
 */
function renderSourceElements(
  images: ResponsiveImages,
  format: 'avif' | 'webp',
  mimeType: string
): React.ReactNode {
  return (
    <>
      <source
        media={MEDIA_QUERY_MOBILE}
        srcSet={images.mobile[format]}
        type={mimeType}
      />
      <source
        media={MEDIA_QUERY_TABLET}
        srcSet={images.tablet[format]}
        type={mimeType}
      />
      <source srcSet={images.desktop[format]} type={mimeType} />
    </>
  )
}

// =============================================================================
// COMPONENTS
// =============================================================================

/**
 * BlurImage - Progressive blur-up image loading component.
 *
 * Displays a tiny blurred placeholder while the full responsive image loads,
 * then smoothly fades in the high-resolution version. Supports AVIF, WebP,
 * and fallback formats with mobile/tablet/desktop breakpoints.
 *
 * @component ATOM
 *
 * @example
 * ```tsx
 * <BlurImage
 *   images={{
 *     mobile: { avif: '/img-sm.avif', webp: '/img-sm.webp', fallback: '/img-sm.jpg' },
 *     tablet: { avif: '/img-md.avif', webp: '/img-md.webp', fallback: '/img-md.jpg' },
 *     desktop: { avif: '/img-lg.avif', webp: '/img-lg.webp', fallback: '/img-lg.jpg' },
 *   }}
 *   placeholder="data:image/jpeg;base64,..."
 *   alt="Hero image"
 * />
 * ```
 */
export const BlurImage = forwardRef<HTMLDivElement, BlurImageProps>(
  function BlurImage(
    { images, placeholder, alt = '', className, onLoad, ...props },
    ref
  ) {
    const [isLoaded, setIsLoaded] = useState(false)
    const imgRef = useRef<HTMLImageElement>(null)

    const handleLoad = useCallback(() => {
      setIsLoaded(true)
      onLoad?.()
    }, [onLoad])

    const handleError = useCallback(() => {
      setIsLoaded(true)
    }, [])

    // Check if image is already loaded (cached)
    useEffect(() => {
      if (imgRef.current?.complete && imgRef.current?.naturalHeight > 0) {
        handleLoad()
      }
    }, [handleLoad])

    return (
      <div
        ref={ref}
        data-slot="blur-image"
        className={cn('relative h-full w-full overflow-hidden', className)}
        {...props}
      >
        {/* Blur placeholder - scales up from tiny size */}
        <motion.img
          data-slot="blur-image-placeholder"
          src={placeholder}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
          style={{
            filter: `blur(${PLACEHOLDER_BLUR_PX}px)`,
            transform: `scale(${PLACEHOLDER_SCALE})`,
          }}
          initial={{ opacity: 1 }}
          animate={{ opacity: isLoaded ? 0 : 1 }}
          transition={{ duration: FADE_DURATION_S, ease: 'easeOut' }}
        />

        {/* Full resolution responsive image */}
        <motion.picture
          data-slot="blur-image-picture"
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: FADE_DURATION_S, ease: 'easeOut' }}
          className="absolute inset-0 h-full w-full"
        >
          {/* AVIF sources - best compression */}
          {renderSourceElements(images, 'avif', 'image/avif')}

          {/* WebP sources - wide browser support */}
          {renderSourceElements(images, 'webp', 'image/webp')}

          {/* Fallback image */}
          <img
            ref={imgRef}
            data-slot="blur-image-fallback"
            src={images.desktop.fallback}
            alt={alt}
            className="h-full w-full object-cover"
            onLoad={handleLoad}
            onError={handleError}
          />
        </motion.picture>
      </div>
    )
  }
)

BlurImage.displayName = 'BlurImage'

// =============================================================================
// EXPORTS
// =============================================================================

export type { BlurImageProps as BlurImageComponentProps }
