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

/** Form data for creating/editing a network partner (comprehensive) */
export interface NetworkPartnerFormData {
  // Company Information
  companyName: string
  industry: string
  companySize: string
  website: string

  // Contact Information
  contactName: string
  contactEmail: string
  contactPhone: string

  // Partner Type
  isMasterPartner: boolean

  // Address (Optional)
  country: string
  streetAddress: string
  city: string
  state: string
  zipCode: string
}

/** Form data for creating a sub-partner (comprehensive) */
export interface SubPartnerFormData {
  // Company Information
  companyName: string
  industry: string
  companySize: string
  website: string

  // Contact Information
  contactName: string
  contactEmail: string
  contactPhone: string

  // Address (Optional)
  country: string
  streetAddress: string
  city: string
  state: string
  zipCode: string
}

export interface PartnerNetworkPageProps {
  /** Partner hierarchy data */
  partners?: NetworkPartner[]
  /** Loading state */
  loading?: boolean

  // --- CRUD Callbacks (adapter pattern) ---
  /** Callback when a new partner is created via form */
  onCreatePartner?: (data: NetworkPartnerFormData) => void | Promise<void>
  /** Callback when a partner is updated via form */
  onUpdatePartner?: (partner: NetworkPartner, data: NetworkPartnerFormData) => void | Promise<void>
  /** Callback when delete is confirmed */
  onConfirmDelete?: (partner: NetworkPartner) => void | Promise<void>
  /** Callback when a sub-partner is created */
  onCreateSubPartner?: (parent: NetworkPartner, data: SubPartnerFormData) => void | Promise<void>

  // --- Navigation Callbacks ---
  /** Callback when a partner row is clicked (view details) */
  onViewPartner?: (partner: NetworkPartner) => void
  /** Callback when "Manage Users" is clicked */
  onManageUsers?: (partner: NetworkPartner) => void

  // --- Legacy callbacks (deprecated, use CRUD callbacks above) ---
  /** @deprecated Use onCreatePartner instead */
  onAddPartner?: () => void
  /** @deprecated Use onUpdatePartner instead */
  onEditPartner?: (partner: NetworkPartner) => void
  /** @deprecated Use onCreateSubPartner instead */
  onAddSubPartner?: (parentPartner: NetworkPartner) => void
  /** @deprecated Use onConfirmDelete instead */
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
