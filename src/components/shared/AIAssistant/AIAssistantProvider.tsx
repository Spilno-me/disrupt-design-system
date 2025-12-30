/**
 * AIAssistantProvider - Global context provider for AI Assistant state
 *
 * Manages visibility and agent state for the floating AI Assistant.
 * Wrap your app or layout with this provider to enable the assistant.
 *
 * @example
 * ```tsx
 * <AIAssistantProvider
 *   onAnalyze={() => handleAnalyze()}
 *   onSuggest={() => handleSuggest()}
 *   onHelp={() => handleHelp()}
 * >
 *   <App />
 *   <AIAssistantFab />
 * </AIAssistantProvider>
 * ```
 */

'use client'

import * as React from 'react'
import { createContext, useContext, useState, useCallback, useMemo } from 'react'
import type { AIAssistantContextValue, AIAssistantProviderProps, PageContext, ContextualAction } from './types'
import type { LogoState } from '../AgentLogo/AgentLogo'

// =============================================================================
// CONTEXT
// =============================================================================

const AIAssistantContext = createContext<AIAssistantContextValue | null>(null)

// =============================================================================
// HOOK
// =============================================================================

/**
 * Hook to access AI Assistant context
 * Must be used within AIAssistantProvider
 */
export function useAIAssistant(): AIAssistantContextValue {
  const context = useContext(AIAssistantContext)
  if (!context) {
    throw new Error('useAIAssistant must be used within AIAssistantProvider')
  }
  return context
}

// =============================================================================
// PROVIDER
// =============================================================================

const DEFAULT_EXPANDED_SIZE = 56 // Compact FAB size
const DEFAULT_MINIMIZED_SIZE = 32 // Tiny dot when minimized

export function AIAssistantProvider({
  children,
  expandedSize = DEFAULT_EXPANDED_SIZE,
  minimizedSize = DEFAULT_MINIMIZED_SIZE,
  // Storybook-friendly defaults
  defaultState = 'idle',
  defaultMinimized = false,
  defaultPanelOpen = false,
  defaultQuickActionsOpen = false,
}: AIAssistantProviderProps) {
  // Visibility states
  const [isMinimized, setIsMinimized] = useState(defaultMinimized)
  const [isPanelOpen, setIsPanelOpen] = useState(defaultPanelOpen)
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(defaultQuickActionsOpen)

  // Agent animation state
  const [agentState, setAgentState] = useState<LogoState>(defaultState)

  // Page context - allows assistant to know what page user is on
  const [pageContext, setPageContext] = useState<PageContext | null>(null)
  const [contextualActions, setContextualActions] = useState<ContextualAction[]>([])

  // =============================================================================
  // ACTIONS
  // =============================================================================

  const minimize = useCallback(() => {
    setIsMinimized(true)
    setIsQuickActionsOpen(false)
  }, [])

  const expand = useCallback(() => {
    setIsMinimized(false)
  }, [])

  const toggleMinimize = useCallback(() => {
    setIsMinimized((prev) => {
      if (!prev) {
        // Closing quick actions when minimizing
        setIsQuickActionsOpen(false)
      }
      return !prev
    })
  }, [])

  const openPanel = useCallback(() => {
    setIsPanelOpen(true)
    setIsQuickActionsOpen(false)
    setAgentState('listening')
  }, [])

  const closePanel = useCallback(() => {
    setIsPanelOpen(false)
    setAgentState('idle')
  }, [])

  const togglePanel = useCallback(() => {
    setIsPanelOpen((prev) => {
      if (!prev) {
        setIsQuickActionsOpen(false)
        setAgentState('listening')
      } else {
        setAgentState('idle')
      }
      return !prev
    })
  }, [])

  const openQuickActions = useCallback(() => {
    if (!isMinimized) {
      setIsQuickActionsOpen(true)
    }
  }, [isMinimized])

  const closeQuickActions = useCallback(() => {
    setIsQuickActionsOpen(false)
  }, [])

  const toggleQuickActions = useCallback(() => {
    if (!isMinimized) {
      setIsQuickActionsOpen((prev) => !prev)
    }
  }, [isMinimized])

  // =============================================================================
  // CONTEXT VALUE
  // =============================================================================

  const value = useMemo<AIAssistantContextValue>(
    () => ({
      // State
      isMinimized,
      isPanelOpen,
      isQuickActionsOpen,
      agentState,
      setAgentState,
      expandedSize,
      minimizedSize,

      // Page Context
      pageContext,
      setPageContext,
      contextualActions,
      setContextualActions,

      // Actions
      minimize,
      expand,
      toggleMinimize,
      openPanel,
      closePanel,
      togglePanel,
      openQuickActions,
      closeQuickActions,
      toggleQuickActions,
    }),
    [
      isMinimized,
      isPanelOpen,
      isQuickActionsOpen,
      agentState,
      expandedSize,
      minimizedSize,
      pageContext,
      contextualActions,
      minimize,
      expand,
      toggleMinimize,
      openPanel,
      closePanel,
      togglePanel,
      openQuickActions,
      closeQuickActions,
      toggleQuickActions,
    ]
  )

  return (
    <AIAssistantContext.Provider value={value}>
      {children}
    </AIAssistantContext.Provider>
  )
}

AIAssistantProvider.displayName = 'AIAssistantProvider'
