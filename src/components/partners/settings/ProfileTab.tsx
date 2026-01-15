/**
 * ProfileTab - Personal profile settings
 *
 * Allows users to update their personal information including
 * name, email, phone, timezone, and avatar.
 *
 * @component MOLECULE
 */

import * as React from 'react'
import { useState } from 'react'
import { Mail, Phone, Camera, Save } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/card'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { Label } from '../../ui/label'
import { Separator } from '../../ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select'
import { TIMEZONE_OPTIONS } from './constants'
import { getUserInitials } from './utils'
import type { ProfileTabProps, UserProfile } from './types'

export function ProfileTab({
  user: initialUser,
  loading = false,
  onSaveProfile,
  onChangeAvatar,
}: ProfileTabProps) {
  const [user, setUser] = useState<UserProfile>(initialUser)

  const initials = getUserInitials(user.firstName, user.lastName)

  const handleSaveProfile = () => {
    onSaveProfile?.(user)
  }

  const handleAvatarClick = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) onChangeAvatar?.(file)
    }
    input.click()
  }

  return (
    <div className="space-y-6 mt-6" data-testid="settings-profile-tab">
      <Card className="bg-surface border-default">
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your personal details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar Section */}
          <AvatarSection
            user={user}
            initials={initials}
            onAvatarClick={handleAvatarClick}
          />

          <Separator />

          {/* Form Fields */}
          <ProfileFormFields user={user} setUser={setUser} />

          <div className="flex justify-end">
            <Button variant="accent" onClick={handleSaveProfile} disabled={loading} data-testid="settings-profile-save-btn">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

interface AvatarSectionProps {
  user: UserProfile
  initials: string
  onAvatarClick: () => void
}

function AvatarSection({ user, initials, onAvatarClick }: AvatarSectionProps) {
  return (
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
          onClick={onAvatarClick}
          data-testid="settings-profile-avatar-btn"
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
  )
}

interface ProfileFormFieldsProps {
  user: UserProfile
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>
}

function ProfileFormFields({ user, setUser }: ProfileFormFieldsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="firstName">First Name</Label>
        <Input
          id="firstName"
          value={user.firstName}
          onChange={(e) => setUser({ ...user, firstName: e.target.value })}
          data-testid="settings-profile-first-name"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="lastName">Last Name</Label>
        <Input
          id="lastName"
          value={user.lastName}
          onChange={(e) => setUser({ ...user, lastName: e.target.value })}
          data-testid="settings-profile-last-name"
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
            data-testid="settings-profile-email"
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
            data-testid="settings-profile-phone"
          />
        </div>
      </div>
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="timezone">Timezone</Label>
        <Select
          value={user.timezone}
          onValueChange={(v) => setUser({ ...user, timezone: v })}
        >
          <SelectTrigger data-testid="settings-profile-timezone">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TIMEZONE_OPTIONS.map((tz) => (
              <SelectItem key={tz.value} value={tz.value}>
                {tz.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

export default ProfileTab
