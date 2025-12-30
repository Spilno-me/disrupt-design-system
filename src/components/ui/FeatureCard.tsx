import { useState, useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring, animate } from 'motion/react'
import { ElectricLucideIcon, IconName } from './ElectricLucideIcon'
import { useIsMobile } from '../../hooks/useIsMobile'

// =============================================================================
// CONSTANTS
// =============================================================================

/** Outer ring SVG radius in viewBox units */
const OUTER_RING_RADIUS = 58

/** Dash/gap size for dashed ring (circumference ÷ 40 segments) */
const DASH_GAP_SIZE = 9.11

/** Spin velocity in degrees per second when animation is active */
const SPIN_VELOCITY_DEG_PER_SEC = 120

/** Spring animation configuration for smooth acceleration/deceleration */
const SPRING_CONFIG = { damping: 20, stiffness: 100 }

/** Duration per card in sequence animation (ms) */
const SEQUENCE_ANIMATION_DURATION_MS = 1000

/** Maximum height for description container when expanded (px) */
const DESCRIPTION_MAX_HEIGHT_PX = 160

/** Description slide offset when hidden (px) */
const DESCRIPTION_SLIDE_OFFSET_PX = -20

/** Animation duration for description reveal (seconds) */
const DESCRIPTION_ANIMATION_DURATION_SEC = 0.4

/** Custom easing curve for bouncy description animation (cubic bezier) */
const DESCRIPTION_EASING: [number, number, number, number] = [0.34, 1.56, 0.64, 1]

/** Tablet breakpoint range: min width (px) */
const TABLET_MIN_WIDTH_PX = 640

/** Tablet breakpoint range: max width (px, exclusive) */
const TABLET_MAX_WIDTH_PX = 1024

/** Icon scale multiplier when animation is active */
const ICON_ACTIVE_SCALE = 1.1

/** Icon scale transition duration (seconds) */
const ICON_SCALE_DURATION_SEC = 0.3

// =============================================================================
// HOOKS
// =============================================================================

/**
 * Detects tablet viewport (between mobile and desktop breakpoints).
 * Tablet range: 640px to 1023px (sm to lg Tailwind breakpoints).
 */
function useIsTablet(): boolean {
  const [isTablet, setIsTablet] = useState(false)

  useEffect(() => {
    const checkTablet = () => {
      const width = window.innerWidth
      setIsTablet(width >= TABLET_MIN_WIDTH_PX && width < TABLET_MAX_WIDTH_PX)
    }

    checkTablet()
    window.addEventListener('resize', checkTablet)
    return () => window.removeEventListener('resize', checkTablet)
  }, [])

  return isTablet
}

// =============================================================================
// TYPES
// =============================================================================

export interface FeatureCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Lucide icon name for the electric effect */
  iconName: IconName
  /** Background color for the circle (CSS color value) */
  circleColor: string
  /** Card title displayed below the icon */
  title: string
  /** Card description - supports ReactNode for rich text formatting */
  description: React.ReactNode
  /** External control: is this card currently animating in the sequence */
  isSequenceActive?: boolean
  /** External control: has this card completed its sequence animation */
  hasCompletedSequence?: boolean
  /** Callback fired when sequence animation completes */
  onSequenceComplete?: () => void
  /** External control: is this card in tapped-active state (tablet only) */
  isTappedActive?: boolean
  /** Callback fired when card is tapped (tablet only) */
  onTap?: () => void
}

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * FeatureCard - Animated feature showcase card with rotating dashed border.
 *
 * Displays a feature with an animated icon, rotating border ring, and reveal
 * animation for description text. Supports both hover interactions and
 * external sequence animation control for coordinated animations.
 *
 * @component ATOM
 *
 * @example
 * ```tsx
 * // Basic usage
 * <FeatureCard
 *   iconName="Zap"
 *   circleColor="#08A4BD"
 *   title="Fast Performance"
 *   description="Lightning-fast load times"
 * />
 *
 * // With sequence animation control
 * <FeatureCard
 *   iconName="Shield"
 *   circleColor="#5E4F7E"
 *   title="Secure"
 *   description="Enterprise-grade security"
 *   isSequenceActive={activeIndex === 0}
 *   hasCompletedSequence={completedCards.has(0)}
 *   onSequenceComplete={() => setActiveIndex(1)}
 * />
 * ```
 *
 * **Animation Behavior:**
 * - Scroll sequence: Cards animate one-by-one via `isSequenceActive` prop
 * - After sequence: Description stays visible (`hasCompletedSequence`)
 * - Hover (desktop): Re-triggers spin + electric effect
 * - Tap (tablet): Toggles active state via `onTap` callback
 *
 * **Responsive:**
 * - Mobile: Description always visible, no animations
 * - Tablet: Tap to activate animation
 * - Desktop: Hover to activate animation
 *
 * **Testing:**
 * - `data-slot="feature-card"` - Root container
 * - `data-cursor-repel="true"` - Icon container (for cursor effects)
 */
function FeatureCard({
  iconName,
  circleColor,
  title,
  description,
  isSequenceActive = false,
  hasCompletedSequence = false,
  onSequenceComplete,
  isTappedActive = false,
  onTap,
  className,
  ...props
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
      }, SEQUENCE_ANIMATION_DURATION_MS)

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
        duration: 360000 / SPIN_VELOCITY_DEG_PER_SEC,
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
      data-slot="feature-card"
      className={`flex flex-col items-center text-center gap-4 sm:gap-6 cursor-pointer ${className || ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardClick}
      {...props}
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
            r={OUTER_RING_RADIUS}
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
            animate={{ scale: isSpinActive ? ICON_ACTIVE_SCALE : 1 }}
            transition={{ duration: ICON_SCALE_DURATION_SEC, ease: 'easeOut' }}
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
      <h3 className="text-lg font-sans font-semibold text-primary leading-7">
        {title}
      </h3>

      {/* Description - animated based on visibility state */}
      <motion.div
        className="overflow-hidden"
        initial={false}
        animate={{
          maxHeight: isTextVisible ? DESCRIPTION_MAX_HEIGHT_PX : 0,
          opacity: isTextVisible ? 1 : 0,
        }}
        transition={{
          duration: DESCRIPTION_ANIMATION_DURATION_SEC,
          ease: DESCRIPTION_EASING,
        }}
      >
        <motion.p
          className="text-muted leading-relaxed text-sm sm:text-base max-w-[280px]"
          initial={false}
          animate={{
            y: isTextVisible ? 0 : DESCRIPTION_SLIDE_OFFSET_PX,
          }}
          transition={{
            duration: DESCRIPTION_ANIMATION_DURATION_SEC,
            ease: DESCRIPTION_EASING,
          }}
        >
          {description}
        </motion.p>
      </motion.div>
    </div>
  )
}
FeatureCard.displayName = "FeatureCard"

export { FeatureCard }
