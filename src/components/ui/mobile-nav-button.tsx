/**
 * MobileNavButton Component
 *
 * A navigation button for mobile bottom navigation bars.
 * Features gradient background, press state feedback, and icon+label layout.
 *
 * Designed for the Flow EHS mobile app navigation pattern.
 *
 * @figma https://www.figma.com/design/19jjsBQEpNsQaryNQgXedT/Flow-EHS?node-id=687-8476
 */

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import {
  LayoutDashboard,
  Waypoints,
  Siren,
  Ellipsis,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '../../lib/utils'

// =============================================================================
// TYPES
// =============================================================================

export type MobileNavButtonVariant = 'myFlow' | 'steps' | 'incidents' | 'more' | 'custom'

// =============================================================================
// ICON CONFIGURATION
// =============================================================================

interface NavButtonConfig {
  icon: LucideIcon
  label: string
}

const navButtonConfig: Record<Exclude<MobileNavButtonVariant, 'custom'>, NavButtonConfig> = {
  myFlow: {
    icon: LayoutDashboard,
    label: 'My Flow',
  },
  steps: {
    icon: Waypoints,
    label: 'Steps',
  },
  incidents: {
    icon: Siren,
    label: 'Incidents',
  },
  more: {
    icon: Ellipsis,
    label: 'More',
  },
}

// =============================================================================
// CVA VARIANTS
// =============================================================================

const mobileNavButtonVariants = cva(
  // Base styles
  [
    'relative flex flex-col items-center justify-center',
    'w-[76px] h-[44px]',
    'rounded-[10px]',
    'transition-all duration-150',
    'cursor-pointer',
    'select-none',
    'touch-manipulation',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent',
  ],
  {
    variants: {
      state: {
        default: '',
        active: '',
        pressed: '',
      },
    },
    defaultVariants: {
      state: 'default',
    },
  }
)

// =============================================================================
// COMPONENT
// =============================================================================

export interface MobileNavButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'>,
    VariantProps<typeof mobileNavButtonVariants> {
  /** Button variant determines default icon and label */
  variant?: MobileNavButtonVariant
  /** Custom icon to override the default variant icon */
  icon?: React.ReactNode
  /** Custom label to override the default variant label */
  label?: string
  /** Whether this nav item is currently active/selected */
  isActive?: boolean
  /** Accessible label for screen readers (falls back to label) */
  'aria-label'?: string
}

/**
 * MobileNavButton - Navigation button for mobile bottom navigation
 *
 * A tactile button with gradient background and press feedback.
 * Designed for bottom navigation bars in mobile applications.
 *
 * Features:
 * - Gradient fill (white → gray) for depth effect
 * - Press state with inset shadow
 * - Active state with accent color
 * - Pre-configured variants with Lucide icons
 * - Customizable icon and label
 *
 * @example
 * ```tsx
 * // Preset variants
 * <MobileNavButton variant="myFlow" isActive />
 * <MobileNavButton variant="steps" />
 * <MobileNavButton variant="incidents" />
 * <MobileNavButton variant="more" />
 *
 * // Custom icon and label
 * <MobileNavButton
 *   variant="custom"
 *   icon={<Settings size={20} />}
 *   label="Settings"
 * />
 *
 * // In navigation context
 * <nav className="flex items-center gap-2">
 *   <MobileNavButton variant="myFlow" isActive />
 *   <MobileNavButton variant="steps" />
 *   <QuickActionButton variant="incident" />
 *   <MobileNavButton variant="incidents" />
 *   <MobileNavButton variant="more" />
 * </nav>
 * ```
 */
const MobileNavButton = React.forwardRef<HTMLButtonElement, MobileNavButtonProps>(
  (
    {
      className,
      variant = 'myFlow',
      state,
      icon,
      label: customLabel,
      isActive = false,
      'aria-label': ariaLabel,
      disabled,
      ...props
    },
    ref
  ) => {
    // Get config for variant (or use myFlow as fallback for custom)
    const config = variant === 'custom'
      ? navButtonConfig.myFlow
      : navButtonConfig[variant]

    const IconComponent = config.icon
    const displayLabel = customLabel || config.label

    // Determine visual state
    const visualState = state || (isActive ? 'active' : 'default')

    return (
      <button
        ref={ref}
        type="button"
        data-slot="mobile-nav-button"
        data-variant={variant}
        data-active={isActive}
        disabled={disabled}
        aria-label={ariaLabel || displayLabel}
        aria-current={isActive ? 'page' : undefined}
        className={cn(
          mobileNavButtonVariants({ state: visualState }),
          'group',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        style={{
          background: 'linear-gradient(180deg, var(--mobile-nav-gradient-start) 0%, var(--mobile-nav-gradient-end) 100%)',
          boxShadow: 'var(--mobile-nav-shadow)',
        }}
        {...props}
      >
        {/* Pressed state overlay - shown on active:press */}
        <span
          data-slot="mobile-nav-button-pressed-overlay"
          className="absolute inset-0 rounded-[inherit] opacity-0 group-active:opacity-100 transition-opacity duration-75 pointer-events-none"
          style={{
            background: 'var(--mobile-nav-pressed-bg)',
            boxShadow: 'var(--mobile-nav-pressed-shadow)',
          }}
          aria-hidden="true"
        />

        {/* Icon - uses CSS variable, switches color based on isActive via data attribute */}
        <span
          data-slot="mobile-nav-button-icon"
          className="relative z-10"
          style={{ color: isActive ? 'var(--mobile-nav-icon-active)' : 'var(--mobile-nav-icon-color)' }}
        >
          {icon || (
            <IconComponent
              size={20}
              strokeWidth={1.75}
              aria-hidden="true"
            />
          )}
        </span>

        {/* Label */}
        <span
          data-slot="mobile-nav-button-label"
          className="relative z-10 text-[10px] font-medium leading-tight mt-0.5"
          style={{ color: isActive ? 'var(--mobile-nav-text-active)' : 'var(--mobile-nav-text-color)' }}
        >
          {displayLabel}
        </span>
      </button>
    )
  }
)

MobileNavButton.displayName = 'MobileNavButton'

// =============================================================================
// EXPORTS
// =============================================================================

export { MobileNavButton, mobileNavButtonVariants }
