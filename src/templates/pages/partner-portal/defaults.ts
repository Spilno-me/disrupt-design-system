/**
 * Default values and constants for Partner Portal
 */

import type { UserInfo, UserMenuItem } from '../../../components/ui/AppHeader'
import type {
  UserProfile,
  CompanyProfile,
  NotificationSettings,
} from '../../../components/partners/SettingsPage'

/**
 * Default user info when none provided
 */
export const DEFAULT_USER: UserInfo = {
  name: 'Partner User',
  email: 'user@partner.com',
}

/**
 * Get default settings based on user info
 */
export function getDefaultSettings(user: UserInfo): {
  defaultUser: UserProfile
  defaultCompany: CompanyProfile
  defaultNotifications: NotificationSettings
} {
  const defaultUser: UserProfile = {
    firstName: user.name?.split(' ')[0] ?? 'Partner',
    lastName: user.name?.split(' ').slice(1).join(' ') ?? 'User',
    email: user.email ?? 'user@partner.com',
    phone: '+1 (555) 123-4567',
    role: 'Partner Administrator',
    timezone: 'America/New_York',
  }

  const defaultCompany: CompanyProfile = {
    name: 'Partner Company',
    address: '123 Business Park Drive',
    city: 'San Francisco',
    state: 'CA',
    zip: '94102',
    country: 'United States',
    website: 'https://partnercompany.com',
    phone: '+1 (555) 987-6543',
  }

  const defaultNotifications: NotificationSettings = {
    emailNewLeads: true,
    emailInvoices: true,
    emailTenantRequests: true,
    emailWeeklyDigest: false,
    pushNotifications: true,
    smsAlerts: false,
  }

  return { defaultUser, defaultCompany, defaultNotifications }
}
