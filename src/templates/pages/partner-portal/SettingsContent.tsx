/**
 * SettingsContent - Settings tab content for Partner Portal
 *
 * User profile, company, and notification settings.
 */

import * as React from 'react'
import {
  SettingsPage,
  UserProfile,
  CompanyProfile,
  NotificationSettings,
} from '../../../components/partners/SettingsPage'

export interface SettingsContentProps {
  /** User profile data */
  user: UserProfile
  /** Company profile data */
  company: CompanyProfile
  /** Notification settings */
  notifications: NotificationSettings
  /** Callback when saving profile */
  onSaveProfile?: (profile: UserProfile) => void
  /** Callback when saving company */
  onSaveCompany?: (company: CompanyProfile) => void
  /** Callback when saving notifications */
  onSaveNotifications?: (notifications: NotificationSettings) => void
  /** Callback when changing password */
  onChangePassword?: (currentPassword: string, newPassword: string) => void
  /** Callback when changing avatar */
  onChangeAvatar?: (file: File) => void
}

export function SettingsContent({
  user,
  company,
  notifications,
  onSaveProfile,
  onSaveCompany,
  onSaveNotifications,
  onChangePassword,
  onChangeAvatar,
}: SettingsContentProps) {
  return (
    <SettingsPage
      user={user}
      company={company}
      notifications={notifications}
      onSaveProfile={onSaveProfile}
      onSaveCompany={onSaveCompany}
      onSaveNotifications={onSaveNotifications}
      onChangePassword={onChangePassword}
      onChangeAvatar={onChangeAvatar}
    />
  )
}
