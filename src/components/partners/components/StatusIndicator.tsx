/**
 * StatusIndicator - Displays status as a colored dot with tooltip
 * @module partners/components/StatusIndicator
 */

import { cn } from "../../../lib/utils"
import { Tooltip, TooltipTrigger, TooltipContent } from "../../ui/tooltip"
import type { NetworkPartnerStatus } from "../types"

interface StatusIndicatorProps {
  /** Status value to display */
  status: NetworkPartnerStatus
  /** Optional test ID for automated testing */
  "data-testid"?: string
}

const STATUS_CONFIG: Record<NetworkPartnerStatus, { label: string; dotClass: string }> = {
  active: { label: "Active", dotClass: "bg-success" },
  inactive: { label: "Inactive", dotClass: "bg-muted" },
  pending: { label: "Pending", dotClass: "bg-warning" },
}

/**
 * StatusIndicator - Renders a colored dot with tooltip showing status label
 */
export function StatusIndicator({ status, "data-testid": testId }: StatusIndicatorProps) {
  const { label, dotClass } = STATUS_CONFIG[status]

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className={cn(
            "inline-block w-2.5 h-2.5 rounded-full cursor-help",
            dotClass
          )}
          aria-label={label}
          data-testid={testId}
        />
      </TooltipTrigger>
      <TooltipContent side="top" sideOffset={4}>
        {label}
      </TooltipContent>
    </Tooltip>
  )
}
