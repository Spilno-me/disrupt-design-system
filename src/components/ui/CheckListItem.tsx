import { AnimatedCheck } from './AnimatedCheck'

interface CheckListItemProps {
  /** Bold label text (e.g., "For Companies →") */
  label: string
  /** Description text following the label */
  text: string
  /** Whether the label should be bold (default: true) */
  boldLabel?: boolean
  /** Text color for the content (default: dark) */
  textColor?: 'dark' | 'muted'
  /** Whether to animate immediately on mount (for hero sections) */
  autoAnimate?: boolean
  /** Index for staggered animations */
  index?: number
}

/**
 * Reusable check list item with animated teal checkmark icon.
 * Used across WhoWeHelpSection, ProofSection, FutureCapabilitiesSection, etc.
 */
export function CheckListItem({
  label,
  text,
  boldLabel = true,
  textColor = 'dark',
  autoAnimate = false,
  index = 0,
}: CheckListItemProps) {
  const textColorClass = textColor === 'dark' ? 'text-primary' : 'text-muted'

  return (
    <div className="flex items-start gap-3 sm:gap-4">
      {/* Animated checkmark icon */}
      <AnimatedCheck
        className="w-5 h-5 sm:w-6 sm:h-6"
        autoAnimate={autoAnimate}
        index={index}
      />

      {/* Text content */}
      <p className={`${textColorClass} text-base sm:text-lg leading-relaxed`}>
        {boldLabel ? (
          <>
            <span className="font-semibold">{label}</span> {text}
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
