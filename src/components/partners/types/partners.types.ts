/**
 * Type definitions for Partners page
 * @module partners/types/partners.types
 */

import type { PartnerFormData } from "../EditPartnerDialog"

export type PartnerStatus = "active" | "inactive" | "pending"
export type PartnerTier = "Standard" | "Premium" | "Enterprise"

export interface Partner {
  /** Unique identifier */
  id: string
  /** Company/organization name */
  name: string
  /** Partner ID (displayed as truncated) */
  partnerId: string
  /** Primary contact name */
  contactName: string
  /** Primary contact email */
  contactEmail: string
  /** Partner tier level */
  tier: PartnerTier
  /** Current status */
  status: PartnerStatus
  /** Date created */
  createdAt: Date
}

export interface PartnersPageProps {
  /** Initial partners data */
  partners?: Partner[]
  /** Callback when "Add Partner" is clicked (if not provided, uses built-in dialog) */
  onAddPartner?: () => void
  /** Callback when view/edit action is clicked (if not provided, uses built-in dialog) */
  onViewPartner?: (partner: Partner) => void
  /** Callback when edit form is submitted */
  onEditPartner?: (partner: Partner, data: PartnerFormData) => void | Promise<void>
  /** Callback when create form is submitted */
  onCreatePartner?: (data: PartnerFormData) => void | Promise<void>
  /** Callback when users action is clicked */
  onManageUsers?: (partner: Partner) => void
  /** Callback when delete action is clicked (if not provided, uses built-in dialog) */
  onDeletePartner?: (partner: Partner) => void
  /** Callback when delete is confirmed */
  onConfirmDelete?: (partner: Partner) => void | Promise<void>
  /** Loading state */
  loading?: boolean
  /** Additional className for the container */
  className?: string
}
