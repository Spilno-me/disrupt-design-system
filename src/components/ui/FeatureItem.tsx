import { COLORS } from '../../constants/designTokens'

// =============================================================================
// TYPES
// =============================================================================

export interface FeatureItemProps {
  /** Icon component - any React component that accepts className, style, and strokeWidth */
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties; strokeWidth?: number }>
  /** Feature title */
  title: string
  /** Feature description */
  description: string
  /** Optional custom icon color (defaults to darkPurple) */
  iconColor?: string
  /** Optional custom title color (defaults to darkPurple) */
  titleColor?: string
  /** Optional custom description color (defaults to muted) */
  descriptionColor?: string
  /** Optional custom icon background color (defaults to darkPurple/10) */
  iconBgColor?: string
  /** Optional additional class names */
  className?: string
}

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * FeatureItem - A horizontal feature display with icon, title, and description.
 * Used in sections like Strategic Advisory to display individual features/capabilities.
 */
export function FeatureItem({
  icon: Icon,
  title,
  description,
  iconColor = COLORS.darkPurple,
  titleColor = COLORS.darkPurple,
  descriptionColor = COLORS.muted,
  iconBgColor,
  className = '',
}: FeatureItemProps) {
  // Default background is 10% opacity of the icon color
  const bgColor = iconBgColor || `${iconColor}1A` // 1A = 10% opacity in hex

  return (
    <div className={`flex gap-4 ${className}`}>
      <div
        className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center"
        style={{ backgroundColor: bgColor }}
      >
        <Icon
          className="w-6 h-6"
          style={{ color: iconColor }}
          strokeWidth={2}
        />
      </div>
      <div className="flex flex-col gap-1">
        <h4
          className="font-sans font-bold text-base tracking-tight"
          style={{ color: titleColor }}
        >
          {title}
        </h4>
        <p
          className="font-sans text-sm leading-[1.43] tracking-tight"
          style={{ color: descriptionColor }}
        >
          {description}
        </p>
      </div>
    </div>
  )
}
