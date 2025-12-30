/**
 * RowActions - Smart action column component using ActionTile
 *
 * Renders ActionTile buttons inline when there are ≤3 actions (UX Action Overflow Rule),
 * automatically switches to overflow menu when there are 4+ actions.
 *
 * Color grading by action intent:
 * - `success` - Green, for positive actions (submit, download, approve)
 * - `info` - Teal, for modify actions (edit, update) - DEFAULT
 * - `neutral` - Gray, for passive actions (view, preview)
 * - `destructive` - Red, for dangerous actions (delete, remove)
 *
 * @component MOLECULE
 * @category Data Display
 *
 * @example
 * ```tsx
 * <RowActions
 *   actions={[
 *     { id: 'view', label: 'View', icon: Eye, onClick: handleView, variant: 'neutral' },
 *     { id: 'edit', label: 'Edit', icon: Pencil, onClick: handleEdit, variant: 'info' },
 *     { id: 'delete', label: 'Delete', icon: Trash2, onClick: handleDelete, variant: 'destructive' },
 *   ]}
 * />
 * ```
 */

import * as React from 'react'
import { MoreHorizontal, type LucideIcon } from 'lucide-react'
import { cn } from '../../lib/utils'
import { ActionTile } from './ActionTile'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './tooltip'

// =============================================================================
// TYPES
// =============================================================================

export interface RowAction {
  /** Unique identifier */
  id: string
  /** Display label */
  label: string
  /** Icon component */
  icon?: LucideIcon
  /** Click handler */
  onClick: () => void
  /** Whether the action is disabled */
  disabled?: boolean
  /** Action variant for styling (maps to ActionTile variants) */
  variant?: 'default' | 'success' | 'info' | 'neutral' | 'destructive'
  /** Show separator before this action in dropdown */
  separatorBefore?: boolean
  /** Hide this action (useful for conditional actions) */
  hidden?: boolean
  /** Test ID for automated testing */
  'data-testid'?: string
}

export interface RowActionsProps {
  /** Array of actions to display */
  actions: RowAction[]
  /** Maximum inline actions before overflow (default: 3) */
  maxInline?: number
  /** Size of action buttons */
  size?: 'sm' | 'default'
  /** Additional className */
  className?: string
  /** Stop click propagation (useful in table rows) */
  stopPropagation?: boolean
}

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Maps RowAction variant to ActionTile variant
 * Color grading by action intent:
 * - success → green (positive: submit, download, approve)
 * - info → teal (modify: edit, update)
 * - neutral → gray (passive: view, preview)
 * - destructive → red (dangerous: delete, remove)
 * - default → info (fallback)
 */
const getActionTileVariant = (variant: RowAction['variant']) => {
  switch (variant) {
    case 'success':
      return 'success'
    case 'neutral':
      return 'neutral'
    case 'destructive':
      return 'destructive'
    case 'info':
    case 'default':
    default:
      return 'info'
  }
}

// =============================================================================
// COMPONENT
// =============================================================================

export function RowActions({
  actions,
  maxInline = 3,
  size = 'sm',
  className,
  stopPropagation = true,
}: RowActionsProps) {
  // Filter out hidden actions
  const visibleActions = actions.filter((a) => !a.hidden)

  // Handle click with optional propagation stop
  const handleClick = (
    e: React.MouseEvent,
    action: RowAction
  ) => {
    if (stopPropagation) {
      e.stopPropagation()
    }
    action.onClick()
  }

  // If 0 actions, render nothing
  if (visibleActions.length === 0) {
    return null
  }

  // If within limit, render all inline using ActionTile
  if (visibleActions.length <= maxInline) {
    return (
      <TooltipProvider>
        <div
          className={cn('flex items-center gap-1', className)}
          onClick={(e) => stopPropagation && e.stopPropagation()}
        >
          {visibleActions.map((action) => (
            <Tooltip key={action.id}>
              <TooltipTrigger asChild>
                <ActionTile
                  variant={getActionTileVariant(action.variant)}
                  appearance="filled"
                  size={size === 'sm' ? 'xs' : 'sm'}
                  onClick={(e) => handleClick(e, action)}
                  disabled={action.disabled}
                  aria-label={action.label}
                  data-testid={action['data-testid']}
                >
                  {action.icon && <action.icon className="size-4" />}
                </ActionTile>
              </TooltipTrigger>
              <TooltipContent side="top" sideOffset={4}>{action.label}</TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>
    )
  }

  // More than maxInline: show first (maxInline - 1) inline + overflow menu
  const inlineActions = visibleActions.slice(0, maxInline - 1)
  const overflowActions = visibleActions.slice(maxInline - 1)

  return (
    <TooltipProvider>
      <div
        className={cn('flex items-center gap-1', className)}
        onClick={(e) => stopPropagation && e.stopPropagation()}
      >
        {/* Inline actions using ActionTile */}
        {inlineActions.map((action) => (
          <Tooltip key={action.id}>
            <TooltipTrigger asChild>
              <ActionTile
                variant={getActionTileVariant(action.variant)}
                appearance="filled"
                size={size === 'sm' ? 'xs' : 'sm'}
                onClick={(e) => handleClick(e, action)}
                disabled={action.disabled}
                aria-label={action.label}
                data-testid={action['data-testid']}
              >
                {action.icon && <action.icon className="size-4" />}
              </ActionTile>
            </TooltipTrigger>
            <TooltipContent side="top" sideOffset={4}>{action.label}</TooltipContent>
          </Tooltip>
        ))}

        {/* Overflow menu */}
        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <ActionTile
                  variant="info"
                  appearance="filled"
                  size={size === 'sm' ? 'xs' : 'sm'}
                  aria-label="More actions"
                >
                  <MoreHorizontal className="size-4" />
                </ActionTile>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent side="top" sideOffset={4}>More actions</TooltipContent>
          </Tooltip>
          <DropdownMenuContent align="end" className="min-w-[160px]">
            {overflowActions.map((action, index) => (
              <React.Fragment key={action.id}>
                {action.separatorBefore && index > 0 && <DropdownMenuSeparator />}
                <DropdownMenuItem
                  onClick={() => action.onClick()}
                  disabled={action.disabled}
                  className={cn(
                    action.variant === 'destructive' &&
                      'text-error focus:text-error focus:bg-error/10'
                  )}
                >
                  {action.icon && <action.icon className="size-4 mr-2" />}
                  {action.label}
                </DropdownMenuItem>
              </React.Fragment>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </TooltipProvider>
  )
}

RowActions.displayName = 'RowActions'

export default RowActions
