/**
 * ValidatorGrid - n8n-style animated validator flow visualization
 * Shows the DDS health check validators with sequential flow animation
 */
import React from 'react'
import { motion } from 'motion/react'
import {
  FileCode,
  Eye,
  Palette,
  FileText,
  Layers,
  Bot,
  Package,
  BookOpen,
  Check,
} from 'lucide-react'
import { DEEP_CURRENT, HARBOR, DUSK_REEF, CORAL, ABYSS, PRIMITIVES, RADIUS, SHADOWS } from '../../constants/designTokens'

// =============================================================================
// TYPES
// =============================================================================

interface Validator {
  id: string
  name: string
  icon: React.ReactNode
  color: string
  colorLight: string
}

// =============================================================================
// ANIMATION CONFIG
// =============================================================================

const STAGGER_DELAY = 0.1
const ENTRANCE_DURATION = 0.4
const PULSE_DURATION = 0.6
const FLOW_DELAY = 2 // Delay before flow animation starts

// =============================================================================
// VALIDATOR DATA
// =============================================================================

const validators: Validator[] = [
  { id: 'typecheck', name: 'typecheck', icon: <FileCode size={16} />, color: DEEP_CURRENT[700], colorLight: DEEP_CURRENT[200] },
  { id: 'lint', name: 'lint', icon: <Eye size={16} />, color: DEEP_CURRENT[700], colorLight: DEEP_CURRENT[200] },
  { id: 'tokens', name: 'validate:tokens', icon: <Palette size={16} />, color: HARBOR[700], colorLight: HARBOR[200] },
  { id: 'readme', name: 'validate:readme', icon: <FileText size={16} />, color: HARBOR[700], colorLight: HARBOR[200] },
  { id: 'context', name: 'validate-context', icon: <Layers size={16} />, color: DUSK_REEF[600], colorLight: DUSK_REEF[200] },
  { id: 'agents', name: 'validate:agents', icon: <Bot size={16} />, color: DUSK_REEF[600], colorLight: DUSK_REEF[200] },
  { id: 'version', name: 'validate:version', icon: <Package size={16} />, color: CORAL[600], colorLight: CORAL[200] },
  { id: 'prompts', name: 'validate:prompts', icon: <BookOpen size={16} />, color: CORAL[600], colorLight: CORAL[200] },
]

// =============================================================================
// CONNECTION LINE COMPONENTS
// =============================================================================

// Total cycle duration for all validators
const CYCLE_DURATION = validators.length * PULSE_DURATION
const RESET_PAUSE = 1.5 // Pause after all checks complete before resetting

// Horizontal connector between adjacent items in the same row
const HorizontalConnector: React.FC<{ index: number }> = ({ index }) => {
  // Linear flow: 0→1→2→3 (row 1), 4→5→6→7 (row 2)
  // NOT at end of rows (index 3 wraps down, index 7 is last)
  const isEndOfRow = index === 3 || index === 7
  if (isEndOfRow) return null

  return (
    <div style={{
      position: 'absolute',
      top: '50%',
      right: '-48px',
      width: '48px',
      height: '20px',
      transform: 'translateY(-50%)',
      display: 'flex',
      alignItems: 'center',
    }}>
      <svg width="48" height="20" viewBox="0 0 48 20">
        <line x1="0" y1="10" x2="48" y2="10" stroke={ABYSS[300]} strokeWidth="2" strokeDasharray="4 3" />
      </svg>
      <motion.div
        initial={{ x: 0, opacity: 0 }}
        animate={{ x: [0, 42], opacity: [0, 1, 1, 0] }}
        transition={{
          duration: 0.5,
          delay: FLOW_DELAY + (index * PULSE_DURATION) + 0.3,
          repeat: Infinity,
          repeatDelay: CYCLE_DURATION + RESET_PAUSE - 0.5,
          ease: 'easeInOut',
        }}
        style={{
          position: 'absolute',
          left: 0,
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: validators[index + 1]?.color || ABYSS[400],
          boxShadow: `0 0 6px ${validators[index + 1]?.color || ABYSS[400]}`,
        }}
      />
    </div>
  )
}

// No wrap connector needed in individual nodes - we'll draw it at grid level

// =============================================================================
// VALIDATOR NODE COMPONENT
// =============================================================================

const ValidatorNode: React.FC<{
  validator: Validator
  index: number
}> = ({ validator, index }) => {
  const delay = index * STAGGER_DELAY

  return (
    <div style={{ position: 'relative' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: ENTRANCE_DURATION,
          delay,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
        whileHover={{
          scale: 1.05,
          boxShadow: SHADOWS.md,
        }}
        style={{
          background: validator.color,
          color: PRIMITIVES.white,
          padding: '14px 12px',
          borderRadius: RADIUS.md,
          textAlign: 'center',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '12px',
          fontWeight: 600,
          cursor: 'default',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Icon + Name */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
        }}>
          {validator.icon}
          <span>{validator.name}</span>
        </div>

        {/* Sequential pulse overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.3, 0] }}
          transition={{
            duration: PULSE_DURATION,
            delay: FLOW_DELAY + (index * PULSE_DURATION),
            repeat: Infinity,
            repeatDelay: validators.length * PULSE_DURATION,
          }}
          style={{
            position: 'absolute',
            inset: 0,
            background: PRIMITIVES.white,
            pointerEvents: 'none',
          }}
        />

        {/* Check mark - appears when validator completes, stays until cycle resets */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: [0, 1.2, 1, 1, 1, 0],
            opacity: [0, 1, 1, 1, 1, 0],
          }}
          transition={{
            duration: CYCLE_DURATION + RESET_PAUSE - (index * PULSE_DURATION),
            delay: FLOW_DELAY + (index * PULSE_DURATION) + 0.3,
            repeat: Infinity,
            repeatDelay: index * PULSE_DURATION,
            times: [0, 0.05, 0.1, 0.8, 0.95, 1],
          }}
          style={{
            position: 'absolute',
            top: '4px',
            right: '4px',
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.95)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: validator.color,
          }}
        >
          <Check size={10} strokeWidth={3} />
        </motion.div>
      </motion.div>

      {/* Horizontal connectors for linear flow within rows */}
      <HorizontalConnector index={index} />
    </div>
  )
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const ValidatorGrid: React.FC = () => {
  return (
    <div style={{
      background: ABYSS[800],
      borderRadius: RADIUS.lg,
      padding: '24px',
    }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '20px',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '12px',
          color: ABYSS[400],
        }}
      >
        <motion.span
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: DEEP_CURRENT[400],
          }}
        />
        Sequential validation (fails fast):
      </motion.div>

      {/* Row 1: typecheck → lint → validate:tokens → validate:readme */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '48px',
      }}>
        {validators.slice(0, 4).map((validator, index) => (
          <ValidatorNode
            key={validator.id}
            validator={validator}
            index={index}
          />
        ))}
      </div>

      {/* Spacer between rows */}
      <div style={{ height: '24px' }} />

      {/* Row 2: validate-context → validate:agents → validate:version → validate:prompts */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '48px',
      }}>
        {validators.slice(4, 8).map((validator, index) => (
          <ValidatorNode
            key={validator.id}
            validator={validator}
            index={index + 4}
          />
        ))}
      </div>

      {/* Footer legend */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        style={{
          marginTop: '24px',
          paddingTop: '16px',
          borderTop: `1px solid ${ABYSS[700]}`,
          display: 'flex',
          justifyContent: 'center',
          gap: '24px',
          fontSize: '11px',
          fontFamily: 'JetBrains Mono, monospace',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: DEEP_CURRENT[700] }} />
          <span style={{ color: ABYSS[400] }}>TypeScript</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: HARBOR[700] }} />
          <span style={{ color: ABYSS[400] }}>Documentation</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: DUSK_REEF[600] }} />
          <span style={{ color: ABYSS[400] }}>Agent Context</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: CORAL[600] }} />
          <span style={{ color: ABYSS[400] }}>Versioning</span>
        </div>
      </motion.div>
    </div>
  )
}

export default ValidatorGrid
