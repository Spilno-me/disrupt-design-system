import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

// =============================================================================
// TABS LIST VARIANTS
// =============================================================================

const tabsListVariants = cva(
  "inline-flex items-center justify-center text-secondary",
  {
    variants: {
      variant: {
        // Default - Muted background, no border
        default: "h-10 rounded-md bg-muted-bg p-1",
        // Accent - Frost glass effect with subtle border (Flow EHS style)
        // Nested corner formula: inner (md/12px) + padding (xs/4px) = outer (lg/16px)
        // overflow-hidden clips indicator when tabs have badges that affect width
        // shadow-sm for subtle depth lift
        // Uses bg-muted-bg for portal-compatible theming (works inside Dialogs)
        // Light: subtle default border | Dark: accent border for visibility
        accent: "relative h-10 rounded-lg bg-muted-bg/60 backdrop-blur-[2px] border border-default dark:border-accent/50 p-1 overflow-hidden shadow-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

// =============================================================================
// TABS TRIGGER VARIANTS
// =============================================================================

const tabsTriggerVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap font-medium ring-offset-surface transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // Default - White active background
        default: "h-8 rounded-sm px-3 text-sm data-[state=active]:bg-surface data-[state=active]:text-primary data-[state=active]:shadow-sm",
        // Accent - Text only, background handled by sliding indicator
        // Uses rounded-md (12px) to match nested corner formula with TabsList
        // px-2 (8px) for balanced spacing with vertical (~6px)
        // Both states use data selectors for equal specificity - active wins by order
        accent: "relative z-10 h-8 flex-1 gap-2 rounded-md px-2 text-sm transition-colors duration-200 data-[state=inactive]:text-primary data-[state=active]:text-white data-[state=active]:font-medium",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export interface TabsProps extends React.ComponentProps<typeof TabsPrimitive.Root> {
  /** Callback when value changes - needed for animated tabs */
  onValueChange?: (value: string) => void
}
export interface TabsListProps
  extends React.ComponentProps<typeof TabsPrimitive.List>,
    VariantProps<typeof tabsListVariants> {
  /** Enable sliding animation for active indicator (accent variant only) */
  animated?: boolean
}
export interface TabsTriggerProps
  extends React.ComponentProps<typeof TabsPrimitive.Trigger>,
    VariantProps<typeof tabsTriggerVariants> {}
export interface TabsContentProps extends React.ComponentProps<typeof TabsPrimitive.Content> {}

// =============================================================================
// SLIDING INDICATOR COMPONENT
// =============================================================================

interface SlidingIndicatorProps {
  containerRef: React.RefObject<HTMLDivElement | null>
}

function SlidingIndicator({ containerRef }: SlidingIndicatorProps) {
  const [indicatorStyle, setIndicatorStyle] = React.useState<React.CSSProperties>({
    opacity: 0,
  })

  React.useEffect(() => {
    const updateIndicator = () => {
      if (!containerRef.current) return

      const activeTab = containerRef.current.querySelector<HTMLElement>(
        '[data-state="active"]'
      )

      if (activeTab) {
        // Use offsetLeft/offsetWidth - these are relative to the positioned parent (TabsList)
        // This ensures perfect alignment without coordinate math errors
        setIndicatorStyle({
          width: activeTab.offsetWidth,
          height: activeTab.offsetHeight,
          left: activeTab.offsetLeft,
          top: activeTab.offsetTop,
          opacity: 1,
        })
      }
    }

    // Initial update
    updateIndicator()

    // Create observer to watch for data-state changes
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.attributeName === 'data-state') {
          updateIndicator()
          break
        }
      }
    })

    if (containerRef.current) {
      // Observe all trigger children for state changes
      const triggers = containerRef.current.querySelectorAll('[data-slot="tabs-trigger"]')
      triggers.forEach((trigger) => {
        observer.observe(trigger, { attributes: true, attributeFilter: ['data-state'] })
      })
    }

    // Update on resize
    window.addEventListener('resize', updateIndicator)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', updateIndicator)
    }
  }, [containerRef])

  return (
    <div
      data-slot="tabs-indicator"
      className="absolute rounded-md bg-accent-noise shadow-sm transition-all duration-300 ease-out"
      style={indicatorStyle}
    />
  )
}

// =============================================================================
// TABS COMPONENT
// =============================================================================

/**
 * Tabs component for organizing content into tabbed sections. Built on Radix UI Tabs primitive.
 *
 * **MOLECULE**: Compound component with multiple sub-components working together.
 *
 * **Variants:**
 * - `default` - Standard tabs with white active background
 * - `accent` - Teal active background with bordered container (Flow EHS style)
 *
 * **Features:**
 * - Keyboard navigation (Arrow Left/Right, Home/End)
 * - Automatic/manual activation modes
 * - Sliding animation for accent variant (set `animated` prop on TabsList)
 * - Accessible by default (ARIA roles, keyboard support)
 * - Focus management with visible focus rings
 *
 * @example
 * ```tsx
 * // Default variant (white active tab)
 * <Tabs defaultValue="account">
 *   <TabsList>
 *     <TabsTrigger value="account">Account</TabsTrigger>
 *     <TabsTrigger value="password">Password</TabsTrigger>
 *   </TabsList>
 *   <TabsContent value="account">Account content</TabsContent>
 *   <TabsContent value="password">Password content</TabsContent>
 * </Tabs>
 *
 * // Accent variant with sliding animation
 * <Tabs defaultValue="my-steps">
 *   <TabsList variant="accent" animated>
 *     <TabsTrigger variant="accent" value="my-steps">My Steps</TabsTrigger>
 *     <TabsTrigger variant="accent" value="team-steps">Team Steps</TabsTrigger>
 *   </TabsList>
 *   <TabsContent value="my-steps">My steps content</TabsContent>
 *   <TabsContent value="team-steps">Team steps content</TabsContent>
 * </Tabs>
 * ```
 */
function Tabs({
  ...props
}: TabsProps) {
  return <TabsPrimitive.Root data-slot="tabs" {...props} />
}

Tabs.displayName = "Tabs"

/**
 * TabsList - Container for tab triggers.
 *
 * @param variant - "default" (muted bg) or "accent" (bordered gray bg)
 * @param animated - Enable sliding animation for active indicator (accent variant only)
 *
 * @example
 * ```tsx
 * // Default variant
 * <TabsList>
 *   <TabsTrigger value="tab1">Tab 1</TabsTrigger>
 * </TabsList>
 *
 * // Accent variant with sliding animation
 * <TabsList variant="accent" animated>
 *   <TabsTrigger variant="accent" value="tab1">Tab 1</TabsTrigger>
 * </TabsList>
 * ```
 */
function TabsList({
  className,
  variant,
  animated = false,
  children,
  ...props
}: TabsListProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const isAccentAnimated = variant === "accent" && animated

  return (
    <TabsPrimitive.List
      ref={containerRef}
      data-slot="tabs-list"
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    >
      {isAccentAnimated && <SlidingIndicator containerRef={containerRef} />}
      {children}
    </TabsPrimitive.List>
  )
}

TabsList.displayName = "TabsList"

/**
 * TabsTrigger - Clickable button that activates a tab.
 *
 * @param variant - "default" (white active) or "accent" (teal active)
 *
 * @example
 * ```tsx
 * // Default variant
 * <TabsTrigger value="account">Account</TabsTrigger>
 *
 * // Accent variant (Flow EHS style)
 * <TabsTrigger variant="accent" value="account">Account</TabsTrigger>
 *
 * // With badge (use children)
 * <TabsTrigger variant="accent" value="team">
 *   Team Steps
 *   <Badge variant="destructive" size="sm">8</Badge>
 * </TabsTrigger>
 * ```
 */
function TabsTrigger({
  className,
  variant,
  ...props
}: TabsTriggerProps) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(tabsTriggerVariants({ variant }), className)}
      {...props}
    />
  )
}

TabsTrigger.displayName = "TabsTrigger"

/**
 * TabsContent - Content panel associated with a tab trigger.
 *
 * @example
 * ```tsx
 * <TabsContent value="account" data-testid="content-account">
 *   <h3>Account Settings</h3>
 *   <p>Manage your account preferences.</p>
 * </TabsContent>
 * ```
 */
function TabsContent({
  className,
  ...props
}: TabsContentProps) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn(
        "mt-2 ring-offset-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
        className
      )}
      {...props}
    />
  )
}

TabsContent.displayName = "TabsContent"

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants, tabsTriggerVariants }
