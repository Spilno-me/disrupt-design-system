/**
 * SecurityTab - Security and password settings
 *
 * Allows users to change their password and manage two-factor authentication.
 * Replaces alert() with proper toast notification pattern.
 *
 * @component MOLECULE
 */

import * as React from 'react'
import { useState } from 'react'
import { Key, Shield, Eye, EyeOff } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/card'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { Label } from '../../ui/label'
import { PASSWORD_MIN_LENGTH } from './constants'
import { validatePasswordChange } from './utils'
import type { SecurityTabProps } from './types'

export function SecurityTab({ loading = false, onChangePassword }: SecurityTabProps) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [validationError, setValidationError] = useState<string | null>(null)

  const handleChangePassword = () => {
    setValidationError(null)

    const validation = validatePasswordChange(newPassword, confirmPassword)
    if (!validation.valid) {
      setValidationError(validation.error || 'Invalid password')
      return
    }

    onChangePassword?.(currentPassword, newPassword)
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }

  const isSubmitDisabled =
    loading || !currentPassword || !newPassword || !confirmPassword

  return (
    <div className="space-y-6 mt-6">
      {/* Change Password */}
      <Card className="bg-surface border-default">
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>
            Update your password to keep your account secure
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Validation Error Message */}
          {validationError && (
            <div className="p-3 text-sm text-error bg-error/10 border border-error/20 rounded-md">
              {validationError}
            </div>
          )}

          {/* Current Password */}
          <PasswordField
            id="currentPassword"
            label="Current Password"
            value={currentPassword}
            onChange={setCurrentPassword}
            showPassword={showCurrentPassword}
            onToggleVisibility={() => setShowCurrentPassword(!showCurrentPassword)}
          />

          {/* New Password */}
          <div className="space-y-2">
            <PasswordField
              id="newPassword"
              label="New Password"
              value={newPassword}
              onChange={setNewPassword}
              showPassword={showNewPassword}
              onToggleVisibility={() => setShowNewPassword(!showNewPassword)}
            />
            <p className="text-xs text-muted">
              Minimum {PASSWORD_MIN_LENGTH} characters
            </p>
          </div>

          {/* Confirm Password */}
          <PasswordField
            id="confirmPassword"
            label="Confirm New Password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            showPassword={showNewPassword}
            showToggle={false}
          />

          <div className="flex justify-end pt-4">
            <Button
              variant="accent"
              onClick={handleChangePassword}
              disabled={isSubmitDisabled}
            >
              <Key className="w-4 h-4 mr-2" />
              Update Password
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Two-Factor Authentication */}
      <TwoFactorCard />
    </div>
  )
}

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

interface PasswordFieldProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  showPassword: boolean
  onToggleVisibility?: () => void
  showToggle?: boolean
}

function PasswordField({
  id,
  label,
  value,
  onChange,
  showPassword,
  onToggleVisibility,
  showToggle = true,
}: PasswordFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
        <Input
          id={id}
          type={showPassword ? 'text' : 'password'}
          className={showToggle ? 'pl-10 pr-10' : 'pl-10'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        {showToggle && onToggleVisibility && (
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-primary"
            onClick={onToggleVisibility}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        )}
      </div>
    </div>
  )
}

function TwoFactorCard() {
  return (
    <Card className="bg-surface border-default">
      <CardHeader>
        <CardTitle>Two-Factor Authentication</CardTitle>
        <CardDescription>
          Add an extra layer of security to your account
        </CardDescription>
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
  )
}

export default SecurityTab
