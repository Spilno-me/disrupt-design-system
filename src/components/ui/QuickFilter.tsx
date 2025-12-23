import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'
import { RADIUS } from '../../constants/designTokens'
import { FileText, Flag, Barrel, Search, ClipboardCheck, Clock } from 'lucide-react'

// =============================================================================
// SCROLL FADE CONTEXT
// =============================================================================

interface ScrollFadeContextValue {
  containerRef: React.RefObject<HTMLDivElement | null>
  fadeZoneWidth: number
  scrollLeft: number
  containerWidth: number
  enabled: boolean
}

const ScrollFadeContext = React.createContext<ScrollFadeContextValue | null>(null)

/**
 * Hook to calculate item opacity based on scroll position
 * Items near edges fade out for a native-app-like effect
 */
function useScrollFadeOpacity(itemRef: React.RefObject<HTMLElement | null>): number {
  const context = React.useContext(ScrollFadeContext)
  const [opacity, setOpacity] = React.useState(1)

  React.useEffect(() => {
    if (!context?.enabled || !itemRef.current || !context.containerRef.current) {
      setOpacity(1)
      return
    }

    const calculateOpacity = () => {
      const item = itemRef.current
      const container = context.containerRef.current
      if (!item || !container) return

      const containerRect = container.getBoundingClientRect()
      const itemRect = item.getBoundingClientRect()

      // Item center relative to container
      const itemCenter = itemRect.left + itemRect.width / 2
      const containerLeft = containerRect.left
      const containerRight = containerRect.right

      // Distance from edges
      const distanceFromLeft = itemCenter - containerLeft
      const distanceFromRight = containerRight - itemCenter

      // Calculate opacity based on distance from nearest edge
      const fadeZone = context.fadeZoneWidth
      const minOpacity = 0.25

      let newOpacity = 1

      if (distanceFromLeft < fadeZone) {
        // Fading on left edge
        newOpacity = minOpacity + (distanceFromLeft / fadeZone) * (1 - minOpacity)
      } else if (distanceFromRight < fadeZone) {
        // Fading on right edge
        newOpacity = minOpacity + (distanceFromRight / fadeZone) * (1 - minOpacity)
      }

      setOpacity(Math.max(minOpacity, Math.min(1, newOpacity)))
    }

    // Initial calculation
    calculateOpacity()

    // Listen to scroll events on container
    const container = context.containerRef.current
    container?.addEventListener('scroll', calculateOpacity, { passive: true })

    // Also recalculate on resize
    window.addEventListener('resize', calculateOpacity, { passive: true })

    return () => {
      container?.removeEventListener('scroll', calculateOpacity)
      window.removeEventListener('resize', calculateOpacity)
    }
  }, [context, itemRef])

  return opacity
}

// =============================================================================
// QUICK FILTER ITEM COMPONENT
// =============================================================================

/**
 * Color variants for Quick Filter items
 * Based on Figma design: Flow EHS - Quick Filter component
 */
export type QuickFilterVariant =
  | 'default'    // Gray - for drafts, default state
  | 'info'       // Cyan/Teal - for reported items
  | 'warning'    // Orange - for aging, reviews, DLB
  | 'primary'    // Dark - for in progress

const quickFilterItemVariants = cva(
  // Base + snap-start for mobile horizontal scroll
  'relative flex flex-col items-center justify-center cursor-pointer transition-all duration-200 snap-start flex-shrink-0',
  {
    variants: {
      variant: {
        default: '',
        info: '',
        warning: '',
        primary: '',
      },
      size: {
        sm: 'min-w-[100px] h-[72px] px-4',
        md: 'min-w-[120px] h-[80px] px-5',
        lg: 'min-w-[140px] h-[88px] px-6',
      },
      selected: {
        true: '', // Pressed state - no hover scale
        false: 'hover:scale-105', // Normal state - hover lifts up
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      selected: false,
    },
  }
)

/**
 * Get variant-specific colors for the Quick Filter item
 * Uses CSS variables that auto-switch between light and dark mode
 * Contrast ratios verified against WCAG AA requirements
 */
const getVariantColors = (variant: QuickFilterVariant) => {
  const variantMap = {
    default: {
      border: 'var(--qf-default-border)',
      badge: 'var(--qf-default-badge-bg)',
      badgeText: 'var(--qf-default-badge-text)',
      text: 'var(--qf-default-text)',
      icon: 'var(--qf-default-icon)',
    },
    info: {
      border: 'var(--qf-info-border)',
      badge: 'var(--qf-info-badge-bg)',
      badgeText: 'var(--qf-info-badge-text)',
      text: 'var(--qf-info-text)',
      icon: 'var(--qf-info-icon)',
    },
    warning: {
      border: 'var(--qf-warning-border)',
      badge: 'var(--qf-warning-badge-bg)',
      badgeText: 'var(--qf-warning-badge-text)',
      text: 'var(--qf-warning-text)',
      icon: 'var(--qf-warning-icon)',
    },
    primary: {
      border: 'var(--qf-primary-border)',
      badge: 'var(--qf-primary-badge-bg)',
      badgeText: 'var(--qf-primary-badge-text)',
      text: 'var(--qf-primary-text)',
      icon: 'var(--qf-primary-icon)',
    },
  }
  return variantMap[variant]
}

export interface QuickFilterItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof quickFilterItemVariants> {
  /** The icon to display (should be a React element that accepts style/color props) */
  icon?: React.ReactNode
  /** The count to display in the badge */
  count?: number
  /** The label text */
  label: string
  /** Color variant */
  variant?: QuickFilterVariant
  /** Whether this item is selected */
  selected?: boolean
  /** Size variant */
  size?: 'sm' | 'md' | 'lg'
}

/**
 * QuickFilterItem - Individual filter button with icon, badge, and label
 *
 * Design based on Flow EHS Figma:
 * - White to light gray gradient background
 * - Colored gradient border (stronger at bottom)
 * - Colored icon matching the variant
 * - Badge with count positioned top-right of icon
 * - Label text below
 *
 * Variants:
 * - default: Gray - used for drafts
 * - info: Cyan/Teal - used for reported items
 * - warning: Orange - used for aging, reviews, DLB
 * - primary: Dark - used for in progress
 */
export const QuickFilterItem = React.forwardRef<HTMLButtonElement, QuickFilterItemProps>(
  (
    {
      className,
      variant = 'default',
      size = 'md',
      selected = false,
      icon,
      count,
      label,
      ...props
    },
    ref
  ) => {
    const colors = getVariantColors(variant)

    // Internal ref for scroll fade calculations
    const internalRef = React.useRef<HTMLButtonElement>(null)
    const scrollFadeOpacity = useScrollFadeOpacity(internalRef)

    // Merge refs
    React.useImperativeHandle(ref, () => internalRef.current as HTMLButtonElement)

    // Clone icon with proper color
    const coloredIcon = icon && React.isValidElement(icon)
      ? React.cloneElement(icon as React.ReactElement<{ style?: React.CSSProperties; color?: string }>, {
          style: { ...(icon.props as { style?: React.CSSProperties }).style, color: colors.icon },
          color: colors.icon,
        })
      : icon

    // Pressed/selected state styles
    // Glow ring uses the border color with transparency for a soft effect
    const glowShadow = `0 0 6px 1px color-mix(in srgb, ${colors.border} 50%, transparent)`

    const pressedStyles = selected ? {
      // Combine inner shadow (pressed) with outer glow ring (focus attention)
      // eslint-disable-next-line no-restricted-syntax -- Dynamic glow requires composite shadow with color-mix
      boxShadow: `inset 0 2px 4px rgba(0, 0, 0, 0.1), ${glowShadow}`,
      // Gradient: top darker, bottom lighter (light from above pressing down)
      background: 'linear-gradient(180deg, var(--color-surface-hover) 0%, var(--color-surface) 100%)',
      // Slightly scaled down
      transform: 'scale(0.98)',
    } : {
      // Medium shadow when raised (normal state) - use CSS variable for consistency with shadow-md class
      boxShadow: 'var(--shadow-md)',
      // Highlight gradient: ~13px solid surface at top to match SearchFilter visual appearance
      background: 'linear-gradient(180deg, var(--color-surface) 0%, var(--color-surface) 13px, var(--color-surface-hover) 100%)',
      transform: 'scale(1)',
    }

    return (
      <button
        ref={internalRef}
        className={cn(
          quickFilterItemVariants({ variant, size, selected }),
          'overflow-hidden',
          className
        )}
        style={{
          ...pressedStyles,
          borderRadius: RADIUS.md,
          transition: 'all 0.15s ease-out, opacity 0.15s ease-out',
          opacity: scrollFadeOpacity,
        }}
        {...props}
      >
        {/* Gradient border overlay - stronger when selected */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            border: selected ? '2.5px solid transparent' : '2px solid transparent',
            // Uses rgba white for the fade effect - works on both light and dark backgrounds
            // When selected, border starts from top for more prominent effect
            background: selected
              ? `linear-gradient(180deg, ${colors.border} 0%, ${colors.border} 100%) border-box`
              : `linear-gradient(180deg, rgba(255,255,255,0.2) 0%, ${colors.border} 60%, ${colors.border} 100%) border-box`,
            WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            borderRadius: RADIUS.md,
          }}
        />

        {/* Content container */}
        <div className="flex flex-col items-center gap-1.5 relative z-10">
          {/* Icon and Badge container */}
          <div className="relative">
            {/* Icon */}
            {coloredIcon && (
              <div className="w-7 h-7 flex items-center justify-center">
                {coloredIcon}
              </div>
            )}

            {/* Badge with count - positioned at top-right corner */}
            {count !== undefined && (
              <div
                className="absolute min-w-[20px] h-[20px] flex items-center justify-center text-[11px] font-bold px-1"
                style={{
                  backgroundColor: colors.badge,
                  color: colors.badgeText,  // WCAG AA compliant badge text color
                  border: '2px solid var(--color-surface)',  // Uses CSS variable for dark mode
                  borderRadius: RADIUS.full,
                  top: '-6px',
                  right: '-12px',
                }}
              >
                {count}
              </div>
            )}
          </div>

          {/* Label */}
          <span
            className="text-xs font-semibold leading-tight text-center whitespace-nowrap"
            style={{ color: colors.text }}
          >
            {label}
          </span>
        </div>
      </button>
    )
  }
)

QuickFilterItem.displayName = 'QuickFilterItem'

// =============================================================================
// QUICK FILTER CONTAINER COMPONENT
// =============================================================================

export interface QuickFilterProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The filter items to display */
  children: React.ReactNode
  /** Gap between items */
  gap?: 'sm' | 'md' | 'lg'
  /**
   * Enable dynamic fade effect on scroll (mobile only)
   * Items near edges will fade out for a native-app-like feel
   * @default true
   */
  fadeOnScroll?: boolean
  /**
   * Width of the fade zone in pixels
   * Items within this distance from edges will fade
   * @default 80
   */
  fadeZoneWidth?: number
  /**
   * Show static edge gradient overlays
   * Set to false when using fadeOnScroll for cleaner look
   * @default false (when fadeOnScroll is true)
   */
  showEdgeGradients?: boolean
  /**
   * Enable edge-to-edge layout on mobile
   * Items will stretch from screen edge to screen edge
   * First/last items get padding to prevent clipping
   * @default true
   */
  edgeToEdge?: boolean
  /**
   * Break out of parent container padding (full bleed)
   * Use when QuickFilter is inside a padded container but needs to reach screen edges
   * Applies negative margins to counteract parent padding (mobile only)
   * @default false
   */
  fullBleed?: boolean
}

const gapClasses = {
  sm: 'gap-2',
  md: 'gap-3',
  lg: 'gap-4',
}

/**
 * QuickFilter - Container for QuickFilterItem components
 *
 * Displays a horizontal row of filter buttons typically used for
 * quick status filtering in dashboards.
 *
 * Mobile behavior (Fitts' Law + Discoverability):
 * - Horizontal scroll with snap points for smooth navigation
 * - Dynamic item fade on scroll (fadeOnScroll) - items dim near edges
 * - Optional static edge fade gradients
 * - Shadow overflow preserved for depth perception
 * - Desktop: wraps normally
 */
export const QuickFilter = React.forwardRef<HTMLDivElement, QuickFilterProps>(
  ({
    className,
    children,
    gap = 'md',
    fadeOnScroll = true,
    fadeZoneWidth = 80,
    showEdgeGradients,
    edgeToEdge = true,
    fullBleed = false,
    ...props
  }, ref) => {
    const containerRef = React.useRef<HTMLDivElement>(null)
    const [scrollState, setScrollState] = React.useState({ scrollLeft: 0, containerWidth: 0 })

    // Track scroll for context updates
    React.useEffect(() => {
      const container = containerRef.current
      if (!container) return

      const updateScrollState = () => {
        setScrollState({
          scrollLeft: container.scrollLeft,
          containerWidth: container.clientWidth,
        })
      }

      updateScrollState()
      container.addEventListener('scroll', updateScrollState, { passive: true })
      window.addEventListener('resize', updateScrollState, { passive: true })

      return () => {
        container.removeEventListener('scroll', updateScrollState)
        window.removeEventListener('resize', updateScrollState)
      }
    }, [])

    // Merge refs
    React.useImperativeHandle(ref, () => containerRef.current as HTMLDivElement)

    // Default: hide static gradients when fadeOnScroll is enabled
    const shouldShowGradients = showEdgeGradients ?? !fadeOnScroll

    const contextValue: ScrollFadeContextValue = {
      containerRef,
      fadeZoneWidth,
      scrollLeft: scrollState.scrollLeft,
      containerWidth: scrollState.containerWidth,
      enabled: fadeOnScroll,
    }

    // Process children to add edge padding for edge-to-edge layout
    const childArray = React.Children.toArray(children)
    const processedChildren = edgeToEdge
      ? childArray.map((child, index) => {
          if (!React.isValidElement(child)) return child

          const isFirst = index === 0
          const isLast = index === childArray.length - 1

          // Add margin to first/last items for edge spacing (mobile only)
          // This creates space from screen edges while allowing edge-to-edge scroll
          return React.cloneElement(child as React.ReactElement<{ className?: string; style?: React.CSSProperties }>, {
            className: cn(
              (child.props as { className?: string }).className,
              isFirst && 'ml-4 md:ml-0',
              isLast && 'mr-4 md:mr-0'
            ),
          })
        })
      : children

    return (
      <ScrollFadeContext.Provider value={contextValue}>
        {/* Full bleed: negative margins to break out of parent padding (mobile only) */}
        <div
          className={cn(
            'relative',
            // Full bleed breaks out of parent p-6 padding on mobile
            fullBleed && '-mx-6 md:mx-0'
          )}
          {...props}
        >
          {/* Left edge fade - mobile only. Uses --color-page for main content area background */}
          {shouldShowGradients && (
            <div
              className="absolute left-0 top-0 bottom-0 w-8 z-10 pointer-events-none md:hidden"
              style={{
                background: 'linear-gradient(to right, var(--color-page) 0%, transparent 100%)',
              }}
            />
          )}

          {/* Right edge fade - mobile only. Uses --color-page for main content area background */}
          {shouldShowGradients && (
            <div
              className="absolute right-0 top-0 bottom-0 w-8 z-10 pointer-events-none md:hidden"
              style={{
                background: 'linear-gradient(to left, var(--color-page) 0%, transparent 100%)',
              }}
            />
          )}

          {/* Scrollable content */}
          <div
            ref={containerRef}
            className={cn(
              'flex flex-row items-center',
              // Mobile: horizontal scroll with snap, hide scrollbar
              'overflow-x-auto overflow-y-visible snap-x snap-mandatory scrollbar-hide',
              // Vertical padding for shadow overflow (py-2 -my-2 preserves shadow space)
              'py-2 -my-2',
              // Horizontal padding: none for edge-to-edge, px-3 otherwise
              !edgeToEdge && 'px-3',
              // Desktop: wrap normally, no scroll, reset padding
              'md:flex-wrap md:overflow-visible md:px-0 md:py-0 md:my-0',
              gapClasses[gap],
              className
            )}
          >
            {processedChildren}
          </div>
        </div>
      </ScrollFadeContext.Provider>
    )
  }
)

QuickFilter.displayName = 'QuickFilter'

// =============================================================================
// PRESET QUICK FILTER ITEMS (for convenience)
// Uses Lucide icons
// =============================================================================

/** Pre-configured Drafts filter - uses FileText icon */
export const DraftsFilter: React.FC<Omit<QuickFilterItemProps, 'variant' | 'label'> & { label?: string }> = ({
  label = 'Drafts',
  icon,
  ...props
}) => <QuickFilterItem variant="default" label={label} icon={icon || <FileText size={24} />} {...props} />

/** Pre-configured Reported filter - uses Flag icon */
export const ReportedFilter: React.FC<Omit<QuickFilterItemProps, 'variant' | 'label'> & { label?: string }> = ({
  label = 'Reported',
  icon,
  ...props
}) => <QuickFilterItem variant="info" label={label} icon={icon || <Flag size={24} />} {...props} />

/** Pre-configured Aging filter - uses Barrel icon */
export const AgingFilter: React.FC<Omit<QuickFilterItemProps, 'variant' | 'label'> & { label?: string }> = ({
  label = 'Aging',
  icon,
  ...props
}) => <QuickFilterItem variant="warning" label={label} icon={icon || <Barrel size={24} />} {...props} />

/** Pre-configured In Progress filter - uses Search icon */
export const InProgressFilter: React.FC<Omit<QuickFilterItemProps, 'variant' | 'label'> & { label?: string }> = ({
  label = 'In Progress',
  icon,
  ...props
}) => <QuickFilterItem variant="primary" label={label} icon={icon || <Search size={24} />} {...props} />

/** Pre-configured Reviews filter - uses ClipboardCheck icon */
export const ReviewsFilter: React.FC<Omit<QuickFilterItemProps, 'variant' | 'label'> & { label?: string }> = ({
  label = 'Reviews',
  icon,
  ...props
}) => <QuickFilterItem variant="warning" label={label} icon={icon || <ClipboardCheck size={24} />} {...props} />

/** Pre-configured DLB filter - uses Clock icon */
export const DLBFilter: React.FC<Omit<QuickFilterItemProps, 'variant' | 'label'> & { label?: string }> = ({
  label = 'DLB',
  icon,
  ...props
}) => <QuickFilterItem variant="warning" label={label} icon={icon || <Clock size={24} />} {...props} />

export default QuickFilter
