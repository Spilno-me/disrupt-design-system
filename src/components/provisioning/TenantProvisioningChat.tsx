"use client"

import * as React from "react"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "motion/react"
import { cn } from "../../lib/utils"
import { Button } from "../ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"
import {
  DEEP_CURRENT,
  ABYSS,
  WAVE,
  CORAL,
  SLATE,
  PRIMITIVES,
  ALIAS,
  RADIUS,
} from "../../constants/designTokens"
import {
  Send,
  ArrowLeft,
  Building2,
  User,
  MapPin,
  CreditCard,
  Check,
  Loader2,
  Save,
  X,
  Edit3,
  AlertCircle,
} from "lucide-react"

// =============================================================================
// AGENT LOGO COMPONENT
// =============================================================================

const logoPositions = {
  large: { x: 52, y: 0, width: 81, height: 81, rx: 11 },
  medium: { x: 46, y: 127, width: 41, height: 41, rx: 4 },
  small: { x: 0, y: 87, width: 23, height: 23, rx: 3 },
}

const logoColors = {
  dark: {
    large: DEEP_CURRENT[500],
    medium: PRIMITIVES.cream,
    small: CORAL[500],
  },
  light: {
    large: DEEP_CURRENT[500],
    medium: ABYSS[500],
    small: CORAL[500],
  },
}

type LogoState = "idle" | "thinking" | "planning" | "executing" | "complete"
type LogoVariant = "dark" | "light"

interface AgentLogoProps {
  className?: string
  state?: LogoState
  variant?: LogoVariant
}

function AgentLogo({ className, state = "idle", variant = "dark" }: AgentLogoProps) {
  const colors = logoColors[variant]

  if (state === "complete") {
    const centerX = 66.5
    const centerY = 84

    return (
      <svg viewBox="-15 -15 163 198" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <motion.rect
          fill={colors.large}
          initial={{ x: centerX - 20, y: centerY - 20, width: 40, height: 40, rx: 20 }}
          animate={{ x: logoPositions.large.x, y: logoPositions.large.y, width: logoPositions.large.width, height: logoPositions.large.height, rx: logoPositions.large.rx }}
          transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
        />
        <motion.rect
          fill={colors.medium}
          initial={{ x: centerX - 15, y: centerY - 15, width: 30, height: 30, rx: 15 }}
          animate={{ x: logoPositions.medium.x, y: logoPositions.medium.y, width: logoPositions.medium.width, height: logoPositions.medium.height, rx: logoPositions.medium.rx }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.34, 1.56, 0.64, 1] }}
        />
        <motion.rect
          fill={colors.small}
          initial={{ x: centerX - 10, y: centerY - 10, width: 20, height: 20, rx: 10 }}
          animate={{ x: logoPositions.small.x, y: logoPositions.small.y, width: logoPositions.small.width, height: logoPositions.small.height, rx: logoPositions.small.rx }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
        />
      </svg>
    )
  }

  if (state === "thinking") {
    const centerX = 66.5, centerY = 84, orbitRadius = 35, dotSize = 18, cycleDuration = 2.5
    return (
      <svg viewBox="-15 -15 163 198" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <motion.circle fill={colors.large} r={dotSize / 2}
          animate={{ cx: [centerX + orbitRadius, centerX, centerX - orbitRadius, centerX, centerX + orbitRadius], cy: [centerY, centerY - orbitRadius, centerY, centerY + orbitRadius, centerY] }}
          transition={{ duration: cycleDuration, repeat: Infinity, ease: "linear" }}
        />
        <motion.circle fill={colors.medium} r={dotSize / 2}
          animate={{ cx: [centerX - orbitRadius * 0.5, centerX + orbitRadius * 0.866, centerX - orbitRadius * 0.5, centerX - orbitRadius * 0.866, centerX - orbitRadius * 0.5], cy: [centerY - orbitRadius * 0.866, centerY + orbitRadius * 0.5, centerY + orbitRadius * 0.866, centerY - orbitRadius * 0.5, centerY - orbitRadius * 0.866] }}
          transition={{ duration: cycleDuration, repeat: Infinity, ease: "linear" }}
        />
        <motion.circle fill={colors.small} r={dotSize / 2}
          animate={{ cx: [centerX - orbitRadius * 0.5, centerX - orbitRadius * 0.866, centerX + orbitRadius * 0.5, centerX + orbitRadius * 0.866, centerX - orbitRadius * 0.5], cy: [centerY + orbitRadius * 0.866, centerY - orbitRadius * 0.5, centerY - orbitRadius * 0.866, centerY + orbitRadius * 0.5, centerY + orbitRadius * 0.866] }}
          transition={{ duration: cycleDuration, repeat: Infinity, ease: "linear" }}
        />
      </svg>
    )
  }

  if (state === "planning") {
    const dotSize = 14, lineHeight = 14, leftX = 15, lineMaxWidth = 100, rowSpacing = 30, centerY = 84, cycleDuration = 3
    const rows = [{ y: centerY - rowSpacing }, { y: centerY }, { y: centerY + rowSpacing }]
    return (
      <svg viewBox="-15 -15 163 198" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <motion.rect fill={colors.large}
          initial={{ x: logoPositions.large.x, y: logoPositions.large.y, width: logoPositions.large.width, height: logoPositions.large.height, rx: logoPositions.large.rx }}
          animate={{ x: leftX, y: rows[0].y - lineHeight / 2, width: [dotSize, lineMaxWidth, lineMaxWidth, dotSize], height: lineHeight, rx: lineHeight / 2 }}
          transition={{ x: { duration: 0.4 }, y: { duration: 0.4 }, height: { duration: 0.4 }, rx: { duration: 0.4 }, width: { duration: cycleDuration, repeat: Infinity, ease: "easeInOut", times: [0, 0.25, 0.75, 1], delay: 0.4 } }}
        />
        <motion.rect fill={colors.medium}
          initial={{ x: logoPositions.medium.x, y: logoPositions.medium.y, width: logoPositions.medium.width, height: logoPositions.medium.height, rx: logoPositions.medium.rx }}
          animate={{ x: leftX, y: rows[1].y - lineHeight / 2, width: [dotSize, lineMaxWidth * 0.7, lineMaxWidth * 0.7, dotSize], height: lineHeight, rx: lineHeight / 2 }}
          transition={{ x: { duration: 0.4 }, y: { duration: 0.4 }, height: { duration: 0.4 }, rx: { duration: 0.4 }, width: { duration: cycleDuration, repeat: Infinity, ease: "easeInOut", times: [0, 0.25, 0.75, 1], delay: 0.7 } }}
        />
        <motion.rect fill={colors.small}
          initial={{ x: logoPositions.small.x, y: logoPositions.small.y, width: logoPositions.small.width, height: logoPositions.small.height, rx: logoPositions.small.rx }}
          animate={{ x: leftX, y: rows[2].y - lineHeight / 2, width: [dotSize, lineMaxWidth * 0.85, lineMaxWidth * 0.85, dotSize], height: lineHeight, rx: lineHeight / 2 }}
          transition={{ x: { duration: 0.4 }, y: { duration: 0.4 }, height: { duration: 0.4 }, rx: { duration: 0.4 }, width: { duration: cycleDuration, repeat: Infinity, ease: "easeInOut", times: [0, 0.25, 0.75, 1], delay: 1.0 } }}
        />
      </svg>
    )
  }

  if (state === "executing") {
    const centerX = 66.5, centerY = 84, orbitRadius = 35, dotSize = 18, cycleDuration = 0.8
    return (
      <svg viewBox="-15 -15 163 198" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <motion.circle fill={colors.large} r={dotSize / 2}
          animate={{ cx: [centerX + orbitRadius, centerX, centerX - orbitRadius, centerX, centerX + orbitRadius], cy: [centerY, centerY - orbitRadius, centerY, centerY + orbitRadius, centerY] }}
          transition={{ duration: cycleDuration, repeat: Infinity, ease: "linear" }}
        />
        <motion.circle fill={colors.medium} r={dotSize / 2}
          animate={{ cx: [centerX - orbitRadius * 0.5, centerX + orbitRadius * 0.866, centerX - orbitRadius * 0.5, centerX - orbitRadius * 0.866, centerX - orbitRadius * 0.5], cy: [centerY - orbitRadius * 0.866, centerY + orbitRadius * 0.5, centerY + orbitRadius * 0.866, centerY - orbitRadius * 0.5, centerY - orbitRadius * 0.866] }}
          transition={{ duration: cycleDuration, repeat: Infinity, ease: "linear" }}
        />
        <motion.circle fill={colors.small} r={dotSize / 2}
          animate={{ cx: [centerX - orbitRadius * 0.5, centerX - orbitRadius * 0.866, centerX + orbitRadius * 0.5, centerX + orbitRadius * 0.866, centerX - orbitRadius * 0.5], cy: [centerY + orbitRadius * 0.866, centerY - orbitRadius * 0.5, centerY - orbitRadius * 0.866, centerY + orbitRadius * 0.5, centerY + orbitRadius * 0.866] }}
          transition={{ duration: cycleDuration, repeat: Infinity, ease: "linear" }}
        />
      </svg>
    )
  }

  // Idle state
  return (
    <svg viewBox="-15 -15 163 198" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <motion.rect x={logoPositions.large.x} y={logoPositions.large.y} width={logoPositions.large.width} height={logoPositions.large.height} rx={logoPositions.large.rx} fill={colors.large}
        animate={{ scale: [1, 1.12, 1], opacity: [1, 0.7, 1], y: [0, -3, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }} style={{ transformOrigin: "center", transformBox: "fill-box" }}
      />
      <motion.rect x={logoPositions.medium.x} y={logoPositions.medium.y} width={logoPositions.medium.width} height={logoPositions.medium.height} rx={logoPositions.medium.rx} fill={colors.medium}
        animate={{ scale: [1, 1.18, 1], opacity: [1, 0.65, 1], y: [0, 4, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }} style={{ transformOrigin: "center", transformBox: "fill-box" }}
      />
      <motion.rect x={logoPositions.small.x} y={logoPositions.small.y} width={logoPositions.small.width} height={logoPositions.small.height} rx={logoPositions.small.rx} fill={colors.small}
        animate={{ scale: [1, 1.25, 1], opacity: [1, 0.6, 1], x: [0, 3, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }} style={{ transformOrigin: "center", transformBox: "fill-box" }}
      />
    </svg>
  )
}

// =============================================================================
// TYPES
// =============================================================================

export interface TenantFormData {
  companyName: string
  industry: string
  companySize: string
  contactEmail: string
  contactName: string
  contactPhone: string
  billingStreet: string
  billingCity: string
  billingState: string
  billingZip: string
  billingCountry: string
  pricingTier: string
  billingCycle: string
}

export interface TenantProvisioningChatProps {
  onComplete: (tenantData: TenantFormData) => void
  onCancel?: () => void
  onSaveProgress?: (data: Partial<TenantFormData>, step: string) => void
  initialData?: Partial<TenantFormData>
  className?: string
}

type MessageRole = "assistant" | "user"
type AgentState = "idle" | "thinking" | "planning" | "executing" | "complete"

interface ChatMessage {
  id: string
  role: MessageRole
  content: string
  timestamp: Date
}

type ChatStep =
  | "companyName"
  | "industry"
  | "companySize"
  | "contactEmail"
  | "contactName"
  | "contactPhone"
  | "billingStreet"
  | "billingCity"
  | "billingState"
  | "billingZip"
  | "billingCountry"
  | "pricingTier"
  | "billingCycle"
  | "review"
  | "creating"
  | "complete"

interface StepConfig {
  field: keyof TenantFormData | "review"
  question: string | ((data: Partial<TenantFormData>) => string)
  inputType: "text" | "email" | "tel" | "quickReply" | "select" | "review"
  options?: string[]
  placeholder?: string
  label: string
}

// =============================================================================
// CONSTANTS
// =============================================================================

const US_STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY", "DC"
]

const COUNTRIES = [
  "United States", "Canada", "United Kingdom", "Australia", "Germany",
  "France", "Japan", "Singapore", "Netherlands", "Switzerland"
]

const STEPS: Record<ChatStep, StepConfig | null> = {
  companyName: {
    field: "companyName",
    question: "Welcome! Let's set up a new tenant. What's the company name?",
    inputType: "text",
    placeholder: "Enter company name...",
    label: "Company Name",
  },
  industry: {
    field: "industry",
    question: (data) => `Great! What industry is ${data.companyName || "the company"} in?`,
    inputType: "quickReply",
    options: ["Manufacturing", "Healthcare", "Construction", "Energy", "Transportation", "Other"],
    label: "Industry",
  },
  companySize: {
    field: "companySize",
    question: "How many employees does the company have?",
    inputType: "quickReply",
    options: ["1-50", "51-200", "201-500", "501-1000", "1000+"],
    label: "Company Size",
  },
  contactEmail: {
    field: "contactEmail",
    question: "What's the email address of the primary contact?",
    inputType: "email",
    placeholder: "contact@company.com",
    label: "Contact Email",
  },
  contactName: {
    field: "contactName",
    question: "What's their full name?",
    inputType: "text",
    placeholder: "John Doe",
    label: "Contact Name",
  },
  contactPhone: {
    field: "contactPhone",
    question: "And their phone number?",
    inputType: "tel",
    placeholder: "+1 555 123 4567",
    label: "Contact Phone",
  },
  billingStreet: {
    field: "billingStreet",
    question: "Now let's set up billing. What's the street address?",
    inputType: "text",
    placeholder: "123 Main St, Suite 100",
    label: "Street Address",
  },
  billingCity: {
    field: "billingCity",
    question: "What city?",
    inputType: "text",
    placeholder: "New York",
    label: "City",
  },
  billingState: {
    field: "billingState",
    question: "Which US state?",
    inputType: "select",
    options: US_STATES,
    label: "State",
  },
  billingZip: {
    field: "billingZip",
    question: (data) => data.billingCountry === "United States" ? "What's the ZIP code?" : "What's the postal code?",
    inputType: "text",
    placeholder: "10001",
    label: "Postal/ZIP Code",
  },
  billingCountry: {
    field: "billingCountry",
    question: "Which country?",
    inputType: "select",
    options: COUNTRIES,
    label: "Country",
  },
  pricingTier: {
    field: "pricingTier",
    question: "Configure the pricing package:",
    inputType: "quickReply",
    options: ["Starter", "Professional", "Enterprise"],
    label: "Pricing Tier",
  },
  billingCycle: {
    field: "billingCycle",
    question: "How would they like to be billed?",
    inputType: "quickReply",
    options: ["Monthly", "Annually (Save 20%)"],
    label: "Billing Cycle",
  },
  review: {
    field: "review",
    question: "Please review the tenant details before creating:",
    inputType: "review",
    label: "Review",
  },
  creating: null,
  complete: null,
}

const STEP_ORDER: ChatStep[] = [
  "companyName", "industry", "companySize", "contactEmail",
  "contactName", "contactPhone", "billingStreet", "billingCity",
  "billingCountry", "billingState", "billingZip", "pricingTier",
  "billingCycle", "review"
]

// =============================================================================
// VALIDATION HELPERS
// =============================================================================

function formatPhoneNumber(value: string): string {
  // Allow + at the start and digits only
  // Don't auto-format - let user enter their country code
  return value
}

function validatePhone(phone: string): boolean {
  // Must start with + followed by country code and number (minimum 10 digits total)
  const cleaned = phone.replace(/[\s()-]/g, "")
  return /^\+\d{10,15}$/.test(cleaned)
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function validateZip(zip: string): boolean {
  return /^\d{5}(-\d{4})?$/.test(zip)
}

// =============================================================================
// PROGRESS BAR COMPONENT
// =============================================================================

interface ProgressBarProps {
  currentStep: number
  totalSteps: number
  stepLabel: string
}

function ProgressBar({ currentStep, totalSteps, stepLabel }: ProgressBarProps) {
  const percentage = Math.round((currentStep / totalSteps) * 100)

  return (
    <div className="px-4 py-2" style={{ backgroundColor: DEEP_CURRENT[50], borderBottom: `1px solid ${SLATE[200]}` }}>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-semibold" style={{ color: DEEP_CURRENT[700] }}>
          Step {currentStep} of {totalSteps}: {stepLabel}
        </span>
        <span className="text-xs font-medium" style={{ color: DEEP_CURRENT[500] }}>
          {percentage}%
        </span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: DEEP_CURRENT[100] }}>
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: DEEP_CURRENT[500] }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>
    </div>
  )
}

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

interface QuickReplyButtonsProps {
  options: string[]
  onSelect: (option: string) => void
}

function QuickReplyButtons({ options, onSelect }: QuickReplyButtonsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap gap-2 mt-2 ml-12"
    >
      {options.map((option, index) => (
        <motion.button
          key={option}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(option)}
          className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-colors"
          style={{
            backgroundColor: PRIMITIVES.white,
            color: DEEP_CURRENT[600],
            border: `1px dashed ${DEEP_CURRENT[300]}`,
            borderRadius: RADIUS.md,
          }}
        >
          {option}
        </motion.button>
      ))}
    </motion.div>
  )
}

interface SelectOptionsProps {
  options: string[]
  onSelect: (option: string) => void
  label: string
}

function SelectOptions({ options, onSelect, label }: SelectOptionsProps) {
  const [selectedValue, setSelectedValue] = useState("")

  const handleSelect = (value: string) => {
    setSelectedValue(value)
    onSelect(value)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-2 ml-12"
    >
      <div
        className="p-3 inline-block min-w-[200px]"
        style={{
          backgroundColor: PRIMITIVES.white,
          border: `1px dashed ${DEEP_CURRENT[300]}`,
          borderRadius: RADIUS.md,
        }}
      >
        <Select value={selectedValue} onValueChange={handleSelect}>
          <SelectTrigger className="text-sm">
            <SelectValue placeholder={`Select ${label.toLowerCase()}...`} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option} value={option}>{option}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </motion.div>
  )
}

interface ChatBubbleProps {
  message: ChatMessage
  isLatest?: boolean
}

function ChatBubble({ message, isLatest }: ChatBubbleProps) {
  const isUser = message.role === "user"

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn("flex gap-2", isUser ? "ml-auto flex-row-reverse max-w-[80%]" : "mr-auto max-w-[85%]")}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0 w-8 h-8">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden"
          style={{ backgroundColor: isUser ? CORAL[50] : WAVE[50] }}
        >
          {isUser ? (
            <User className="w-4 h-4" style={{ color: CORAL[500] }} />
          ) : (
            <AgentLogo className="w-5 h-5" variant="light" />
          )}
        </div>
        {!isUser && (
          <motion.svg
            className="absolute -inset-0.5 w-9 h-9"
            viewBox="0 0 36 36"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <circle cx="18" cy="18" r="17" fill="none" stroke={DEEP_CURRENT[200]} strokeWidth="1" strokeDasharray="2 2" />
          </motion.svg>
        )}
      </div>

      {/* Bubble */}
      <div
        className="px-3 py-2"
        style={{
          backgroundColor: isUser ? CORAL[50] : WAVE[50],
          color: ABYSS[700],
          borderRadius: isUser ? `${RADIUS.md} ${RADIUS.md} ${RADIUS.xs} ${RADIUS.md}` : `${RADIUS.md} ${RADIUS.md} ${RADIUS.md} ${RADIUS.xs}`,
        }}
      >
        <p className="text-sm leading-relaxed">{message.content}</p>
      </div>
    </motion.div>
  )
}

interface ReviewScreenProps {
  data: Partial<TenantFormData>
  onEdit: (step: ChatStep) => void
  onConfirm: () => void
  isSubmitting: boolean
}

function ReviewScreen({ data, onEdit, onConfirm, isSubmitting }: ReviewScreenProps) {
  const sections = [
    {
      title: "Company Information",
      icon: <Building2 className="w-4 h-4" />,
      items: [
        { label: "Company Name", value: data.companyName, step: "companyName" as ChatStep },
        { label: "Industry", value: data.industry, step: "industry" as ChatStep },
        { label: "Company Size", value: data.companySize, step: "companySize" as ChatStep },
      ],
    },
    {
      title: "Contact Details",
      icon: <User className="w-4 h-4" />,
      items: [
        { label: "Name", value: data.contactName, step: "contactName" as ChatStep },
        { label: "Email", value: data.contactEmail, step: "contactEmail" as ChatStep },
        { label: "Phone", value: data.contactPhone, step: "contactPhone" as ChatStep },
      ],
    },
    {
      title: "Billing Address",
      icon: <MapPin className="w-4 h-4" />,
      items: [
        { label: "Street", value: data.billingStreet, step: "billingStreet" as ChatStep },
        { label: "City", value: data.billingCity, step: "billingCity" as ChatStep },
        { label: "Country", value: data.billingCountry, step: "billingCountry" as ChatStep },
        // Only show State for US addresses
        ...(data.billingCountry === "United States" ? [{ label: "State", value: data.billingState, step: "billingState" as ChatStep }] : []),
        { label: data.billingCountry === "United States" ? "ZIP" : "Postal Code", value: data.billingZip, step: "billingZip" as ChatStep },
      ],
    },
    {
      title: "Subscription",
      icon: <CreditCard className="w-4 h-4" />,
      items: [
        { label: "Plan", value: data.pricingTier, step: "pricingTier" as ChatStep },
        { label: "Billing Cycle", value: data.billingCycle, step: "billingCycle" as ChatStep },
      ],
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-2 ml-12"
    >
      <div
        className="overflow-hidden"
        style={{
          backgroundColor: PRIMITIVES.white,
          border: `1px dashed ${SLATE[300]}`,
          borderRadius: RADIUS.md,
        }}
      >
        {/* Header */}
        <div
          className="px-4 py-3 flex items-center gap-2"
          style={{ backgroundColor: DEEP_CURRENT[50], borderBottom: `1px dashed ${SLATE[300]}` }}
        >
          <Check className="w-4 h-4" style={{ color: DEEP_CURRENT[500] }} />
          <span className="text-sm font-semibold" style={{ color: DEEP_CURRENT[700] }}>
            Review Tenant Details
          </span>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {sections.map((section) => (
            <div key={section.title}>
              <div className="flex items-center gap-2 mb-2">
                <span style={{ color: DEEP_CURRENT[500] }}>{section.icon}</span>
                <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: ABYSS[500] }}>
                  {section.title}
                </span>
              </div>
              <div className="space-y-1.5 ml-6">
                {section.items.map((item) => (
                  <div key={item.label} className="flex items-center justify-between group">
                    <div className="flex-1 min-w-0">
                      <span className="text-xs" style={{ color: ABYSS[400] }}>{item.label}: </span>
                      <span className="text-sm font-medium" style={{ color: ABYSS[700] }}>{item.value || "—"}</span>
                    </div>
                    <button
                      onClick={() => onEdit(item.step)}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded transition-opacity"
                      style={{ color: DEEP_CURRENT[500] }}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="px-4 pb-4 pt-2">
          <Button
            onClick={onConfirm}
            disabled={isSubmitting}
            className="w-full font-medium"
            style={{
              backgroundColor: DEEP_CURRENT[500],
              color: PRIMITIVES.white,
              borderRadius: RADIUS.md,
            }}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating Tenant...
              </>
            ) : (
              <>
                <Check className="w-4 h-4 mr-2" />
                Create Tenant
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

interface TenantSummaryCardProps {
  data: TenantFormData
}

function TenantSummaryCard({ data }: TenantSummaryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mt-2 ml-12"
    >
      <div
        className="p-4 flex items-start gap-3"
        style={{
          backgroundColor: DEEP_CURRENT[50],
          border: `1px solid ${DEEP_CURRENT[200]}`,
          borderRadius: RADIUS.md,
        }}
      >
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: DEEP_CURRENT[500] }}
        >
          <Check className="w-4 h-4 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-sm" style={{ color: DEEP_CURRENT[700] }}>
            Tenant Created Successfully!
          </h3>
          <p className="text-sm mt-1" style={{ color: ABYSS[600] }}>
            <strong>{data.companyName}</strong> has been provisioned with the <strong>{data.pricingTier}</strong> plan.
          </p>
          <p className="text-xs mt-2" style={{ color: ABYSS[400] }}>
            A welcome email has been sent to {data.contactEmail}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

interface ThinkingIndicatorProps {
  state: AgentState
}

function ThinkingIndicator({ state }: ThinkingIndicatorProps) {
  if (state !== "thinking" && state !== "planning" && state !== "executing") return null

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
      <div className="relative w-8 h-8">
        <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: WAVE[50] }}>
          <AgentLogo className="w-5 h-5" state={state} variant="light" />
        </div>
        <motion.svg className="absolute -inset-0.5 w-9 h-9" viewBox="0 0 36 36" animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}>
          <circle cx="18" cy="18" r="17" fill="none" stroke={DEEP_CURRENT[400]} strokeWidth="1" strokeDasharray="3 2" />
        </motion.svg>
      </div>
      <span className="text-xs font-medium" style={{ color: ABYSS[400] }}>
        {state === "thinking" && "Analyzing..."}
        {state === "planning" && "Planning..."}
        {state === "executing" && "Processing..."}
      </span>
    </motion.div>
  )
}

interface ConfirmationCardProps {
  value: string
  label: string
  onConfirm: () => void
  onEdit: () => void
}

function ConfirmationCard({ value, label, onConfirm, onEdit }: ConfirmationCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-2 ml-12 max-w-sm"
    >
      <div
        className="overflow-hidden"
        style={{
          backgroundColor: DEEP_CURRENT[50],
          border: `1px solid ${DEEP_CURRENT[200]}`,
          borderRadius: RADIUS.md,
        }}
      >
        {/* Header */}
        <div
          className="px-3 py-2 flex items-center gap-2"
          style={{ backgroundColor: DEEP_CURRENT[100], borderBottom: `1px solid ${DEEP_CURRENT[200]}` }}
        >
          <AlertCircle className="w-3.5 h-3.5" style={{ color: DEEP_CURRENT[600] }} />
          <span className="text-xs font-medium" style={{ color: DEEP_CURRENT[700] }}>
            Confirm your answer
          </span>
        </div>

        {/* Content */}
        <div className="p-3">
          <div className="mb-2.5">
            <span className="text-xs" style={{ color: ABYSS[500] }}>{label}</span>
            <p className="text-sm font-medium mt-0.5" style={{ color: ABYSS[700] }}>{value}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
              className="flex-1 h-8 text-xs"
              noEffect
            >
              <Edit3 className="w-3 h-3 mr-1" />
              Edit
            </Button>
            <Button
              variant="accent"
              size="sm"
              onClick={onConfirm}
              className="flex-1 h-8 text-xs"
              noEffect
            >
              <Check className="w-3 h-3 mr-1" />
              Confirm
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function TenantProvisioningChat({
  onComplete,
  onCancel,
  onSaveProgress,
  initialData,
  className,
}: TenantProvisioningChatProps) {
  const [currentStep, setCurrentStep] = useState<ChatStep>("companyName")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState("")
  const [formData, setFormData] = useState<Partial<TenantFormData>>(initialData || {})
  const [agentState, setAgentState] = useState<AgentState>("idle")
  const [showExitDialog, setShowExitDialog] = useState(false)
  const [inputError, setInputError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [pendingValue, setPendingValue] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const lastAddedStepRef = useRef<ChatStep | null>(null)
  const formDataRef = useRef<Partial<TenantFormData>>({})

  const currentStepIndex = STEP_ORDER.indexOf(currentStep)
  const totalSteps = STEP_ORDER.length
  const stepConfig = STEPS[currentStep]

  useEffect(() => { formDataRef.current = formData }, [formData])

  // Add assistant message for current step
  useEffect(() => {
    if (lastAddedStepRef.current === currentStep) return
    const config = STEPS[currentStep]
    if (config) {
      const simulateReasoning = async () => {
        if (currentStep !== "companyName") {
          setAgentState("thinking")
          await new Promise((r) => setTimeout(r, 400))
          setAgentState("planning")
          await new Promise((r) => setTimeout(r, 300))
          setAgentState("executing")
          await new Promise((r) => setTimeout(r, 200))
        }
        const question = typeof config.question === "function" ? config.question(formDataRef.current) : config.question
        setMessages((prev) => [...prev, { id: `assistant-${Date.now()}`, role: "assistant", content: question, timestamp: new Date() }])
        lastAddedStepRef.current = currentStep
        setAgentState("idle")
      }
      simulateReasoning()
    }
  }, [currentStep])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, agentState])

  useEffect(() => {
    if (stepConfig?.inputType === "text" || stepConfig?.inputType === "email" || stepConfig?.inputType === "tel") {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [currentStep, stepConfig?.inputType])

  const addUserMessage = (content: string) => {
    setMessages((prev) => [...prev, { id: `user-${Date.now()}`, role: "user", content, timestamp: new Date() }])
  }

  const goToNextStep = () => {
    const idx = STEP_ORDER.indexOf(currentStep)
    if (idx < STEP_ORDER.length - 1) {
      let nextStep = STEP_ORDER[idx + 1]
      // Skip state step if country is not United States
      if (nextStep === "billingState" && formDataRef.current.billingCountry !== "United States") {
        nextStep = STEP_ORDER[idx + 2] // Skip to billingZip
      }
      setCurrentStep(nextStep)
    }
  }

  const goToStep = (step: ChatStep) => {
    lastAddedStepRef.current = null
    setCurrentStep(step)
  }

  const handleCreateTenant = async () => {
    setIsSubmitting(true)
    setAgentState("executing")
    await new Promise((r) => setTimeout(r, 1500))
    const completeData = formData as TenantFormData
    setMessages((prev) => [...prev, { id: `assistant-success-${Date.now()}`, role: "assistant", content: `Tenant '${completeData.companyName}' has been created successfully!`, timestamp: new Date() }])
    setCurrentStep("complete")
    setAgentState("complete")
    setIsSubmitting(false)
    setTimeout(() => setAgentState("idle"), 2000)
    onComplete(completeData)
  }

  const validateInput = (value: string): string | null => {
    if (!value.trim()) return "This field is required"
    if (stepConfig?.inputType === "email" && !validateEmail(value)) {
      return "Please enter a valid email address (e.g., name@company.com)"
    }
    if (stepConfig?.inputType === "tel" && !validatePhone(value)) {
      return "Please enter a valid phone number with country code (e.g., +1 555 123 4567)"
    }
    if (currentStep === "billingZip") {
      // Only validate US ZIP format for United States
      if (formDataRef.current.billingCountry === "United States" && !validateZip(value)) {
        return "Please enter a valid ZIP code (e.g., 12345 or 12345-6789)"
      }
      // For other countries, just require some postal code
      if (!value.trim()) {
        return "Please enter a postal/ZIP code"
      }
    }
    return null
  }

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const error = validateInput(inputValue)
    if (error) {
      setInputError(error)
      return
    }
    if (!stepConfig) return
    // Set pending value for confirmation instead of immediately proceeding
    setPendingValue(inputValue)
    setInputValue("")
    setInputError(null)
  }

  const handleQuickReplySelect = (option: string) => {
    if (!stepConfig) return
    // Set pending value for confirmation instead of immediately proceeding
    setPendingValue(option)
  }

  const handleBack = () => {
    if (Object.keys(formData).length > 0) {
      setShowExitDialog(true)
    } else {
      onCancel?.()
    }
  }

  const handleConfirmValue = () => {
    if (!stepConfig || !pendingValue) return
    addUserMessage(pendingValue)
    setFormData((prev) => ({ ...prev, [stepConfig.field]: pendingValue }))
    setPendingValue(null)
    goToNextStep()
  }

  const handleEditValue = () => {
    // Clear pending value and let user re-enter
    if (!pendingValue) return
    // For text/email/tel inputs, put the value back in the input field for editing
    if (stepConfig?.inputType === "text" || stepConfig?.inputType === "email" || stepConfig?.inputType === "tel") {
      setInputValue(pendingValue)
    }
    setPendingValue(null)
  }

  const handleSaveAndExit = () => {
    onSaveProgress?.(formData, currentStep)
    setShowExitDialog(false)
    onCancel?.()
  }

  const getStatusText = () => {
    switch (agentState) {
      case "thinking": return "Analyzing..."
      case "planning": return "Planning..."
      case "executing": return "Processing..."
      case "complete": return "Complete!"
      default: return "Ready to help"
    }
  }

  return (
    <>
      <div
        className={cn("h-full w-full flex flex-col overflow-hidden", className)}
        style={{ backgroundColor: PRIMITIVES.white }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3" style={{ backgroundColor: PRIMITIVES.white, borderBottom: `1px solid ${SLATE[200]}` }}>
          <div className="flex items-center gap-3">
            {onCancel && (
              <button onClick={handleBack} className="p-1.5 rounded-lg transition-colors hover:bg-slate-100" title="Exit (progress will be saved)">
                <ArrowLeft className="w-4 h-4" style={{ color: SLATE[500] }} />
              </button>
            )}
            <div className="relative w-10 h-10">
              <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden" style={{ backgroundColor: WAVE[50] }}>
                <AgentLogo className="w-7 h-7" state={agentState} variant="light" />
              </div>
              <motion.svg
                className="absolute -inset-0.5 w-11 h-11"
                viewBox="0 0 44 44"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <circle cx="22" cy="22" r="21" fill="none" stroke={DEEP_CURRENT[300]} strokeWidth="1" strokeDasharray="3 2" />
              </motion.svg>
            </div>
            <div>
              <h3 className="font-semibold text-sm" style={{ color: ALIAS.text.primary }}>Tenant Setup Assistant</h3>
              <p className="text-xs" style={{ color: DEEP_CURRENT[500] }}>{getStatusText()}</p>
            </div>
          </div>
          {onSaveProgress && currentStepIndex > 0 && currentStep !== "complete" && (
            <button
              onClick={() => setShowExitDialog(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors hover:bg-slate-100"
              style={{ color: SLATE[600] }}
            >
              <Save className="w-3.5 h-3.5" />
              Save & Exit
            </button>
          )}
        </div>

        {/* Progress Bar */}
        {currentStepIndex >= 0 && currentStepIndex < totalSteps && (
          <ProgressBar
            currentStep={currentStepIndex + 1}
            totalSteps={totalSteps}
            stepLabel={stepConfig?.label || ""}
          />
        )}

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <AnimatePresence mode="popLayout">
            {messages.map((message, idx) => (
              <ChatBubble key={message.id} message={message} isLatest={idx === messages.length - 1} />
            ))}
          </AnimatePresence>

          <ThinkingIndicator state={agentState} />

          {/* Confirmation Card for pending values */}
          {pendingValue && stepConfig && (
            <ConfirmationCard
              value={pendingValue}
              label={stepConfig.label}
              onConfirm={handleConfirmValue}
              onEdit={handleEditValue}
            />
          )}

          {/* Only show quick replies if no pending value */}
          {stepConfig?.inputType === "quickReply" && stepConfig.options && agentState === "idle" && !pendingValue && (
            <QuickReplyButtons options={stepConfig.options} onSelect={handleQuickReplySelect} />
          )}

          {/* Select options (for state/country dropdowns) */}
          {stepConfig?.inputType === "select" && stepConfig.options && agentState === "idle" && !pendingValue && (
            <SelectOptions options={stepConfig.options} onSelect={handleQuickReplySelect} label={stepConfig.label} />
          )}

          {stepConfig?.inputType === "review" && agentState === "idle" && (
            <ReviewScreen data={formData} onEdit={goToStep} onConfirm={handleCreateTenant} isSubmitting={isSubmitting} />
          )}

          {currentStep === "complete" && formData.companyName && (
            <TenantSummaryCard data={formData as TenantFormData} />
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area - hide when there's a pending value awaiting confirmation */}
        {(stepConfig?.inputType === "text" || stepConfig?.inputType === "email" || stepConfig?.inputType === "tel") && agentState === "idle" && !pendingValue && (
          <div className="p-3" style={{ backgroundColor: PRIMITIVES.white, borderTop: `1px solid ${SLATE[200]}` }}>
            <form onSubmit={handleTextSubmit} className="space-y-2" noValidate>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => {
                      let val = e.target.value
                      // For phone: allow +, digits, spaces, parentheses, dashes
                      if (stepConfig.inputType === "tel") {
                        val = val.replace(/[^\d\s()+-]/g, "").slice(0, 20)
                      }
                      setInputValue(val)
                      setInputError(null)
                    }}
                    placeholder={stepConfig.placeholder || "Type your response..."}
                    className={cn(
                      "w-full px-4 py-2.5 text-sm focus:outline-none transition-colors",
                      inputError && "border-error"
                    )}
                    style={{
                      backgroundColor: PRIMITIVES.white,
                      border: `1px solid ${inputError ? CORAL[500] : SLATE[300]}`,
                      borderRadius: RADIUS.md,
                      color: ALIAS.text.primary,
                    }}
                  />
                  {inputError && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <AlertCircle className="w-4 h-4" style={{ color: CORAL[500] }} />
                    </div>
                  )}
                </div>
                <motion.button
                  type="submit"
                  disabled={!inputValue.trim()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                  style={{
                    backgroundColor: inputValue.trim() ? DEEP_CURRENT[500] : SLATE[100],
                    color: inputValue.trim() ? PRIMITIVES.white : SLATE[400],
                  }}
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              </div>
              {/* Styled validation error message */}
              <AnimatePresence>
                {inputError && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="flex items-center gap-2 px-3 py-2 rounded-md"
                    style={{
                      backgroundColor: CORAL[50],
                      border: `1px solid ${CORAL[200]}`,
                    }}
                  >
                    <AlertCircle className="w-4 h-4 flex-shrink-0" style={{ color: CORAL[500] }} />
                    <p className="text-sm" style={{ color: CORAL[700] }}>{inputError}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>
        )}
      </div>

      {/* Exit Confirmation Dialog */}
      <Dialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Save your progress?</DialogTitle>
            <DialogDescription>
              You can save your progress and continue later, or discard all changes.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:gap-2">
            <Button variant="outline" onClick={() => { setShowExitDialog(false); onCancel?.() }}>
              <X className="w-4 h-4 mr-2" />
              Discard
            </Button>
            <Button variant="accent" onClick={handleSaveAndExit}>
              <Save className="w-4 h-4 mr-2" />
              Save & Exit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default TenantProvisioningChat
