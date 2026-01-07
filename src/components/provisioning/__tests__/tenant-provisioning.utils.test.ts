// =============================================================================
// UNIT TESTS: Tenant Provisioning Utilities
// Tests transformation functions between form data and API formats
// =============================================================================

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  transformToApiRequest,
  transformFromApiResponse,
  packageToTier,
  tierToPackage,
  generateRequestNumber,
} from '../tenant-provisioning.utils'
import type { TenantFormData } from '../tenant-provisioning.types'

// =============================================================================
// TEST DATA
// =============================================================================

const mockFormData: TenantFormData = {
  // Company
  companyName: 'Acme Corp',
  legalName: 'Acme Corporation LLC',
  website: 'https://acme.com',
  industry: 'Manufacturing',
  employeeCount: '51-200',

  // Contact
  contactName: 'John Smith',
  contactEmail: 'john@acme.com',
  contactPhone: '+1-555-123-4567',
  contactTitle: 'EHS Manager',

  // Billing
  billingStreet: '123 Main St',
  billingCity: 'Springfield',
  billingState: 'IL',
  billingPostalCode: '62701',
  billingCountry: 'United States',

  // Pricing
  package: 'premium',
  viewerLicenses: 10,
  contributorLicenses: 5,
  powerUserLicenses: 2,
  creatorLicenses: 1,

  // Payment
  paymentMethod: 'credit_card',
  acceptTerms: true,
}

// =============================================================================
// transformToApiRequest
// =============================================================================

describe('transformToApiRequest', () => {
  it('should map all form fields correctly', () => {
    const result = transformToApiRequest(mockFormData)

    // Company fields
    expect(result.companyName).toBe('Acme Corp')
    expect(result.legalName).toBe('Acme Corporation LLC')
    expect(result.website).toBe('https://acme.com')
    expect(result.industry).toBe('Manufacturing')
    expect(result.employeeCount).toBe('51-200')

    // Contact fields
    expect(result.contactName).toBe('John Smith')
    expect(result.contactEmail).toBe('john@acme.com')
    expect(result.contactPhone).toBe('+1-555-123-4567')
    expect(result.contactTitle).toBe('EHS Manager')

    // Payment
    expect(result.paymentMethod).toBe('credit_card')
  })

  it('should convert package to API pricingTier', () => {
    const result = transformToApiRequest(mockFormData)
    expect(result.pricingTier).toBe('professional') // premium → professional
  })

  it('should nest billing address correctly', () => {
    const result = transformToApiRequest(mockFormData)

    expect(result.billingAddress).toEqual({
      street: '123 Main St',
      city: 'Springfield',
      state: 'IL',
      postalCode: '62701',
      country: 'United States',
    })
  })

  it('should nest licenses correctly', () => {
    const result = transformToApiRequest(mockFormData)

    expect(result.licenses).toEqual({
      viewer: 10,
      contributor: 5,
      powerUser: 2,
      creator: 1,
    })
  })

  it('should handle optional estimatedValue', () => {
    const withoutValue = transformToApiRequest(mockFormData)
    expect(withoutValue.estimatedValue).toBeUndefined()

    const withValue = transformToApiRequest(mockFormData, 50000)
    expect(withValue.estimatedValue).toBe(50000)
  })

  it('should handle zero license quantities', () => {
    const formWithZeroLicenses: TenantFormData = {
      ...mockFormData,
      viewerLicenses: 0,
      contributorLicenses: 0,
      powerUserLicenses: 0,
      creatorLicenses: 0,
    }

    const result = transformToApiRequest(formWithZeroLicenses)
    expect(result.licenses).toEqual({
      viewer: 0,
      contributor: 0,
      powerUser: 0,
      creator: 0,
    })
  })
})

// =============================================================================
// transformFromApiResponse
// =============================================================================

describe('transformFromApiResponse', () => {
  it('should map API response to form fields', () => {
    const apiResponse = {
      companyName: 'Test Company',
      contactName: 'Jane Doe',
      contactEmail: 'jane@test.com',
      pricingTier: 'professional' as const,
      billingAddress: {
        street: '456 Oak Ave',
        city: 'Chicago',
        state: 'IL',
        postalCode: '60601',
        country: 'United States',
      },
      licenses: {
        viewer: 5,
        contributor: 3,
        powerUser: 1,
        creator: 0,
      },
      paymentMethod: 'invoice' as const,
    }

    const result = transformFromApiResponse(apiResponse)

    expect(result.companyName).toBe('Test Company')
    expect(result.contactName).toBe('Jane Doe')
    expect(result.contactEmail).toBe('jane@test.com')
    expect(result.package).toBe('premium') // professional → premium
    expect(result.billingStreet).toBe('456 Oak Ave')
    expect(result.billingCity).toBe('Chicago')
    expect(result.viewerLicenses).toBe(5)
    expect(result.paymentMethod).toBe('invoice')
  })

  it('should handle partial data (only some fields)', () => {
    const partialResponse = {
      companyName: 'Partial Company',
    }

    const result = transformFromApiResponse(partialResponse)

    expect(result.companyName).toBe('Partial Company')
    expect(result.contactName).toBeUndefined()
    expect(result.billingStreet).toBeUndefined()
    expect(result.package).toBeUndefined()
  })

  it('should handle missing billing address', () => {
    const noBillingResponse = {
      companyName: 'No Billing Corp',
      contactName: 'Bob',
    }

    const result = transformFromApiResponse(noBillingResponse)

    expect(result.billingStreet).toBeUndefined()
    expect(result.billingCity).toBeUndefined()
  })

  it('should handle missing licenses', () => {
    const noLicensesResponse = {
      companyName: 'No Licenses Corp',
    }

    const result = transformFromApiResponse(noLicensesResponse)

    expect(result.viewerLicenses).toBeUndefined()
    expect(result.contributorLicenses).toBeUndefined()
  })
})

// =============================================================================
// packageToTier
// =============================================================================

describe('packageToTier', () => {
  it('should map standard to starter', () => {
    expect(packageToTier('standard')).toBe('starter')
  })

  it('should map premium to professional', () => {
    expect(packageToTier('premium')).toBe('professional')
  })

  it('should map advanced to enterprise', () => {
    expect(packageToTier('advanced')).toBe('enterprise')
  })

  it('should map industry to enterprise', () => {
    expect(packageToTier('industry')).toBe('enterprise')
  })
})

// =============================================================================
// tierToPackage
// =============================================================================

describe('tierToPackage', () => {
  it('should map starter to standard', () => {
    expect(tierToPackage('starter')).toBe('standard')
  })

  it('should map professional to premium', () => {
    expect(tierToPackage('professional')).toBe('premium')
  })

  it('should map enterprise to advanced', () => {
    expect(tierToPackage('enterprise')).toBe('advanced')
  })
})

// =============================================================================
// generateRequestNumber
// =============================================================================

describe('generateRequestNumber', () => {
  beforeEach(() => {
    // Mock Date to control year
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2025-06-15'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should generate format TR-YYYY-XXXX', () => {
    const result = generateRequestNumber(42)
    expect(result).toMatch(/^TR-\d{4}-\d{4}$/)
  })

  it('should use current year', () => {
    const result = generateRequestNumber(1)
    expect(result).toBe('TR-2025-0001')
  })

  it('should pad sequence to 4 digits', () => {
    expect(generateRequestNumber(1)).toBe('TR-2025-0001')
    expect(generateRequestNumber(42)).toBe('TR-2025-0042')
    expect(generateRequestNumber(123)).toBe('TR-2025-0123')
    expect(generateRequestNumber(9999)).toBe('TR-2025-9999')
  })

  it('should handle sequences larger than 4 digits', () => {
    expect(generateRequestNumber(12345)).toBe('TR-2025-12345')
  })
})
