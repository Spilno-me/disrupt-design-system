/**
 * PartnersEmptyState - Empty state display for partners table
 *
 * Shows contextual message based on whether filters are active.
 *
 * @component ATOM
 */

import { Building2 } from "lucide-react"

export interface PartnersEmptyStateProps {
  /** Whether any filters or search are active */
  hasActiveFilters: boolean
}

export function PartnersEmptyState({ hasActiveFilters }: PartnersEmptyStateProps) {
  const title = hasActiveFilters ? "No partners found" : "No partners yet"
  const description = hasActiveFilters
    ? "No partners match your search criteria. Try adjusting your filters."
    : "Get started by adding your first partner organization."

  return (
    <div className="flex flex-col items-center py-8">
      <div className="w-16 h-16 mb-4 rounded-full bg-muted-bg flex items-center justify-center">
        <Building2 className="h-8 w-8 text-muted" />
      </div>
      <h3 className="text-lg font-semibold text-primary mb-2">{title}</h3>
      <p className="text-muted text-sm max-w-sm text-center">{description}</p>
    </div>
  )
}
