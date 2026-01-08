"use client"

/**
 * FormCard Component
 *
 * Renders a form section within the chat flow.
 * Uses DDS Glass Depth 2 for the card container with accent header tint.
 *
 * @component MOLECULE
 * @status STABILIZED
 *
 * Clean Code A+ Refactor:
 * - Functions <30 lines
 * - Single responsibility per sub-component
 * - Named constants (SCREAMING_SNAKE)
 * - Semantic tokens throughout
 */

import { motion } from "motion/react"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { FormCardProps, TenantFormData } from "./types"
import { FIELD_CONFIG, PLAN_DETAILS } from "./constants"

// =============================================================================
// CONSTANTS (Clean Code: Named constants in SCREAMING_SNAKE)
// =============================================================================

/** CSS classes for field containers */
const FIELD_WRAPPER_CLASSES = "space-y-1.5"
const FIELD_WRAPPER_SPACED_CLASSES = "space-y-2"

/** CSS classes for labels */
const LABEL_CLASSES = "text-xs font-medium text-secondary"

/** CSS classes for error messages */
const ERROR_CLASSES = "text-xs text-error"

/** CSS classes for radio/toggle button - selected state */
const RADIO_SELECTED_CLASSES =
  "bg-teal text-inverse border-teal shadow-md"

/** CSS classes for radio/toggle button - unselected state */
const RADIO_UNSELECTED_CLASSES =
  "bg-white/40 dark:bg-black/40 text-primary dark:text-inverse border-default hover:border-accent/50 hover:bg-white/60 dark:hover:bg-black/60"

/** CSS classes for plan card - selected state */
const PLAN_SELECTED_CLASSES =
  "bg-accent/10 backdrop-blur-[1px] border-accent/30 ring-2 ring-accent ring-offset-1"

/** CSS classes for plan card - unselected state */
const PLAN_UNSELECTED_CLASSES = "bg-surface border-default hover:bg-surface-hover"

/** CSS classes for cycle button - selected state */
const CYCLE_SELECTED_CLASSES =
  "bg-accent/10 backdrop-blur-[1px] border-accent/30 text-accent ring-2 ring-accent ring-offset-1"

/** CSS classes for cycle button - unselected state */
const CYCLE_UNSELECTED_CLASSES = "bg-surface text-primary border-default hover:bg-surface-hover"

/** Input height class */
const INPUT_HEIGHT_CLASS = "h-10"

// =============================================================================
// SHARED TYPES
// =============================================================================

interface BaseFieldProps {
  field: keyof TenantFormData
  value: string
  error?: string
  onChange: (field: keyof TenantFormData, value: string) => void
}

interface FieldWithOptionsProps extends BaseFieldProps {
  label: string
  placeholder: string
  options: readonly string[]
}

// =============================================================================
// SUB-COMPONENTS (Single Responsibility)
// =============================================================================

/** Renders error message below field */
function FieldError({ error }: { error?: string }) {
  if (!error) return null
  return <p className={ERROR_CLASSES}>{error}</p>
}

/** Renders a select dropdown field */
function SelectField({ field, value, error, onChange, label, placeholder, options }: FieldWithOptionsProps) {
  return (
    <div key={field} className={FIELD_WRAPPER_CLASSES}>
      <Label className={LABEL_CLASSES}>{label}</Label>
      <Select value={value} onValueChange={(v) => onChange(field, v)}>
        <SelectTrigger className={cn(INPUT_HEIGHT_CLASS, error && "border-error")}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt} value={opt}>
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FieldError error={error} />
    </div>
  )
}

/** Renders a radio button group field */
function RadioField({ field, value, error, onChange, label, options }: FieldWithOptionsProps) {
  return (
    <div key={field} className={FIELD_WRAPPER_SPACED_CLASSES}>
      <Label className={LABEL_CLASSES}>{label}</Label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(field, opt)}
            className={cn(
              "px-3 py-2 text-sm font-medium transition-all rounded-sm border-2",
              value === opt ? RADIO_SELECTED_CLASSES : RADIO_UNSELECTED_CLASSES
            )}
          >
            {opt}
          </button>
        ))}
      </div>
      <FieldError error={error} />
    </div>
  )
}

/** Renders a pricing plan selection field */
function PlanField({ field, value, error, onChange, label, options }: FieldWithOptionsProps) {
  return (
    <div key={field} className={FIELD_WRAPPER_SPACED_CLASSES}>
      <Label className={LABEL_CLASSES}>{label}</Label>
      <div className="grid gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(field, opt)}
            className={cn(
              "p-3 text-left transition-all flex items-center justify-between rounded-md border-2",
              value === opt ? PLAN_SELECTED_CLASSES : PLAN_UNSELECTED_CLASSES
            )}
          >
            <div>
              <div className="font-medium text-sm text-primary">{opt}</div>
              <div className="text-xs text-secondary">{PLAN_DETAILS[opt]?.desc}</div>
            </div>
            <div className="text-sm font-semibold text-accent">{PLAN_DETAILS[opt]?.price}</div>
          </button>
        ))}
      </div>
      <FieldError error={error} />
    </div>
  )
}

/** Renders a billing cycle toggle field */
function CycleField({ field, value, error, onChange, label, options }: FieldWithOptionsProps) {
  return (
    <div key={field} className={FIELD_WRAPPER_SPACED_CLASSES}>
      <Label className={LABEL_CLASSES}>{label}</Label>
      <div className="flex gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(field, opt)}
            className={cn(
              "flex-1 px-4 py-3 text-sm font-medium transition-all rounded-md border-2",
              value === opt ? CYCLE_SELECTED_CLASSES : CYCLE_UNSELECTED_CLASSES
            )}
          >
            {opt}
          </button>
        ))}
      </div>
      <FieldError error={error} />
    </div>
  )
}

/** Renders a text/email/tel input field */
function TextField({
  field,
  value,
  error,
  onChange,
  label,
  placeholder,
  type,
}: BaseFieldProps & { label: string; placeholder: string; type: string }) {
  return (
    <div key={field} className={FIELD_WRAPPER_CLASSES}>
      <Label className={LABEL_CLASSES}>{label}</Label>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(field, e.target.value)}
        placeholder={placeholder}
        className={cn(INPUT_HEIGHT_CLASS, error && "border-error")}
      />
      <FieldError error={error} />
    </div>
  )
}

// =============================================================================
// FIELD HELPERS (Clean Code: Extract helper functions)
// =============================================================================

/** Check if field should be skipped based on context */
function shouldSkipField(field: keyof TenantFormData, data: Partial<TenantFormData>): boolean {
  return field === "billingState" && data.billingCountry !== "United States"
}

/** Get string value from form data field */
function getFieldValue(data: Partial<TenantFormData>, field: keyof TenantFormData): string {
  const rawValue = data[field]
  return typeof rawValue === "string" ? rawValue : ""
}

/** Get dynamic label (handles ZIP/Postal code context) */
function getFieldLabel(field: keyof TenantFormData, data: Partial<TenantFormData>, defaultLabel: string): string {
  if (field === "billingZip" && data.billingCountry !== "United States") {
    return "Postal Code"
  }
  return defaultLabel
}

// =============================================================================
// FIELD RENDERER (Clean Code: <30 lines)
// =============================================================================

interface RenderFieldParams {
  field: keyof TenantFormData
  data: Partial<TenantFormData>
  errors: Partial<Record<keyof TenantFormData, string>>
  onChange: (field: keyof TenantFormData, value: string) => void
}

/** Renders the appropriate field component based on field type */
function renderFormField({ field, data, errors, onChange }: RenderFieldParams) {
  if (shouldSkipField(field, data)) return null

  const config = FIELD_CONFIG[field]
  if (!config) return null

  const value = getFieldValue(data, field)
  const label = getFieldLabel(field, data, config.label)
  const baseProps = { field, value, error: errors[field], onChange, label, placeholder: config.placeholder }

  switch (config.type) {
    case "select":
      return config.options ? <SelectField {...baseProps} options={config.options} /> : null
    case "radio":
      return config.options ? <RadioField {...baseProps} options={config.options} /> : null
    case "plan":
      return config.options ? <PlanField {...baseProps} options={config.options} /> : null
    case "cycle":
      return config.options ? <CycleField {...baseProps} options={config.options} /> : null
    default:
      return <TextField {...baseProps} type={config.type} />
  }
}

// =============================================================================
// CARD SUB-COMPONENTS (Clean Code: Extract for reuse)
// =============================================================================

/** DDS Glass Depth 2 container classes */
const GLASS_CARD_CLASSES =
  "overflow-hidden bg-white/40 dark:bg-black/40 backdrop-blur-[4px] border-2 border-accent rounded-lg shadow-md"

/** Card header with accent tint */
function CardHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="px-4 py-3 flex items-center gap-2 bg-accent/10 dark:bg-accent/5 border-b border-accent/30">
      <span className="text-accent">{icon}</span>
      <span className="text-sm font-semibold text-accent">{title}</span>
    </div>
  )
}

/** Card submit button */
function CardSubmitButton() {
  return (
    <div className="px-4 pb-4">
      <Button type="submit" variant="accent" className="w-full font-medium">
        Continue
        <ChevronRight className="w-4 h-4 ml-1" />
      </Button>
    </div>
  )
}

// =============================================================================
// MAIN COMPONENT (Clean Code: <30 lines)
// =============================================================================

/**
 * FormCard - Renders a form section within the conversational provisioning flow.
 *
 * Uses DDS Glass Depth 2 styling with accent header tint.
 * Each field type is rendered via dedicated sub-components.
 */
export function FormCard({ section, data, onChange, onSubmit, errors }: FormCardProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit()
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="ml-11">
      <form onSubmit={handleSubmit}>
        <div className={GLASS_CARD_CLASSES}>
          <CardHeader icon={section.icon} title={section.title} />
          <div className="p-4 space-y-4">
            {section.fields.map((field) => renderFormField({ field, data, errors, onChange }))}
          </div>
          <CardSubmitButton />
        </div>
      </form>
    </motion.div>
  )
}

export default FormCard
