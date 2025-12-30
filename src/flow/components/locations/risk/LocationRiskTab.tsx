/**
 * LocationRiskTab - Dedicated risk analysis view for a location
 *
 * Full-page tab with:
 * - Safety score card
 * - Incident type breakdown
 * - Peer comparison
 * - Floor plan heatmap (if available)
 * - Recent incidents list
 */

import * as React from 'react'
import { useState } from 'react'
import {
  AlertTriangle,
  Calendar,
  ExternalLink,
  ClipboardCheck,
  BarChart3,
  Map,
  Users,
} from 'lucide-react'
import { cn } from '../../../../lib/utils'
import { Button } from '../../../../components/ui/button'
import { Badge } from '../../../../components/ui/badge'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../../../components/ui/tabs'
import { SafetyScoreCard } from './SafetyScoreCard'
import { RiskTypeBreakdown } from './RiskTypeBreakdown'
import { ComparativeBenchmark } from './ComparativeBenchmark'
import { FloorPlanHeatmap } from './FloorPlanHeatmap'
import { TrendingRiskAlert } from './TrendingRiskAlert'
import type { LocationRiskTabProps, LocationIncident } from './types'

// =============================================================================
// RECENT INCIDENTS LIST
// =============================================================================

interface RecentIncidentsProps {
  incidents: LocationIncident[]
  onViewIncident?: (incidentId: string) => void
  maxItems?: number
}

function RecentIncidents({
  incidents,
  onViewIncident,
  maxItems = 5,
}: RecentIncidentsProps) {
  // Sort by date descending, take most recent
  const recentIncidents = [...incidents]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, maxItems)

  if (recentIncidents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="size-12 rounded-full bg-success/10 flex items-center justify-center mb-3">
          <AlertTriangle className="size-6 text-success" />
        </div>
        <p className="text-sm font-medium text-primary">No incidents recorded</p>
        <p className="text-xs text-tertiary mt-1">
          This location has a clean safety record.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {recentIncidents.map((incident) => {
        const date = new Date(incident.createdAt)
        const formattedDate = date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })

        return (
          <div
            key={incident.id}
            className={cn(
              'flex items-start gap-3 p-3 rounded-lg border border-default',
              'hover:bg-muted-bg/50 transition-colors cursor-pointer'
            )}
            onClick={() => onViewIncident?.(incident.id)}
          >
            <div
              className={cn(
                'size-8 rounded-full flex items-center justify-center shrink-0',
                incident.severity === 'critical'
                  ? 'bg-error/10 text-error'
                  : incident.severity === 'high'
                    ? 'bg-warning/10 text-warning-dark'
                    : 'bg-muted-bg text-tertiary'
              )}
            >
              <AlertTriangle className="size-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium text-primary truncate">
                  {incident.title}
                </p>
                <Badge
                  variant={
                    incident.severity === 'critical'
                      ? 'destructive'
                      : incident.severity === 'high'
                        ? 'warning'
                        : 'secondary'
                  }
                  size="sm"
                  className="shrink-0 capitalize"
                >
                  {incident.severity}
                </Badge>
              </div>
              <div className="flex items-center gap-2 mt-1 text-xs text-tertiary">
                <span className="font-mono">{incident.incidentId}</span>
                <span>•</span>
                <span>{formattedDate}</span>
                <span>•</span>
                <Badge variant="outline" size="sm" className="capitalize">
                  {incident.status}
                </Badge>
              </div>
            </div>
            {onViewIncident && (
              <ExternalLink className="size-4 text-tertiary shrink-0" />
            )}
          </div>
        )
      })}
    </div>
  )
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function LocationRiskTab({
  location,
  riskData,
  incidents,
  siblingLocations,
  onViewIncident,
  onViewAllIncidents,
  onScheduleAudit,
  className,
}: LocationRiskTabProps) {
  const [activeSection, setActiveSection] = useState<'overview' | 'heatmap' | 'compare'>('overview')

  // Calculate trend data for alert
  const previousCount =
    riskData.trend !== 'stable' && riskData.trendPercentage !== 0
      ? Math.round(riskData.totalCount / (1 + riskData.trendPercentage / 100))
      : riskData.totalCount

  // Check if floor plan is available
  const hasFloorPlan = !!location.floorPlanImage || (location.floorPlans && location.floorPlans.length > 0)

  // Check if we have siblings for comparison
  const hasSiblings = siblingLocations && siblingLocations.length > 0

  return (
    <div className={cn('space-y-6', className)}>
      {/* Trending Alert (if worsening) */}
      {riskData.trend === 'worsening' && riskData.trendPercentage > 15 && (
        <TrendingRiskAlert
          trend={riskData.trend}
          trendPercentage={riskData.trendPercentage}
          currentCount={riskData.totalCount}
          previousCount={previousCount}
          periodLabel="vs last 30 days"
        />
      )}

      {/* Section Tabs */}
      <Tabs value={activeSection} onValueChange={(v) => setActiveSection(v as typeof activeSection)}>
        <TabsList className="w-full justify-start">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="size-4" />
            Overview
          </TabsTrigger>
          {hasFloorPlan && (
            <TabsTrigger value="heatmap" className="flex items-center gap-2">
              <Map className="size-4" />
              Floor Plan
            </TabsTrigger>
          )}
          {hasSiblings && (
            <TabsTrigger value="compare" className="flex items-center gap-2">
              <Users className="size-4" />
              Compare
            </TabsTrigger>
          )}
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-4 space-y-6">
          {/* Safety Score + Type Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <SafetyScoreCard
              score={riskData.safetyScore}
              trend={riskData.trend}
              trendPercentage={riskData.trendPercentage}
              sparklineData={riskData.sparklineData}
              locationName={location.name}
            />
            <div className="p-4 rounded-lg border border-default bg-surface">
              <RiskTypeBreakdown
                byType={riskData.byType}
                totalCount={riskData.totalCount}
              />
            </div>
          </div>

          {/* Recent Incidents */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-primary flex items-center gap-2">
                <Calendar className="size-4 text-tertiary" />
                Recent Incidents
              </h4>
              {incidents.length > 5 && onViewAllIncidents && (
                <Button variant="ghost" size="sm" onClick={onViewAllIncidents}>
                  View all ({incidents.length})
                  <ExternalLink className="size-3 ml-1" />
                </Button>
              )}
            </div>
            <RecentIncidents
              incidents={incidents}
              onViewIncident={onViewIncident}
            />
          </div>
        </TabsContent>

        {/* Heatmap Tab */}
        {hasFloorPlan && (
          <TabsContent value="heatmap" className="mt-4">
            <FloorPlanHeatmap
              imageUrl={location.floorPlanImage || location.floorPlans?.[0]?.imageUrl || ''}
              incidents={incidents}
              floorPlans={location.floorPlans}
              onIncidentClick={(inc) => onViewIncident?.(inc.id)}
              showHeatmap={incidents.length > 3}
              enableZoom
            />
          </TabsContent>
        )}

        {/* Compare Tab */}
        {hasSiblings && (
          <TabsContent value="compare" className="mt-4">
            <div className="p-4 rounded-lg border border-default bg-surface">
              <ComparativeBenchmark
                locationName={location.name}
                currentRisk={riskData}
                peerRisks={siblingLocations!.map((s) => ({
                  name: s.location.name,
                  riskData: s.riskData,
                }))}
              />
            </div>
          </TabsContent>
        )}
      </Tabs>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3 pt-4 border-t border-default">
        {onViewAllIncidents && riskData.totalCount > 0 && (
          <Button variant="outline" onClick={onViewAllIncidents}>
            <AlertTriangle className="size-4 mr-2" />
            View All Incidents ({riskData.totalCount})
          </Button>
        )}
        {onScheduleAudit && (
          <Button
            variant={riskData.safetyScore < 70 ? 'default' : 'outline'}
            onClick={onScheduleAudit}
          >
            <ClipboardCheck className="size-4 mr-2" />
            Schedule Safety Audit
          </Button>
        )}
      </div>
    </div>
  )
}

LocationRiskTab.displayName = 'LocationRiskTab'

export default LocationRiskTab
