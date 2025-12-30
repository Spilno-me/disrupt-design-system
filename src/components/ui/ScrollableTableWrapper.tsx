/**
 * ScrollableTableWrapper - Horizontal scroll container with swipe hint for mobile
 *
 * Wraps content (typically tables) to handle horizontal overflow with a visual
 * hint overlay and button on smaller screens, improving discoverability of
 * hidden content.
 *
 * @component ATOM
 *
 * @example
 * ```tsx
 * <ScrollableTableWrapper>
 *   <Table>...</Table>
 * </ScrollableTableWrapper>
 * ```
 */

import * as React from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronRight } from 'lucide-react'
import { cn } from '../../lib/utils'

// =============================================================================
// CONSTANTS
// =============================================================================

/** Breakpoint below which scroll hint is shown (in pixels) */
const MOBILE_BREAKPOINT_PX = 1024

/** Minimum scroll distance to dismiss hint (in pixels) */
const SCROLL_THRESHOLD_PX = 20

/** Target scroll position when hint button is clicked (in pixels) */
const HINT_SCROLL_TARGET_PX = 100

/** Animation duration for hint overlay and button (in seconds) */
const ANIMATION_DURATION_SECONDS = 0.3

/** Width of gradient overlay (in pixels) */
const GRADIENT_OVERLAY_WIDTH_PX = 64

// =============================================================================
// TYPES
// =============================================================================

export interface ScrollableTableWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Content to wrap (typically a table) */
  children: React.ReactNode
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Checks if element has horizontal overflow
 */
function hasHorizontalOverflow(element: HTMLElement | null): boolean {
  if (!element) return false
  return element.scrollWidth > element.clientWidth
}

/**
 * Checks if viewport is mobile-sized
 */
function isMobileViewport(): boolean {
  return typeof window !== 'undefined' && window.innerWidth < MOBILE_BREAKPOINT_PX
}

// =============================================================================
// INTERNAL COMPONENTS
// =============================================================================

interface ScrollHintOverlayProps {
  visible: boolean
}

/**
 * Gradient overlay that appears on the right edge when content overflows
 * @internal
 */
function ScrollHintOverlay({ visible }: ScrollHintOverlayProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: ANIMATION_DURATION_SECONDS }}
          className="absolute inset-y-0 right-0 pointer-events-none lg:hidden bg-gradient-to-r from-transparent to-surface-primary/90"
          style={{ width: GRADIENT_OVERLAY_WIDTH_PX }}
          data-slot="scroll-hint-overlay"
          aria-hidden="true"
        />
      )}
    </AnimatePresence>
  )
}
ScrollHintOverlay.displayName = 'ScrollHintOverlay'

interface ScrollHintButtonProps {
  visible: boolean
  onClick: () => void
}

/**
 * Button that prompts users to swipe for more content
 * @internal
 */
function ScrollHintButton({ visible, onClick }: ScrollHintButtonProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 10 }}
          transition={{ duration: ANIMATION_DURATION_SECONDS }}
          onClick={onClick}
          className={cn(
            'absolute right-2 top-1/2 -translate-y-1/2',
            'flex items-center gap-1',
            'bg-inverse text-inverse-secondary',
            'text-xs font-medium px-3 py-2 rounded-full shadow-lg',
            'lg:hidden',
            'focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2'
          )}
          data-slot="scroll-hint-button"
          aria-label="Scroll to see more content"
          type="button"
        >
          <span>Swipe</span>
          <ChevronRight className="w-4 h-4" aria-hidden="true" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
ScrollHintButton.displayName = 'ScrollHintButton'

// =============================================================================
// MAIN COMPONENT
// =============================================================================

/**
 * ScrollableTableWrapper - Horizontal scroll container with swipe hint
 *
 * Automatically detects content overflow and displays a visual hint on mobile
 * devices to indicate scrollable content. The hint disappears after the user
 * begins scrolling.
 *
 * @component ATOM
 *
 * **Features:**
 * - Gradient overlay indicating more content
 * - "Swipe" button for discoverability
 * - Auto-dismisses after user scrolls
 * - Responsive: Only shows on mobile (< 1024px)
 *
 * **Accessibility:**
 * - Button has aria-label for screen readers
 * - Overlay is aria-hidden (decorative)
 * - Proper focus styles on button
 */
export const ScrollableTableWrapper = React.forwardRef<HTMLDivElement, ScrollableTableWrapperProps>(
  ({ children, className, ...props }, ref) => {
    const [showHint, setShowHint] = React.useState(false)
    const [hasScrolled, setHasScrolled] = React.useState(false)
    const scrollRef = React.useRef<HTMLDivElement>(null)

    // Merge refs
    React.useImperativeHandle(ref, () => scrollRef.current as HTMLDivElement)

    React.useEffect(() => {
      const checkOverflow = () => {
        const shouldShowHint =
          hasHorizontalOverflow(scrollRef.current) && isMobileViewport() && !hasScrolled
        setShowHint(shouldShowHint)
      }

      checkOverflow()
      window.addEventListener('resize', checkOverflow)

      return () => window.removeEventListener('resize', checkOverflow)
    }, [hasScrolled])

    const handleScroll = React.useCallback(() => {
      if (scrollRef.current && scrollRef.current.scrollLeft > SCROLL_THRESHOLD_PX) {
        setHasScrolled(true)
        setShowHint(false)
      }
    }, [])

    const handleHintClick = React.useCallback(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTo({
          left: HINT_SCROLL_TARGET_PX,
          behavior: 'smooth',
        })
        setHasScrolled(true)
        setShowHint(false)
      }
    }, [])

    return (
      <div
        className={cn('relative', className)}
        data-slot="scrollable-table-wrapper"
        {...props}
      >
        <div
          ref={scrollRef}
          className="overflow-x-auto"
          onScroll={handleScroll}
          data-slot="scrollable-table-content"
        >
          {children}
        </div>

        <ScrollHintOverlay visible={showHint} />
        <ScrollHintButton visible={showHint} onClick={handleHintClick} />
      </div>
    )
  }
)
ScrollableTableWrapper.displayName = 'ScrollableTableWrapper'

// =============================================================================
// EXPORTS
// =============================================================================

export default ScrollableTableWrapper
