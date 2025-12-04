import { useState } from 'react'
import { motion } from 'motion/react'

interface ImageSource {
  avif: string
  webp: string
  fallback: string
}

interface ResponsiveImages {
  mobile: ImageSource
  tablet: ImageSource
  desktop: ImageSource
}

interface BlurImageProps {
  images: ResponsiveImages
  placeholder: string
  alt?: string
  className?: string
  onLoad?: () => void
}

/**
 * BlurImage component that shows a tiny blurred placeholder
 * while the full image loads, then fades in smoothly.
 */
export function BlurImage({
  images,
  placeholder,
  alt = '',
  className = '',
  onLoad,
}: BlurImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  const handleLoad = () => {
    setIsLoaded(true)
    onLoad?.()
  }

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {/* Blur placeholder - always visible initially, scales up from tiny size */}
      <motion.img
        src={placeholder}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: 'blur(20px)', transform: 'scale(1.1)' }}
        initial={{ opacity: 1 }}
        animate={{ opacity: isLoaded ? 0 : 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      />

      {/* Full resolution image */}
      <motion.picture
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="absolute inset-0 w-full h-full"
      >
        {/* Mobile AVIF */}
        <source
          media="(max-width: 639px)"
          srcSet={images.mobile.avif}
          type="image/avif"
        />
        {/* Tablet AVIF */}
        <source
          media="(max-width: 1023px)"
          srcSet={images.tablet.avif}
          type="image/avif"
        />
        {/* Desktop AVIF */}
        <source
          srcSet={images.desktop.avif}
          type="image/avif"
        />
        {/* Mobile WebP */}
        <source
          media="(max-width: 639px)"
          srcSet={images.mobile.webp}
          type="image/webp"
        />
        {/* Tablet WebP */}
        <source
          media="(max-width: 1023px)"
          srcSet={images.tablet.webp}
          type="image/webp"
        />
        {/* Desktop WebP */}
        <source
          srcSet={images.desktop.webp}
          type="image/webp"
        />
        {/* Fallback */}
        <img
          src={images.desktop.fallback}
          alt={alt}
          className="w-full h-full object-cover"
          onLoad={handleLoad}
        />
      </motion.picture>
    </div>
  )
}
