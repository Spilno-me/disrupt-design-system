import { useState, cloneElement, ReactElement, useRef, useEffect } from 'react'
import { Workflow, BrainCircuit, LayoutDashboard, TrendingUp, LucideProps } from 'lucide-react'
import { motion, animate } from 'motion/react'
import { ALIAS } from '../../constants/designTokens'

// =============================================================================
// GLOW FILTER TOKENS
// =============================================================================

const GLOW_FILTERS = {
  electric: ALIAS.glow.electric,
  electricIntense: ALIAS.glow.electricIntense,
}

// =============================================================================
// TYPES
// =============================================================================

export type IconName = 'automate' | 'advice' | 'adapt' | 'scale'

interface ElectricLucideIconProps {
  /** Which icon to display */
  name: IconName
  /** Size of the icon */
  size?: number
  /** Whether the electric effect is active */
  isActive?: boolean
  /** Additional class names */
  className?: string
}

// =============================================================================
// ICON MAP
// =============================================================================

const ICON_MAP: Record<IconName, ReactElement<LucideProps>> = {
  automate: <Workflow />,
  advice: <BrainCircuit />,
  adapt: <LayoutDashboard />,
  scale: <TrendingUp />,
}

// =============================================================================
// ANIMATION CONFIG
// =============================================================================

const ELECTRIC_CONFIG = {
  dashArray: '20 10',
  flowDuration: 0.6,
  staggerDelay: 0.08,
  glowFilter: GLOW_FILTERS.electric,
  glowFilterIntense: GLOW_FILTERS.electricIntense,
}

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * Lucide icon with electricity running effect on hover.
 * Renders the icon twice - base white stroke and cyan electric overlay.
 * Uses motion library for animations.
 */
export function ElectricLucideIcon({
  name,
  size = 52,
  isActive = false,
  className = '',
}: ElectricLucideIconProps) {
  const iconElement = ICON_MAP[name]
  const overlayRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<ReturnType<typeof animate>[]>([])

  // Clone the icon with base styling (white stroke + drop shadow)
  const baseIcon = cloneElement(iconElement, {
    size,
    strokeWidth: 1.5,
    stroke: 'white',
    fill: 'none',
    className: 'absolute inset-0',
  })

  // Clone the icon for electric overlay
  const electricIcon = cloneElement(iconElement, {
    size,
    strokeWidth: 1.5,
    stroke: 'cyan',
    fill: 'none',
  })

  // Animate electricity effect when isActive changes
  useEffect(() => {
    const overlay = overlayRef.current
    if (!overlay) return

    // Get all animatable SVG elements
    const paths = overlay.querySelectorAll('path, line, circle, polyline, rect')

    // Stop any running animations
    animationRef.current.forEach(anim => anim.stop())
    animationRef.current = []

    if (isActive) {
      // Set initial stroke-dasharray on all elements
      paths.forEach(path => {
        ;(path as SVGElement).style.strokeDasharray = ELECTRIC_CONFIG.dashArray
      })

      // Animate each path with staggered timing and varying speeds
      paths.forEach((path, index) => {
        // Vary the duration and direction for chaotic effect
        const duration = ELECTRIC_CONFIG.flowDuration + (index % 3) * 0.15
        const direction = index % 2 === 0 ? 1 : -1
        const startOffset = direction > 0 ? 30 : 0
        const endOffset = direction > 0 ? 0 : -30

        // Animate stroke-dashoffset for flowing effect
        const flowAnim = animate(
          path,
          { strokeDashoffset: [startOffset, endOffset] },
          {
            duration,
            ease: 'linear',
            repeat: Infinity,
            delay: index * ELECTRIC_CONFIG.staggerDelay,
          }
        )

        // Animate opacity for flickering
        const flickerAnim = animate(
          path,
          { opacity: [1, 0.7, 1, 0.8, 1] },
          {
            duration: duration * 0.8,
            ease: 'easeInOut',
            repeat: Infinity,
            delay: index * ELECTRIC_CONFIG.staggerDelay,
          }
        )

        animationRef.current.push(flowAnim, flickerAnim)
      })
    } else {
      // Reset stroke-dasharray when inactive
      paths.forEach(path => {
        ;(path as SVGElement).style.strokeDasharray = ''
        ;(path as SVGElement).style.strokeDashoffset = ''
      })
    }

    return () => {
      animationRef.current.forEach(anim => anim.stop())
    }
  }, [isActive])

  return (
    <div
      className={`relative overflow-visible ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Base white icon with animated shadow */}
      <motion.div
        className="absolute inset-0"
        animate={{
          filter: isActive
            ? 'drop-shadow(0 4px 2.5px rgba(0, 0, 0, 0))'
            : 'drop-shadow(0 4px 2.5px rgba(0, 0, 0, 0.25))',
        }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        {baseIcon}
      </motion.div>

      {/* Electric overlay with glow */}
      <motion.div
        ref={overlayRef}
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{
          opacity: isActive ? 1 : 0,
          filter: isActive ? ELECTRIC_CONFIG.glowFilter : 'none',
        }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        {electricIcon}
      </motion.div>

      {/* Pulsing glow layer */}
      {isActive && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0.5, 1, 0.5],
            filter: [
              ELECTRIC_CONFIG.glowFilter,
              ELECTRIC_CONFIG.glowFilterIntense,
              ELECTRIC_CONFIG.glowFilter,
            ],
          }}
          transition={{
            duration: 0.4,
            ease: 'easeInOut',
            repeat: Infinity,
          }}
        >
          {electricIcon}
        </motion.div>
      )}
    </div>
  )
}

// =============================================================================
// DEMO COMPONENT
// =============================================================================

/**
 * Demo component showing all four icons with hover effect.
 */
export function ElectricLucideIconDemo() {
  const [hoveredIcon, setHoveredIcon] = useState<IconName | null>(null)

  const icons: { name: IconName; color: string; label: string }[] = [
    { name: 'automate', color: ALIAS.feature.automate, label: 'Automate' },
    { name: 'advice', color: ALIAS.feature.advice, label: 'Advice' },
    { name: 'adapt', color: ALIAS.feature.adapt, label: 'Adapt' },
    { name: 'scale', color: ALIAS.feature.scale, label: 'Scale' },
  ]

  return (
    <div className="flex gap-8 flex-wrap justify-center">
      {icons.map(({ name, color, label }) => (
        <div
          key={name}
          className="flex flex-col items-center gap-3 cursor-pointer"
          onMouseEnter={() => setHoveredIcon(name)}
          onMouseLeave={() => setHoveredIcon(null)}
        >
          {/* Circle with icon */}
          <motion.div
            className="w-[100px] h-[100px] rounded-full flex items-center justify-center"
            style={{ backgroundColor: color }}
            animate={{ scale: hoveredIcon === name ? 1.05 : 1 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <ElectricLucideIcon
              name={name}
              size={48}
              isActive={hoveredIcon === name}
            />
          </motion.div>
          <span className="text-primary font-semibold">{label}</span>
        </div>
      ))}
    </div>
  )
}
