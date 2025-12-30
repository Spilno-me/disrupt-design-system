/**
 * MetricItem - Displays a single metric with label and value
 * @module partners/components/MetricItem
 */

import { cn } from "../../../lib/utils"

type MetricVariant = "default" | "blue" | "green" | "purple"

interface MetricItemProps {
  /** Metric label text */
  label: string
  /** Metric value */
  value: string | number
  /** Color variant for the value */
  variant?: MetricVariant
}

const VARIANT_COLORS: Record<MetricVariant, string> = {
  default: "text-primary",
  blue: "text-info",
  green: "text-success",
  purple: "text-secondary",
}

/**
 * MetricItem - Renders a labeled metric value with color variants
 */
export function MetricItem({
  label,
  value,
  variant = "default",
}: MetricItemProps) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-muted">{label}</span>
      <span className={cn("text-sm font-semibold", VARIANT_COLORS[variant])}>
        {value}
      </span>
    </div>
  )
}
