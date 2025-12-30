"use client"

import * as React from "react"
import { cn } from "../../../lib/utils"
import { SeverityIndicator, type SeverityLevel } from "../SeverityIndicator"

// =============================================================================
// CONSTANTS
// =============================================================================

/** Default gap between indicator and label */
const INDICATOR_LABEL_GAP = "gap-2"

/** Default text size for severity labels */
const LABEL_TEXT_SIZE = "text-sm"

// =============================================================================
// TYPES
// =============================================================================

/** Configuration for a single severity level */
export interface SeverityConfig {
  /** Severity level for the indicator */
  level: SeverityLevel
  /** Display label */
  label: string
}

/** Maps string values to severity configurations */
export type SeverityMapping<T extends string = string> = Record<T, SeverityConfig>

/** Props for the DataTableSeverity component */
export interface DataTableSeverityProps<T extends string = string>
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  /** Priority/severity value */
  value: T
  /** Mapping of values to severity configurations */
  mapping: SeverityMapping<T>
  /** Size of the severity indicator */
  size?: "sm" | "md"
  /** Whether to show the label (default: true) */
  showLabel?: boolean
}

// =============================================================================
// PRESET MAPPINGS
// =============================================================================

/** Standard priority mapping (critical → none) */
export const PRIORITY_SEVERITY_MAP: SeverityMapping<
  "critical" | "high" | "medium" | "low" | "none"
> = {
  critical: { level: "critical", label: "Critical" },
  high: { level: "high", label: "High" },
  medium: { level: "medium", label: "Medium" },
  low: { level: "low", label: "Low" },
  none: { level: "none", label: "None" },
}

/** Lead priority mapping (hot/warm/cold terminology) */
export const LEAD_TEMPERATURE_SEVERITY_MAP: SeverityMapping<
  "hot" | "warm" | "cold"
> = {
  hot: { level: "critical", label: "Hot" },
  warm: { level: "medium", label: "Warm" },
  cold: { level: "low", label: "Cold" },
}

/** Lead priority mapping (high/medium/low terminology) */
export const LEAD_PRIORITY_SEVERITY_MAP: SeverityMapping<
  "high" | "medium" | "low"
> = {
  high: { level: "high", label: "High" },
  medium: { level: "medium", label: "Medium" },
  low: { level: "low", label: "Low" },
}

/** Incident severity mapping */
export const INCIDENT_SEVERITY_MAP: SeverityMapping<
  "critical" | "major" | "minor" | "trivial"
> = {
  critical: { level: "critical", label: "Critical" },
  major: { level: "high", label: "Major" },
  minor: { level: "medium", label: "Minor" },
  trivial: { level: "low", label: "Trivial" },
}

/** Task urgency mapping */
export const URGENCY_SEVERITY_MAP: SeverityMapping<
  "urgent" | "high" | "normal" | "low"
> = {
  urgent: { level: "critical", label: "Urgent" },
  high: { level: "high", label: "High" },
  normal: { level: "medium", label: "Normal" },
  low: { level: "low", label: "Low" },
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Maps severity levels to font weights for visual hierarchy.
 * Higher severity = bolder text, creating intuitive visual urgency.
 *
 * Scale: Bold (700) → SemiBold (600) → Medium (500) → Regular (400) → Light (300)
 */
const SEVERITY_FONT_WEIGHT: Record<SeverityLevel, string> = {
  critical: "font-bold", // 700 - Maximum urgency
  high: "font-semibold", // 600 - High urgency
  medium: "font-medium", // 500 - Moderate
  low: "font-normal", // 400 - Low priority
  none: "font-light", // 300 - Minimal emphasis
}

/**
 * Gets the appropriate font weight class for a severity level.
 *
 * @param level - The severity level
 * @returns Tailwind font weight class
 */
function getSeverityFontWeight(level: SeverityLevel): string {
  return SEVERITY_FONT_WEIGHT[level]
}

// =============================================================================
// INTERNAL COMPONENTS
// =============================================================================

/** Props for the SeverityLabel internal component */
interface SeverityLabelProps {
  /** Text to display */
  label: string
  /** Font weight class based on severity */
  fontWeight: string
  /** Whether this is a fallback (unknown value) */
  isFallback?: boolean
}

/**
 * SeverityLabel - Displays the text label with appropriate styling.
 *
 * @component ATOM
 * @internal
 */
function SeverityLabel({
  label,
  fontWeight,
  isFallback = false,
}: SeverityLabelProps) {
  const textClass = isFallback ? "text-muted" : "text-primary"

  return (
    <span className={cn(textClass, LABEL_TEXT_SIZE, fontWeight)}>{label}</span>
  )
}

SeverityLabel.displayName = "SeverityLabel"

// =============================================================================
// MAIN COMPONENT
// =============================================================================

/**
 * DataTableSeverity - Severity/priority indicator with icon and label
 *
 * Combines the SeverityIndicator squircle icon with a text label for
 * clear, accessible priority display in data tables. Recommended as
 * the standard for severity/priority columns.
 *
 * Font weight scales with severity: Bold (critical) → Light (none)
 * This provides additional visual hierarchy beyond color.
 *
 * @component ATOM
 * @category Data Display
 *
 * @example
 * ```tsx
 * // Using preset mapping
 * <DataTableSeverity value="critical" mapping={PRIORITY_SEVERITY_MAP} />
 *
 * // Lead priority
 * <DataTableSeverity value="hot" mapping={LEAD_TEMPERATURE_SEVERITY_MAP} />
 *
 * // Custom mapping
 * const customMap = {
 *   p1: { level: 'critical', label: 'P1 - Critical' },
 *   p2: { level: 'high', label: 'P2 - High' },
 *   p3: { level: 'medium', label: 'P3 - Medium' },
 *   p4: { level: 'low', label: 'P4 - Low' },
 * }
 * <DataTableSeverity value="p1" mapping={customMap} />
 *
 * // Icon only (no label)
 * <DataTableSeverity value="critical" mapping={PRIORITY_SEVERITY_MAP} showLabel={false} />
 * ```
 *
 * @accessibility
 * - Icon has aria-label for screen readers
 * - Text label provides redundant information for colorblind users
 * - Font weight adds another layer of visual differentiation
 * - Semantic severity levels map to consistent visual indicators
 */
export function DataTableSeverity<T extends string = string>({
  value,
  mapping,
  size = "sm",
  className,
  showLabel = true,
  ...props
}: DataTableSeverityProps<T>) {
  const config = mapping[value]

  // Fallback if value not in mapping
  if (!config) {
    console.warn(
      `DataTableSeverity: Unknown value "${value}" not found in mapping`
    )
    return (
      <span
        data-slot="data-table-severity"
        className={cn("inline-flex items-center", INDICATOR_LABEL_GAP, className)}
        {...props}
      >
        <SeverityIndicator level="none" size={size} />
        {showLabel && (
          <SeverityLabel
            label={value}
            fontWeight="font-light"
            isFallback
          />
        )}
      </span>
    )
  }

  const { level, label } = config
  const fontWeight = getSeverityFontWeight(level)

  return (
    <span
      data-slot="data-table-severity"
      className={cn("inline-flex items-center", INDICATOR_LABEL_GAP, className)}
      {...props}
    >
      <SeverityIndicator level={level} size={size} />
      {showLabel && <SeverityLabel label={label} fontWeight={fontWeight} />}
    </span>
  )
}

DataTableSeverity.displayName = "DataTableSeverity"

// =============================================================================
// EXPORTS
// =============================================================================

export default DataTableSeverity
