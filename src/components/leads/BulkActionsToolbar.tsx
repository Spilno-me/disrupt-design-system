import * as React from 'react'
import { useCallback, useState } from 'react'
import { Trash2, UserPlus, RefreshCw, Download, X, CheckSquare, MoreHorizontal } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Button } from '../ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import type { LeadStatus } from './LeadCard'

// =============================================================================
// TYPES
// =============================================================================

export type BulkAction = 'assign' | 'delete' | 'export' | 'update_status' | 'recalculate_score'

export interface BulkActionsToolbarProps {
  /** Number of selected items */
  selectedCount: number
  /** Total number of items */
  totalCount: number
  /** Callback when an action is triggered */
  onAction: (action: BulkAction, data?: Record<string, unknown>) => void | Promise<void>
  /** Callback to clear selection */
  onClearSelection: () => void
  /** Callback to select all */
  onSelectAll?: () => void
  /** Available statuses for status update */
  availableStatuses?: LeadStatus[]
  /** Available partners for assignment */
  availablePartners?: Array<{ id: string; name: string }>
  /** Show loading state */
  loading?: boolean
  /** Disabled actions */
  disabledActions?: BulkAction[]
  /** Additional className */
  className?: string
}

// =============================================================================
// BULK ACTIONS TOOLBAR COMPONENT
// =============================================================================

/**
 * BulkActionsToolbar - Toolbar for bulk operations on selected leads
 *
 * Appears when items are selected. Provides actions like assign, delete,
 * export, status update, and score recalculation.
 *
 * @example
 * <BulkActionsToolbar
 *   selectedCount={5}
 *   totalCount={100}
 *   onAction={(action) => handleBulkAction(action)}
 *   onClearSelection={() => setSelected([])}
 *   onSelectAll={() => setSelected(allIds)}
 * />
 */
export function BulkActionsToolbar({
  selectedCount,
  totalCount,
  onAction,
  onClearSelection,
  onSelectAll,
  availableStatuses = ['new', 'in_progress', 'converted', 'lost'],
  availablePartners = [],
  loading = false,
  disabledActions = [],
  className,
}: BulkActionsToolbarProps) {
  const [activeAction, setActiveAction] = useState<BulkAction | null>(null)

  const handleAction = useCallback(async (action: BulkAction, data?: Record<string, unknown>) => {
    if (disabledActions.includes(action)) return
    setActiveAction(action)
    try {
      await onAction(action, data)
    } finally {
      setActiveAction(null)
    }
  }, [onAction, disabledActions])

  const isDisabled = (action: BulkAction) => loading || disabledActions.includes(action)
  const isLoading = (action: BulkAction) => activeAction === action

  if (selectedCount === 0) return null

  return (
    <div
      className={cn(
        // Layout
        'inline-flex items-center gap-4 px-4 py-3 rounded-lg w-fit',
        // Glass effect - Depth 2 (Card level) for contextual floating toolbar
        'bg-white/40 dark:bg-black/40 backdrop-blur-[4px]',
        // Border + Shadow for elevation
        'border-2 border-accent shadow-md',
        className
      )}
      role="toolbar"
      aria-label="Bulk actions"
    >
      {/* Selection info */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <CheckSquare className="w-5 h-5 text-accent" />
          <span className="text-sm font-medium text-primary whitespace-nowrap">
            {selectedCount} of {totalCount} selected
          </span>
        </div>

        {onSelectAll && selectedCount < totalCount && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onSelectAll}
            className="text-accent hover:text-accent"
          >
            Select all {totalCount}
          </Button>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={onClearSelection}
          className="text-muted hover:text-primary"
        >
          <X className="w-4 h-4 mr-1" />
          Clear
        </Button>
      </div>

      {/* Actions - 3 visible max per Hick's Law, rest in overflow */}
      <div className="flex items-center gap-2">
        {/* Update Status - Primary action */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              disabled={isDisabled('update_status')}
            >
              <RefreshCw className={cn('w-4 h-4 mr-2', isLoading('update_status') && 'animate-spin')} />
              Update Status
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {availableStatuses.map((status) => (
              <DropdownMenuItem
                key={status}
                onClick={() => handleAction('update_status', { status })}
              >
                {formatStatus(status)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Export - Primary action */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleAction('export')}
          disabled={isDisabled('export')}
        >
          <Download className={cn('w-4 h-4 mr-2', isLoading('export') && 'animate-spin')} />
          Export
        </Button>

        {/* More Actions - Overflow menu for secondary actions */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
            >
              <MoreHorizontal className="w-4 h-4 mr-2" />
              More
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {/* Recalculate Score */}
            <DropdownMenuItem
              onClick={() => handleAction('recalculate_score')}
              disabled={isDisabled('recalculate_score')}
            >
              <RefreshCw className={cn('w-4 h-4 mr-2', isLoading('recalculate_score') && 'animate-spin')} />
              Recalculate Score
            </DropdownMenuItem>
            {/* Assign to Partner */}
            {availablePartners.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <div className="px-2 py-1.5 text-xs font-medium text-muted">Assign to Partner</div>
                {availablePartners.map((partner) => (
                  <DropdownMenuItem
                    key={partner.id}
                    onClick={() => handleAction('assign', { partnerId: partner.id })}
                    disabled={isDisabled('assign')}
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    {partner.name}
                  </DropdownMenuItem>
                ))}
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Visual separator */}
        <div className="mx-1 h-6 w-px bg-border-default" aria-hidden="true" />

        {/* Delete - Destructive action, always visible */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleAction('delete')}
          disabled={isDisabled('delete')}
          className="text-error hover:text-error hover:bg-error-light border-error/50"
        >
          <Trash2 className={cn('w-4 h-4 mr-2', isLoading('delete') && 'animate-spin')} />
          Delete
        </Button>
      </div>
    </div>
  )
}

// =============================================================================
// HELPERS
// =============================================================================

function formatStatus(status: LeadStatus): string {
  const labels: Record<LeadStatus, string> = {
    new: 'New',
    in_progress: 'In Progress',
    converted: 'Converted',
    lost: 'Lost',
  }
  return labels[status] || status
}

export default BulkActionsToolbar
