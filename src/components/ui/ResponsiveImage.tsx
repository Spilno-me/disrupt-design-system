import { cn } from '@/lib/utils'
import { ParallaxImage } from './ParallaxImage'
import { type ResponsiveImageSets } from './ResponsivePicture'

// =============================================================================
// TYPES
// =============================================================================

interface ResponsiveImageProps {
  images: ResponsiveImageSets
  alt: string
  className?: string
  /** Container className for wrapper div */
  containerClassName?: string
}

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * Responsive image component with consistent styling across all sections.
 * - Full width on mobile with fixed 240px height
 * - Fixed 320px height on tablet, 400px on desktop for consistency
 * - object-cover fills container, rounded corners and shadow on tablet+
 * - Parallax effect on scroll for depth
 */
export function ResponsiveImage({
  images,
  alt,
  className,
  containerClassName,
}: ResponsiveImageProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden w-full',
        'rounded-none sm:rounded-lg',
        'shadow-none sm:shadow-[0_4px_20px_rgba(0,0,0,0.08)]',
        'h-[240px] sm:h-[320px] lg:h-[400px]',
        containerClassName
      )}
    >
      <ParallaxImage
        images={images}
        alt={alt}
        className={className}
        intensity={50}
      />
    </div>
  )
}
