/**
 * Intention Playground - Revolutionary Agentic UI Demo
 *
 * Demonstrates the core paradigm shift:
 * SAME intention → DRAMATICALLY DIFFERENT forms based on constraints
 *
 * Uses EHS Copilot styling patterns:
 * - Gradient headers and cards
 * - 2px solid borders with radius tokens
 * - DDS color tokens (ABYSS, DEEP_CURRENT, CORAL, HARBOR, etc.)
 * - Lucide React icons (no emojis)
 * - Motion animations
 */

import type { Meta, StoryObj } from '@storybook/react'
import * as React from 'react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  ABYSS,
  DEEP_CURRENT,
  DUSK_REEF,
  CORAL,
  HARBOR,
  WAVE,
  SLATE,
  PRIMITIVES,
  RADIUS,
  SHADOWS,
} from '../../constants/designTokens'
import {
  AlertTriangle,
  AlertCircle,
  Info,
  XOctagon,
  Check,
  Monitor,
  Smartphone,
  Tablet,
  Minimize2,
  Maximize2,
  Grid3X3,
  Eye,
  Sparkles,
  Layers,
  RefreshCw,
  ChevronRight,
  Settings2,
  Wand2,
} from 'lucide-react'
import { ORGANISM_META, organismDescription } from '../_infrastructure'

// =============================================================================
// TYPES
// =============================================================================

interface Intention {
  action: 'choose-one' | 'choose-many' | 'provide-text' | 'confirm'
  subject: {
    type: string
    label: string
    options?: Array<{ value: string; label: string; description?: string }>
  }
  purpose: 'request' | 'alert' | 'inform'
}

interface Constraints {
  device: 'desktop' | 'mobile' | 'tablet'
  density: 'comfortable' | 'compact' | 'spacious'
  urgency: 'normal' | 'high' | 'critical'
  accessibility: {
    screenReader: boolean
    highContrast: boolean
    reducedMotion: boolean
  }
}

// =============================================================================
// SEVERITY CONFIGURATION (DDS Native Palette)
// =============================================================================

/**
 * DDS-native severity colors:
 * - Low: WAVE (light blue) - calm, informational
 * - Medium: HARBOR (blue) - attention needed
 * - High: DUSK_REEF (purple) - elevated priority
 * - Critical: CORAL (red) - danger/emergency
 *
 * This avoids traffic-light colors (yellow) that aren't part of DDS core palette.
 */
const severityConfig = {
  low: {
    label: 'Low',
    icon: <Info className="w-4 h-4" />,
    color: WAVE[600],
    bgColor: WAVE[500],
    lightBg: WAVE[50],
    borderColor: WAVE[300],
    description: 'Minor, no immediate action',
  },
  medium: {
    label: 'Medium',
    icon: <AlertCircle className="w-4 h-4" />,
    color: HARBOR[600],
    bgColor: HARBOR[500],
    lightBg: HARBOR[50],
    borderColor: HARBOR[300],
    description: 'Requires attention soon',
  },
  high: {
    label: 'High',
    icon: <AlertTriangle className="w-4 h-4" />,
    color: DUSK_REEF[600],
    bgColor: DUSK_REEF[500],
    lightBg: DUSK_REEF[50],
    borderColor: DUSK_REEF[300],
    description: 'Urgent, immediate attention',
  },
  critical: {
    label: 'Critical',
    icon: <XOctagon className="w-4 h-4" />,
    color: CORAL[700],
    bgColor: CORAL[600],
    lightBg: CORAL[100],
    borderColor: CORAL[500],
    description: 'Emergency, stop work',
  },
}

// =============================================================================
// TOKEN GRAMMAR - How tokens combine based on constraints
// =============================================================================

const getTokenGrammar = (constraints: Constraints) => {
  const { device, density, urgency } = constraints

  return {
    // Layout
    direction: device === 'mobile' ? 'column' : 'row',
    gap: density === 'compact' ? '8px' : density === 'spacious' ? '20px' : '12px',
    padding: density === 'compact' ? '12px' : density === 'spacious' ? '24px' : '16px',
    itemPadding: density === 'compact' ? '10px 14px' : density === 'spacious' ? '20px 24px' : '14px 18px',

    // Sizing
    itemMinHeight: device === 'mobile' ? '72px' : density === 'compact' ? '44px' : '56px',
    itemMinWidth: device === 'mobile' ? '100%' : density === 'compact' ? 'auto' : '180px',

    // Radius
    containerRadius: device === 'mobile' ? RADIUS.lg : RADIUS.md,
    itemRadius: device === 'mobile' ? RADIUS.md : density === 'compact' ? RADIUS.xs : RADIUS.sm,

    // Colors based on urgency
    containerBg: urgency === 'critical' ? CORAL[50] : urgency === 'high' ? DUSK_REEF[50] : PRIMITIVES.white,
    containerBorder: urgency === 'critical' ? CORAL[400] : urgency === 'high' ? DUSK_REEF[400] : SLATE[300],
    itemBg: urgency === 'critical' ? PRIMITIVES.white : SLATE[50],
    itemBorder: urgency === 'critical' ? CORAL[200] : SLATE[200],
    accentColor: urgency === 'critical' ? CORAL[500] : urgency === 'high' ? DUSK_REEF[600] : DEEP_CURRENT[500],
    textColor: ABYSS[700],
    mutedColor: ABYSS[500],

    // Shadows
    containerShadow: density === 'compact' ? 'none' : SHADOWS.md,
    itemShadow: density === 'compact' ? 'none' : SHADOWS.sm,
  }
}

// =============================================================================
// MANIFESTATION COMPONENT - Renders UI based on constraints
// =============================================================================

interface ManifestationProps {
  intention: Intention
  constraints: Constraints
  selectedValue: string | null
  onSelect: (value: string) => void
}

function Manifestation({ intention, constraints, selectedValue, onSelect }: ManifestationProps) {
  const grammar = getTokenGrammar(constraints)
  const options = intention.subject.options || []
  const { device, density, urgency } = constraints

  // ==========================================================================
  // MOBILE MANIFESTATION - Large touch-friendly cards
  // ==========================================================================
  if (device === 'mobile') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: grammar.gap,
          padding: grammar.padding,
          backgroundColor: grammar.containerBg,
          borderRadius: grammar.containerRadius,
          border: `2px solid ${grammar.containerBorder}`,
          boxShadow: grammar.containerShadow,
        }}
        role="radiogroup"
        aria-label={intention.subject.label}
      >
        {/* Header */}
        <div
          style={{
            padding: '12px 16px',
            background: `linear-gradient(135deg, ${DEEP_CURRENT[50]} 0%, ${WAVE[50]} 100%)`,
            borderRadius: RADIUS.sm,
            borderBottom: `2px solid ${DEEP_CURRENT[200]}`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: RADIUS.sm,
                backgroundColor: DEEP_CURRENT[100],
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: DEEP_CURRENT[700],
              }}
            >
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div style={{ fontWeight: 700, color: ABYSS[800], fontSize: '15px' }}>
                {intention.subject.label}
              </div>
              <div style={{ fontSize: '12px', color: DUSK_REEF[500] }}>
                Mobile Touch Mode
              </div>
            </div>
          </div>
        </div>

        {/* Options */}
        {options.map((option) => {
          const isSelected = selectedValue === option.value
          const config = severityConfig[option.value as keyof typeof severityConfig]

          return (
            <motion.button
              key={option.value}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(option.value)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: grammar.itemPadding,
                minHeight: grammar.itemMinHeight,
                backgroundColor: isSelected ? config?.lightBg || DEEP_CURRENT[50] : grammar.itemBg,
                border: `2px solid ${isSelected ? config?.borderColor || DEEP_CURRENT[400] : grammar.itemBorder}`,
                borderRadius: grammar.itemRadius,
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
                boxShadow: isSelected ? `0 4px 12px ${config?.bgColor || DEEP_CURRENT[500]}30` : grammar.itemShadow,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {isSelected && (
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: '4px',
                    backgroundColor: config?.bgColor || DEEP_CURRENT[500],
                    borderRadius: `${RADIUS.sm} 0 0 ${RADIUS.sm}`,
                  }}
                />
              )}
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: RADIUS.md,
                  backgroundColor: isSelected ? config?.bgColor || DEEP_CURRENT[700] : SLATE[100],
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isSelected ? PRIMITIVES.white : ABYSS[500],
                  flexShrink: 0,
                }}
              >
                {config?.icon || <AlertCircle className="w-6 h-6" />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: isSelected ? config?.color || DEEP_CURRENT[700] : ABYSS[700], fontSize: '16px' }}>
                  {option.label}
                </div>
                {option.description && (
                  <div style={{ fontSize: '13px', color: isSelected ? config?.color || DEEP_CURRENT[600] : ABYSS[500], marginTop: '2px' }}>
                    {option.description}
                  </div>
                )}
              </div>
              {isSelected && (
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: config?.bgColor || DEEP_CURRENT[700],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Check className="w-4 h-4" style={{ color: PRIMITIVES.white }} />
                </div>
              )}
            </motion.button>
          )
        })}
      </motion.div>
    )
  }

  // ==========================================================================
  // COMPACT MANIFESTATION - Inline pill chips
  // ==========================================================================
  if (density === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          padding: grammar.padding,
          backgroundColor: grammar.containerBg,
          borderRadius: grammar.containerRadius,
          border: `2px solid ${grammar.containerBorder}`,
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Minimize2 className="w-4 h-4" style={{ color: DUSK_REEF[500] }} />
          <span style={{ fontSize: '13px', fontWeight: 600, color: ABYSS[700] }}>
            {intention.subject.label}
          </span>
          <span
            style={{
              fontSize: '10px',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: RADIUS.xs,
              backgroundColor: DUSK_REEF[100],
              color: DUSK_REEF[600],
            }}
          >
            COMPACT
          </span>
        </div>

        {/* Pill Options */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: grammar.gap }}>
          {options.map((option) => {
            const isSelected = selectedValue === option.value
            const config = severityConfig[option.value as keyof typeof severityConfig]

            return (
              <motion.button
                key={option.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelect(option.value)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  backgroundColor: isSelected ? config?.bgColor || DEEP_CURRENT[700] : PRIMITIVES.white,
                  color: isSelected ? PRIMITIVES.white : config?.color || ABYSS[600],
                  border: `1px solid ${isSelected ? config?.bgColor || DEEP_CURRENT[700] : config?.borderColor || SLATE[300]}`,
                  borderRadius: RADIUS.full,
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 600,
                }}
              >
                {config?.icon}
                {option.label}
                {isSelected && <Check className="w-3 h-3" />}
              </motion.button>
            )
          })}
        </div>
      </motion.div>
    )
  }

  // ==========================================================================
  // CRITICAL URGENCY MANIFESTATION - Pulsing alert
  // ==========================================================================
  if (urgency === 'critical') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: grammar.gap,
          padding: grammar.padding,
          backgroundColor: grammar.containerBg,
          borderRadius: grammar.containerRadius,
          border: `3px solid ${grammar.containerBorder}`,
          boxShadow: `0 0 0 4px ${CORAL[100]}, ${SHADOWS.lg}`,
          position: 'relative',
        }}
      >
        {/* Alert Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '14px 18px',
            background: `linear-gradient(135deg, ${CORAL[600]} 0%, ${CORAL[700]} 100%)`,
            borderRadius: RADIUS.sm,
            color: PRIMITIVES.white,
          }}
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <XOctagon className="w-6 h-6" />
          </motion.div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '15px' }}>CRITICAL: {intention.subject.label}</div>
            <div style={{ fontSize: '12px', opacity: 0.9 }}>Immediate response required</div>
          </div>
        </div>

        {/* Options Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: grammar.gap }}>
          {options.map((option) => {
            const isSelected = selectedValue === option.value
            const config = severityConfig[option.value as keyof typeof severityConfig]

            return (
              <motion.button
                key={option.value}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelect(option.value)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '18px',
                  backgroundColor: isSelected ? config?.lightBg || CORAL[100] : PRIMITIVES.white,
                  border: `2px solid ${isSelected ? config?.bgColor || CORAL[500] : SLATE[200]}`,
                  borderRadius: RADIUS.sm,
                  cursor: 'pointer',
                  boxShadow: isSelected ? `0 4px 16px ${config?.bgColor || CORAL[500]}40` : 'none',
                }}
              >
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: RADIUS.md,
                    backgroundColor: isSelected ? config?.bgColor || CORAL[700] : SLATE[100],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isSelected ? PRIMITIVES.white : config?.color || ABYSS[500],
                  }}
                >
                  {config?.icon || <AlertCircle className="w-5 h-5" />}
                </div>
                <div style={{ fontWeight: 600, fontSize: '14px', color: isSelected ? config?.color || CORAL[700] : ABYSS[700] }}>
                  {option.label}
                </div>
              </motion.button>
            )
          })}
        </div>
      </motion.div>
    )
  }

  // ==========================================================================
  // DEFAULT DESKTOP MANIFESTATION - Horizontal cards
  // ==========================================================================
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: grammar.gap,
        padding: grammar.padding,
        backgroundColor: grammar.containerBg,
        borderRadius: grammar.containerRadius,
        border: `2px solid ${grammar.containerBorder}`,
        boxShadow: grammar.containerShadow,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 18px',
          background: `linear-gradient(135deg, ${DEEP_CURRENT[50]} 0%, ${WAVE[50]} 100%)`,
          borderRadius: RADIUS.sm,
          borderBottom: `2px solid ${DEEP_CURRENT[200]}`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: RADIUS.sm,
              backgroundColor: DEEP_CURRENT[100],
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: DEEP_CURRENT[700],
            }}
          >
            <Monitor className="w-5 h-5" />
          </div>
          <div>
            <div style={{ fontWeight: 700, color: ABYSS[800], fontSize: '15px' }}>
              {intention.subject.label}
            </div>
            <div style={{ fontSize: '12px', color: DUSK_REEF[500] }}>
              Desktop View - Select one option
            </div>
          </div>
        </div>
        <div
          style={{
            fontSize: '11px',
            fontWeight: 700,
            padding: '4px 10px',
            borderRadius: RADIUS.xs,
            backgroundColor: HARBOR[100],
            color: HARBOR[700],
          }}
        >
          DESKTOP
        </div>
      </div>

      {/* Horizontal Options */}
      <div style={{ display: 'flex', flexDirection: grammar.direction as 'row' | 'column', gap: grammar.gap }}>
        {options.map((option) => {
          const isSelected = selectedValue === option.value
          const config = severityConfig[option.value as keyof typeof severityConfig]

          return (
            <motion.button
              key={option.value}
              whileHover={{ y: -3, boxShadow: SHADOWS.lg }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(option.value)}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
                padding: grammar.itemPadding,
                minHeight: grammar.itemMinHeight,
                minWidth: grammar.itemMinWidth,
                backgroundColor: isSelected ? config?.lightBg || DEEP_CURRENT[50] : grammar.itemBg,
                border: `2px solid ${isSelected ? config?.bgColor || DEEP_CURRENT[500] : grammar.itemBorder}`,
                borderRadius: grammar.itemRadius,
                cursor: 'pointer',
                boxShadow: isSelected ? `0 4px 16px ${config?.bgColor || DEEP_CURRENT[500]}30` : grammar.itemShadow,
                transition: 'all 0.2s ease',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: RADIUS.md,
                  backgroundColor: isSelected ? config?.bgColor || DEEP_CURRENT[700] : SLATE[100],
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isSelected ? PRIMITIVES.white : config?.color || ABYSS[500],
                  boxShadow: isSelected ? `0 4px 12px ${config?.bgColor || DEEP_CURRENT[700]}40` : 'none',
                }}
              >
                {config?.icon || <AlertCircle className="w-6 h-6" />}
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 700, fontSize: '14px', color: isSelected ? config?.color || DEEP_CURRENT[700] : ABYSS[700] }}>
                  {option.label}
                </div>
                {option.description && (
                  <div style={{ fontSize: '12px', color: isSelected ? config?.color || DEEP_CURRENT[600] : ABYSS[500], marginTop: '4px' }}>
                    {option.description}
                  </div>
                )}
              </div>
              {isSelected && (
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: config?.bgColor || DEEP_CURRENT[700],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Check className="w-3.5 h-3.5" style={{ color: PRIMITIVES.white }} />
                </div>
              )}
            </motion.button>
          )
        })}
      </div>
    </motion.div>
  )
}

// =============================================================================
// CONSTRAINT TOGGLE PANEL
// =============================================================================

interface ConstraintPanelProps {
  constraints: Constraints
  onChange: (constraints: Constraints) => void
}

function ConstraintPanel({ constraints, onChange }: ConstraintPanelProps) {
  const deviceOptions = [
    { value: 'desktop', label: 'Desktop', icon: <Monitor className="w-4 h-4" /> },
    { value: 'mobile', label: 'Mobile', icon: <Smartphone className="w-4 h-4" /> },
    { value: 'tablet', label: 'Tablet', icon: <Tablet className="w-4 h-4" /> },
  ]

  const densityOptions = [
    { value: 'compact', label: 'Compact', icon: <Minimize2 className="w-4 h-4" /> },
    { value: 'comfortable', label: 'Comfortable', icon: <Grid3X3 className="w-4 h-4" /> },
    { value: 'spacious', label: 'Spacious', icon: <Maximize2 className="w-4 h-4" /> },
  ]

  const urgencyOptions = [
    { value: 'normal', label: 'Normal', icon: <Info className="w-4 h-4" />, color: WAVE[500] },
    { value: 'high', label: 'High', icon: <AlertTriangle className="w-4 h-4" />, color: DUSK_REEF[500] },
    { value: 'critical', label: 'Critical', icon: <XOctagon className="w-4 h-4" />, color: CORAL[500] },
  ]

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        padding: '20px',
        backgroundColor: PRIMITIVES.white,
        borderRadius: RADIUS.md,
        border: `2px solid ${SLATE[200]}`,
        boxShadow: SHADOWS.sm,
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Settings2 className="w-5 h-5" style={{ color: DUSK_REEF[500] }} />
        <span style={{ fontWeight: 700, color: ABYSS[800] }}>Constraints</span>
        <span style={{ fontSize: '12px', color: ABYSS[500] }}>Toggle to transform UI</span>
      </div>

      {/* Device */}
      <div>
        <div style={{ fontSize: '12px', fontWeight: 600, color: ABYSS[600], marginBottom: '8px' }}>
          DEVICE
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {deviceOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onChange({ ...constraints, device: opt.value as Constraints['device'] })}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '10px 14px',
                backgroundColor: constraints.device === opt.value ? DEEP_CURRENT[700] : SLATE[50],
                color: constraints.device === opt.value ? PRIMITIVES.white : ABYSS[600],
                border: `1px solid ${constraints.device === opt.value ? DEEP_CURRENT[700] : SLATE[300]}`,
                borderRadius: RADIUS.sm,
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 600,
              }}
            >
              {opt.icon}
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Density */}
      <div>
        <div style={{ fontSize: '12px', fontWeight: 600, color: ABYSS[600], marginBottom: '8px' }}>
          DENSITY
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {densityOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onChange({ ...constraints, density: opt.value as Constraints['density'] })}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '10px 14px',
                backgroundColor: constraints.density === opt.value ? HARBOR[500] : SLATE[50],
                color: constraints.density === opt.value ? PRIMITIVES.white : ABYSS[600],
                border: `1px solid ${constraints.density === opt.value ? HARBOR[500] : SLATE[300]}`,
                borderRadius: RADIUS.sm,
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 600,
              }}
            >
              {opt.icon}
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Urgency */}
      <div>
        <div style={{ fontSize: '12px', fontWeight: 600, color: ABYSS[600], marginBottom: '8px' }}>
          URGENCY
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {urgencyOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onChange({ ...constraints, urgency: opt.value as Constraints['urgency'] })}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '10px 14px',
                backgroundColor: constraints.urgency === opt.value ? opt.color : SLATE[50],
                color: constraints.urgency === opt.value ? PRIMITIVES.white : ABYSS[600],
                border: `1px solid ${constraints.urgency === opt.value ? opt.color : SLATE[300]}`,
                borderRadius: RADIUS.sm,
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 600,
              }}
            >
              {opt.icon}
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// MAIN PLAYGROUND COMPONENT
// =============================================================================

function IntentionPlayground() {
  const [constraints, setConstraints] = useState<Constraints>({
    device: 'desktop',
    density: 'comfortable',
    urgency: 'normal',
    accessibility: {
      screenReader: false,
      highContrast: false,
      reducedMotion: false,
    },
  })

  const [selectedValue, setSelectedValue] = useState<string | null>('medium')

  const intention: Intention = {
    action: 'choose-one',
    subject: {
      type: 'severity',
      label: 'Issue Severity',
      options: [
        { value: 'low', label: 'Low', description: 'Minor, no immediate action' },
        { value: 'medium', label: 'Medium', description: 'Requires attention soon' },
        { value: 'high', label: 'High', description: 'Urgent, immediate attention' },
        { value: 'critical', label: 'Critical', description: 'Emergency, stop work' },
      ],
    },
    purpose: 'request',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '900px' }}>
      {/* Hero Header */}
      <div
        style={{
          padding: '24px',
          background: `linear-gradient(135deg, ${ABYSS[700]} 0%, ${DEEP_CURRENT[600]} 100%)`,
          borderRadius: RADIUS.lg,
          color: PRIMITIVES.white,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: RADIUS.md,
              backgroundColor: 'rgba(255,255,255,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Wand2 className="w-6 h-6" />
          </div>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>Intention Playground</h1>
            <p style={{ fontSize: '14px', opacity: 0.85, margin: 0 }}>
              Same intention, different constraints = different UI
            </p>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            padding: '12px 16px',
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderRadius: RADIUS.sm,
            fontSize: '13px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Eye className="w-4 h-4" />
            <span>Toggle constraints below</span>
          </div>
          <ChevronRight className="w-4 h-4" />
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <RefreshCw className="w-4 h-4" />
            <span>Watch the UI transform</span>
          </div>
          <ChevronRight className="w-4 h-4" />
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles className="w-4 h-4" />
            <span>Form emerges from constraints</span>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '24px' }}>
        {/* Left: Controls */}
        <ConstraintPanel constraints={constraints} onChange={setConstraints} />

        {/* Right: Manifestation */}
        <div>
          <AnimatePresence mode="wait">
            <Manifestation
              key={`${constraints.device}-${constraints.density}-${constraints.urgency}`}
              intention={intention}
              constraints={constraints}
              selectedValue={selectedValue}
              onSelect={setSelectedValue}
            />
          </AnimatePresence>
        </div>
      </div>

      {/* Current State Display */}
      <div
        style={{
          padding: '16px 20px',
          backgroundColor: SLATE[50],
          borderRadius: RADIUS.md,
          border: `1px solid ${SLATE[200]}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '13px' }}>
          <span style={{ color: ABYSS[500] }}>Current:</span>
          <span
            style={{
              padding: '4px 10px',
              backgroundColor: DEEP_CURRENT[100],
              color: DEEP_CURRENT[700],
              borderRadius: RADIUS.xs,
              fontWeight: 600,
            }}
          >
            {constraints.device}
          </span>
          <span
            style={{
              padding: '4px 10px',
              backgroundColor: HARBOR[100],
              color: HARBOR[700],
              borderRadius: RADIUS.xs,
              fontWeight: 600,
            }}
          >
            {constraints.density}
          </span>
          <span
            style={{
              padding: '4px 10px',
              backgroundColor: constraints.urgency === 'critical' ? CORAL[100] : constraints.urgency === 'high' ? DUSK_REEF[100] : WAVE[100],
              color: constraints.urgency === 'critical' ? CORAL[700] : constraints.urgency === 'high' ? DUSK_REEF[700] : WAVE[700],
              borderRadius: RADIUS.xs,
              fontWeight: 600,
            }}
          >
            {constraints.urgency}
          </span>
        </div>
        <div style={{ fontSize: '13px', color: ABYSS[500] }}>
          Selected: <strong style={{ color: ABYSS[700] }}>{selectedValue || 'None'}</strong>
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// SIDE BY SIDE COMPARISON
// =============================================================================

function SideBySideComparison() {
  const [selectedValue, setSelectedValue] = useState<string | null>('medium')

  const intention: Intention = {
    action: 'choose-one',
    subject: {
      type: 'severity',
      label: 'Issue Severity',
      options: [
        { value: 'low', label: 'Low', description: 'Minor issue' },
        { value: 'medium', label: 'Medium', description: 'Needs attention' },
        { value: 'high', label: 'High', description: 'Urgent' },
        { value: 'critical', label: 'Critical', description: 'Emergency' },
      ],
    },
    purpose: 'request',
  }

  const constraintVariants: Array<{ label: string; constraints: Constraints; icon: React.ReactNode }> = [
    {
      label: 'Desktop',
      icon: <Monitor className="w-4 h-4" />,
      constraints: {
        device: 'desktop',
        density: 'comfortable',
        urgency: 'normal',
        accessibility: { screenReader: false, highContrast: false, reducedMotion: false },
      },
    },
    {
      label: 'Mobile',
      icon: <Smartphone className="w-4 h-4" />,
      constraints: {
        device: 'mobile',
        density: 'comfortable',
        urgency: 'normal',
        accessibility: { screenReader: false, highContrast: false, reducedMotion: false },
      },
    },
    {
      label: 'Compact',
      icon: <Minimize2 className="w-4 h-4" />,
      constraints: {
        device: 'desktop',
        density: 'compact',
        urgency: 'normal',
        accessibility: { screenReader: false, highContrast: false, reducedMotion: false },
      },
    },
    {
      label: 'Critical',
      icon: <XOctagon className="w-4 h-4" />,
      constraints: {
        device: 'desktop',
        density: 'comfortable',
        urgency: 'critical',
        accessibility: { screenReader: false, highContrast: false, reducedMotion: false },
      },
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div
        style={{
          padding: '20px 24px',
          background: `linear-gradient(135deg, ${DUSK_REEF[600]} 0%, ${ABYSS[700]} 100%)`,
          borderRadius: RADIUS.lg,
          color: PRIMITIVES.white,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Layers className="w-6 h-6" />
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>Side-by-Side Comparison</h2>
            <p style={{ fontSize: '13px', opacity: 0.85, margin: 0 }}>
              Same intention, 4 different constraint combinations
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Manifestations */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
        {constraintVariants.map((variant) => (
          <div key={variant.label} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {/* Label */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                backgroundColor: SLATE[100],
                borderRadius: RADIUS.xs,
              }}
            >
              {variant.icon}
              <span style={{ fontSize: '13px', fontWeight: 600, color: ABYSS[700] }}>
                {variant.label}
              </span>
            </div>
            {/* Manifestation */}
            <Manifestation
              intention={intention}
              constraints={variant.constraints}
              selectedValue={selectedValue}
              onSelect={setSelectedValue}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

// =============================================================================
// STORYBOOK META & STORIES
// =============================================================================

const meta: Meta = {
  title: 'Agentic UI/Intention Playground',
  ...ORGANISM_META,
  parameters: {
    ...ORGANISM_META.parameters,
    layout: 'padded',
    docs: {
      description: {
        component: organismDescription(
          `The Intention Playground demonstrates the revolutionary Agentic UI paradigm.

## The Paradigm Shift
- **Old**: Agent selects components ("render a RadioGroup")
- **New**: Agent expresses intentions ("user needs to choose severity")

## How It Works
Toggle constraints and watch the UI transform:
- **Device**: Desktop vs Mobile vs Tablet
- **Density**: Compact vs Comfortable vs Spacious
- **Urgency**: Normal vs High vs Critical

## Key Insight
The same intention resolves to dramatically different forms based on context.
No code change required - constraints shape the manifestation.`
        ),
      },
    },
  },
}

export default meta

export const Default: StoryObj = {
  name: 'Interactive Playground',
  render: () => <IntentionPlayground />,
}

export const SideBySide: StoryObj = {
  name: 'Side-by-Side Comparison',
  render: () => <SideBySideComparison />,
}
