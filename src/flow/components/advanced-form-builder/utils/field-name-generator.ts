/**
 * Field Name Generator
 * Generates unique field names for the schema
 */

import type { ISchema } from '../types';

/**
 * Generate a unique field name based on a base name
 * Appends numbers if the name already exists: field_1, field_2, etc.
 */
export function generateFieldName(baseName: string, schema: ISchema): string {
  const existingNames = new Set(Object.keys(schema.properties));

  // Sanitize base name (alphanumeric and underscore only)
  const sanitizedBase = baseName
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '_')
    .replace(/^_+|_+$/g, '') // trim underscores
    .replace(/_+/g, '_'); // collapse multiple underscores

  // If base name doesn't exist, use it
  if (!existingNames.has(sanitizedBase)) {
    return sanitizedBase;
  }

  // Find the next available number
  let counter = 1;
  let candidate = `${sanitizedBase}_${counter}`;

  while (existingNames.has(candidate)) {
    counter++;
    candidate = `${sanitizedBase}_${counter}`;
  }

  return candidate;
}

/**
 * Validate a field name
 * Returns null if valid, error message if invalid
 */
export function validateFieldName(
  name: string,
  schema: ISchema,
  currentPath?: string[]
): string | null {
  // Empty check
  if (!name || name.trim() === '') {
    return 'Field name is required';
  }

  // Length check
  if (name.length > 64) {
    return 'Field name must be 64 characters or less';
  }

  // Format check (alphanumeric and underscore, must start with letter)
  if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(name)) {
    return 'Field name must start with a letter and contain only letters, numbers, and underscores';
  }

  // Reserved words
  const reserved = ['type', 'properties', 'required', 'title', 'description'];
  if (reserved.includes(name.toLowerCase())) {
    return `"${name}" is a reserved word`;
  }

  // Uniqueness check (skip if checking current field's own name)
  const existingNames = Object.keys(schema.properties);
  const currentName = currentPath?.[currentPath.length - 1];

  if (existingNames.includes(name) && name !== currentName) {
    return 'A field with this name already exists';
  }

  return null;
}

/**
 * Convert a human-readable label to a valid field name
 */
export function labelToFieldName(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') // remove special chars
    .trim()
    .replace(/\s+/g, '_') // spaces to underscores
    .replace(/^(\d)/, '_$1'); // prepend underscore if starts with number
}
