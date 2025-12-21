/**
 * ValidationPipeline - n8n-style animated flow visualization
 * Shows the DDS pre-commit validation pipeline with animated connections
 */
import React from 'react'
import { motion } from 'motion/react'
import { DEEP_CURRENT, ABYSS, PRIMITIVES, RADIUS, SHADOWS } from '../../constants/designTokens'

// =============================================================================
// TYPES
// =============================================================================

interface PipelineStep {
  id: string
  number: number
  command: string
  description: string
}

// =============================================================================
// ANIMATION CONFIG
// =============================================================================

const STAGGER_DELAY = 0.15
const ENTRANCE_DURATION = 0.5
const DOT_DURATION = 1.5

// =============================================================================
// ANIMATED CONNECTION LINE
// =============================================================================

const ConnectionLine: React.FC<{ delay: number }> = ({ delay }) => {
  return (
    <div style={{
      position: 'relative',
      width: '60px',
      height: '2px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {/* Static dashed line */}
      <svg
        width="60"
        height="20"
        viewBox="0 0 60 20"
        style={{ position: 'absolute' }}
      >
        <line
          x1="0"
          y1="10"
          x2="60"
          y2="10"
          stroke={ABYSS[200]}
          strokeWidth="2"
          strokeDasharray="6 4"
        />
      </svg>

      {/* Animated traveling dot */}
      <motion.div
        initial={{ x: -30, opacity: 0 }}
        animate={{
          x: [- 30, 30],
          opacity: [0, 1, 1, 0],
        }}
        transition={{
          duration: DOT_DURATION,
          delay: delay + 0.8,
          repeat: Infinity,
          repeatDelay: 2,
          ease: 'easeInOut',
        }}
        style={{
          position: 'absolute',
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: DEEP_CURRENT[500],
          boxShadow: `0 0 8px ${DEEP_CURRENT[400]}`,
        }}
      />
    </div>
  )
}

// =============================================================================
// PIPELINE NODE
// =============================================================================

const PipelineNode: React.FC<{
  step: PipelineStep
  index: number
  isLast: boolean
}> = ({ step, index, isLast }) => {
  const delay = index * STAGGER_DELAY

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: ENTRANCE_DURATION,
          delay,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
        whileHover={{
          scale: 1.02,
          boxShadow: SHADOWS.md,
        }}
        style={{
          flex: 1,
          minWidth: '200px',
          maxWidth: '280px',
          background: PRIMITIVES.white,
          borderRadius: RADIUS.lg,
          padding: '20px',
          border: `1px solid ${ABYSS[100]}`,
          boxShadow: SHADOWS.sm,
          cursor: 'default',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Pulse ring on entrance */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0.5 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{
            duration: 0.8,
            delay: delay + 0.2,
          }}
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            width: '24px',
            height: '24px',
            borderRadius: '6px',
            background: DEEP_CURRENT[300],
            pointerEvents: 'none',
          }}
        />

        {/* Header with number badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '12px'
        }}>
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 15,
              delay: delay + 0.1,
            }}
            style={{
              background: DEEP_CURRENT[700],
              color: PRIMITIVES.white,
              fontSize: '12px',
              fontWeight: 700,
              width: '24px',
              height: '24px',
              borderRadius: '6px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {step.number}
          </motion.span>
          <span style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '15px',
            fontWeight: 700,
            color: DEEP_CURRENT[700],
          }}>
            {step.command}
          </span>
        </div>

        {/* Description */}
        <p style={{
          fontSize: '13px',
          color: ABYSS[500],
          lineHeight: 1.5,
          margin: 0,
        }}>
          {step.description}
        </p>

        {/* Bottom accent line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{
            duration: 0.4,
            delay: delay + 0.3,
          }}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: `linear-gradient(90deg, ${DEEP_CURRENT[500]}, ${DEEP_CURRENT[300]})`,
            transformOrigin: 'left',
          }}
        />
      </motion.div>

      {/* Connection to next node */}
      {!isLast && <ConnectionLine delay={delay} />}
    </>
  )
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

const steps: PipelineStep[] = [
  {
    id: 'sync',
    number: 1,
    command: 'sync:all',
    description: 'Generate files from sources of truth',
  },
  {
    id: 'health',
    number: 2,
    command: 'health',
    description: 'Run all validators (typecheck, lint, validate:*)',
  },
  {
    id: 'lint-staged',
    number: 3,
    command: 'lint-staged',
    description: 'ESLint on staged files only',
  },
]

export const ValidationPipeline: React.FC = () => {
  return (
    <div style={{
      background: PRIMITIVES.softLinen,
      borderRadius: RADIUS.lg,
      padding: '32px 24px',
      border: `1px solid ${ABYSS[100]}`,
    }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          color: ABYSS[600],
          marginBottom: '24px',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '13px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <span style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: DEEP_CURRENT[500],
          animation: 'pulse 2s infinite',
        }} />
        git commit triggers simple-git-hooks:
      </motion.div>

      {/* Pipeline Flow */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0',
        justifyContent: 'center',
        flexWrap: 'wrap',
      }}>
        {steps.map((step, index) => (
          <PipelineNode
            key={step.id}
            step={step}
            index={index}
            isLast={index === steps.length - 1}
          />
        ))}
      </div>

      {/* CSS for pulse animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }
      `}</style>
    </div>
  )
}

export default ValidationPipeline
