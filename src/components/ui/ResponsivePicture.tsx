import { forwardRef, useState } from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

// =============================================================================
// TYPES
// =============================================================================

export interface ImageSet {
  webp: string
  avif: string
  fallback: string
}

export interface ResponsiveImageSets {
  mobile: ImageSet
  tablet: ImageSet
  desktop?: ImageSet
  /** Optional tiny blurred placeholder for blur-up effect */
  placeholder?: string
}

interface ResponsivePictureProps {
  images: ResponsiveImageSets
  alt: string
  className?: string
  loading?: 'lazy' | 'eager'
  decoding?: 'async' | 'sync' | 'auto'
  onLoad?: () => void
  onError?: () => void
}

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * Base responsive picture component that handles multi-format image sources.
 * Renders AVIF → WebP → fallback with mobile/tablet/desktop breakpoints.
 * Supports optional blur-up placeholder for smooth loading experience.
 *
 * Use this as a building block for higher-level image components.
 */
export const ResponsivePicture = forwardRef<HTMLImageElement, ResponsivePictureProps>(
  function ResponsivePicture(
    {
      images,
      alt,
      className,
      loading = 'lazy',
      decoding = 'async',
      onLoad,
      onError,
    },
    ref
  ) {
    const [isLoaded, setIsLoaded] = useState(false)
    const hasPlaceholder = !!images.placeholder

    const handleLoad = () => {
      setIsLoaded(true)
      onLoad?.()
    }

    return (
      <div className="relative w-full h-full">
        {/* Blur placeholder - shows until image loads */}
        {hasPlaceholder && (
          <motion.img
            src={images.placeholder}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: 'blur(20px)', transform: 'scale(1.1)' }}
            initial={{ opacity: 1 }}
            animate={{ opacity: isLoaded ? 0 : 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        )}

        {/* Full resolution picture */}
        <motion.picture
          className="block w-full h-full"
          initial={hasPlaceholder ? { opacity: 0 } : { opacity: 1 }}
          animate={{ opacity: isLoaded || !hasPlaceholder ? 1 : 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          {/* AVIF - best compression */}
          <source
            media="(max-width: 639px)"
            srcSet={images.mobile.avif}
            type="image/avif"
          />
          <source
            media="(max-width: 1023px)"
            srcSet={images.tablet.avif}
            type="image/avif"
          />
          {images.desktop && (
            <source
              srcSet={images.desktop.avif}
              type="image/avif"
            />
          )}

          {/* WebP - wide browser support */}
          <source
            media="(max-width: 639px)"
            srcSet={images.mobile.webp}
            type="image/webp"
          />
          <source
            media="(max-width: 1023px)"
            srcSet={images.tablet.webp}
            type="image/webp"
          />
          {images.desktop && (
            <source
              srcSet={images.desktop.webp}
              type="image/webp"
            />
          )}

          {/* PNG/JPG fallback */}
          <img
            ref={ref}
            src={images.desktop?.fallback || images.tablet.fallback}
            alt={alt}
            loading={loading}
            decoding={decoding}
            onLoad={handleLoad}
            onError={onError}
            className={cn('w-full h-full object-cover', className)}
          />
        </motion.picture>
      </div>
    )
  }
)
