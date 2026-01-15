/**
 * NotificationsTab - Notification preferences settings
 *
 * Allows users to configure email, push, and SMS notification preferences.
 *
 * @component MOLECULE
 */

import * as React from 'react'
import { useState } from 'react'
import { Smartphone, Phone, Save } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/card'
import { Button } from '../../ui/button'
import { Label } from '../../ui/label'
import { Checkbox } from '../../ui/checkbox'
import { Separator } from '../../ui/separator'
import type { NotificationsTabProps, NotificationSettings } from './types'

export function NotificationsTab({
  notifications: initialNotifications,
  loading = false,
  onSaveNotifications,
}: NotificationsTabProps) {
  const [notifications, setNotifications] =
    useState<NotificationSettings>(initialNotifications)

  const handleSaveNotifications = () => {
    onSaveNotifications?.(notifications)
  }

  const updateNotification = (key: keyof NotificationSettings, value: boolean) => {
    setNotifications({ ...notifications, [key]: value })
  }

  return (
    <div className="space-y-6 mt-6" data-testid="settings-notifications-tab">
      {/* Email Notifications */}
      <Card className="bg-surface border-default">
        <CardHeader>
          <CardTitle>Email Notifications</CardTitle>
          <CardDescription>Choose what emails you want to receive</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <NotificationToggle
            checked={notifications.emailNewLeads}
            onChange={(checked) => updateNotification('emailNewLeads', checked)}
            label="New Leads"
            description="Get notified when a new lead is created"
            testId="settings-notifications-email-leads"
          />
          <Separator />
          <NotificationToggle
            checked={notifications.emailInvoices}
            onChange={(checked) => updateNotification('emailInvoices', checked)}
            label="Invoice Updates"
            description="Receive updates on invoice status changes"
            testId="settings-notifications-email-invoices"
          />
          <Separator />
          <NotificationToggle
            checked={notifications.emailTenantRequests}
            onChange={(checked) => updateNotification('emailTenantRequests', checked)}
            label="Tenant Requests"
            description="Get notified about new tenant requests"
            testId="settings-notifications-email-tenants"
          />
          <Separator />
          <NotificationToggle
            checked={notifications.emailWeeklyDigest}
            onChange={(checked) => updateNotification('emailWeeklyDigest', checked)}
            label="Weekly Digest"
            description="Receive a weekly summary of your activity"
            testId="settings-notifications-email-digest"
          />
        </CardContent>
      </Card>

      {/* Other Notifications */}
      <Card className="bg-surface border-default">
        <CardHeader>
          <CardTitle>Other Notifications</CardTitle>
          <CardDescription>Configure push and SMS notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <NotificationToggleWithIcon
            checked={notifications.pushNotifications}
            onChange={(checked) => updateNotification('pushNotifications', checked)}
            icon={<Smartphone className="w-5 h-5 text-secondary" />}
            label="Push Notifications"
            description="Enable browser push notifications"
            testId="settings-notifications-push"
          />
          <Separator />
          <NotificationToggleWithIcon
            checked={notifications.smsAlerts}
            onChange={(checked) => updateNotification('smsAlerts', checked)}
            icon={<Phone className="w-5 h-5 text-secondary" />}
            label="SMS Alerts"
            description="Receive critical alerts via SMS"
            testId="settings-notifications-sms"
          />
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button variant="accent" onClick={handleSaveNotifications} disabled={loading} data-testid="settings-notifications-save-btn">
          <Save className="w-4 h-4 mr-2" />
          Save Preferences
        </Button>
      </div>
    </div>
  )
}

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

interface NotificationToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  description: string
  testId?: string
}

function NotificationToggle({
  checked,
  onChange,
  label,
  description,
  testId,
}: NotificationToggleProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-0.5">
        <Label>{label}</Label>
        <p className="text-sm text-muted">{description}</p>
      </div>
      <Checkbox checked={checked} onCheckedChange={(c) => onChange(!!c)} data-testid={testId} />
    </div>
  )
}

interface NotificationToggleWithIconProps extends NotificationToggleProps {
  icon: React.ReactNode
}

function NotificationToggleWithIcon({
  checked,
  onChange,
  icon,
  label,
  description,
  testId,
}: NotificationToggleWithIconProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        {icon}
        <div className="space-y-0.5">
          <Label>{label}</Label>
          <p className="text-sm text-secondary">{description}</p>
        </div>
      </div>
      <Checkbox checked={checked} onCheckedChange={(c) => onChange(!!c)} data-testid={testId} />
    </div>
  )
}

export default NotificationsTab
