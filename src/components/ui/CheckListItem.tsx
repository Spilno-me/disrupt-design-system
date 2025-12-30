import { AnimatedCheck } from './AnimatedCheck'
import { cn } from '../../lib/utils'

// =============================================================================
// CONSTANTS
// =============================================================================

/** Icon size classes for responsive design (mobile / desktop) */
const ICON_SIZE_CLASS = 'w-5 h-5 sm:w-6 sm:h-6'

/** Gap between icon and text (mobile / desktop) */
const ICON_TEXT_GAP = 'gap-3 sm:gap-4'

/** Text size classes (mobile / desktop) */
const TEXT_SIZE_CLASS = 'text-base sm:text-lg'

/** Text color variants mapping */
const TEXT_COLOR_VARIANTS = {
  dark: 'text-primary',
  muted: 'text-muted',
} as const

// =============================================================================
// TYPES
// =============================================================================

export interface CheckListItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Bold label text (e.g., "For Companies →") */
  label: string
  /** Description text following the label */
  text: string
  /** Whether the label should be bold (default: true) */
  boldLabel?: boolean
  /** Text color for the content */
  textColor?: keyof typeof TEXT_COLOR_VARIANTS
  /** Whether to animate immediately on mount (for hero sections) */
  autoAnimate?: boolean
  /** Index for staggered animations */
  index?: number
}

// =============================================================================
// COMPONENTS
// =============================================================================

/**
 * CheckListItem - Reusable list item with animated teal checkmark icon.
 *
 * Used for feature lists, benefits sections, and proof points.
 * The checkmark animates into view for engaging visual feedback.
 *
 * @component ATOM
 *
 * @example
 * ```tsx
 * // Basic usage with bold label
 * <CheckListItem
 *   label="For Companies →"
 *   text="Streamline your workflow with automation"
 * />
 *
 * // Without bold label
 * <CheckListItem
 *   label="Feature name"
 *   text="Feature description"
 *   boldLabel={false}
 * />
 *
 * // Muted text variant
 * <CheckListItem
 *   label="Secondary item"
 *   text="Less prominent description"
 *   textColor="muted"
 * />
 *
 * // Auto-animate for hero sections
 * <CheckListItem
 *   label="Instant setup"
 *   text="Get started in minutes"
 *   autoAnimate
 *   index={0}
 * />
 * ```
 *
 * **Features:**
 * - Animated checkmark that draws on scroll or mount
 * - Staggered animation support via index prop
 * - Responsive sizing (smaller on mobile)
 * - Two text color variants (dark/muted)
 *
 * **Design System Compliance:**
 * - Spacing: Uses 4px grid (gap-3/gap-4)
 * - Typography: text-base/text-lg, leading-relaxed
 * - Colors: text-primary (dark) or text-muted (muted variant)
 *
 * **Testing:**
 * - `data-slot="checklist-item"` - Root container
 * - `data-slot="checklist-icon"` - Animated check wrapper
 * - `data-slot="checklist-text"` - Text content wrapper
 * - `data-slot="checklist-label"` - Label span (when bold)
 *
 * @see AnimatedCheck for animation details
 */
function CheckListItem({
  label,
  text,
  boldLabel = true,
  textColor = 'dark',
  autoAnimate = false,
  index = 0,
  className,
  ...props
}: CheckListItemProps) {
  const textColorClass = TEXT_COLOR_VARIANTS[textColor]

  return (
    <div
      data-slot="checklist-item"
      className={cn('flex items-start', ICON_TEXT_GAP, className)}
      {...props}
    >
      {/* Animated checkmark icon */}
      <div data-slot="checklist-icon">
        <AnimatedCheck
          className={ICON_SIZE_CLASS}
          autoAnimate={autoAnimate}
          index={index}
        />
      </div>

      {/* Text content */}
      <p
        data-slot="checklist-text"
        className={cn(textColorClass, TEXT_SIZE_CLASS, 'leading-relaxed')}
      >
        {boldLabel ? (
          <>
            <span data-slot="checklist-label" className="font-semibold">
              {label}
            </span>{' '}
            {text}
          </>
        ) : (
          <>
            {label} {text}
          </>
        )}
      </p>
    </div>
  )
}
CheckListItem.displayName = 'CheckListItem'

export { CheckListItem }
