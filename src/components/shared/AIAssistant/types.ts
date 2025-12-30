/**
 * AI Assistant Types
 *
 * Type definitions for the floating AI Assistant component.
 */

import type { LogoState } from '../AgentLogo/AgentLogo'

// Re-export LogoState for convenience
export type { LogoState }

// =============================================================================
// PAGE CONTEXT TYPES
// =============================================================================

/**
 * Current page context for the AI Assistant
 * Allows the assistant to understand where the user is and offer relevant help
 */
export interface PageContext {
  /** Unique page identifier (e.g., 'myFlow', 'incidents', 'users') */
  pageId: string
  /** Display name for the page (e.g., 'Dashboard', 'Incidents') */
  pageName: string
  /** Brief description of what the page is for */
  pageDescription?: string
  /** Optional data count to show in context (e.g., "23 incidents") */
  dataCount?: number
  /** Optional entity type for the page (e.g., 'incident', 'user', 'step') */
  entityType?: string
}

/**
 * A contextual quick action that appears based on the current page
 */
export interface ContextualAction {
  /** Unique action identifier */
  id: string
  /** Short label for the action button */
  label: string
  /** Longer description shown as hint */
  description: string
  /** Lucide icon component name (e.g., 'Search', 'FileText') */
  icon: React.ComponentType<{ className?: string }>
  /** Tailwind color class (e.g., 'text-accent', 'text-warning') */
  color: string
  /** Callback when action is clicked */
  onClick?: () => void
}

// =============================================================================
// CONTEXT TYPES
// =============================================================================

export interface AIAssistantContextValue {
  // Visibility State
  isMinimized: boolean
  isPanelOpen: boolean
  isQuickActionsOpen: boolean

  // Agent State (from AgentLogo)
  agentState: LogoState
  setAgentState: (state: LogoState) => void

  // Size
  expandedSize: number
  minimizedSize: number

  // Page Context
  pageContext: PageContext | null
  setPageContext: (context: PageContext | null) => void
  contextualActions: ContextualAction[]
  setContextualActions: (actions: ContextualAction[]) => void

  // Actions
  minimize: () => void
  expand: () => void
  toggleMinimize: () => void
  openPanel: () => void
  closePanel: () => void
  togglePanel: () => void
  openQuickActions: () => void
  closeQuickActions: () => void
  toggleQuickActions: () => void
}

// =============================================================================
// PROVIDER PROPS
// =============================================================================

export interface AIAssistantProviderProps {
  children: React.ReactNode
  /** Size when expanded in pixels (default: 96) */
  expandedSize?: number
  /** Size when minimized in pixels (default: 24) */
  minimizedSize?: number
  /** Callback when Analyze action is clicked */
  onAnalyze?: () => void
  /** Callback when Suggest action is clicked */
  onSuggest?: () => void
  /** Callback when Help action is clicked */
  onHelp?: () => void
  // Storybook-friendly props for demos
  /** Initial agent state (default: 'idle') - for Storybook demos */
  defaultState?: LogoState
  /** Start minimized (default: false) - for Storybook demos */
  defaultMinimized?: boolean
  /** Start with panel open (default: false) - for Storybook demos */
  defaultPanelOpen?: boolean
  /** Start with quick actions open (default: false) - for Storybook demos */
  defaultQuickActionsOpen?: boolean
}

// =============================================================================
// COMPONENT PROPS
// =============================================================================

export interface AIAssistantFabProps {
  className?: string
}

export interface AIAssistantQuickActionsProps {
  className?: string
  // Note: Actions are now set via context using setContextualActions()
  // This allows dynamic, page-specific actions
}

export interface AIAssistantPanelProps {
  className?: string
  /** Custom content for the panel */
  children?: React.ReactNode
}
