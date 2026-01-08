/**
 * Workspace Navigation Components
 *
 * Personal workspace for organizing navigation with nested folders.
 * Supports drag-drop reordering, color-coded folders, and keyboard navigation.
 */

// Types
export type {
  WorkspaceNode,
  WorkspaceFolder,
  WorkspaceItem,
  FolderColor,
  SyncStatus,
  PendingOperation,
  Product,
  WorkspaceSnapshot,
  CreateFolderPayload,
  CreateItemPayload,
  UpdateNodePayload,
  MoveNodePayload,
} from './types'

export { FOLDER_COLORS, isFolder, isItem } from './types'

// Constants
export {
  MAX_DEPTH,
  MAX_CHILDREN_PER_FOLDER,
  MAX_TOTAL_NODES,
  MAX_HISTORY_SIZE,
  FOLDER_COLOR_MAP,
  BASE_INDENT_PX,
  INDENT_PER_LEVEL_PX,
  getIndentPx,
  DOUBLE_CLICK_THRESHOLD_MS,
  DRAG_EXPAND_DELAY_MS,
  UNDO_TOAST_DURATION_MS,
  RETRY_DELAYS_MS,
  ARIA_ANNOUNCE_DELAY_MS,
  KEYBOARD_SHORTCUTS,
} from './constants'

// Store
export {
  useWorkspaceStore,
  getWorkspaceState,
  getWorkspaceActions,
} from './store/workspace.store'
export type {
  WorkspaceState,
  WorkspaceActions,
  WorkspaceStore,
} from './store/workspace.store'

// Hooks
export {
  useWorkspaceTree,
  flattenTree,
  getVisibleNodeIds,
} from './hooks/useWorkspaceTree'
export type { TreeNode, UseWorkspaceTreeResult } from './hooks/useWorkspaceTree'

export { useWorkspaceKeyboard } from './hooks/useWorkspaceKeyboard'
export type { UseWorkspaceKeyboardOptions } from './hooks/useWorkspaceKeyboard'

export { useWorkspaceSync } from './hooks/useWorkspaceSync'
export type {
  UseWorkspaceSyncOptions,
  UseWorkspaceSyncReturn,
} from './hooks/useWorkspaceSync'

// Components
export { WorkspaceSection } from './WorkspaceSection'
export type { WorkspaceSectionProps } from './WorkspaceSection'

export { WorkspaceTree } from './WorkspaceTree'
export type { WorkspaceTreeProps } from './WorkspaceTree'

export { WorkspaceNode as WorkspaceNodeComponent } from './WorkspaceNode'
export type { WorkspaceNodeProps } from './WorkspaceNode'

export { WorkspaceNodeContent } from './WorkspaceNodeContent'
export type { WorkspaceNodeContentProps } from './WorkspaceNodeContent'

export { WorkspaceEmptyState } from './WorkspaceEmptyState'
export type { WorkspaceEmptyStateProps } from './WorkspaceEmptyState'

export { FolderIcon } from './FolderIcon'
export type { FolderIconProps } from './FolderIcon'

export { FolderColorPicker } from './FolderColorPicker'
export type { FolderColorPickerProps } from './FolderColorPicker'

export { InlineRenameInput } from './InlineRenameInput'
export type { InlineRenameInputProps } from './InlineRenameInput'

export { WorkspaceOverflowMenu } from './WorkspaceOverflowMenu'
export type { WorkspaceOverflowMenuProps } from './WorkspaceOverflowMenu'
