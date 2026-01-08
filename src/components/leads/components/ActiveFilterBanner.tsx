/**
 * ActiveFilterBanner - Shows when a KPI widget filter is active
 */

import { Filter, X } from 'lucide-react'
import type { WidgetFilter } from '../types'

export interface ActiveFilterBannerProps {
  activeWidget: WidgetFilter
  filteredCount: number
  totalCount: number
  onClear: () => void
}

/** Map widget filter to display label */
const FILTER_LABELS: Record<string, string> = {
  new: 'New Leads',
  in_progress: 'Leads in Progress',
  converted: 'Converted',
  high_priority: 'High Priority',
}

export function ActiveFilterBanner({ activeWidget, filteredCount, totalCount, onClear }: ActiveFilterBannerProps) {
  const filterLabel = FILTER_LABELS[activeWidget as string] ?? ''

  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3 bg-accent-bg border border-accent rounded-lg">
      <div className="flex items-center gap-2 text-sm text-accent">
        <Filter className="w-4 h-4" />
        <span className="font-medium">Filter active: {filterLabel}</span>
        <span className="text-accent/70">
          — Showing {filteredCount} of {totalCount} leads
        </span>
      </div>
      <button
        type="button"
        onClick={onClear}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-accent bg-surface border border-accent rounded-md hover:bg-accent-bg transition-colors"
      >
        <X className="w-3.5 h-3.5" />
        Clear filter
      </button>
    </div>
  )
}
