/**
 * Resolution Engine - Where Intention Meets Constraints
 *
 * The Resolution Engine is the heart of the Agentic UI system.
 * It takes an Intention and a set of Constraints and produces
 * a Resolution - the concrete form the UI should take.
 *
 * This is NOT component selection. This is form EMERGENCE.
 */

import { v4 as uuid } from './utils'
import type { Intention } from './intention-types'
import type { ConstraintSet, DDSTokens } from './constraint-types'
import type {
  Resolution,
  ResolutionPattern,
  Manifestation,
  ManifestationTraits,
  RenderInstructions,
  ResolutionReasoning,
  TokenizedStyles,
} from './resolution-types'
import { createDefaultTraits, createEmptyRenderInstructions, actionToPattern } from './resolution-types'
import { actionToTraits, findBestRule, enhanceTraitsForConstraints } from './affinity-rules'

// =============================================================================
// RESOLUTION ENGINE CLASS
// =============================================================================

/**
 * The Resolution Engine transforms intentions into manifestations
 */
export class ResolutionEngine {
  constructor(private defaultConstraints?: ConstraintSet) {}

  /**
   * Resolve an intention into a concrete manifestation
   */
  resolve(intention: Intention, constraints: ConstraintSet): Resolution {
    // Step 1: Determine required traits from intention
    const baseTraits = actionToTraits(intention.action)

    // Step 2: Enhance traits based on constraints
    const enhancedTraits = enhanceTraitsForConstraints(baseTraits, constraints)

    // Step 3: Find the best affinity rule
    const bestRule = findBestRule(enhancedTraits, constraints)

    // Step 4: Determine the pattern
    const pattern = bestRule?.pattern ?? actionToPattern(intention.action)

    // Step 5: Build manifestation traits
    const traits = this.buildTraits(pattern, intention, constraints, bestRule?.manifestationTraits)

    // Step 6: Generate render instructions using DDS tokens
    const render = this.generateRenderInstructions(pattern, traits, intention, constraints)

    // Step 7: Build the manifestation
    const manifestation: Manifestation = {
      pattern,
      traits,
      render,
    }

    // Step 8: Generate alternatives
    const alternatives = this.generateAlternatives(intention, constraints, manifestation)

    // Step 9: Build reasoning
    const reasoning = this.buildReasoning(intention, constraints, bestRule, pattern)

    // Step 10: Return complete resolution
    return {
      manifestation,
      reasoning,
      alternatives,
      sourceIntention: intention,
      appliedConstraints: constraints,
      id: uuid(),
      timestamp: Date.now(),
    }
  }

  /**
   * Build manifestation traits
   */
  private buildTraits(
    pattern: ResolutionPattern,
    intention: Intention,
    constraints: ConstraintSet,
    ruleTraits?: Partial<ManifestationTraits>
  ): ManifestationTraits {
    // Start with default traits for the pattern
    const base = createDefaultTraits(pattern)

    // Apply rule-specific traits
    const withRule = ruleTraits ? { ...base, ...ruleTraits } : base

    // Adjust for urgency
    if (constraints.context.urgency === 'critical' || constraints.context.urgency === 'high') {
      withRule.emphasized = true
      if (pattern === 'feedback') {
        withRule.liveRegion = 'assertive'
      }
    }

    // Adjust for available space
    if (constraints.context.availableSpace === 'inline') {
      withRule.elevated = false
      withRule.contained = false
    }

    // Adjust for accessibility
    if (constraints.accessibility.screenReader) {
      // Ensure everything is focusable for screen readers
      if (withRule.interactive) {
        withRule.focusable = true
      }
    }

    return withRule
  }

  /**
   * Generate render instructions from DDS tokens
   */
  private generateRenderInstructions(
    pattern: ResolutionPattern,
    traits: ManifestationTraits,
    intention: Intention,
    constraints: ConstraintSet
  ): RenderInstructions {
    const instructions = createEmptyRenderInstructions()
    const { tokens, density, theme } = constraints.designSystem

    // Base styles from DDS tokens
    instructions.styles = this.generateBaseStyles(pattern, traits, tokens, density, theme)

    // State styles
    instructions.states = this.generateStateStyles(pattern, tokens, theme)

    // Class names (Tailwind)
    instructions.classNames = this.generateClassNames(pattern, traits, density, theme, constraints)

    // ARIA attributes
    instructions.aria = this.generateAriaAttributes(pattern, traits, intention)

    // Data attributes
    instructions.dataAttributes = {
      'data-pattern': pattern,
      'data-resolution-id': uuid(),
      'data-theme': theme,
      'data-density': density,
    }

    // Animation
    if (!constraints.accessibility.reducedMotion) {
      instructions.animation = {
        duration: parseInt(tokens.transitions.duration.normal),
      }
    }

    return instructions
  }

  /**
   * Generate base CSS styles from tokens
   */
  private generateBaseStyles(
    pattern: ResolutionPattern,
    traits: ManifestationTraits,
    tokens: DDSTokens,
    density: string,
    _theme: string
  ): TokenizedStyles {
    const styles: TokenizedStyles = {}

    // Background
    if (traits.contained) {
      styles.backgroundColor = tokens.colors.background.surface
      if (traits.elevated) {
        styles.boxShadow = tokens.shadows.md
      }
    }

    // Border
    if (traits.contained) {
      styles.borderRadius = tokens.radius.md
      styles.borderWidth = '1px'
      styles.borderStyle = 'solid'
      styles.borderColor = tokens.colors.border.default
    }

    // Padding based on density
    switch (density) {
      case 'compact':
        styles.padding = tokens.spacing.px.tight
        styles.gap = tokens.spacing.px.tight
        break
      case 'spacious':
        styles.padding = tokens.spacing.px.spacious
        styles.gap = tokens.spacing.px.comfortable
        break
      default:
        styles.padding = tokens.spacing.px.comfortable
        styles.gap = tokens.spacing.px.base
    }

    // Typography
    styles.fontFamily = tokens.typography.fontFamily.sans
    styles.fontSize = tokens.typography.fontSize.base[0] as string
    styles.lineHeight = tokens.typography.lineHeight.normal

    // Color
    styles.color = tokens.colors.text.primary

    // Emphasis
    if (traits.emphasized) {
      styles.fontWeight = tokens.typography.fontWeight.semibold
    }

    // Interactive patterns get min-height for touch targets
    if (traits.interactive && pattern !== 'display') {
      styles.minHeight = '44px' // Touch target minimum
    }

    // Display and layout
    styles.display = 'flex'
    styles.flexDirection = 'column'

    return styles
  }

  /**
   * Generate state-specific styles
   */
  private generateStateStyles(
    _pattern: ResolutionPattern,
    tokens: DDSTokens,
    _theme: string
  ): RenderInstructions['states'] {
    return {
      hover: {
        backgroundColor: tokens.colors.background.surfaceHover,
        borderColor: tokens.colors.border.strong,
      },
      focus: {
        borderColor: tokens.colors.border.focus,
        // Uses token color with standard 3px ring - dimensions intentionally hardcoded for consistency
        // eslint-disable-next-line no-restricted-syntax
        boxShadow: `0 0 0 3px ${tokens.colors.border.focus}40`,
      },
      active: {
        backgroundColor: tokens.colors.background.surfaceActive,
      },
      disabled: {
        opacity: 0.5,
        cursor: 'not-allowed',
      },
      selected: {
        backgroundColor: tokens.colors.background.accentSubtle,
        borderColor: tokens.colors.border.accent,
      },
    }
  }

  /**
   * Generate Tailwind class names
   */
  private generateClassNames(
    pattern: ResolutionPattern,
    traits: ManifestationTraits,
    density: string,
    theme: string,
    constraints: ConstraintSet
  ): string[] {
    const classes: string[] = []

    // Base layout
    classes.push('flex', 'flex-col')

    // Contained style
    if (traits.contained) {
      classes.push('bg-surface', 'border', 'border-default')
      classes.push(density === 'compact' ? 'rounded-sm' : 'rounded-md')
    }

    // Padding based on density
    switch (density) {
      case 'compact':
        classes.push('p-2', 'gap-2')
        break
      case 'spacious':
        classes.push('p-6', 'gap-4')
        break
      default:
        classes.push('p-4', 'gap-3')
    }

    // Elevation
    if (traits.elevated) {
      classes.push('shadow-md')
    }

    // Emphasis
    if (traits.emphasized) {
      classes.push('font-semibold')
    }

    // Interactive states
    if (traits.interactive) {
      classes.push('cursor-pointer')
      classes.push('hover:bg-surface-hover', 'hover:border-strong')
    }

    // Focus states
    if (traits.focusable) {
      classes.push('focus:outline-none', 'focus:ring-2', 'focus:ring-focus', 'focus:ring-offset-2')
    }

    // Accessibility
    if (constraints.accessibility.reducedMotion) {
      classes.push('motion-reduce:transition-none')
    } else {
      classes.push('transition-colors', 'duration-200')
    }

    // Pattern-specific classes
    switch (pattern) {
      case 'selection':
        classes.push('select-none')
        break
      case 'input':
        classes.push('min-h-[44px]')
        break
      case 'feedback':
        if (traits.liveRegion === 'assertive') {
          classes.push('border-error', 'bg-error-light')
        }
        break
    }

    return classes
  }

  /**
   * Generate ARIA attributes
   */
  private generateAriaAttributes(
    pattern: ResolutionPattern,
    traits: ManifestationTraits,
    intention: Intention
  ): Record<string, string | boolean | number | undefined> {
    const aria: Record<string, string | boolean | number | undefined> = {}

    // Role
    if (traits.role && traits.role !== 'none' && traits.role !== 'presentation') {
      aria['role'] = traits.role
    }

    // Label from intention
    aria['aria-label'] = intention.subject.label

    // Description if available
    if (intention.subject.description) {
      aria['aria-description'] = intention.subject.description
    }

    // Live region
    if (traits.liveRegion && traits.liveRegion !== 'off') {
      aria['aria-live'] = traits.liveRegion
    }

    // Required
    if (intention.subject.constraints?.required) {
      aria['aria-required'] = true
    }

    // Disabled state (if disableable)
    // aria['aria-disabled'] would be set dynamically

    return aria
  }

  /**
   * Generate alternative manifestations
   */
  private generateAlternatives(
    intention: Intention,
    constraints: ConstraintSet,
    primary: Manifestation
  ): Manifestation[] {
    const alternatives: Manifestation[] = []

    // Generate a more compact alternative
    if (constraints.designSystem.density !== 'compact') {
      const compactConstraints = {
        ...constraints,
        designSystem: { ...constraints.designSystem, density: 'compact' as const },
      }
      const compactTraits = this.buildTraits(primary.pattern, intention, compactConstraints)
      const compactRender = this.generateRenderInstructions(
        primary.pattern,
        compactTraits,
        intention,
        compactConstraints
      )
      alternatives.push({
        pattern: primary.pattern,
        traits: compactTraits,
        render: compactRender,
      })
    }

    // Generate a more elevated alternative
    if (!primary.traits.elevated) {
      const elevatedTraits = { ...primary.traits, elevated: true }
      const elevatedRender = this.generateRenderInstructions(
        primary.pattern,
        elevatedTraits,
        intention,
        constraints
      )
      alternatives.push({
        pattern: primary.pattern,
        traits: elevatedTraits,
        render: elevatedRender,
      })
    }

    return alternatives
  }

  /**
   * Build reasoning for the resolution
   */
  private buildReasoning(
    intention: Intention,
    constraints: ConstraintSet,
    rule: ReturnType<typeof findBestRule>,
    pattern: ResolutionPattern
  ): ResolutionReasoning {
    const dominantConstraints: string[] = []

    // Identify dominant constraints
    if (constraints.device.viewport === 'mobile') {
      dominantConstraints.push('mobile-viewport')
    }
    if (constraints.accessibility.screenReader) {
      dominantConstraints.push('screen-reader')
    }
    if (constraints.context.urgency === 'critical') {
      dominantConstraints.push('critical-urgency')
    }
    if (constraints.designSystem.density === 'compact') {
      dominantConstraints.push('compact-density')
    }

    // Build explanation
    const explanation = this.buildExplanation(intention, constraints, rule, pattern)

    return {
      dominantConstraints,
      consideredPatterns: [pattern, 'display', 'action'],
      confidence: rule ? 0.9 : 0.7,
      explanation,
    }
  }

  /**
   * Build human-readable explanation
   */
  private buildExplanation(
    intention: Intention,
    constraints: ConstraintSet,
    rule: ReturnType<typeof findBestRule>,
    pattern: ResolutionPattern
  ): string {
    const parts: string[] = []

    parts.push(`Intent: "${intention.action}" on "${intention.subject.label}"`)

    if (rule) {
      parts.push(`Matched rule: "${rule.name}" (priority ${rule.priority})`)
    } else {
      parts.push(`No specific rule matched, using default pattern`)
    }

    parts.push(`Resolved to pattern: "${pattern}"`)

    if (constraints.device.viewport === 'mobile') {
      parts.push(`Optimized for mobile viewport`)
    }

    if (constraints.accessibility.screenReader) {
      parts.push(`Enhanced for screen reader accessibility`)
    }

    return parts.join('. ') + '.'
  }
}

// =============================================================================
// SINGLETON INSTANCE
// =============================================================================

let defaultEngine: ResolutionEngine | null = null

/**
 * Get the default resolution engine instance
 */
export function getResolutionEngine(): ResolutionEngine {
  if (!defaultEngine) {
    defaultEngine = new ResolutionEngine()
  }
  return defaultEngine
}

/**
 * Resolve an intention with the default engine
 */
export function resolve(intention: Intention, constraints: ConstraintSet): Resolution {
  return getResolutionEngine().resolve(intention, constraints)
}

// =============================================================================
// CONVENIENCE EXPORTS
// =============================================================================

export { ResolutionEngine as default }
