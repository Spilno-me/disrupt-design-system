/**
 * PartnersContent - Partners tab content for Partner Portal
 *
 * Manages partner listing and triggers navigation to edit page.
 */

import * as React from 'react'
import { PartnersPage } from '../../../components/partners/PartnersPage'
import type { Partner } from '../../../components/partners/PartnersPage'
import type { PartnerFormData } from '../../../components/partners/EditPartnerDialog'

export interface PartnersContentProps {
  /** Partners data */
  partners: Partner[]
  /** Callback when viewing a partner (navigates to edit page) */
  onViewPartner?: (partner: Partner) => void
  /** Callback when adding a new partner (navigates to create page) */
  onAddPartner?: () => void
  /** Callback when editing a partner inline */
  onEditPartner?: (partner: Partner, data: PartnerFormData) => void
  /** Callback when creating a partner inline */
  onCreatePartner?: (data: PartnerFormData) => void
  /** Callback when managing partner users */
  onManageUsers?: (partner: Partner) => void
  /** Callback when confirming partner deletion */
  onConfirmDelete?: (partner: Partner) => void
}

export function PartnersContent({
  partners,
  onViewPartner,
  onAddPartner,
  onEditPartner,
  onCreatePartner,
  onManageUsers,
  onConfirmDelete,
}: PartnersContentProps) {
  return (
    <div className="p-6">
      <PartnersPage
        partners={partners}
        onViewPartner={onViewPartner}
        onAddPartner={onAddPartner}
        onEditPartner={onEditPartner}
        onCreatePartner={onCreatePartner}
        onManageUsers={onManageUsers}
        onConfirmDelete={onConfirmDelete}
      />
    </div>
  )
}
