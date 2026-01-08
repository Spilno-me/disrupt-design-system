/**
 * MobileLeadsList - Mobile card grid view for leads
 */

import { LeadCard, Lead, LeadAction } from '../LeadCard'

export interface MobileLeadsListProps {
  leads: Lead[]
  loading: boolean
  searchValue: string
  onLeadClick?: (lead: Lead) => void
  onCardAction: (lead: Lead, action: LeadAction) => void
}

export function MobileLeadsList({ leads, loading, searchValue, onLeadClick, onCardAction }: MobileLeadsListProps) {
  if (loading) {
    return <LoadingSkeleton />
  }

  if (leads.length === 0) {
    return <EmptyState searchValue={searchValue} />
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {leads.map((lead) => (
        <LeadCard
          key={lead.id}
          lead={lead}
          onClick={onLeadClick}
          onActionClick={onCardAction}
        />
      ))}
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-40 bg-muted-bg rounded-lg animate-pulse" />
      ))}
    </div>
  )
}

function EmptyState({ searchValue }: { searchValue: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 mb-4 rounded-full bg-muted-bg flex items-center justify-center">
        <svg
          className="w-8 h-8 text-secondary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-primary mb-2">
        {searchValue ? 'No leads found' : 'No leads yet'}
      </h3>
      <p className="text-sm text-muted max-w-sm">
        {searchValue
          ? `No leads match your search "${searchValue}". Try adjusting your filters.`
          : 'Get started by adding your first lead or importing from a CSV file.'}
      </p>
    </div>
  )
}
