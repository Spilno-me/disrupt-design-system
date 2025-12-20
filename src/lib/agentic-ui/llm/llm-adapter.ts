/**
 * LLM Adapter
 *
 * Provides a unified interface for different LLM providers (Claude, OpenAI, etc.)
 * This abstraction allows the agentic UI system to work with any LLM.
 */

import type { Intention } from '../intention-types'
import { buildFullSystemPrompt } from './prompt-template'
import { parseIntentionResponse } from './parse-response'

// =============================================================================
// TYPES
// =============================================================================

/**
 * A message in the conversation
 */
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

/**
 * Response from the LLM
 */
export interface LLMResponse {
  /** The raw text response from the LLM */
  text: string
  /** Parsed intention if the response contains valid JSON */
  intention?: Intention
  /** Conversational message (text around the JSON) */
  message?: string
  /** Whether the response contains a valid intention */
  hasIntention: boolean
  /** Error if parsing failed */
  error?: string
}

/**
 * Configuration for the LLM adapter
 */
export interface LLMAdapterConfig {
  /** Custom system prompt additions */
  customSystemPrompt?: string
  /** Temperature for generation (0-1) */
  temperature?: number
  /** Maximum tokens to generate */
  maxTokens?: number
}

/**
 * Interface that all LLM providers must implement
 */
export interface LLMProvider {
  /** Provider name for logging/debugging */
  name: string

  /**
   * Send a message and get a response
   * @param messages - Conversation history
   * @param config - Optional configuration
   * @returns Promise resolving to the LLM response
   */
  chat(messages: ChatMessage[], config?: LLMAdapterConfig): Promise<LLMResponse>
}

// =============================================================================
// RESPONSE EXTRACTION
// =============================================================================

/**
 * Extract intention JSON and surrounding message from LLM response
 */
function extractIntentionFromResponse(text: string): {
  intention?: Intention
  message?: string
  error?: string
} {
  // Try to find JSON in the response (may be in code block or bare)
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/) || text.match(/(\{[\s\S]*\})/)

  if (!jsonMatch) {
    return { message: text }
  }

  const jsonStr = jsonMatch[1].trim()

  // Parse and validate the intention
  const parseResult = parseIntentionResponse(jsonStr)

  if (!parseResult.success) {
    return {
      message: text,
      error: parseResult.error,
    }
  }

  // Extract message around the JSON
  const beforeJson = text.substring(0, text.indexOf(jsonMatch[0])).trim()
  const afterJson = text.substring(text.indexOf(jsonMatch[0]) + jsonMatch[0].length).trim()
  const message = [beforeJson, afterJson].filter(Boolean).join('\n\n')

  return {
    intention: parseResult.intention,
    message: message || undefined,
  }
}

// =============================================================================
// MOCK PROVIDER (for demos)
// =============================================================================

/**
 * Mock LLM provider for testing and demos.
 * Returns predefined responses based on input patterns.
 */
export class MockLLMProvider implements LLMProvider {
  name = 'mock'

  async chat(messages: ChatMessage[]): Promise<LLMResponse> {
    const lastUserMessage = messages.filter((m) => m.role === 'user').pop()?.content ?? ''
    const lowerMessage = lastUserMessage.toLowerCase()

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    let response: string

    // Pattern matching for demo responses
    if (lowerMessage.includes('appointment') || lowerMessage.includes('schedule') || lowerMessage.includes('book')) {
      response = `Great! Let me help you schedule an appointment.

\`\`\`json
{
  "action": "choose-one",
  "subject": {
    "type": "appointment_time",
    "label": "Preferred Time",
    "description": "Select when you'd like to meet",
    "constraints": {
      "options": [
        { "value": "morning", "label": "Morning", "description": "9:00 AM - 12:00 PM" },
        { "value": "afternoon", "label": "Afternoon", "description": "1:00 PM - 5:00 PM" },
        { "value": "evening", "label": "Evening", "description": "6:00 PM - 9:00 PM" }
      ]
    }
  },
  "purpose": "request",
  "displayMessage": "What time works best for you?"
}
\`\`\``
    } else if (lowerMessage.includes('feedback') || lowerMessage.includes('comment')) {
      response = `I'd love to hear your thoughts!

\`\`\`json
{
  "action": "provide-text",
  "subject": {
    "type": "feedback",
    "label": "Your Feedback",
    "description": "Share your experience with us",
    "constraints": {
      "min": 10,
      "max": 500
    }
  },
  "purpose": "request",
  "displayMessage": "Please tell us what you think."
}
\`\`\``
    } else if (lowerMessage.includes('delete') || lowerMessage.includes('remove')) {
      response = `I understand you want to delete something. This is a significant action.

\`\`\`json
{
  "action": "confirm",
  "subject": {
    "type": "delete_action",
    "label": "Confirm Deletion",
    "description": "This action cannot be undone. Are you sure you want to proceed?",
    "iconHint": "warning"
  },
  "purpose": "confirm",
  "displayMessage": "Please confirm this action."
}
\`\`\``
    } else if (lowerMessage.includes('priority') || lowerMessage.includes('categories')) {
      response = `Let me help you set priorities.

\`\`\`json
{
  "action": "choose-many",
  "subject": {
    "type": "priority_levels",
    "label": "Priority Levels",
    "description": "Select all that apply",
    "constraints": {
      "options": [
        { "value": "urgent", "label": "Urgent" },
        { "value": "high", "label": "High Priority" },
        { "value": "medium", "label": "Medium Priority" },
        { "value": "low", "label": "Low Priority" }
      ]
    }
  },
  "purpose": "request"
}
\`\`\``
    } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      response = `Hello! I'm here to help. What would you like to do today?

I can help you with:
- Scheduling appointments
- Collecting feedback
- Managing settings
- And much more!

Just let me know what you need.`
    } else {
      // Default: ask what they need
      response = `I'd be happy to help! Could you tell me more about what you're looking for?

\`\`\`json
{
  "action": "provide-text",
  "subject": {
    "type": "user_request",
    "label": "How can I help?",
    "description": "Describe what you'd like to accomplish"
  },
  "purpose": "request"
}
\`\`\``
    }

    const extracted = extractIntentionFromResponse(response)

    return {
      text: response,
      intention: extracted.intention,
      message: extracted.message,
      hasIntention: !!extracted.intention,
      error: extracted.error,
    }
  }
}

// =============================================================================
// MAIN ADAPTER CLASS
// =============================================================================

/**
 * The main LLM adapter that wraps any provider with
 * the agentic UI system prompt and response parsing.
 */
export class AgenticLLMAdapter {
  private provider: LLMProvider
  private systemPrompt: string
  private conversationHistory: ChatMessage[] = []

  constructor(provider: LLMProvider, config?: LLMAdapterConfig) {
    this.provider = provider
    this.systemPrompt = buildFullSystemPrompt(config?.customSystemPrompt)
  }

  /**
   * Send a user message and get a response with parsed intention
   */
  async sendMessage(userMessage: string): Promise<LLMResponse> {
    // Add user message to history
    this.conversationHistory.push({ role: 'user', content: userMessage })

    // Build full message list with system prompt
    const messages: ChatMessage[] = [
      { role: 'system', content: this.systemPrompt },
      ...this.conversationHistory,
    ]

    // Get response from provider
    const response = await this.provider.chat(messages)

    // Add assistant response to history
    this.conversationHistory.push({ role: 'assistant', content: response.text })

    return response
  }

  /**
   * Reset conversation history
   */
  resetConversation(): void {
    this.conversationHistory = []
  }

  /**
   * Get current conversation history
   */
  getConversationHistory(): ChatMessage[] {
    return [...this.conversationHistory]
  }

  /**
   * Get the provider being used
   */
  getProviderName(): string {
    return this.provider.name
  }
}

// =============================================================================
// FACTORY FUNCTIONS
// =============================================================================

/**
 * Create a mock adapter for demos and testing
 */
export function createMockAdapter(config?: LLMAdapterConfig): AgenticLLMAdapter {
  return new AgenticLLMAdapter(new MockLLMProvider(), config)
}
