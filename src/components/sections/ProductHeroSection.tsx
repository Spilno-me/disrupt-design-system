import { useState, useRef } from 'react'
import { GridBlobBackground } from '@/components/ui/GridBlobCanvas'
import { HeroParticles } from '@/components/ui/HeroParticles'
import { MouseParticleRenderer } from '@/components/ui/MouseParticleRenderer'
import { BlurImage } from '@/components/ui/BlurImage'
import { useMouseParticles } from '@/hooks/useMouseParticles'
import { productImages } from '@/assets/optimized/product'

// =============================================================================
// CONSTANTS
// =============================================================================

const HERO_TITLE = 'The Agentic Compliance Platform'
const HERO_SUBTITLE = 'Proactive Safety. Predictable Cost. Unlimited AI.'

// =============================================================================
// COMPONENT
// =============================================================================

export function ProductHeroSection() {
  const [imageLoaded, setImageLoaded] = useState(false)
  const heroFrameRef = useRef<HTMLDivElement>(null)

  const { particles, handleMouseMove } = useMouseParticles({
    enabled: imageLoaded,
    containerRef: heroFrameRef,
  })

  return (
    <section
      className="relative mb-8 lg:mb-[56px] mt-[82px]"
      data-element="product-hero-section"
      onMouseMove={handleMouseMove}
    >
      <GridBlobBackground scale={1.8} />

      {/* Background Frame */}
      <div
        className="absolute inset-x-0 top-0 flex justify-center z-[1] px-0 sm:px-6"
        data-element="product-hero-bg-wrapper"
      >
        <div
          ref={heroFrameRef}
          className="w-full h-[380px] sm:h-[420px] lg:h-[499px] rounded-none sm:rounded-b-[10px] overflow-hidden relative max-w-[1440px]"
          data-element="product-hero-bg-frame"
          data-dark-background="true"
        >
          {/* Hero Image with blur-up loading */}
          <BlurImage
            images={productImages.productHero}
            placeholder={productImages.productHero.placeholder}
            className="object-[center_30%] sm:object-center"
            onLoad={() => setImageLoaded(true)}
          />

          {/* Bottom gradient - darker at bottom, transparent from middle */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(0deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 30%, rgba(0,0,0,0.2) 50%, transparent 70%)'
            }}
          />

          {/* Particles */}
          {imageLoaded && (
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
        data-element="product-hero-wrapper"
      >
        <div
          className="w-full flex flex-col items-start justify-end relative h-full px-4 sm:px-6 lg:px-[36px] pb-8 sm:pb-10 lg:pb-12"
          data-element="product-hero-container"
        >
          {/* Title */}
          <h1
            className="font-display font-bold text-page text-[32px] sm:text-[32px] lg:text-[48px] leading-[44px] sm:leading-[48px] lg:leading-[60px] tracking-[2.5px] sm:tracking-[3px] lg:tracking-[4px] mb-4"
            data-element="product-hero-title"
          >
            {HERO_TITLE}
          </h1>

          {/* Subtitle */}
          <p
            className="font-display font-medium text-accent text-sm sm:text-base lg:text-lg"
            data-element="product-hero-subtitle"
          >
            {HERO_SUBTITLE}
          </p>
        </div>
      </div>
    </section>
  )
}
