// =============================================================================
// UNIT TESTS: usePricingData Hook
// Tests exported constants and transformation logic patterns
//
// NOTE: Full hook behavior (with React context) is tested via Storybook
// interaction tests in tenant-provisioning.stories.tsx
// =============================================================================

import { describe, it, expect } from 'vitest'
import { LICENSE_FIELD_MAP } from '../../hooks/usePricingData'
import { EMPLOYEE_COUNT_MIDPOINTS, DEFAULT_EMPLOYEE_COUNT } from '../../tenant-provisioning.constants'
import { calculatePricingResult } from '../../../partners/PricingCalculator/utils/pricing-calculations'
import { DEFAULT_PRICING_CONFIG } from '../../../partners/PricingCalculator/constants'
import type { ProcessSelection, UserLicenseSelection, UserLicenseTier } from '../../../partners/types/pricing.types'

// =============================================================================
// LICENSE_FIELD_MAP
// =============================================================================

describe('LICENSE_FIELD_MAP', () => {
  it('should map all license tiers to form field names', () => {
    const tiers: UserLicenseTier[] = ['viewer', 'contributor', 'power_user', 'creator']

    for (const tier of tiers) {
      expect(LICENSE_FIELD_MAP[tier]).toBeDefined()
      expect(typeof LICENSE_FIELD_MAP[tier]).toBe('string')
    }
  })

  it('should have correct field mappings', () => {
    expect(LICENSE_FIELD_MAP.viewer).toBe('viewerLicenses')
    expect(LICENSE_FIELD_MAP.contributor).toBe('contributorLicenses')
    expect(LICENSE_FIELD_MAP.power_user).toBe('powerUserLicenses')
    expect(LICENSE_FIELD_MAP.creator).toBe('creatorLicenses')
  })
})

// =============================================================================
// EMPLOYEE COUNT CONVERSION (Hook Logic Pattern)
// Tests the transformation: employeeCount string → number
// =============================================================================

describe('Employee count conversion logic', () => {
  it('should convert employee count strings to midpoint numbers', () => {
    // This mimics the hook logic:
    // const employeeCountNumber = EMPLOYEE_COUNT_MIDPOINTS[employeeCount] ?? DEFAULT_EMPLOYEE_COUNT
    // Keys match EMPLOYEE_COUNTS options: '1-50', '51-200', '201-500', '501-1000', '1001+'
    expect(EMPLOYEE_COUNT_MIDPOINTS['1-50']).toBe(25)
    expect(EMPLOYEE_COUNT_MIDPOINTS['51-200']).toBe(125)
    expect(EMPLOYEE_COUNT_MIDPOINTS['201-500']).toBe(350)
    expect(EMPLOYEE_COUNT_MIDPOINTS['501-1000']).toBe(750)
    expect(EMPLOYEE_COUNT_MIDPOINTS['1001+']).toBe(1500)
  })

  it('should fallback to DEFAULT_EMPLOYEE_COUNT for unknown values', () => {
    // Testing invalid input - Record<string, number> accepts any string key
    const result = EMPLOYEE_COUNT_MIDPOINTS['invalid'] ?? DEFAULT_EMPLOYEE_COUNT
    expect(result).toBe(DEFAULT_EMPLOYEE_COUNT)
    expect(result).toBeGreaterThan(0)
  })
})

// =============================================================================
// PROCESS SELECTION BUILDING (Hook Logic Pattern)
// Tests the transformation: package → ProcessSelection[]
// =============================================================================

describe('Process selection building logic', () => {
  it('should return empty array when no package selected', () => {
    // Mimics hook logic: if (!selectedPackage) return []
    const selectedPackage = undefined
    const processes: ProcessSelection[] = selectedPackage
      ? [{ tier: selectedPackage, quantity: 1 }]
      : []

    expect(processes).toEqual([])
  })

  it('should return single ProcessSelection for selected package', () => {
    const selectedPackage = 'premium' as const
    const processes: ProcessSelection[] = [{ tier: selectedPackage, quantity: 1 }]

    expect(processes).toHaveLength(1)
    expect(processes[0]).toEqual({ tier: 'premium', quantity: 1 })
  })

  it('should work with all package types', () => {
    const packages = ['standard', 'premium', 'advanced', 'industry'] as const

    for (const pkg of packages) {
      const processes: ProcessSelection[] = [{ tier: pkg, quantity: 1 }]
      expect(processes[0].tier).toBe(pkg)
    }
  })
})

// =============================================================================
// LICENSE SELECTION BUILDING (Hook Logic Pattern)
// Tests the transformation: license quantities → UserLicenseSelection[]
// =============================================================================

describe('License selection building logic', () => {
  it('should filter out zero quantities', () => {
    // Mimics hook logic: filter out licenses with quantity === 0
    const quantities = {
      viewer: 10,
      contributor: 0,
      power_user: 0,
      creator: 2,
    }

    const result: UserLicenseSelection[] = []
    const tiers: UserLicenseTier[] = ['viewer', 'contributor', 'power_user', 'creator']

    for (const tier of tiers) {
      const quantity = quantities[tier] || 0
      if (quantity > 0) {
        result.push({ tier, quantity })
      }
    }

    expect(result).toHaveLength(2)
    expect(result).toContainEqual({ tier: 'viewer', quantity: 10 })
    expect(result).toContainEqual({ tier: 'creator', quantity: 2 })
  })

  it('should return empty array when all quantities are zero', () => {
    const quantities = {
      viewer: 0,
      contributor: 0,
      power_user: 0,
      creator: 0,
    }

    const result: UserLicenseSelection[] = []
    const tiers: UserLicenseTier[] = ['viewer', 'contributor', 'power_user', 'creator']

    for (const tier of tiers) {
      const quantity = quantities[tier] || 0
      if (quantity > 0) {
        result.push({ tier, quantity })
      }
    }

    expect(result).toEqual([])
  })

  it('should include all license types when all have quantities', () => {
    const quantities = {
      viewer: 5,
      contributor: 3,
      power_user: 2,
      creator: 1,
    }

    const result: UserLicenseSelection[] = []
    const tiers: UserLicenseTier[] = ['viewer', 'contributor', 'power_user', 'creator']

    for (const tier of tiers) {
      const quantity = quantities[tier]
      if (quantity > 0) {
        result.push({ tier, quantity })
      }
    }

    expect(result).toHaveLength(4)
  })

  it('should handle undefined quantities as zero', () => {
    const quantities: Record<string, number | undefined> = {
      viewer: 5,
      // contributor: undefined (not set)
    }

    const result: UserLicenseSelection[] = []
    const tiers: UserLicenseTier[] = ['viewer', 'contributor', 'power_user', 'creator']

    for (const tier of tiers) {
      const quantity = quantities[tier] || 0
      if (quantity > 0) {
        result.push({ tier, quantity })
      }
    }

    expect(result).toHaveLength(1)
    expect(result[0]).toEqual({ tier: 'viewer', quantity: 5 })
  })
})

// =============================================================================
// PRICING CALCULATION INTEGRATION (Hook Output Pattern)
// Tests the calculatePricingResult function as used by the hook
// =============================================================================

describe('Pricing calculation integration', () => {
  it('should return null when no processes or licenses selected', () => {
    const result = calculatePricingResult(
      100,
      [], // no processes
      [], // no licenses
      DEFAULT_PRICING_CONFIG
    )

    expect(result).toBeNull()
  })

  it('should calculate pricing with processes only', () => {
    const processes: ProcessSelection[] = [{ tier: 'premium', quantity: 1 }]
    const licenses: UserLicenseSelection[] = []

    const result = calculatePricingResult(100, processes, licenses, DEFAULT_PRICING_CONFIG)

    expect(result).not.toBeNull()
    expect(result!.processes.subtotal).toBe(3000) // Premium = $3000
    expect(result!.userLicenses.total).toBe(0)
  })

  it('should calculate pricing with licenses only', () => {
    const processes: ProcessSelection[] = []
    const licenses: UserLicenseSelection[] = [
      { tier: 'viewer', quantity: 10 },
      { tier: 'creator', quantity: 1 },
    ]

    const result = calculatePricingResult(100, processes, licenses, DEFAULT_PRICING_CONFIG)

    expect(result).not.toBeNull()
    expect(result!.processes.subtotal).toBe(0)
    // Viewer: 10 * $100 = $1000, Creator: 1 * $1500 = $1500
    expect(result!.userLicenses.total).toBe(2500)
  })

  it('should calculate full pricing with processes and licenses', () => {
    const processes: ProcessSelection[] = [{ tier: 'premium', quantity: 1 }]
    const licenses: UserLicenseSelection[] = [
      { tier: 'viewer', quantity: 5 },
      { tier: 'contributor', quantity: 3 },
    ]

    const result = calculatePricingResult(100, processes, licenses, DEFAULT_PRICING_CONFIG)

    expect(result).not.toBeNull()
    expect(result!.companySize).toBe('smb') // 100 employees = SMB
    expect(result!.platformBase).toBe(0) // SMB = $0
    expect(result!.processes.subtotal).toBe(3000) // Premium
    // Viewer: 5 * $100 = $500, Contributor: 3 * $300 = $900
    expect(result!.userLicenses.total).toBe(1400)
    expect(result!.dealTotal).toBe(4400) // 0 + 3000 + 1400
  })

  it('should apply company size platform fees correctly', () => {
    const processes: ProcessSelection[] = [{ tier: 'standard', quantity: 1 }]

    // SMB (1-100 employees) = $0 platform base
    const smbResult = calculatePricingResult(50, processes, [], DEFAULT_PRICING_CONFIG)
    expect(smbResult!.companySize).toBe('smb')
    expect(smbResult!.platformBase).toBe(0)

    // Mid-market (101-500 employees) = $5000 platform base
    const midResult = calculatePricingResult(250, processes, [], DEFAULT_PRICING_CONFIG)
    expect(midResult!.companySize).toBe('mid_market')
    expect(midResult!.platformBase).toBe(5000)

    // Enterprise (501+ employees) = $26000 platform base
    const entResult = calculatePricingResult(1000, processes, [], DEFAULT_PRICING_CONFIG)
    expect(entResult!.companySize).toBe('enterprise')
    expect(entResult!.platformBase).toBe(26000)
  })
})
