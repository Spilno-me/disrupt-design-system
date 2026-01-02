/**
 * Module Helpers - Status variants, icon mapping, date formatting
 *
 * Provides utilities for the modules management interface.
 */

import {
  Package,
  AlertTriangle,
  ClipboardList,
  FileCheck,
  Shield,
  Users,
  Settings,
  Database,
  type LucideIcon,
} from 'lucide-react'

// =============================================================================
// TYPES
// =============================================================================

export type ModuleStatus = 'draft' | 'active' | 'inactive'

export type BadgeVariant = 'success' | 'secondary' | 'outline' | 'warning' | 'destructive' | 'info' | 'default'

export interface ModuleStatusConfig {
  label: string
  variant: BadgeVariant
  description: string
}

// =============================================================================
// STATUS CONFIGURATION
// =============================================================================

/**
 * Status badge configuration for modules.
 * - Active: success (green) - module is live and available
 * - Inactive: secondary (gray) - module is archived/disabled
 * - Draft: outline (border only) - module is under development
 */
export const MODULE_STATUS_CONFIG: Record<ModuleStatus, ModuleStatusConfig> = {
  active: {
    label: 'Active',
    variant: 'success',
    description: 'Module is live and available for use',
  },
  inactive: {
    label: 'Inactive',
    variant: 'secondary',
    description: 'Module is archived and read-only',
  },
  draft: {
    label: 'Draft',
    variant: 'outline',
    description: 'Module is under development',
  },
}

// =============================================================================
// MODULE ICON MAPPING
// =============================================================================

/**
 * Icon mapping for common module types.
 * Based on module code patterns from Flow.
 */
const MODULE_ICON_MAP: Record<string, LucideIcon> = {
  'incident': AlertTriangle,
  'incidents': AlertTriangle,
  'incident-management': AlertTriangle,
  'corrective-action': ClipboardList,
  'corrective-actions': ClipboardList,
  'inspection': FileCheck,
  'inspections': FileCheck,
  'permit': Shield,
  'permits': Shield,
  'user': Users,
  'users': Users,
  'configuration': Settings,
  'config': Settings,
  'dictionary': Database,
}

/**
 * Get the appropriate icon for a module based on its code.
 * Falls back to Package icon if no match found.
 */
export function getModuleIcon(moduleCode: string): LucideIcon {
  const code = moduleCode.toLowerCase()

  // Direct match
  if (MODULE_ICON_MAP[code]) {
    return MODULE_ICON_MAP[code]
  }

  // Partial match (e.g., "carus-incident-management" matches "incident")
  for (const [key, icon] of Object.entries(MODULE_ICON_MAP)) {
    if (code.includes(key)) {
      return icon
    }
  }

  // Default fallback
  return Package
}

// =============================================================================
// MODULE ICON COLORS
// =============================================================================

/**
 * Color mapping for module icons.
 * Colors are based on the module's primary purpose/domain.
 */
const MODULE_COLORS: Record<string, { bg: string; icon: string }> = {
  'incident': { bg: 'bg-warning/10', icon: 'text-warning' },
  'incidents': { bg: 'bg-warning/10', icon: 'text-warning' },
  'incident-management': { bg: 'bg-warning/10', icon: 'text-warning' },
  'corrective-action': { bg: 'bg-accent/10', icon: 'text-accent' },
  'corrective-actions': { bg: 'bg-accent/10', icon: 'text-accent' },
  'inspection': { bg: 'bg-success/10', icon: 'text-success' },
  'inspections': { bg: 'bg-success/10', icon: 'text-success' },
  'permit': { bg: 'bg-info/10', icon: 'text-info' },
  'permits': { bg: 'bg-info/10', icon: 'text-info' },
  'user': { bg: 'bg-error/10', icon: 'text-error' },
  'users': { bg: 'bg-error/10', icon: 'text-error' },
  'configuration': { bg: 'bg-muted-bg', icon: 'text-tertiary' },
  'config': { bg: 'bg-muted-bg', icon: 'text-tertiary' },
  'dictionary': { bg: 'bg-muted-bg', icon: 'text-tertiary' },
  default: { bg: 'bg-accent-bg', icon: 'text-accent' },
}

/**
 * Get the color configuration for a module based on its code.
 */
export function getModuleColors(moduleCode: string): { bg: string; icon: string } {
  const code = moduleCode.toLowerCase()

  // Direct match
  if (MODULE_COLORS[code]) {
    return MODULE_COLORS[code]
  }

  // Partial match
  for (const [key, colors] of Object.entries(MODULE_COLORS)) {
    if (key !== 'default' && code.includes(key)) {
      return colors
    }
  }

  return MODULE_COLORS.default
}

// =============================================================================
// DATE FORMATTING
// =============================================================================

/**
 * Format a date as relative time (e.g., "2 days ago", "3 months ago").
 * Uses a simple implementation without external dependencies.
 */
export function formatRelativeDate(date: Date | string): string {
  const now = new Date()
  const target = typeof date === 'string' ? new Date(date) : date
  const diffMs = now.getTime() - target.getTime()
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)
  const diffWeeks = Math.floor(diffDays / 7)
  const diffMonths = Math.floor(diffDays / 30)
  const diffYears = Math.floor(diffDays / 365)

  if (diffSecs < 60) {
    return 'just now'
  }
  if (diffMins < 60) {
    return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`
  }
  if (diffHours < 24) {
    return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`
  }
  if (diffDays < 7) {
    return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`
  }
  if (diffWeeks < 4) {
    return `${diffWeeks} ${diffWeeks === 1 ? 'week' : 'weeks'} ago`
  }
  if (diffMonths < 12) {
    return `${diffMonths} ${diffMonths === 1 ? 'month' : 'months'} ago`
  }
  return `${diffYears} ${diffYears === 1 ? 'year' : 'years'} ago`
}

/**
 * Format a date as a short calendar date (e.g., "Jan 15, 2025").
 */
export function formatShortDate(date: Date | string): string {
  const target = typeof date === 'string' ? new Date(date) : date
  return target.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

// =============================================================================
// VALIDATION HELPERS
// =============================================================================

/**
 * Valid module statuses for validation.
 */
export const VALID_MODULE_STATUSES: ModuleStatus[] = ['draft', 'active', 'inactive']

/**
 * Type guard for valid module status.
 */
export function isValidModuleStatus(value: unknown): value is ModuleStatus {
  return typeof value === 'string' && VALID_MODULE_STATUSES.includes(value as ModuleStatus)
}

/**
 * Type guard for valid string (not [object Object]).
 */
export function isValidString(value: unknown): value is string {
  return typeof value === 'string' && !value.includes('[object')
}

/**
 * Type guard for valid number (finite, not NaN).
 */
export function isValidNumber(value: unknown): value is number {
  return typeof value === 'number' && !Number.isNaN(value) && Number.isFinite(value)
}
