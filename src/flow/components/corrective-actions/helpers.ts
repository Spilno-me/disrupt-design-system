/**
 * Corrective Actions - Helper Functions & Constants
 *
 * Status/priority configurations, date utilities, validation helpers
 */

import type { LucideIcon } from 'lucide-react'
import {
  UserPlus,
  Play,
  Clock,
  CheckCircle,
  Lock,
  Pause,
  AlertTriangle,
  AlertCircle,
  Info,
  Minus,
} from 'lucide-react'
import type {
  CorrectiveActionStatus,
  CorrectiveActionPriority,
  EffectivenessAssessment,
  CorrectiveAction,
  TimelineEventType,
} from './types'

// =============================================================================
// STATUS CONFIGURATION
// =============================================================================

export interface StatusConfig {
  label: string
  description: string
  /** Badge variant - uses border-only variants for EMEX consistency */
  variant: 'border-info' | 'border-warning' | 'border-success' | 'border-secondary' | 'border-destructive'
  icon: LucideIcon
  bgClass: string
  textClass: string
}

export const STATUS_CONFIG: Record<CorrectiveActionStatus, StatusConfig> = {
  assigned: {
    label: 'Assigned',
    description: 'Action has been assigned to owner',
    variant: 'border-info',
    icon: UserPlus,
    bgClass: 'bg-info/10',
    textClass: 'text-info',
  },
  'in-progress': {
    label: 'In Progress',
    description: 'Action is being worked on',
    variant: 'border-warning',
    icon: Play,
    bgClass: 'bg-warning/10',
    textClass: 'text-warning-dark dark:text-warning',
  },
  'pending-approval': {
    label: 'Pending Approval',
    description: 'Awaiting manager approval',
    variant: 'border-warning',
    icon: Clock,
    bgClass: 'bg-warning/10',
    textClass: 'text-warning-dark dark:text-warning',
  },
  completed: {
    label: 'Completed',
    description: 'Action has been completed',
    variant: 'border-success',
    icon: CheckCircle,
    bgClass: 'bg-success/10',
    textClass: 'text-success',
  },
  closed: {
    label: 'Closed',
    description: 'Action is officially closed',
    variant: 'border-secondary',
    icon: Lock,
    bgClass: 'bg-muted-bg/50',
    textClass: 'text-secondary',
  },
  deferred: {
    label: 'Deferred',
    description: 'Action has been deferred',
    variant: 'border-secondary',
    icon: Pause,
    bgClass: 'bg-muted-bg/50',
    textClass: 'text-secondary',
  },
}

export const VALID_STATUSES: CorrectiveActionStatus[] = [
  'assigned',
  'in-progress',
  'pending-approval',
  'completed',
  'closed',
  'deferred',
]

// =============================================================================
// PRIORITY CONFIGURATION
// =============================================================================

export interface PriorityConfig {
  label: string
  description: string
  /** Badge variant - uses border-only variants for EMEX consistency */
  variant: 'border-low' | 'border-medium' | 'border-high' | 'border-critical'
  icon: LucideIcon
  bgClass: string
  textClass: string
  borderClass: string
  sortOrder: number
}

export const PRIORITY_CONFIG: Record<CorrectiveActionPriority, PriorityConfig> = {
  low: {
    label: 'Low',
    description: 'Normal priority, can be addressed in regular cycle',
    variant: 'border-low',
    icon: Minus,
    bgClass: 'bg-success/10',
    textClass: 'text-success',
    borderClass: 'border-success',
    sortOrder: 1,
  },
  medium: {
    label: 'Medium',
    description: 'Standard priority, should be addressed promptly',
    variant: 'border-medium',
    icon: Info,
    bgClass: 'bg-warning/10',
    textClass: 'text-warning-dark dark:text-warning',
    borderClass: 'border-warning',
    sortOrder: 2,
  },
  high: {
    label: 'High',
    description: 'Elevated priority, requires prompt attention',
    variant: 'border-high',
    icon: AlertTriangle,
    bgClass: 'bg-warning/10',
    textClass: 'text-warning-dark dark:text-warning',
    borderClass: 'border-warning',
    sortOrder: 3,
  },
  urgent: {
    label: 'Urgent',
    description: 'Critical priority, requires immediate action',
    variant: 'border-critical',
    icon: AlertCircle,
    bgClass: 'bg-destructive/10',
    textClass: 'text-destructive',
    borderClass: 'border-destructive',
    sortOrder: 4,
  },
}

export const VALID_PRIORITIES: CorrectiveActionPriority[] = ['low', 'medium', 'high', 'urgent']

// =============================================================================
// EFFECTIVENESS CONFIGURATION
// =============================================================================

export interface EffectivenessConfig {
  label: string
  description: string
  variant: 'success' | 'info' | 'warning' | 'destructive' | 'secondary'
  percentage: number
}

export const EFFECTIVENESS_CONFIG: Record<EffectivenessAssessment, EffectivenessConfig> = {
  'highly-effective': {
    label: 'Highly Effective',
    description: 'Action exceeded expectations',
    variant: 'success',
    percentage: 100,
  },
  effective: {
    label: 'Effective',
    description: 'Action achieved desired outcome',
    variant: 'success',
    percentage: 80,
  },
  'partially-effective': {
    label: 'Partially Effective',
    description: 'Action achieved some improvement',
    variant: 'warning',
    percentage: 50,
  },
  'not-effective': {
    label: 'Not Effective',
    description: 'Action did not achieve desired outcome',
    variant: 'destructive',
    percentage: 0,
  },
  'too-early': {
    label: 'Too Early to Assess',
    description: 'Not enough time to evaluate effectiveness',
    variant: 'secondary',
    percentage: -1,
  },
}

// =============================================================================
// TIMELINE EVENT CONFIGURATION
// =============================================================================

export interface TimelineEventConfig {
  label: string
  icon: LucideIcon
  variant: 'info' | 'success' | 'warning' | 'destructive' | 'secondary'
}

export const TIMELINE_EVENT_CONFIG: Record<TimelineEventType, TimelineEventConfig> = {
  created: { label: 'Created', icon: UserPlus, variant: 'info' },
  assigned: { label: 'Assigned', icon: UserPlus, variant: 'info' },
  status_changed: { label: 'Status Changed', icon: Play, variant: 'info' },
  comment_added: { label: 'Comment Added', icon: Info, variant: 'secondary' },
  evidence_uploaded: { label: 'Evidence Uploaded', icon: CheckCircle, variant: 'success' },
  extension_requested: { label: 'Extension Requested', icon: Clock, variant: 'warning' },
  extension_approved: { label: 'Extension Approved', icon: CheckCircle, variant: 'success' },
  extension_rejected: { label: 'Extension Rejected', icon: AlertCircle, variant: 'destructive' },
  completed: { label: 'Completed', icon: CheckCircle, variant: 'success' },
  closure_requested: { label: 'Closure Requested', icon: Lock, variant: 'warning' },
  closure_approved: { label: 'Closure Approved', icon: Lock, variant: 'success' },
  closure_rejected: { label: 'Closure Rejected', icon: AlertCircle, variant: 'destructive' },
  deferred: { label: 'Deferred', icon: Pause, variant: 'secondary' },
  reopened: { label: 'Reopened', icon: Play, variant: 'warning' },
}

// =============================================================================
// DATE UTILITIES
// =============================================================================

export function parseDate(date: Date | string | undefined): Date | null {
  if (!date) return null
  return typeof date === 'string' ? new Date(date) : date
}

export function formatDate(date: Date | string | undefined): string {
  const parsed = parseDate(date)
  if (!parsed) return '—'
  return parsed.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatDateTime(date: Date | string | undefined): string {
  const parsed = parseDate(date)
  if (!parsed) return '—'
  return parsed.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatRelativeDate(date: Date | string | undefined): string {
  const parsed = parseDate(date)
  if (!parsed) return '—'

  const now = new Date()
  const diffMs = parsed.getTime() - now.getTime()
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Tomorrow'
  if (diffDays === -1) return 'Yesterday'
  if (diffDays > 0 && diffDays <= 7) return `In ${diffDays} days`
  if (diffDays < 0 && diffDays >= -7) return `${Math.abs(diffDays)} days ago`

  return formatDate(parsed)
}

export type DueDateState = 'future' | 'today' | 'overdue' | 'completed'

export function getDueDateState(
  dueDate: Date | string | undefined,
  status: CorrectiveActionStatus
): DueDateState {
  if (status === 'completed' || status === 'closed') return 'completed'

  const parsed = parseDate(dueDate)
  if (!parsed) return 'future'

  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const due = new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate())

  if (due.getTime() < today.getTime()) return 'overdue'
  if (due.getTime() === today.getTime()) return 'today'
  return 'future'
}

export function getDaysUntilDue(dueDate: Date | string | undefined): number | null {
  const parsed = parseDate(dueDate)
  if (!parsed) return null

  const now = new Date()
  const diffMs = parsed.getTime() - now.getTime()
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24))
}

// =============================================================================
// VALIDATION UTILITIES
// =============================================================================

export function isValidStatus(status: string): status is CorrectiveActionStatus {
  return VALID_STATUSES.includes(status as CorrectiveActionStatus)
}

export function isValidPriority(priority: string): priority is CorrectiveActionPriority {
  return VALID_PRIORITIES.includes(priority as CorrectiveActionPriority)
}

export function canTransitionTo(
  currentStatus: CorrectiveActionStatus,
  targetStatus: CorrectiveActionStatus
): boolean {
  const transitions: Record<CorrectiveActionStatus, CorrectiveActionStatus[]> = {
    assigned: ['in-progress', 'deferred'],
    'in-progress': ['pending-approval', 'deferred'],
    'pending-approval': ['completed', 'in-progress'],
    completed: ['closed', 'in-progress'],
    closed: [],
    deferred: ['assigned', 'in-progress'],
  }
  return transitions[currentStatus]?.includes(targetStatus) ?? false
}

// =============================================================================
// SORTING & FILTERING
// =============================================================================

export function sortByPriority(a: CorrectiveAction, b: CorrectiveAction): number {
  return PRIORITY_CONFIG[b.priority].sortOrder - PRIORITY_CONFIG[a.priority].sortOrder
}

export function sortByDueDate(a: CorrectiveAction, b: CorrectiveAction): number {
  const aDate = parseDate(a.dueDate)?.getTime() ?? Infinity
  const bDate = parseDate(b.dueDate)?.getTime() ?? Infinity
  return aDate - bDate
}

export function isOverdue(action: CorrectiveAction): boolean {
  return getDueDateState(action.dueDate, action.status) === 'overdue'
}

// =============================================================================
// USER DISPLAY
// =============================================================================

export function getUserDisplayName(user: { firstName?: string; lastName?: string; email?: string } | undefined): string {
  if (!user) return 'Unassigned'
  if (user.firstName && user.lastName) return `${user.firstName} ${user.lastName}`
  if (user.firstName) return user.firstName
  if (user.email) return user.email
  return 'Unknown'
}

export function getUserInitials(user: { firstName?: string; lastName?: string } | undefined): string {
  if (!user) return '?'
  const first = user.firstName?.[0] ?? ''
  const last = user.lastName?.[0] ?? ''
  return (first + last).toUpperCase() || '?'
}
