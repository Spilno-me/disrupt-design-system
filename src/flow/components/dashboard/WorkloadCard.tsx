/**
 * Workload Card - Employee assignments with progress
 */
import * as React from 'react'
import { Users } from 'lucide-react'
import {
  AppCard,
  AppCardContent,
  AppCardHeader,
  AppCardTitle,
} from '../../../components/ui/app-card'
import { cn } from '../../../lib/utils'

export interface WorkloadItem {
  name: string
  initials: string
  count: number
  color: string
}

export interface WorkloadCardProps {
  items: WorkloadItem[]
}

export function WorkloadCard({ items }: WorkloadCardProps) {
  const maxCount = Math.max(...items.map((i) => i.count))

  // Semantic color mapping for avatars and progress bars
  const colorMap: Record<string, { avatar: string; bar: string }> = {
    info: { avatar: 'bg-info', bar: 'bg-info' },
    error: { avatar: 'bg-error', bar: 'bg-error' },
    success: { avatar: 'bg-success dark:bg-success', bar: 'bg-success' },
    warning: { avatar: 'bg-warning', bar: 'bg-warning' },
  }

  return (
    <AppCard variant="default" shadow="md" className="h-full">
      <AppCardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-secondary" />
          <AppCardTitle className="text-sm">Employee Workload</AppCardTitle>
        </div>
      </AppCardHeader>
      <AppCardContent className="pt-0">
        <div className="space-y-3">
          {items.map((item, index) => {
            const colors = colorMap[item.color] || colorMap.info
            return (
              <div key={index} className="flex items-center gap-3">
                <div
                  className={cn(
                    'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium text-on-status',
                    colors.avatar
                  )}
                >
                  {item.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-primary truncate">{item.name}</span>
                    <span className="font-medium text-secondary tabular-nums">{item.count}</span>
                  </div>
                  <div className="h-1.5 bg-muted-bg dark:bg-surface-hover rounded-full overflow-hidden">
                    <div
                      className={cn('h-full rounded-full transition-all', colors.bar)}
                      style={{ width: `${(item.count / maxCount) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </AppCardContent>
    </AppCard>
  )
}
