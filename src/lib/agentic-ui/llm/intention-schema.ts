/**
 * Intention Schema
 *
 * JSON Schema that defines the structure LLMs must output.
 * This schema is used for:
 * 1. System prompt instructions (telling LLM what format to use)
 * 2. Response validation (ensuring LLM output is correct)
 * 3. TypeScript type generation
 */

// =============================================================================
// JSON SCHEMA DEFINITION
// =============================================================================

/**
 * Complete JSON Schema for LLM intention output
 */
export const INTENTION_JSON_SCHEMA = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  required: ['action', 'subject', 'purpose'],
  additionalProperties: false,
  properties: {
    action: {
      type: 'string',
      enum: [
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
      ],
      description: 'What the user needs to DO (not what UI to show)',
    },
    subject: {
      type: 'object',
      required: ['type', 'label'],
      additionalProperties: false,
      properties: {
        type: {
          type: 'string',
          description: 'Semantic type of the subject (e.g., appointment_time, priority, feedback)',
        },
        label: {
          type: 'string',
          description: 'Human-readable label shown to user',
        },
        description: {
          type: 'string',
          description: 'Optional help text or explanation',
        },
        value: {
          description: 'Current or default value',
        },
        iconHint: {
          type: 'string',
          enum: ['success', 'warning', 'error', 'info', 'question'],
          description: 'Semantic icon hint (system chooses actual icon)',
        },
        constraints: {
          type: 'object',
          additionalProperties: false,
          properties: {
            options: {
              type: 'array',
              items: {
                type: 'object',
                required: ['value', 'label'],
                additionalProperties: false,
                properties: {
                  value: {
                    type: 'string',
                    description: 'Programmatic value',
                  },
                  label: {
                    type: 'string',
                    description: 'Display label',
                  },
                  description: {
                    type: 'string',
                    description: 'Optional description',
                  },
                  disabled: {
                    type: 'boolean',
                    description: 'Whether option is selectable',
                  },
                },
              },
              description: 'Available options for selection actions',
            },
            min: {
              type: 'number',
              description: 'Minimum value/length',
            },
            max: {
              type: 'number',
              description: 'Maximum value/length',
            },
            pattern: {
              type: 'string',
              description: 'Regex pattern for validation',
            },
            required: {
              type: 'boolean',
              description: 'Whether field is required',
            },
          },
        },
      },
    },
    purpose: {
      type: 'string',
      enum: ['request', 'confirm', 'inform', 'alert'],
      description: 'Why this intention exists in the conversation',
    },
    displayMessage: {
      type: 'string',
      description: 'Optional conversational message to show alongside the UI',
    },
    flow: {
      type: 'object',
      additionalProperties: false,
      properties: {
        step: {
          type: 'number',
          description: 'Current step in multi-step flow',
        },
        total: {
          type: 'number',
          description: 'Total steps in flow',
        },
        canGoBack: {
          type: 'boolean',
          description: 'Whether user can go back',
        },
      },
    },
  },
} as const

// =============================================================================
// SCHEMA EXAMPLES FOR LLM CONTEXT
// =============================================================================

/**
 * Examples that demonstrate correct intention formatting.
 * These are included in the system prompt to help the LLM.
 */
export const INTENTION_EXAMPLES = [
  {
    description: 'Single selection (e.g., appointment time)',
    input: 'Help me book an appointment',
    output: {
      action: 'choose-one',
      subject: {
        type: 'appointment_time',
        label: 'Preferred Time',
        constraints: {
          options: [
            { value: 'morning', label: 'Morning', description: '9:00 AM - 12:00 PM' },
            { value: 'afternoon', label: 'Afternoon', description: '1:00 PM - 5:00 PM' },
            { value: 'evening', label: 'Evening', description: '6:00 PM - 9:00 PM' },
          ],
        },
      },
      purpose: 'request',
      displayMessage: 'What time works best for you?',
    },
  },
  {
    description: 'Multi-selection (e.g., preferences)',
    input: 'What dietary restrictions should I note?',
    output: {
      action: 'choose-many',
      subject: {
        type: 'dietary_restrictions',
        label: 'Dietary Restrictions',
        description: 'Select all that apply',
        constraints: {
          options: [
            { value: 'vegetarian', label: 'Vegetarian' },
            { value: 'vegan', label: 'Vegan' },
            { value: 'gluten_free', label: 'Gluten-Free' },
            { value: 'dairy_free', label: 'Dairy-Free' },
            { value: 'nut_allergy', label: 'Nut Allergy' },
          ],
        },
      },
      purpose: 'request',
    },
  },
  {
    description: 'Text input (e.g., feedback)',
    input: 'I want to leave feedback',
    output: {
      action: 'provide-text',
      subject: {
        type: 'feedback',
        label: 'Your Feedback',
        description: 'Tell us about your experience',
        constraints: {
          min: 10,
          max: 500,
        },
      },
      purpose: 'request',
      displayMessage: 'We value your feedback! Please share your thoughts.',
    },
  },
  {
    description: 'Confirmation (e.g., delete action)',
    input: 'Delete my account',
    output: {
      action: 'confirm',
      subject: {
        type: 'delete_account',
        label: 'Delete Account',
        description: 'This action cannot be undone. All your data will be permanently deleted.',
        iconHint: 'warning',
      },
      purpose: 'confirm',
      displayMessage: 'Are you sure you want to delete your account?',
    },
  },
  {
    description: 'Success alert',
    input: 'Order placed successfully',
    output: {
      action: 'alert',
      subject: {
        type: 'order_confirmation',
        label: 'Order Confirmed!',
        description: 'Your order #12345 has been placed successfully.',
        iconHint: 'success',
      },
      purpose: 'inform',
    },
  },
] as const

// =============================================================================
// SCHEMA AS STRING (for system prompts)
// =============================================================================

/**
 * Formatted schema string for inclusion in LLM system prompts
 */
export const INTENTION_SCHEMA_STRING = JSON.stringify(INTENTION_JSON_SCHEMA, null, 2)

/**
 * Formatted examples string for inclusion in LLM system prompts
 */
export const INTENTION_EXAMPLES_STRING = INTENTION_EXAMPLES.map(
  (ex) => `### ${ex.description}\nUser: "${ex.input}"\nResponse:\n${JSON.stringify(ex.output, null, 2)}`
).join('\n\n')
