import { motion, useInView } from 'motion/react'
import { useRef } from 'react'
import { ALIAS } from '../../constants/designTokens'

interface AnimatedCheckProps {
  /** Size class for the check (default matches Check icon sizing) */
  className?: string
  /** Color of the check (default: teal) */
  color?: string
  /** Whether to animate immediately on mount (for hero sections) */
  autoAnimate?: boolean
  /** Stagger index for sequential animations */
  index?: number
  /** Base stagger delay between items */
  staggerDelay?: number
}

/**
 * Animated checkmark that draws itself like a pen stroke.
 * Replays animation every time it scrolls into view.
 */
export function AnimatedCheck({
  className = 'w-5 h-5 sm:w-6 sm:h-6',
  color = ALIAS.brand.secondary,
  autoAnimate = false,
  index = 0,
  staggerDelay = 0.15,
}: AnimatedCheckProps) {
  const ref = useRef<SVGSVGElement>(null)
  const isInView = useInView(ref, {
    once: false,
    amount: 0.5,
  })

  // Calculate stagger delay
  const delay = index * staggerDelay

  // For autoAnimate (hero), always show animated
  // For scroll sections, animate based on isInView
  const shouldAnimate = autoAnimate || isInView

  return (
    <svg
      ref={ref}
      viewBox="0 0 24 24"
      fill="none"
      className={`${className} flex-shrink-0 mt-0.5 sm:mt-1`}
    >
      <motion.path
        d="M7 12.5L10.5 16L17 9"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        animate={{
          pathLength: shouldAnimate ? 1 : 0,
          opacity: shouldAnimate ? 1 : 0,
        }}
        transition={{
          pathLength: {
            duration: 0.5,
            ease: [0.65, 0, 0.35, 1],
            delay: shouldAnimate ? delay : 0,
          },
          opacity: {
            duration: 0.1,
            delay: shouldAnimate ? delay : 0,
          },
        }}
      />
    </svg>
  )
}
