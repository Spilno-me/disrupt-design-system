import { motion } from 'motion/react'
import { MouseParticle } from '@/hooks/useMouseParticles'

interface MouseParticleRendererProps {
  particles: MouseParticle[]
}

/**
 * Renders mouse-generated particles with drift animations.
 * Desktop only component.
 */
export function MouseParticleRenderer({ particles }: MouseParticleRendererProps) {
  return (
    <div className="absolute inset-0 pointer-events-none hidden lg:block">
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          className="mouse-particle"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            width: particle.size,
            height: particle.size,
            left: particle.x,
            top: particle.y,
            backgroundColor: particle.color,
            animation: `mouse-drift-${particle.animationIndex} 3.5s linear forwards`,
          }}
        />
      ))}
    </div>
  )
}
