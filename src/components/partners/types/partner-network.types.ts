/**
 * Type definitions for Partner Network page
 * @module partners/types/partner-network.types
 */

export type NetworkPartnerStatus = "active" | "inactive" | "pending"

export interface NetworkPartnerMetrics {
  totalLeads: number
  conversion: number | null // percentage, null if N/A
  commission: number | null // dollar amount, null if N/A
  totalRevenue: number
}

export interface NetworkPartner {
  id: string
  companyName: string
  contactName: string
  contactEmail: string
  status: NetworkPartnerStatus
  monthlyRevenue: number
  metrics: NetworkPartnerMetrics
  isMasterPartner: boolean
  subPartners?: NetworkPartner[]
  parentId?: string
}

export interface PartnerNetworkPageProps {
  /** Partner hierarchy data */
  partners?: NetworkPartner[]
  /** Loading state */
  loading?: boolean
  /** Callback when Add Partner is clicked */
  onAddPartner?: () => void
  /** Callback when a partner is edited */
  onEditPartner?: (partner: NetworkPartner) => void
  /** Callback when a partner is viewed */
  onViewPartner?: (partner: NetworkPartner) => void
  /** Callback when Add Sub-Partner is clicked */
  onAddSubPartner?: (parentPartner: NetworkPartner) => void
  /** Callback when a partner is deleted */
  onDeletePartner?: (partner: NetworkPartner) => void
  /** Additional className */
  className?: string
}

export interface PartnerRowProps {
  partner: NetworkPartner
  depth?: number
  isExpanded?: boolean
  onToggleExpand?: () => void
  onEdit?: (partner: NetworkPartner) => void
  onAddSubPartner?: (partner: NetworkPartner) => void
  onDelete?: (partner: NetworkPartner) => void
}

export interface PartnerRowWrapperProps {
  partner: NetworkPartner
  depth?: number
  onEdit?: (partner: NetworkPartner) => void
  onAddSubPartner?: (partner: NetworkPartner) => void
  onDelete?: (partner: NetworkPartner) => void
  expandedIds: Set<string>
  onToggleExpand: (id: string) => void
}

export interface PartnerMetricsCardProps {
  metrics: NetworkPartnerMetrics
  depth?: number
}
