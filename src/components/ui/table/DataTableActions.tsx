"use client"

import * as React from "react"
import { Button } from "../button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../tooltip"
import { MoreHorizontal } from "lucide-react"
import { cn } from "../../../lib/utils"

// =============================================================================
// TYPES
// =============================================================================

export type ActionVariant = 'default' | 'destructive' | 'ghost' | 'accent'

export interface ActionItem<T = unknown> {
  /** Unique identifier for the action */
  id: string
  /** Display label */
  label: string
  /** Icon component */
  icon?: React.ComponentType<{ className?: string }>
  /** Click handler */
  onClick: (row: T, event: React.MouseEvent) => void | Promise<void>
  /** Button variant - determines styling */
  variant?: ActionVariant
  /** Conditional visibility - function receives row and user context */
  showWhen?: (row: T, user?: unknown) => boolean
  /** Permission requirement - simple string check */
  requires?: string | string[]
  /** Show confirmation dialog before executing */
  confirm?: boolean | string
  /** Disabled state */
  disabled?: boolean | ((row: T) => boolean)
  /** Loading state */
  loading?: boolean
}

export interface DataTableActionsProps<T = unknown> {
  /** Array of action items */
  actions: ActionItem<T>[]
  /** Current row data */
  row: T
  /** User context for permission checks */
  user?: unknown
  /** Maximum number of visible buttons (rest go to overflow menu) */
  maxVisible?: number
  /** Alignment of action buttons */
  align?: 'left' | 'center' | 'right'
  /** Layout mode */
  layout?: 'horizontal' | 'vertical'
  /** Button size */
  size?: 'sm' | 'default' | 'lg' | 'icon'
  /** Additional className */
  className?: string
  /** Show labels on visible buttons (desktop) */
  showLabels?: boolean
  /** Tooltip provider - set to false if already wrapped */
  provideTooltip?: boolean
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Check if user has required permission
 */
function hasPermission(user: unknown, requires?: string | string[]): boolean {
  if (!requires) return true
  if (!user) return false

  const permissions = Array.isArray(requires) ? requires : [requires]

  // Check user.role
  if (user.role && permissions.some(p => user.role.toLowerCase() === p.toLowerCase())) {
    return true
  }

  // Check user.roles array
  if (user.roles && Array.isArray(user.roles)) {
    return permissions.some(p =>
      user.roles.some((r: string) => r.toLowerCase() === p.toLowerCase())
    )
  }

  // Check user.isAdmin flag
  if (permissions.includes('admin') && user.isAdmin === true) {
    return true
  }

  return false
}

/**
 * Check if action should be shown
 */
function shouldShowAction<T>(
  action: ActionItem<T>,
  row: T,
  user?: unknown
): boolean {
  // Check permission requirement
  if (action.requires && !hasPermission(user, action.requires)) {
    return false
  }

  // Check custom visibility function
  if (action.showWhen && !action.showWhen(row, user)) {
    return false
  }

  return true
}

/**
 * Get disabled state for action
 */
function isActionDisabled<T>(action: ActionItem<T>, row: T): boolean {
  if (action.loading) return true
  if (typeof action.disabled === 'function') return action.disabled(row)
  return action.disabled ?? false
}

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * DataTableActions - Standardized action buttons for data tables
 *
 * Provides a consistent pattern for row actions with:
 * - Automatic overflow menu for many actions
 * - Permission-based visibility
 * - Conditional rendering
 * - Built-in tooltips
 * - Confirmation dialogs
 * - Mobile-optimized layouts
 *
 * @example
 * ```tsx
 * const actions = [
 *   { id: 'edit', label: 'Edit', icon: Edit, onClick: handleEdit },
 *   { id: 'delete', label: 'Delete', icon: Trash, variant: 'destructive',
 *     onClick: handleDelete, requires: 'admin', confirm: true }
 * ]
 *
 * <DataTableActions
 *   actions={actions}
 *   row={rowData}
 *   user={currentUser}
 *   maxVisible={2}
 * />
 * ```
 */
export function DataTableActions<T = unknown>({
  actions,
  row,
  user,
  maxVisible = 3,
  align = 'right',
  layout = 'horizontal',
  size = 'icon',
  className,
  showLabels = false,
  provideTooltip = true,
}: DataTableActionsProps<T>) {
  // Filter actions based on visibility and permissions
  const visibleActions = React.useMemo(
    () => actions.filter(action => shouldShowAction(action, row, user)),
    [actions, row, user]
  )

  // Split actions into visible buttons and overflow menu items
  const primaryActions = visibleActions.slice(0, maxVisible)
  const overflowActions = visibleActions.slice(maxVisible)

  // Handle action click with optional confirmation
  const handleActionClick = async (action: ActionItem<T>, event: React.MouseEvent) => {
    event.stopPropagation() // Prevent row click

    // Handle confirmation
    if (action.confirm) {
      const message = typeof action.confirm === 'string'
        ? action.confirm
        : `Are you sure you want to ${action.label.toLowerCase()}?`

      if (!window.confirm(message)) {
        return
      }
    }

    // Execute action
    await action.onClick(row, event)
  }

  // Render single action button
  const renderActionButton = (action: ActionItem<T>, showLabel = showLabels) => {
    const Icon = action.icon
    const disabled = isActionDisabled(action, row)
    const buttonVariant = action.variant || 'ghost'

    const button = (
      <Button
        onClick={(e) => handleActionClick(action, e)}
        variant={buttonVariant}
        size={showLabel ? 'sm' : size}
        disabled={disabled}
        className={cn(showLabel && "justify-start")}
      >
        {Icon && <Icon className={cn("h-4 w-4", showLabel && "mr-2")} />}
        {showLabel && action.label}
      </Button>
    )

    // Wrap in tooltip only for icon-only buttons on desktop
    if (!showLabel && provideTooltip) {
      return (
        <Tooltip key={action.id}>
          <TooltipTrigger asChild>
            {button}
          </TooltipTrigger>
          <TooltipContent>
            {action.label}
          </TooltipContent>
        </Tooltip>
      )
    }

    return <div key={action.id}>{button}</div>
  }

  // No actions to show
  if (visibleActions.length === 0) {
    return null
  }

  // Render actions
  const actionsContent = (
    <div
      className={cn(
        "flex items-center",
        layout === 'horizontal' ? "gap-1" : "flex-col gap-2 w-full",
        align === 'left' && "justify-start",
        align === 'center' && "justify-center",
        align === 'right' && "justify-end",
        className
      )}
    >
      {/* Primary visible actions */}
      {primaryActions.map(action => renderActionButton(action))}

      {/* Overflow menu for additional actions */}
      {overflowActions.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size={size}
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
            {overflowActions.map((action, index) => {
              const Icon = action.icon
              const disabled = isActionDisabled(action, row)
              const isDangerous = action.variant === 'destructive'

              return (
                <React.Fragment key={action.id}>
                  {/* Add separator before destructive actions */}
                  {isDangerous && index > 0 && <DropdownMenuSeparator />}

                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      handleActionClick(action, e as unknown as React.MouseEvent)
                    }}
                    disabled={disabled}
                    className={cn(
                      isDangerous && "text-error focus:text-error focus:bg-error/10"
                    )}
                  >
                    {Icon && <Icon className="mr-2 h-4 w-4" />}
                    {action.label}
                  </DropdownMenuItem>
                </React.Fragment>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )

  // Wrap in TooltipProvider if needed
  if (provideTooltip) {
    return <TooltipProvider>{actionsContent}</TooltipProvider>
  }

  return actionsContent
}

export default DataTableActions
