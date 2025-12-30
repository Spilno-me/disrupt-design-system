/**
 * ResizablePanels - Lightweight resizable panel layout
 *
 * A simple implementation for horizontal/vertical resizable panels with drag handle.
 * No external dependencies required.
 *
 * @example
 * ```tsx
 * <ResizablePanelGroup direction="horizontal">
 *   <ResizablePanel defaultSize={70} minSize={30}>
 *     <div>Main content</div>
 *   </ResizablePanel>
 *   <ResizableHandle />
 *   <ResizablePanel defaultSize={30} minSize={20}>
 *     <div>Side panel</div>
 *   </ResizablePanel>
 * </ResizablePanelGroup>
 * ```
 */

import * as React from 'react'
import { GripVertical } from 'lucide-react'
import { cn } from '../../lib/utils'

// =============================================================================
// TYPES
// =============================================================================

interface PanelConfig {
  minSize: number
  maxSize: number
}

interface PanelGroupContextValue {
  groupId: string
  direction: 'horizontal' | 'vertical'
  registerPanel: (panelId: string, defaultSize: number, config: PanelConfig) => number
  unregisterPanel: (panelId: string) => void
  getPanelSize: (index: number, defaultSize: number) => number
  registerHandle: (handleId: string) => number
  unregisterHandle: (handleId: string) => void
  onResizeStart: (handleIndex: number, e: React.MouseEvent) => void
}

const PanelGroupContext = React.createContext<PanelGroupContextValue | null>(null)

function usePanelGroup() {
  const context = React.useContext(PanelGroupContext)
  if (!context) {
    throw new Error('Panel components must be used within ResizablePanelGroup')
  }
  return context
}

// =============================================================================
// PANEL GROUP
// =============================================================================

interface ResizablePanelGroupProps {
  children: React.ReactNode
  direction?: 'horizontal' | 'vertical'
  className?: string
  onLayout?: (sizes: number[]) => void
}

export function ResizablePanelGroup({
  children,
  direction = 'horizontal',
  className,
  onLayout,
}: ResizablePanelGroupProps) {
  // Unique ID for this group instance
  const groupIdRef = React.useRef(`group-${Math.random().toString(36).slice(2, 9)}`)
  const containerRef = React.useRef<HTMLDivElement>(null)

  // Panel tracking - ordered by registration
  const panelOrderRef = React.useRef<string[]>([])
  const panelConfigsRef = React.useRef<Map<string, { defaultSize: number; config: PanelConfig }>>(new Map())

  // Handle tracking - ordered by registration
  const handleOrderRef = React.useRef<string[]>([])

  // Panel sizes state
  const [panelSizes, setPanelSizes] = React.useState<number[]>([])

  // Resize state in ref to avoid stale closures
  const resizeStateRef = React.useRef<{
    handleIndex: number
    startX: number
    startY: number
    startSizes: number[]
  } | null>(null)

  // Register a panel
  const registerPanel = React.useCallback((panelId: string, defaultSize: number, config: PanelConfig): number => {
    const existingIndex = panelOrderRef.current.indexOf(panelId)
    if (existingIndex !== -1) {
      return existingIndex
    }

    const index = panelOrderRef.current.length
    panelOrderRef.current.push(panelId)
    panelConfigsRef.current.set(panelId, { defaultSize, config })

    setPanelSizes(prev => {
      const next = [...prev]
      next[index] = defaultSize
      return next
    })

    return index
  }, [])

  // Unregister a panel
  const unregisterPanel = React.useCallback((panelId: string) => {
    const index = panelOrderRef.current.indexOf(panelId)
    if (index !== -1) {
      panelOrderRef.current.splice(index, 1)
      panelConfigsRef.current.delete(panelId)
    }
  }, [])

  // Get panel size
  const getPanelSize = React.useCallback((index: number, defaultSize: number): number => {
    return panelSizes[index] ?? defaultSize
  }, [panelSizes])

  // Register a handle
  const registerHandle = React.useCallback((handleId: string): number => {
    const existingIndex = handleOrderRef.current.indexOf(handleId)
    if (existingIndex !== -1) {
      return existingIndex
    }

    const index = handleOrderRef.current.length
    handleOrderRef.current.push(handleId)
    return index
  }, [])

  // Unregister a handle
  const unregisterHandle = React.useCallback((handleId: string) => {
    const index = handleOrderRef.current.indexOf(handleId)
    if (index !== -1) {
      handleOrderRef.current.splice(index, 1)
    }
  }, [])

  // Handle resize start
  const onResizeStart = React.useCallback((handleIndex: number, e: React.MouseEvent) => {
    e.preventDefault()

    resizeStateRef.current = {
      handleIndex,
      startX: e.clientX,
      startY: e.clientY,
      startSizes: [...panelSizes],
    }

    document.body.style.cursor = direction === 'horizontal' ? 'col-resize' : 'row-resize'
    document.body.style.userSelect = 'none'
  }, [direction, panelSizes])

  // Mouse move/up handlers
  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const state = resizeStateRef.current
      if (!state || !containerRef.current) return

      const { handleIndex, startX, startY, startSizes } = state
      const container = containerRef.current
      const rect = container.getBoundingClientRect()

      const totalSize = direction === 'horizontal' ? rect.width : rect.height
      const currentPos = direction === 'horizontal' ? e.clientX : e.clientY
      const startPos = direction === 'horizontal' ? startX : startY
      const deltaPixels = currentPos - startPos
      const deltaPercent = (deltaPixels / totalSize) * 100

      const leftIndex = handleIndex
      const rightIndex = handleIndex + 1

      if (leftIndex >= startSizes.length || rightIndex >= startSizes.length) return

      // Get configs
      const leftPanelId = panelOrderRef.current[leftIndex]
      const rightPanelId = panelOrderRef.current[rightIndex]
      const leftConfig = panelConfigsRef.current.get(leftPanelId)?.config || { minSize: 10, maxSize: 90 }
      const rightConfig = panelConfigsRef.current.get(rightPanelId)?.config || { minSize: 10, maxSize: 90 }

      let newLeftSize = startSizes[leftIndex] + deltaPercent
      let newRightSize = startSizes[rightIndex] - deltaPercent
      const combinedSize = startSizes[leftIndex] + startSizes[rightIndex]

      // Enforce constraints
      if (newLeftSize < leftConfig.minSize) {
        newLeftSize = leftConfig.minSize
        newRightSize = combinedSize - newLeftSize
      }
      if (newLeftSize > leftConfig.maxSize) {
        newLeftSize = leftConfig.maxSize
        newRightSize = combinedSize - newLeftSize
      }
      if (newRightSize < rightConfig.minSize) {
        newRightSize = rightConfig.minSize
        newLeftSize = combinedSize - newRightSize
      }
      if (newRightSize > rightConfig.maxSize) {
        newRightSize = rightConfig.maxSize
        newLeftSize = combinedSize - newRightSize
      }

      setPanelSizes(prev => {
        const next = [...prev]
        next[leftIndex] = newLeftSize
        next[rightIndex] = newRightSize
        return next
      })
    }

    const handleMouseUp = () => {
      if (resizeStateRef.current) {
        resizeStateRef.current = null
        document.body.style.cursor = ''
        document.body.style.userSelect = ''
        onLayout?.(panelSizes)
      }
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [direction, panelSizes, onLayout])

  const contextValue = React.useMemo<PanelGroupContextValue>(
    () => ({
      groupId: groupIdRef.current,
      direction,
      registerPanel,
      unregisterPanel,
      getPanelSize,
      registerHandle,
      unregisterHandle,
      onResizeStart,
    }),
    [direction, registerPanel, unregisterPanel, getPanelSize, registerHandle, unregisterHandle, onResizeStart]
  )

  return (
    <PanelGroupContext.Provider value={contextValue}>
      <div
        ref={containerRef}
        className={cn(
          'flex h-full w-full',
          direction === 'horizontal' ? 'flex-row' : 'flex-col',
          className
        )}
        data-panel-group={groupIdRef.current}
      >
        {children}
      </div>
    </PanelGroupContext.Provider>
  )
}

// =============================================================================
// PANEL
// =============================================================================

interface ResizablePanelProps {
  children: React.ReactNode
  defaultSize?: number
  minSize?: number
  maxSize?: number
  className?: string
}

export function ResizablePanel({
  children,
  defaultSize = 50,
  minSize = 10,
  maxSize = 90,
  className,
}: ResizablePanelProps) {
  const { groupId, direction, registerPanel, unregisterPanel, getPanelSize } = usePanelGroup()

  // Stable ID for this panel
  const panelIdRef = React.useRef(`${groupId}-panel-${Math.random().toString(36).slice(2, 9)}`)
  const indexRef = React.useRef(-1)

  // Register on mount
  React.useLayoutEffect(() => {
    const id = panelIdRef.current
    indexRef.current = registerPanel(id, defaultSize, { minSize, maxSize })

    return () => {
      unregisterPanel(id)
    }
  }, [registerPanel, unregisterPanel, defaultSize, minSize, maxSize])

  const size = getPanelSize(indexRef.current, defaultSize)

  return (
    <div
      className={cn('overflow-hidden', className)}
      style={{
        [direction === 'horizontal' ? 'width' : 'height']: `${size}%`,
        flexShrink: 0,
        flexGrow: 0,
      }}
      data-panel={panelIdRef.current}
    >
      {children}
    </div>
  )
}

// =============================================================================
// HANDLE
// =============================================================================

interface ResizableHandleProps {
  className?: string
  withHandle?: boolean
}

export function ResizableHandle({ className, withHandle = true }: ResizableHandleProps) {
  const { groupId, direction, registerHandle, unregisterHandle, onResizeStart } = usePanelGroup()

  // Stable ID for this handle
  const handleIdRef = React.useRef(`${groupId}-handle-${Math.random().toString(36).slice(2, 9)}`)
  const indexRef = React.useRef(-1)

  // Register on mount
  React.useLayoutEffect(() => {
    const id = handleIdRef.current
    indexRef.current = registerHandle(id)

    return () => {
      unregisterHandle(id)
    }
  }, [registerHandle, unregisterHandle])

  const handleMouseDown = React.useCallback(
    (e: React.MouseEvent) => {
      onResizeStart(indexRef.current, e)
    },
    [onResizeStart]
  )

  return (
    <div
      className={cn(
        'relative flex items-center justify-center flex-shrink-0',
        'bg-transparent hover:bg-accent/10 active:bg-accent/20',
        'transition-colors duration-150',
        direction === 'horizontal'
          ? 'w-2 cursor-col-resize'
          : 'h-2 cursor-row-resize',
        className
      )}
      onMouseDown={handleMouseDown}
      data-panel-handle={handleIdRef.current}
    >
      {withHandle && (
        <div
          className={cn(
            'flex items-center justify-center rounded-sm',
            'bg-default/60 hover:bg-accent/40',
            'transition-colors',
            direction === 'horizontal' ? 'h-10 w-3' : 'w-10 h-3'
          )}
        >
          <GripVertical
            className={cn(
              'size-3 text-tertiary',
              direction === 'vertical' && 'rotate-90'
            )}
          />
        </div>
      )}
    </div>
  )
}

export default ResizablePanelGroup
