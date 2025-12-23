/**
 * IncidentInfoCard - Incident information card for overview
 *
 * Displays key incident metadata in a structured layout:
 * - Status and Reference (top row)
 * - Type and Severity (middle row)
 * - Reporter and Date created (bottom row)
 *
 * @example
 * ```tsx
 * <IncidentInfoCard
 *   status="review"
 *   severity="high"
 *   type="chemical"
 *   reference="INC-51634456533"
 *   reporter={{ id: '1', name: 'Patricia Davis' }}
 *   createdAt="2025-02-11T12:26:00Z"
 *   onReporterClick={(id) => navigate(`/users/${id}`)}
 * />
 * ```
 */

import * as React from 'react'
import { cn } from '../../../../lib/utils'
import {
  AppCard,
  AppCardHeader,
  AppCardTitle,
  AppCardContent,
} from '../../../ui/app-card'
import { IncidentStatusBadge } from '../../../ui/table/IncidentStatusBadge'
import { SeverityIndicator } from '../../../ui/SeverityIndicator'
import { CopyableId } from '../../../ui/table/CopyableId'
import { INCIDENT_TYPE_LABELS } from '../types'
import type { IncidentInfoCardProps, IncidentSeverity, IncidentStatus } from '../types'

/**
 * Key-value info row
 */
function InfoRow({
  label,
  children,
  className,
}: {
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex flex-col gap-0.5', className)}>
      <span className="text-xs text-tertiary">{label}</span>
      <div className="text-sm font-medium text-primary">{children}</div>
    </div>
  )
}

/**
 * Format date for display
 */
function formatDate(isoDate: string): string {
  try {
    const date = new Date(isoDate)
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }) + ' - ' + date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
  } catch {
    return isoDate
  }
}

/**
 * Map severity type to SeverityIndicator level
 */
function mapSeverityToLevel(severity: IncidentSeverity): 'critical' | 'high' | 'medium' | 'low' | 'none' {
  return severity
}

/**
 * Map status to IncidentStatusBadge severity for coloring
 */
function getStatusSeverity(status: IncidentStatus, severity: IncidentSeverity): 'critical' | 'high' | 'medium' | 'low' | 'none' {
  // Draft always gets its own style
  if (status === 'draft') return 'none'
  // Otherwise use the incident severity for coloring
  return severity
}

/**
 * IncidentInfoCard - Incident metadata display
 */
export function IncidentInfoCard({
  status,
  severity,
  type,
  reference,
  reporter,
  createdAt,
  onReporterClick,
  className,
}: IncidentInfoCardProps) {
  return (
    <AppCard shadow="md" className={cn('h-full', className)}>
      <AppCardHeader>
        <AppCardTitle>Incident information</AppCardTitle>
      </AppCardHeader>

      <AppCardContent className="space-y-4">
        {/* Row 1: Status and Reference */}
        <div className="grid grid-cols-2 gap-4">
          <InfoRow label="Status">
            <IncidentStatusBadge
              status={status}
              severity={getStatusSeverity(status, severity)}
            />
          </InfoRow>

          {reference && (
            <InfoRow label="Reference">
              <CopyableId id={reference} />
            </InfoRow>
          )}
        </div>

        {/* Row 2: Type and Severity */}
        <div className="grid grid-cols-2 gap-4">
          <InfoRow label="Type">
            {INCIDENT_TYPE_LABELS[type] || type}
          </InfoRow>

          <InfoRow label="Severity">
            <div className="flex items-center gap-2">
              <SeverityIndicator level={mapSeverityToLevel(severity)} size="sm" />
              <span className={cn(
                'text-sm font-medium capitalize',
                severity === 'critical' && 'text-error',
                severity === 'high' && 'text-aging-dark dark:text-aging',
                severity === 'medium' && 'text-warning-dark dark:text-warning',
                severity === 'low' && 'text-success',
                severity === 'none' && 'text-info',
              )}>
                {severity}
              </span>
            </div>
          </InfoRow>
        </div>

        {/* Row 3: Reporter and Date */}
        <div className="grid grid-cols-2 gap-4">
          <InfoRow label="Reporter">
            {onReporterClick ? (
              <button
                type="button"
                onClick={() => onReporterClick(reporter.id)}
                className={cn(
                  'text-sm font-medium text-link',
                  // Responsive touch targets with negative margin to maintain visual spacing
                  'py-2 lg:py-1 -my-2 lg:-my-1',
                  'pr-2 -mr-2',
                  'hover:underline',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:rounded-sm',
                  'text-left'
                )}
                aria-label={`View reporter profile: ${reporter.name}`}
              >
                {reporter.name}
              </button>
            ) : (
              reporter.name
            )}
          </InfoRow>

          <InfoRow label="Date created">
            {formatDate(createdAt)}
          </InfoRow>
        </div>
      </AppCardContent>
    </AppCard>
  )
}

export default IncidentInfoCard
