/**
 * HeroParticles - Animated particle background for brand documentation heroes
 *
 * Behavior inspired by src/components/ui/HeroParticles.tsx:
 * - Depth simulation with blur + scale
 * - 6 unique drift patterns
 * - Staggered animations
 *
 * Styling unique to brand documentation:
 * - Gradient-aware color palettes
 * - Contrast-optimized for each background type
 */
import React, { useMemo } from 'react';
import {
  DEEP_CURRENT,
  DUSK_REEF,
  PRIMITIVES,
} from '../../constants/designTokens';

type GradientType = 'primary' | 'teal' | 'purple';

interface HeroParticlesProps {
  gradient: GradientType;
  particleCount?: number;
}

// Pre-defined particle positions for balanced distribution
const PARTICLE_POSITIONS = [
  { x: 12, y: 18 }, { x: 28, y: 42 }, { x: 38, y: 12 },
  { x: 52, y: 68 }, { x: 72, y: 32 }, { x: 88, y: 52 },
  { x: 18, y: 78 }, { x: 48, y: 88 }, { x: 62, y: 22 },
  { x: 82, y: 75 }, { x: 8, y: 48 }, { x: 32, y: 58 },
  { x: 55, y: 38 }, { x: 78, y: 12 }, { x: 92, y: 42 },
  { x: 25, y: 28 }, { x: 68, y: 62 }, { x: 5, y: 82 },
  { x: 95, y: 22 }, { x: 15, y: 92 }, { x: 75, y: 48 },
  { x: 45, y: 8 }, { x: 58, y: 75 }, { x: 85, y: 68 },
  { x: 22, y: 52 }, { x: 65, y: 5 }, { x: 42, y: 95 },
  { x: 80, y: 35 }, { x: 35, y: 72 }, { x: 50, y: 55 },
];

// Gradient-specific color palettes (contrast-optimized)
const COLOR_PALETTES: Record<GradientType, { primary: string; secondary: string; accent: string }> = {
  // ABYSS background: teal accents + warm highlights
  primary: {
    primary: DEEP_CURRENT[200],
    secondary: PRIMITIVES.white,
    accent: DUSK_REEF[200],
  },
  // DEEP_CURRENT background: lighter teals + white
  teal: {
    primary: DEEP_CURRENT[100],
    secondary: PRIMITIVES.white,
    accent: PRIMITIVES.cream,
  },
  // DUSK_REEF background: teal contrast + white
  purple: {
    primary: DEEP_CURRENT[200],
    secondary: PRIMITIVES.white,
    accent: DEEP_CURRENT[100],
  },
};

export const HeroParticles: React.FC<HeroParticlesProps> = ({
  gradient,
  particleCount = 20
}) => {
  const colors = COLOR_PALETTES[gradient];

  const particles = useMemo(() => {
    return PARTICLE_POSITIONS.slice(0, particleCount).map((pos, i) => ({
      ...pos,
      size: 4 + (i % 5) * 1.5, // 4-10px
      drift: (i % 6) + 1,
      delay: (i * 0.8) % 6,
      colorType: i % 3, // 0=primary, 1=secondary, 2=accent
    }));
  }, [particleCount]);

  const getColor = (colorType: number) => {
    switch (colorType) {
      case 0: return colors.primary;
      case 1: return colors.secondary;
      default: return colors.accent;
    }
  };

  return (
    <>
      <style>
        {`
          /* Drift 1 - gentle rise and approach */
          @keyframes brand-drift-1 {
            0%, 100% {
              transform: translate(0, 0) scale(1);
              filter: blur(0.3px);
              opacity: 0.6;
            }
            50% {
              transform: translate(25px, -30px) scale(1.8);
              filter: blur(1.5px);
              opacity: 0.9;
            }
          }

          /* Drift 2 - sweep left then recede */
          @keyframes brand-drift-2 {
            0%, 100% {
              transform: translate(0, 0) scale(1);
              filter: blur(0.3px);
              opacity: 0.55;
            }
            40% {
              transform: translate(-30px, -25px) scale(2);
              filter: blur(2px);
              opacity: 0.85;
            }
            75% {
              transform: translate(15px, -15px) scale(0.7);
              filter: blur(0px);
              opacity: 0.45;
            }
          }

          /* Drift 3 - emerge from distance */
          @keyframes brand-drift-3 {
            0%, 100% {
              transform: translate(0, 0) scale(0.6);
              filter: blur(0px);
              opacity: 0.4;
            }
            55% {
              transform: translate(-20px, -35px) scale(1.6);
              filter: blur(1.2px);
              opacity: 0.85;
            }
          }

          /* Drift 4 - figure-eight depth */
          @keyframes brand-drift-4 {
            0%, 100% {
              transform: translate(0, 0) scale(1);
              filter: blur(0.3px);
              opacity: 0.6;
            }
            30% {
              transform: translate(20px, -20px) scale(1.5);
              filter: blur(1px);
              opacity: 0.8;
            }
            50% {
              transform: translate(35px, -30px) scale(0.8);
              filter: blur(0px);
              opacity: 0.5;
            }
            80% {
              transform: translate(15px, -25px) scale(1.7);
              filter: blur(1.3px);
              opacity: 0.85;
            }
          }

          /* Drift 5 - dramatic bloom */
          @keyframes brand-drift-5 {
            0%, 100% {
              transform: translate(0, 0) scale(1);
              filter: blur(0.3px);
              opacity: 0.65;
            }
            50% {
              transform: translate(15px, -45px) scale(2.2);
              filter: blur(2.5px);
              opacity: 0.9;
            }
          }

          /* Drift 6 - wandering path */
          @keyframes brand-drift-6 {
            0%, 100% {
              transform: translate(0, 0) scale(1);
              filter: blur(0.3px);
              opacity: 0.55;
            }
            25% {
              transform: translate(-25px, -10px) scale(1.3);
              filter: blur(0.8px);
              opacity: 0.75;
            }
            50% {
              transform: translate(-10px, -40px) scale(0.9);
              filter: blur(0px);
              opacity: 0.5;
            }
            75% {
              transform: translate(20px, -20px) scale(1.4);
              filter: blur(1px);
              opacity: 0.8;
            }
          }
        `}
      </style>

      <div
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
          zIndex: 0,
        }}
        aria-hidden="true"
      >
        {particles.map((particle, index) => {
          const color = getColor(particle.colorType);
          const duration = 10 + particle.drift * 2; // 12-22s

          return (
            <div
              key={index}
              style={{
                position: 'absolute',
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                borderRadius: '50%',
                backgroundColor: color,
                boxShadow: `0 0 ${particle.size}px ${color}`,
                animation: `brand-drift-${particle.drift} ${duration}s ease-in-out infinite`,
                animationDelay: `${-particle.delay}s`,
                willChange: 'transform, opacity, filter',
              }}
            />
          );
        })}
      </div>
    </>
  );
};

export default HeroParticles;
