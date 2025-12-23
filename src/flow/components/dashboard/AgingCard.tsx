/**
 * Aging Card - Consolidated view of CA aging metrics (Miller's Law fix)
 * Shows 30/60/90+ day aging in a single card with horizontal bars
 */
import * as React from 'react'
import { Hourglass } from 'lucide-react'
import {
  AppCard,
  AppCardContent,
  AppCardHeader,
  AppCardTitle,
} from '../../../components/ui/app-card'
import { cn } from '../../../lib/utils'

export interface AgingItem {
  label: string
  value: number
  variant: 'warning' | 'error'
}

export interface AgingCardProps {
  items: AgingItem[]
}

export function AgingCard({ items }: AgingCardProps) {
  const total = items.reduce((sum, item) => sum + item.value, 0)
  const maxValue = Math.max(...items.map((i) => i.value), 1) // min 1 to avoid division by zero

  const variantColors = {
    warning: { bar: 'bg-warning', text: 'text-warning' },
    error: { bar: 'bg-error', text: 'text-error' },
  }

  return (
    <AppCard variant="default" shadow="md" className="h-full">
      <AppCardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Hourglass className="w-4 h-4 text-warning" />
            <AppCardTitle className="text-sm">CA Aging</AppCardTitle>
          </div>
          <span className="text-xs text-muted">Total: {total}</span>
        </div>
      </AppCardHeader>
      <AppCardContent className="pt-0">
        <div className="space-y-3">
          {items.map((item, index) => {
            const colors = variantColors[item.variant]
            return (
              <div key={index} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-secondary">{item.label}</span>
                  <span className={cn('font-medium tabular-nums', colors.text)}>
                    {item.value}
                  </span>
                </div>
                <div className="h-1.5 bg-muted-bg dark:bg-surface-hover rounded-full overflow-hidden">
                  <div
                    className={cn('h-full rounded-full transition-all', colors.bar)}
                    style={{ width: `${(item.value / maxValue) * 100}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
        {total === 0 && (
          <p className="text-xs text-success mt-2 text-center">No overdue actions</p>
        )}
      </AppCardContent>
    </AppCard>
  )
}
