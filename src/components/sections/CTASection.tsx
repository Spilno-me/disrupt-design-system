import { ReactNode } from 'react'
import { cn } from '../../lib/utils'
import { Button } from '../ui/button'

// =============================================================================
// TYPES
// =============================================================================

export interface CTASectionProps {
  /** Main heading text */
  title: string
  /** Supporting subtitle text */
  subtitle?: string
  /** Primary button text */
  buttonText: string
  /** Button click handler */
  onButtonClick?: () => void
  /** Button variant */
  buttonVariant?: 'default' | 'contact' | 'outline'
  /** Secondary button text (optional) */
  secondaryButtonText?: string
  /** Secondary button click handler */
  onSecondaryButtonClick?: () => void
  /** Background style */
  background?: 'white' | 'cream' | 'dark'
  /** Center content on all screen sizes */
  centered?: boolean
  /** Show background blob animation */
  showBlob?: boolean
  /** Additional class name */
  className?: string
  /** Custom content below the subtitle */
  children?: ReactNode
}

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * Reusable Call-to-Action Section.
 * Displays a heading, subtitle, and action button(s).
 */
export function CTASection({
  title,
  subtitle,
  buttonText,
  onButtonClick,
  buttonVariant = 'contact',
  secondaryButtonText,
  onSecondaryButtonClick,
  background = 'white',
  centered = true,
  showBlob: _showBlob = false,
  className,
  children,
}: CTASectionProps) {
  const bgClasses = {
    white: 'bg-white',
    cream: 'bg-cream',
    dark: 'bg-dark',
  }

  const textClasses = {
    white: 'text-dark',
    cream: 'text-dark',
    dark: 'text-white',
  }

  const alignClasses = centered
    ? 'items-center text-center'
    : 'items-start lg:items-center text-left lg:text-center'

  return (
    <section
      className={cn(
        'py-8 sm:py-12 lg:py-16 relative border-y-dashed-figma overflow-hidden',
        bgClasses[background],
        className
      )}
      data-element="cta-section"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 relative z-[1]">
        <div className={cn('flex flex-col', alignClasses)}>
          {/* Heading */}
          <h2
            className={cn(
              'text-2xl sm:text-3xl lg:text-[32px] font-display font-bold leading-[1.2] mb-4',
              textClasses[background]
            )}
          >
            {title}
          </h2>

          {/* Subheading */}
          {subtitle && (
            <p
              className={cn(
                'text-sm sm:text-base lg:text-lg font-display font-medium max-w-[560px] mb-8',
                background === 'dark' ? 'text-teal' : 'text-teal'
              )}
            >
              {subtitle}
            </p>
          )}

          {/* Custom content */}
          {children}

          {/* Buttons */}
          <div className={cn('flex gap-4', centered ? '' : 'self-end sm:self-auto')}>
            {secondaryButtonText && (
              <Button variant="outline" onClick={onSecondaryButtonClick}>
                {secondaryButtonText}
              </Button>
            )}
            <Button variant={buttonVariant} onClick={onButtonClick}>
              {buttonText}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
