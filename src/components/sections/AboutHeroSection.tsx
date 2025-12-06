import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { GridBlobBackground } from '@/components/ui/GridBlobCanvas'
import { HeroParticles } from '@/components/ui/HeroParticles'
import { MouseParticleRenderer } from '@/components/ui/MouseParticleRenderer'
import { BlurImage } from '@/components/ui/BlurImage'
import { useMouseParticles } from '@/hooks/useMouseParticles'
import { AnimatedCheck } from '@/components/ui/AnimatedCheck'
import { aboutImages } from '@/assets/optimized/about'

// =============================================================================
// CONSTANTS
// =============================================================================

const HERO_TITLES = ['Built to protect people', 'Designed to redefine compliance']
const SLIDE_INTERVAL = 4000

const BULLET_POINTS = [
  'Safer workplaces through smarter compliance',
  'AI that eliminates admin, not just digitizes it',
  'More time for people, less time on paperwork',
]

const SUBTITLE = "Compliance has buried teams in admin for too long. We're here to change that."

// =============================================================================
// COMPONENT
// =============================================================================

export function AboutHeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [imageLoaded, setImageLoaded] = useState(false)
  const heroFrameRef = useRef<HTMLDivElement>(null)

  const { particles, handleMouseMove } = useMouseParticles({
    enabled: imageLoaded,
    containerRef: heroFrameRef,
  })

  // Title slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % HERO_TITLES.length)
    }, SLIDE_INTERVAL)
    return () => clearInterval(interval)
  }, [])

  return (
    <section
      className="relative mb-8 lg:mb-[56px] mt-[82px]"
      data-element="about-hero-section"
      onMouseMove={handleMouseMove}
    >
      {/* Grid Blob Background */}
      <GridBlobBackground scale={1.8} />

      {/* Background Frame */}
      <div
        className="absolute inset-x-0 top-0 flex justify-center z-[1] px-0 sm:px-6"
        data-element="about-hero-bg-wrapper"
      >
        <div
          ref={heroFrameRef}
          className="w-full h-[380px] sm:h-[420px] lg:h-[499px] rounded-none sm:rounded-b-[10px] overflow-hidden relative max-w-[1440px] bg-black"
          data-element="about-hero-frame"
          data-dark-background="true"
        >
          {/* Background Image with blur-up loading */}
          <BlurImage
            images={aboutImages.aboutHero}
            placeholder={aboutImages.aboutHero.placeholder}
            onLoad={() => setImageLoaded(true)}
          />

          {/* Bottom gradient - darker at bottom for text readability */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(0deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 35%, rgba(0,0,0,0.2) 55%, transparent 75%)'
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
        data-element="about-hero-wrapper"
      >
        <div
          className="w-full flex flex-col items-start justify-center relative h-full px-4 sm:px-6 lg:px-[36px]"
          data-element="about-hero-container"
        >
          {/* Two Column Layout */}
          <div className="w-full flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 lg:gap-8">
            {/* Left Column - Animated Title */}
            <div className="lg:flex-1">
              <div
                className="relative h-[80px] sm:h-[100px] lg:h-[140px]"
                data-element="about-hero-title"
              >
                <AnimatePresence mode="wait">
                  <motion.h1
                    key={currentIndex}
                    initial={{ opacity: 0, y: -40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 40 }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                    className="absolute inset-0 flex items-start font-display font-bold text-white text-[32px] sm:text-[40px] lg:text-[56px] leading-[1.15] tracking-[2px] sm:tracking-[3px] lg:tracking-[4px]"
                  >
                    {HERO_TITLES[currentIndex]}
                  </motion.h1>
                </AnimatePresence>
              </div>
            </div>

            {/* Right Column - Subtitle & Bullet Points */}
            <div className="lg:max-w-[420px]">
              {/* Subtitle */}
              <p className="font-display font-medium text-teal text-sm sm:text-base lg:text-lg mb-5">
                {SUBTITLE}
              </p>

              <ul className="flex flex-col gap-2.5 font-sans text-[14px] sm:text-[15px] lg:text-base leading-[1.5] text-white">
                {BULLET_POINTS.map((point, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <AnimatedCheck className="w-5 h-5 flex-shrink-0" autoAnimate index={index} />
                    <span className="opacity-90">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
