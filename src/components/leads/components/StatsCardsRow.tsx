/**
 * StatsCardsRow - Row of clickable KPI stats cards
 */

import { StatsCard } from '../StatsCard'
import type { LeadsStats, WidgetFilter } from '../types'

export interface StatsCardsRowProps {
  stats: LeadsStats
  activeWidget: WidgetFilter
  onWidgetClick: (widget: WidgetFilter) => void
}

export function StatsCardsRow({ stats, activeWidget, onWidgetClick }: StatsCardsRowProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {stats.totalLeads && (
        <StatsCard
          title="Total Leads"
          value={stats.totalLeads.value}
          trend={stats.totalLeads.trend}
          trendDirection={stats.totalLeads.trendDirection}
          onClick={() => onWidgetClick('all')}
          active={activeWidget === 'all'}
        />
      )}
      {stats.newLeads && (
        <StatsCard
          title="New Leads"
          value={stats.newLeads.value}
          trend={stats.newLeads.trend}
          trendDirection={stats.newLeads.trendDirection}
          onClick={() => onWidgetClick('new')}
          active={activeWidget === 'new'}
        />
      )}
      {stats.converted && (
        <StatsCard
          title="Converted"
          value={stats.converted.value}
          trend={stats.converted.trend}
          trendDirection={stats.converted.trendDirection}
          onClick={() => onWidgetClick('converted')}
          active={activeWidget === 'converted'}
        />
      )}
      {stats.highPriority && (
        <StatsCard
          title="High Priority"
          value={stats.highPriority.value}
          trend={stats.highPriority.trend}
          trendDirection={stats.highPriority.trendDirection}
          onClick={() => onWidgetClick('high_priority')}
          active={activeWidget === 'high_priority'}
        />
      )}
      {stats.avgResponse && (
        <StatsCard
          title="Avg Response"
          value={stats.avgResponse.value}
          trend={stats.avgResponse.trend}
          trendDirection={stats.avgResponse.trendDirection}
        />
      )}
    </div>
  )
}
