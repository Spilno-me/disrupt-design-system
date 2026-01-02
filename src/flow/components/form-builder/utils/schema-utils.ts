/**
 * Schema Utilities
 * Functions for manipulating Formily ISchema
 */

import type { ISchema, SchemaProperty } from '../types';

/**
 * Get a property from the schema by path
 * @param schema - The root schema
 * @param path - Path array like ['properties', 'firstName']
 */
export function getSchemaProperty(
  schema: ISchema,
  path: string[]
): SchemaProperty | undefined {
  if (path.length === 0) return undefined;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let current: any = schema;

  for (const key of path) {
    if (current === undefined || current === null) return undefined;
    current = current[key];
  }

  return current as SchemaProperty;
}

/**
 * Set a property in the schema at the given path (immutable)
 * @param schema - The root schema
 * @param path - Path array like ['properties', 'firstName']
 * @param value - The new value
 */
export function setSchemaProperty(
  schema: ISchema,
  path: string[],
  value: SchemaProperty
): ISchema {
  if (path.length === 0) return schema;

  const newSchema = { ...schema };

  if (path[0] === 'properties' && path.length === 2) {
    // Direct property update
    const fieldName = path[1];
    newSchema.properties = {
      ...newSchema.properties,
      [fieldName]: value,
    };
  } else {
    // Deep path (nested objects)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let current: any = newSchema;
    const pathCopy = [...path];
    const lastKey = pathCopy.pop()!;

    for (const key of pathCopy) {
      current[key] = { ...current[key] };
      current = current[key];
    }

    current[lastKey] = value;
  }

  return newSchema;
}

/**
 * Delete a property from the schema (immutable)
 * @param schema - The root schema
 * @param path - Path array like ['properties', 'firstName']
 */
export function deleteSchemaProperty(schema: ISchema, path: string[]): ISchema {
  if (path.length < 2 || path[0] !== 'properties') return schema;

  const fieldName = path[1];
  const { [fieldName]: _, ...remainingProperties } = schema.properties;

  // Re-index remaining fields
  const reindexedProperties: Record<string, SchemaProperty> = {};
  let index = 0;

  for (const [key, prop] of Object.entries(remainingProperties)) {
    reindexedProperties[key] = {
      ...prop,
      'x-index': index++,
    };
  }

  return {
    ...schema,
    properties: reindexedProperties,
  };
}

/**
 * Reorder properties in the schema (immutable)
 * @param schema - The root schema
 * @param activeId - The field being moved
 * @param overId - The field to move relative to
 */
export function reorderSchemaProperties(
  schema: ISchema,
  activeId: string,
  overId: string
): ISchema {
  const properties = schema.properties;
  const entries = Object.entries(properties).sort(
    (a, b) => (a[1]['x-index'] ?? 0) - (b[1]['x-index'] ?? 0)
  );

  const activeIndex = entries.findIndex(([key]) => key === activeId);
  const overIndex = entries.findIndex(([key]) => key === overId);

  if (activeIndex === -1 || overIndex === -1) return schema;

  // Move the item
  const [removed] = entries.splice(activeIndex, 1);
  entries.splice(overIndex, 0, removed);

  // Re-index
  const reorderedProperties: Record<string, SchemaProperty> = {};
  entries.forEach(([key, prop], index) => {
    reorderedProperties[key] = {
      ...prop,
      'x-index': index,
    };
  });

  return {
    ...schema,
    properties: reorderedProperties,
  };
}

/**
 * Get ordered array of field entries
 */
export function getOrderedFields(
  schema: ISchema
): Array<[string, SchemaProperty]> {
  return Object.entries(schema.properties).sort(
    (a, b) => (a[1]['x-index'] ?? 0) - (b[1]['x-index'] ?? 0)
  );
}

/**
 * Count total fields in schema (including nested)
 */
export function countFields(schema: ISchema): number {
  let count = 0;

  function countRecursive(properties: Record<string, SchemaProperty>) {
    for (const prop of Object.values(properties)) {
      count++;
      if (prop.properties) {
        countRecursive(prop.properties);
      }
    }
  }

  countRecursive(schema.properties);
  return count;
}

/**
 * Validate schema structure
 */
export function validateSchema(schema: ISchema): string[] {
  const errors: string[] = [];

  if (schema.type !== 'object') {
    errors.push('Schema type must be "object"');
  }

  if (!schema.properties || typeof schema.properties !== 'object') {
    errors.push('Schema must have a properties object');
  }

  return errors;
}

/**
 * Rename a field in the schema (immutable)
 */
export function renameSchemaProperty(
  schema: ISchema,
  oldName: string,
  newName: string
): ISchema {
  if (!schema.properties[oldName]) return schema;
  if (oldName === newName) return schema;

  const { [oldName]: field, ...rest } = schema.properties;

  return {
    ...schema,
    properties: {
      ...rest,
      [newName]: field,
    },
  };
}
