/**
 * Leads Module Types
 *
 * Central type definitions for the leads management module.
 * Re-exports Lead types from LeadCard for convenience.
 */

import type { FilterState } from '../shared/SearchFilter/types'
import type { SortDirection } from '../ui/DataTable'
import type { Lead, LeadAction } from './LeadCard'
import type { CreateLeadFormData, Partner } from './CreateLeadDialog'
import type { BulkAction } from './BulkActionsToolbar'
import type { ExportOptions } from './ExportButton'

// Re-export for convenience
export type { Lead, LeadAction } from './LeadCard'
export type { CreateLeadFormData, Partner } from './CreateLeadDialog'
export type { BulkAction } from './BulkActionsToolbar'
export type { ExportOptions } from './ExportButton'
export type { FilterState }
export type { SortDirection }

// =============================================================================
// WIDGET FILTER TYPES
// =============================================================================

/** Widget filter options for KPI cards */
export type WidgetFilter = 'all' | 'new' | 'in_progress' | 'converted' | 'high_priority' | null

// =============================================================================
// LEADS PAGE TYPES
// =============================================================================

/** Stats configuration for KPI cards */
export interface LeadsStats {
  totalLeads?: { value: number; trend?: string; trendDirection?: 'up' | 'down' | 'neutral' }
  newLeads?: { value: number; trend?: string; trendDirection?: 'up' | 'down' | 'neutral' }
  converted?: { value: number; trend?: string; trendDirection?: 'up' | 'down' | 'neutral' }
  highPriority?: { value: number; trend?: string; trendDirection?: 'up' | 'down' | 'neutral' }
  avgResponse?: { value: string; trend?: string; trendDirection?: 'up' | 'down' | 'neutral' }
}

/** Props for LeadsPage component */
export interface LeadsPageProps {
  /** Array of leads to display */
  leads: Lead[]
  /** Stats to display at top */
  stats?: LeadsStats
  /** Callback when a lead is clicked */
  onLeadClick?: (lead: Lead) => void
  /** Callback when lead action is clicked (from table or card) */
  onLeadAction?: (lead: Lead, action: LeadAction) => void
  /** Callback when a new lead is created */
  onCreateLead?: (data: CreateLeadFormData) => void | Promise<void>
  /** List of partners for assignment dropdown */
  partners?: Partner[]
  /** Page title */
  title?: string
  /** Default page size */
  defaultPageSize?: number
  /** Loading state */
  loading?: boolean
  /** Additional className */
  className?: string
  /** Callback for bulk actions on selected leads */
  onBulkAction?: (action: BulkAction, leadIds: string[], data?: Record<string, unknown>) => void | Promise<void>
  /** Callback for export */
  onExport?: (options: ExportOptions) => void | Promise<void>
  /** Initial filters to apply on mount (e.g., from dashboard KPI navigation) */
  initialFilters?: FilterState
}
