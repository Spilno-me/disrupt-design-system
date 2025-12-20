/**
 * Constraint Types - The Boundaries That Shape Resolution
 *
 * Constraints define the context in which an intention must resolve.
 * They include device capabilities, accessibility requirements,
 * design system rules, and contextual state.
 *
 * The Resolution Engine uses constraints to narrow the possibility
 * space and select the optimal manifestation.
 */

import {
  ALIAS,
  RADIUS,
  SPACING,
  TYPOGRAPHY,
  SHADOWS,
  TRANSITIONS,
  Z_INDEX,
} from '../../constants/designTokens'

// =============================================================================
// DEVICE CONSTRAINTS
// Physical capabilities and characteristics of the device
// =============================================================================

export interface DeviceConstraints {
  /** Viewport category */
  viewport: 'mobile' | 'tablet' | 'desktop'

  /** Actual viewport dimensions (for fine-tuning) */
  dimensions?: {
    width: number
    height: number
  }

  /** Input capabilities */
  hasTouch: boolean
  hasMouse: boolean
  hasKeyboard: boolean

  /** Connection type (affects loading strategies) */
  connection?: 'slow' | 'fast' | 'offline'

  /** Device orientation */
  orientation?: 'portrait' | 'landscape'
}

// =============================================================================
// ACCESSIBILITY CONSTRAINTS
// User accessibility needs and preferences
// =============================================================================

export interface AccessibilityConstraints {
  /** Screen reader active */
  screenReader: boolean

  /** High contrast mode */
  highContrast: boolean

  /** Reduced motion preference */
  reducedMotion: boolean

  /** Larger text preference */
  largeText: boolean

  /** Voice control active */
  voiceControl: boolean

  /** Minimum WCAG level */
  wcagLevel: 'A' | 'AA' | 'AAA'
}

// =============================================================================
// DESIGN SYSTEM CONSTRAINTS
// DDS tokens and rules that govern visual output
// =============================================================================

/**
 * DDS Design Token Constraints
 * These are derived from the DDS design token system
 */
export interface DDSTokens {
  /** Color aliases for semantic usage */
  colors: typeof ALIAS

  /** Border radius scale */
  radius: typeof RADIUS

  /** Spacing scale */
  spacing: typeof SPACING

  /** Typography system */
  typography: typeof TYPOGRAPHY

  /** Shadow definitions */
  shadows: typeof SHADOWS

  /** Transition durations */
  transitions: typeof TRANSITIONS

  /** Z-index layers */
  zIndex: typeof Z_INDEX
}

/**
 * Design system constraints that affect resolution
 */
export interface DesignSystemConstraints {
  /** Full DDS tokens */
  tokens: DDSTokens

  /** Density preference */
  density: 'compact' | 'default' | 'spacious'

  /** Theme variant */
  theme: 'light' | 'dark'

  /** Brand variant (for multi-brand support) */
  brandVariant?: string
}

// =============================================================================
// CONTEXT CONSTRAINTS
// Current state and situational factors
// =============================================================================

export interface ContextConstraints {
  /** Where in the user journey */
  journeyPhase: 'onboarding' | 'active' | 'critical' | 'review'

  /** Urgency level affects visual emphasis */
  urgency: 'low' | 'medium' | 'high' | 'critical'

  /** Available space for the resolution */
  availableSpace: 'inline' | 'contained' | 'fullscreen'

  /** Nesting depth (affects styling) */
  nestingLevel: number

  /** Previous intentions in this flow (for context) */
  conversationHistory?: Array<{
    intentionId: string
    action: string
    resolvedValue?: unknown
  }>

  /** Current form state */
  formState?: Record<string, unknown>
}

// =============================================================================
// THE COMPLETE CONSTRAINT SET
// All constraints combined
// =============================================================================

/**
 * Complete set of constraints that shape intention resolution.
 * Every constraint narrows the possibility space.
 */
export interface ConstraintSet {
  /** Device capabilities */
  device: DeviceConstraints

  /** Accessibility requirements */
  accessibility: AccessibilityConstraints

  /** Design system tokens and rules */
  designSystem: DesignSystemConstraints

  /** Current context */
  context: ContextConstraints
}

// =============================================================================
// DEFAULT CONSTRAINTS
// Sensible defaults for common scenarios
// =============================================================================

/**
 * Create default device constraints
 */
export function createDefaultDeviceConstraints(): DeviceConstraints {
  // Detect from environment if available
  const isTouchDevice = typeof window !== 'undefined' && 'ontouchstart' in window
  const width = typeof window !== 'undefined' ? window.innerWidth : 1024

  return {
    viewport: width < 768 ? 'mobile' : width < 1024 ? 'tablet' : 'desktop',
    dimensions: { width, height: typeof window !== 'undefined' ? window.innerHeight : 768 },
    hasTouch: isTouchDevice,
    hasMouse: !isTouchDevice,
    hasKeyboard: true,
    connection: 'fast',
    orientation: width > (typeof window !== 'undefined' ? window.innerHeight : 768) ? 'landscape' : 'portrait',
  }
}

/**
 * Create default accessibility constraints
 */
export function createDefaultAccessibilityConstraints(): AccessibilityConstraints {
  // Detect from environment if available
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const prefersHighContrast =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-contrast: more)').matches

  return {
    screenReader: false, // Can't reliably detect
    highContrast: prefersHighContrast,
    reducedMotion: prefersReducedMotion,
    largeText: false,
    voiceControl: false,
    wcagLevel: 'AA', // Default to AA compliance
  }
}

/**
 * Create default DDS tokens
 */
export function createDefaultDDSTokens(): DDSTokens {
  return {
    colors: ALIAS,
    radius: RADIUS,
    spacing: SPACING,
    typography: TYPOGRAPHY,
    shadows: SHADOWS,
    transitions: TRANSITIONS,
    zIndex: Z_INDEX,
  }
}

/**
 * Create default design system constraints
 */
export function createDefaultDesignSystemConstraints(): DesignSystemConstraints {
  const prefersDark =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches

  return {
    tokens: createDefaultDDSTokens(),
    density: 'default',
    theme: prefersDark ? 'dark' : 'light',
  }
}

/**
 * Create default context constraints
 */
export function createDefaultContextConstraints(): ContextConstraints {
  return {
    journeyPhase: 'active',
    urgency: 'medium',
    availableSpace: 'contained',
    nestingLevel: 0,
  }
}

/**
 * Create a complete default constraint set
 */
export function createDefaultConstraints(): ConstraintSet {
  return {
    device: createDefaultDeviceConstraints(),
    accessibility: createDefaultAccessibilityConstraints(),
    designSystem: createDefaultDesignSystemConstraints(),
    context: createDefaultContextConstraints(),
  }
}

// =============================================================================
// CONSTRAINT MODIFIERS
// Helpers to create modified constraint sets
// =============================================================================

/**
 * Create mobile-specific constraints
 */
export function withMobileDevice(constraints: ConstraintSet): ConstraintSet {
  return {
    ...constraints,
    device: {
      ...constraints.device,
      viewport: 'mobile',
      hasTouch: true,
      hasMouse: false,
      dimensions: { width: 375, height: 667 },
    },
  }
}

/**
 * Create screen-reader-specific constraints
 */
export function withScreenReader(constraints: ConstraintSet): ConstraintSet {
  return {
    ...constraints,
    accessibility: {
      ...constraints.accessibility,
      screenReader: true,
      wcagLevel: 'AAA',
    },
  }
}

/**
 * Create high-urgency constraints
 */
export function withHighUrgency(constraints: ConstraintSet): ConstraintSet {
  return {
    ...constraints,
    context: {
      ...constraints.context,
      urgency: 'critical',
      journeyPhase: 'critical',
    },
  }
}

/**
 * Create compact density constraints
 */
export function withCompactDensity(constraints: ConstraintSet): ConstraintSet {
  return {
    ...constraints,
    designSystem: {
      ...constraints.designSystem,
      density: 'compact',
    },
  }
}

/**
 * Create dark theme constraints
 */
export function withDarkTheme(constraints: ConstraintSet): ConstraintSet {
  return {
    ...constraints,
    designSystem: {
      ...constraints.designSystem,
      theme: 'dark',
    },
  }
}

// =============================================================================
// CONSTRAINT SCORING
// Utilities for comparing constraint compatibility
// =============================================================================

/**
 * Calculate how "constrained" a constraint set is (higher = more specific)
 */
export function calculateConstraintSpecificity(constraints: ConstraintSet): number {
  let score = 0

  // Device specificity
  if (constraints.device.viewport === 'mobile') score += 2
  if (constraints.device.hasTouch) score += 1

  // Accessibility specificity
  if (constraints.accessibility.screenReader) score += 3
  if (constraints.accessibility.highContrast) score += 2
  if (constraints.accessibility.reducedMotion) score += 1
  if (constraints.accessibility.wcagLevel === 'AAA') score += 2

  // Context specificity
  if (constraints.context.urgency === 'critical') score += 3
  if (constraints.context.availableSpace === 'inline') score += 2
  if (constraints.context.nestingLevel > 0) score += constraints.context.nestingLevel

  return score
}
