"use client"

/* eslint-disable no-restricted-syntax */
// This component requires specific color shades from color ramps (DEEP_CURRENT, WAVE, CORAL, SLATE)
// for chat UI styling that are not available in ALIAS tokens

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
import {
  DEEP_CURRENT,
  WAVE,
  CORAL,
  SLATE,
  ALIAS,
  RADIUS,
} from "../../constants/designTokens"
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
    medium: ALIAS.background.page,
    small: CORAL[500],
  },
  light: {
    large: DEEP_CURRENT[500],
    medium: ALIAS.brand.primary,
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
  const bgColor = variant === "tip" ? DEEP_CURRENT[50] : variant === "summary" ? CORAL[50] : WAVE[50]
  const borderColor = variant === "tip" ? DEEP_CURRENT[200] : variant === "summary" ? CORAL[200] : "transparent"
  const icon = variant === "tip" ? (
    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: DEEP_CURRENT[100] }}>
      <Lightbulb className="w-4 h-4" style={{ color: DEEP_CURRENT[600] }} />
    </div>
  ) : variant === "summary" ? (
    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: CORAL[100] }}>
      <User className="w-4 h-4" style={{ color: CORAL[600] }} />
    </div>
  ) : (
    <div className="relative w-8 h-8">
      <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden" style={{ backgroundColor: WAVE[50] }}>
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
        className="px-4 py-3 text-sm leading-relaxed"
        style={{
          backgroundColor: bgColor,
          border: borderColor !== "transparent" ? `1px solid ${borderColor}` : undefined,
          borderRadius: `${RADIUS.md} ${RADIUS.md} ${RADIUS.md} ${RADIUS.xs}`,
          color: ALIAS.text.primary,
        }}
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
          <Label className="text-xs font-medium" style={{ color: ALIAS.text.secondary }}>{config.label}</Label>
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
          {error && <p className="text-xs" style={{ color: CORAL[500] }}>{error}</p>}
        </div>
      )
    }

    if (config.type === "radio" && config.options) {
      return (
        <div key={field} className="space-y-2">
          <Label className="text-xs font-medium" style={{ color: ALIAS.text.secondary }}>{config.label}</Label>
          <div className="flex flex-wrap gap-2">
            {config.options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => onChange(field, opt)}
                className={cn(
                  "px-3 py-2 text-sm font-medium transition-all",
                  value === opt
                    ? "ring-2 ring-offset-1"
                    : "hover:bg-surface-hover"
                )}
                style={{
                  backgroundColor: value === opt ? DEEP_CURRENT[50] : ALIAS.background.surface,
                  color: value === opt ? DEEP_CURRENT[700] : ALIAS.text.primary,
                  border: `1px solid ${value === opt ? DEEP_CURRENT[300] : SLATE[200]}`,
                  borderRadius: RADIUS.sm,
                  boxShadow: value === opt ? `0 0 0 2px ${DEEP_CURRENT[500]}` : undefined,
                }}
              >
                {opt}
              </button>
            ))}
          </div>
          {error && <p className="text-xs" style={{ color: CORAL[500] }}>{error}</p>}
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
          <Label className="text-xs font-medium" style={{ color: ALIAS.text.secondary }}>{config.label}</Label>
          <div className="grid gap-2">
            {config.options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => onChange(field, opt)}
                className={cn(
                  "p-3 text-left transition-all flex items-center justify-between",
                  value === opt && "ring-2 ring-offset-1"
                )}
                style={{
                  backgroundColor: value === opt ? DEEP_CURRENT[50] : ALIAS.background.surface,
                  border: `1px solid ${value === opt ? DEEP_CURRENT[300] : SLATE[200]}`,
                  borderRadius: RADIUS.md,
                  boxShadow: value === opt ? `0 0 0 2px ${DEEP_CURRENT[500]}` : undefined,
                }}
              >
                <div>
                  <div className="font-medium text-sm" style={{ color: ALIAS.text.primary }}>{opt}</div>
                  <div className="text-xs" style={{ color: ALIAS.text.secondary }}>{planDetails[opt]?.desc}</div>
                </div>
                <div className="text-sm font-semibold" style={{ color: DEEP_CURRENT[600] }}>{planDetails[opt]?.price}</div>
              </button>
            ))}
          </div>
          {error && <p className="text-xs" style={{ color: CORAL[500] }}>{error}</p>}
        </div>
      )
    }

    if (config.type === "cycle" && config.options) {
      return (
        <div key={field} className="space-y-2">
          <Label className="text-xs font-medium" style={{ color: ALIAS.text.secondary }}>{config.label}</Label>
          <div className="flex gap-2">
            {config.options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => onChange(field, opt)}
                className={cn(
                  "flex-1 px-4 py-3 text-sm font-medium transition-all",
                  value === opt && "ring-2 ring-offset-1"
                )}
                style={{
                  backgroundColor: value === opt ? DEEP_CURRENT[50] : ALIAS.background.surface,
                  color: value === opt ? DEEP_CURRENT[700] : ALIAS.text.primary,
                  border: `1px solid ${value === opt ? DEEP_CURRENT[300] : SLATE[200]}`,
                  borderRadius: RADIUS.md,
                  boxShadow: value === opt ? `0 0 0 2px ${DEEP_CURRENT[500]}` : undefined,
                }}
              >
                {opt}
              </button>
            ))}
          </div>
          {error && <p className="text-xs" style={{ color: CORAL[500] }}>{error}</p>}
        </div>
      )
    }

    return (
      <div key={field} className="space-y-1.5">
        <Label className="text-xs font-medium" style={{ color: ALIAS.text.secondary }}>{config.label}</Label>
        <Input
          type={config.type}
          value={value}
          onChange={(e) => onChange(field, e.target.value)}
          placeholder={config.placeholder}
          className={cn("h-10", error && "border-error")}
        />
        {error && <p className="text-xs" style={{ color: CORAL[500] }}>{error}</p>}
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
        <div
          className="overflow-hidden"
          style={{
            backgroundColor: ALIAS.background.surface,
            border: `1px solid ${SLATE[200]}`,
            borderRadius: RADIUS.lg,
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          }}
        >
          {/* Header */}
          <div
            className="px-4 py-3 flex items-center gap-2"
            style={{ backgroundColor: DEEP_CURRENT[50], borderBottom: `1px solid ${SLATE[200]}` }}
          >
            <span style={{ color: DEEP_CURRENT[600] }}>{section.icon}</span>
            <span className="text-sm font-semibold" style={{ color: DEEP_CURRENT[700] }}>
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
              className="w-full font-medium"
              style={{
                backgroundColor: DEEP_CURRENT[500],
                color: ALIAS.background.surface,
                borderRadius: RADIUS.md,
              }}
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
      <div
        className="overflow-hidden"
        style={{
          backgroundColor: ALIAS.background.surface,
          border: `1px solid ${SLATE[200]}`,
          borderRadius: RADIUS.lg,
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        }}
      >
        {/* Header */}
        <div
          className="px-4 py-3 flex items-center gap-2"
          style={{ backgroundColor: DEEP_CURRENT[50], borderBottom: `1px solid ${SLATE[200]}` }}
        >
          <Check className="w-4 h-4" style={{ color: DEEP_CURRENT[600] }} />
          <span className="text-sm font-semibold" style={{ color: DEEP_CURRENT[700] }}>
            Review Tenant Details
          </span>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {reviewSections.map((section) => (
            <div key={section.id} className="group">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span style={{ color: DEEP_CURRENT[500] }}>{section.icon}</span>
                  <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: ALIAS.brand.primary }}>
                    {section.title}
                  </span>
                </div>
                <button
                  onClick={() => onEdit(section.id)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded transition-all hover:bg-surface-hover"
                  style={{ color: DEEP_CURRENT[500] }}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="space-y-1 ml-6">
                {section.items.map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <span className="text-xs" style={{ color: ALIAS.text.secondary }}>{item.label}:</span>
                    <span className="text-sm font-medium" style={{ color: ALIAS.text.primary }}>{item.value || "—"}</span>
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
            className="w-full font-medium"
            style={{
              backgroundColor: DEEP_CURRENT[500],
              color: ALIAS.background.surface,
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
      <div
        className="p-4 flex items-start gap-3"
        style={{
          backgroundColor: DEEP_CURRENT[50],
          border: `1px solid ${DEEP_CURRENT[200]}`,
          borderRadius: RADIUS.lg,
        }}
      >
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: DEEP_CURRENT[500] }}
        >
          <Check className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold" style={{ color: DEEP_CURRENT[700] }}>
            Tenant Created Successfully!
          </h3>
          <p className="text-sm mt-1" style={{ color: ALIAS.text.primary }}>
            <strong>{data.companyName}</strong> has been provisioned with the <strong>{data.pricingTier}</strong> plan.
          </p>
          <p className="text-xs mt-2" style={{ color: ALIAS.text.secondary }}>
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
    <div className="px-4 py-2" style={{ backgroundColor: DEEP_CURRENT[50], borderBottom: `1px solid ${SLATE[200]}` }}>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-semibold" style={{ color: DEEP_CURRENT[700] }}>
          Section {currentSection} of {totalSections}
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
        className={cn("h-full w-full flex flex-col overflow-hidden", className)}
        style={{ backgroundColor: ALIAS.background.surface }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3" style={{ backgroundColor: ALIAS.background.surface, borderBottom: `1px solid ${SLATE[200]}` }}>
          <div className="flex items-center gap-3">
            {onCancel && (
              <button onClick={handleBack} className="p-1.5 rounded-lg transition-colors hover:bg-surface-hover" title="Exit">
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
          {onSaveProgress && currentSectionIndex > 0 && !isComplete && (
            <button
              onClick={() => setShowExitDialog(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors hover:bg-surface-hover"
              style={{ color: SLATE[600] }}
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
              <span className="text-xs font-medium" style={{ color: ALIAS.text.secondary }}>
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
