/**
 * PartnerId - Displays truncated partner ID
 * @module partners/components/PartnerId
 */

import { PARTNER_ID_TRUNCATE_LENGTH } from "../constants"

interface PartnerIdProps {
  /** Full partner ID string */
  id: string
  /** Optional test ID for automated testing */
  "data-testid"?: string
}

/**
 * PartnerId - Renders a truncated, monospace partner ID
 */
export function PartnerId({ id, "data-testid": testId }: PartnerIdProps) {
  const truncated = id.length > PARTNER_ID_TRUNCATE_LENGTH
    ? `${id.slice(0, PARTNER_ID_TRUNCATE_LENGTH)}...`
    : id

  return (
    <span className="text-xs text-muted font-mono" data-testid={testId}>{truncated}</span>
  )
}
