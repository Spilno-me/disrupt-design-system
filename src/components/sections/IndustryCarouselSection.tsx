import { useState, useRef, useCallback, forwardRef, useEffect } from 'react'
import { motion } from 'motion/react'
import { useIsMobile } from '../../hooks/useIsMobile'
import { Building2, Factory, Zap, Pill, Truck } from 'lucide-react'
import { SectionContainer } from '../ui/SectionLayout'

// Industry images - responsive versions
// Construction
import constructionDesktopAvif from '../../assets/optimized/product/industry-construction-desktop.avif'
import constructionDesktopWebp from '../../assets/optimized/product/industry-construction-desktop.webp'
import constructionDesktopPng from '../../assets/optimized/product/industry-construction-desktop.png'
import constructionTabletAvif from '../../assets/optimized/product/industry-construction-tablet.avif'
import constructionTabletWebp from '../../assets/optimized/product/industry-construction-tablet.webp'
import constructionTabletPng from '../../assets/optimized/product/industry-construction-tablet.png'
import constructionMobileAvif from '../../assets/optimized/product/industry-construction-mobile.avif'
import constructionMobileWebp from '../../assets/optimized/product/industry-construction-mobile.webp'
import constructionMobilePng from '../../assets/optimized/product/industry-construction-mobile.png'

// Manufacturing
import manufacturingDesktopAvif from '../../assets/optimized/product/industry-manufacturing-desktop.avif'
import manufacturingDesktopWebp from '../../assets/optimized/product/industry-manufacturing-desktop.webp'
import manufacturingDesktopPng from '../../assets/optimized/product/industry-manufacturing-desktop.png'
import manufacturingTabletAvif from '../../assets/optimized/product/industry-manufacturing-tablet.avif'
import manufacturingTabletWebp from '../../assets/optimized/product/industry-manufacturing-tablet.webp'
import manufacturingTabletPng from '../../assets/optimized/product/industry-manufacturing-tablet.png'
import manufacturingMobileAvif from '../../assets/optimized/product/industry-manufacturing-mobile.avif'
import manufacturingMobileWebp from '../../assets/optimized/product/industry-manufacturing-mobile.webp'
import manufacturingMobilePng from '../../assets/optimized/product/industry-manufacturing-mobile.png'

// Energy
import energyDesktopAvif from '../../assets/optimized/product/industry-energy-desktop.avif'
import energyDesktopWebp from '../../assets/optimized/product/industry-energy-desktop.webp'
import energyDesktopPng from '../../assets/optimized/product/industry-energy-desktop.png'
import energyTabletAvif from '../../assets/optimized/product/industry-energy-tablet.avif'
import energyTabletWebp from '../../assets/optimized/product/industry-energy-tablet.webp'
import energyTabletPng from '../../assets/optimized/product/industry-energy-tablet.png'
import energyMobileAvif from '../../assets/optimized/product/industry-energy-mobile.avif'
import energyMobileWebp from '../../assets/optimized/product/industry-energy-mobile.webp'
import energyMobilePng from '../../assets/optimized/product/industry-energy-mobile.png'

// Pharma
import pharmaDesktopAvif from '../../assets/optimized/product/industry-pharma-desktop.avif'
import pharmaDesktopWebp from '../../assets/optimized/product/industry-pharma-desktop.webp'
import pharmaDesktopPng from '../../assets/optimized/product/industry-pharma-desktop.png'
import pharmaTabletAvif from '../../assets/optimized/product/industry-pharma-tablet.avif'
import pharmaTabletWebp from '../../assets/optimized/product/industry-pharma-tablet.webp'
import pharmaTabletPng from '../../assets/optimized/product/industry-pharma-tablet.png'
import pharmaMobileAvif from '../../assets/optimized/product/industry-pharma-mobile.avif'
import pharmaMobileWebp from '../../assets/optimized/product/industry-pharma-mobile.webp'
import pharmaMobilePng from '../../assets/optimized/product/industry-pharma-mobile.png'

// Logistics
import logisticsDesktopAvif from '../../assets/optimized/product/industry-logistics-desktop.avif'
import logisticsDesktopWebp from '../../assets/optimized/product/industry-logistics-desktop.webp'
import logisticsDesktopPng from '../../assets/optimized/product/industry-logistics-desktop.png'
import logisticsTabletAvif from '../../assets/optimized/product/industry-logistics-tablet.avif'
import logisticsTabletWebp from '../../assets/optimized/product/industry-logistics-tablet.webp'
import logisticsTabletPng from '../../assets/optimized/product/industry-logistics-tablet.png'
import logisticsMobileAvif from '../../assets/optimized/product/industry-logistics-mobile.avif'
import logisticsMobileWebp from '../../assets/optimized/product/industry-logistics-mobile.webp'
import logisticsMobilePng from '../../assets/optimized/product/industry-logistics-mobile.png'

// Placeholders
import constructionPlaceholder from '../../assets/optimized/placeholders/industry-construction-desktop-placeholder.webp'
import manufacturingPlaceholder from '../../assets/optimized/placeholders/industry-manufacturing-desktop-placeholder.webp'
import energyPlaceholder from '../../assets/optimized/placeholders/industry-energy-desktop-placeholder.webp'
import pharmaPlaceholder from '../../assets/optimized/placeholders/industry-pharma-desktop-placeholder.webp'
import logisticsPlaceholder from '../../assets/optimized/placeholders/industry-logistics-desktop-placeholder.webp'

// =============================================================================
// TYPES
// =============================================================================

interface ResponsiveImages {
  desktop: { avif: string; webp: string; png: string }
  tablet: { avif: string; webp: string; png: string }
  mobile: { avif: string; webp: string; png: string }
  placeholder?: string
}

interface Industry {
  id: string
  name: string
  icon: React.ElementType
  description: string
  images: ResponsiveImages
}

export interface IndustryCarouselSectionProps {
  /** Section title */
  title?: string
  /** Section subtitle */
  subtitle?: string
  /** Custom industries data (optional - uses defaults if not provided) */
  industries?: Industry[]
  /** Initially expanded industry ID */
  defaultExpandedId?: string | null
  /** Custom className for the section */
  className?: string
}

// =============================================================================
// DATA
// =============================================================================

const DEFAULT_INDUSTRIES: Industry[] = [
  {
    id: 'construction',
    name: 'Construction',
    icon: Building2,
    description: 'Streamline site safety compliance with real-time incident tracking and automated reporting.',
    images: {
      desktop: { avif: constructionDesktopAvif, webp: constructionDesktopWebp, png: constructionDesktopPng },
      tablet: { avif: constructionTabletAvif, webp: constructionTabletWebp, png: constructionTabletPng },
      mobile: { avif: constructionMobileAvif, webp: constructionMobileWebp, png: constructionMobilePng },
      placeholder: constructionPlaceholder,
    },
  },
  {
    id: 'manufacturing',
    name: 'Manufacturing',
    icon: Factory,
    description: 'Optimize plant safety protocols with predictive risk analysis and workflow automation.',
    images: {
      desktop: { avif: manufacturingDesktopAvif, webp: manufacturingDesktopWebp, png: manufacturingDesktopPng },
      tablet: { avif: manufacturingTabletAvif, webp: manufacturingTabletWebp, png: manufacturingTabletPng },
      mobile: { avif: manufacturingMobileAvif, webp: manufacturingMobileWebp, png: manufacturingMobilePng },
      placeholder: manufacturingPlaceholder,
    },
  },
  {
    id: 'energy',
    name: 'Energy',
    icon: Zap,
    description: 'Ensure regulatory compliance across distributed assets with centralized monitoring.',
    images: {
      desktop: { avif: energyDesktopAvif, webp: energyDesktopWebp, png: energyDesktopPng },
      tablet: { avif: energyTabletAvif, webp: energyTabletWebp, png: energyTabletPng },
      mobile: { avif: energyMobileAvif, webp: energyMobileWebp, png: energyMobilePng },
      placeholder: energyPlaceholder,
    },
  },
  {
    id: 'pharma',
    name: 'Pharma',
    icon: Pill,
    description: 'Maintain GxP compliance with automated documentation and audit trail management.',
    images: {
      desktop: { avif: pharmaDesktopAvif, webp: pharmaDesktopWebp, png: pharmaDesktopPng },
      tablet: { avif: pharmaTabletAvif, webp: pharmaTabletWebp, png: pharmaTabletPng },
      mobile: { avif: pharmaMobileAvif, webp: pharmaMobileWebp, png: pharmaMobilePng },
      placeholder: pharmaPlaceholder,
    },
  },
  {
    id: 'logistics',
    name: 'Logistics',
    icon: Truck,
    description: 'Maintain rigorous standards with automated regulatory checks.',
    images: {
      desktop: { avif: logisticsDesktopAvif, webp: logisticsDesktopWebp, png: logisticsDesktopPng },
      tablet: { avif: logisticsTabletAvif, webp: logisticsTabletWebp, png: logisticsTabletPng },
      mobile: { avif: logisticsMobileAvif, webp: logisticsMobileWebp, png: logisticsMobilePng },
      placeholder: logisticsPlaceholder,
    },
  },
]

// =============================================================================
// INDUSTRY CARD COMPONENT
// =============================================================================

interface IndustryCardProps {
  industry: Industry
  isExpanded: boolean
  onClick: () => void
  isMobile: boolean
  parallaxOffset: number
}

const IndustryCard = forwardRef<HTMLDivElement, IndustryCardProps>(
  ({ industry, isExpanded, onClick, isMobile, parallaxOffset }, ref) => {
  const Icon = industry.icon
  const [isLoaded, setIsLoaded] = useState(false)

  const parallaxX = (parallaxOffset - 0.5) * 24

  const expandedWidth = isMobile ? 300 : 400
  const collapsedWidth = isMobile ? 140 : 200

  return (
    <motion.div
      ref={ref}
      className="relative h-[400px] sm:h-[500px] lg:h-[600px] rounded-xl overflow-hidden cursor-pointer border border-slate-200 flex-shrink-0"
      style={{ scrollSnapAlign: 'center' }}
      data-dark-background="true"
      initial={false}
      animate={{
        width: isExpanded ? expandedWidth : collapsedWidth,
        flex: isExpanded ? `0 0 ${expandedWidth}px` : `0 0 ${collapsedWidth}px`,
      }}
      transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
      onClick={onClick}
      whileHover={{ scale: isExpanded ? 1 : 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Background Image with Parallax */}
      <motion.div
        className="absolute inset-0"
        initial={false}
        animate={{
          scale: isExpanded ? 1 : 1.3,
          x: isExpanded ? '0%' : `${parallaxX}%`,
        }}
        transition={{
          scale: { duration: 0.5, ease: [0.32, 0.72, 0, 1] },
          x: { duration: 0.15, ease: 'easeOut' },
        }}
      >
        <div className="w-full h-full relative">
          {/* Blur placeholder */}
          {industry.images.placeholder && (
            <motion.img
              src={industry.images.placeholder}
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
            initial={{ opacity: industry.images.placeholder ? 0 : 1 }}
            animate={{ opacity: isLoaded || !industry.images.placeholder ? 1 : 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <source media="(max-width: 640px)" srcSet={industry.images.mobile.avif} type="image/avif" />
            <source media="(max-width: 640px)" srcSet={industry.images.mobile.webp} type="image/webp" />
            <source media="(max-width: 640px)" srcSet={industry.images.mobile.png} type="image/png" />
            <source media="(max-width: 1024px)" srcSet={industry.images.tablet.avif} type="image/avif" />
            <source media="(max-width: 1024px)" srcSet={industry.images.tablet.webp} type="image/webp" />
            <source media="(max-width: 1024px)" srcSet={industry.images.tablet.png} type="image/png" />
            <source srcSet={industry.images.desktop.avif} type="image/avif" />
            <source srcSet={industry.images.desktop.webp} type="image/webp" />
            <img
              src={industry.images.desktop.png}
              alt={industry.name}
              className="w-full h-full object-cover"
              onLoad={() => setIsLoaded(true)}
            />
          </motion.picture>
        </div>
      </motion.div>

      {/* Overlay gradient */}
      <motion.div
        className="absolute inset-x-0 bottom-0"
        initial={false}
        animate={{
          height: isExpanded ? '50%' : '100%',
          background: isExpanded
            ? 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 40%, transparent 100%)'
            : 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 30%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.2) 80%, transparent 100%)',
        }}
        transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
      />

      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 p-3 sm:p-5">
        <motion.div
          initial={false}
          animate={{ y: isExpanded ? -100 : 0 }}
          transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1], delay: isExpanded ? 0.5 : 0 }}
        >
          <div className="flex items-center gap-2 sm:gap-3 text-white">
            <motion.div
              className="flex items-center justify-center flex-shrink-0"
              initial={false}
              animate={{
                backgroundColor: isExpanded ? 'rgba(255,255,255,0.15)' : 'transparent',
                padding: isExpanded ? '8px' : '0px',
                borderRadius: isExpanded ? '8px' : '0px',
              }}
              transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            >
              <Icon className="w-5 h-5" />
            </motion.div>
            <span className="font-medium text-sm truncate">{industry.name}</span>
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-3 left-3 right-3 sm:bottom-5 sm:left-5 sm:right-5"
          initial={false}
          animate={{ opacity: isExpanded ? 1 : 0 }}
          transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1], delay: isExpanded ? 0.6 : 0 }}
        >
          <p className="text-white/90 text-sm leading-relaxed mb-2">{industry.description}</p>
          <span className="text-white/70 text-sm font-medium">Coming soon</span>
        </motion.div>
      </div>
    </motion.div>
  )
})

IndustryCard.displayName = 'IndustryCard'

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function IndustryCarouselSection({
  title = 'Empowering Disruptors in',
  subtitle = 'Industry-specific compliance solutions built for the way you work',
  industries = DEFAULT_INDUSTRIES,
  defaultExpandedId,
  className,
}: IndustryCarouselSectionProps) {
  const isMobileInitial = typeof window !== 'undefined' && window.innerWidth < 768
  const [expandedId, setExpandedId] = useState<string | null>(
    defaultExpandedId !== undefined ? defaultExpandedId : (isMobileInitial ? null : 'logistics')
  )
  const [isAutoScrolling, setIsAutoScrolling] = useState(true)
  const [scrollProgress, setScrollProgress] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const autoScrollRef = useRef<number | null>(null)
  const isMobile = useIsMobile()

  const setCardRef = useCallback((id: string, el: HTMLDivElement | null) => {
    if (el) {
      cardRefs.current.set(id, el)
    } else {
      cardRefs.current.delete(id)
    }
  }, [])

  const isAutoScrollingRef = useRef(isAutoScrolling)
  const scrollDirectionRef = useRef(1)
  const isInViewportRef = useRef(false)

  useEffect(() => {
    isAutoScrollingRef.current = isAutoScrolling
  }, [isAutoScrolling])

  useEffect(() => {
    const carousel = carouselRef.current
    if (!carousel || !isMobile) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        isInViewportRef.current = entry.isIntersecting
      },
      { threshold: 0.1 }
    )

    observer.observe(carousel)
    return () => observer.disconnect()
  }, [isMobile])

  useEffect(() => {
    if (!isMobile) {
      if (autoScrollRef.current) {
        cancelAnimationFrame(autoScrollRef.current)
        autoScrollRef.current = null
      }
      return
    }

    const scrollSpeed = 0.5
    let lastTime = 0
    const targetInterval = 16

    const animate = (currentTime: number) => {
      const currentCarousel = carouselRef.current
      if (!currentCarousel) {
        autoScrollRef.current = requestAnimationFrame(animate)
        return
      }

      if (currentTime - lastTime < targetInterval) {
        autoScrollRef.current = requestAnimationFrame(animate)
        return
      }
      lastTime = currentTime

      const maxScroll = currentCarousel.scrollWidth - currentCarousel.clientWidth

      if (maxScroll > 0) {
        const progress = currentCarousel.scrollLeft / maxScroll
        setScrollProgress(progress)
      }

      if (isAutoScrollingRef.current && isInViewportRef.current) {
        if (maxScroll > 0) {
          const currentScroll = currentCarousel.scrollLeft

          if (currentScroll >= maxScroll - 5) {
            scrollDirectionRef.current = -1
          } else if (currentScroll <= 5) {
            scrollDirectionRef.current = 1
          }

          const newScrollLeft = currentScroll + (scrollSpeed * scrollDirectionRef.current)
          currentCarousel.scrollLeft = newScrollLeft
        }
      }

      autoScrollRef.current = requestAnimationFrame(animate)
    }

    const startTimeout = setTimeout(() => {
      autoScrollRef.current = requestAnimationFrame(animate)
    }, 800)

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isAutoScrollingRef.current) {
        if (autoScrollRef.current) {
          cancelAnimationFrame(autoScrollRef.current)
        }
        lastTime = 0
        autoScrollRef.current = requestAnimationFrame(animate)
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      clearTimeout(startTimeout)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      if (autoScrollRef.current) {
        cancelAnimationFrame(autoScrollRef.current)
        autoScrollRef.current = null
      }
    }
  }, [isMobile])

  const handleScroll = useCallback(() => {
    const carousel = carouselRef.current
    if (!carousel) return

    const maxScroll = carousel.scrollWidth - carousel.clientWidth
    if (maxScroll > 0) {
      const progress = carousel.scrollLeft / maxScroll
      setScrollProgress(progress)
    }
  }, [])

  const resumeTimeoutRef = useRef<number | null>(null)

  const handleUserInteraction = useCallback(() => {
    setIsAutoScrolling(false)

    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current)
    }

    resumeTimeoutRef.current = window.setTimeout(() => {
      if (!expandedId) {
        setIsAutoScrolling(true)
      }
    }, 3000)
  }, [expandedId])

  const handleCardClick = (id: string) => {
    const isExpanding = expandedId !== id
    const isCollapsing = expandedId === id

    setExpandedId(isCollapsing ? null : id)

    if (isExpanding) {
      setIsAutoScrolling(false)

      if (isMobile && carouselRef.current) {
        const card = cardRefs.current.get(id)
        if (card) {
          setTimeout(() => {
            const carousel = carouselRef.current
            if (!carousel) return

            const cardRect = card.getBoundingClientRect()
            const cardCenter = card.offsetLeft + cardRect.width / 2
            const carouselCenter = carousel.clientWidth / 2
            const scrollLeft = cardCenter - carouselCenter

            carousel.scrollTo({ left: scrollLeft, behavior: 'smooth' })
          }, 100)
        }
      }
    } else if (isCollapsing && isMobile) {
      setTimeout(() => {
        setIsAutoScrolling(true)
      }, 500)
    }
  }

  return (
    <section
      className={`bg-cream py-10 sm:py-14 lg:py-16 border-y-dashed-figma ${className || ''}`}
      data-element="industry-carousel-section"
    >
      <SectionContainer>
        <div className="text-left lg:text-center mb-10 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-[36px] font-display font-bold text-dark leading-tight">
            {title}
          </h2>
          <p className="mt-3 text-sm sm:text-base lg:text-lg font-display font-medium text-teal">
            {subtitle}
          </p>
        </div>

        <div
          ref={carouselRef}
          className="flex justify-start lg:justify-center gap-3.5 overflow-x-auto pb-4 -mx-4 px-4 lg:mx-0 lg:px-0 scrollbar-hide touch-pan-x"
          style={{
            WebkitOverflowScrolling: 'touch',
            scrollSnapType: isAutoScrolling ? 'none' : 'x proximity',
          }}
          onTouchStart={isMobile ? handleUserInteraction : undefined}
          onTouchMove={isMobile ? handleUserInteraction : undefined}
          onScroll={handleScroll}
        >
          {industries.map((industry, index) => {
            const cardPosition = index / (industries.length - 1)
            const parallaxOffset = scrollProgress + (cardPosition * 0.5)

            return (
              <IndustryCard
                key={industry.id}
                industry={industry}
                isExpanded={expandedId === industry.id}
                onClick={() => handleCardClick(industry.id)}
                ref={(el) => setCardRef(industry.id, el)}
                isMobile={isMobile}
                parallaxOffset={parallaxOffset}
              />
            )
          })}
        </div>
      </SectionContainer>
    </section>
  )
}
