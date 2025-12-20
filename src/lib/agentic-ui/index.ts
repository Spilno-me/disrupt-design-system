/**
 * Agentic UI Fusion - Dynamic Component Resolution System
 *
 * A next-generation UI paradigm where AI agents express INTENTIONS
 * and the system RESOLVES them into concrete forms based on CONSTRAINTS.
 *
 * Core Paradigm:
 * - Old: Agent selects components → composes layout → renders
 * - New: Intention exists → constraints applied → form RESOLVES
 *
 * Key Concepts:
 * - Intention: What the user wants to DO (not see)
 * - Constraints: Device, accessibility, design system, context
 * - Resolution: The process of intent → manifest form
 * - Manifestation: The concrete result (components live here, invisible)
 */

// Intention Types
export type {
  Intention,
  IntentionAction,
  IntentionSubject,
  IntentionPurpose,
  FlowContext,
  SubjectConstraints,
} from './intention-types'

export {
  createSelectionIntention,
  createTextInputIntention,
  createConfirmationIntention,
  createReviewIntention,
  createAlertIntention,
  isSelectionAction,
  isInputAction,
  isDisplayAction,
  isConfirmationAction,
} from './intention-types'

// Constraint Types
export type {
  ConstraintSet,
  DeviceConstraints,
  AccessibilityConstraints,
  DesignSystemConstraints,
  ContextConstraints,
  DDSTokens,
} from './constraint-types'

export {
  createDefaultConstraints,
  createDefaultDeviceConstraints,
  createDefaultAccessibilityConstraints,
  createDefaultDesignSystemConstraints,
  createDefaultContextConstraints,
  createDefaultDDSTokens,
  withMobileDevice,
  withScreenReader,
  withHighUrgency,
  withCompactDensity,
  withDarkTheme,
  calculateConstraintSpecificity,
} from './constraint-types'

// Resolution Types
export type {
  Resolution,
  ResolutionPattern,
  Manifestation,
  ManifestationTraits,
  RenderInstructions,
  ResolutionReasoning,
  TokenizedStyles,
  AriaRole,
  ResolvedUI,
} from './resolution-types'

export {
  createDefaultTraits,
  createEmptyRenderInstructions,
  actionToPattern,
  toResolvedUI,
} from './resolution-types'

// Behavior Primitives
export type { BehaviorTrait, BehaviorPrimitive } from './behavior-primitives'

export {
  BEHAVIOR_PRIMITIVES,
  getAllRequiredTraits,
  areTraitsCompatible,
  getAriaForTraits,
  getKeyboardHandlersForTraits,
  getEventsForTraits,
} from './behavior-primitives'

// Affinity Rules
export type { AffinityRule } from './affinity-rules'

export {
  AFFINITY_RULES,
  findMatchingRules,
  findBestRule,
  actionToTraits,
  enhanceTraitsForConstraints,
} from './affinity-rules'

// Resolution Engine
export {
  ResolutionEngine,
  getResolutionEngine,
  resolve,
} from './resolution-engine'

// Component Materializer
export {
  Materializer,
  findMaterializer,
  MATERIALIZERS,
  DefaultMaterializer,
  SelectionMaterializer,
  InputMaterializer,
  ActionMaterializer,
  DisplayMaterializer,
  FeedbackMaterializer,
  getOptionsFromIntention,
  isMultiSelect,
  getFieldLabel,
  getPlaceholder,
  isRequired,
} from './materializer'

export type {
  MaterializerComponentProps,
  MaterializerProps,
  PatternMaterializer,
  SelectionOption,
} from './materializer'

// LLM Integration
export {
  // Schema
  INTENTION_JSON_SCHEMA,
  INTENTION_EXAMPLES,
  INTENTION_SCHEMA_STRING,
  INTENTION_EXAMPLES_STRING,
  // Prompts
  AGENTIC_UI_SYSTEM_PROMPT,
  buildSystemPrompt,
  buildFullSystemPrompt,
  // Adapters
  AgenticLLMAdapter,
  MockLLMProvider,
  createMockAdapter,
  // Parsing
  parseIntentionResponse,
  extractAndParseIntention,
} from './llm'

export type {
  ChatMessage,
  LLMResponse,
  LLMAdapterConfig,
  LLMProvider,
  ParseResult,
} from './llm'

// Utilities
export { v4 as generateId, deepMerge, debounce, cx } from './utils'
