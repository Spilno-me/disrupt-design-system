/**
 * Utilities for Settings Page components
 *
 * Pure utility functions for settings validation and formatting.
 */

import { PASSWORD_MIN_LENGTH } from './constants'
import type { PasswordValidationResult } from './types'

// =============================================================================
// PASSWORD VALIDATION
// =============================================================================

/**
 * Validates password change request
 *
 * @param newPassword - The new password to validate
 * @param confirmPassword - The confirmation password
 * @returns Validation result with error message if invalid
 */
export function validatePasswordChange(
  newPassword: string,
  confirmPassword: string
): PasswordValidationResult {
  if (newPassword !== confirmPassword) {
    return { valid: false, error: 'Passwords do not match' }
  }

  if (newPassword.length < PASSWORD_MIN_LENGTH) {
    return {
      valid: false,
      error: `Password must be at least ${PASSWORD_MIN_LENGTH} characters`,
    }
  }

  return { valid: true }
}

// =============================================================================
// USER HELPERS
// =============================================================================

/**
 * Generates user initials from first and last name
 *
 * @param firstName - User's first name
 * @param lastName - User's last name
 * @returns Two-letter uppercase initials
 */
export function getUserInitials(firstName: string, lastName: string): string {
  const first = firstName?.[0] || ''
  const last = lastName?.[0] || ''
  return `${first}${last}`.toUpperCase()
}
