/**
 * EmailLink - Reusable email link component for DataTable cells
 *
 * Ensures WCAG AAA contrast (12.89:1) with text-primary and underline.
 * Provides accessible mailto links with proper event handling.
 *
 * @component ATOM
 *
 * @example
 * ```tsx
 * // Basic usage in DataTable column
 * {
 *   id: 'email',
 *   header: 'Email',
 *   accessor: (row) => <EmailLink email={row.email} />,
 * }
 *
 * // With custom click handler
 * <EmailLink
 *   email="user@example.com"
 *   onClick={(e) => trackEmailClick(e)}
 * />
 * ```
 *
 * @accessibility
 * - High contrast (12.89:1 WCAG AAA compliant)
 * - Underlined for clear link indication
 * - Stops propagation to prevent row clicks in tables
 * - Native anchor element for keyboard navigation
 *
 * @testing Use `data-slot="email-link"` for test selectors
 */

import * as React from "react"
import { cn } from "../../../lib/utils"

// =============================================================================
// CONSTANTS
// =============================================================================

/** Protocol prefix for email links */
const EMAIL_PROTOCOL_PREFIX = "mailto:"

/** Data attribute for test selectors */
const DATA_SLOT = "email-link"

/** Base styles for the email link */
const BASE_STYLES = "text-primary underline hover:text-accent transition-colors"

// =============================================================================
// TYPES
// =============================================================================

/**
 * Props for the EmailLink component
 * Extends anchor HTMLAttributes for full native support
 */
export interface EmailLinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  /** Email address to link to */
  email: string
}

// =============================================================================
// COMPONENTS
// =============================================================================

/**
 * EmailLink - Accessible email link for table cells
 *
 * Features:
 * - High contrast (12.89:1 WCAG AAA)
 * - Stops propagation to prevent row clicks
 * - Underlined for clear link indication
 * - Hover state changes to text-accent
 */
export const EmailLink = React.forwardRef<HTMLAnchorElement, EmailLinkProps>(
  ({ email, className, onClick, ...props }, ref) => {
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.stopPropagation()
      onClick?.(e)
    }

    return (
      <a
        ref={ref}
        href={`${EMAIL_PROTOCOL_PREFIX}${email}`}
        data-slot={DATA_SLOT}
        className={cn(BASE_STYLES, className)}
        onClick={handleClick}
        {...props}
      >
        {email}
      </a>
    )
  }
)

EmailLink.displayName = "EmailLink"

export default EmailLink
