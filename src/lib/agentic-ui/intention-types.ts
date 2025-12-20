/**
 * Intention Types - The Language of User Goals
 *
 * This module defines the Intention abstraction that replaces "component".
 * An Intention describes WHAT the user wants to DO, not what they should SEE.
 *
 * Core Paradigm Shift:
 * - Old: Agent selects components → composes layout → renders
 * - New: Intention exists → constraints applied → form RESOLVES
 */

// =============================================================================
// INTENTION ACTIONS
// What the user wants to accomplish (verb-based)
// =============================================================================

/**
 * Core actions that cover all user intentions.
 * These are universal and don't reference any specific UI component.
 */
export type IntentionAction =
  | 'choose-one'      // Select a single option from a set
  | 'choose-many'     // Select multiple options from a set
  | 'provide-text'    // Enter free-form text
  | 'provide-data'    // Enter structured data (numbers, dates, etc.)
  | 'confirm'         // Make a yes/no decision
  | 'acknowledge'     // Dismiss information / continue
  | 'review'          // View a summary or details
  | 'navigate'        // Go somewhere else
  | 'wait'            // Loading or processing state
  | 'alert'           // Attention required immediately

// =============================================================================
// INTENTION SUBJECT
// What KIND of thing the action operates on
// =============================================================================

/**
 * Constraints on valid values for the subject
 */
export interface SubjectConstraints {
  /** Available options for selection actions */
  options?: Array<{
    value: string
    label: string
    description?: string
    disabled?: boolean
  }>
  /** Whether a value is required */
  required?: boolean
  /** Minimum value/length */
  min?: number
  /** Maximum value/length */
  max?: number
  /** Validation pattern */
  pattern?: RegExp
  /** Custom validation function */
  validate?: (value: unknown) => boolean | string
}

/**
 * The domain data involved in the intention.
 * Describes WHAT KIND of thing, not HOW to display it.
 */
export interface IntentionSubject {
  /** The semantic type of the thing */
  type:
    | 'severity'       // Priority/severity level
    | 'category'       // Classification category
    | 'date'           // Date or datetime
    | 'time'           // Time only
    | 'text'           // Free text
    | 'number'         // Numeric value
    | 'file'           // File upload
    | 'person'         // User/person selection
    | 'location'       // Address/location
    | 'status'         // Status indicator
    | 'action'         // Action to perform
    | 'item'           // Generic item
    | 'message'        // Message content
    | 'summary'        // Summary data
    | string           // Extensible for custom types

  /** Human-readable label for the subject */
  label: string

  /** The current value (if any) */
  value?: unknown

  /** Constraints on valid values */
  constraints?: SubjectConstraints

  /** Optional description for context */
  description?: string

  /** Icon hint (semantic, not specific) */
  iconHint?: 'warning' | 'info' | 'success' | 'error' | 'question' | 'action'
}

// =============================================================================
// INTENTION PURPOSE
// WHY this intention exists (affects presentation)
// =============================================================================

/**
 * The purpose informs the resolution engine about urgency and styling.
 */
export type IntentionPurpose =
  | 'inform'    // Provide information to the user
  | 'request'   // Request input from the user
  | 'confirm'   // Require explicit confirmation
  | 'alert'     // Urgent attention needed
  | 'progress'  // Show progress/loading

// =============================================================================
// FLOW CONTEXT
// How this intention relates to others
// =============================================================================

/**
 * Relationships to other intentions in a conversation flow
 */
export interface FlowContext {
  /** Unique ID for this intention in the flow */
  id: string
  /** ID of the parent/previous intention */
  parentId?: string
  /** Whether this is a branching point */
  isBranch?: boolean
  /** Sequence position (1-indexed) */
  sequence?: number
  /** Total steps in this flow */
  totalSteps?: number
  /** Can user go back? */
  canGoBack?: boolean
}

// =============================================================================
// THE INTENTION
// The complete intention structure
// =============================================================================

/**
 * An Intention represents what the user wants to DO.
 * It contains no reference to components, widgets, or visual elements.
 * The Resolution Engine will determine the appropriate form.
 */
export interface Intention {
  /** What the user wants to accomplish (verb) */
  action: IntentionAction

  /** The domain data involved (noun) */
  subject: IntentionSubject

  /** Why this is happening (affects presentation) */
  purpose: IntentionPurpose

  /** Flow relationships (optional) */
  flow?: FlowContext

  /** Metadata for debugging/analytics */
  meta?: {
    /** When this intention was created */
    timestamp?: number
    /** Source of this intention */
    source?: 'agent' | 'user' | 'system'
    /** Correlation ID for tracking */
    correlationId?: string
  }
}

// =============================================================================
// INTENTION BUILDER
// Helper functions to create intentions easily
// =============================================================================

/**
 * Create a selection intention
 */
export function createSelectionIntention(
  options: SubjectConstraints['options'],
  label: string,
  opts?: {
    multiSelect?: boolean
    required?: boolean
    description?: string
    type?: IntentionSubject['type']
  }
): Intention {
  return {
    action: opts?.multiSelect ? 'choose-many' : 'choose-one',
    subject: {
      type: opts?.type ?? 'item',
      label,
      description: opts?.description,
      constraints: {
        options,
        required: opts?.required ?? true,
      },
    },
    purpose: 'request',
  }
}

/**
 * Create a text input intention
 */
export function createTextInputIntention(
  label: string,
  opts?: {
    required?: boolean
    maxLength?: number
    description?: string
    placeholder?: string
  }
): Intention {
  return {
    action: 'provide-text',
    subject: {
      type: 'text',
      label,
      description: opts?.description,
      constraints: {
        required: opts?.required ?? false,
        max: opts?.maxLength,
      },
    },
    purpose: 'request',
  }
}

/**
 * Create a confirmation intention
 */
export function createConfirmationIntention(
  label: string,
  opts?: {
    description?: string
    urgent?: boolean
  }
): Intention {
  return {
    action: 'confirm',
    subject: {
      type: 'action',
      label,
      description: opts?.description,
      iconHint: opts?.urgent ? 'warning' : 'question',
    },
    purpose: opts?.urgent ? 'alert' : 'confirm',
  }
}

/**
 * Create a review/display intention
 */
export function createReviewIntention(
  data: unknown,
  label: string,
  opts?: {
    description?: string
  }
): Intention {
  return {
    action: 'review',
    subject: {
      type: 'summary',
      label,
      value: data,
      description: opts?.description,
    },
    purpose: 'inform',
  }
}

/**
 * Create an alert intention
 */
export function createAlertIntention(
  message: string,
  opts?: {
    type?: 'info' | 'warning' | 'error' | 'success'
    dismissable?: boolean
  }
): Intention {
  return {
    action: opts?.dismissable ? 'acknowledge' : 'alert',
    subject: {
      type: 'message',
      label: message,
      iconHint: opts?.type ?? 'info',
    },
    purpose: opts?.type === 'error' || opts?.type === 'warning' ? 'alert' : 'inform',
  }
}

// =============================================================================
// TYPE GUARDS
// =============================================================================

export function isSelectionAction(action: IntentionAction): boolean {
  return action === 'choose-one' || action === 'choose-many'
}

export function isInputAction(action: IntentionAction): boolean {
  return action === 'provide-text' || action === 'provide-data'
}

export function isDisplayAction(action: IntentionAction): boolean {
  return action === 'review' || action === 'wait' || action === 'alert'
}

export function isConfirmationAction(action: IntentionAction): boolean {
  return action === 'confirm' || action === 'acknowledge'
}
