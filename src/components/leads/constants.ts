/**
 * Leads Module Constants
 *
 * Filter configuration and other constants for the leads management module.
 */

import type { FilterGroup } from '../shared/SearchFilter/types'

// =============================================================================
// FILTER CONFIGURATION
// =============================================================================

/** Filter groups for the SearchFilter component */
export const LEADS_FILTER_GROUPS: FilterGroup[] = [
  {
    key: 'status',
    label: 'Status',
    options: [
      { id: 'new', label: 'New' },
      { id: 'in_progress', label: 'In Progress' },
      { id: 'converted', label: 'Converted' },
      { id: 'lost', label: 'Lost' },
    ],
  },
  {
    key: 'priority',
    label: 'Priority',
    options: [
      { id: 'high', label: 'High' },
      { id: 'medium', label: 'Medium' },
      { id: 'low', label: 'Low' },
    ],
  },
  {
    key: 'source',
    label: 'Source',
    options: [
      { id: 'website', label: 'Website' },
      { id: 'referral', label: 'Referral' },
      { id: 'cold_outreach', label: 'Cold Outreach' },
      { id: 'partner', label: 'Partner' },
      { id: 'other', label: 'Other' },
    ],
  },
]

// =============================================================================
// PAGINATION DEFAULTS
// =============================================================================

/** Default page size for leads table */
export const DEFAULT_PAGE_SIZE = 10

/** Available page size options */
export const PAGE_SIZE_OPTIONS = [10, 25, 50]

// =============================================================================
// EMPTY FILTER STATE
// =============================================================================

/** Default empty filter state */
export const EMPTY_FILTER_STATE = {
  status: [],
  priority: [],
  source: [],
}

// =============================================================================
// LEAD FORM VALIDATION
// =============================================================================

/** Validation limits for lead forms */
export const LEAD_VALIDATION = {
  COMPANY_NAME_MIN: 2,
  COMPANY_NAME_MAX: 150,
  EMAIL_MAX: 254,
  PHONE_MIN_DIGITS: 7,
  NOTES_MAX: 2000,
} as const

/** Email format regex pattern */
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Validate company name field */
export function validateCompanyName(value: string): string | undefined {
  const trimmed = value.trim()
  if (!trimmed) return 'Company name is required.'
  if (trimmed.length < LEAD_VALIDATION.COMPANY_NAME_MIN) {
    return `Company name must be at least ${LEAD_VALIDATION.COMPANY_NAME_MIN} characters.`
  }
  if (trimmed.length > LEAD_VALIDATION.COMPANY_NAME_MAX) {
    return `Company name must be ${LEAD_VALIDATION.COMPANY_NAME_MAX} characters or less.`
  }
  return undefined
}

/** Validate contact name field (requires first + last name) */
export function validateContactName(value: string): string | undefined {
  const trimmed = value.trim()
  if (!trimmed) return 'Contact name is required.'
  const words = trimmed.split(/\s+/).filter((w) => w.length > 0)
  if (words.length < 2) {
    return 'Enter first and last name (e.g., John Smith).'
  }
  return undefined
}

/** Validate email field */
export function validateEmail(value: string): string | undefined {
  const trimmed = value.trim()
  if (!trimmed) return 'Email is required.'
  if (trimmed.length > LEAD_VALIDATION.EMAIL_MAX) {
    return `Email must be ${LEAD_VALIDATION.EMAIL_MAX} characters or less.`
  }
  if (!EMAIL_REGEX.test(trimmed)) {
    return 'Enter a valid email address.'
  }
  return undefined
}

/** Validate phone field (optional, but must have min digits if provided) */
export function validatePhone(value: string): string | undefined {
  const trimmed = value.trim()
  if (!trimmed) return undefined // Phone is optional
  const digitCount = (trimmed.match(/\d/g) || []).length
  if (digitCount < LEAD_VALIDATION.PHONE_MIN_DIGITS) {
    return 'Enter a valid phone number.'
  }
  return undefined
}

/** Validate notes field */
export function validateNotes(value: string): string | undefined {
  if (value.length > LEAD_VALIDATION.NOTES_MAX) {
    return `Notes must be ${LEAD_VALIDATION.NOTES_MAX} characters or less.`
  }
  return undefined
}
