/**
 * PermissionItem - Individual permission row with checkbox
 *
 * Displays a single permission with optional bitmask value (developer mode).
 * Used in PermissionGroup for progressive disclosure.
 */

import * as React from 'react'
import { Check } from 'lucide-react'
import { cn } from '../../../../lib/utils'
import { Checkbox } from '../../../../components/ui/checkbox'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../../../components/ui/tooltip'
import type { EnhancedPermission } from '../types'

// =============================================================================
// TYPES
// =============================================================================

interface PermissionItemProps {
  permission: EnhancedPermission
  /** Whether this permission is selected/checked */
  checked?: boolean
  /** Callback when checkbox toggled (edit mode only) */
  onChange?: (checked: boolean) => void
  /** Read-only mode - shows check icon instead of checkbox */
  readOnly?: boolean
  /** Show bitmask value (developer mode) */
  showBitmask?: boolean
  className?: string
}

// =============================================================================
// COMPONENT
// =============================================================================

export function PermissionItem({
  permission,
  checked = false,
  onChange,
  readOnly = false,
  showBitmask = false,
  className,
}: PermissionItemProps) {
  const itemContent = (
    <div
      data-slot="permission-item"
      className={cn(
        'flex items-start gap-3 rounded-md p-2',
        !readOnly && 'hover:bg-muted-bg/30 cursor-pointer',
        className
      )}
      onClick={!readOnly && onChange ? () => onChange(!checked) : undefined}
    >
      {/* Checkbox or Check icon */}
      {readOnly ? (
        checked && (
          <div className="flex size-5 items-center justify-center rounded bg-success/10 shrink-0 mt-0.5">
            <Check className="size-3.5 text-success" />
          </div>
        )
      ) : (
        <Checkbox
          checked={checked}
          onCheckedChange={onChange}
          className="mt-0.5 shrink-0"
          aria-label={permission.label}
        />
      )}

      {/* Label and description */}
      <div className="flex-1 min-w-0">
        <span className="text-sm text-primary font-medium">
          {permission.label}
        </span>
        {permission.description && (
          <p className="text-xs text-tertiary mt-0.5 line-clamp-2">
            {permission.description}
          </p>
        )}
      </div>

      {/* Bitmask value (developer mode) */}
      {showBitmask && (
        <span className="text-xs font-mono text-tertiary bg-muted-bg px-1.5 py-0.5 rounded shrink-0">
          {permission.bitmask}
        </span>
      )}
    </div>
  )

  // Wrap with tooltip if description exists and we're in read-only mode
  if (readOnly && permission.description) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{itemContent}</TooltipTrigger>
          <TooltipContent side="right" className="max-w-xs">
            {permission.description}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return itemContent
}

PermissionItem.displayName = 'PermissionItem'

export default PermissionItem
