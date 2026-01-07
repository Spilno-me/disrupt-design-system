/**
 * CompanyInfoForm - Company information input with stepper control
 *
 * Visual: Glass Depth 2 (40% opacity)
 * UX: NumberStepper with step=10 for faster adjustment
 *
 * @module partners/PricingCalculator/components/CompanyInfoForm
 */

import { Building2, Info } from 'lucide-react'
import {
  AppCard,
  AppCardContent,
  AppCardHeader,
  AppCardTitle,
} from '../../../ui/app-card'
import { NumberStepper } from '../../../ui/number-stepper'
import { Label } from '../../../ui/label'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../../ui/tooltip'

export interface CompanyInfoFormProps {
  /** Current employee count value */
  employeeCount: number
  /** Callback when employee count changes */
  onChange: (count: number) => void
  /** Disable interactions */
  disabled?: boolean
}

/**
 * Company information form with stepper control.
 * Step of 10 allows faster adjustment while direct entry handles precision.
 */
export function CompanyInfoForm({
  employeeCount,
  onChange,
  disabled,
}: CompanyInfoFormProps) {
  return (
    <AppCard
      className="bg-white/40 dark:bg-black/40 backdrop-blur-[4px] !border-2 !border-accent shadow-md"
      data-testid="company-info-card"
    >
      <AppCardHeader>
        <AppCardTitle className="text-lg flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" aria-hidden="true" />
          Company Information
        </AppCardTitle>
      </AppCardHeader>
      <AppCardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="employee-count">Employee Count</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-secondary" aria-hidden="true" />
                </TooltipTrigger>
                <TooltipContent>
                  Platform tier is determined by employee count
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Stepper - centered */}
          <div className="flex justify-center">
            <NumberStepper
              id="employee-count"
              value={employeeCount}
              onChange={onChange}
              min={1}
              max={10000}
              step={10}
              disabled={disabled}
              aria-label="Employee count"
            />
          </div>

          {/* Visible input hint */}
          <p className="text-xs text-secondary text-center">
            1–10,000 employees • Type for exact numbers
          </p>
        </div>
      </AppCardContent>
    </AppCard>
  )
}
