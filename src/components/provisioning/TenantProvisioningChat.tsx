"use client"

import * as React from "react"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "motion/react"
import { cn } from "../../lib/utils"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
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
import { AgentLogo } from "../shared/AgentLogo"
import {
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
  Lightbulb,
  ChevronRight,
  Sparkles,
} from "lucide-react"

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

// Re-export for backwards compatibility
export type TenantChatFormData = TenantFormData

export interface TenantProvisioningChatProps {
  onComplete: (tenantData: TenantFormData) => void
  onCancel?: () => void
  onSaveProgress?: (data: Partial<TenantFormData>, section: string) => void
  initialData?: Partial<TenantFormData>
  className?: string
}

type AgentState = "idle" | "thinking" | "planning" | "executing" | "complete"

type SectionId = "company" | "contact" | "billing" | "subscription" | "review"

interface FormSection {
  id: SectionId
  title: string
  icon: React.ReactNode
  fields: (keyof TenantFormData)[]
  aiTip?: (data: Partial<TenantFormData>) => string | null
}

interface ChatMessage {
  id: string
  type: "assistant" | "user-summary" | "ai-tip" | "form-card" | "review" | "success"
  content: string
  sectionId?: SectionId
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

const INDUSTRIES = ["Manufacturing", "Healthcare", "Construction", "Energy", "Transportation", "Other"]
const COMPANY_SIZES = ["1-50", "51-200", "201-500", "501-1000", "1000+"]
const PRICING_TIERS = ["Starter", "Professional", "Enterprise"]
const BILLING_CYCLES = ["Monthly", "Annually (Save 20%)"]

const SECTIONS: FormSection[] = [
  {
    id: "company",
    title: "Company Information",
    icon: <Building2 className="w-4 h-4" />,
    fields: ["companyName", "industry", "companySize"],
    aiTip: (data) => {
      if (data.industry === "Manufacturing") {
        return "Manufacturing companies often benefit from our compliance modules. I'll make sure those are available in your setup."
      }
      if (data.industry === "Healthcare") {
        return "Healthcare organizations have specific HIPAA compliance needs. Our Professional tier includes healthcare-specific features."
      }
      if (data.companySize === "1000+") {
        return "Enterprise-scale companies often benefit from dedicated support. Consider our Enterprise tier for priority assistance."
      }
      return null
    }
  },
  {
    id: "contact",
    title: "Primary Contact",
    icon: <User className="w-4 h-4" />,
    fields: ["contactName", "contactEmail", "contactPhone"],
    aiTip: (data) => {
      if (data.contactEmail && data.companyName) {
        return `A welcome email will be sent to ${data.contactEmail} once the tenant is created.`
      }
      return null
    }
  },
  {
    id: "billing",
    title: "Billing Address",
    icon: <MapPin className="w-4 h-4" />,
    fields: ["billingStreet", "billingCity", "billingCountry", "billingState", "billingZip"],
  },
  {
    id: "subscription",
    title: "Subscription",
    icon: <CreditCard className="w-4 h-4" />,
    fields: ["pricingTier", "billingCycle"],
    aiTip: (data) => {
      if (data.billingCycle === "Annually (Save 20%)") {
        return "Great choice! Annual billing saves you 20% compared to monthly payments."
      }
      if (data.pricingTier === "Enterprise" && data.companySize && ["1-50", "51-200"].includes(data.companySize)) {
        return "The Enterprise tier is typically for larger organizations. You might find the Professional tier more cost-effective for your team size."
      }
      return null
    }
  }
]

const SECTION_MESSAGES: Record<SectionId, string> = {
  company: "Let's start with your company details. Fill in what you know — I'll help with the rest.",
  contact: "Now let's set up the primary contact for this tenant.",
  billing: "Almost there! I need the billing address for invoices.",
  subscription: "Finally, choose your pricing plan.",
  review: "Here's a summary of the tenant you're about to create. Review and confirm when ready."
}

// =============================================================================
// VALIDATION HELPERS
// =============================================================================

function validatePhone(phone: string): boolean {
  if (!phone) return true // Optional field
  const cleaned = phone.replace(/[\s()-]/g, "")
  return /^\+?\d{10,15}$/.test(cleaned)
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function validateZip(zip: string, country: string): boolean {
  if (country === "United States") {
    return /^\d{5}(-\d{4})?$/.test(zip)
  }
  return zip.length > 0
}

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

interface ChatBubbleProps {
  children: React.ReactNode
  variant?: "assistant" | "tip" | "summary"
}

function ChatBubble({ children, variant = "assistant" }: ChatBubbleProps) {
  // Dark mode: Use neutral abyss backgrounds instead of saturated colors
  const bubbleClasses = variant === "tip"
    ? "bg-info-light dark:bg-muted-bg border border-info/30 dark:border-accent/30"
    : variant === "summary"
      ? "bg-error-light dark:bg-muted-bg border border-error/30 dark:border-error/30"
      : "bg-info-light dark:bg-muted-bg"

  const icon = variant === "tip" ? (
    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-info-muted dark:bg-muted-bg">
      <Lightbulb className="w-4 h-4 text-accent" />
    </div>
  ) : variant === "summary" ? (
    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-error-muted dark:bg-muted-bg">
      <User className="w-4 h-4 text-error" />
    </div>
  ) : (
    <div className="relative w-8 h-8">
      <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden bg-info-light dark:bg-muted-bg">
        <AgentLogo className="w-5 h-5" variant="light" />
      </div>
    </div>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex gap-3 max-w-[90%]"
    >
      <div className="flex-shrink-0">{icon}</div>
      <div
        className={cn(
          "px-4 py-3 text-sm leading-relaxed text-primary rounded-xl rounded-bl-sm",
          bubbleClasses
        )}
      >
        {children}
      </div>
    </motion.div>
  )
}

interface FormCardProps {
  section: FormSection
  data: Partial<TenantFormData>
  onChange: (field: keyof TenantFormData, value: string) => void
  onSubmit: () => void
  errors: Partial<Record<keyof TenantFormData, string>>
}

function FormCard({ section, data, onChange, onSubmit, errors }: FormCardProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit()
  }

  const renderField = (field: keyof TenantFormData) => {
    const value = data[field] || ""
    const error = errors[field]

    // Skip state field for non-US countries
    if (field === "billingState" && data.billingCountry !== "United States") {
      return null
    }

    const fieldConfig: Record<keyof TenantFormData, { label: string; type: string; placeholder: string; options?: string[] }> = {
      companyName: { label: "Company Name", type: "text", placeholder: "Acme Corporation" },
      industry: { label: "Industry", type: "select", placeholder: "Select industry...", options: INDUSTRIES },
      companySize: { label: "Company Size", type: "radio", placeholder: "", options: COMPANY_SIZES },
      contactName: { label: "Full Name", type: "text", placeholder: "John Smith" },
      contactEmail: { label: "Email Address", type: "email", placeholder: "john@company.com" },
      contactPhone: { label: "Phone (optional)", type: "tel", placeholder: "+1 555 123 4567" },
      billingStreet: { label: "Street Address", type: "text", placeholder: "123 Main St, Suite 100" },
      billingCity: { label: "City", type: "text", placeholder: "New York" },
      billingCountry: { label: "Country", type: "select", placeholder: "Select country...", options: COUNTRIES },
      billingState: { label: "State", type: "select", placeholder: "Select state...", options: US_STATES },
      billingZip: { label: data.billingCountry === "United States" ? "ZIP Code" : "Postal Code", type: "text", placeholder: "10001" },
      pricingTier: { label: "Pricing Plan", type: "plan", placeholder: "", options: PRICING_TIERS },
      billingCycle: { label: "Billing Cycle", type: "cycle", placeholder: "", options: BILLING_CYCLES },
    }

    const config = fieldConfig[field]

    if (config.type === "select" && config.options) {
      return (
        <div key={field} className="space-y-1.5">
          <Label className="text-xs font-medium text-secondary">{config.label}</Label>
          <Select value={value} onValueChange={(v) => onChange(field, v)}>
            <SelectTrigger className={cn("h-10", error && "border-error")}>
              <SelectValue placeholder={config.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {config.options.map((opt) => (
                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {error && <p className="text-xs text-error">{error}</p>}
        </div>
      )
    }

    if (config.type === "radio" && config.options) {
      return (
        <div key={field} className="space-y-2">
          <Label className="text-xs font-medium text-secondary">{config.label}</Label>
          <div className="flex flex-wrap gap-2">
            {config.options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => onChange(field, opt)}
                className={cn(
                  "px-3 py-2 text-sm font-medium transition-all rounded-sm border",
                  value === opt
                    ? "bg-info-light dark:bg-muted-bg text-accent border-accent/50 ring-2 ring-accent ring-offset-1"
                    : "bg-surface text-primary border-default hover:bg-surface-hover"
                )}
              >
                {opt}
              </button>
            ))}
          </div>
          {error && <p className="text-xs text-error">{error}</p>}
        </div>
      )
    }

    if (config.type === "plan" && config.options) {
      const planDetails: Record<string, { price: string; desc: string }> = {
        "Starter": { price: "$299/mo", desc: "Essential features for small teams" },
        "Professional": { price: "$599/mo", desc: "Advanced tools for growing businesses" },
        "Enterprise": { price: "$1,299/mo", desc: "Full platform with dedicated support" },
      }
      return (
        <div key={field} className="space-y-2">
          <Label className="text-xs font-medium text-secondary">{config.label}</Label>
          <div className="grid gap-2">
            {config.options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => onChange(field, opt)}
                className={cn(
                  "p-3 text-left transition-all flex items-center justify-between rounded-md border",
                  value === opt
                    ? "bg-info-light dark:bg-muted-bg border-accent/50 ring-2 ring-accent ring-offset-1"
                    : "bg-surface border-default hover:bg-surface-hover"
                )}
              >
                <div>
                  <div className="font-medium text-sm text-primary">{opt}</div>
                  <div className="text-xs text-secondary">{planDetails[opt]?.desc}</div>
                </div>
                <div className="text-sm font-semibold text-accent">{planDetails[opt]?.price}</div>
              </button>
            ))}
          </div>
          {error && <p className="text-xs text-error">{error}</p>}
        </div>
      )
    }

    if (config.type === "cycle" && config.options) {
      return (
        <div key={field} className="space-y-2">
          <Label className="text-xs font-medium text-secondary">{config.label}</Label>
          <div className="flex gap-2">
            {config.options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => onChange(field, opt)}
                className={cn(
                  "flex-1 px-4 py-3 text-sm font-medium transition-all rounded-md border",
                  value === opt
                    ? "bg-info-light dark:bg-muted-bg text-accent border-accent/50 ring-2 ring-accent ring-offset-1"
                    : "bg-surface text-primary border-default hover:bg-surface-hover"
                )}
              >
                {opt}
              </button>
            ))}
          </div>
          {error && <p className="text-xs text-error">{error}</p>}
        </div>
      )
    }

    return (
      <div key={field} className="space-y-1.5">
        <Label className="text-xs font-medium text-secondary">{config.label}</Label>
        <Input
          type={config.type}
          value={value}
          onChange={(e) => onChange(field, e.target.value)}
          placeholder={config.placeholder}
          className={cn("h-10", error && "border-error")}
        />
        {error && <p className="text-xs text-error">{error}</p>}
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="ml-11"
    >
      <form onSubmit={handleSubmit}>
        <div className="overflow-hidden bg-surface border border-default rounded-lg shadow-sm">
          {/* Header */}
          <div className="px-4 py-3 flex items-center gap-2 bg-info-light dark:bg-muted-bg border-b border-default">
            <span className="text-accent">{section.icon}</span>
            <span className="text-sm font-semibold text-accent">
              {section.title}
            </span>
          </div>

          {/* Form Fields */}
          <div className="p-4 space-y-4">
            {section.fields.map(renderField)}
          </div>

          {/* Submit */}
          <div className="px-4 pb-4">
            <Button
              type="submit"
              variant="accent"
              className="w-full font-medium"
            >
              Continue
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </form>
    </motion.div>
  )
}

interface ReviewScreenProps {
  data: Partial<TenantFormData>
  onEdit: (sectionId: SectionId) => void
  onConfirm: () => void
  isSubmitting: boolean
}

function ReviewScreen({ data, onEdit, onConfirm, isSubmitting }: ReviewScreenProps) {
  const reviewSections = [
    {
      id: "company" as SectionId,
      title: "Company Information",
      icon: <Building2 className="w-4 h-4" />,
      items: [
        { label: "Company Name", value: data.companyName },
        { label: "Industry", value: data.industry },
        { label: "Company Size", value: data.companySize },
      ],
    },
    {
      id: "contact" as SectionId,
      title: "Primary Contact",
      icon: <User className="w-4 h-4" />,
      items: [
        { label: "Name", value: data.contactName },
        { label: "Email", value: data.contactEmail },
        { label: "Phone", value: data.contactPhone || "—" },
      ],
    },
    {
      id: "billing" as SectionId,
      title: "Billing Address",
      icon: <MapPin className="w-4 h-4" />,
      items: [
        { label: "Street", value: data.billingStreet },
        { label: "City", value: data.billingCity },
        { label: "Country", value: data.billingCountry },
        ...(data.billingCountry === "United States" ? [{ label: "State", value: data.billingState }] : []),
        { label: data.billingCountry === "United States" ? "ZIP" : "Postal Code", value: data.billingZip },
      ],
    },
    {
      id: "subscription" as SectionId,
      title: "Subscription",
      icon: <CreditCard className="w-4 h-4" />,
      items: [
        { label: "Plan", value: data.pricingTier },
        { label: "Billing Cycle", value: data.billingCycle },
      ],
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="ml-11"
    >
      <div className="overflow-hidden bg-surface border border-default rounded-lg shadow-sm">
        {/* Header */}
        <div className="px-4 py-3 flex items-center gap-2 bg-info-light dark:bg-muted-bg border-b border-default">
          <Check className="w-4 h-4 text-accent" />
          <span className="text-sm font-semibold text-accent">
            Review Tenant Details
          </span>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {reviewSections.map((section) => (
            <div key={section.id} className="group">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-accent">{section.icon}</span>
                  <span className="text-xs font-semibold uppercase tracking-wide text-accent">
                    {section.title}
                  </span>
                </div>
                <button
                  onClick={() => onEdit(section.id)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded transition-all hover:bg-surface-hover text-accent"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="space-y-1 ml-6">
                {section.items.map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <span className="text-xs text-secondary">{item.label}:</span>
                    <span className="text-sm font-medium text-primary">{item.value || "—"}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="px-4 pb-4">
          <Button
            onClick={onConfirm}
            disabled={isSubmitting}
            variant="accent"
            className="w-full font-medium"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating Tenant...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Create Tenant
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

interface SuccessCardProps {
  data: TenantFormData
}

function SuccessCard({ data }: SuccessCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="ml-11"
    >
      <div className="p-4 flex items-start gap-3 bg-success-light dark:bg-muted-bg border border-success/30 rounded-lg">
        <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-success">
          <Check className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-success">
            Tenant Created Successfully!
          </h3>
          <p className="text-sm mt-1 text-primary">
            <strong>{data.companyName}</strong> has been provisioned with the <strong>{data.pricingTier}</strong> plan.
          </p>
          <p className="text-xs mt-2 text-secondary">
            A welcome email has been sent to {data.contactEmail}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

interface ProgressBarProps {
  currentSection: number
  totalSections: number
}

function ProgressBar({ currentSection, totalSections }: ProgressBarProps) {
  const percentage = Math.round(((currentSection) / totalSections) * 100)

  return (
    <div className="px-4 py-2 bg-info-light dark:bg-muted-bg border-b border-default">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-semibold text-accent">
          Section {currentSection} of {totalSections}
        </span>
        <span className="text-xs font-medium text-accent">
          {percentage}%
        </span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden bg-info-muted dark:bg-muted-bg">
        <motion.div
          className="h-full rounded-full bg-accent"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>
    </div>
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
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [formData, setFormData] = useState<Partial<TenantFormData>>(initialData || {})
  const [errors, setErrors] = useState<Partial<Record<keyof TenantFormData, string>>>({})
  const [agentState, setAgentState] = useState<AgentState>("idle")
  const [showExitDialog, setShowExitDialog] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const initializedRef = useRef(false)

  const currentSection = SECTIONS[currentSectionIndex]
  const isReviewStep = currentSectionIndex >= SECTIONS.length

  // Initialize with welcome message
  useEffect(() => {
    if (initializedRef.current) return
    initializedRef.current = true

    const initChat = async () => {
      setAgentState("thinking")
      await new Promise((r) => setTimeout(r, 300))

      setMessages([
        {
          id: "welcome",
          type: "assistant",
          content: "Welcome! I'll help you set up a new tenant. This will only take a few minutes — just 4 quick sections.",
        },
        {
          id: "section-0",
          type: "assistant",
          content: SECTION_MESSAGES.company,
          sectionId: "company",
        },
      ])
      setAgentState("idle")
    }

    initChat()
  }, [])

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, currentSectionIndex])

  const validateSection = (section: FormSection): boolean => {
    const newErrors: Partial<Record<keyof TenantFormData, string>> = {}
    let isValid = true

    for (const field of section.fields) {
      // Skip state for non-US
      if (field === "billingState" && formData.billingCountry !== "United States") {
        continue
      }

      const value = formData[field] || ""

      // Required field check (phone is optional)
      if (field !== "contactPhone" && !value.trim()) {
        newErrors[field] = "This field is required"
        isValid = false
        continue
      }

      // Specific validations
      if (field === "contactEmail" && !validateEmail(value)) {
        newErrors[field] = "Please enter a valid email address"
        isValid = false
      }
      if (field === "contactPhone" && value && !validatePhone(value)) {
        newErrors[field] = "Please enter a valid phone number"
        isValid = false
      }
      if (field === "billingZip" && !validateZip(value, formData.billingCountry || "")) {
        newErrors[field] = formData.billingCountry === "United States"
          ? "Please enter a valid ZIP code (e.g., 12345)"
          : "Please enter a valid postal code"
        isValid = false
      }
    }

    setErrors(newErrors)
    return isValid
  }

  const handleFieldChange = (field: keyof TenantFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSectionSubmit = async () => {
    if (!validateSection(currentSection)) return

    // Add user summary message
    const summaryParts = currentSection.fields
      .filter((f) => f !== "billingState" || formData.billingCountry === "United States")
      .map((f) => formData[f])
      .filter(Boolean)

    const newMessages: ChatMessage[] = [
      {
        id: `summary-${currentSection.id}`,
        type: "user-summary",
        content: summaryParts.join(" • "),
        sectionId: currentSection.id,
      },
    ]

    // Check for AI tip
    if (currentSection.aiTip) {
      const tip = currentSection.aiTip(formData)
      if (tip) {
        newMessages.push({
          id: `tip-${currentSection.id}`,
          type: "ai-tip",
          content: tip,
        })
      }
    }

    setMessages((prev) => [...prev, ...newMessages])

    // Move to next section
    await new Promise((r) => setTimeout(r, 200))
    setAgentState("thinking")
    await new Promise((r) => setTimeout(r, 400))

    const nextIndex = currentSectionIndex + 1
    if (nextIndex < SECTIONS.length) {
      const nextSection = SECTIONS[nextIndex]
      setMessages((prev) => [
        ...prev,
        {
          id: `section-${nextIndex}`,
          type: "assistant",
          content: SECTION_MESSAGES[nextSection.id],
          sectionId: nextSection.id,
        },
      ])
      setCurrentSectionIndex(nextIndex)
    } else {
      // Show review
      setMessages((prev) => [
        ...prev,
        {
          id: "review-intro",
          type: "assistant",
          content: SECTION_MESSAGES.review,
          sectionId: "review",
        },
      ])
      setCurrentSectionIndex(nextIndex)
    }

    setAgentState("idle")
    onSaveProgress?.(formData, currentSection.id)
  }

  const handleEditSection = (sectionId: SectionId) => {
    const index = SECTIONS.findIndex((s) => s.id === sectionId)
    if (index >= 0) {
      setCurrentSectionIndex(index)
      setMessages((prev) => [
        ...prev,
        {
          id: `edit-${sectionId}-${Date.now()}`,
          type: "assistant",
          content: `Let's update the ${SECTIONS[index].title.toLowerCase()}.`,
          sectionId,
        },
      ])
    }
  }

  const handleCreateTenant = async () => {
    setIsSubmitting(true)
    setAgentState("executing")
    await new Promise((r) => setTimeout(r, 1500))

    const completeData = formData as TenantFormData
    setMessages((prev) => [
      ...prev,
      {
        id: "success",
        type: "success",
        content: `Tenant "${completeData.companyName}" has been created successfully!`,
      },
    ])

    setIsComplete(true)
    setAgentState("complete")
    setIsSubmitting(false)
    setTimeout(() => setAgentState("idle"), 2000)
    onComplete(completeData)
  }

  const handleBack = () => {
    if (Object.keys(formData).length > 0) {
      setShowExitDialog(true)
    } else {
      onCancel?.()
    }
  }

  const handleSaveAndExit = () => {
    onSaveProgress?.(formData, currentSection?.id || "company")
    setShowExitDialog(false)
    onCancel?.()
  }

  const getStatusText = () => {
    switch (agentState) {
      case "thinking": return "Processing..."
      case "planning": return "Planning..."
      case "executing": return "Creating tenant..."
      case "complete": return "Complete!"
      default: return "Ready to help"
    }
  }

  return (
    <>
      <div
        className={cn("h-full w-full flex flex-col overflow-hidden bg-surface", className)}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-surface border-b border-default">
          <div className="flex items-center gap-3">
            {onCancel && (
              <button onClick={handleBack} className="p-1.5 rounded-lg transition-colors hover:bg-surface-hover text-muted" title="Exit">
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div className="relative w-10 h-10">
              <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden bg-info-light dark:bg-muted-bg">
                <AgentLogo className="w-7 h-7" state={agentState} variant="light" />
              </div>
              <motion.svg
                className="absolute -inset-0.5 w-11 h-11 text-accent/50 dark:text-accent/30"
                viewBox="0 0 44 44"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <circle cx="22" cy="22" r="21" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 2" />
              </motion.svg>
            </div>
            <div>
              <h3 className="font-semibold text-sm text-primary">Tenant Setup Assistant</h3>
              <p className="text-xs text-accent dark:text-info">{getStatusText()}</p>
            </div>
          </div>
          {onSaveProgress && currentSectionIndex > 0 && !isComplete && (
            <button
              onClick={() => setShowExitDialog(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors hover:bg-surface-hover text-secondary"
            >
              <Save className="w-3.5 h-3.5" />
              Save & Exit
            </button>
          )}
        </div>

        {/* Progress Bar */}
        {!isComplete && (
          <ProgressBar
            currentSection={Math.min(currentSectionIndex + 1, SECTIONS.length + 1)}
            totalSections={SECTIONS.length + 1}
          />
        )}

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence mode="popLayout">
            {messages.map((msg) => {
              if (msg.type === "assistant") {
                return (
                  <ChatBubble key={msg.id} variant="assistant">
                    {msg.content}
                  </ChatBubble>
                )
              }
              if (msg.type === "ai-tip") {
                return (
                  <ChatBubble key={msg.id} variant="tip">
                    {msg.content}
                  </ChatBubble>
                )
              }
              if (msg.type === "user-summary") {
                return (
                  <ChatBubble key={msg.id} variant="summary">
                    {msg.content}
                  </ChatBubble>
                )
              }
              if (msg.type === "success") {
                return <SuccessCard key={msg.id} data={formData as TenantFormData} />
              }
              return null
            })}
          </AnimatePresence>

          {/* Active Form Card */}
          {!isComplete && !isReviewStep && currentSection && agentState === "idle" && (
            <FormCard
              section={currentSection}
              data={formData}
              onChange={handleFieldChange}
              onSubmit={handleSectionSubmit}
              errors={errors}
            />
          )}

          {/* Review Screen */}
          {!isComplete && isReviewStep && agentState === "idle" && (
            <ReviewScreen
              data={formData}
              onEdit={handleEditSection}
              onConfirm={handleCreateTenant}
              isSubmitting={isSubmitting}
            />
          )}

          {/* Thinking Indicator */}
          {(agentState === "thinking" || agentState === "planning" || agentState === "executing") && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 ml-11">
              <div className="relative w-6 h-6">
                <AgentLogo className="w-6 h-6" state={agentState} variant="light" />
              </div>
              <span className="text-xs font-medium text-secondary">
                {agentState === "executing" ? "Creating tenant..." : "Processing..."}
              </span>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
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
