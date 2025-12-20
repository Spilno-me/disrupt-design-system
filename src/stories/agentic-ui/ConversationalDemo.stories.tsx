/**
 * Conversational Demo - Universal Chat-UI Fusion
 *
 * A GENERIC conversational UI framework demonstrating:
 * - Chat messages ARE form fields (intention-driven)
 * - Conversation history IS form state
 * - Messages morph based on state (active → collapsed)
 * - Works for ANY conversation domain
 *
 * Uses DDS styling patterns with Lucide icons.
 */

import type { Meta, StoryObj } from '@storybook/react'
import * as React from 'react'
import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  ABYSS,
  DEEP_CURRENT,
  DUSK_REEF,
  HARBOR,
  SLATE,
  PRIMITIVES,
  RADIUS,
  SHADOWS,
} from '../../constants/designTokens'
import {
  Send,
  User,
  Bot,
  Check,
  CheckCircle2,
  Info,
  MessageSquare,
  Sparkles,
  ChevronRight,
  RotateCcw,
  Calendar,
  ShoppingCart,
  HelpCircle,
  Star,
  Clock,
  Package,
  CreditCard,
  ThumbsUp,
  ThumbsDown,
  Lightbulb,
  Layers,
} from 'lucide-react'
import { ORGANISM_META, organismDescription } from '../_infrastructure'

// =============================================================================
// CORE TYPES - Domain Agnostic
// =============================================================================

type MessageType = 'agent' | 'user'
type IntentionType = 'selection' | 'text' | 'confirmation' | 'rating' | 'info'
type MessageState = 'active' | 'collapsed' | 'complete'

interface SelectionOption {
  value: string
  label: string
  description?: string
  icon?: React.ReactNode
}

interface MessageIntention {
  type: IntentionType
  fieldKey: string
  label: string
  options?: SelectionOption[]
  required?: boolean
  min?: number
  max?: number
}

interface ChatMessage {
  id: string
  type: MessageType
  content: string
  timestamp: Date
  intention?: MessageIntention
  response?: string
  state: MessageState
}

interface ConversationStep {
  agentMessage: string
  intention: MessageIntention
  userResponseTemplate?: (response: string) => string
}

interface ConversationScenario {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  color: string
  bgColor: string
  assistantName: string
  steps: ConversationStep[]
}

type FormData = Record<string, string>

// =============================================================================
// EXAMPLE SCENARIOS - Demonstrate universality
// =============================================================================

const SCENARIOS: ConversationScenario[] = [
  {
    id: 'support',
    name: 'Customer Support',
    description: 'Technical help request',
    icon: <HelpCircle className="w-5 h-5" />,
    color: DEEP_CURRENT[600],
    bgColor: DEEP_CURRENT[50],
    assistantName: 'Support Assistant',
    steps: [
      {
        agentMessage: "Hi! I'm here to help. What type of issue are you experiencing?",
        intention: {
          type: 'selection',
          fieldKey: 'issueType',
          label: 'Issue Type',
          options: [
            { value: 'technical', label: 'Technical Issue', description: 'App not working', icon: <Package className="w-5 h-5" /> },
            { value: 'billing', label: 'Billing Question', description: 'Payment or invoice', icon: <CreditCard className="w-5 h-5" /> },
            { value: 'account', label: 'Account Help', description: 'Login or settings', icon: <User className="w-5 h-5" /> },
            { value: 'other', label: 'Other', description: 'Something else', icon: <HelpCircle className="w-5 h-5" /> },
          ],
        },
        userResponseTemplate: (r) => `I have a ${r} issue`,
      },
      {
        agentMessage: 'Got it. How urgent is this for you?',
        intention: {
          type: 'selection',
          fieldKey: 'urgency',
          label: 'Urgency',
          options: [
            { value: 'low', label: 'Low', description: 'When you can' },
            { value: 'medium', label: 'Medium', description: 'Soon please' },
            { value: 'high', label: 'High', description: 'Need help now' },
          ],
        },
        userResponseTemplate: (r) => `${r.charAt(0).toUpperCase() + r.slice(1)} priority`,
      },
      {
        agentMessage: 'Please describe the issue in detail so I can help you better.',
        intention: {
          type: 'text',
          fieldKey: 'description',
          label: 'Describe your issue...',
        },
      },
      {
        agentMessage: "Thanks for the details. I'll create a support ticket for you. Ready to submit?",
        intention: {
          type: 'confirmation',
          fieldKey: 'confirmed',
          label: 'Submit ticket',
        },
      },
    ],
  },
  {
    id: 'booking',
    name: 'Appointment Booking',
    description: 'Schedule a meeting',
    icon: <Calendar className="w-5 h-5" />,
    color: DUSK_REEF[600],
    bgColor: DUSK_REEF[50],
    assistantName: 'Booking Assistant',
    steps: [
      {
        agentMessage: "Let's schedule your appointment. What type of meeting?",
        intention: {
          type: 'selection',
          fieldKey: 'meetingType',
          label: 'Meeting Type',
          options: [
            { value: 'consultation', label: 'Consultation', description: '30 min call', icon: <MessageSquare className="w-5 h-5" /> },
            { value: 'demo', label: 'Product Demo', description: '45 min walkthrough', icon: <Layers className="w-5 h-5" /> },
            { value: 'followup', label: 'Follow-up', description: '15 min check-in', icon: <Clock className="w-5 h-5" /> },
          ],
        },
        userResponseTemplate: (r) => `I'd like to book a ${r}`,
      },
      {
        agentMessage: 'What day works best for you this week?',
        intention: {
          type: 'selection',
          fieldKey: 'preferredDay',
          label: 'Preferred Day',
          options: [
            { value: 'monday', label: 'Monday' },
            { value: 'tuesday', label: 'Tuesday' },
            { value: 'wednesday', label: 'Wednesday' },
            { value: 'thursday', label: 'Thursday' },
            { value: 'friday', label: 'Friday' },
          ],
        },
        userResponseTemplate: (r) => `${r.charAt(0).toUpperCase() + r.slice(1)} works for me`,
      },
      {
        agentMessage: 'Morning or afternoon?',
        intention: {
          type: 'selection',
          fieldKey: 'timeSlot',
          label: 'Time Preference',
          options: [
            { value: 'morning', label: 'Morning', description: '9am - 12pm' },
            { value: 'afternoon', label: 'Afternoon', description: '1pm - 5pm' },
          ],
        },
        userResponseTemplate: (r) => `${r.charAt(0).toUpperCase() + r.slice(1)} please`,
      },
      {
        agentMessage: 'Perfect! Should I confirm this booking?',
        intention: {
          type: 'confirmation',
          fieldKey: 'confirmed',
          label: 'Confirm booking',
        },
      },
    ],
  },
  {
    id: 'feedback',
    name: 'Product Feedback',
    description: 'Share your experience',
    icon: <Star className="w-5 h-5" />,
    color: HARBOR[600],
    bgColor: HARBOR[50],
    assistantName: 'Feedback Collector',
    steps: [
      {
        agentMessage: "We'd love your feedback! How would you rate your overall experience?",
        intention: {
          type: 'rating',
          fieldKey: 'overallRating',
          label: 'Overall Rating',
          min: 1,
          max: 5,
        },
      },
      {
        agentMessage: 'What aspect impressed you the most?',
        intention: {
          type: 'selection',
          fieldKey: 'bestAspect',
          label: 'Best Feature',
          options: [
            { value: 'ease', label: 'Ease of Use', description: 'Simple & intuitive', icon: <ThumbsUp className="w-5 h-5" /> },
            { value: 'speed', label: 'Performance', description: 'Fast & responsive', icon: <Clock className="w-5 h-5" /> },
            { value: 'design', label: 'Design', description: 'Looks great', icon: <Star className="w-5 h-5" /> },
            { value: 'features', label: 'Features', description: 'Powerful tools', icon: <Layers className="w-5 h-5" /> },
          ],
        },
        userResponseTemplate: (r) => `I liked the ${r} the most`,
      },
      {
        agentMessage: 'Any suggestions for improvement?',
        intention: {
          type: 'text',
          fieldKey: 'suggestions',
          label: 'Your suggestions...',
        },
      },
      {
        agentMessage: 'Thank you! Can I submit this feedback?',
        intention: {
          type: 'confirmation',
          fieldKey: 'confirmed',
          label: 'Submit feedback',
        },
      },
    ],
  },
  {
    id: 'order',
    name: 'Order Tracking',
    description: 'Check order status',
    icon: <ShoppingCart className="w-5 h-5" />,
    color: HARBOR[600],
    bgColor: HARBOR[50],
    assistantName: 'Order Assistant',
    steps: [
      {
        agentMessage: "I can help you track your order. What would you like to do?",
        intention: {
          type: 'selection',
          fieldKey: 'action',
          label: 'Action',
          options: [
            { value: 'status', label: 'Check Status', description: 'Where is my order?', icon: <Package className="w-5 h-5" /> },
            { value: 'modify', label: 'Modify Order', description: 'Change something', icon: <Layers className="w-5 h-5" /> },
            { value: 'cancel', label: 'Cancel Order', description: 'Cancel my order', icon: <ThumbsDown className="w-5 h-5" /> },
          ],
        },
        userResponseTemplate: (r) => `I want to ${r} my order`,
      },
      {
        agentMessage: 'Please enter your order number (e.g., ORD-12345)',
        intention: {
          type: 'text',
          fieldKey: 'orderNumber',
          label: 'Order number...',
        },
      },
      {
        agentMessage: 'Should I look this up for you now?',
        intention: {
          type: 'confirmation',
          fieldKey: 'confirmed',
          label: 'Look up order',
        },
      },
    ],
  },
]

// =============================================================================
// AGENT MESSAGE COMPONENT
// =============================================================================

interface AgentMessageProps {
  message: ChatMessage
  assistantName: string
  accentColor: string
  onResponse: (response: string) => void
}

function AgentMessage({ message, assistantName, accentColor, onResponse }: AgentMessageProps) {
  const { content, intention, state, response } = message

  if (state === 'collapsed' || state === 'complete') {
    return (
      <motion.div
        initial={{ opacity: 0.8 }}
        animate={{ opacity: 1 }}
        style={{ display: 'flex', gap: '12px', maxWidth: '85%' }}
      >
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: DEEP_CURRENT[100],
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Bot className="w-5 h-5" style={{ color: DEEP_CURRENT[600] }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div
            style={{
              padding: '10px 14px',
              backgroundColor: SLATE[100],
              borderRadius: RADIUS.md,
              fontSize: '14px',
              color: ABYSS[600],
            }}
          >
            {content.length > 60 ? content.slice(0, 60) + '...' : content}
          </div>

          {response && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
              <Check className="w-3.5 h-3.5" style={{ color: HARBOR[500] }} />
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  padding: '2px 8px',
                  backgroundColor: HARBOR[50],
                  color: HARBOR[700],
                  borderRadius: RADIUS.xs,
                }}
              >
                {response}
              </span>
            </div>
          )}
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ display: 'flex', gap: '12px', maxWidth: '90%' }}
    >
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: accentColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Bot className="w-5 h-5" style={{ color: PRIMITIVES.white }} />
        </div>
      </div>

      <div
        style={{
          flex: 1,
          backgroundColor: PRIMITIVES.white,
          borderRadius: RADIUS.md,
          border: `2px solid ${SLATE[200]}`,
          boxShadow: SHADOWS.sm,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: '10px 14px',
            background: `linear-gradient(135deg, ${SLATE[50]} 0%, ${PRIMITIVES.white} 100%)`,
            borderBottom: `1px solid ${SLATE[200]}`,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Sparkles className="w-4 h-4" style={{ color: accentColor }} />
          <span style={{ fontSize: '13px', fontWeight: 600, color: ABYSS[700] }}>
            {assistantName}
          </span>
        </div>

        <div style={{ padding: '16px' }}>
          <p style={{ fontSize: '14px', color: ABYSS[700], margin: intention ? '0 0 16px 0' : 0 }}>
            {content}
          </p>

          {intention?.type === 'selection' && intention.options && (
            <SelectionForm options={intention.options} onSelect={onResponse} />
          )}

          {intention?.type === 'text' && (
            <TextForm label={intention.label} onSubmit={onResponse} />
          )}

          {intention?.type === 'confirmation' && (
            <ConfirmationForm
              onConfirm={() => onResponse('confirmed')}
              onCancel={() => onResponse('cancelled')}
            />
          )}

          {intention?.type === 'rating' && (
            <RatingForm
              min={intention.min || 1}
              max={intention.max || 5}
              onRate={(rating) => onResponse(rating.toString())}
            />
          )}
        </div>
      </div>
    </motion.div>
  )
}

// =============================================================================
// SELECTION FORM
// =============================================================================

interface SelectionFormProps {
  options: SelectionOption[]
  onSelect: (value: string) => void
}

function SelectionForm({ options, onSelect }: SelectionFormProps) {
  const columns = options.length <= 3 ? options.length : 2

  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: '10px' }}>
      {options.map((option) => (
        <motion.button
          key={option.value}
          whileHover={{ y: -2, boxShadow: SHADOWS.md }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(option.value)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 14px',
            backgroundColor: SLATE[50],
            border: `2px solid ${SLATE[200]}`,
            borderRadius: RADIUS.sm,
            cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          {option.icon && (
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: RADIUS.sm,
                backgroundColor: SLATE[100],
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: ABYSS[500],
              }}
            >
              {option.icon}
            </div>
          )}
          <div>
            <div style={{ fontWeight: 600, fontSize: '14px', color: ABYSS[700] }}>
              {option.label}
            </div>
            {option.description && (
              <div style={{ fontSize: '12px', color: ABYSS[500] }}>
                {option.description}
              </div>
            )}
          </div>
        </motion.button>
      ))}
    </div>
  )
}

// =============================================================================
// TEXT FORM
// =============================================================================

interface TextFormProps {
  label: string
  onSubmit: (text: string) => void
}

function TextForm({ label, onSubmit }: TextFormProps) {
  const [value, setValue] = useState('')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={label}
        style={{
          width: '100%',
          minHeight: '80px',
          padding: '12px',
          fontSize: '14px',
          border: `2px solid ${SLATE[200]}`,
          borderRadius: RADIUS.sm,
          resize: 'vertical',
          fontFamily: 'inherit',
        }}
      />
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={() => value.trim() && onSubmit(value.trim())}
        disabled={!value.trim()}
        style={{
          alignSelf: 'flex-end',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '10px 18px',
          backgroundColor: value.trim() ? DEEP_CURRENT[500] : SLATE[200],
          color: value.trim() ? PRIMITIVES.white : SLATE[500],
          border: 'none',
          borderRadius: RADIUS.sm,
          cursor: value.trim() ? 'pointer' : 'not-allowed',
          fontWeight: 600,
          fontSize: '14px',
        }}
      >
        <Send className="w-4 h-4" />
        Submit
      </motion.button>
    </div>
  )
}

// =============================================================================
// RATING FORM
// =============================================================================

interface RatingFormProps {
  min: number
  max: number
  onRate: (rating: number) => void
}

function RatingForm({ min, max, onRate }: RatingFormProps) {
  const [hovered, setHovered] = useState<number | null>(null)
  const stars = Array.from({ length: max - min + 1 }, (_, i) => min + i)

  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      {stars.map((star) => (
        <motion.button
          key={star}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.95 }}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(null)}
          onClick={() => onRate(star)}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: RADIUS.sm,
            border: `2px solid ${hovered !== null && star <= hovered ? DEEP_CURRENT[400] : SLATE[200]}`,
            backgroundColor: hovered !== null && star <= hovered ? DEEP_CURRENT[50] : PRIMITIVES.white,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <Star
            className="w-5 h-5"
            fill={hovered !== null && star <= hovered ? DEEP_CURRENT[500] : 'none'}
            style={{ color: hovered !== null && star <= hovered ? DEEP_CURRENT[500] : SLATE[300] }}
          />
        </motion.button>
      ))}
    </div>
  )
}

// =============================================================================
// CONFIRMATION FORM
// =============================================================================

interface ConfirmationFormProps {
  onConfirm: () => void
  onCancel: () => void
}

function ConfirmationForm({ onConfirm, onCancel }: ConfirmationFormProps) {
  return (
    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={onCancel}
        style={{
          padding: '10px 18px',
          backgroundColor: SLATE[100],
          color: ABYSS[600],
          border: `1px solid ${SLATE[300]}`,
          borderRadius: RADIUS.sm,
          cursor: 'pointer',
          fontWeight: 600,
          fontSize: '14px',
        }}
      >
        Cancel
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={onConfirm}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '10px 18px',
          backgroundColor: HARBOR[500],
          color: PRIMITIVES.white,
          border: 'none',
          borderRadius: RADIUS.sm,
          cursor: 'pointer',
          fontWeight: 600,
          fontSize: '14px',
        }}
      >
        <CheckCircle2 className="w-4 h-4" />
        Confirm
      </motion.button>
    </div>
  )
}

// =============================================================================
// USER MESSAGE
// =============================================================================

interface UserMessageProps {
  message: ChatMessage
}

function UserMessage({ message }: UserMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        display: 'flex',
        gap: '12px',
        maxWidth: '75%',
        marginLeft: 'auto',
        flexDirection: 'row-reverse',
      }}
    >
      <div
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          backgroundColor: DUSK_REEF[500],
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <User className="w-5 h-5" style={{ color: PRIMITIVES.white }} />
      </div>

      <div
        style={{
          padding: '12px 16px',
          backgroundColor: DUSK_REEF[500],
          color: PRIMITIVES.white,
          borderRadius: `${RADIUS.md} ${RADIUS.md} ${RADIUS.xs} ${RADIUS.md}`,
          fontSize: '14px',
        }}
      >
        {message.content}
      </div>
    </motion.div>
  )
}

// =============================================================================
// FORM STATE PANEL - Generic
// =============================================================================

interface FormStatePanelProps {
  formData: FormData
  scenario: ConversationScenario
}

function FormStatePanel({ formData, scenario }: FormStatePanelProps) {
  const fieldKeys = scenario.steps.map((s) => s.intention.fieldKey)
  const completedCount = fieldKeys.filter((key) => formData[key]).length
  const totalFields = fieldKeys.length

  return (
    <div
      style={{
        backgroundColor: PRIMITIVES.white,
        borderRadius: RADIUS.md,
        border: `2px solid ${SLATE[200]}`,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          padding: '14px 16px',
          background: `linear-gradient(135deg, ${scenario.bgColor} 0%, ${PRIMITIVES.white} 100%)`,
          borderBottom: `2px solid ${SLATE[200]}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Layers className="w-5 h-5" style={{ color: scenario.color }} />
          <span style={{ fontWeight: 700, color: ABYSS[800] }}>Collected Data</span>
        </div>
        <span
          style={{
            fontSize: '12px',
            fontWeight: 600,
            padding: '4px 10px',
            backgroundColor: completedCount === totalFields ? HARBOR[100] : SLATE[100],
            color: completedCount === totalFields ? HARBOR[700] : SLATE[600],
            borderRadius: RADIUS.xs,
          }}
        >
          {completedCount}/{totalFields} fields
        </span>
      </div>

      <div style={{ padding: '8px' }}>
        {scenario.steps.map((step, index) => {
          const value = formData[step.intention.fieldKey]
          const hasValue = Boolean(value)

          return (
            <div
              key={step.intention.fieldKey}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px',
                borderRadius: RADIUS.sm,
                backgroundColor: index % 2 === 0 ? SLATE[50] : 'transparent',
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: RADIUS.sm,
                  backgroundColor: hasValue ? HARBOR[100] : SLATE[100],
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: hasValue ? HARBOR[600] : ABYSS[400],
                }}
              >
                {hasValue ? <Check className="w-4 h-4" /> : <Lightbulb className="w-4 h-4" />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: ABYSS[500] }}>
                  {step.intention.label}
                </div>
                <div
                  style={{
                    fontSize: '14px',
                    fontWeight: hasValue ? 600 : 400,
                    color: hasValue ? ABYSS[700] : ABYSS[400],
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {value || 'Awaiting input'}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// =============================================================================
// SCENARIO SELECTOR
// =============================================================================

interface ScenarioSelectorProps {
  scenarios: ConversationScenario[]
  selectedId: string | null
  onSelect: (scenario: ConversationScenario) => void
}

function ScenarioSelector({ scenarios, selectedId, onSelect }: ScenarioSelectorProps) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
      {scenarios.map((scenario) => (
        <motion.button
          key={scenario.id}
          whileHover={{ y: -2, boxShadow: SHADOWS.md }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(scenario)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            padding: '16px 12px',
            backgroundColor: selectedId === scenario.id ? scenario.bgColor : PRIMITIVES.white,
            border: `2px solid ${selectedId === scenario.id ? scenario.color : SLATE[200]}`,
            borderRadius: RADIUS.md,
            cursor: 'pointer',
          }}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: RADIUS.sm,
              backgroundColor: selectedId === scenario.id ? scenario.color : SLATE[100],
              color: selectedId === scenario.id ? PRIMITIVES.white : scenario.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {scenario.icon}
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 600, fontSize: '14px', color: ABYSS[700] }}>
              {scenario.name}
            </div>
            <div style={{ fontSize: '12px', color: ABYSS[500] }}>
              {scenario.description}
            </div>
          </div>
        </motion.button>
      ))}
    </div>
  )
}

// =============================================================================
// MAIN CONVERSATIONAL DEMO
// =============================================================================

function ConversationalDemo() {
  const [selectedScenario, setSelectedScenario] = useState<ConversationScenario | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [formData, setFormData] = useState<FormData>({})
  const [currentStep, setCurrentStep] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const startScenario = useCallback((scenario: ConversationScenario) => {
    setSelectedScenario(scenario)
    setFormData({})
    setCurrentStep(0)

    const firstStep = scenario.steps[0]
    const initialMessage: ChatMessage = {
      id: '1',
      type: 'agent',
      content: firstStep.agentMessage,
      timestamp: new Date(),
      intention: firstStep.intention,
      state: 'active',
    }
    setMessages([initialMessage])
  }, [])

  const resetDemo = useCallback(() => {
    setSelectedScenario(null)
    setMessages([])
    setFormData({})
    setCurrentStep(0)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleResponse = useCallback((messageId: string, response: string) => {
    if (!selectedScenario) return

    const currentStepData = selectedScenario.steps[currentStep]

    setMessages((prev) =>
      prev.map((m) =>
        m.id === messageId ? { ...m, state: 'collapsed' as MessageState, response } : m
      )
    )

    setFormData((prev) => ({ ...prev, [currentStepData.intention.fieldKey]: response }))

    const userContent = currentStepData.userResponseTemplate
      ? currentStepData.userResponseTemplate(response)
      : response

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `user-${Date.now()}`,
          type: 'user',
          content: userContent,
          timestamp: new Date(),
          state: 'complete',
        },
      ])
    }, 200)

    const nextStepIndex = currentStep + 1

    if (nextStepIndex < selectedScenario.steps.length) {
      const nextStep = selectedScenario.steps[nextStepIndex]

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: `agent-${Date.now()}`,
            type: 'agent',
            content: nextStep.agentMessage,
            timestamp: new Date(),
            intention: nextStep.intention,
            state: 'active',
          },
        ])
        setCurrentStep(nextStepIndex)
      }, 800)
    } else {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: `agent-${Date.now()}`,
            type: 'agent',
            content:
              response === 'confirmed'
                ? 'Done! Your request has been processed successfully.'
                : 'No problem. Let me know if you need anything else.',
            timestamp: new Date(),
            state: 'complete',
          },
        ])
      }, 800)
    }
  }, [selectedScenario, currentStep])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1000px' }}>
      {/* Header */}
      <div
        style={{
          padding: '24px',
          background: `linear-gradient(135deg, ${ABYSS[700]} 0%, ${DEEP_CURRENT[600]} 100%)`,
          borderRadius: RADIUS.lg,
          color: PRIMITIVES.white,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: RADIUS.md,
                backgroundColor: 'rgba(255,255,255,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h1 style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>Universal Chat-UI Fusion</h1>
              <p style={{ fontSize: '14px', opacity: 0.85, margin: 0 }}>
                Same engine, any conversation - messages ARE form fields
              </p>
            </div>
          </div>
          {selectedScenario && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetDemo}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                backgroundColor: 'rgba(255,255,255,0.15)',
                border: 'none',
                borderRadius: RADIUS.sm,
                color: PRIMITIVES.white,
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '13px',
              }}
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </motion.button>
          )}
        </div>
        <div
          style={{
            display: 'flex',
            gap: '24px',
            padding: '12px 16px',
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderRadius: RADIUS.sm,
            fontSize: '13px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bot className="w-4 h-4" />
            <span>Agent asks with intention</span>
          </div>
          <ChevronRight className="w-4 h-4" />
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User className="w-4 h-4" />
            <span>User responds</span>
          </div>
          <ChevronRight className="w-4 h-4" />
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers className="w-4 h-4" />
            <span>Form state updates</span>
          </div>
        </div>
      </div>

      {/* Scenario Selection or Chat */}
      {!selectedScenario ? (
        <div>
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: ABYSS[800], marginBottom: '16px' }}>
            Choose a conversation scenario
          </h2>
          <ScenarioSelector scenarios={SCENARIOS} selectedId={null} onSelect={startScenario} />

          <div
            style={{
              marginTop: '24px',
              padding: '16px 20px',
              backgroundColor: DUSK_REEF[50],
              borderRadius: RADIUS.md,
              border: `2px solid ${DUSK_REEF[200]}`,
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
            }}
          >
            <Info className="w-5 h-5" style={{ color: DUSK_REEF[500], flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontWeight: 600, color: ABYSS[800], marginBottom: '4px' }}>
                The Paradigm
              </div>
              <div style={{ fontSize: '14px', color: ABYSS[600] }}>
                Each scenario uses the SAME conversational engine. The only difference is the configuration -
                different intentions, different steps, different assistants. The UI adapts automatically.
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '24px' }}>
          {/* Chat Panel */}
          <div
            style={{
              height: '500px',
              backgroundColor: SLATE[50],
              borderRadius: RADIUS.md,
              border: `2px solid ${SLATE[200]}`,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: '14px 18px',
                backgroundColor: PRIMITIVES.white,
                borderBottom: `2px solid ${SLATE[200]}`,
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: selectedScenario.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Bot className="w-4 h-4" style={{ color: PRIMITIVES.white }} />
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '14px', color: ABYSS[800] }}>
                  {selectedScenario.assistantName}
                </div>
                <div style={{ fontSize: '12px', color: HARBOR[500] }}>Online</div>
              </div>
            </div>

            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
            >
              <AnimatePresence>
                {messages.map((message) =>
                  message.type === 'agent' ? (
                    <AgentMessage
                      key={message.id}
                      message={message}
                      assistantName={selectedScenario.assistantName}
                      accentColor={selectedScenario.color}
                      onResponse={(response) => handleResponse(message.id, response)}
                    />
                  ) : (
                    <UserMessage key={message.id} message={message} />
                  )
                )}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Form State Panel */}
          <FormStatePanel formData={formData} scenario={selectedScenario} />
        </div>
      )}
    </div>
  )
}

// =============================================================================
// STORYBOOK META & STORIES
// =============================================================================

const meta: Meta = {
  title: 'Agentic UI/Conversational Demo',
  ...ORGANISM_META,
  parameters: {
    ...ORGANISM_META.parameters,
    layout: 'padded',
    docs: {
      description: {
        component: organismDescription(
          `A **universal conversational UI framework** that works for ANY conversation domain.

## The Paradigm
- **Messages ARE form fields** - each agent question is a form input
- **Conversation IS form state** - the chat history contains all data
- **Messages morph** - active questions collapse after response
- **Domain agnostic** - same engine powers support, booking, feedback, orders

## Available Scenarios
1. **Customer Support** - Technical help requests
2. **Appointment Booking** - Schedule meetings
3. **Product Feedback** - Collect user experiences
4. **Order Tracking** - Check order status

## Key Insight
The traditional distinction between "chat" and "form" dissolves.
The conversation IS the form, and the form IS the conversation.
One engine, infinite applications.`
        ),
      },
    },
  },
}

export default meta

export const Default: StoryObj = {
  name: 'Universal Chat-UI',
  render: () => <ConversationalDemo />,
}
