/**
 * Materializer - Resolution to React Component
 *
 * The missing "last mile" that takes a Resolution from the
 * resolution engine and renders it as an actual React component.
 *
 * This is where the paradigm shift completes:
 * Intention → Resolution → Materializer → Real UI
 */

import * as React from 'react'
import type { Resolution } from '../resolution-types'
import type { MaterializerProps, PatternMaterializer } from './types'
import { SelectionMaterializer } from './selection-materializer'
import { InputMaterializer } from './input-materializer'
import { ActionMaterializer } from './action-materializer'
import { DisplayMaterializer } from './display-materializer'
import { FeedbackMaterializer } from './feedback-materializer'

// =============================================================================
// PATTERN REGISTRY
// =============================================================================

/**
 * Registry of all pattern materializers.
 * Order matters - first matching materializer wins.
 */
const MATERIALIZERS: PatternMaterializer[] = [
  SelectionMaterializer,
  InputMaterializer,
  ActionMaterializer,
  DisplayMaterializer,
  FeedbackMaterializer,
]

/**
 * Find the appropriate materializer for a resolution
 */
function findMaterializer(resolution: Resolution): PatternMaterializer | undefined {
  return MATERIALIZERS.find(
    (m) => m.pattern === resolution.manifestation.pattern && m.canHandle(resolution)
  )
}

// =============================================================================
// DEFAULT MATERIALIZER
// =============================================================================

/**
 * Fallback materializer when no pattern matches
 */
const DefaultMaterializer: PatternMaterializer = {
  pattern: 'display',
  canHandle: () => true,
  render: ({ resolution }) => (
    <div className="p-4 border border-default rounded-md bg-muted-bg">
      <p className="text-sm text-secondary">
        No materializer found for pattern: <strong>{resolution.manifestation.pattern}</strong>
      </p>
      <p className="text-xs text-muted mt-1">
        Action: {resolution.sourceIntention.action}
      </p>
    </div>
  ),
}

// =============================================================================
// MAIN MATERIALIZER COMPONENT
// =============================================================================

export interface MaterializerComponentProps extends Omit<MaterializerProps, 'resolution'> {
  /** The resolution to render */
  resolution: Resolution
}

/**
 * Materializer Component
 *
 * Takes a Resolution and renders it as an interactive React component.
 * This is the main entry point for rendering agent-generated UI.
 *
 * @example
 * ```tsx
 * const { UIComponent } = useAgenticUI()
 *
 * <Materializer
 *   resolution={resolution}
 *   value={value}
 *   onChange={setValue}
 * />
 * ```
 */
export function Materializer({
  resolution,
  value,
  onChange,
  onSubmit,
  disabled = false,
  className,
}: MaterializerComponentProps): React.ReactElement {
  // Find the appropriate materializer
  const materializer = findMaterializer(resolution) ?? DefaultMaterializer

  // Render the component
  return materializer.render({
    resolution,
    value,
    onChange,
    onSubmit,
    disabled,
    className,
  })
}

// =============================================================================
// EXPORTS
// =============================================================================

export { findMaterializer, MATERIALIZERS, DefaultMaterializer }
