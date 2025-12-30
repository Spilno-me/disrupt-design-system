import * as React from 'react'
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { cn } from '../../lib/utils'
import { ResponsivePicture, type ResponsiveImageSets } from './ResponsivePicture'

// =============================================================================
// CONSTANTS
// =============================================================================

/** Default parallax intensity in pixels - how much the image translates */
const DEFAULT_PARALLAX_INTENSITY = 20

/** Scale factor applied to image to provide extra area for parallax movement */
const PARALLAX_SCALE_FACTOR = 'scale-125'

// =============================================================================
// TYPES
// =============================================================================

export interface ParallaxImageProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Responsive image sets for different breakpoints */
  images: ResponsiveImageSets
  /** Alt text for accessibility */
  alt: string
  /** Parallax intensity in pixels - how much the image moves (default: 20) */
  intensity?: number
  /** Additional className for the inner image */
  imageClassName?: string
}

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * ParallaxImage - Image component with scroll-based parallax effect.
 *
 * @component ATOM
 *
 * @description
 * Creates a depth illusion by moving the image slower than the scroll.
 * Uses scale(1.25) internally to provide extra image area for movement
 * without revealing gaps at container edges.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <ParallaxImage
 *   images={heroImages}
 *   alt="Hero background"
 * />
 *
 * // Custom intensity
 * <ParallaxImage
 *   images={heroImages}
 *   alt="Hero background"
 *   intensity={30}
 * />
 *
 * // With custom styling
 * <ParallaxImage
 *   images={heroImages}
 *   alt="Feature image"
 *   className="rounded-lg"
 *   imageClassName="brightness-90"
 * />
 * ```
 *
 * @testid
 * - `data-slot="parallax-image"` - Root container
 * - `data-slot="parallax-motion"` - Motion wrapper for transform
 *
 * @accessibility
 * - Alt text passed to underlying ResponsivePicture
 * - Decorative container divs are not focusable
 */
function ParallaxImage({
  images,
  alt,
  className,
  imageClassName,
  intensity = DEFAULT_PARALLAX_INTENSITY,
  ...props
}: ParallaxImageProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Track scroll progress relative to this element
  const { scrollYProgress } = useScroll({
    target: containerRef,
    // Start when element top hits viewport bottom, end when element bottom hits viewport top
    offset: ['start end', 'end start'],
  })

  // Transform scroll progress (0→1) into Y translation
  // At start (0): image shifted down (+intensity)
  // At middle (0.5): image centered (0)
  // At end (1): image shifted up (-intensity)
  const y = useTransform(scrollYProgress, [0, 1], [intensity, -intensity])

  return (
    <div
      ref={containerRef}
      data-slot="parallax-image"
      className={cn('w-full h-full overflow-hidden', className)}
      {...props}
    >
      <motion.div
        data-slot="parallax-motion"
        className="w-full h-full"
        style={{ y }}
      >
        <ResponsivePicture
          images={images}
          alt={alt}
          className={cn(PARALLAX_SCALE_FACTOR, imageClassName)}
        />
      </motion.div>
    </div>
  )
}

// =============================================================================
// EXPORTS
// =============================================================================

ParallaxImage.displayName = 'ParallaxImage'

export { ParallaxImage }
