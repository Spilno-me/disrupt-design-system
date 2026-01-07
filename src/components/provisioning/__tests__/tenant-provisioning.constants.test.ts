// =============================================================================
// UNIT TESTS: Tenant Provisioning Constants
// Tests tier mapping constants and employee count configurations
// =============================================================================

import { describe, it, expect } from 'vitest'
import {
  PACKAGE_TO_TIER_MAP,
  TIER_TO_PACKAGE_MAP,
  EMPLOYEE_COUNT_MIDPOINTS,
  DEFAULT_EMPLOYEE_COUNT,
  TIER_2_COMMISSION_THRESHOLD,
  MONTHS_PER_YEAR,
  WIZARD_STEPS,
  INDUSTRIES,
  COUNTRIES,
  type ApiPricingTier,
  type WizardPackage,
} from '../tenant-provisioning.constants'

// =============================================================================
// PACKAGE_TO_TIER_MAP
// =============================================================================

describe('PACKAGE_TO_TIER_MAP', () => {
  it('should map all wizard packages to API tiers', () => {
    const packages: WizardPackage[] = ['standard', 'premium', 'advanced', 'industry']

    for (const pkg of packages) {
      expect(PACKAGE_TO_TIER_MAP[pkg]).toBeDefined()
      expect(['starter', 'professional', 'enterprise']).toContain(PACKAGE_TO_TIER_MAP[pkg])
    }
  })

  it('should have correct mappings', () => {
    expect(PACKAGE_TO_TIER_MAP.standard).toBe('starter')
    expect(PACKAGE_TO_TIER_MAP.premium).toBe('professional')
    expect(PACKAGE_TO_TIER_MAP.advanced).toBe('enterprise')
    expect(PACKAGE_TO_TIER_MAP.industry).toBe('enterprise')
  })

  it('should map both advanced and industry to enterprise', () => {
    // This is intentional - industry is a specialized enterprise tier
    expect(PACKAGE_TO_TIER_MAP.advanced).toBe(PACKAGE_TO_TIER_MAP.industry)
  })
})

// =============================================================================
// TIER_TO_PACKAGE_MAP
// =============================================================================

describe('TIER_TO_PACKAGE_MAP', () => {
  it('should map all API tiers to wizard packages', () => {
    const tiers: ApiPricingTier[] = ['starter', 'professional', 'enterprise']

    for (const tier of tiers) {
      expect(TIER_TO_PACKAGE_MAP[tier]).toBeDefined()
      expect(['standard', 'premium', 'advanced', 'industry']).toContain(TIER_TO_PACKAGE_MAP[tier])
    }
  })

  it('should have correct reverse mappings', () => {
    expect(TIER_TO_PACKAGE_MAP.starter).toBe('standard')
    expect(TIER_TO_PACKAGE_MAP.professional).toBe('premium')
    expect(TIER_TO_PACKAGE_MAP.enterprise).toBe('advanced') // Not industry
  })

  it('should be reversible for unique mappings', () => {
    // standard <-> starter (unique)
    expect(TIER_TO_PACKAGE_MAP[PACKAGE_TO_TIER_MAP.standard]).toBe('standard')
    // premium <-> professional (unique)
    expect(TIER_TO_PACKAGE_MAP[PACKAGE_TO_TIER_MAP.premium]).toBe('premium')
    // advanced -> enterprise -> advanced (not industry)
    expect(TIER_TO_PACKAGE_MAP[PACKAGE_TO_TIER_MAP.advanced]).toBe('advanced')
  })
})

// =============================================================================
// EMPLOYEE_COUNT_MIDPOINTS
// =============================================================================

describe('EMPLOYEE_COUNT_MIDPOINTS', () => {
  it('should have midpoints for all employee count ranges', () => {
    // Matches EMPLOYEE_COUNTS options: '1-50', '51-200', '201-500', '501-1000', '1001+'
    expect(EMPLOYEE_COUNT_MIDPOINTS['1-50']).toBeDefined()
    expect(EMPLOYEE_COUNT_MIDPOINTS['51-200']).toBeDefined()
    expect(EMPLOYEE_COUNT_MIDPOINTS['201-500']).toBeDefined()
    expect(EMPLOYEE_COUNT_MIDPOINTS['501-1000']).toBeDefined()
    expect(EMPLOYEE_COUNT_MIDPOINTS['1001+']).toBeDefined()
  })

  it('should have reasonable midpoint values', () => {
    expect(EMPLOYEE_COUNT_MIDPOINTS['1-50']).toBeLessThan(EMPLOYEE_COUNT_MIDPOINTS['51-200'])
    expect(EMPLOYEE_COUNT_MIDPOINTS['51-200']).toBeLessThan(EMPLOYEE_COUNT_MIDPOINTS['201-500'])
    expect(EMPLOYEE_COUNT_MIDPOINTS['201-500']).toBeLessThan(EMPLOYEE_COUNT_MIDPOINTS['501-1000'])
    expect(EMPLOYEE_COUNT_MIDPOINTS['501-1000']).toBeLessThan(EMPLOYEE_COUNT_MIDPOINTS['1001+'])
  })

  it('should return numeric values', () => {
    for (const key of Object.keys(EMPLOYEE_COUNT_MIDPOINTS)) {
      expect(typeof EMPLOYEE_COUNT_MIDPOINTS[key]).toBe('number')
      expect(EMPLOYEE_COUNT_MIDPOINTS[key]).toBeGreaterThan(0)
    }
  })
})

// =============================================================================
// DEFAULT_EMPLOYEE_COUNT
// =============================================================================

describe('DEFAULT_EMPLOYEE_COUNT', () => {
  it('should be a positive number', () => {
    expect(DEFAULT_EMPLOYEE_COUNT).toBeGreaterThan(0)
  })

  it('should be within reasonable range', () => {
    // Default should be a sensible fallback (not too small, not too large)
    expect(DEFAULT_EMPLOYEE_COUNT).toBeGreaterThanOrEqual(1)
    expect(DEFAULT_EMPLOYEE_COUNT).toBeLessThanOrEqual(10000)
  })
})

// =============================================================================
// TIER_2_COMMISSION_THRESHOLD
// =============================================================================

describe('TIER_2_COMMISSION_THRESHOLD', () => {
  it('should be defined', () => {
    expect(TIER_2_COMMISSION_THRESHOLD).toBeDefined()
  })

  it('should be a reasonable percentage threshold', () => {
    expect(TIER_2_COMMISSION_THRESHOLD).toBeGreaterThan(0)
    expect(TIER_2_COMMISSION_THRESHOLD).toBeLessThanOrEqual(100)
  })

  it('should be 15 (documented value)', () => {
    expect(TIER_2_COMMISSION_THRESHOLD).toBe(15)
  })
})

// =============================================================================
// MONTHS_PER_YEAR
// =============================================================================

describe('MONTHS_PER_YEAR', () => {
  it('should be 12', () => {
    expect(MONTHS_PER_YEAR).toBe(12)
  })
})

// =============================================================================
// WIZARD_STEPS
// =============================================================================

describe('WIZARD_STEPS', () => {
  it('should have 4 steps', () => {
    expect(WIZARD_STEPS).toHaveLength(4)
  })

  it('should have unique string ids', () => {
    const ids = WIZARD_STEPS.map((step) => step.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(WIZARD_STEPS.length)
  })

  it('should have required properties for each step', () => {
    for (const step of WIZARD_STEPS) {
      expect(step.id).toBeDefined()
      expect(typeof step.id).toBe('string')
      expect(step.label).toBeDefined()
      expect(typeof step.label).toBe('string')
      expect(step.label.length).toBeGreaterThan(0)
    }
  })

  it('should have correct step order', () => {
    expect(WIZARD_STEPS[0].id).toBe('company')
    expect(WIZARD_STEPS[0].label).toContain('Company')
    expect(WIZARD_STEPS[1].id).toBe('contact')
    expect(WIZARD_STEPS[1].label).toContain('Contact')
    expect(WIZARD_STEPS[2].id).toBe('pricing')
    expect(WIZARD_STEPS[2].label).toContain('Pricing')
    expect(WIZARD_STEPS[3].id).toBe('review')
    expect(WIZARD_STEPS[3].label).toContain('Review')
  })
})

// =============================================================================
// INDUSTRIES
// =============================================================================

describe('INDUSTRIES', () => {
  it('should be a non-empty array', () => {
    expect(Array.isArray(INDUSTRIES)).toBe(true)
    expect(INDUSTRIES.length).toBeGreaterThan(0)
  })

  it('should contain common industries', () => {
    // Check for some expected industries (adjust based on actual values)
    const lowercaseIndustries = INDUSTRIES.map(i => i.toLowerCase())
    expect(
      lowercaseIndustries.some(i => i.includes('manufacturing') || i.includes('technology'))
    ).toBe(true)
  })

  it('should have unique values', () => {
    const uniqueIndustries = new Set(INDUSTRIES)
    expect(uniqueIndustries.size).toBe(INDUSTRIES.length)
  })
})

// =============================================================================
// COUNTRIES
// =============================================================================

describe('COUNTRIES', () => {
  it('should be a non-empty array', () => {
    expect(Array.isArray(COUNTRIES)).toBe(true)
    expect(COUNTRIES.length).toBeGreaterThan(0)
  })

  it('should include United States', () => {
    expect(COUNTRIES).toContain('United States')
  })

  it('should have unique values', () => {
    const uniqueCountries = new Set(COUNTRIES)
    expect(uniqueCountries.size).toBe(COUNTRIES.length)
  })
})
