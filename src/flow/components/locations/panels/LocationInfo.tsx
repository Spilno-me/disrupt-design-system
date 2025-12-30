/**
 * LocationInfo - Read-only view of location details with Risk tab
 *
 * Displays location information with:
 * - Info tab: Basic details with copy buttons
 * - Risk tab: Risk intelligence (when risk data available)
 */

import * as React from 'react'
import { useState } from 'react'
import { MapPin, Copy, Check, Pencil, Info, ShieldAlert } from 'lucide-react'
import { cn } from '../../../../lib/utils'
import { Button } from '../../../../components/ui/button'
import { Badge } from '../../../../components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../../../components/ui/tooltip'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../../../components/ui/tabs'
import { LOCATION_TYPE_CONFIG, TIMEZONE_OPTIONS, type LocationInfoProps } from '../types'
import { LocationRiskTab, LocationRiskSummary, type LocationIncident } from '../risk'

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

interface InfoRowProps {
  label: string
  value: React.ReactNode
  copyValue?: string
  className?: string
}

function InfoRow({ label, value, copyValue, className }: InfoRowProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!copyValue) return
    try {
      await navigator.clipboard.writeText(copyValue)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className={cn('space-y-1', className)}>
      <dt className="text-xs font-medium text-secondary uppercase tracking-wider">
        {label}
      </dt>
      <dd className="flex items-start justify-between gap-2">
        <span className="text-sm text-primary">{value}</span>
        {copyValue && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={handleCopy}
                className="flex size-7 items-center justify-center rounded hover:bg-muted-bg text-tertiary hover:text-primary transition-colors shrink-0"
                aria-label={copied ? 'Copied!' : 'Copy to clipboard'}
              >
                {copied ? (
                  <Check className="size-4 text-success" />
                ) : (
                  <Copy className="size-4" />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent>{copied ? 'Copied!' : 'Copy'}</TooltipContent>
          </Tooltip>
        )}
      </dd>
    </div>
  )
}

// =============================================================================
// INFO TAB CONTENT
// =============================================================================

interface InfoTabContentProps {
  location: LocationInfoProps['location']
}

function InfoTabContent({ location }: InfoTabContentProps) {
  const typeConfig = LOCATION_TYPE_CONFIG[location.type]

  // Format coordinates
  const coordinatesDisplay =
    location.latitude !== undefined && location.longitude !== undefined
      ? `${location.latitude}, ${location.longitude}`
      : 'Not set'

  const coordinatesCopyValue =
    location.latitude !== undefined && location.longitude !== undefined
      ? `${location.latitude}, ${location.longitude}`
      : undefined

  // Get timezone label
  const timezoneOption = TIMEZONE_OPTIONS.find(
    (tz) => tz.value === location.timezone
  )
  const timezoneDisplay = timezoneOption?.label || location.timezone || 'Unknown'

  return (
    <dl className="space-y-6">
      {/* BASIC INFORMATION */}
      <div className="space-y-4">
        <h3 className="flex items-center gap-2 text-xs font-semibold text-secondary uppercase tracking-wider pb-2 border-b border-default">
          Basic Information
        </h3>

        <InfoRow
          label="Location Name"
          value={location.name}
          copyValue={location.name}
        />

        <InfoRow
          label="Location Type"
          value={
            <Badge variant={typeConfig.variant} size="sm">
              {typeConfig.label}
            </Badge>
          }
          copyValue={typeConfig.label}
        />

        <InfoRow
          label="Location Code"
          value={
            <Badge
              variant="outline"
              size="sm"
              className="bg-warning/10 text-warning-dark border-warning/30 font-mono"
            >
              {location.code}
            </Badge>
          }
          copyValue={location.code}
        />

        <InfoRow
          label="Description"
          value={location.description || 'No description'}
          copyValue={location.description}
        />
      </div>

      {/* GEOGRAPHIC INFORMATION */}
      <div className="space-y-4">
        <h3 className="flex items-center gap-2 text-xs font-semibold text-secondary uppercase tracking-wider pb-2 border-b border-default">
          Geographic Information
        </h3>

        <InfoRow
          label="Address"
          value={location.address || 'No address'}
          copyValue={location.address}
        />

        <InfoRow
          label="Coordinates"
          value={
            <span className={cn(!coordinatesCopyValue && 'text-tertiary')}>
              {coordinatesDisplay}
            </span>
          }
          copyValue={coordinatesCopyValue}
        />

        <InfoRow
          label="Timezone"
          value={timezoneDisplay}
          copyValue={location.timezone}
        />
      </div>
    </dl>
  )
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function LocationInfo({
  location,
  onEditClick,
  riskData,
  incidents = [],
  siblingLocations,
  onViewIncident,
  onViewAllIncidents,
  onScheduleAudit,
}: LocationInfoProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'risk'>('info')

  // Check if risk tab should be shown
  const hasRiskData = !!riskData && riskData.totalCount > 0

  // Transform incidents to LocationIncident type
  const locationIncidents: LocationIncident[] = incidents.map((inc) => ({
    id: inc.id,
    incidentId: inc.incidentId,
    locationId: inc.locationId,
    severity: inc.severity as LocationIncident['severity'],
    type: inc.type as LocationIncident['type'],
    status: inc.status as LocationIncident['status'],
    title: inc.title,
    createdAt: inc.createdAt,
    closedAt: inc.closedAt,
    precisionMarker: inc.precisionMarker,
  }))

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-default">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-accent-strong/10">
            <MapPin className="size-5 text-accent-strong" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-primary">{location.name}</h2>
            <p className="text-xs text-tertiary">{location.code}</p>
          </div>
        </div>
        <Button size="sm" variant="outline" onClick={onEditClick}>
          <Pencil className="size-4 mr-1.5" />
          Edit
        </Button>
      </div>

      {/* Tabs or simple content */}
      {hasRiskData ? (
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as typeof activeTab)}
          className="flex-1 flex flex-col overflow-hidden"
        >
          <div className="px-6 pt-4">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="info" className="flex items-center gap-2">
                <Info className="size-4" />
                Info
              </TabsTrigger>
              <TabsTrigger value="risk" className="flex items-center gap-2">
                <ShieldAlert className="size-4" />
                Risk
                {riskData && riskData.totalCount > 0 && (
                  <Badge
                    variant={
                      riskData.highestSeverity === 'critical'
                        ? 'destructive'
                        : riskData.highestSeverity === 'high'
                          ? 'warning'
                          : 'secondary'
                    }
                    size="sm"
                    className="ml-1"
                  >
                    {riskData.totalCount}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="info" className="flex-1 overflow-auto p-6 mt-0">
            <InfoTabContent location={location} />
          </TabsContent>

          <TabsContent value="risk" className="flex-1 overflow-auto p-6 mt-0">
            {riskData && (
              <LocationRiskTab
                location={location}
                riskData={riskData}
                incidents={locationIncidents}
                siblingLocations={siblingLocations}
                onViewIncident={onViewIncident}
                onViewAllIncidents={onViewAllIncidents}
                onScheduleAudit={onScheduleAudit}
              />
            )}
          </TabsContent>
        </Tabs>
      ) : (
        /* No risk data - show simple info view */
        <div className="flex-1 overflow-auto p-6">
          <InfoTabContent location={location} />

          {/* Quick risk summary placeholder */}
          {riskData && (
            <div className="mt-6 pt-6 border-t border-default">
              <LocationRiskSummary
                riskData={riskData}
                onViewIncidents={onViewAllIncidents}
                onScheduleAudit={onScheduleAudit}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

LocationInfo.displayName = 'LocationInfo'

export default LocationInfo
