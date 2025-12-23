/**
 * Risk Heatmap Card - Location risks with badges
 * Uses semantic status colors for proper contrast and dark mode support
 */
import * as React from 'react'
import { MapPin } from 'lucide-react'
import {
  AppCard,
  AppCardContent,
  AppCardHeader,
  AppCardTitle,
} from '../../../components/ui/app-card'
import { cn } from '../../../lib/utils'

export interface LocationRisk {
  location: string
  count: number
  risk: 'critical' | 'high' | 'medium' | 'low'
}

export interface RiskHeatmapCardProps {
  items: LocationRisk[]
}

export function RiskHeatmapCard({ items }: RiskHeatmapCardProps) {
  // Semantic color mapping - using status tokens that auto-adjust for dark mode
  const riskColors = {
    critical: 'bg-error text-on-status',
    high: 'bg-warning text-on-status dark:text-primary',
    medium: 'bg-warning-light text-warning-dark border border-warning/30',
    low: 'bg-success text-on-status',
  }

  return (
    <AppCard variant="default" shadow="md" className="h-full">
      <AppCardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-error" />
          <AppCardTitle className="text-sm">Location Risk Heatmap</AppCardTitle>
        </div>
      </AppCardHeader>
      <AppCardContent className="pt-0">
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <span className="text-secondary truncate pr-2">{item.location}</span>
              <div className="flex items-center gap-2">
                <span className="font-medium text-primary tabular-nums">{item.count}</span>
                <span
                  className={cn(
                    'px-2 py-0.5 text-xs font-medium rounded-full capitalize',
                    riskColors[item.risk]
                  )}
                >
                  {item.risk}
                </span>
              </div>
            </div>
          ))}
        </div>
      </AppCardContent>
    </AppCard>
  )
}
