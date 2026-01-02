/**
 * PriorityIndicator
 *
 * Displays the priority level of a corrective action with
 * appropriate urgency styling and semantic colors.
 */

import { Badge } from '@/components/ui/badge'
import { PRIORITY_CONFIG, type PriorityConfig } from './helpers'
import type { CorrectiveActionPriority } from './types'
import { cn } from '@/lib/utils'

export interface PriorityIndicatorProps {
  /** Priority level */
  priority: CorrectiveActionPriority
  /** Display variant */
  variant?: 'badge' | 'dot' | 'bar'
  /** Size */
  size?: 'sm' | 'default' | 'lg'
  /** Show label text */
  showLabel?: boolean
  /** Additional CSS classes */
  className?: string
}

const sizeClasses = {
  sm: 'text-xs',
  default: 'text-sm',
  lg: 'text-base',
}

const dotSizes = {
  sm: 'h-2 w-2',
  default: 'h-2.5 w-2.5',
  lg: 'h-3 w-3',
}

const barSizes = {
  sm: 'h-1 w-8',
  default: 'h-1.5 w-12',
  lg: 'h-2 w-16',
}

export function PriorityIndicator({
  priority,
  variant = 'badge',
  size = 'default',
  showLabel = true,
  className,
}: PriorityIndicatorProps) {
  const config: PriorityConfig = PRIORITY_CONFIG[priority]
  const Icon = config.icon

  // Dot variant - simple colored dot
  if (variant === 'dot') {
    return (
      <div className={cn('inline-flex items-center gap-2', className)}>
        <span
          className={cn(
            'rounded-full',
            dotSizes[size],
            config.bgClass.replace('/10', '')
          )}
          aria-hidden="true"
        />
        {showLabel && (
          <span className={cn(sizeClasses[size], config.textClass)}>
            {config.label}
          </span>
        )}
      </div>
    )
  }

  // Bar variant - severity bar visualization
  if (variant === 'bar') {
    const barSegments = config.sortOrder // 1-4 segments filled
    return (
      <div className={cn('inline-flex items-center gap-2', className)}>
        <div className="flex gap-0.5">
          {[1, 2, 3, 4].map((segment) => (
            <div
              key={segment}
              className={cn(
                'rounded-sm',
                barSizes[size],
                segment <= barSegments
                  ? config.bgClass.replace('/10', '')
                  : 'bg-muted-bg'
              )}
              aria-hidden="true"
            />
          ))}
        </div>
        {showLabel && (
          <span className={cn(sizeClasses[size], config.textClass)}>
            {config.label}
          </span>
        )}
      </div>
    )
  }

  // Badge variant (default)
  return (
    <Badge
      variant={config.variant}
      className={cn(
        'inline-flex items-center gap-1.5 font-medium',
        sizeClasses[size],
        className
      )}
    >
      <Icon size={size === 'sm' ? 12 : size === 'lg' ? 16 : 14} aria-hidden="true" />
      {showLabel && <span>{config.label}</span>}
    </Badge>
  )
}

export default PriorityIndicator
