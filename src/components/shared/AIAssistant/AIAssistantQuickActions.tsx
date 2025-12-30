/**
 * AIAssistantQuickActions - Context-aware quick actions popover menu
 *
 * Displays contextual quick actions above the FAB based on the current page.
 * Actions change dynamically when the user navigates between pages.
 * Appears on single click, dismisses on click outside or action selection.
 *
 * @example
 * ```tsx
 * // Actions are set via context, not props
 * <AIAssistantQuickActions />
 * ```
 */

'use client'

import * as React from 'react'
import { useRef, useEffect, useCallback } from 'react'
import { motion } from 'motion/react'
import { Sparkles, Lightbulb, HelpCircle } from 'lucide-react'
import { cn } from '../../../lib/utils'
import { useAIAssistant } from './AIAssistantProvider'
import type { AIAssistantQuickActionsProps, ContextualAction } from './types'

// =============================================================================
// DEFAULT FALLBACK ACTIONS
// =============================================================================

const defaultActions: ContextualAction[] = [
  {
    id: 'analyze',
    label: 'Analyze',
    description: 'Analyze current context',
    icon: Sparkles,
    color: 'text-accent',
  },
  {
    id: 'suggest',
    label: 'Suggest',
    description: 'Get recommendations',
    icon: Lightbulb,
    color: 'text-warning',
  },
  {
    id: 'help',
    label: 'Help',
    description: 'Get assistance',
    icon: HelpCircle,
    color: 'text-info',
  },
]

// =============================================================================
// COMPONENT
// =============================================================================

export function AIAssistantQuickActions({
  className,
}: AIAssistantQuickActionsProps) {
  const {
    closeQuickActions,
    setAgentState,
    expandedSize,
    pageContext,
    contextualActions,
  } = useAIAssistant()
  const menuRef = useRef<HTMLDivElement>(null)

  // Use contextual actions if available, otherwise fall back to defaults
  const actionsToShow = contextualActions.length > 0 ? contextualActions : defaultActions

  // Handle action click
  const handleAction = useCallback(
    (action: ContextualAction) => {
      // Show thinking state briefly
      setAgentState('thinking')

      // Execute the action callback if provided
      action.onClick?.()

      // Close menu after action
      closeQuickActions()

      // Reset to idle after a delay
      setTimeout(() => setAgentState('idle'), 1500)
    },
    [closeQuickActions, setAgentState]
  )

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        // Check if click is on the FAB itself (parent handles that)
        const fabButton = document.querySelector('[aria-label*="AI Assistant"]')
        if (fabButton && fabButton.contains(event.target as Node)) {
          return
        }
        closeQuickActions()
      }
    }

    // Delay adding listener to prevent immediate close
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside)
    }, 100)

    return () => {
      clearTimeout(timer)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [closeQuickActions])

  // Close on escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeQuickActions()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [closeQuickActions])

  return (
    <motion.div
      ref={menuRef}
      role="menu"
      aria-label="AI Assistant quick actions"
      aria-orientation="vertical"
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 10 }}
      transition={{
        type: 'spring',
        stiffness: 500,
        damping: 30,
      }}
      className={cn(
        // Positioning - above the FAB, right-aligned to prevent screen cutoff
        'absolute bottom-full mb-3 right-0',
        // Base styles
        'min-w-[220px]',
        'bg-elevated',
        'rounded-xl',
        'border border-default',
        'shadow-xl',
        'overflow-hidden',
        className
      )}
      style={{
        // Position relative to FAB size
        marginBottom: 12,
      }}
    >
      {/* Header - Shows page context when available */}
      <div className="px-3 py-2 border-b border-subtle bg-surface/50">
        {pageContext ? (
          <div className="space-y-0.5">
            <p className="text-xs font-medium text-primary">{pageContext.pageName}</p>
            {pageContext.pageDescription && (
              <p className="text-[10px] text-tertiary">{pageContext.pageDescription}</p>
            )}
          </div>
        ) : (
          <p className="text-xs font-medium text-secondary">Quick Actions</p>
        )}
      </div>

      {/* Actions - Context-aware based on current page */}
      <div className="p-1">
        {actionsToShow.map((action, index) => {
          const Icon = action.icon
          return (
            <motion.button
              key={action.id}
              type="button"
              role="menuitem"
              onClick={() => handleAction(action)}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5',
                'rounded-lg',
                'text-left',
                'hover:bg-surface-hover',
                'focus-visible:outline-none focus-visible:bg-surface-hover',
                'transition-colors duration-150',
                'group'
              )}
            >
              <div
                className={cn(
                  'flex-shrink-0 w-8 h-8 rounded-lg',
                  'flex items-center justify-center',
                  'bg-subtle group-hover:bg-muted-bg',
                  'transition-colors duration-150'
                )}
              >
                <Icon className={cn('w-4 h-4', action.color)} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-primary">{action.label}</p>
                <p className="text-xs text-tertiary truncate">{action.description}</p>
              </div>
            </motion.button>
          )
        })}
      </div>

      {/* Footer hint */}
      <div className="px-3 py-2 border-t border-subtle bg-surface/30">
        <p className="text-[10px] text-tertiary text-center">
          Double-click FAB for full chat
        </p>
      </div>
    </motion.div>
  )
}

AIAssistantQuickActions.displayName = 'AIAssistantQuickActions'
