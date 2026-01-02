/**
 * Form Builder Limits
 * Constants for size limits and constraints
 */

export const FORM_BUILDER_LIMITS = {
  /** Maximum undo/redo history entries */
  MAX_HISTORY_SIZE: 50,

  /** Maximum fields per form */
  MAX_FIELDS: 100,

  /** Maximum nesting depth for sections */
  MAX_NESTING_DEPTH: 3,

  /** Minimum field name length */
  MIN_FIELD_NAME_LENGTH: 1,

  /** Maximum field name length */
  MAX_FIELD_NAME_LENGTH: 64,

  /** Maximum label length */
  MAX_LABEL_LENGTH: 200,

  /** Maximum description length */
  MAX_DESCRIPTION_LENGTH: 500,

  /** Maximum options for select/radio */
  MAX_OPTIONS: 50,

  /** Maximum file upload count */
  MAX_FILE_COUNT: 10,

  /** Maximum file size in bytes (10MB) */
  MAX_FILE_SIZE: 10 * 1024 * 1024,

  /** Form name length constraints */
  FORM_NAME_MIN: 3,
  FORM_NAME_MAX: 100,

  /** Form description max length */
  FORM_DESCRIPTION_MAX: 500,
} as const;
