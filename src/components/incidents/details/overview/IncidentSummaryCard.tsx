/**
 * IncidentSummaryCard - Compact combined card for incident info + description
 *
 * Merges IncidentInfoCard and DescriptionCard into a single card to save space.
 * Used by CompactOverviewTab for the 2-column layout.
 *
 * Key differences from separate cards:
 * - No reference field (shown in header already)
 * - Metadata in dense 4-column row (Status, Severity, Type, Reporter)
 * - Date on separate row below
 * - Description section below with "Show more" toggle
 *
 * @example
 * ```tsx
 * <IncidentSummaryCard
 *   status="review"
 *   severity="high"
 *   type="chemical"
 *   reporter={{ id: '1', name: 'Maria Rodriguez' }}
 *   createdAt="2025-02-11T12:26:00Z"
 *   description="This incident was reported at Quality Control Lab..."
 *   onReporterClick={(id) => navigate(`/users/${id}`)}
 * />
 * ```
 */

import * as React from 'react'
import { useState, useRef, useEffect } from 'react'
import { cn } from '../../../../lib/utils'
import {
  AppCard,
  AppCardHeader,
  AppCardTitle,
  AppCardContent,
} from '../../../ui/app-card'
import { IncidentStatusBadge } from '../../../ui/table/IncidentStatusBadge'
import { SeverityIndicator } from '../../../ui/SeverityIndicator'
import { INCIDENT_TYPE_LABELS } from '../types'
import type {
  IncidentSeverity,
  IncidentStatus,
  IncidentCategory,
  IncidentPerson,
} from '../types'

export interface IncidentSummaryCardProps {
  // Incident metadata
  status: IncidentStatus
  severity: IncidentSeverity
  type: IncidentCategory
  reporter: IncidentPerson
  createdAt: string
  // Description
  description: string
  /** Max lines before truncation (default: 4) */
  maxLines?: number
  // Callbacks
  onReporterClick?: (id: string) => void
  className?: string
}

/**
 * Compact info item
 */
function InfoItem({
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
    return (
      date.toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }) +
      ' - ' +
      date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
    )
  } catch {
    return isoDate
  }
}


/**
 * IncidentSummaryCard - Combined incident info and description
 */
export function IncidentSummaryCard({
  status,
  severity,
  type,
  reporter,
  createdAt,
  description,
  maxLines = 4,
  onReporterClick,
  className,
}: IncidentSummaryCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [showToggle, setShowToggle] = useState(false)
  const textRef = useRef<HTMLParagraphElement>(null)

  // Check if text is truncated
  useEffect(() => {
    const checkTruncation = () => {
      if (textRef.current) {
        const element = textRef.current
        setShowToggle(element.scrollHeight > element.clientHeight)
      }
    }

    checkTruncation()
    window.addEventListener('resize', checkTruncation)
    return () => window.removeEventListener('resize', checkTruncation)
  }, [description, maxLines])

  return (
    <AppCard shadow="md" className={cn('h-full', className)}>
      <AppCardHeader>
        <AppCardTitle>Incident information</AppCardTitle>
      </AppCardHeader>

      <AppCardContent className="space-y-4">
        {/* Row 1: Dense 4-column metadata grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <InfoItem label="Status">
            <IncidentStatusBadge status={status} severity={severity} />
          </InfoItem>

          <InfoItem label="Severity">
            <div className="flex items-center gap-1.5">
              <SeverityIndicator level={severity} size="sm" />
              <span
                className={cn(
                  'text-sm font-medium capitalize',
                  severity === 'critical' && 'text-error',
                  severity === 'high' && 'text-aging-dark dark:text-aging',
                  severity === 'medium' && 'text-warning-dark dark:text-warning',
                  severity === 'low' && 'text-success',
                  severity === 'none' && 'text-info'
                )}
              >
                {severity}
              </span>
            </div>
          </InfoItem>

          <InfoItem label="Type">{INCIDENT_TYPE_LABELS[type] || type}</InfoItem>

          <InfoItem label="Reporter">
            {onReporterClick ? (
              <button
                type="button"
                onClick={() => onReporterClick(reporter.id)}
                className={cn(
                  'text-sm font-medium text-link',
                  'py-1 -my-1 pr-2 -mr-2',
                  'hover:underline',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:rounded-sm',
                  'text-left truncate'
                )}
                aria-label={`View reporter profile: ${reporter.name}`}
              >
                {reporter.name}
              </button>
            ) : (
              <span className="truncate">{reporter.name}</span>
            )}
          </InfoItem>
        </div>

        {/* Row 2: Date created */}
        <InfoItem label="Date created">{formatDate(createdAt)}</InfoItem>

        {/* Divider */}
        <div className="border-t border-default" />

        {/* Description Section */}
        <div>
          <h4 className="text-sm font-semibold text-primary mb-2">Description</h4>
          <p
            ref={textRef}
            className={cn('text-sm text-secondary leading-relaxed')}
            style={
              !expanded
                ? {
                    WebkitLineClamp: maxLines,
                    display: '-webkit-box',
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }
                : undefined
            }
          >
            {description}
          </p>

          {/* Show more/less toggle */}
          {showToggle && (
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className={cn(
                'mt-2 text-sm font-medium text-link',
                'py-1 -my-1 px-2 -mx-2',
                'hover:underline',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:rounded-sm',
                'rounded-sm'
              )}
              aria-expanded={expanded}
              aria-label={
                expanded ? 'Show less of description' : 'Show more of description'
              }
            >
              {expanded ? 'Show less' : 'Show more...'}
            </button>
          )}
        </div>
      </AppCardContent>
    </AppCard>
  )
}

export default IncidentSummaryCard
