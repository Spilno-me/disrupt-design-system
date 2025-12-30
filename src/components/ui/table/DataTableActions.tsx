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

// ============== CONSTANTS ==============

/** Default number of visible actions before overflow menu */
const DEFAULT_MAX_VISIBLE = 3

/** Icon size class for action buttons */
const ICON_SIZE_CLASS = "h-4 w-4"

/** Icon size class for dropdown menu items */
const MENU_ICON_SIZE_CLASS = "mr-2 h-4 w-4"

/** Data slot identifier for testing */
const DATA_SLOT = "data-table-actions"

// ============== TYPES ==============

/**
 * Action button variant - determines styling
 */
export type ActionVariant = "default" | "destructive" | "ghost" | "accent"

/**
 * Single action item configuration
 */
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

/**
 * Props for DataTableActions component
 */
export interface DataTableActionsProps<T = unknown>
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onClick"> {
  /** Array of action items */
  actions: ActionItem<T>[]
  /** Current row data */
  row: T
  /** User context for permission checks */
  user?: unknown
  /** Maximum number of visible buttons (rest go to overflow menu) */
  maxVisible?: number
  /** Alignment of action buttons */
  align?: "left" | "center" | "right"
  /** Layout mode */
  layout?: "horizontal" | "vertical"
  /** Button size */
  size?: "sm" | "default" | "lg" | "icon"
  /** Show labels on visible buttons (desktop) */
  showLabels?: boolean
  /** Tooltip provider - set to false if already wrapped */
  provideTooltip?: boolean
}

// ============== HELPERS ==============

/**
 * Check if user has required permission
 *
 * @param user - User object containing role/roles/isAdmin
 * @param requires - Required permission(s)
 * @returns True if user has permission
 */
function hasPermission(user: unknown, requires?: string | string[]): boolean {
  if (!requires) return true
  if (!user || typeof user !== "object") return false

  const permissions = Array.isArray(requires) ? requires : [requires]
  const userObj = user as Record<string, unknown>

  // Check user.role
  const userRole = userObj.role
  if (userRole && typeof userRole === "string") {
    if (permissions.some((p) => userRole.toLowerCase() === p.toLowerCase())) {
      return true
    }
  }

  // Check user.roles array
  const userRoles = userObj.roles
  if (Array.isArray(userRoles)) {
    return permissions.some((p) =>
      userRoles.some(
        (r: unknown) => typeof r === "string" && r.toLowerCase() === p.toLowerCase()
      )
    )
  }

  // Check user.isAdmin flag
  if (permissions.includes("admin") && userObj.isAdmin === true) {
    return true
  }

  return false
}

/**
 * Check if action should be shown based on permissions and visibility rules
 *
 * @param action - Action configuration
 * @param row - Current row data
 * @param user - User context
 * @returns True if action should be visible
 */
function shouldShowAction<T>(
  action: ActionItem<T>,
  row: T,
  user?: unknown
): boolean {
  if (action.requires && !hasPermission(user, action.requires)) {
    return false
  }

  if (action.showWhen && !action.showWhen(row, user)) {
    return false
  }

  return true
}

/**
 * Get disabled state for action
 *
 * @param action - Action configuration
 * @param row - Current row data
 * @returns True if action is disabled
 */
function isActionDisabled<T>(action: ActionItem<T>, row: T): boolean {
  if (action.loading) return true
  if (typeof action.disabled === "function") return action.disabled(row)
  return action.disabled ?? false
}

// ============== COMPONENTS ==============

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
 * @component ATOM
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
  maxVisible = DEFAULT_MAX_VISIBLE,
  align = "right",
  layout = "horizontal",
  size = "icon",
  className,
  showLabels = false,
  provideTooltip = true,
  ...props
}: DataTableActionsProps<T>) {
  // Filter actions based on visibility and permissions
  const visibleActions = React.useMemo(
    () => actions.filter((action) => shouldShowAction(action, row, user)),
    [actions, row, user]
  )

  // Split actions into visible buttons and overflow menu items
  const primaryActions = visibleActions.slice(0, maxVisible)
  const overflowActions = visibleActions.slice(maxVisible)

  // Handle action click with optional confirmation
  const handleActionClick = React.useCallback(
    async (action: ActionItem<T>, event: React.MouseEvent) => {
      event.stopPropagation()

      if (action.confirm) {
        const message =
          typeof action.confirm === "string"
            ? action.confirm
            : `Are you sure you want to ${action.label.toLowerCase()}?`

        if (!window.confirm(message)) {
          return
        }
      }

      await action.onClick(row, event)
    },
    [row]
  )

  // Render single action button with optional tooltip
  const renderActionButton = React.useCallback(
    (action: ActionItem<T>, showLabel = showLabels) => {
      const Icon = action.icon
      const disabled = isActionDisabled(action, row)
      const buttonVariant = action.variant || "ghost"

      const button = (
        <Button
          onClick={(e) => handleActionClick(action, e)}
          variant={buttonVariant}
          size={showLabel ? "sm" : size}
          disabled={disabled}
          className={cn(showLabel && "justify-start")}
        >
          {Icon && <Icon className={cn(ICON_SIZE_CLASS, showLabel && "mr-2")} />}
          {showLabel && action.label}
        </Button>
      )

      if (!showLabel && provideTooltip) {
        return (
          <Tooltip key={action.id}>
            <TooltipTrigger asChild>{button}</TooltipTrigger>
            <TooltipContent>{action.label}</TooltipContent>
          </Tooltip>
        )
      }

      return <div key={action.id}>{button}</div>
    },
    [row, size, showLabels, provideTooltip, handleActionClick]
  )

  // Render overflow menu item
  const renderOverflowItem = React.useCallback(
    (action: ActionItem<T>, index: number) => {
      const Icon = action.icon
      const disabled = isActionDisabled(action, row)
      const isDangerous = action.variant === "destructive"

      return (
        <React.Fragment key={action.id}>
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
            {Icon && <Icon className={MENU_ICON_SIZE_CLASS} />}
            {action.label}
          </DropdownMenuItem>
        </React.Fragment>
      )
    },
    [row, handleActionClick]
  )

  // No actions to show
  if (visibleActions.length === 0) {
    return null
  }

  // Build alignment classes
  const alignmentClass = cn(
    align === "left" && "justify-start",
    align === "center" && "justify-center",
    align === "right" && "justify-end"
  )

  // Build layout classes
  const layoutClass = cn(
    layout === "horizontal" ? "gap-1" : "flex-col gap-2 w-full"
  )

  // Render actions content
  const actionsContent = (
    <div
      data-slot={DATA_SLOT}
      className={cn("flex items-center", layoutClass, alignmentClass, className)}
      {...props}
    >
      {primaryActions.map((action) => renderActionButton(action))}

      {overflowActions.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size={size}
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className={ICON_SIZE_CLASS} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
            {overflowActions.map((action, index) => renderOverflowItem(action, index))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )

  if (provideTooltip) {
    return <TooltipProvider>{actionsContent}</TooltipProvider>
  }

  return actionsContent
}

DataTableActions.displayName = "DataTableActions"

export default DataTableActions
