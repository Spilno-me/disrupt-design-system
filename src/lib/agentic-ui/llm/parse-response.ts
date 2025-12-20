/**
 * Parse Response
 *
 * Validates and parses LLM JSON responses into typed Intention objects.
 * Provides helpful error messages when parsing fails.
 */

import type {
  Intention,
  IntentionAction,
  IntentionPurpose,
  IntentionSubject,
} from '../intention-types'

// =============================================================================
// TYPES
// =============================================================================

/**
 * Result of parsing an intention response
 */
export type ParseResult =
  | { success: true; intention: Intention }
  | { success: false; error: string; rawJson?: unknown }

// =============================================================================
// VALIDATION HELPERS
// =============================================================================

const VALID_ACTIONS: IntentionAction[] = [
  'choose-one',
  'choose-many',
  'provide-text',
  'provide-data',
  'confirm',
  'acknowledge',
  'navigate',
  'review',
  'wait',
  'alert',
]

const VALID_PURPOSES: IntentionPurpose[] = ['request', 'confirm', 'inform', 'alert']

const VALID_ICON_HINTS = ['success', 'warning', 'error', 'info', 'question']

/**
 * Check if a value is a valid action
 */
function isValidAction(value: unknown): value is IntentionAction {
  return typeof value === 'string' && VALID_ACTIONS.includes(value as IntentionAction)
}

/**
 * Check if a value is a valid purpose
 */
function isValidPurpose(value: unknown): value is IntentionPurpose {
  return typeof value === 'string' && VALID_PURPOSES.includes(value as IntentionPurpose)
}

/**
 * Validate the subject object
 */
function validateSubject(subject: unknown): { valid: boolean; error?: string } {
  if (!subject || typeof subject !== 'object') {
    return { valid: false, error: 'subject must be an object' }
  }

  const s = subject as Record<string, unknown>

  if (typeof s.type !== 'string' || !s.type) {
    return { valid: false, error: 'subject.type must be a non-empty string' }
  }

  if (typeof s.label !== 'string' || !s.label) {
    return { valid: false, error: 'subject.label must be a non-empty string' }
  }

  if (s.description !== undefined && typeof s.description !== 'string') {
    return { valid: false, error: 'subject.description must be a string if provided' }
  }

  if (s.iconHint !== undefined && !VALID_ICON_HINTS.includes(s.iconHint as string)) {
    return {
      valid: false,
      error: `subject.iconHint must be one of: ${VALID_ICON_HINTS.join(', ')}`,
    }
  }

  // Validate constraints if present
  if (s.constraints !== undefined) {
    const constraintResult = validateConstraints(s.constraints)
    if (!constraintResult.valid) {
      return constraintResult
    }
  }

  return { valid: true }
}

/**
 * Validate constraints object
 */
function validateConstraints(constraints: unknown): { valid: boolean; error?: string } {
  if (!constraints || typeof constraints !== 'object') {
    return { valid: false, error: 'constraints must be an object' }
  }

  const c = constraints as Record<string, unknown>

  // Validate options array if present
  if (c.options !== undefined) {
    if (!Array.isArray(c.options)) {
      return { valid: false, error: 'constraints.options must be an array' }
    }

    for (let i = 0; i < c.options.length; i++) {
      const option = c.options[i]
      if (!option || typeof option !== 'object') {
        return { valid: false, error: `constraints.options[${i}] must be an object` }
      }

      const o = option as Record<string, unknown>
      if (typeof o.value !== 'string') {
        return { valid: false, error: `constraints.options[${i}].value must be a string` }
      }
      if (typeof o.label !== 'string') {
        return { valid: false, error: `constraints.options[${i}].label must be a string` }
      }
    }
  }

  // Validate numeric constraints
  if (c.min !== undefined && typeof c.min !== 'number') {
    return { valid: false, error: 'constraints.min must be a number' }
  }
  if (c.max !== undefined && typeof c.max !== 'number') {
    return { valid: false, error: 'constraints.max must be a number' }
  }

  // Validate pattern
  if (c.pattern !== undefined && typeof c.pattern !== 'string') {
    return { valid: false, error: 'constraints.pattern must be a string' }
  }

  // Validate required
  if (c.required !== undefined && typeof c.required !== 'boolean') {
    return { valid: false, error: 'constraints.required must be a boolean' }
  }

  return { valid: true }
}

/**
 * Validate flow object if present
 */
function validateFlow(flow: unknown): { valid: boolean; error?: string } {
  if (!flow || typeof flow !== 'object') {
    return { valid: false, error: 'flow must be an object' }
  }

  const f = flow as Record<string, unknown>

  if (f.step !== undefined && typeof f.step !== 'number') {
    return { valid: false, error: 'flow.step must be a number' }
  }
  if (f.total !== undefined && typeof f.total !== 'number') {
    return { valid: false, error: 'flow.total must be a number' }
  }
  if (f.canGoBack !== undefined && typeof f.canGoBack !== 'boolean') {
    return { valid: false, error: 'flow.canGoBack must be a boolean' }
  }

  return { valid: true }
}

// =============================================================================
// MAIN PARSER
// =============================================================================

/**
 * Parse and validate a JSON string into an Intention object
 */
export function parseIntentionResponse(jsonString: string): ParseResult {
  // Step 1: Parse JSON
  let parsed: unknown
  try {
    parsed = JSON.parse(jsonString)
  } catch (e) {
    return {
      success: false,
      error: `Invalid JSON: ${e instanceof Error ? e.message : 'Unknown parse error'}`,
    }
  }

  // Step 2: Check it's an object
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return {
      success: false,
      error: 'Response must be a JSON object',
      rawJson: parsed,
    }
  }

  const obj = parsed as Record<string, unknown>

  // Step 3: Validate action
  if (!isValidAction(obj.action)) {
    return {
      success: false,
      error: `Invalid action "${obj.action}". Must be one of: ${VALID_ACTIONS.join(', ')}`,
      rawJson: parsed,
    }
  }

  // Step 4: Validate subject
  const subjectResult = validateSubject(obj.subject)
  if (!subjectResult.valid) {
    return {
      success: false,
      error: subjectResult.error!,
      rawJson: parsed,
    }
  }

  // Step 5: Validate purpose
  if (!isValidPurpose(obj.purpose)) {
    return {
      success: false,
      error: `Invalid purpose "${obj.purpose}". Must be one of: ${VALID_PURPOSES.join(', ')}`,
      rawJson: parsed,
    }
  }

  // Step 6: Validate optional fields
  if (obj.displayMessage !== undefined && typeof obj.displayMessage !== 'string') {
    return {
      success: false,
      error: 'displayMessage must be a string if provided',
      rawJson: parsed,
    }
  }

  if (obj.flow !== undefined) {
    const flowResult = validateFlow(obj.flow)
    if (!flowResult.valid) {
      return {
        success: false,
        error: flowResult.error!,
        rawJson: parsed,
      }
    }
  }

  // Step 7: Build the Intention object
  const subject = obj.subject as Record<string, unknown>
  const constraints = subject.constraints as Record<string, unknown> | undefined

  // Build constraints with proper types
  let parsedConstraints: IntentionSubject['constraints'] | undefined
  if (constraints) {
    parsedConstraints = {
      options: constraints.options as Array<{ value: string; label: string; description?: string; disabled?: boolean }> | undefined,
      min: constraints.min as number | undefined,
      max: constraints.max as number | undefined,
      required: constraints.required as boolean | undefined,
    }
    // Convert pattern string to RegExp if present
    if (typeof constraints.pattern === 'string') {
      parsedConstraints.pattern = new RegExp(constraints.pattern)
    }
  }

  // Build flow context with proper property mapping
  let flowContext: Intention['flow'] | undefined
  if (obj.flow) {
    const flow = obj.flow as Record<string, unknown>
    flowContext = {
      id: (flow.id as string) || crypto.randomUUID(),
      sequence: flow.step as number | undefined,
      totalSteps: flow.total as number | undefined,
      canGoBack: flow.canGoBack as boolean | undefined,
    }
  }

  const intention: Intention = {
    action: obj.action as IntentionAction,
    subject: {
      type: subject.type as string,
      label: subject.label as string,
      description: subject.description as string | undefined,
      value: subject.value,
      iconHint: subject.iconHint as IntentionSubject['iconHint'],
      constraints: parsedConstraints,
    },
    purpose: obj.purpose as IntentionPurpose,
    flow: flowContext,
  }

  return { success: true, intention }
}

/**
 * Try to extract and parse an intention from mixed text+JSON response
 */
export function extractAndParseIntention(text: string): ParseResult {
  // Try to find JSON in code block first
  const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (codeBlockMatch) {
    return parseIntentionResponse(codeBlockMatch[1].trim())
  }

  // Try to find bare JSON object
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (jsonMatch) {
    return parseIntentionResponse(jsonMatch[0])
  }

  return {
    success: false,
    error: 'No JSON object found in response',
  }
}
