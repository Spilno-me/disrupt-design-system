/**
 * LeadsContent - Leads tab content for Partner Portal
 *
 * Renders the leads management page.
 */

import * as React from 'react'
import { LeadsPage } from '../../../components/leads/LeadsPage'
import type { Lead, LeadAction } from '../../../components/leads/LeadCard'
import type { CreateLeadFormData } from '../../../components/leads/CreateLeadDialog'
import type { FilterState } from '../../../components/shared/SearchFilter/types'
import type { PartnerPortalStats } from './types'

export interface LeadsContentProps {
  /** Leads data */
  leads: Lead[]
  /** Stats for leads */
  stats?: PartnerPortalStats['leads']
  /** Callback when lead is clicked */
  onLeadClick?: (lead: Lead) => void
  /** Callback when lead action is triggered */
  onLeadAction?: (lead: Lead, action: LeadAction) => void
  /** Callback when creating a lead */
  onCreateLead?: (data: CreateLeadFormData) => void
  /** Partners to assign leads to */
  partners?: Array<{ id: string; name: string }>
  /** Initial filters (e.g., from dashboard KPI navigation) */
  initialFilters?: FilterState
}

export function LeadsContent({
  leads,
  stats,
  onLeadClick,
  onLeadAction,
  onCreateLead,
  partners = [],
  initialFilters,
}: LeadsContentProps) {
  return (
    <LeadsPage
      leads={leads}
      stats={stats}
      onLeadClick={onLeadClick}
      onLeadAction={onLeadAction}
      onCreateLead={onCreateLead}
      partners={partners}
      initialFilters={initialFilters}
    />
  )
}
