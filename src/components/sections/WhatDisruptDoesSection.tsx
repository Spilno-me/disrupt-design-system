import { useState, useRef, useCallback, useEffect } from 'react'
import { useInView } from 'motion/react'
import { FeatureCard, FeatureCardProps } from '@/components/ui/FeatureCard'
import { SectionContainer, SectionHeading } from '@/components/ui/SectionLayout'
import { ALIAS } from '@/constants/designTokens'

// =============================================================================
// TABLET DETECTION HOOK
// =============================================================================

function useIsTablet() {
  const [isTablet, setIsTablet] = useState(false)

  useEffect(() => {
    const checkTablet = () => {
      const width = window.innerWidth
      // Tablet: 640px to 1023px (sm to lg breakpoint)
      setIsTablet(width >= 640 && width < 1024)
    }

    checkTablet()
    window.addEventListener('resize', checkTablet)
    return () => window.removeEventListener('resize', checkTablet)
  }, [])

  return isTablet
}

// =============================================================================
// FEATURE DATA
// =============================================================================

const FEATURES: Omit<FeatureCardProps, 'isSequenceActive' | 'hasCompletedSequence' | 'onSequenceComplete'>[] = [
  {
    iconName: 'automate',
    circleColor: ALIAS.feature.automate,
    title: 'Automate',
    description: <>Cut up to <strong>70% of admin</strong> — freeing time for training, coaching, and prevention.</>,
  },
  {
    iconName: 'advice',
    circleColor: ALIAS.feature.advice,
    title: 'Advice',
    description: <><strong>Real-time AI guidance</strong> during audits and reporting — helping teams avoid mistakes before they become incidents.</>,
  },
  {
    iconName: 'adapt',
    circleColor: ALIAS.feature.adapt,
    title: 'Adapt',
    description: <>Build forms and workflows <strong>instantly</strong> — no coding, no bottlenecks. Flexible enough for EHS today.</>,
  },
  {
    iconName: 'scale',
    circleColor: ALIAS.feature.scale,
    title: 'Scale',
    description: <>Architected to <strong>extend beyond EHS</strong> into any workflow where admin slows people down.</>,
  },
]

// =============================================================================
// COMPONENT
// =============================================================================

export function WhatDisruptDoesSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const isTablet = useIsTablet()

  // Track which card is currently animating (-1 = none, 0-3 = card index)
  const [activeIndex, setActiveIndex] = useState(-1)

  // Track which cards have completed their animation
  const [completedCards, setCompletedCards] = useState<Set<number>>(new Set())

  // Track which card is currently tapped on tablet (-1 = none)
  const [tappedIndex, setTappedIndex] = useState(-1)

  // Track if sequence has ever started (to prevent re-triggering)
  const hasStartedRef = useRef(false)

  // Detect when section comes into view
  const isInView = useInView(sectionRef, {
    amount: 0.4, // Trigger when 40% of section is visible
    once: true,  // Only trigger once
  })

  // Start the sequence when section comes into view
  if (isInView && !hasStartedRef.current) {
    hasStartedRef.current = true
    // Small delay before starting first card animation
    setTimeout(() => setActiveIndex(0), 200)
  }

  // Handle when a card completes its animation
  const handleCardComplete = useCallback((index: number) => {
    // Mark this card as completed
    setCompletedCards(prev => new Set([...prev, index]))

    // Move to next card or finish sequence
    if (index < FEATURES.length - 1) {
      setActiveIndex(index + 1)
    } else {
      // All cards done, set to -1 (no active animation)
      setActiveIndex(-1)
    }
  }, [])

  // Handle tap on a card (tablet only)
  const handleCardTap = useCallback((index: number) => {
    // Toggle: if same card is tapped, deactivate; otherwise activate new card
    setTappedIndex(prev => prev === index ? -1 : index)
  }, [])

  // Handle click outside cards to deactivate tap animation (tablet only)
  useEffect(() => {
    if (!isTablet || tappedIndex === -1) return

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (gridRef.current && !gridRef.current.contains(e.target as Node)) {
        setTappedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [isTablet, tappedIndex])

  return (
    <section
      ref={sectionRef}
      className="bg-page py-8 sm:py-12 lg:py-24 border-y-dashed-figma"
      data-element="what-disrupt-does-section"
    >
      <SectionContainer>
        <div className="flex flex-col items-center gap-8 sm:gap-12 lg:gap-16">
          {/* Header */}
          <SectionHeading
            title="What Disrupt does"
            subtitle="AI That Works Like a Consultant. Scales Like Software."
            centered
          />

          {/* Feature Cards Grid */}
          <div
            ref={gridRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-24 sm:gap-8 lg:gap-10 w-full"
          >
            {FEATURES.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                {...feature}
                isSequenceActive={activeIndex === index}
                hasCompletedSequence={completedCards.has(index)}
                onSequenceComplete={() => handleCardComplete(index)}
                isTappedActive={tappedIndex === index}
                onTap={() => handleCardTap(index)}
              />
            ))}
          </div>
        </div>
      </SectionContainer>
    </section>
  )
}
