/**
 * QuickActionButton Component
 *
 * A prominent gradient action button for mobile navigation.
 * Designed to be placed in the center of mobile nav for quick access to key actions.
 *
 * Default variant: "incident" - for reporting incidents directly.
 *
 * @figma https://www.figma.com/design/19jjsBQEpNsQaryNQgXedT/Flow-EHS?node-id=687-8476
 */

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Plus, Phone, Camera, type LucideIcon } from 'lucide-react'
import { cn } from '../../lib/utils'
import { ALIAS } from '../../constants/designTokens'

// =============================================================================
// CUSTOM ICONS
// =============================================================================

/**
 * Add Incident Icon - Open triangle with exclamation mark and circled "+" badge.
 * Extracted from Figma design (node-id=687-8522).
 * Used for "Report Incident" action in mobile navigation.
 *
 * Icon is centered in a square viewBox for proper alignment.
 */
const AddIncidentIcon: React.FC<{ size?: number; className?: string }> = ({
  size = 28,
  className,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Centered group: icon is ~30.5x27, centered in 32x32 viewBox */}
      <g transform="translate(0.5, 2.5)">
        {/* Circle with + sign (add badge) */}
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M22.795 13.408C25.946 13.408 28.5 15.954 28.5 19.093C28.5 22.233 25.946 24.778 22.795 24.778C19.643 24.778 17.088 22.233 17.088 19.093C17.088 15.954 19.643 13.408 22.795 13.408ZM22.795 16.01C22.475 16.01 22.215 16.27 22.215 16.588V18.515H20.28C19.96 18.515 19.7 18.775 19.7 19.093C19.7 19.412 19.96 19.672 20.28 19.672H22.215V21.598C22.215 21.917 22.475 22.176 22.795 22.176C23.115 22.176 23.375 21.917 23.375 21.598V19.672H25.309C25.629 19.672 25.889 19.412 25.889 19.093C25.889 18.775 25.629 18.515 25.309 18.515H23.375V16.588C23.375 16.27 23.115 16.01 22.795 16.01Z"
          fill="currentColor"
        />
        {/* Exclamation mark dot */}
        <path
          d="M12.941 16.203C13.582 16.203 14.102 16.721 14.102 17.359C14.102 17.997 13.582 18.515 12.941 18.515H12.93C12.289 18.515 11.769 17.997 11.769 17.359C11.769 16.721 12.289 16.203 12.93 16.203H12.941Z"
          fill="currentColor"
        />
        {/* Exclamation mark line */}
        <path
          d="M12.93 6.953C13.57 6.953 14.091 7.471 14.091 8.109V12.734C14.091 13.372 13.57 13.89 12.93 13.89C12.289 13.89 11.769 13.372 11.769 12.734V8.109C11.769 7.471 12.289 6.953 12.93 6.953Z"
          fill="currentColor"
        />
        {/* Open triangle shape */}
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12.917 0C13.533 0 14.139 0.163 14.671 0.472C15.202 0.78 15.642 1.223 15.945 1.755L21.478 11.401C21.906 11.329 22.346 11.289 22.795 11.289C27.122 11.289 30.63 14.783 30.63 19.093C30.63 23.404 27.122 26.898 22.795 26.898C19.955 26.898 17.469 25.393 16.095 23.14H3.643C3.033 23.144 2.432 22.988 1.902 22.688C1.368 22.386 0.924 21.948 0.614 21.42C0.305 20.892 0.142 20.291 0.14 19.68C0.139 19.07 0.3 18.471 0.605 17.942L9.89 1.755C10.194 1.222 10.634 0.78 11.165 0.472C11.697 0.163 12.302 0 12.917 0ZM22.795 12.252C19.002 12.252 15.927 15.316 15.927 19.093C15.927 22.872 19.002 25.935 22.795 25.935C26.588 25.935 29.662 22.872 29.662 19.093C29.662 15.316 26.588 12.252 22.795 12.252ZM12.917 2.312C12.712 2.312 12.511 2.367 12.334 2.469C12.156 2.572 12.009 2.72 11.907 2.898L11.906 2.902L2.62 19.089L2.617 19.093C2.515 19.27 2.461 19.471 2.462 19.675C2.462 19.878 2.517 20.079 2.619 20.254C2.722 20.43 2.871 20.577 3.049 20.678C3.227 20.778 3.429 20.83 3.633 20.828H15.156C15.029 20.27 14.96 19.69 14.96 19.093C14.96 16.062 16.696 13.435 19.231 12.143L13.929 2.902L13.927 2.898C13.826 2.721 13.679 2.572 13.502 2.469C13.325 2.366 13.122 2.312 12.917 2.312Z"
          fill="currentColor"
        />
      </g>
    </svg>
  )
}

// =============================================================================
// TYPES
// =============================================================================

export type QuickActionVariant = 'incident' | 'create' | 'emergency' | 'capture' | 'custom'

// =============================================================================
// GRADIENT CONFIGURATION
// =============================================================================

/**
 * Variant gradient colors mapped to DDS token values.
 * Each gradient follows the pattern: light (top) → medium (11%) → dark (bottom)
 * Border gradient: white → transparent for glass-like depth effect
 */
interface VariantConfig {
  fill: string
  border: string
  icon: LucideIcon | React.FC<{ size?: number; className?: string }>
  iconColor: string
  label: string
}

const variantConfig: Record<Exclude<QuickActionVariant, 'custom'>, VariantConfig> = {
  incident: {
    // Red gradient for incident reporting (urgent action)
    fill: ALIAS.gradient.incident.fill,
    border: ALIAS.gradient.incident.border,
    icon: AddIncidentIcon,
    iconColor: ALIAS.text.inverse,
    label: 'Report Incident',
  },
  create: {
    // Teal gradient for general creation actions
    fill: ALIAS.gradient.create.fill,
    border: ALIAS.gradient.create.border,
    icon: Plus,
    iconColor: ALIAS.text.inverse,
    label: 'Create New',
  },
  emergency: {
    // Orange gradient for emergency/urgent actions
    fill: ALIAS.gradient.emergency.fill,
    border: ALIAS.gradient.emergency.border,
    icon: Phone,
    iconColor: ALIAS.text.inverse,
    label: 'Emergency',
  },
  capture: {
    // Green gradient for capture/document actions
    fill: ALIAS.gradient.capture.fill,
    border: ALIAS.gradient.capture.border,
    icon: Camera,
    iconColor: ALIAS.text.inverse,
    label: 'Capture',
  },
}

// =============================================================================
// CVA VARIANTS
// =============================================================================

/**
 * Elevated shadow from Figma design (node-id=687-8522)
 * Double drop shadow for depth effect
 */
const ELEVATED_SHADOW = '0px 2px 2px 0px rgba(0, 0, 0, 0.25), 0px 3px 3px 0px rgba(0, 0, 0, 0.25)'

const quickActionButtonVariants = cva(
  // Base styles
  [
    'relative inline-flex items-center justify-center',
    'overflow-hidden',
    'transition-all duration-200',
    'active:scale-95',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent',
    'cursor-pointer',
    'select-none',
    // Touch-friendly
    'touch-manipulation',
  ],
  {
    variants: {
      size: {
        sm: 'w-12 h-12 rounded-xl',       // 48px
        md: 'w-14 h-14 rounded-xl',       // 56px
        lg: 'w-16 h-16 rounded-2xl',      // 64px - matches Figma
        xl: 'w-20 h-20 rounded-2xl',      // 80px
      },
    },
    defaultVariants: {
      size: 'lg',
    },
  }
)

// =============================================================================
// COMPONENT
// =============================================================================

export interface QuickActionButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'>,
    VariantProps<typeof quickActionButtonVariants> {
  /** Button variant determines gradient and default icon */
  variant?: QuickActionVariant
  /** Custom icon to override the default variant icon */
  icon?: React.ReactNode
  /** Custom gradient fill (only used with variant="custom") */
  customFill?: string
  /** Custom border gradient (only used with variant="custom") */
  customBorder?: string
  /** Accessible label for screen readers */
  'aria-label'?: string
}

/**
 * QuickActionButton - Prominent gradient button for mobile navigation
 *
 * A highly visible action button designed to be placed in the center of
 * mobile navigation bars for quick access to key actions like reporting
 * incidents, creating records, or emergency calls.
 *
 * Features:
 * - Vertical gradient fill from light → medium → dark
 * - Glass-like gradient border (white → transparent)
 * - Multiple preset variants with appropriate icons
 * - Touch-optimized with active state feedback
 * - Customizable icon and gradient
 *
 * @example
 * ```tsx
 * // Default incident reporting button
 * <QuickActionButton onClick={handleReportIncident} />
 *
 * // Create action
 * <QuickActionButton variant="create" onClick={handleCreate} />
 *
 * // Emergency call
 * <QuickActionButton variant="emergency" onClick={handleEmergency} />
 *
 * // Custom icon
 * <QuickActionButton variant="incident" icon={<CustomIcon />} />
 *
 * // In mobile nav context
 * <nav className="fixed bottom-0 flex items-center justify-around">
 *   <NavItem />
 *   <QuickActionButton variant="incident" />
 *   <NavItem />
 * </nav>
 * ```
 */
const QuickActionButton = React.forwardRef<HTMLButtonElement, QuickActionButtonProps>(
  (
    {
      className,
      variant = 'incident',
      size,
      icon,
      customFill,
      customBorder,
      'aria-label': ariaLabel,
      disabled,
      ...props
    },
    ref
  ) => {
    // Get config for variant (or use incident as fallback for custom)
    const config = variant === 'custom'
      ? variantConfig.incident
      : variantConfig[variant]

    const IconComponent = config.icon
    const iconSizes = { sm: 20, md: 24, lg: 28, xl: 32 }
    const iconSize = iconSizes[size || 'lg']

    // Use custom gradients if variant is custom
    const fillGradient = variant === 'custom' && customFill ? customFill : config.fill
    const borderGradient = variant === 'custom' && customBorder ? customBorder : config.border

    return (
      <button
        ref={ref}
        type="button"
        data-slot="quick-action-button"
        data-variant={variant}
        disabled={disabled}
        aria-label={ariaLabel || config.label}
        className={cn(
          quickActionButtonVariants({ size }),
          disabled && 'opacity-50 cursor-not-allowed active:scale-100',
          className
        )}
        style={{
          background: fillGradient,
          boxShadow: ELEVATED_SHADOW,
        }}
        {...props}
      >
        {/* Gradient border overlay */}
        <span
          data-slot="quick-action-button-border"
          className="absolute inset-0 rounded-[inherit] pointer-events-none"
          style={{
            // eslint-disable-next-line no-restricted-syntax -- Border width for gradient mask technique, not spacing
            padding: '3px',
            background: borderGradient,
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
          aria-hidden="true"
        />

        {/* Icon */}
        <span
          data-slot="quick-action-button-icon"
          className="relative z-10 drop-shadow-md"
          style={{ color: config.iconColor }}
        >
          {icon || (
            // Custom icons (like AddIncidentIcon) don't accept strokeWidth
            // Lucide icons do - check by name to differentiate
            IconComponent === AddIncidentIcon ? (
              <IconComponent size={iconSize} />
            ) : (
              <IconComponent
                size={iconSize}
                strokeWidth={1.75}
                aria-hidden="true"
              />
            )
          )}
        </span>
      </button>
    )
  }
)

QuickActionButton.displayName = 'QuickActionButton'

// =============================================================================
// EXPORTS
// =============================================================================

export { QuickActionButton, quickActionButtonVariants }
