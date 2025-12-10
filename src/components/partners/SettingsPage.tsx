import * as React from 'react'
import { useState } from 'react'
import {
  User,
  Building2,
  Bell,
  Shield,
  
  
  Save,
  Mail,
  Phone,
  MapPin,
  Globe,
  Camera,
  Key,
  Smartphone,
  Eye,
  EyeOff,
} from 'lucide-react'
import { cn } from '../../lib/utils'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Checkbox } from '../ui/checkbox'
import { Separator } from '../ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'

// =============================================================================
// TYPES
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

export interface NotificationSettings {
  emailNewLeads: boolean
  emailInvoices: boolean
  emailTenantRequests: boolean
  emailWeeklyDigest: boolean
  pushNotifications: boolean
  smsAlerts: boolean
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
// SETTINGS PAGE COMPONENT
// =============================================================================

export function SettingsPage({
  user: initialUser,
  company: initialCompany,
  notifications: initialNotifications,
  loading = false,
  onSaveProfile,
  onSaveCompany,
  onSaveNotifications,
  onChangePassword,
  onChangeAvatar,
  className,
}: SettingsPageProps) {
  const [user, setUser] = useState(initialUser)
  const [company, setCompany] = useState(initialCompany)
  const [notifications, setNotifications] = useState(initialNotifications)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()

  const handleSaveProfile = () => {
    onSaveProfile?.(user)
  }

  const handleSaveCompany = () => {
    onSaveCompany?.(company)
  }

  const handleSaveNotifications = () => {
    onSaveNotifications?.(notifications)
  }

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match')
      return
    }
    if (newPassword.length < 8) {
      alert('Password must be at least 8 characters')
      return
    }
    onChangePassword?.(currentPassword, newPassword)
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }

  return (
    <div className={cn('flex flex-col gap-6 p-6', className)}>
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-primary">Settings</h1>
        <p className="text-muted mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-flex">
          <TabsTrigger value="profile" className="gap-2">
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="company" className="gap-2">
            <Building2 className="w-4 h-4" />
            <span className="hidden sm:inline">Company</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="w-4 h-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6 mt-6">
          <Card className="bg-surface border-default">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt="Profile"
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-accent text-inverse flex items-center justify-center text-xl font-semibold">
                      {initials}
                    </div>
                  )}
                  <button
                    className="absolute bottom-0 right-0 w-8 h-8 bg-inverse-bg text-inverse rounded-full flex items-center justify-center hover:bg-accent transition-colors"
                    onClick={() => {
                      const input = document.createElement('input')
                      input.type = 'file'
                      input.accept = 'image/*'
                      input.onchange = (e) => {
                        const file = (e.target as HTMLInputElement).files?.[0]
                        if (file) onChangeAvatar?.(file)
                      }
                      input.click()
                    }}
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <p className="font-medium text-primary">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-sm text-muted">{user.role}</p>
                </div>
              </div>

              <Separator />

              {/* Form Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={user.firstName}
                    onChange={(e) => setUser({ ...user, firstName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={user.lastName}
                    onChange={(e) => setUser({ ...user, lastName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                    <Input
                      id="email"
                      type="email"
                      className="pl-10"
                      value={user.email}
                      onChange={(e) => setUser({ ...user, email: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                    <Input
                      id="phone"
                      type="tel"
                      className="pl-10"
                      value={user.phone || ''}
                      onChange={(e) => setUser({ ...user, phone: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={user.timezone}
                    onValueChange={(v) => setUser({ ...user, timezone: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                      <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                      <SelectItem value="Europe/London">Greenwich Mean Time (GMT)</SelectItem>
                      <SelectItem value="Europe/Paris">Central European Time (CET)</SelectItem>
                      <SelectItem value="Australia/Sydney">Australian Eastern (AEST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end">
                <Button variant="accent" onClick={handleSaveProfile} disabled={loading}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Company Tab */}
        <TabsContent value="company" className="space-y-6 mt-6">
          <Card className="bg-surface border-default">
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>Update your company details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <Input
                    id="companyName"
                    className="pl-10"
                    value={company.name}
                    onChange={(e) => setCompany({ ...company, name: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Street Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <Input
                    id="address"
                    className="pl-10"
                    value={company.address}
                    onChange={(e) => setCompany({ ...company, address: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={company.city}
                    onChange={(e) => setCompany({ ...company, city: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={company.state}
                    onChange={(e) => setCompany({ ...company, state: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zip">ZIP Code</Label>
                  <Input
                    id="zip"
                    value={company.zip}
                    onChange={(e) => setCompany({ ...company, zip: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={company.country}
                    onChange={(e) => setCompany({ ...company, country: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                    <Input
                      id="website"
                      type="url"
                      className="pl-10"
                      placeholder="https://"
                      value={company.website || ''}
                      onChange={(e) => setCompany({ ...company, website: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyPhone">Phone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                    <Input
                      id="companyPhone"
                      type="tel"
                      className="pl-10"
                      value={company.phone || ''}
                      onChange={(e) => setCompany({ ...company, phone: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button variant="accent" onClick={handleSaveCompany} disabled={loading}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6 mt-6">
          <Card className="bg-surface border-default">
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>Choose what emails you want to receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>New Leads</Label>
                  <p className="text-sm text-muted">Get notified when a new lead is created</p>
                </div>
                <Checkbox
                  checked={notifications.emailNewLeads}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, emailNewLeads: !!checked })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Invoice Updates</Label>
                  <p className="text-sm text-muted">Receive updates on invoice status changes</p>
                </div>
                <Checkbox
                  checked={notifications.emailInvoices}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, emailInvoices: !!checked })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Tenant Requests</Label>
                  <p className="text-sm text-muted">Get notified about new tenant requests</p>
                </div>
                <Checkbox
                  checked={notifications.emailTenantRequests}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, emailTenantRequests: !!checked })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Weekly Digest</Label>
                  <p className="text-sm text-muted">Receive a weekly summary of your activity</p>
                </div>
                <Checkbox
                  checked={notifications.emailWeeklyDigest}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, emailWeeklyDigest: !!checked })
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-surface border-default">
            <CardHeader>
              <CardTitle>Other Notifications</CardTitle>
              <CardDescription>Configure push and SMS notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-secondary" />
                  <div className="space-y-0.5">
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-secondary">Enable browser push notifications</p>
                  </div>
                </div>
                <Checkbox
                  checked={notifications.pushNotifications}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, pushNotifications: !!checked })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-secondary" />
                  <div className="space-y-0.5">
                    <Label>SMS Alerts</Label>
                    <p className="text-sm text-secondary">Receive critical alerts via SMS</p>
                  </div>
                </div>
                <Checkbox
                  checked={notifications.smsAlerts}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, smsAlerts: !!checked })
                  }
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button variant="accent" onClick={handleSaveNotifications} disabled={loading}>
              <Save className="w-4 h-4 mr-2" />
              Save Preferences
            </Button>
          </div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6 mt-6">
          <Card className="bg-surface border-default">
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your password to keep your account secure</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? 'text' : 'password'}
                    className="pl-10 pr-10"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-primary"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <Input
                    id="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    className="pl-10 pr-10"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-primary"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-muted">Minimum 8 characters</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <Input
                    id="confirmPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    className="pl-10"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  variant="accent"
                  onClick={handleChangePassword}
                  disabled={loading || !currentPassword || !newPassword || !confirmPassword}
                >
                  <Key className="w-4 h-4 mr-2" />
                  Update Password
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-surface border-default">
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>Add an extra layer of security to your account</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted-bg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-muted" />
                  </div>
                  <div>
                    <p className="font-medium text-primary">Two-factor authentication</p>
                    <p className="text-sm text-secondary">
                      Currently <span className="text-warning">disabled</span>
                    </p>
                  </div>
                </div>
                <Button variant="secondary">Enable 2FA</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default SettingsPage
