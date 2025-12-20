/**
 * LLM Integration Module
 *
 * Provides everything needed for LLM-powered agentic UI:
 * - JSON Schema for LLM output structure
 * - System prompts teaching intention-based communication
 * - Provider adapters for different LLMs
 * - Response parsing and validation
 */

// Schema
export {
  INTENTION_JSON_SCHEMA,
  INTENTION_EXAMPLES,
  INTENTION_SCHEMA_STRING,
  INTENTION_EXAMPLES_STRING,
} from './intention-schema'

// Prompt templates
export {
  AGENTIC_UI_SYSTEM_PROMPT,
  MULTI_STEP_FLOW_PROMPT,
  FORM_COLLECTION_PROMPT,
  ERROR_HANDLING_PROMPT,
  buildSystemPrompt,
  buildFullSystemPrompt,
} from './prompt-template'

// LLM adapters
export {
  AgenticLLMAdapter,
  MockLLMProvider,
  createMockAdapter,
} from './llm-adapter'

export type {
  ChatMessage,
  LLMResponse,
  LLMAdapterConfig,
  LLMProvider,
} from './llm-adapter'

// Response parsing
export {
  parseIntentionResponse,
  extractAndParseIntention,
} from './parse-response'

export type { ParseResult } from './parse-response'
