"use client"

/**
 * SuccessCard Component
 *
 * Displayed after successful tenant creation.
 * Uses DDS semantic success color glass (Depth 2).
 */

import { motion } from "motion/react"
import { Check } from "lucide-react"
import type { SuccessCardProps } from "./types"

export function SuccessCard({ data }: SuccessCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="ml-11"
    >
      {/* DDS Glass Depth 2 - Success semantic color */}
      <div className="p-4 flex items-start gap-3 bg-success/40 backdrop-blur-[4px] border-2 border-success/60 rounded-lg shadow-md">
        <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-success">
          <Check className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-success">Tenant Created Successfully!</h3>
          <p className="text-sm mt-1 text-primary">
            <strong>{data.companyName}</strong> has been provisioned with the{" "}
            <strong>{data.pricingTier}</strong> plan.
          </p>
          <p className="text-xs mt-2 text-secondary">
            A welcome email has been sent to {data.contactEmail}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export default SuccessCard
