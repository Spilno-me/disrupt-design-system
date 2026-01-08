/**
 * WorkspaceSection - Container for personal workspace navigation
 *
 * Renders as a separate zone within AppSidebar with its own header.
 * Manages workspace tree, empty state, and loading states.
 */

import * as React from 'react'
import { Plus, ChevronDown, ChevronRight, Loader2 } from 'lucide-react'
import { cn } from '../../../lib/utils'
import { Button } from '../button'
import { useWorkspaceStore } from './store/workspace.store'
import { useWorkspaceTree } from './hooks/useWorkspaceTree'
import { WorkspaceTree } from './WorkspaceTree'
import { WorkspaceEmptyState } from './WorkspaceEmptyState'
import { WORKSPACE_MAX_HEIGHT } from './constants'
import type { Product } from './types'

// =============================================================================
// TYPES
// =============================================================================

export interface WorkspaceSectionProps {
  /** Product context for routing */
  product: Product
  /** Whether sidebar is collapsed */
  isCollapsed?: boolean
  /** Custom header label */
  headerLabel?: string
  /** Additional class names */
  className?: string
}

// =============================================================================
// COMPONENT
// =============================================================================

export function WorkspaceSection({
  product,
  isCollapsed = false,
  headerLabel = 'My Workspace',
  className,
}: WorkspaceSectionProps) {
  const [isExpanded, setIsExpanded] = React.useState(true)

  // Store state
  const nodes = useWorkspaceStore((s) => s.nodes)
  const rootIds = useWorkspaceStore((s) => s.rootIds)
  const syncStatus = useWorkspaceStore((s) => s.syncStatus)
  const createFolder = useWorkspaceStore((s) => s.createFolder)

  // Build tree
  const { tree, totalCount } = useWorkspaceTree({ nodes, rootIds })

  // Handlers
  const handleCreateFolder = React.useCallback(() => {
    createFolder(null, 'New Folder')
  }, [createFolder])

  const handleToggleSection = React.useCallback(() => {
    setIsExpanded((prev) => !prev)
  }, [])

  // Hide in collapsed sidebar mode
  if (isCollapsed) {
    return null
  }

  const isLoading = syncStatus === 'syncing'
  const isEmpty = totalCount === 0

  return (
    <div
      className={cn('flex flex-col border-t border-default', className)}
      role="region"
      aria-label={headerLabel}
      data-testid="workspace-section"
    >
      {/* Section Header */}
      <div className="flex items-center justify-between px-3 py-2">
        <button
          type="button"
          className={cn(
            'flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide',
            'text-muted hover:text-primary transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 rounded'
          )}
          onClick={handleToggleSection}
          aria-expanded={isExpanded}
          aria-controls="workspace-content"
          data-testid="workspace-section-toggle"
        >
          {isExpanded ? (
            <ChevronDown className="size-3" />
          ) : (
            <ChevronRight className="size-3" />
          )}
          <span>{headerLabel}</span>
          {totalCount > 0 && (
            <span className="text-muted/60">({totalCount})</span>
          )}
        </button>

        <div className="flex items-center gap-1">
          {isLoading && (
            <Loader2
              className="size-3.5 text-muted animate-spin"
              data-testid="workspace-section-loader"
            />
          )}
          <Button
            variant="ghost"
            size="icon"
            className="size-6"
            onClick={handleCreateFolder}
            aria-label="Create new folder"
            data-testid="workspace-section-create"
          >
            <Plus className="size-3.5" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div
        id="workspace-content"
        className={cn(
          'overflow-y-auto overflow-x-hidden',
          !isExpanded && 'hidden'
        )}
        style={{ maxHeight: WORKSPACE_MAX_HEIGHT }}
        data-testid="workspace-section-content"
      >
        {isEmpty ? (
          <WorkspaceEmptyState onCreateFolder={handleCreateFolder} />
        ) : (
          <WorkspaceTree tree={tree} product={product} />
        )}
      </div>

      {/* ARIA Live Region for announcements */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {/* Announcements will be injected here */}
      </div>
    </div>
  )
}

WorkspaceSection.displayName = 'WorkspaceSection'

export default WorkspaceSection
