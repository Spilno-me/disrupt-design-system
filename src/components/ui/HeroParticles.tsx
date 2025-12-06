import { useMemo } from 'react'
import { motion } from 'motion/react'
import { useIsMobile } from '../../hooks/useIsMobile'
import './HeroParticles.css'

// =============================================================================
// CONSTANTS
// =============================================================================

// Static particle configuration - positioned as percentages
const STATIC_PARTICLES = [
  { size: 8, x: 15, y: 20, delay: 0, fadeDelay: 0.5, fadeDuration: 2.2 },
  { size: 10, x: 25, y: 45, delay: 2, fadeDelay: 0.8, fadeDuration: 2.5 },
  { size: 7, x: 40, y: 15, delay: 4, fadeDelay: 1.1, fadeDuration: 2.0 },
  { size: 9, x: 55, y: 70, delay: 1, fadeDelay: 1.4, fadeDuration: 2.8 },
  { size: 8, x: 70, y: 35, delay: 3, fadeDelay: 0.6, fadeDuration: 2.3 },
  { size: 11, x: 85, y: 55, delay: 5, fadeDelay: 1.7, fadeDuration: 2.6 },
  { size: 7, x: 20, y: 75, delay: 2, fadeDelay: 2.0, fadeDuration: 2.1 },
  { size: 9, x: 45, y: 85, delay: 4, fadeDelay: 1.0, fadeDuration: 2.9 },
  { size: 8, x: 60, y: 25, delay: 1, fadeDelay: 2.3, fadeDuration: 2.4 },
  { size: 10, x: 80, y: 80, delay: 3, fadeDelay: 1.5, fadeDuration: 2.7 },
  { size: 7, x: 10, y: 50, delay: 6, fadeDelay: 2.6, fadeDuration: 2.2 },
  { size: 9, x: 35, y: 60, delay: 0, fadeDelay: 0.9, fadeDuration: 3.0 },
  { size: 8, x: 50, y: 40, delay: 2, fadeDelay: 1.8, fadeDuration: 2.5 },
  { size: 10, x: 75, y: 15, delay: 5, fadeDelay: 2.1, fadeDuration: 2.3 },
  { size: 7, x: 90, y: 45, delay: 1, fadeDelay: 1.3, fadeDuration: 2.8 },
  { size: 9, x: 30, y: 30, delay: 4, fadeDelay: 2.4, fadeDuration: 2.1 },
  { size: 8, x: 65, y: 65, delay: 3, fadeDelay: 0.7, fadeDuration: 2.6 },
  { size: 11, x: 5, y: 85, delay: 2, fadeDelay: 1.9, fadeDuration: 2.4 },
] as const

// Mobile particle settings
const MOBILE_PARTICLE_COUNT = 8
const MOBILE_PARTICLE_SCALE = 0.5

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * Floating particles effect for hero sections.
 * Renders animated particles that drift and change colors.
 */
export function HeroParticles() {
  const isMobile = useIsMobile()

  // Filter and scale particles for mobile
  const displayParticles = useMemo(() => {
    if (isMobile) {
      return STATIC_PARTICLES.slice(0, MOBILE_PARTICLE_COUNT).map(p => ({
        ...p,
        size: Math.round(p.size * MOBILE_PARTICLE_SCALE),
      }))
    }
    return [...STATIC_PARTICLES]
  }, [isMobile])

  return (
    <div className="absolute inset-0 pointer-events-none">
      {displayParticles.map((particle, index) => (
        <motion.div
          key={index}
          className="hero-particle"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 0.85, scale: 1 }}
          transition={{
            duration: particle.fadeDuration,
            delay: particle.fadeDelay,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDelay: `${particle.delay}s, ${particle.delay * 0.5}s`,
          }}
        />
      ))}
    </div>
  )
}
