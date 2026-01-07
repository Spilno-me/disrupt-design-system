"use client"

/**
 * FormCard Component
 *
 * Renders a form section within the chat flow.
 * Uses DDS Glass Depth 2 for the card container with accent header tint.
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
import type { FormCardProps } from "./types"
import type { TenantFormData } from "./types"
import {
  US_STATES,
  COUNTRIES,
  INDUSTRIES,
  COMPANY_SIZES,
  PRICING_TIERS,
  BILLING_CYCLES,
  PLAN_DETAILS,
} from "./constants"

export function FormCard({ section, data, onChange, onSubmit, errors }: FormCardProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit()
  }

  const renderField = (field: keyof TenantFormData) => {
    // Get raw value and convert to string for form inputs
    const rawValue = data[field]
    const value = typeof rawValue === "string" ? rawValue : ""
    const error = errors[field]

    // Skip state field for non-US countries
    if (field === "billingState" && data.billingCountry !== "United States") {
      return null
    }

    // Partial Record: pricing fields are handled by PricingCard, not FormCard
    const fieldConfig: Partial<Record<
      keyof TenantFormData,
      { label: string; type: string; placeholder: string; options?: readonly string[] }
    >> = {
      companyName: { label: "Company Name", type: "text", placeholder: "Acme Corporation" },
      industry: {
        label: "Industry",
        type: "select",
        placeholder: "Select industry...",
        options: INDUSTRIES,
      },
      companySize: {
        label: "Company Size",
        type: "radio",
        placeholder: "",
        options: COMPANY_SIZES,
      },
      contactName: { label: "Full Name", type: "text", placeholder: "John Smith" },
      contactEmail: { label: "Email Address", type: "email", placeholder: "john@company.com" },
      contactPhone: { label: "Phone (optional)", type: "tel", placeholder: "+1 555 123 4567" },
      billingStreet: {
        label: "Street Address",
        type: "text",
        placeholder: "123 Main St, Suite 100",
      },
      billingCity: { label: "City", type: "text", placeholder: "New York" },
      billingCountry: {
        label: "Country",
        type: "select",
        placeholder: "Select country...",
        options: COUNTRIES,
      },
      billingState: {
        label: "State",
        type: "select",
        placeholder: "Select state...",
        options: US_STATES,
      },
      billingZip: {
        label: data.billingCountry === "United States" ? "ZIP Code" : "Postal Code",
        type: "text",
        placeholder: "10001",
      },
      pricingTier: {
        label: "Pricing Plan",
        type: "plan",
        placeholder: "",
        options: PRICING_TIERS,
      },
      billingCycle: {
        label: "Billing Cycle",
        type: "cycle",
        placeholder: "",
        options: BILLING_CYCLES,
      },
    }

    const config = fieldConfig[field]

    // Skip fields not configured (pricing fields are handled by PricingCard)
    if (!config) {
      return null
    }

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
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
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
                  "px-3 py-2 text-sm font-medium transition-all rounded-sm border-2",
                  value === opt
                    ? "bg-teal text-inverse border-teal shadow-md"
                    : "bg-white/40 dark:bg-black/40 text-primary dark:text-inverse border-default hover:border-accent/50 hover:bg-white/60 dark:hover:bg-black/60"
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
                  "p-3 text-left transition-all flex items-center justify-between rounded-md border-2",
                  value === opt
                    ? "bg-accent/10 backdrop-blur-[1px] border-accent/30 ring-2 ring-accent ring-offset-1"
                    : "bg-surface border-default hover:bg-surface-hover"
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
                  "flex-1 px-4 py-3 text-sm font-medium transition-all rounded-md border-2",
                  value === opt
                    ? "bg-accent/10 backdrop-blur-[1px] border-accent/30 text-accent ring-2 ring-accent ring-offset-1"
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
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="ml-11">
      <form onSubmit={handleSubmit}>
        {/* DDS Glass Depth 2 */}
        <div className="overflow-hidden bg-white/40 dark:bg-black/40 backdrop-blur-[4px] border-2 border-accent rounded-lg shadow-md">
          {/* Header - accent tint (nested, no extra blur) */}
          <div className="px-4 py-3 flex items-center gap-2 bg-accent/10 dark:bg-accent/5 border-b border-accent/30">
            <span className="text-accent">{section.icon}</span>
            <span className="text-sm font-semibold text-accent">{section.title}</span>
          </div>

          {/* Form Fields */}
          <div className="p-4 space-y-4">{section.fields.map(renderField)}</div>

          {/* Submit */}
          <div className="px-4 pb-4">
            <Button type="submit" variant="accent" className="w-full font-medium">
              Continue
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </form>
    </motion.div>
  )
}

export default FormCard
