import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { cn } from '../../lib/utils'
import { ResponsivePicture, type ResponsiveImageSets } from './ResponsivePicture'

// =============================================================================
// TYPES
// =============================================================================

interface ParallaxImageProps {
  images: ResponsiveImageSets
  alt: string
  className?: string
  /** Parallax intensity - how much the image moves (default: 20) */
  intensity?: number
}

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * Image component with scroll-based parallax effect.
 * The image moves slower than the scroll, creating depth.
 *
 * Uses scale(1.15) to provide extra image area for the parallax movement.
 */
export function ParallaxImage({
  images,
  alt,
  className,
  intensity = 20,
}: ParallaxImageProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Track scroll progress relative to this element
  const { scrollYProgress } = useScroll({
    target: containerRef,
    // Start tracking when top of element hits bottom of viewport
    // End tracking when bottom of element hits top of viewport
    offset: ['start end', 'end start'],
  })

  // Transform scroll progress (0 to 1) into Y translation
  // At start (0): image is shifted down (+intensity)
  // At middle (0.5): image is centered (0)
  // At end (1): image is shifted up (-intensity)
  const y = useTransform(scrollYProgress, [0, 1], [intensity, -intensity])

  return (
    <div ref={containerRef} className="w-full h-full overflow-hidden">
      <motion.div
        className="w-full h-full"
        style={{ y }}
      >
        <ResponsivePicture
          images={images}
          alt={alt}
          className={cn('scale-125', className)}
        />
      </motion.div>
    </div>
  )
}
