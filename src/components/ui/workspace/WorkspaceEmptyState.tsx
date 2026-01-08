/**
 * WorkspaceEmptyState - Empty state for workspace with call-to-action
 */

import * as React from 'react'
import { FolderPlus } from 'lucide-react'
import { cn } from '../../../lib/utils'
import { Button } from '../button'

// =============================================================================
// TYPES
// =============================================================================

export interface WorkspaceEmptyStateProps {
  /** Callback when user clicks create folder */
  onCreateFolder: () => void
  /** Additional class names */
  className?: string
}

// =============================================================================
// COMPONENT
// =============================================================================

export function WorkspaceEmptyState({
  onCreateFolder,
  className,
}: WorkspaceEmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-8 px-4 text-center',
        className
      )}
      data-testid="workspace-empty"
    >
      <div className="size-10 rounded-lg bg-muted-bg flex items-center justify-center mb-3">
        <FolderPlus className="size-5 text-muted" />
      </div>
      <p className="text-sm text-primary font-medium mb-1">
        Organize your workspace
      </p>
      <p className="text-xs text-muted mb-4 max-w-[180px]">
        Create folders to organize your favorite pages and quick links.
      </p>
      <Button
        variant="outline"
        size="sm"
        onClick={onCreateFolder}
        className="text-xs"
        data-testid="workspace-empty-create"
      >
        <FolderPlus className="size-3.5 mr-1.5" />
        Create Folder
      </Button>
    </div>
  )
}

WorkspaceEmptyState.displayName = 'WorkspaceEmptyState'

export default WorkspaceEmptyState
