/**
 * Types for Settings Page components
 *
 * Shared type definitions used across all settings tab components.
 */

// =============================================================================
// USER PROFILE TYPES
// =============================================================================

export interface UserProfile {
  firstName: string
  lastName: string
  email: string
  phone?: string
  avatarUrl?: string
  role: string
  timezone: string
}

// =============================================================================
// COMPANY PROFILE TYPES
// =============================================================================

export interface CompanyProfile {
  name: string
  address: string
  city: string
  state: string
  zip: string
  country: string
  website?: string
  phone?: string
}

// =============================================================================
// NOTIFICATION SETTINGS TYPES
// =============================================================================

export interface NotificationSettings {
  emailNewLeads: boolean
  emailInvoices: boolean
  emailTenantRequests: boolean
  emailWeeklyDigest: boolean
  pushNotifications: boolean
  smsAlerts: boolean
}

// =============================================================================
// COMPONENT PROPS
// =============================================================================

export interface ProfileTabProps {
  user: UserProfile
  loading?: boolean
  onSaveProfile?: (profile: UserProfile) => void
  onChangeAvatar?: (file: File) => void
}

export interface CompanyTabProps {
  company: CompanyProfile
  loading?: boolean
  onSaveCompany?: (company: CompanyProfile) => void
}

export interface NotificationsTabProps {
  notifications: NotificationSettings
  loading?: boolean
  onSaveNotifications?: (notifications: NotificationSettings) => void
}

export interface SecurityTabProps {
  loading?: boolean
  onChangePassword?: (currentPassword: string, newPassword: string) => void
}

export interface SettingsPageProps {
  /** Current user profile */
  user: UserProfile
  /** Company profile */
  company: CompanyProfile
  /** Notification settings */
  notifications: NotificationSettings
  /** Loading state */
  loading?: boolean
  /** Callback when profile is saved */
  onSaveProfile?: (profile: UserProfile) => void
  /** Callback when company is saved */
  onSaveCompany?: (company: CompanyProfile) => void
  /** Callback when notifications are saved */
  onSaveNotifications?: (notifications: NotificationSettings) => void
  /** Callback when password change is requested */
  onChangePassword?: (currentPassword: string, newPassword: string) => void
  /** Callback when avatar is changed */
  onChangeAvatar?: (file: File) => void
  /** Additional className */
  className?: string
}

// =============================================================================
// PASSWORD VALIDATION
// =============================================================================

export interface PasswordValidationResult {
  valid: boolean
  error?: string
}
