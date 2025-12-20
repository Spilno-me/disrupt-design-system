/**
 * Affinity Rules - How Behaviors Combine
 *
 * Affinity Rules define which behavior combinations naturally
 * form specific patterns. They are the "chemistry" of UI -
 * when certain traits combine, specific forms emerge.
 *
 * This is NOT component selection. It's pattern emergence.
 */

import type { BehaviorTrait } from './behavior-primitives'
import type { ResolutionPattern, ManifestationTraits, AriaRole } from './resolution-types'
import type { IntentionAction } from './intention-types'
import type { ConstraintSet } from './constraint-types'

// =============================================================================
// AFFINITY RULE TYPES
// =============================================================================

/**
 * An Affinity Rule defines what pattern emerges from a set of traits
 */
export interface AffinityRule {
  /** Unique identifier for this rule */
  id: string

  /** Human-readable name */
  name: string

  /** Required traits for this rule to match */
  requiredTraits: BehaviorTrait[]

  /** Optional traits that enhance the pattern */
  optionalTraits?: BehaviorTrait[]

  /** Traits that prevent this rule from matching */
  excludedTraits?: BehaviorTrait[]

  /** The pattern that emerges */
  pattern: ResolutionPattern

  /** Traits to apply to the manifestation */
  manifestationTraits: Partial<ManifestationTraits>

  /** Priority when multiple rules match (higher = preferred) */
  priority: number

  /** Constraint conditions that affect this rule */
  constraintConditions?: {
    /** Only match on these viewports */
    viewports?: ('mobile' | 'tablet' | 'desktop')[]
    /** Only match with screen reader */
    screenReader?: boolean
    /** Only match at these urgency levels */
    urgency?: ('low' | 'medium' | 'high' | 'critical')[]
    /** Only match in these density modes */
    density?: ('compact' | 'default' | 'spacious')[]
  }
}

// =============================================================================
// AFFINITY RULE REGISTRY
// The rules that govern behavior combination
// =============================================================================

/**
 * All affinity rules in the system
 */
export const AFFINITY_RULES: AffinityRule[] = [
  // --- SELECTION PATTERNS ---
  {
    id: 'single-selection-radio',
    name: 'Single Selection (Radio Group)',
    requiredTraits: ['selectable', 'focusable'],
    excludedTraits: [],
    pattern: 'selection',
    manifestationTraits: {
      interactive: true,
      focusable: true,
      contained: true,
      role: 'radiogroup' as AriaRole,
    },
    priority: 10,
    constraintConditions: {
      viewports: ['desktop', 'tablet'],
    },
  },

  {
    id: 'single-selection-buttons',
    name: 'Single Selection (Button Group)',
    requiredTraits: ['selectable', 'clickable', 'focusable'],
    pattern: 'selection',
    manifestationTraits: {
      interactive: true,
      focusable: true,
      contained: true,
      emphasized: true,
      role: 'radiogroup' as AriaRole,
    },
    priority: 15,
    constraintConditions: {
      viewports: ['mobile'],
    },
  },

  {
    id: 'multi-selection',
    name: 'Multi Selection (Checkbox Group)',
    requiredTraits: ['selectable', 'toggleable', 'focusable'],
    pattern: 'selection',
    manifestationTraits: {
      interactive: true,
      focusable: true,
      contained: true,
      role: 'group' as AriaRole,
    },
    priority: 10,
  },

  {
    id: 'selection-dropdown',
    name: 'Selection (Dropdown)',
    requiredTraits: ['selectable', 'collapsible', 'focusable'],
    pattern: 'selection',
    manifestationTraits: {
      interactive: true,
      focusable: true,
      contained: true,
      elevated: false,
      role: 'combobox' as AriaRole,
    },
    priority: 5,
    constraintConditions: {
      density: ['compact'],
    },
  },

  // --- INPUT PATTERNS ---
  {
    id: 'text-input',
    name: 'Text Input',
    requiredTraits: ['editable', 'focusable'],
    optionalTraits: ['validatable'],
    pattern: 'input',
    manifestationTraits: {
      interactive: true,
      focusable: true,
      contained: true,
      role: 'textbox' as AriaRole,
    },
    priority: 10,
  },

  {
    id: 'text-area',
    name: 'Text Area',
    requiredTraits: ['editable', 'focusable', 'scrollable'],
    pattern: 'input',
    manifestationTraits: {
      interactive: true,
      focusable: true,
      contained: true,
      role: 'textbox' as AriaRole,
    },
    priority: 15,
  },

  // --- ACTION PATTERNS ---
  {
    id: 'primary-action',
    name: 'Primary Action Button',
    requiredTraits: ['clickable', 'focusable'],
    excludedTraits: ['selectable', 'editable'],
    pattern: 'action',
    manifestationTraits: {
      interactive: true,
      focusable: true,
      contained: true,
      emphasized: true,
      role: 'button' as AriaRole,
    },
    priority: 10,
  },

  {
    id: 'confirmation-action',
    name: 'Confirmation Dialog',
    requiredTraits: ['clickable', 'focusable', 'dismissable'],
    pattern: 'action',
    manifestationTraits: {
      interactive: true,
      focusable: true,
      contained: true,
      elevated: true,
      emphasized: true,
      dismissable: true,
      role: 'alertdialog' as AriaRole,
    },
    priority: 20,
    constraintConditions: {
      urgency: ['high', 'critical'],
    },
  },

  {
    id: 'inline-confirmation',
    name: 'Inline Confirmation',
    requiredTraits: ['clickable', 'focusable'],
    pattern: 'action',
    manifestationTraits: {
      interactive: true,
      focusable: true,
      contained: true,
      emphasized: false,
      role: 'group' as AriaRole,
    },
    priority: 15,
    constraintConditions: {
      urgency: ['low', 'medium'],
    },
  },

  // --- DISPLAY PATTERNS ---
  {
    id: 'info-display',
    name: 'Information Display',
    requiredTraits: ['displayable'],
    excludedTraits: ['editable', 'clickable'],
    pattern: 'display',
    manifestationTraits: {
      interactive: false,
      focusable: false,
      contained: true,
      role: 'region' as AriaRole,
    },
    priority: 5,
  },

  {
    id: 'summary-card',
    name: 'Summary Card',
    requiredTraits: ['displayable', 'hoverable'],
    optionalTraits: ['collapsible'],
    pattern: 'display',
    manifestationTraits: {
      interactive: false,
      focusable: false,
      contained: true,
      elevated: true,
      role: 'region' as AriaRole,
    },
    priority: 10,
  },

  {
    id: 'loading-state',
    name: 'Loading State',
    requiredTraits: ['displayable', 'loadable'],
    pattern: 'display',
    manifestationTraits: {
      interactive: false,
      focusable: false,
      contained: false,
      role: 'status' as AriaRole,
      liveRegion: 'polite',
    },
    priority: 15,
  },

  // --- FEEDBACK PATTERNS ---
  {
    id: 'alert-message',
    name: 'Alert Message',
    requiredTraits: ['displayable', 'dismissable'],
    pattern: 'feedback',
    manifestationTraits: {
      interactive: false,
      focusable: true,
      contained: true,
      elevated: true,
      emphasized: true,
      dismissable: true,
      role: 'alert' as AriaRole,
      liveRegion: 'assertive',
    },
    priority: 20,
    constraintConditions: {
      urgency: ['high', 'critical'],
    },
  },

  {
    id: 'info-message',
    name: 'Info Message',
    requiredTraits: ['displayable'],
    excludedTraits: ['dismissable'],
    pattern: 'feedback',
    manifestationTraits: {
      interactive: false,
      focusable: false,
      contained: true,
      role: 'status' as AriaRole,
      liveRegion: 'polite',
    },
    priority: 5,
    constraintConditions: {
      urgency: ['low', 'medium'],
    },
  },
]

// =============================================================================
// AFFINITY RULE MATCHING
// =============================================================================

/**
 * Find all rules that match a set of traits
 */
export function findMatchingRules(
  traits: BehaviorTrait[],
  constraints?: ConstraintSet
): AffinityRule[] {
  return AFFINITY_RULES.filter(rule => {
    // Check required traits
    const hasAllRequired = rule.requiredTraits.every(t => traits.includes(t))
    if (!hasAllRequired) return false

    // Check excluded traits
    if (rule.excludedTraits?.some(t => traits.includes(t))) {
      return false
    }

    // Check constraint conditions if provided
    if (constraints && rule.constraintConditions) {
      const { viewports, screenReader, urgency, density } = rule.constraintConditions

      if (viewports && !viewports.includes(constraints.device.viewport)) {
        return false
      }

      if (screenReader !== undefined && screenReader !== constraints.accessibility.screenReader) {
        return false
      }

      if (urgency && !urgency.includes(constraints.context.urgency)) {
        return false
      }

      if (density && !density.includes(constraints.designSystem.density)) {
        return false
      }
    }

    return true
  }).sort((a, b) => b.priority - a.priority) // Sort by priority descending
}

/**
 * Find the best matching rule
 */
export function findBestRule(
  traits: BehaviorTrait[],
  constraints?: ConstraintSet
): AffinityRule | null {
  const matches = findMatchingRules(traits, constraints)
  return matches[0] || null
}

// =============================================================================
// INTENTION → TRAITS MAPPING
// =============================================================================

/**
 * Determine required traits from an intention action
 */
export function actionToTraits(action: IntentionAction): BehaviorTrait[] {
  switch (action) {
    case 'choose-one':
      return ['selectable', 'focusable']
    case 'choose-many':
      return ['selectable', 'toggleable', 'focusable']
    case 'provide-text':
      return ['editable', 'focusable', 'validatable']
    case 'provide-data':
      return ['editable', 'focusable', 'validatable']
    case 'confirm':
      return ['clickable', 'focusable', 'dismissable']
    case 'acknowledge':
      return ['clickable', 'focusable']
    case 'review':
      return ['displayable']
    case 'navigate':
      return ['clickable', 'focusable']
    case 'wait':
      return ['displayable', 'loadable']
    case 'alert':
      return ['displayable', 'dismissable']
    default:
      return ['displayable']
  }
}

/**
 * Enhance traits based on constraints
 */
export function enhanceTraitsForConstraints(
  baseTraits: BehaviorTrait[],
  constraints: ConstraintSet
): BehaviorTrait[] {
  const enhanced = [...baseTraits]

  // Mobile-specific enhancements
  if (constraints.device.viewport === 'mobile') {
    // Prefer clickable over hoverable on mobile
    if (enhanced.includes('hoverable')) {
      const idx = enhanced.indexOf('hoverable')
      enhanced.splice(idx, 1)
    }
  }

  // Touch device enhancements
  if (constraints.device.hasTouch && !enhanced.includes('clickable')) {
    // Touch devices need explicit tap targets
    enhanced.push('clickable')
  }

  // Screen reader enhancements
  if (constraints.accessibility.screenReader) {
    // Always ensure focusable for screen reader users
    if (!enhanced.includes('focusable')) {
      enhanced.push('focusable')
    }
  }

  // Compact density - prefer collapsible for space
  if (
    constraints.designSystem.density === 'compact' &&
    enhanced.includes('selectable') &&
    !enhanced.includes('collapsible')
  ) {
    enhanced.push('collapsible')
  }

  return enhanced
}
