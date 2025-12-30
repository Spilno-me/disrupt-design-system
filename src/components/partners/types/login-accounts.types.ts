/**
 * Type definitions for Partner Login Accounts page
 * @module partners/types/login-accounts.types
 */

export type LoginAccountStatus = "active" | "inactive" | "pending"

export interface LoginAccount {
  /** Unique identifier */
  id: string
  /** First name */
  firstName: string
  /** Last name */
  lastName: string
  /** Email address */
  email: string
  /** Current status */
  status: LoginAccountStatus
  /** Date created */
  createdAt: Date
}

export interface CreateLoginAccountData {
  email: string
  firstName: string
  lastName: string
}

export interface PartnerLoginAccountsPageProps {
  /** Partner name for display */
  partnerName?: string
  /** Partner ID for reference */
  partnerId?: string
  /** Initial login accounts data */
  loginAccounts?: LoginAccount[]
  /** Callback when "Back to Partners" is clicked */
  onBackClick?: () => void
  /** Callback when "Add Login Account" is clicked (if not provided, uses built-in dialog) */
  onAddLoginAccount?: () => void
  /** Callback when create form is submitted */
  onCreateLoginAccount?: (data: CreateLoginAccountData) => void | Promise<void>
  /** Callback when reset password is clicked */
  onResetPassword?: (account: LoginAccount, mode: "generate" | "custom", customPassword?: string) => void | Promise<void>
  /** Callback when delete is confirmed */
  onDeleteLoginAccount?: (account: LoginAccount) => void | Promise<void>
  /** Loading state */
  loading?: boolean
  /** Additional className for the container */
  className?: string
}
