/**
 * PartnerMetricsCard - Displays partner metrics in an indented card format
 * @module partners/components/PartnerMetricsCard
 */

"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { ChevronDown, ChevronRight, TrendingUp } from "lucide-react"
import { cn } from "../../../lib/utils"
import { MetricItem } from "./MetricItem"
import { slideDownVariants } from "../constants"
import {
  BASE_PADDING_PX,
  INDENT_PADDING_PX,
  METRICS_CARD_INDENT_PX
} from "../constants"
import type { PartnerMetricsCardProps as BasePartnerMetricsCardProps } from "../types"

interface PartnerMetricsCardProps extends BasePartnerMetricsCardProps {
  /** Optional test ID for automated testing */
  "data-testid"?: string
}

/**
 * Formats a number as currency string
 */
function formatCurrency(value: number): string {
  return `$${value.toLocaleString()}`
}

/**
 * Formats metrics summary for collapsed state
 */
function formatMetricsSummary(
  totalLeads: number,
  conversion: number | null,
  totalRevenue: number
): string {
  const conversionStr = conversion !== null ? `${conversion}%` : "N/A"
  return `${totalLeads} leads · ${conversionStr} · ${formatCurrency(totalRevenue)}`
}

/**
 * PartnerMetricsCard - Shows expandable metrics card
 *
 * Hybrid UX: Shows expanded by default, but can be collapsed independently.
 * Follows Gestalt proximity principle for clear parent-child relationships.
 */
export function PartnerMetricsCard({ metrics, depth = 0, "data-testid": testId }: PartnerMetricsCardProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const indentPadding = depth * INDENT_PADDING_PX
  const totalPadding = BASE_PADDING_PX + indentPadding + METRICS_CARD_INDENT_PX

  return (
    <div
      className="px-4 py-2 border-b border-default"
      style={{ paddingLeft: `${totalPadding}px` }}
      data-testid={testId}
    >
      <div className={cn(
        "rounded-md border border-default bg-muted-bg/30 transition-all",
        isCollapsed ? "p-2" : "p-4"
      )}>
        {/* Header with toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center justify-between w-full group"
        >
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-muted" />
            <span className="text-xs font-medium text-muted uppercase tracking-wide">
              Performance Metrics
            </span>
          </div>
          <div className="flex items-center gap-2">
            {isCollapsed && (
              <span className="text-xs text-muted">
                {formatMetricsSummary(
                  metrics.totalLeads,
                  metrics.conversion,
                  metrics.totalRevenue
                )}
              </span>
            )}
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4 text-muted group-hover:text-primary transition-colors" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted group-hover:text-primary transition-colors" />
            )}
          </div>
        </button>

        {/* Collapsible content with slide animation */}
        <AnimatePresence initial={false}>
          {!isCollapsed && (
            <motion.div
              key="metrics-content"
              variants={slideDownVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="overflow-hidden"
            >
              <div className="grid grid-cols-4 gap-6 pt-3 border-t border-default">
                <MetricItem
                  label="Total Leads"
                  value={metrics.totalLeads}
                  variant="blue"
                />
                <MetricItem
                  label="Conversion"
                  value={metrics.conversion !== null ? `${metrics.conversion}%` : "N/A"}
                  variant="green"
                />
                <MetricItem
                  label="Commission"
                  value={metrics.commission !== null ? formatCurrency(metrics.commission) : "N/A"}
                  variant="purple"
                />
                <MetricItem
                  label="Total Revenue"
                  value={formatCurrency(metrics.totalRevenue)}
                  variant="default"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
