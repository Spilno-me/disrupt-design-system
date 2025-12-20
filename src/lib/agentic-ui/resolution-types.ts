/**
 * Resolution Types - The Outcome of Intent + Constraints
 *
 * A Resolution is what emerges when an Intention passes through
 * the constraint filter. It describes HOW to manifest the intention
 * without naming specific components.
 *
 * The Resolution Engine produces Resolutions which are then
 * rendered by the Manifest Layer.
 */

import type { Intention, IntentionAction } from './intention-types'
import type { ConstraintSet } from './constraint-types'

// =============================================================================
// PATTERN TYPES
// High-level categories of manifestation
// =============================================================================

/**
 * Patterns describe the general form of a resolution.
 * These are the "archetypes" that can manifest in many ways.
 */
export type ResolutionPattern =
  | 'selection'     // User chooses from options
  | 'input'         // User provides data
  | 'display'       // Information shown to user
  | 'action'        // User triggers something
  | 'flow'          // Multi-step progression
  | 'feedback'      // System communicates state

// =============================================================================
// MANIFESTATION TRAITS
// Characteristics of how the resolution behaves
// =============================================================================

/**
 * Behavioral traits that any resolution can have
 */
export interface ManifestationTraits {
  // --- Interaction ---
  /** Can user interact with it? */
  interactive: boolean
  /** Can receive focus? */
  focusable: boolean
  /** Can be dismissed/closed? */
  dismissable: boolean

  // --- Visual Weight ---
  /** Appears above surface (shadow, elevation) */
  elevated: boolean
  /** Has visual boundary (border, card) */
  contained: boolean
  /** Visually emphasized (color, size) */
  emphasized: boolean

  // --- Semantic ---
  /** ARIA role for accessibility */
  role: AriaRole
  /** Live region for screen readers */
  liveRegion?: 'polite' | 'assertive' | 'off'
}

/**
 * Common ARIA roles for manifestations
 */
export type AriaRole =
  | 'button'
  | 'checkbox'
  | 'dialog'
  | 'alert'
  | 'alertdialog'
  | 'form'
  | 'group'
  | 'listbox'
  | 'menu'
  | 'menuitem'
  | 'option'
  | 'progressbar'
  | 'radio'
  | 'radiogroup'
  | 'region'
  | 'status'
  | 'tablist'
  | 'tab'
  | 'tabpanel'
  | 'textbox'
  | 'combobox'
  | 'none'
  | 'presentation'

// =============================================================================
// RENDER INSTRUCTIONS
// How to actually render the resolution
// =============================================================================

/**
 * CSS properties derived from DDS tokens
 */
export interface TokenizedStyles {
  // Colors
  backgroundColor?: string
  color?: string
  borderColor?: string

  // Spacing
  padding?: string
  margin?: string
  gap?: string

  // Typography
  fontSize?: string
  fontWeight?: string | number
  fontFamily?: string
  lineHeight?: string | number

  // Layout
  display?: string
  flexDirection?: 'row' | 'column'
  alignItems?: string
  justifyContent?: string

  // Shape
  borderRadius?: string
  borderWidth?: string
  borderStyle?: string

  // Effects
  boxShadow?: string
  opacity?: number
  transition?: string

  // Sizing
  minHeight?: string
  minWidth?: string
  maxWidth?: string

  // Position
  position?: 'relative' | 'absolute' | 'fixed' | 'sticky'
  zIndex?: number

  // Cursor
  cursor?: string
}

/**
 * Instructions for rendering the resolution
 */
export interface RenderInstructions {
  /** Base tokenized styles */
  styles: TokenizedStyles

  /** State-specific style overrides */
  states: {
    hover?: Partial<TokenizedStyles>
    focus?: Partial<TokenizedStyles>
    active?: Partial<TokenizedStyles>
    disabled?: Partial<TokenizedStyles>
    selected?: Partial<TokenizedStyles>
  }

  /** Tailwind classes to apply (for DDS integration) */
  classNames: string[]

  /** ARIA attributes */
  aria: Record<string, string | boolean | number | undefined>

  /** Data attributes for styling/testing */
  dataAttributes: Record<string, string>

  /** Animation settings */
  animation?: {
    enter?: string
    exit?: string
    duration?: number
  }
}

// =============================================================================
// THE RESOLUTION
// Complete resolution structure
// =============================================================================

/**
 * Resolution reasoning explains WHY this form was chosen
 */
export interface ResolutionReasoning {
  /** The constraints that most influenced this resolution */
  dominantConstraints: string[]

  /** Pattern alternatives that were considered */
  consideredPatterns: ResolutionPattern[]

  /** Score that led to this selection (higher = better fit) */
  confidence: number

  /** Human-readable explanation */
  explanation: string
}

/**
 * A Manifestation is the concrete form that will be rendered
 */
export interface Manifestation {
  /** Pattern category */
  pattern: ResolutionPattern

  /** Behavioral traits */
  traits: ManifestationTraits

  /** Render instructions */
  render: RenderInstructions
}

/**
 * A Resolution is the complete output of the Resolution Engine.
 * It contains everything needed to render the intention.
 */
export interface Resolution {
  /** The resolved manifestation */
  manifestation: Manifestation

  /** Why this form was chosen (for debugging) */
  reasoning: ResolutionReasoning

  /** Alternative manifestations that could work */
  alternatives: Manifestation[]

  /** The original intention (for reference) */
  sourceIntention: Intention

  /** The constraints used (for reference) */
  appliedConstraints: ConstraintSet

  /** Unique ID for this resolution */
  id: string

  /** Timestamp of resolution */
  timestamp: number
}

// =============================================================================
// RESOLUTION TEMPLATES
// Pre-defined manifestation templates for common patterns
// =============================================================================

/**
 * Create default traits for a pattern
 */
export function createDefaultTraits(pattern: ResolutionPattern): ManifestationTraits {
  switch (pattern) {
    case 'selection':
      return {
        interactive: true,
        focusable: true,
        dismissable: false,
        elevated: false,
        contained: true,
        emphasized: false,
        role: 'radiogroup',
      }
    case 'input':
      return {
        interactive: true,
        focusable: true,
        dismissable: false,
        elevated: false,
        contained: true,
        emphasized: false,
        role: 'textbox',
      }
    case 'display':
      return {
        interactive: false,
        focusable: false,
        dismissable: false,
        elevated: false,
        contained: true,
        emphasized: false,
        role: 'region',
      }
    case 'action':
      return {
        interactive: true,
        focusable: true,
        dismissable: false,
        elevated: false,
        contained: true,
        emphasized: true,
        role: 'button',
      }
    case 'flow':
      return {
        interactive: true,
        focusable: true,
        dismissable: true,
        elevated: true,
        contained: true,
        emphasized: true,
        role: 'form',
      }
    case 'feedback':
      return {
        interactive: false,
        focusable: false,
        dismissable: true,
        elevated: true,
        contained: true,
        emphasized: true,
        role: 'alert',
        liveRegion: 'polite',
      }
  }
}

/**
 * Create empty render instructions
 */
export function createEmptyRenderInstructions(): RenderInstructions {
  return {
    styles: {},
    states: {},
    classNames: [],
    aria: {},
    dataAttributes: {},
  }
}

/**
 * Map intention action to expected pattern
 */
export function actionToPattern(action: IntentionAction): ResolutionPattern {
  switch (action) {
    case 'choose-one':
    case 'choose-many':
      return 'selection'
    case 'provide-text':
    case 'provide-data':
      return 'input'
    case 'review':
    case 'wait':
      return 'display'
    case 'confirm':
    case 'acknowledge':
    case 'navigate':
      return 'action'
    case 'alert':
      return 'feedback'
    default:
      return 'display'
  }
}

// =============================================================================
// RESOLUTION RESULT
// What the UI receives to render
// =============================================================================

/**
 * Simplified resolution result for rendering
 */
export interface ResolvedUI {
  /** Pattern being rendered */
  pattern: ResolutionPattern

  /** CSS class names to apply */
  className: string

  /** Inline styles (from tokens) */
  style: React.CSSProperties

  /** ARIA attributes */
  aria: Record<string, string | boolean | number | undefined>

  /** Data attributes */
  data: Record<string, string>

  /** Traits for conditional rendering */
  traits: ManifestationTraits

  /** Resolution ID for debugging */
  resolutionId: string
}

/**
 * Convert Resolution to ResolvedUI for rendering
 */
export function toResolvedUI(resolution: Resolution): ResolvedUI {
  const { manifestation } = resolution

  return {
    pattern: manifestation.pattern,
    className: manifestation.render.classNames.join(' '),
    style: manifestation.render.styles as React.CSSProperties,
    aria: manifestation.render.aria,
    data: manifestation.render.dataAttributes,
    traits: manifestation.traits,
    resolutionId: resolution.id,
  }
}
