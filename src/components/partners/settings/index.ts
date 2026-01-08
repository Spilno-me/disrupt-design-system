/**
 * Settings Page Components
 *
 * Barrel export for all settings-related components and types.
 */

// Components
export { ProfileTab } from './ProfileTab'
export { CompanyTab } from './CompanyTab'
export { NotificationsTab } from './NotificationsTab'
export { SecurityTab } from './SecurityTab'

// Types
export type {
  UserProfile,
  CompanyProfile,
  NotificationSettings,
  ProfileTabProps,
  CompanyTabProps,
  NotificationsTabProps,
  SecurityTabProps,
  SettingsPageProps,
  PasswordValidationResult,
} from './types'

// Constants
export { TIMEZONE_OPTIONS, PASSWORD_MIN_LENGTH } from './constants'

// Utils
export { validatePasswordChange, getUserInitials } from './utils'
