"use client"

/**
 * MobileMenu - Responsive mobile navigation drawer with animated hamburger icon
 *
 * @component MOLECULE
 *
 * @description
 * A mobile-optimized navigation menu that slides down from the header.
 * Features an animated hamburger icon that transforms to X when open.
 * Supports both controlled and uncontrolled modes for flexibility.
 *
 * Features:
 * - Animated hamburger → X icon transition
 * - Slide-down panel with spring animation
 * - Backdrop overlay for dismissal
 * - Portal rendering to avoid z-index issues
 * - Header-aware positioning via LAYOUT.HEADER_HEIGHT_PX
 *
 * @example
 * ```tsx
 * // Uncontrolled usage
 * <MobileMenu>
 *   <nav className="flex flex-col gap-2">
 *     <a href="/about">About</a>
 *     <a href="/contact">Contact</a>
 *   </nav>
 * </MobileMenu>
 *
 * // Controlled usage
 * const [open, setOpen] = useState(false)
 * <MobileMenu open={open} onOpenChange={setOpen}>
 *   <nav>...</nav>
 * </MobileMenu>
 * ```
 *
 * @accessibility
 * - Screen reader label for toggle button
 * - Backdrop click dismisses menu
 * - Hidden on desktop (md:hidden)
 */

import * as React from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "motion/react"
import { cn } from "../../lib/utils"
import { Button } from "./button"
import { LAYOUT } from "../../constants/designTokens"

// =============================================================================
// CONSTANTS
// =============================================================================

/** Animation duration for burger line transitions */
const BURGER_ANIMATION_DURATION_S = 0.2

/** Animation duration for middle line fade */
const BURGER_FADE_DURATION_S = 0.15

/** Vertical offset for burger line rotation */
const BURGER_LINE_OFFSET_PX = 7

/** Panel slide animation distance */
const PANEL_SLIDE_DISTANCE_PX = -300

/** Backdrop fade animation duration */
const BACKDROP_FADE_DURATION_S = 0.15

/** Panel exit animation duration */
const PANEL_EXIT_DURATION_S = 0.15

/** Spring stiffness for panel animation */
const PANEL_SPRING_STIFFNESS = 400

/** Spring damping for panel animation */
const PANEL_SPRING_DAMPING = 25

/** z-index for backdrop overlay */
const Z_INDEX_BACKDROP = 39

/** z-index for menu panel */
const Z_INDEX_PANEL = 40

/** z-index for trigger button when open */
const Z_INDEX_TRIGGER_OPEN = 51

// =============================================================================
// TYPES
// =============================================================================

interface AnimatedBurgerProps {
  /** Whether the menu is open (controls animation state) */
  isOpen: boolean
}

export interface MobileMenuProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Content to render inside the menu panel */
  children: React.ReactNode
  /** Additional className for the trigger button */
  className?: string
  /** Callback when a menu item is clicked */
  onItemClick?: () => void
  /** Control the open state externally */
  open?: boolean
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void
  /** Disable portal rendering (for Storybook/testing). When true, menu renders inline instead of in document.body */
  disablePortal?: boolean
  /** Disable header padding (for standalone Storybook demos) */
  disableHeaderPadding?: boolean
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Creates animation config for burger line rotation
 */
function getBurgerLineAnimation(isOpen: boolean, rotation: number, yOffset: number) {
  return isOpen
    ? { rotate: rotation, y: yOffset }
    : { rotate: 0, y: 0 }
}

/**
 * Creates animation config for middle burger line fade
 */
function getMiddleLineAnimation(isOpen: boolean) {
  return isOpen
    ? { opacity: 0, scaleX: 0 }
    : { opacity: 1, scaleX: 1 }
}

// =============================================================================
// COMPONENTS
// =============================================================================

/**
 * AnimatedBurger - Hamburger icon that animates to X when open
 */
function AnimatedBurger({ isOpen }: AnimatedBurgerProps) {
  const lineTransition = { duration: BURGER_ANIMATION_DURATION_S, ease: "easeInOut" as const }
  const fadeTransition = { duration: BURGER_FADE_DURATION_S, ease: "easeInOut" as const }

  return (
    <div
      data-slot="mobile-menu-burger"
      className="w-5 h-5 flex flex-col justify-center items-center gap-[5px]"
    >
      <motion.span
        className="block w-5 h-[2px] bg-current origin-center"
        animate={getBurgerLineAnimation(isOpen, 45, BURGER_LINE_OFFSET_PX)}
        transition={lineTransition}
      />
      <motion.span
        className="block w-5 h-[2px] bg-current origin-center"
        animate={getMiddleLineAnimation(isOpen)}
        transition={fadeTransition}
      />
      <motion.span
        className="block w-5 h-[2px] bg-current origin-center"
        animate={getBurgerLineAnimation(isOpen, -45, -BURGER_LINE_OFFSET_PX)}
        transition={lineTransition}
      />
    </div>
  )
}
AnimatedBurger.displayName = "AnimatedBurger"

/**
 * MobileMenuBackdrop - Semi-transparent overlay for dismissing menu
 */
function MobileMenuBackdrop({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      data-slot="mobile-menu-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: BACKDROP_FADE_DURATION_S, ease: "easeInOut" as const }}
      className={cn(
        "fixed inset-0 bg-black/20 md:hidden",
        `z-[${Z_INDEX_BACKDROP}]`
      )}
      style={{ zIndex: Z_INDEX_BACKDROP }}
      onClick={onClose}
    />
  )
}
MobileMenuBackdrop.displayName = "MobileMenuBackdrop"

/**
 * MobileMenuPanel - Animated slide-down panel containing menu content
 */
function MobileMenuPanel({
  children,
  onItemClick,
  disableHeaderPadding,
}: {
  children: React.ReactNode
  onItemClick: () => void
  disableHeaderPadding: boolean
}) {
  const paddingStyle = disableHeaderPadding
    ? undefined
    : { paddingTop: `${LAYOUT.HEADER_HEIGHT_PX}px` }

  return (
    <motion.div
      data-slot="mobile-menu-panel"
      initial={{ y: PANEL_SLIDE_DISTANCE_PX }}
      animate={{
        y: 0,
        transition: {
          type: "spring",
          stiffness: PANEL_SPRING_STIFFNESS,
          damping: PANEL_SPRING_DAMPING,
        },
      }}
      exit={{
        y: PANEL_SLIDE_DISTANCE_PX,
        transition: { duration: PANEL_EXIT_DURATION_S, ease: "easeIn" as const },
      }}
      className="fixed top-0 inset-x-0 bg-surface shadow-lg md:hidden"
      style={{ ...paddingStyle, zIndex: Z_INDEX_PANEL }}
    >
      <div
        data-slot="mobile-menu-content"
        className="w-full px-4 py-4 space-y-4 max-w-none"
        onClick={onItemClick}
      >
        {children}
      </div>
    </motion.div>
  )
}
MobileMenuPanel.displayName = "MobileMenuPanel"

/**
 * MobileMenu - Main component for mobile navigation
 */
export function MobileMenu({
  children,
  className,
  onItemClick,
  open: controlledOpen,
  onOpenChange,
  disablePortal = false,
  disableHeaderPadding = false,
  ...props
}: MobileMenuProps) {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)

  // Support both controlled and uncontrolled modes
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen
  const setOpen = isControlled ? (onOpenChange ?? (() => {})) : setInternalOpen

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const handleItemClick = () => {
    setOpen(false)
    onItemClick?.()
  }

  const handleToggle = () => {
    setOpen(!open)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const menuContent = (
    <AnimatePresence>
      {open && (
        <>
          <MobileMenuBackdrop onClose={handleClose} />
          <MobileMenuPanel
            onItemClick={handleItemClick}
            disableHeaderPadding={disableHeaderPadding}
          >
            {children}
          </MobileMenuPanel>
        </>
      )}
    </AnimatePresence>
  )

  return (
    <div data-slot="mobile-menu" {...props}>
      <Button
        variant="ghost"
        data-slot="mobile-menu-trigger"
        className={cn(
          "md:hidden p-2 h-auto relative",
          open && `z-[${Z_INDEX_TRIGGER_OPEN}]`,
          className
        )}
        style={open ? { zIndex: Z_INDEX_TRIGGER_OPEN } : undefined}
        size="sm"
        onClick={handleToggle}
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
      >
        <AnimatedBurger isOpen={open} />
        <span className="sr-only">Toggle menu</span>
      </Button>

      {/* Portal menu to body so it renders behind header, unless disablePortal is true */}
      {disablePortal ? menuContent : mounted && createPortal(menuContent, document.body)}
    </div>
  )
}

// =============================================================================
// EXPORTS
// =============================================================================

MobileMenu.displayName = "MobileMenu"

export default MobileMenu
