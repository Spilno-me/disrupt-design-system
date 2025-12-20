/**
 * Materializer Module
 *
 * The component materialization layer that converts Resolution outputs
 * into actual React components. This completes the paradigm:
 *
 * Intention → Resolution → Materializer → Real UI
 */

// Main component
export { Materializer, findMaterializer, MATERIALIZERS, DefaultMaterializer } from './materializer'
export type { MaterializerComponentProps } from './materializer'

// Pattern materializers
export { SelectionMaterializer } from './selection-materializer'
export { InputMaterializer } from './input-materializer'
export { ActionMaterializer } from './action-materializer'
export { DisplayMaterializer } from './display-materializer'
export { FeedbackMaterializer } from './feedback-materializer'

// Types and utilities
export type { MaterializerProps, PatternMaterializer, SelectionOption } from './types'
export {
  getOptionsFromIntention,
  isMultiSelect,
  getFieldLabel,
  getPlaceholder,
  isRequired,
} from './types'
