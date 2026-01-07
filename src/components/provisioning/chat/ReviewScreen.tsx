"use client"

/**
 * ReviewScreen Component
 *
 * Displays a summary of all entered data before final submission.
 * Uses DDS Glass Depth 2 with grouped sections and edit buttons.
 */

import { motion } from "motion/react"
import { Building2, User, MapPin, CreditCard, Check, Edit3, Loader2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { ReviewScreenProps, SectionId } from "./types"
import { DEFAULT_PRICING_CONFIG } from "../../partners/PricingCalculator/constants"
import { formatCurrency, determineCompanySize } from "../../partners/PricingCalculator/utils/pricing-calculations"

export function ReviewScreen({ data, onEdit, onConfirm, isSubmitting }: ReviewScreenProps) {
  // Build subscription items dynamically based on pricing data
  const getSubscriptionItems = () => {
    const items: { label: string; value: string | undefined }[] = []

    // Package (process tier) with price
    if (data.processTier) {
      const tierConfig = DEFAULT_PRICING_CONFIG.processTiers[data.processTier]
      const tierPrice = formatCurrency(tierConfig.annualPrice)
      items.push({
        label: "Package",
        value: `${tierConfig.name} (${tierPrice}/yr)`,
      })
    } else if (data.pricingTier) {
      // Fallback to legacy pricingTier
      items.push({ label: "Plan", value: data.pricingTier })
    }

    // Employee count with company size tier
    if (data.employeeCount !== undefined && data.employeeCount > 0) {
      const companySize = determineCompanySize(data.employeeCount)
      const companySizeLabels: Record<string, string> = {
        smb: "SMB tier",
        mid_market: "Mid-Market tier",
        enterprise: "Enterprise tier",
      }
      items.push({
        label: "Employees",
        value: `${data.employeeCount} (${companySizeLabels[companySize]})`,
      })
    }

    // User licenses summary
    if (data.userLicenses && data.userLicenses.length > 0) {
      const licenseStrings = data.userLicenses
        .filter((license) => license.quantity > 0)
        .map((license) => {
          const licenseConfig = DEFAULT_PRICING_CONFIG.userLicenses[license.tier]
          return `${license.quantity} ${licenseConfig.name}${license.quantity > 1 ? "s" : ""}`
        })
      if (licenseStrings.length > 0) {
        items.push({
          label: "Licenses",
          value: licenseStrings.join(", "),
        })
      }
    }

    // Billing cycle
    if (data.billingCycle) {
      const cycleLabel = data.billingCycle === "annual" ? "Annual" : "Monthly"
      items.push({ label: "Billing", value: cycleLabel })
    }

    // Total (if calculated)
    if (data.calculatedTotal !== undefined && data.calculatedTotal > 0) {
      const periodLabel = data.billingCycle === "annual" ? "/year" : "/month"
      items.push({
        label: "Total",
        value: `${formatCurrency(data.calculatedTotal)}${periodLabel}`,
      })
    }

    return items
  }

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
        ...(data.billingCountry === "United States"
          ? [{ label: "State", value: data.billingState }]
          : []),
        {
          label: data.billingCountry === "United States" ? "ZIP" : "Postal Code",
          value: data.billingZip,
        },
      ],
    },
    {
      id: "subscription" as SectionId,
      title: "Subscription",
      icon: <CreditCard className="w-4 h-4" />,
      items: getSubscriptionItems(),
    },
  ]

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="ml-11">
      {/* DDS Glass Depth 2 */}
      <div className="overflow-hidden bg-white/40 dark:bg-black/40 backdrop-blur-[4px] border-2 border-accent rounded-lg shadow-md">
        {/* Header - accent tint (nested, no extra blur) */}
        <div className="px-4 py-3 flex items-center gap-2 bg-accent/10 dark:bg-accent/5 border-b border-accent/30">
          <Check className="w-4 h-4 text-accent" />
          <span className="text-sm font-semibold text-accent">Review Tenant Details</span>
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
                  aria-label={`Edit ${section.title}`}
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

export default ReviewScreen
