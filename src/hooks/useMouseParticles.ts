import { useState, useCallback, useRef } from 'react'
import { ALIAS } from '@/constants/designTokens'

// Particle spawn configuration - uses ALIAS animation tokens
const PARTICLE_COLORS = [
  ALIAS.animation.particleBlue,
  ALIAS.animation.particleBlueMed,
  ALIAS.animation.particleBlueLight,
  ALIAS.animation.particleBlueSubtle,
] as const

const POSITION_OFFSET = 30
const MIN_SIZE = 2
const SIZE_RANGE = 4
const ANIMATION_VARIANTS = 6

// Animation settings
const SPAWN_THROTTLE_MS = 50
const MAX_ACTIVE_PARTICLES = 15
const SPAWN_PROBABILITY = 0.4
const LIFETIME_MS = 3500

export interface MouseParticle {
  id: number
  x: number
  y: number
  size: number
  color: string
  animationIndex: number
}

interface UseMouseParticlesOptions {
  enabled?: boolean
  containerRef: React.RefObject<HTMLElement | null>
}

/**
 * Hook for spawning particles on mouse movement.
 * Returns particles array and mouse move handler.
 */
export function useMouseParticles({
  enabled = true,
  containerRef,
}: UseMouseParticlesOptions) {
  const [particles, setParticles] = useState<MouseParticle[]>([])
  const particleIdRef = useRef(0)
  const lastSpawnRef = useRef(0)

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!enabled) return

      const now = Date.now()
      if (now - lastSpawnRef.current < SPAWN_THROTTLE_MS) return
      lastSpawnRef.current = now

      const container = containerRef.current
      if (!container) return

      const rect = container.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      // Only spawn if mouse is within bounds
      if (x < 0 || x > rect.width || y < 0 || y > rect.height) return

      // Limit active particles
      if (particles.length > MAX_ACTIVE_PARTICLES) return

      // Probabilistic spawn for organic feel
      if (Math.random() > SPAWN_PROBABILITY) return

      const newParticle: MouseParticle = {
        id: particleIdRef.current++,
        x: x + (Math.random() - 0.5) * POSITION_OFFSET,
        y: y + (Math.random() - 0.5) * POSITION_OFFSET,
        size: MIN_SIZE + Math.random() * SIZE_RANGE,
        color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
        animationIndex: Math.floor(Math.random() * ANIMATION_VARIANTS) + 1,
      }

      setParticles(prev => [...prev, newParticle])

      // Remove particle after animation
      setTimeout(() => {
        setParticles(prev => prev.filter(p => p.id !== newParticle.id))
      }, LIFETIME_MS)
    },
    [enabled, containerRef, particles.length]
  )

  return { particles, handleMouseMove }
}
