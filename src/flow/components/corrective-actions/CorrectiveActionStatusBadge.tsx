/**
 * CorrectiveActionStatusBadge
 *
 * Displays the current status of a corrective action with appropriate
 * styling, icon, and semantic color based on the workflow state.
 */

import { Badge } from '@/components/ui/badge'
import { STATUS_CONFIG, type StatusConfig } from './helpers'
import type { CorrectiveActionStatus } from './types'
import { cn } from '@/lib/utils'

export interface CorrectiveActionStatusBadgeProps {
  /** Current status of the corrective action */
  status: CorrectiveActionStatus
  /** Size variant */
  size?: 'sm' | 'default' | 'lg'
  /** Show icon alongside label */
  showIcon?: boolean
  /** Additional CSS classes */
  className?: string
}

const sizeClasses = {
  sm: 'text-xs px-1.5 py-0.5 gap-1',
  default: 'text-sm px-2 py-1 gap-1.5',
  lg: 'text-base px-3 py-1.5 gap-2',
}

const iconSizes = {
  sm: 12,
  default: 14,
  lg: 16,
}

export function CorrectiveActionStatusBadge({
  status,
  size = 'default',
  showIcon = true,
  className,
}: CorrectiveActionStatusBadgeProps) {
  const config: StatusConfig = STATUS_CONFIG[status]
  const Icon = config.icon

  return (
    <Badge
      variant={config.variant}
      className={cn(
        'inline-flex items-center font-medium',
        sizeClasses[size],
        className
      )}
    >
      {showIcon && (
        <Icon
          size={iconSizes[size]}
          className="shrink-0"
          aria-hidden="true"
        />
      )}
      <span>{config.label}</span>
    </Badge>
  )
}

export default CorrectiveActionStatusBadge
