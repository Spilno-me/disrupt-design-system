/**
 * LLM Chat Demo - Complete Agentic UI Pipeline
 *
 * This demo shows the FULL agentic UI flow:
 * 1. User types a message
 * 2. LLM responds with an intention (structured JSON)
 * 3. System resolves intention with auto-detected constraints
 * 4. Materializer renders appropriate DDS components
 * 5. User interacts, value captured
 * 6. Conversation continues with context
 */

import type { Meta, StoryObj } from '@storybook/react'
import * as React from 'react'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  ABYSS,
  DEEP_CURRENT,
  DUSK_REEF,
  HARBOR,
  WAVE,
  SLATE,
  PRIMITIVES,
  RADIUS,
} from '../../constants/designTokens'
import {
  Send,
  Bot,
  User,
  Loader2,
  Sparkles,
  RefreshCw,
  Code2,
  Eye,
  EyeOff,
  Smartphone,
  Monitor,
} from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import {
  ORGANISM_META,
  organismDescription,
} from '../_infrastructure'

// Import the agentic UI system
import {
  resolve,
  createDefaultConstraints,
  withMobileDevice,
  Materializer,
  createMockAdapter,
  type LLMResponse,
  type ConstraintSet,
  type Resolution,
} from '../../lib/agentic-ui'

// =============================================================================
// TYPES
// =============================================================================

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  intention?: LLMResponse['intention']
  resolution?: Resolution
}

// =============================================================================
// CHAT COMPONENT
// =============================================================================

function LLMChatDemoComponent() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [formValues, setFormValues] = useState<Record<string, unknown>>({})
  const [showJson, setShowJson] = useState(false)
  const [isMobileMode, setIsMobileMode] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const adapterRef = useRef(createMockAdapter())

  // Get current constraints based on mode
  const constraints: ConstraintSet = isMobileMode
    ? withMobileDevice(createDefaultConstraints())
    : createDefaultConstraints()

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      const response = await adapterRef.current.sendMessage(inputValue)

      let resolution: Resolution | undefined
      if (response.intention) {
        resolution = resolve(response.intention, constraints)
      }

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response.message ?? response.text,
        timestamp: new Date(),
        intention: response.intention,
        resolution,
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleReset = () => {
    setMessages([])
    setFormValues({})
    adapterRef.current.resetConversation()
  }

  const handleIntentionResponse = (intentionId: string, value: unknown) => {
    setFormValues(prev => ({
      ...prev,
      [intentionId]: value,
    }))
  }

  return (
    <div
      className="flex flex-col h-screen"
      style={{
        background: `linear-gradient(135deg, ${ABYSS[500]} 0%, ${DEEP_CURRENT[500]} 100%)`,
      }}
    >
      {/* Header */}
      <header
        className="flex items-center justify-between px-6 py-4 border-b"
        style={{ borderColor: `${SLATE[700]}50` }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${HARBOR[500]} 0%, ${DUSK_REEF[500]} 100%)`,
            }}
          >
            <Sparkles className="w-5 h-5" style={{ color: PRIMITIVES.white }} />
          </div>
          <div>
            <h1 className="text-lg font-semibold" style={{ color: PRIMITIVES.white }}>
              Agentic UI Chat
            </h1>
            <p className="text-xs" style={{ color: SLATE[400] }}>
              LLM → Intention → Resolution → Real Components
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Device toggle */}
          <button
            onClick={() => setIsMobileMode(!isMobileMode)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors"
            style={{
              backgroundColor: `${SLATE[700]}50`,
              color: SLATE[300],
            }}
          >
            {isMobileMode ? (
              <Smartphone className="w-4 h-4" />
            ) : (
              <Monitor className="w-4 h-4" />
            )}
            <span className="text-xs">{isMobileMode ? 'Mobile' : 'Desktop'}</span>
          </button>

          {/* JSON toggle */}
          <button
            onClick={() => setShowJson(!showJson)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors"
            style={{
              backgroundColor: showJson ? DUSK_REEF[500] : `${SLATE[700]}50`,
              color: showJson ? PRIMITIVES.white : SLATE[300],
            }}
          >
            {showJson ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            <span className="text-xs">JSON</span>
          </button>

          {/* Reset */}
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors"
            style={{
              backgroundColor: `${SLATE[700]}50`,
              color: SLATE[300],
            }}
          >
            <RefreshCw className="w-4 h-4" />
            <span className="text-xs">Reset</span>
          </button>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <div
              className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${HARBOR[500]}30 0%, ${DUSK_REEF[500]}30 100%)`,
              }}
            >
              <Bot className="w-8 h-8" style={{ color: HARBOR[400] }} />
            </div>
            <h2 className="text-lg font-medium mb-2" style={{ color: PRIMITIVES.white }}>
              Start a Conversation
            </h2>
            <p className="text-sm mb-4" style={{ color: SLATE[400] }}>
              Try asking:
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                'Help me book an appointment',
                'I want to leave feedback',
                'Set my priorities',
                'Delete my account',
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setInputValue(suggestion)}
                  className="px-3 py-1.5 rounded-full text-sm transition-colors"
                  style={{
                    backgroundColor: `${SLATE[700]}50`,
                    color: SLATE[300],
                  }}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`flex gap-3 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.role === 'assistant' && (
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: HARBOR[500] }}
                >
                  <Bot className="w-4 h-4" style={{ color: PRIMITIVES.white }} />
                </div>
              )}

              <div className={`flex flex-col gap-2 ${message.role === 'user' ? 'items-end' : 'items-start'} max-w-[70%]`}>
                {/* Message bubble */}
                <div
                  className="px-4 py-3 rounded-2xl"
                  style={{
                    backgroundColor: message.role === 'user' ? HARBOR[500] : `${SLATE[700]}80`,
                    color: PRIMITIVES.white,
                    borderRadius: message.role === 'user'
                      ? `${RADIUS.xl} ${RADIUS.xl} ${RADIUS.sm} ${RADIUS.xl}`
                      : `${RADIUS.xl} ${RADIUS.xl} ${RADIUS.xl} ${RADIUS.sm}`,
                  }}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>

                {/* Interactive UI from intention */}
                {message.resolution && (
                  <div
                    className="w-full p-4 rounded-xl"
                    style={{
                      backgroundColor: PRIMITIVES.white,
                      maxWidth: isMobileMode ? '100%' : '400px',
                    }}
                  >
                    <Materializer
                      resolution={message.resolution}
                      value={formValues[message.id]}
                      onChange={(v) => handleIntentionResponse(message.id, v)}
                    />
                  </div>
                )}

                {/* JSON debug view */}
                {showJson && message.intention && (
                  <div
                    className="w-full p-3 rounded-lg overflow-x-auto"
                    style={{
                      backgroundColor: `${ABYSS[600]}`,
                      border: `1px solid ${SLATE[700]}`,
                      maxWidth: '400px',
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Code2 className="w-3 h-3" style={{ color: DUSK_REEF[400] }} />
                      <span className="text-xs font-medium" style={{ color: DUSK_REEF[400] }}>
                        Intention JSON
                      </span>
                    </div>
                    <pre
                      className="text-xs font-mono overflow-x-auto"
                      style={{ color: SLATE[300] }}
                    >
                      {JSON.stringify(message.intention, null, 2)}
                    </pre>
                  </div>
                )}

                {/* Form value display */}
                {formValues[message.id] !== undefined && (
                  <div
                    className="px-3 py-2 rounded-lg"
                    style={{
                      backgroundColor: WAVE[50],
                      border: `1px solid ${WAVE[200]}`,
                    }}
                  >
                    <span className="text-xs" style={{ color: WAVE[700] }}>
                      Value: {JSON.stringify(formValues[message.id])}
                    </span>
                  </div>
                )}
              </div>

              {message.role === 'user' && (
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: DUSK_REEF[500] }}
                >
                  <User className="w-4 h-4" style={{ color: PRIMITIVES.white }} />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3"
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: HARBOR[500] }}
            >
              <Bot className="w-4 h-4" style={{ color: PRIMITIVES.white }} />
            </div>
            <div
              className="px-4 py-3 rounded-2xl flex items-center gap-2"
              style={{
                backgroundColor: `${SLATE[700]}80`,
                borderRadius: `${RADIUS.xl} ${RADIUS.xl} ${RADIUS.xl} ${RADIUS.sm}`,
              }}
            >
              <Loader2 className="w-4 h-4 animate-spin" style={{ color: SLATE[400] }} />
              <span className="text-sm" style={{ color: SLATE[400] }}>
                Thinking...
              </span>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div
        className="p-4 border-t"
        style={{ borderColor: `${SLATE[700]}50` }}
      >
        <div className="flex gap-3 max-w-3xl mx-auto">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1"
            style={{
              backgroundColor: `${SLATE[700]}50`,
              borderColor: 'transparent',
              color: PRIMITIVES.white,
            }}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            style={{
              backgroundColor: HARBOR[500],
              color: PRIMITIVES.white,
            }}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        {/* Collected form data */}
        {Object.keys(formValues).length > 0 && (
          <div
            className="mt-4 p-3 rounded-lg max-w-3xl mx-auto"
            style={{
              backgroundColor: `${SLATE[700]}30`,
              border: `1px solid ${SLATE[700]}50`,
            }}
          >
            <p className="text-xs font-medium mb-2" style={{ color: SLATE[400] }}>
              Collected Form Data
            </p>
            <pre
              className="text-xs font-mono overflow-x-auto"
              style={{ color: SLATE[300] }}
            >
              {JSON.stringify(formValues, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}

// =============================================================================
// STORY CONFIGURATION
// =============================================================================

const meta: Meta = {
  title: 'Agentic UI/LLM Chat Demo',
  ...ORGANISM_META,
  parameters: {
    ...ORGANISM_META.parameters,
    layout: 'fullscreen',
    docs: {
      description: {
        component: organismDescription(
          `A complete demonstration of the LLM-powered agentic UI system.

**The Complete Pipeline:**
1. **User Input** - User types natural language message
2. **LLM Processing** - Mock LLM outputs structured intention (JSON)
3. **Resolution** - System resolves intention with device/context constraints
4. **Materialization** - Appropriate DDS component rendered
5. **Interaction** - User interacts, value captured
6. **Continuation** - Conversation continues with context

**Try it:**
- Type "Help me book an appointment" - see time selection UI
- Type "I want to leave feedback" - see text input
- Type "Delete my account" - see confirmation dialog
- Toggle Mobile mode to see adaptive rendering
- Toggle JSON to see the raw intention structure`
        ),
      },
    },
  },
}

export default meta

type Story = StoryObj<typeof meta>

/**
 * Full chat interface with LLM-powered contextual UI generation.
 * Uses a mock LLM provider for demonstration purposes.
 */
export const Chat: Story = {
  render: () => <LLMChatDemoComponent />,
}
