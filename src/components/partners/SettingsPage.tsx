/**
 * SettingsPage - Main settings page container
 *
 * Thin shell component that orchestrates the settings tab navigation.
 * Each tab's content is extracted into separate components in ./settings/
 *
 * @component ORGANISM
 *
 * Structure:
 * - ProfileTab: Personal profile settings
 * - CompanyTab: Company information
 * - NotificationsTab: Email, push, SMS preferences
 * - SecurityTab: Password and 2FA settings
 */

import * as React from 'react'
import { User, Building2, Bell, Shield } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { ProfileTab } from './settings/ProfileTab'
import { CompanyTab } from './settings/CompanyTab'
import { NotificationsTab } from './settings/NotificationsTab'
import { SecurityTab } from './settings/SecurityTab'
import type { SettingsPageProps } from './settings/types'

// Re-export types for backwards compatibility
export type {
  UserProfile,
  CompanyProfile,
  NotificationSettings,
  SettingsPageProps,
} from './settings/types'

// =============================================================================
// TAB CONFIGURATION
// =============================================================================

const SETTINGS_TABS = [
  { value: 'profile', label: 'Profile', icon: User },
  { value: 'company', label: 'Company', icon: Building2 },
  { value: 'notifications', label: 'Notifications', icon: Bell },
  { value: 'security', label: 'Security', icon: Shield },
] as const

// =============================================================================
// SETTINGS PAGE COMPONENT
// =============================================================================

export function SettingsPage({
  user,
  company,
  notifications,
  loading = false,
  onSaveProfile,
  onSaveCompany,
  onSaveNotifications,
  onChangePassword,
  onChangeAvatar,
  className,
}: SettingsPageProps) {
  return (
    <div className={cn('flex flex-col gap-6 p-6', className)} data-testid="settings-page">
      {/* Header */}
      <SettingsHeader />

      {/* Tabs */}
      <Tabs defaultValue="profile" className="w-full" data-testid="settings-tabs">
        <SettingsTabsList />

        <TabsContent value="profile">
          <ProfileTab
            user={user}
            loading={loading}
            onSaveProfile={onSaveProfile}
            onChangeAvatar={onChangeAvatar}
          />
        </TabsContent>

        <TabsContent value="company">
          <CompanyTab
            company={company}
            loading={loading}
            onSaveCompany={onSaveCompany}
          />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationsTab
            notifications={notifications}
            loading={loading}
            onSaveNotifications={onSaveNotifications}
          />
        </TabsContent>

        <TabsContent value="security">
          <SecurityTab loading={loading} onChangePassword={onChangePassword} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

function SettingsHeader() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-primary">Settings</h1>
      <p className="text-muted mt-1">Manage your account settings and preferences</p>
    </div>
  )
}

function SettingsTabsList() {
  return (
    <TabsList
      variant="accent"
      animated
      className="grid w-full grid-cols-4 lg:w-auto lg:inline-flex"
    >
      {SETTINGS_TABS.map((tab) => (
        <TabsTrigger key={tab.value} variant="accent" value={tab.value} className="gap-2" data-testid={`settings-tab-${tab.value}`}>
          <tab.icon className="w-4 h-4" />
          <span className="hidden sm:inline">{tab.label}</span>
        </TabsTrigger>
      ))}
    </TabsList>
  )
}

export default SettingsPage
