/**
 * PartnerId - Displays truncated partner ID
 * @module partners/components/PartnerId
 */

import { PARTNER_ID_TRUNCATE_LENGTH } from "../constants"

interface PartnerIdProps {
  /** Full partner ID string */
  id: string
}

/**
 * PartnerId - Renders a truncated, monospace partner ID
 */
export function PartnerId({ id }: PartnerIdProps) {
  const truncated = id.length > PARTNER_ID_TRUNCATE_LENGTH
    ? `${id.slice(0, PARTNER_ID_TRUNCATE_LENGTH)}...`
    : id

  return (
    <span className="text-xs text-muted font-mono">{truncated}</span>
  )
}
