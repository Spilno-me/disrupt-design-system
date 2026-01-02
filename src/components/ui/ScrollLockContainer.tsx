import * as React from 'react'
import { cn } from '../../lib/utils'
import { useIOSScrollLock, type UseIOSScrollLockOptions } from '../../hooks/useIOSScrollLock'

// =============================================================================
// TYPES
// =============================================================================

export interface ScrollLockContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    Omit<UseIOSScrollLockOptions, 'isLocked'> {
  /**
   * Whether the scroll lock container is open/active.
   * When true, body scroll is locked and the container is visible.
   */
  isOpen: boolean

  /**
   * Whether to show a semi-transparent overlay background.
   * @default false
   */
  overlay?: boolean

  /**
   * Whether to apply backdrop blur effect.
   * @default false
   */
  blur?: boolean

  /**
   * Whether to disable the fade transition.
   * @default false
   */
  noTransition?: boolean

  /**
   * Z-index level for the container.
   * @default 50
   */
  zIndex?: 50 | 60 | 70 | 80

  /**
   * Content of the scroll lock container.
   */
  children: React.ReactNode

  /**
   * Additional classes for the content wrapper.
   */
  contentClassName?: string
}

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * ScrollLockContainer - Prevents body scroll when modals/overlays are open
 *
 * @component MOLECULE
 *
 * @description
 * A container component that prevents body scroll "leaking" on iOS Safari.
 * Uses the StripeArmy technique with a multi-layer DOM structure and CSS tricks:
 * 1. Fixed container with overflow:hidden
 * 2. Scrollable layer with overscroll-behavior:none
 * 3. +1px height trick to ensure scrollability
 * 4. Sticky content layer to eliminate jitter
 *
 * This solves the infamous iOS Safari "rubber band scrolling" issue where
 * scroll events propagate through modals to the body underneath.
 *
 * @testid
 * Uses data-slot attributes for testing:
 * - data-slot="scroll-lock-container" - Outer container
 * - data-slot="scroll-lock-scroller" - Scroll capture layer
 * - data-slot="scroll-lock-content" - Content wrapper
 *
 * @accessibility
 * - Does not trap focus (use with Dialog or add focus trap separately)
 * - Container receives aria-hidden when closed
 * - Content is fully accessible when open
 *
 * @see useIOSScrollLock - The underlying hook
 * @see https://www.npmjs.com/package/react-ios-scroll-lock
 */
function ScrollLockContainer({
  isOpen,
  overlay = false,
  blur = false,
  noTransition = false,
  zIndex = 50,
  children,
  className,
  contentClassName,
  applyIOSFix = true,
  preventBodyScroll = true,
  onLockChange,
  debug,
  ...props
}: ScrollLockContainerProps) {
  const { containerRef, isIOSDevice } = useIOSScrollLock({
    isLocked: isOpen,
    applyIOSFix,
    preventBodyScroll,
    onLockChange,
    debug,
  })

  // Build class list for the holder
  const holderClasses = cn(
    'isl-holder',
    isOpen && 'isl-holder--open',
    overlay && 'isl-holder--overlay',
    blur && 'isl-holder--blur',
    noTransition && 'isl-holder--no-transition',
    zIndex !== 50 && `isl-holder--z-${zIndex}`,
    className
  )

  return (
    <div
      ref={containerRef}
      data-slot="scroll-lock-container"
      data-ios={isIOSDevice}
      aria-hidden={!isOpen}
      className={holderClasses}
      {...props}
    >
      <div data-slot="scroll-lock-scroller" className="isl-scroller">
        <div className="isl-scroller-inner">
          <div
            data-slot="scroll-lock-content"
            className={cn('isl-scroller-content', contentClassName)}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
ScrollLockContainer.displayName = 'ScrollLockContainer'

export { ScrollLockContainer }
