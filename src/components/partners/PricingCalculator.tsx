import * as React from 'react'
import { useState, useMemo } from 'react'
import { Calculator, Users, Building2, DollarSign, Percent, Info, FileText } from 'lucide-react'
import { cn } from '../../lib/utils'
import {
  AppCard,
  AppCardContent,
  AppCardHeader,
  AppCardTitle,
  AppCardDescription,
} from '../ui/app-card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Slider } from '../ui/Slider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip'

// =============================================================================
// TYPES
// =============================================================================

export type CompanySize = 'startup' | 'small' | 'medium' | 'enterprise'
export type BillingCycle = 'monthly' | 'annual'
export type PricingTier = 'starter' | 'professional' | 'enterprise'

export interface PricingInput {
  companySize: CompanySize
  totalUsers: number
  viewerUsers: number
  contributorUsers: number
  powerUsers: number
  creatorUsers: number
  tier: PricingTier
  billingCycle: BillingCycle
}

export interface PricingBreakdown {
  platformBase: number
  viewerLicenses: number
  contributorLicenses: number
  powerUserLicenses: number
  creatorLicenses: number
  subtotal: number
  annualDiscount: number
  total: number
  partnerCommission: number
  monthlyEquivalent: number
}

export interface PricingCalculatorProps {
  /** Partner's commission percentage (default: 15%) */
  commissionPercentage?: number
  /** Callback when pricing is calculated */
  onCalculate?: (input: PricingInput, breakdown: PricingBreakdown) => void
  /** Callback when "Generate Quote" is clicked */
  onGenerateQuote?: (input: PricingInput, breakdown: PricingBreakdown) => void
  /** Additional className */
  className?: string
}

// =============================================================================
// PRICING CONSTANTS
// =============================================================================

const PLATFORM_BASE_PRICES: Record<PricingTier, number> = {
  starter: 0,
  professional: 5000,
  enterprise: 26000,
}

const LICENSE_PRICES = {
  viewer: { monthly: 10, annual: 120 },
  contributor: { monthly: 30, annual: 360 },
  powerUser: { monthly: 60, annual: 720 },
  creator: { monthly: 150, annual: 1800 },
}

const ANNUAL_DISCOUNT = 0.2 // 20% discount for annual billing

// =============================================================================
// PRICING CALCULATOR COMPONENT
// =============================================================================

/**
 * PricingCalculator - Interactive pricing calculator for partner portal
 *
 * Allows partners to calculate pricing for potential tenants based on
 * company size, user counts, and selected tier.
 */
export function PricingCalculator({
  commissionPercentage = 15,
  onCalculate,
  onGenerateQuote,
  className,
}: PricingCalculatorProps) {
  const [companySize, setCompanySize] = useState<CompanySize>('medium')
  const [totalUsers, setTotalUsers] = useState(100)
  const [viewerUsers, setViewerUsers] = useState(60)
  const [contributorUsers, setContributorUsers] = useState(25)
  const [powerUsers, setPowerUsers] = useState(10)
  const [creatorUsers, setCreatorUsers] = useState(5)
  const [tier, setTier] = useState<PricingTier>('professional')
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('annual')

  // Calculate pricing breakdown
  const breakdown = useMemo<PricingBreakdown>(() => {
    const platformBase = PLATFORM_BASE_PRICES[tier]

    const viewerLicenses =
      billingCycle === 'annual'
        ? viewerUsers * LICENSE_PRICES.viewer.annual
        : viewerUsers * LICENSE_PRICES.viewer.monthly * 12

    const contributorLicenses =
      billingCycle === 'annual'
        ? contributorUsers * LICENSE_PRICES.contributor.annual
        : contributorUsers * LICENSE_PRICES.contributor.monthly * 12

    const powerUserLicenses =
      billingCycle === 'annual'
        ? powerUsers * LICENSE_PRICES.powerUser.annual
        : powerUsers * LICENSE_PRICES.powerUser.monthly * 12

    const creatorLicenses =
      billingCycle === 'annual'
        ? creatorUsers * LICENSE_PRICES.creator.annual
        : creatorUsers * LICENSE_PRICES.creator.monthly * 12

    const subtotal =
      platformBase + viewerLicenses + contributorLicenses + powerUserLicenses + creatorLicenses

    const annualDiscount = billingCycle === 'annual' ? subtotal * ANNUAL_DISCOUNT : 0
    const total = subtotal - annualDiscount

    const partnerCommission = total * (commissionPercentage / 100)
    const monthlyEquivalent = total / 12

    return {
      platformBase,
      viewerLicenses,
      contributorLicenses,
      powerUserLicenses,
      creatorLicenses,
      subtotal,
      annualDiscount,
      total,
      partnerCommission,
      monthlyEquivalent,
    }
  }, [
    tier,
    billingCycle,
    viewerUsers,
    contributorUsers,
    powerUsers,
    creatorUsers,
    commissionPercentage,
  ])

  // Distribute users when total changes
  const handleTotalUsersChange = (value: number) => {
    setTotalUsers(value)
    // Distribute proportionally: 60% viewers, 25% contributors, 10% power, 5% creators
    setViewerUsers(Math.round(value * 0.6))
    setContributorUsers(Math.round(value * 0.25))
    setPowerUsers(Math.round(value * 0.1))
    setCreatorUsers(Math.round(value * 0.05))
  }

  const handleCalculate = () => {
    const input: PricingInput = {
      companySize,
      totalUsers,
      viewerUsers,
      contributorUsers,
      powerUsers,
      creatorUsers,
      tier,
      billingCycle,
    }
    onCalculate?.(input, breakdown)
  }

  const handleGenerateQuote = () => {
    const input: PricingInput = {
      companySize,
      totalUsers,
      viewerUsers,
      contributorUsers,
      powerUsers,
      creatorUsers,
      tier,
      billingCycle,
    }
    onGenerateQuote?.(input, breakdown)
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} data-slot="pricing-calculator">
      {/* Header */}
      <header className="flex items-center justify-between" data-slot="pricing-calculator-header">
        <div>
          <h1 className="text-2xl font-semibold text-primary flex items-center gap-2">
            <Calculator className="h-6 w-6 text-primary" aria-hidden="true" />
            Pricing Calculator
          </h1>
          <p className="text-sm text-muted mt-2">
            Calculate pricing for your potential tenants
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Company Info */}
          <AppCard data-testid="company-info-card">
            <AppCardHeader>
              <AppCardTitle className="text-lg flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" aria-hidden="true" />
                Company Information
              </AppCardTitle>
            </AppCardHeader>
            <AppCardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Company Size</Label>
                  <Select value={companySize} onValueChange={(v) => setCompanySize(v as CompanySize)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="startup">Startup (1-50 employees)</SelectItem>
                      <SelectItem value="small">Small (51-200 employees)</SelectItem>
                      <SelectItem value="medium">Medium (201-500 employees)</SelectItem>
                      <SelectItem value="enterprise">Enterprise (500+ employees)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Pricing Tier</Label>
                  <Select value={tier} onValueChange={(v) => setTier(v as PricingTier)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="starter">Starter (Free Platform)</SelectItem>
                      <SelectItem value="professional">Professional ($5,000/yr)</SelectItem>
                      <SelectItem value="enterprise">Enterprise ($26,000/yr)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Billing Cycle</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted" aria-hidden="true" />
                      </TooltipTrigger>
                      <TooltipContent>
                        Annual billing saves 20% compared to monthly
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={billingCycle === 'monthly' ? 'accent' : 'secondary'}
                    className="flex-1"
                    onClick={() => setBillingCycle('monthly')}
                  >
                    Monthly
                  </Button>
                  <Button
                    variant={billingCycle === 'annual' ? 'accent' : 'secondary'}
                    className="flex-1"
                    onClick={() => setBillingCycle('annual')}
                  >
                    Annual (Save 20%)
                  </Button>
                </div>
              </div>
            </AppCardContent>
          </AppCard>

          {/* User Licenses */}
          <AppCard data-testid="user-licenses-card">
            <AppCardHeader>
              <AppCardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" aria-hidden="true" />
                User Licenses
              </AppCardTitle>
              <AppCardDescription>
                Adjust user counts by type or use the total slider
              </AppCardDescription>
            </AppCardHeader>
            <AppCardContent className="space-y-4">
              {/* Total Users Slider */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Total Users</Label>
                  <span className="text-lg font-semibold text-primary">{totalUsers}</span>
                </div>
                <Slider
                  value={totalUsers}
                  onChange={(v) => handleTotalUsersChange(v)}
                  min={10}
                  max={1000}
                  step={10}
                />
                <div className="flex justify-between text-xs text-muted">
                  <span>10</span>
                  <span>1,000</span>
                </div>
              </div>

              {/* Individual License Types */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-subtle">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Viewer Licenses</Label>
                    <span className="text-xs text-muted">
                      ${billingCycle === 'annual' ? '10' : '10'}/mo
                    </span>
                  </div>
                  <Input
                    type="number"
                    value={viewerUsers}
                    onChange={(e) => setViewerUsers(Number(e.target.value))}
                    min={0}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Contributor Licenses</Label>
                    <span className="text-xs text-muted">$30/mo</span>
                  </div>
                  <Input
                    type="number"
                    value={contributorUsers}
                    onChange={(e) => setContributorUsers(Number(e.target.value))}
                    min={0}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Power User Licenses</Label>
                    <span className="text-xs text-muted">$60/mo</span>
                  </div>
                  <Input
                    type="number"
                    value={powerUsers}
                    onChange={(e) => setPowerUsers(Number(e.target.value))}
                    min={0}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Creator Licenses</Label>
                    <span className="text-xs text-muted">$150/mo</span>
                  </div>
                  <Input
                    type="number"
                    value={creatorUsers}
                    onChange={(e) => setCreatorUsers(Number(e.target.value))}
                    min={0}
                  />
                </div>
              </div>
            </AppCardContent>
          </AppCard>
        </div>

        {/* Pricing Summary */}
        <aside className="space-y-6" data-slot="pricing-summary">
          <AppCard className="sticky top-6" data-testid="pricing-summary-card">
            <AppCardHeader>
              <AppCardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" aria-hidden="true" />
                Pricing Summary
              </AppCardTitle>
            </AppCardHeader>
            <AppCardContent className="space-y-4">
              {/* Line Items */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-secondary">Platform Base ({tier})</span>
                  <span className="text-primary">{formatCurrency(breakdown.platformBase)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary">Viewer ({viewerUsers})</span>
                  <span className="text-primary">{formatCurrency(breakdown.viewerLicenses)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary">Contributor ({contributorUsers})</span>
                  <span className="text-primary">{formatCurrency(breakdown.contributorLicenses)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary">Power User ({powerUsers})</span>
                  <span className="text-primary">{formatCurrency(breakdown.powerUserLicenses)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary">Creator ({creatorUsers})</span>
                  <span className="text-primary">{formatCurrency(breakdown.creatorLicenses)}</span>
                </div>
              </div>

              <div className="border-t border-subtle pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-secondary">Subtotal</span>
                  <span className="text-primary">{formatCurrency(breakdown.subtotal)}</span>
                </div>
                {billingCycle === 'annual' && (
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-success">Annual Discount (20%)</span>
                    <span className="text-success">-{formatCurrency(breakdown.annualDiscount)}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-strong pt-4">
                <div className="flex justify-between items-baseline">
                  <span className="text-primary font-medium">Total (Annual)</span>
                  <span className="text-2xl font-bold text-primary">
                    {formatCurrency(breakdown.total)}
                  </span>
                </div>
                <p className="text-xs text-muted text-right mt-1">
                  {formatCurrency(breakdown.monthlyEquivalent)}/month
                </p>
              </div>

              {/* Partner Commission */}
              <div className="bg-accent-bg rounded-md p-4 mt-4" data-slot="partner-commission">
                <div className="flex items-center gap-2 mb-2">
                  <Percent className="h-4 w-4 text-primary" aria-hidden="true" />
                  <span className="text-sm font-medium text-primary">Your Commission</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-primary">
                    {formatCurrency(breakdown.partnerCommission)}
                  </span>
                  <span className="text-xs text-secondary">({commissionPercentage}%)</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 pt-4" data-slot="pricing-actions">
                <Button variant="accent" className="w-full" onClick={handleGenerateQuote}>
                  <FileText className="mr-2 h-4 w-4" aria-hidden="true" />
                  Generate Quote
                </Button>
                <Button variant="secondary" className="w-full" onClick={handleCalculate}>
                  <Calculator className="mr-2 h-4 w-4" aria-hidden="true" />
                  Recalculate
                </Button>
              </div>
            </AppCardContent>
          </AppCard>
        </aside>
      </div>
    </div>
  )
}

PricingCalculator.displayName = 'PricingCalculator'

// =============================================================================
// HELPERS
// =============================================================================

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export default PricingCalculator
