import { useState, useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring, animate } from 'motion/react'
import { ElectricLucideIcon, IconName } from '@/components/ui/ElectricLucideIcon'
import { useIsMobile } from '@/hooks'

// Hook to detect tablet (between mobile and desktop)
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
// CONSTANTS
// =============================================================================

const OUTER_RADIUS = 58
// Circumference = 2 * π * 58 ≈ 364.42, divided by 40 segments for even dashes
const DASH_GAP_SIZE = 9.11

// Animation config
const SPIN_VELOCITY = 120 // degrees per second when active
const SPRING_CONFIG = { damping: 20, stiffness: 100 } // for smooth start/stop

// =============================================================================
// TYPES
// =============================================================================

export interface FeatureCardProps {
  /** Lucide icon name for the electric effect */
  iconName: IconName
  /** Background color for the circle */
  circleColor: string
  /** Card title */
  title: string
  /** Card description - use ReactNode for rich text */
  description: React.ReactNode
  /** External control: is this card currently animating in the sequence */
  isSequenceActive?: boolean
  /** External control: has this card completed its sequence animation */
  hasCompletedSequence?: boolean
  /** Callback when sequence animation should complete */
  onSequenceComplete?: () => void
  /** External control: is this card tapped active (for tablet) */
  isTappedActive?: boolean
  /** Callback when card is tapped (for tablet) */
  onTap?: () => void
}

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * Feature card with animated rotating dashed border.
 * Supports both hover interaction and external sequence animation control.
 *
 * Animation behavior:
 * - On scroll: Cards animate one by one via isSequenceActive prop
 * - After sequence: Text stays visible (hasCompletedSequence)
 * - On hover: Spin + electric effect re-triggers, text stays in place
 */
export function FeatureCard({
  iconName,
  circleColor,
  title,
  description,
  isSequenceActive = false,
  hasCompletedSequence = false,
  onSequenceComplete,
  isTappedActive = false,
  onTap,
}: FeatureCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const isMobile = useIsMobile()
  const isTablet = useIsTablet()

  // Motion values for rotation
  const rotation = useMotionValue(0)
  const smoothRotation = useSpring(rotation, SPRING_CONFIG)

  // Animation control ref
  const animationRef = useRef<ReturnType<typeof animate> | null>(null)

  // Track if this card's sequence animation has started
  const sequenceStartedRef = useRef(false)

  // Determine if spin/electric animation should be active
  // Active when: sequence is active OR hovering on desktop OR tapped on tablet
  const isSpinActive = isSequenceActive ||
    (hasCompletedSequence && isHovered && !isTablet) ||
    (hasCompletedSequence && isTappedActive && isTablet)

  // Determine if text should be visible
  // Visible when: sequence is active OR sequence has completed OR on mobile
  const isTextVisible = isMobile || isSequenceActive || hasCompletedSequence

  // Handle sequence animation timing
  useEffect(() => {
    if (isSequenceActive && !sequenceStartedRef.current) {
      sequenceStartedRef.current = true

      // Notify parent when this card's animation duration is complete
      const timer = setTimeout(() => {
        onSequenceComplete?.()
      }, 1000) // Animation duration per card

      return () => clearTimeout(timer)
    }

    if (!isSequenceActive) {
      sequenceStartedRef.current = false
    }
  }, [isSequenceActive, onSequenceComplete])

  // Handle spin animation state changes
  useEffect(() => {
    if (isSpinActive) {
      // Start continuous rotation
      const currentRotation = rotation.get()
      animationRef.current = animate(rotation, currentRotation + 360000, {
        duration: 360000 / SPIN_VELOCITY,
        ease: 'linear',
        repeat: Infinity,
      })
    } else {
      // Stop animation and let spring handle deceleration
      if (animationRef.current) {
        animationRef.current.stop()
        animationRef.current = null
      }
    }

    return () => {
      if (animationRef.current) {
        animationRef.current.stop()
      }
    }
  }, [isSpinActive, rotation])

  const handleMouseEnter = () => {
    if (isMobile || isTablet) return
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    if (isMobile || isTablet) return
    setIsHovered(false)
  }

  // Handle tap on tablet - notify parent to manage state
  const handleCardClick = () => {
    if (isTablet && hasCompletedSequence) {
      onTap?.()
    }
  }

  return (
    <div
      className="flex flex-col items-center text-center gap-4 sm:gap-6 cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardClick}
    >
      {/* Icon with colored circle and dashed outer ring */}
      <div className="relative w-24 h-24 sm:w-[120px] sm:h-[120px]" data-cursor-repel="true">
        {/* Outer dashed ring using motion SVG */}
        <motion.svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 120 120"
          style={{ rotate: smoothRotation }}
        >
          <circle
            cx="60"
            cy="60"
            r={OUTER_RADIUS}
            fill="none"
            stroke={circleColor}
            strokeWidth="2"
            strokeDasharray={`${DASH_GAP_SIZE} ${DASH_GAP_SIZE}`}
            strokeLinecap="butt"
          />
        </motion.svg>
        {/* Inner filled circle - inset by 8px */}
        <div
          className="absolute inset-1.5 sm:inset-2 rounded-full flex items-center justify-center overflow-visible"
          style={{ backgroundColor: circleColor }}
        >
          <motion.div
            className="overflow-visible"
            animate={{ scale: isSpinActive ? 1.1 : 1 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <ElectricLucideIcon
              name={iconName}
              size={48}
              isActive={isSpinActive}
            />
          </motion.div>
        </div>
      </div>

      {/* Title - always visible */}
      <h3 className="text-lg font-sans font-semibold text-dark leading-7">
        {title}
      </h3>

      {/* Description - animated based on visibility state */}
      <motion.div
        className="overflow-hidden"
        initial={false}
        animate={{
          maxHeight: isTextVisible ? 160 : 0,
          opacity: isTextVisible ? 1 : 0,
        }}
        transition={{
          duration: 0.4,
          ease: [0.34, 1.56, 0.64, 1],
        }}
      >
        <motion.p
          className="text-muted leading-relaxed text-sm sm:text-base max-w-[280px]"
          initial={false}
          animate={{
            y: isTextVisible ? 0 : -20,
          }}
          transition={{
            duration: 0.4,
            ease: [0.34, 1.56, 0.64, 1],
          }}
        >
          {description}
        </motion.p>
      </motion.div>
    </div>
  )
}
