/**
 * AIAssistantFab - Draggable Floating Action Button for AI Assistant
 *
 * Elevated FAB that can be dragged anywhere on the page.
 * Click for quick actions, double-click for chat panel.
 *
 * @example
 * ```tsx
 * <AIAssistantProvider>
 *   <App />
 *   <AIAssistantFab />
 * </AIAssistantProvider>
 * ```
 */

'use client'

import * as React from 'react'
import { useRef, useState, useCallback, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence, useDragControls } from 'motion/react'
import { Minus, GripVertical } from 'lucide-react'
import { cn } from '../../../lib/utils'
import { AgentLogo } from '../AgentLogo/AgentLogo'
import { useAIAssistant } from './AIAssistantProvider'
import { AIAssistantQuickActions } from './AIAssistantQuickActions'
import type { AIAssistantFabProps } from './types'

// =============================================================================
// CONSTANTS
// =============================================================================

const DOUBLE_CLICK_DELAY = 300 // ms
const DRAG_THRESHOLD = 5 // pixels moved before considered a drag

// =============================================================================
// COMPONENT
// =============================================================================

export function AIAssistantFab({ className }: AIAssistantFabProps) {
  const {
    isMinimized,
    isPanelOpen,
    isQuickActionsOpen,
    agentState,
    expandedSize,
    minimizedSize,
    toggleMinimize,
    openPanel,
    toggleQuickActions,
  } = useAIAssistant()

  // Refs
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const clickCount = useRef(0)
  const constraintsRef = useRef<HTMLDivElement>(null)
  const dragStartPos = useRef<{ x: number; y: number } | null>(null)

  // State
  const [isHovered, setIsHovered] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [wasDragged, setWasDragged] = useState(false)

  // Mount state for portal
  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  // Current size based on state
  const currentSize = isMinimized ? minimizedSize : expandedSize

  // =============================================================================
  // CLICK HANDLERS
  // =============================================================================

  const handleClick = useCallback(() => {
    // Ignore click if we just finished dragging
    if (wasDragged) {
      setWasDragged(false)
      return
    }

    // If minimized, expand on click
    if (isMinimized) {
      toggleMinimize()
      return
    }

    clickCount.current++

    if (clickCount.current === 1) {
      // Wait to see if it's a double click
      clickTimer.current = setTimeout(() => {
        if (clickCount.current === 1) {
          // Single click - toggle quick actions
          toggleQuickActions()
        }
        clickCount.current = 0
      }, DOUBLE_CLICK_DELAY)
    } else if (clickCount.current === 2) {
      // Double click - open panel
      if (clickTimer.current) {
        clearTimeout(clickTimer.current)
      }
      openPanel()
      clickCount.current = 0
    }
  }, [isMinimized, toggleMinimize, toggleQuickActions, openPanel, wasDragged])

  // Drag handlers
  const handleDragStart = useCallback((event: MouseEvent | TouchEvent | PointerEvent) => {
    const point = 'touches' in event ? event.touches[0] : event
    dragStartPos.current = { x: point.clientX, y: point.clientY }
    setIsDragging(true)
  }, [])

  const handleDragEnd = useCallback((event: MouseEvent | TouchEvent | PointerEvent) => {
    if (dragStartPos.current) {
      const point = 'changedTouches' in event ? event.changedTouches[0] : event
      const dx = Math.abs(point.clientX - dragStartPos.current.x)
      const dy = Math.abs(point.clientY - dragStartPos.current.y)

      // If moved more than threshold, consider it a drag (prevent click)
      if (dx > DRAG_THRESHOLD || dy > DRAG_THRESHOLD) {
        setWasDragged(true)
      }
    }
    dragStartPos.current = null
    setIsDragging(false)
  }, [])

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (clickTimer.current) {
        clearTimeout(clickTimer.current)
      }
    }
  }, [])

  // =============================================================================
  // RENDER
  // =============================================================================

  const fabContent = (
    <>
      {/* Full-screen drag constraints */}
      <div
        ref={constraintsRef}
        className="fixed inset-0 pointer-events-none z-40"
        style={{ margin: 16 }} // Keep FAB 16px from edges
      />

      {/* Draggable FAB container */}
      <motion.div
        drag
        dragConstraints={constraintsRef}
        dragElastic={0.1}
        dragMomentum={false}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        initial={{ x: 0, y: 0 }}
        className={cn(
          'fixed bottom-6 right-6 z-50',
          isDragging && 'cursor-grabbing',
          !isDragging && 'cursor-grab',
          className
        )}
      >
        {/* Quick Actions Popover */}
        <AnimatePresence>
          {isQuickActionsOpen && !isMinimized && !isDragging && (
            <AIAssistantQuickActions />
          )}
        </AnimatePresence>

        {/* FAB Button */}
        <motion.button
          type="button"
          onClick={handleClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          initial={false}
          animate={{
            width: currentSize,
            height: currentSize,
            borderRadius: isMinimized ? '50%' : 16,
            scale: isDragging ? 1.1 : isHovered ? 1.05 : 1,
          }}
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 30,
          }}
          className={cn(
            // Base styles
            'relative flex items-center justify-center',
            'outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
            // Elevated glass effect
            'bg-white/95 dark:bg-abyss-800/95',
            'backdrop-blur-xl',
            'border-2 border-accent/80',
            // Elevated shadow - more pronounced
            'shadow-[0_8px_32px_rgba(0,0,0,0.12),0_4px_16px_rgba(0,0,0,0.08)]',
            'hover:shadow-[0_12px_40px_rgba(0,0,0,0.16),0_6px_20px_rgba(0,0,0,0.1)]',
            isDragging && 'shadow-[0_16px_48px_rgba(0,0,0,0.2),0_8px_24px_rgba(0,0,0,0.12)]',
            'transition-shadow duration-200'
          )}
          aria-label={
            isMinimized
              ? 'Expand AI Assistant'
              : isPanelOpen
                ? 'AI Assistant (panel open)'
                : 'AI Assistant - Click for actions, double-click for chat, drag to reposition'
          }
          aria-expanded={isQuickActionsOpen || isPanelOpen}
          aria-haspopup="menu"
        >
          {/* AgentLogo - always shows current agentState */}
          <div className="flex items-center justify-center w-full h-full p-1.5">
            <AgentLogo
              state={agentState}
              variant="light"
              className="w-full h-full"
            />
          </div>

          {/* Drag indicator (shown on hover when expanded) */}
          <AnimatePresence>
            {!isMinimized && isHovered && !isDragging && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                className={cn(
                  'absolute -top-1 -left-1',
                  'w-5 h-5 rounded-full',
                  'bg-subtle/80 hover:bg-muted-bg',
                  'border border-default',
                  'flex items-center justify-center',
                  'text-tertiary',
                  'shadow-sm'
                )}
                aria-hidden="true"
              >
                <GripVertical className="w-3 h-3" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Minimize button (shown on hover when expanded) */}
          <AnimatePresence>
            {!isMinimized && isHovered && !isDragging && (
              <motion.button
                type="button"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                onClick={(e) => {
                  e.stopPropagation()
                  toggleMinimize()
                }}
                className={cn(
                  'absolute -top-1 -right-1',
                  'w-5 h-5 rounded-full',
                  'bg-subtle hover:bg-muted-bg',
                  'border border-default',
                  'flex items-center justify-center',
                  'text-secondary hover:text-primary',
                  'transition-colors duration-150',
                  'shadow-sm'
                )}
                aria-label="Minimize AI Assistant"
              >
                <Minus className="w-3 h-3" />
              </motion.button>
            )}
          </AnimatePresence>
        </motion.button>
      </motion.div>
    </>
  )

  // Render via portal to ensure it's above everything
  if (!mounted) return null

  return createPortal(fabContent, document.body)
}

AIAssistantFab.displayName = 'AIAssistantFab'
