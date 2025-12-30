/**
 * AIAssistantPanel - Slide-out chat panel
 *
 * Full-featured chat panel that slides in from the right.
 * Opens on double-click of the FAB.
 *
 * @example
 * ```tsx
 * <AIAssistantProvider>
 *   <App />
 *   <AIAssistantFab />
 *   <AIAssistantPanel />
 * </AIAssistantProvider>
 * ```
 */

'use client'

import * as React from 'react'
import { useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'motion/react'
import { X, Sparkles, Send, Maximize2, Minimize2 } from 'lucide-react'
import { cn } from '../../../lib/utils'
import { AgentLogo } from '../AgentLogo/AgentLogo'
import { useAIAssistant } from './AIAssistantProvider'
import type { AIAssistantPanelProps } from './types'

// =============================================================================
// COMPONENT
// =============================================================================

export function AIAssistantPanel({ className, children }: AIAssistantPanelProps) {
  const { isPanelOpen, closePanel, agentState, setAgentState } = useAIAssistant()
  const panelRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [mounted, setMounted] = React.useState(false)
  const [isFullscreen, setIsFullscreen] = React.useState(false)

  // Reset fullscreen when panel closes
  useEffect(() => {
    if (!isPanelOpen) {
      setIsFullscreen(false)
    }
  }, [isPanelOpen])

  // Mount state for portal
  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  // Focus input when panel opens
  useEffect(() => {
    if (isPanelOpen && inputRef.current) {
      // Small delay to let animation start
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isPanelOpen])

  // Close on escape
  useEffect(() => {
    if (!isPanelOpen) return

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closePanel()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isPanelOpen, closePanel])

  // Trap focus within panel
  useEffect(() => {
    if (!isPanelOpen || !panelRef.current) return

    const panel = panelRef.current
    const focusableElements = panel.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstFocusable = focusableElements[0]
    const lastFocusable = focusableElements[focusableElements.length - 1]

    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return

      if (event.shiftKey) {
        if (document.activeElement === firstFocusable) {
          event.preventDefault()
          lastFocusable?.focus()
        }
      } else {
        if (document.activeElement === lastFocusable) {
          event.preventDefault()
          firstFocusable?.focus()
        }
      }
    }

    document.addEventListener('keydown', handleTabKey)
    return () => document.removeEventListener('keydown', handleTabKey)
  }, [isPanelOpen])

  const panelContent = (
    <AnimatePresence>
      {isPanelOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[9999] bg-black/20 backdrop-blur-sm"
            onClick={closePanel}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="AI Assistant Chat"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 30,
            }}
            className={cn(
              'fixed z-[10000]',
              'bg-elevated',
              'shadow-2xl',
              'flex flex-col',
              isFullscreen
                ? 'inset-0 border-0'
                : 'right-0 top-0 h-full w-full sm:w-96 max-w-full border-l border-default',
              className
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-default bg-surface/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8">
                  <AgentLogo state={agentState} variant="light" className="w-full h-full" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-primary">AI Assistant</h2>
                  <p className="text-xs text-secondary">
                    {agentState === 'idle' && 'Ready to help'}
                    {agentState === 'listening' && 'Listening...'}
                    {agentState === 'thinking' && 'Thinking...'}
                    {agentState === 'planning' && 'Planning...'}
                    {agentState === 'executing' && 'Working...'}
                    {agentState === 'complete' && 'Done!'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className={cn(
                    'p-2 rounded-lg',
                    'text-secondary hover:text-primary',
                    'hover:bg-subtle',
                    'transition-colors duration-150',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent'
                  )}
                  aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                >
                  {isFullscreen ? (
                    <Minimize2 className="w-4 h-4" />
                  ) : (
                    <Maximize2 className="w-4 h-4" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={closePanel}
                  className={cn(
                    'p-2 rounded-lg',
                    'text-secondary hover:text-primary',
                    'hover:bg-subtle',
                    'transition-colors duration-150',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent'
                  )}
                  aria-label="Close AI Assistant"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-4">
              {children || (
                /* Placeholder content */
                <div className="h-full flex flex-col items-center justify-center text-center px-6">
                  <div className="w-20 h-20 mb-6 opacity-50">
                    <AgentLogo state="idle" variant="light" className="w-full h-full" />
                  </div>
                  <h3 className="text-lg font-semibold text-primary mb-2">
                    How can I help?
                  </h3>
                  <p className="text-sm text-secondary mb-6 max-w-xs">
                    I can analyze incidents, suggest actions, provide recommendations, and help with EHS workflows.
                  </p>

                  {/* Suggested prompts */}
                  <div className="w-full space-y-2">
                    {[
                      'Analyze this incident',
                      'Suggest corrective actions',
                      'Find similar incidents',
                    ].map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        onClick={() => {
                          setAgentState('thinking')
                          setTimeout(() => setAgentState('idle'), 2000)
                        }}
                        className={cn(
                          'w-full px-4 py-3 rounded-xl',
                          'text-sm text-left',
                          'bg-surface hover:bg-surface-hover',
                          'border border-default',
                          'transition-colors duration-150',
                          'flex items-center gap-3',
                          'group'
                        )}
                      >
                        <Sparkles className="w-4 h-4 text-accent group-hover:scale-110 transition-transform" />
                        <span className="text-primary">{prompt}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="border-t border-default p-4 bg-surface/30">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Ask me anything..."
                    className={cn(
                      'w-full px-4 py-3 pr-12',
                      'rounded-xl',
                      'bg-surface',
                      'border border-default',
                      'text-sm text-primary placeholder:text-tertiary',
                      'focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent',
                      'transition-all duration-200'
                    )}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        setAgentState('thinking')
                        setTimeout(() => setAgentState('idle'), 2000)
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setAgentState('thinking')
                      setTimeout(() => setAgentState('idle'), 2000)
                    }}
                    className={cn(
                      'absolute right-2 top-1/2 -translate-y-1/2',
                      'p-2 rounded-lg',
                      'text-accent hover:bg-accent/10',
                      'transition-colors duration-150'
                    )}
                    aria-label="Send message"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="mt-2 text-[10px] text-tertiary text-center">
                Press Enter to send • AI responses are for guidance only
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )

  if (!mounted) return null

  return createPortal(panelContent, document.body)
}

AIAssistantPanel.displayName = 'AIAssistantPanel'
