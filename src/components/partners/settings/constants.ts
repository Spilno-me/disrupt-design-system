/**
 * Constants for Settings Page components
 *
 * Centralized configuration values used across settings tabs.
 */

// =============================================================================
// TIMEZONE OPTIONS
// =============================================================================

export const TIMEZONE_OPTIONS = [
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'Europe/London', label: 'Greenwich Mean Time (GMT)' },
  { value: 'Europe/Paris', label: 'Central European Time (CET)' },
  { value: 'Australia/Sydney', label: 'Australian Eastern (AEST)' },
] as const

// =============================================================================
// PASSWORD VALIDATION
// =============================================================================

export const PASSWORD_MIN_LENGTH = 8
