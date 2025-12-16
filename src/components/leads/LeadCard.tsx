import * as React from 'react'
import { MoreVertical, Mail, Phone, Building2, Calendar, Globe, DollarSign, Eye, Edit, Trash2 } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Button } from '../ui/button'
import { SeverityIndicator, SeverityLevel } from '../ui/SeverityIndicator'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '../ui/dropdown-menu'

// =============================================================================
// TYPES
// =============================================================================

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'
export type LeadPriority = 'high' | 'medium' | 'low'
export type LeadSource = 'website' | 'referral' | 'cold_outreach' | 'partner' | 'other'

export interface Lead {
  /** Unique identifier */
  id: string
  /** Lead name */
  name: string
  /** Company name */
  company: string
  /** Email address */
  email: string
  /** Phone number */
  phone?: string
  /** Lead priority */
  priority: LeadPriority
  /** Lead score (0-100) */
  score: number
  /** Lead status */
  status: LeadStatus
  /** Source of the lead */
  source: LeadSource
  /** Description/notes */
  description?: string
  /** Deal value */
  value?: number
  /** When the lead was created */
  createdAt: string
  /** Avatar URL (optional) */
  avatarUrl?: string
}

export type LeadAction = 'view' | 'edit' | 'delete'

export interface LeadCardProps {
  /** Lead data */
  lead: Lead
  /** Callback when card is clicked */
  onClick?: (lead: Lead) => void
  /** Callback when an action is selected from the dropdown */
  onActionClick?: (lead: Lead, action: LeadAction) => void
  /** Additional className */
  className?: string
}

// =============================================================================
// LEAD CARD COMPONENT
// =============================================================================

/**
 * LeadCard - Displays a lead's information in a card format
 *
 * Shows name, company, contact info, score, status, and deal value.
 * Used in the leads management grid view.
 *
 * @example
 * ```tsx
 * <LeadCard
 *   lead={{
 *     id: '1',
 *     name: 'Peter Thiel',
 *     company: 'Founders Fund',
 *     email: 'peter@ff.com',
 *     priority: 'high',
 *     score: 92,
 *     status: 'new',
 *     source: 'website',
 *     value: 45000,
 *     createdAt: '2 months ago',
 *   }}
 *   onClick={(lead) => console.log('Clicked', lead)}
 * />
 * ```
 */
export function LeadCard({
  lead,
  onClick,
  onActionClick,
  className,
}: LeadCardProps) {
  const handleClick = () => {
    onClick?.(lead)
  }

  const handleAction = (action: LeadAction) => {
    onActionClick?.(lead, action)
  }

  return (
    <div
      className={cn(
        'flex flex-col gap-3 p-4 bg-surface border border-default rounded-lg shadow-sm',
        'cursor-pointer hover:border-accent hover:shadow-md transition-all',
        className
      )}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleClick()
        }
      }}
    >
      {/* Header: Name, Priority, Score, Actions */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {/* Avatar */}
          <Avatar name={lead.name} avatarUrl={lead.avatarUrl} />

          {/* Name and Company */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-primary truncate">{lead.name}</span>
              <SeverityIndicator level={mapPriorityToSeverity(lead.priority)} size="sm" />
            </div>
            {/* Company - Secondary level, readable but not competing with name */}
            <div className="flex items-center gap-1.5 text-sm text-primary">
              <Building2 className="w-3.5 h-3.5 flex-shrink-0 text-muted" />
              <span className="truncate">{lead.company}</span>
            </div>
          </div>
        </div>

        {/* Score and Actions */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <ScoreBadge score={lead.score} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-11 w-11"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[180px]">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  handleAction('view')
                }}
                className="py-3 text-base"
              >
                <Eye className="mr-3 h-5 w-5" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  handleAction('edit')
                }}
                className="py-3 text-base"
              >
                <Edit className="mr-3 h-5 w-5" />
                Edit Lead
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  handleAction('delete')
                }}
                className="py-3 text-base text-error focus:text-error"
              >
                <Trash2 className="mr-3 h-5 w-5" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Contact Info - Secondary level with icon muted, text readable */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
        <div className="flex items-center gap-1.5">
          <Mail className="w-3.5 h-3.5 flex-shrink-0 text-muted" />
          <span className="text-primary truncate max-w-[180px]">{lead.email}</span>
        </div>
        {lead.phone && (
          <div className="flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 flex-shrink-0 text-muted" />
            <span className="text-muted">{lead.phone}</span>
          </div>
        )}
      </div>

      {/* Description - Tertiary level, supporting info */}
      {lead.description && (
        <p className="text-sm text-muted line-clamp-2">
          {lead.description}
        </p>
      )}

      {/* Footer: Status, Source, Time, Value */}
      <div className="flex items-center justify-between gap-2 pt-3 border-t border-subtle">
        <div className="flex items-center gap-2 flex-wrap">
          <StatusBadge status={lead.status} />
          <SourceBadge source={lead.source} />
          {/* Date - Tertiary metadata */}
          <div className="flex items-center gap-1 text-xs text-muted">
            <Calendar className="w-3 h-3" />
            <span>{lead.createdAt}</span>
          </div>
        </div>

        {/* Value - Primary level, important business data */}
        {lead.value !== undefined && (
          <div className="flex items-center gap-1 text-base font-bold text-accent">
            <DollarSign className="w-4 h-4" />
            <span>{formatCurrency(lead.value)}</span>
          </div>
        )}
      </div>
    </div>
  )
}

// =============================================================================
// SUBCOMPONENTS
// =============================================================================

/** Avatar with initials fallback */
function Avatar({ name, avatarUrl }: { name: string; avatarUrl?: string }) {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
      />
    )
  }

  return (
    <div className="w-10 h-10 rounded-full bg-accent text-inverse flex items-center justify-center font-semibold text-sm flex-shrink-0">
      {initials}
    </div>
  )
}

/** Map LeadPriority to SeverityLevel */
function mapPriorityToSeverity(priority: LeadPriority): SeverityLevel {
  const mapping: Record<LeadPriority, SeverityLevel> = {
    high: 'high',
    medium: 'medium',
    low: 'low',
  }
  return mapping[priority]
}

/** Lead score badge */
function ScoreBadge({ score }: { score: number }) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1.5 text-sm font-semibold rounded-full',
        score >= 80 && 'bg-success-light text-success',
        score >= 50 && score < 80 && 'bg-warning-light text-warning',
        score < 50 && 'bg-muted-bg text-primary'
      )}
    >
      Score {score}
    </span>
  )
}

/** Status badge */
function StatusBadge({ status }: { status: LeadStatus }) {
  const statusConfig: Record<LeadStatus, { label: string; className: string }> = {
    new: { label: 'New', className: 'bg-info-light text-info' },
    contacted: { label: 'Contacted', className: 'bg-warning-light text-warning' },
    qualified: { label: 'Qualified', className: 'bg-accent-bg text-accent' },
    converted: { label: 'Converted', className: 'bg-success-light text-success' },
    lost: { label: 'Lost', className: 'bg-error-light text-error' },
  }

  const config = statusConfig[status]

  return (
    <span className={cn('inline-flex px-3 py-1 text-sm font-medium rounded', config.className)}>
      {config.label}
    </span>
  )
}

/** Source badge */
function SourceBadge({ source }: { source: LeadSource }) {
  const sourceConfig: Record<LeadSource, { label: string; icon: React.ReactNode }> = {
    website: { label: 'Website', icon: <Globe className="w-3.5 h-3.5" /> },
    referral: { label: 'Referral', icon: null },
    cold_outreach: { label: 'Cold Outreach', icon: null },
    partner: { label: 'Partner', icon: null },
    other: { label: 'Other', icon: null },
  }

  const config = sourceConfig[source]

  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 text-sm text-primary bg-muted-bg rounded">
      {config.icon}
      {config.label}
    </span>
  )
}

// =============================================================================
// HELPERS
// =============================================================================

function formatCurrency(value: number): string {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}k`
  }
  return value.toFixed(2)
}

export default LeadCard
