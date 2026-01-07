/**
 * PricingCalculator - Interactive pricing calculator for partner portal
 *
 * Supports two modes:
 * 1. **Standalone mode**: Uses local calculation with default pricing config
 * 2. **API mode**: Consumer provides pricingConfig, calls onCalculate, passes result/commission
 *
 * @example Standalone mode (local calculation)
 * ```tsx
 * <PricingCalculator
 *   onGenerateQuote={(request) => console.log('Generate quote:', request)}
 * />
 * ```
 *
 * @example API mode (consumer wrapper provides data)
 * ```tsx
 * <PricingCalculator
 *   pricingConfig={pricingConfig}
 *   commissionStatus={tierStatus}
 *   result={pricingResult}
 *   commission={commissionPreview}
 *   loading={isLoading}
 *   onCalculate={handleCalculate}
 *   onGenerateQuote={handleGenerateQuote}
 * />
 * ```
 *
 * @module partners/PricingCalculator
 */

import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import { Calculator, AlertCircle, FileText } from 'lucide-react'
import { Button } from '../../ui/button'
import type {
  ProcessSelection,
  UserLicenseSelection,
  PricingConfig,
  PricingCalculationResult,
  CommissionPreviewResult,
  PartnerCommissionStatus,
  CalculateRequest,
} from '../types/pricing.types'
import { DEFAULT_PRICING_CONFIG } from './constants'
import {
  calculatePricingResult,
  calculateCommission,
} from './utils/pricing-calculations'
import {
  ProcessSelector,
  UserLicenseSelector,
  PricingSummary,
  CommissionPreview,
} from './components'

// =============================================================================
// COMPONENT PROPS
// =============================================================================

export interface PricingCalculatorProps {
  /** Pricing configuration from API (uses defaults if not provided) */
  pricingConfig?: PricingConfig
  /** Partner's commission tier status from API */
  commissionStatus?: PartnerCommissionStatus | null
  /** Pricing calculation result from API */
  result?: PricingCalculationResult | null
  /** Commission preview result from API */
  commission?: CommissionPreviewResult | null
  /** Loading state */
  loading?: boolean
  /** Error message */
  error?: string | null
  /** Callback when calculation is requested (for API mode) */
  onCalculate?: (request: CalculateRequest) => void
  /** Callback when "Generate Quote" is clicked */
  onGenerateQuote?: (request: CalculateRequest) => void
  /** Auto-calculate on input change (default: true for API mode) */
  autoCalculate?: boolean
  /** Debounce delay for auto-calculate in ms (default: 300) */
  debounceMs?: number
  /** Show commission preview section (default: true). Set to false to hide for Partners. */
  showCommission?: boolean
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function PricingCalculator({
  pricingConfig = DEFAULT_PRICING_CONFIG,
  commissionStatus = null,
  result: externalResult = null,
  commission: externalCommission = null,
  loading = false,
  error = null,
  onCalculate,
  onGenerateQuote,
  autoCalculate = true,
  debounceMs = 300,
  showCommission = true,
}: PricingCalculatorProps) {
  // Form state
  const [employeeCount, setEmployeeCount] = useState(100)
  const [processes, setProcesses] = useState<ProcessSelection[]>([])
  const [licenses, setLicenses] = useState<UserLicenseSelection[]>([])

  // Build calculate request
  const calculateRequest = useMemo<CalculateRequest>(
    () => ({
      employeeCount,
      processes,
      userLicenses: licenses,
    }),
    [employeeCount, processes, licenses]
  )

  // Check if we have inputs
  const hasInputs = processes.length > 0 || licenses.length > 0

  // Local calculations - ALWAYS compute for immediate feedback
  // This provides instant UI updates while API call is in flight
  const localResult = useMemo(
    () => calculatePricingResult(employeeCount, processes, licenses, pricingConfig),
    [employeeCount, processes, licenses, pricingConfig]
  )

  const localCommission = useMemo(
    () => calculateCommission(localResult, commissionStatus),
    [localResult, commissionStatus]
  )

  // Prioritize local calculations for immediate responsiveness (optimistic UI)
  // External results are available but local calcs update instantly on input change
  // Note: externalResult/externalCommission kept for future use (e.g., backend-only features)
  const result = localResult ?? externalResult
  const commission = localCommission ?? externalCommission

  // Store onCalculate in a ref to avoid triggering effect on callback identity change
  const onCalculateRef = useRef(onCalculate)
  onCalculateRef.current = onCalculate

  // Track last calculated request to prevent duplicate calls
  const lastRequestRef = useRef<string>('')

  // Auto-calculate effect (debounced)
  // IMPORTANT: Only depends on actual input values, not callback identity
  useEffect(() => {
    if (!autoCalculate || !onCalculateRef.current || !hasInputs) return

    // Serialize request to compare with last request
    const requestKey = JSON.stringify(calculateRequest)

    // Skip if this exact request was already made
    if (requestKey === lastRequestRef.current) return

    const timer = setTimeout(() => {
      lastRequestRef.current = requestKey
      onCalculateRef.current?.(calculateRequest)
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [autoCalculate, hasInputs, calculateRequest, debounceMs])

  // Manual calculate handler
  const handleCalculate = useCallback(() => {
    onCalculate?.(calculateRequest)
  }, [onCalculate, calculateRequest])

  // Generate quote handler
  const handleGenerateQuote = useCallback(() => {
    onGenerateQuote?.(calculateRequest)
  }, [onGenerateQuote, calculateRequest])

  return (
    <div className="flex flex-col gap-6" data-slot="pricing-calculator">
      {/* Header */}
      <header className="flex items-center justify-between" data-slot="pricing-calculator-header">
        <div>
          <h1 className="text-2xl font-semibold text-primary flex items-center gap-2">
            <Calculator className="h-6 w-6 text-primary" aria-hidden="true" />
            Pricing Calculator
          </h1>
          <p className="text-sm text-secondary mt-2">
            Build a custom quote for your customer and see your commission
          </p>
        </div>
      </header>

      {/* Error Display */}
      {error && (
        <div
          className="rounded-lg bg-error-light border border-error px-4 py-3 flex items-center gap-3"
          role="alert"
        >
          <AlertCircle className="h-5 w-5 text-error flex-shrink-0" aria-hidden="true" />
          <p className="text-sm text-error font-medium">{error}</p>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. PRIMARY: Package selection - what they're buying */}
          {/* Note: Never disable inputs during recalculation - better UX to let users keep interacting */}
          <ProcessSelector
            processes={processes}
            onChange={setProcesses}
            pricingConfig={pricingConfig}
          />

          {/* 2. COMBINED: Company size + User licenses */}
          <UserLicenseSelector
            employeeCount={employeeCount}
            onEmployeeCountChange={setEmployeeCount}
            licenses={licenses}
            onChange={setLicenses}
            pricingConfig={pricingConfig}
          />

          {/* Action Button - only show when autoCalculate is false */}
          {!autoCalculate && (
            <div className="flex justify-center">
              <Button
                variant="accent"
                size="lg"
                onClick={handleCalculate}
                disabled={!hasInputs || loading}
              >
                <Calculator className="mr-2 h-5 w-5" aria-hidden="true" />
                {loading ? 'Calculating...' : 'Calculate Quote'}
              </Button>
            </div>
          )}
        </div>

        {/* Right Column - Results */}
        {/* Note: Only show loading skeleton on INITIAL load (no data yet) */}
        {/* During recalculation, keep showing old values - better UX */}
        <aside className="space-y-6" data-slot="pricing-summary">
          <PricingSummary result={result} loading={loading && !result} />

          {showCommission && (
            <CommissionPreview
              commission={commission}
              tierStatus={commissionStatus}
              dealTotal={result?.dealTotal ?? 0}
              loading={loading && !commission}
            />
          )}

          {/* Generate Quote Button */}
          {result && (
            <Button
              variant="default"
              className="w-full"
              onClick={handleGenerateQuote}
              disabled={loading}
            >
              <FileText className="mr-2 h-4 w-4" aria-hidden="true" />
              Generate Quote
            </Button>
          )}
        </aside>
      </div>
    </div>
  )
}

PricingCalculator.displayName = 'PricingCalculator'
