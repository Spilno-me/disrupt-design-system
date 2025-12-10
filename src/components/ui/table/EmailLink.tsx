/**
 * EmailLink - Reusable email link component for DataTable cells
 *
 * Ensures WCAG AAA contrast (12.89:1) with text-primary and underline.
 */

import * as React from 'react'
import { cn } from '../../../lib/utils'

// =============================================================================
// TYPES
// =============================================================================

export interface EmailLinkProps {
  /** Email address */
  email: string
  /** Additional className */
  className?: string
  /** Click handler (optional) */
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void
}

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * EmailLink - Accessible email link for table cells
 *
 * Features:
 * - High contrast (12.89:1 WCAG AAA)
 * - Stops propagation to prevent row clicks
 * - Underlined for clear link indication
 * - Hover state changes to text-secondary
 *
 * @example
 * ```tsx
 * {
 *   id: 'email',
 *   header: 'Email',
 *   accessor: (row) => <EmailLink email={row.email} />,
 * }
 * ```
 */
export function EmailLink({ email, className, onClick }: EmailLinkProps) {
  return (
    <a
      href={`mailto:${email}`}
      className={cn(
        'text-primary underline hover:text-secondary transition-colors',
        className
      )}
      onClick={(e) => {
        e.stopPropagation()
        onClick?.(e)
      }}
    >
      {email}
    </a>
  )
}

export default EmailLink
