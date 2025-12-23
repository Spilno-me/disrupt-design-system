/**
 * ScrollFadeList - Vertical scroll container with edge fade effect
 *
 * Items near the top and bottom edges fade out as they scroll,
 * creating a native-app-like depth illusion (like Monobank).
 *
 * @example
 * ```tsx
 * <ScrollFadeList fadeZoneHeight={80}>
 *   {items.map(item => <Card key={item.id} {...item} />)}
 * </ScrollFadeList>
 * ```
 */

import * as React from 'react'
import { cn } from '../../lib/utils'

// =============================================================================
// SCROLL FADE CONTEXT
// =============================================================================

interface ScrollFadeContextValue {
  containerRef: React.RefObject<HTMLDivElement | null>
  fadeZoneHeight: number
  enabled: boolean
  /** Which edges to fade: 'both' | 'top' | 'bottom' */
  fadeEdges: 'both' | 'top' | 'bottom'
  /** Bottom offset to account for fixed nav bars */
  bottomOffset: number
}

const ScrollFadeContext = React.createContext<ScrollFadeContextValue | null>(null)

/**
 * Hook to calculate item opacity based on vertical scroll position
 * Items near the bottom of VIEWPORT fade out for a native-app-like effect
 * Uses viewport bounds, not container bounds, since page-level scrolling is common
 */
export function useVerticalScrollFadeOpacity(itemRef: React.RefObject<HTMLElement | null>): number {
  const context = React.useContext(ScrollFadeContext)
  const [opacity, setOpacity] = React.useState(1)

  React.useEffect(() => {
    if (!context?.enabled || !itemRef.current) {
      setOpacity(1)
      return
    }

    const calculateOpacity = () => {
      const item = itemRef.current
      if (!item) return

      const itemRect = item.getBoundingClientRect()

      // Use VIEWPORT bounds, accounting for bottom nav offset
      const viewportTop = 0
      const viewportBottom = window.innerHeight - context.bottomOffset

      // Item's bottom edge (not center) - fade starts when bottom approaches edge
      const itemBottom = itemRect.bottom
      const itemTop = itemRect.top

      // Calculate opacity based on which edges should fade
      const fadeZone = context.fadeZoneHeight
      const minOpacity = 0.2

      let newOpacity = 1

      // Bottom edge fading (item approaching bottom nav)
      if (context.fadeEdges === 'bottom' || context.fadeEdges === 'both') {
        const distanceFromBottom = viewportBottom - itemBottom
        if (distanceFromBottom < fadeZone && distanceFromBottom >= 0) {
          // Item is within fade zone at bottom
          newOpacity = Math.min(newOpacity, minOpacity + (distanceFromBottom / fadeZone) * (1 - minOpacity))
        } else if (distanceFromBottom < 0) {
          // Item is below the visible area (behind nav)
          newOpacity = minOpacity
        }
      }

      // Top edge fading (optional)
      if (context.fadeEdges === 'top' || context.fadeEdges === 'both') {
        const distanceFromTop = itemTop - viewportTop
        if (distanceFromTop < fadeZone && distanceFromTop >= 0) {
          // Item is within fade zone at top
          newOpacity = Math.min(newOpacity, minOpacity + (distanceFromTop / fadeZone) * (1 - minOpacity))
        } else if (distanceFromTop < 0) {
          // Item is above the visible area
          newOpacity = minOpacity
        }
      }

      setOpacity(Math.max(minOpacity, Math.min(1, newOpacity)))
    }

    // Initial calculation
    calculateOpacity()

    // Listen to scroll events on WINDOW (page-level scroll)
    window.addEventListener('scroll', calculateOpacity, { passive: true })

    // Also recalculate on resize
    window.addEventListener('resize', calculateOpacity, { passive: true })

    return () => {
      window.removeEventListener('scroll', calculateOpacity)
      window.removeEventListener('resize', calculateOpacity)
    }
  }, [context, itemRef])

  return opacity
}

// =============================================================================
// SCROLL FADE ITEM WRAPPER
// =============================================================================

export interface ScrollFadeItemProps {
  children: React.ReactNode
  className?: string
}

/**
 * Wrapper for items inside ScrollFadeList that applies the fade effect
 */
export function ScrollFadeItem({ children, className }: ScrollFadeItemProps) {
  const itemRef = React.useRef<HTMLDivElement>(null)
  const opacity = useVerticalScrollFadeOpacity(itemRef)

  return (
    <div
      ref={itemRef}
      className={className}
      style={{
        opacity,
        transition: 'opacity 0.15s ease-out',
      }}
    >
      {children}
    </div>
  )
}

// =============================================================================
// SCROLL FADE LIST CONTAINER
// =============================================================================

export interface ScrollFadeListProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The items to display */
  children: React.ReactNode
  /**
   * Enable dynamic fade effect on scroll
   * Items near edges will fade out for a native-app-like feel
   * @default true
   */
  fadeOnScroll?: boolean
  /**
   * Height of the fade zone in pixels
   * Items within this distance from edges will fade
   * @default 80
   */
  fadeZoneHeight?: number
  /**
   * Break out of parent container padding (full bleed)
   * Use when list is inside a padded container but needs to reach screen edges
   * Applies negative margins to counteract parent padding (mobile only)
   * @default false
   */
  fullBleed?: boolean
  /**
   * Gap between items
   * @default 'md'
   */
  gap?: 'none' | 'sm' | 'md' | 'lg'
  /**
   * Auto-wrap children in ScrollFadeItem for opacity effect
   * Set to false if you want to manually control which items fade
   * @default true
   */
  autoWrap?: boolean
  /**
   * Which edges should have the fade effect
   * 'bottom' - Only fade items near bottom (recommended for mobile with nav bar)
   * 'top' - Only fade items near top
   * 'both' - Fade at both edges
   * @default 'bottom'
   */
  fadeEdges?: 'both' | 'top' | 'bottom'
  /**
   * Offset from bottom of viewport to account for fixed nav bars
   * Items will fade before they reach this distance from bottom
   * @default 80 (typical mobile nav bar height)
   */
  bottomOffset?: number
}

const gapClasses = {
  none: 'gap-0',
  sm: 'gap-1',
  md: 'gap-2',
  lg: 'gap-3',
}

/**
 * ScrollFadeList - Vertical scroll container with edge fade effect
 *
 * Items near the top and bottom edges fade out as they scroll,
 * creating a native-app-like depth illusion.
 *
 * Mobile behavior:
 * - Items dynamically adjust opacity based on distance from container edges
 * - Smooth transitions as you scroll
 * - Optional full-bleed to break out of parent padding
 */
export const ScrollFadeList = React.forwardRef<HTMLDivElement, ScrollFadeListProps>(
  ({
    className,
    children,
    fadeOnScroll = true,
    fadeZoneHeight = 80,
    fullBleed = false,
    gap = 'md',
    autoWrap = true,
    fadeEdges = 'bottom',
    bottomOffset = 80,
    ...props
  }, ref) => {
    const containerRef = React.useRef<HTMLDivElement>(null)

    // Merge refs
    React.useImperativeHandle(ref, () => containerRef.current as HTMLDivElement)

    const contextValue: ScrollFadeContextValue = {
      containerRef,
      fadeZoneHeight,
      enabled: fadeOnScroll,
      fadeEdges,
      bottomOffset,
    }

    // Auto-wrap children in ScrollFadeItem
    const processedChildren = autoWrap && fadeOnScroll
      ? React.Children.map(children, (child) => {
          if (!React.isValidElement(child)) return child
          return <ScrollFadeItem>{child}</ScrollFadeItem>
        })
      : children

    return (
      <ScrollFadeContext.Provider value={contextValue}>
        <div
          ref={containerRef}
          className={cn(
            'flex flex-col',
            gapClasses[gap],
            // Full bleed breaks out of parent p-6 padding on mobile
            fullBleed && '-mx-6 px-6 md:mx-0 md:px-0',
            className
          )}
          {...props}
        >
          {processedChildren}
        </div>
      </ScrollFadeContext.Provider>
    )
  }
)

ScrollFadeList.displayName = 'ScrollFadeList'

export default ScrollFadeList
