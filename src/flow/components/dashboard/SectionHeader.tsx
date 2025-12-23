/**
 * Section Header - Consistent section title with icon
 * Uses semantic tokens for dark mode compatibility
 */
import * as React from 'react'
import { cn } from '../../../lib/utils'

export type BadgeVariant = 'default' | 'error' | 'warning' | 'success' | 'info'

export interface SectionHeaderProps {
  icon: React.ReactNode
  title: string
  description?: string
  /** Optional badge text to display next to title */
  badge?: string
  /** Badge color variant */
  badgeVariant?: BadgeVariant
}

const badgeStyles: Record<BadgeVariant, string> = {
  default: 'bg-muted-bg text-secondary',
  error: 'bg-error/10 text-error',
  warning: 'bg-warning/10 text-warning-dark dark:text-warning',
  success: 'bg-success/10 text-success',
  info: 'bg-accent/10 text-accent',
}

export function SectionHeader({
  icon,
  title,
  description,
  badge,
  badgeVariant = 'default',
}: SectionHeaderProps) {
  return (
    <div className="flex items-start gap-3 mb-4">
      {/* DAPS: Icon container at muted level (subtle, doesn't compete with cards) */}
      <div className="p-2 rounded-lg bg-muted-bg dark:bg-surface text-accent-strong [&>svg]:w-5 [&>svg]:h-5">
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-primary">{title}</h2>
          {badge && (
            <span
              className={cn(
                'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                badgeStyles[badgeVariant]
              )}
            >
              {badge}
            </span>
          )}
        </div>
        {description && (
          <p className="text-sm text-secondary">{description}</p>
        )}
      </div>
    </div>
  )
}
