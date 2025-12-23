/**
 * Breakdown Card - List of items with values
 * Shows celebratory state when all values are 0 (zero incidents is good!)
 */
import * as React from 'react'
import { CheckCircle2 } from 'lucide-react'
import {
  AppCard,
  AppCardContent,
  AppCardHeader,
  AppCardTitle,
} from '../../../components/ui/app-card'
import { cn } from '../../../lib/utils'

export interface BreakdownItem {
  label: string
  value: number
  variant?: 'error' | 'warning' | 'success' | 'info' | 'default'
}

export interface BreakdownCardProps {
  icon: React.ReactNode
  title: string
  total?: number
  items: BreakdownItem[]
  zeroIsCelebratory?: boolean
}

export function BreakdownCard({
  icon,
  title,
  total,
  items,
  zeroIsCelebratory = true,
}: BreakdownCardProps) {
  const variantColors = {
    error: 'text-error',
    warning: 'text-warning',
    success: 'text-success',
    info: 'text-info',
    default: 'text-primary',
  }

  // Check if all items are 0 (celebratory state)
  const allZero = items.every((item) => item.value === 0)
  const isCelebratory = zeroIsCelebratory && allZero

  return (
    <AppCard
      variant="default"
      shadow="md"
      className={cn(
        'h-full',
        isCelebratory && 'ring-2 ring-success/20 dark:ring-success/30'
      )}
    >
      <AppCardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={cn(
              '[&>svg]:w-4 [&>svg]:h-4',
              isCelebratory ? 'text-success' : 'text-secondary'
            )}>
              {isCelebratory ? <CheckCircle2 className="w-4 h-4" /> : icon}
            </span>
            <AppCardTitle className="text-sm">{title}</AppCardTitle>
          </div>
          {total !== undefined && (
            <span className={cn(
              'text-xs',
              isCelebratory ? 'text-success font-medium' : 'text-muted'
            )}>
              {isCelebratory ? 'All clear' : `Total: ${total}`}
            </span>
          )}
        </div>
      </AppCardHeader>
      <AppCardContent className="pt-0">
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <span className="text-secondary">{item.label}</span>
              <span
                className={cn(
                  'font-medium tabular-nums',
                  isCelebratory && item.value === 0
                    ? 'text-success'
                    : variantColors[item.variant || 'default']
                )}
              >
                {item.value}
              </span>
            </div>
          ))}
        </div>
        {isCelebratory && (
          <p className="text-xs text-success mt-3 text-center font-medium">
            No incidents recorded
          </p>
        )}
      </AppCardContent>
    </AppCard>
  )
}
