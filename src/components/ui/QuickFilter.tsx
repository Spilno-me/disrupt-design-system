import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'
import { SHADOWS, RADIUS } from '../../constants/designTokens'
import { FileText, Flag, Barrel, Search, ClipboardCheck, Clock } from 'lucide-react'

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
  'relative flex flex-col items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105',
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
        true: '',
        false: '',
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

    // Clone icon with proper color
    const coloredIcon = icon && React.isValidElement(icon)
      ? React.cloneElement(icon as React.ReactElement<{ style?: React.CSSProperties; color?: string }>, {
          style: { ...(icon.props as { style?: React.CSSProperties }).style, color: colors.icon },
          color: colors.icon,
        })
      : icon

    return (
      <button
        ref={ref}
        className={cn(
          quickFilterItemVariants({ variant, size, selected }),
          'overflow-hidden',
          className
        )}
        style={{
          // Uses CSS variables for dark mode support
          background: 'linear-gradient(180deg, var(--color-surface) 0%, var(--color-surface-hover) 100%)',
          boxShadow: SHADOWS.sm,
          borderRadius: RADIUS.md,
        }}
        {...props}
      >
        {/* Gradient border overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            border: '2px solid transparent',
            // Uses rgba white for the fade effect - works on both light and dark backgrounds
            background: `linear-gradient(180deg, rgba(255,255,255,0.2) 0%, ${colors.border} 60%, ${colors.border} 100%) border-box`,
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
 */
export const QuickFilter = React.forwardRef<HTMLDivElement, QuickFilterProps>(
  ({ className, children, gap = 'md', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex flex-row items-center flex-wrap', gapClasses[gap], className)}
        {...props}
      >
        {children}
      </div>
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
