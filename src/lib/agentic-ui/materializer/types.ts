/**
 * Materializer Types
 *
 * Types for the component materialization layer that converts
 * Resolution outputs into actual React components.
 */

import type { ReactElement } from 'react'
import type { Resolution, ResolutionPattern } from '../resolution-types'
import type { Intention } from '../intention-types'

/**
 * Props passed to all materializer components
 */
export interface MaterializerProps {
  /** The resolution from the resolution engine */
  resolution: Resolution
  /** Current field value */
  value?: unknown
  /** Called when value changes */
  onChange: (value: unknown) => void
  /** Called when user confirms/submits */
  onSubmit?: () => void
  /** Whether the component is disabled */
  disabled?: boolean
  /** Additional class names */
  className?: string
}

/**
 * A pattern-specific materializer
 */
export interface PatternMaterializer {
  /** The pattern this materializer handles */
  pattern: ResolutionPattern
  /** Check if this materializer can handle a specific resolution */
  canHandle: (resolution: Resolution) => boolean
  /** Render the resolution as a React component */
  render: (props: MaterializerProps) => ReactElement
}

/**
 * Selection option from intention
 */
export interface SelectionOption {
  value: string
  label: string
  description?: string
  disabled?: boolean
}

/**
 * Helper to extract options from intention
 */
export function getOptionsFromIntention(intention: Intention): SelectionOption[] {
  return intention.subject.constraints?.options ?? []
}

/**
 * Helper to check if intention is multi-select
 */
export function isMultiSelect(intention: Intention): boolean {
  return intention.action === 'choose-many'
}

/**
 * Helper to get field label from intention
 */
export function getFieldLabel(intention: Intention): string {
  return intention.subject.label
}

/**
 * Helper to get placeholder text
 */
export function getPlaceholder(intention: Intention): string {
  return intention.subject.description ?? `Enter ${intention.subject.label.toLowerCase()}...`
}

/**
 * Helper to check if field is required
 */
export function isRequired(intention: Intention): boolean {
  return intention.subject.constraints?.required ?? false
}
