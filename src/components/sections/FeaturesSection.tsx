import { ReactNode } from 'react'
import { cn } from '../../lib/utils'

// =============================================================================
// TYPES
// =============================================================================

export interface Feature {
  /** Icon or visual element */
  icon: ReactNode
  /** Feature title */
  title: string
  /** Feature description */
  description: string
  /** Icon background color */
  iconBgColor?: string
}

export interface FeaturesSectionProps {
  /** Section title */
  title: string
  /** Section subtitle */
  subtitle?: string
  /** Features to display */
  features: Feature[]
  /** Number of columns on desktop */
  columns?: 2 | 3 | 4
  /** Background style */
  background?: 'white' | 'cream'
  /** Center the header */
  centeredHeader?: boolean
  /** Additional class name */
  className?: string
}

// =============================================================================
// FEATURE CARD
// =============================================================================

interface FeatureCardProps extends Feature {
  className?: string
}

function FeatureCard({
  icon,
  title,
  description,
  iconBgColor = '#2D6FE9',
  className,
}: FeatureCardProps) {
  return (
    <div className={cn('flex flex-col', className)}>
      {/* Icon */}
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
        style={{ backgroundColor: iconBgColor }}
      >
        {icon}
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold text-dark mb-2">{title}</h3>

      {/* Description */}
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  )
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

/**
 * Reusable Features Section with configurable grid layout.
 * Displays feature cards with icons, titles, and descriptions.
 */
export function FeaturesSection({
  title,
  subtitle,
  features,
  columns = 4,
  background = 'white',
  centeredHeader = true,
  className,
}: FeaturesSectionProps) {
  const bgClasses = {
    white: 'bg-white',
    cream: 'bg-cream',
  }

  const gridClasses = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  }

  return (
    <section
      className={cn(
        'py-8 sm:py-12 lg:py-16 border-y-dashed-figma overflow-hidden',
        bgClasses[background],
        className
      )}
      data-element="features-section"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
        {/* Header */}
        <div
          className={cn(
            'mb-10',
            centeredHeader ? 'text-center' : 'text-left lg:text-center'
          )}
        >
          <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-display font-bold leading-[1.2] text-dark mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm sm:text-base lg:text-lg font-display font-medium text-teal max-w-[560px] mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        {/* Features Grid */}
        <div className={cn('grid gap-8', gridClasses[columns])}>
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  )
}
