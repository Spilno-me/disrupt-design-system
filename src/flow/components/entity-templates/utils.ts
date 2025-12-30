/**
 * Entity Templates Utility Functions
 *
 * Pure utility functions for template operations.
 * Separated from types.ts for cleaner architecture.
 */

// =============================================================================
// CODE GENERATION
// =============================================================================

/**
 * Generate a URL-safe code from a template name
 * @example "Corrective Action" -> "corrective-action"
 */
export function generateTemplateCode(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
}

// =============================================================================
// VALIDATION
// =============================================================================

/**
 * Validate template name format
 * - Letters and spaces only
 * - 5-100 characters
 */
export function validateTemplateName(name: string): { valid: boolean; error?: string } {
  const trimmed = name.trim()

  if (trimmed.length < 5) {
    return { valid: false, error: 'Name must be at least 5 characters' }
  }

  if (trimmed.length > 100) {
    return { valid: false, error: 'Name must be at most 100 characters' }
  }

  if (!/^[a-zA-Z\s]+$/.test(trimmed)) {
    return { valid: false, error: 'Name must contain only letters and spaces' }
  }

  return { valid: true }
}

/**
 * Validate JSON Schema string
 */
export function validateJsonSchema(schema: string): { valid: boolean; error?: string } {
  if (!schema.trim()) {
    return { valid: false, error: 'JSON Schema is required' }
  }

  try {
    const parsed = JSON.parse(schema)

    if (typeof parsed !== 'object' || parsed === null) {
      return { valid: false, error: 'Schema must be a JSON object' }
    }

    if (parsed.type !== 'object') {
      return { valid: false, error: 'Schema type must be "object"' }
    }

    return { valid: true }
  } catch {
    return { valid: false, error: 'Invalid JSON format' }
  }
}

// =============================================================================
// FORMATTING
// =============================================================================

/**
 * Format JSON string with indentation
 */
export function formatJson(json: string): string {
  try {
    return JSON.stringify(JSON.parse(json), null, 2)
  } catch {
    return json
  }
}
