/**
 * PartnerEditContent - Partner edit/create page content for Partner Portal
 *
 * Full-page partner editing experience.
 */

import * as React from 'react'
import { EditPartnerPage } from '../../../components/partners/pages'
import type { Partner } from '../../../components/partners/PartnersPage'
import type { PartnerFormData } from '../../../components/partners/EditPartnerDialog'

export interface PartnerEditContentProps {
  /** Partner to edit (null for create mode) */
  partner: Partner | null
  /** Edit or create mode */
  mode: 'edit' | 'create'
  /** Callback when form is submitted */
  onSubmit: (data: PartnerFormData) => Promise<void>
  /** Callback when navigating back to partners list */
  onBack: () => void
}

export function PartnerEditContent({
  partner,
  mode,
  onSubmit,
  onBack,
}: PartnerEditContentProps) {
  return (
    <EditPartnerPage
      partner={partner}
      mode={mode}
      onSubmit={onSubmit}
      onBack={onBack}
    />
  )
}
