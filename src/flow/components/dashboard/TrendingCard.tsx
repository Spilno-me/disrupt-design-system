/**
 * Trending Card - List with counts and bar visualization
 */
import * as React from 'react'
import { TrendingUp } from 'lucide-react'
import {
  AppCard,
  AppCardContent,
  AppCardHeader,
  AppCardTitle,
} from '../../../components/ui/app-card'

export interface TrendingItem {
  label: string
  count: number
}

export interface TrendingCardProps {
  title: string
  total: number
  items: TrendingItem[]
}

export function TrendingCard({ title, total, items }: TrendingCardProps) {
  const maxCount = Math.max(...items.map((i) => i.count))

  return (
    <AppCard variant="default" shadow="md" className="h-full">
      <AppCardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-info" />
            <AppCardTitle className="text-sm">{title}</AppCardTitle>
          </div>
          <span className="text-xs text-muted">Total: {total}</span>
        </div>
      </AppCardHeader>
      <AppCardContent className="pt-0">
        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-secondary truncate pr-2">{item.label}</span>
                <span className="font-medium text-primary tabular-nums">{item.count}</span>
              </div>
              <div className="h-1.5 bg-muted-bg dark:bg-surface-hover rounded-full overflow-hidden">
                <div
                  className="h-full bg-info rounded-full transition-all"
                  style={{ width: `${(item.count / maxCount) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </AppCardContent>
    </AppCard>
  )
}
