import * as React from "react"
import { cn } from "../../lib/utils"

// ============== CONSTANTS ==============

/**
 * Default bottom margin for heading text
 * @constant
 */
const HEADING_MARGIN_BOTTOM_CLASS = "mb-2"

/**
 * Default bottom margin for subtitle container
 * @constant
 */
const SUBTITLE_MARGIN_BOTTOM_CLASS = "mb-4"

/**
 * Default top margin for separator
 * @constant
 */
const SEPARATOR_MARGIN_TOP_CLASS = "mt-4"

/**
 * Data slot identifier for testing
 * @constant
 */
const DATA_SLOT_ROOT = "section-heading"

/**
 * Data slot identifier for title element
 * @constant
 */
const DATA_SLOT_TITLE = "section-heading-title"

/**
 * Data slot identifier for subtitle element
 * @constant
 */
const DATA_SLOT_SUBTITLE = "section-heading-subtitle"

/**
 * Data slot identifier for separator element
 * @constant
 */
const DATA_SLOT_SEPARATOR = "section-heading-separator"

// ============== TYPES ==============

/**
 * Props for the SectionHeading component
 */
export interface SectionHeadingProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Main heading text */
  title: string
  /** Subheading text */
  subtitle?: string
  /** Whether to show separator line after subtitle */
  showSeparator?: boolean
  /** Center align the heading group on desktop */
  centered?: boolean
  /** Hide separator on mobile viewport */
  hideSeparatorOnMobile?: boolean
}

// ============== HELPER FUNCTIONS ==============

/**
 * Generates alignment class based on centered prop.
 * Left-aligned on mobile, optionally centered on desktop.
 */
function getAlignmentClass(centered: boolean): string {
  return centered ? "lg:items-center lg:text-center" : ""
}

/**
 * Generates visibility class for separator based on mobile visibility.
 */
function getSeparatorVisibilityClass(hideSeparatorOnMobile: boolean): string {
  return hideSeparatorOnMobile ? "hidden sm:block" : ""
}

// ============== COMPONENTS ==============

/**
 * SectionHeading - Section title group with optional subtitle and separator.
 *
 * Provides consistent typography and spacing for section headings across
 * the application. Supports responsive alignment and optional visual
 * separator element.
 *
 * @component ATOM
 *
 * @example
 * ```tsx
 * // Basic heading
 * <SectionHeading title="Our Services" />
 *
 * // With subtitle
 * <SectionHeading
 *   title="Our Services"
 *   subtitle="What we offer"
 * />
 *
 * // Centered on desktop with separator
 * <SectionHeading
 *   title="Our Services"
 *   subtitle="What we offer"
 *   centered
 *   showSeparator
 * />
 *
 * // Without separator
 * <SectionHeading
 *   title="Contact Us"
 *   subtitle="Get in touch"
 *   showSeparator={false}
 * />
 * ```
 *
 * **Features:**
 * - Responsive typography (scales with viewport)
 * - Optional subtitle with secondary color
 * - Optional dashed separator line
 * - Mobile-first alignment (left on mobile, optionally centered on desktop)
 * - Semantic HTML structure
 *
 * **Design System Compliance:**
 * - Typography: Display font family for headings
 * - Colors: text-primary for title, text-secondary for subtitle
 * - Spacing: Consistent margin rhythm (mb-2 for title, mb-4 for subtitle, mt-4 for separator)
 *
 * **Testing:**
 * - `data-slot="section-heading"` - Root container
 * - `data-slot="section-heading-title"` - Title h2 element
 * - `data-slot="section-heading-subtitle"` - Subtitle paragraph
 * - `data-slot="section-heading-separator"` - Separator line
 *
 * @accessibility
 * - Uses semantic h2 for proper document outline
 * - Subtitle is associated visually (not aria-describedby, as it's decorative)
 */
export function SectionHeading({
  title,
  subtitle,
  showSeparator = true,
  centered = false,
  hideSeparatorOnMobile = true,
  className,
  ...props
}: SectionHeadingProps) {
  const alignClass = getAlignmentClass(centered)
  const separatorClass = getSeparatorVisibilityClass(hideSeparatorOnMobile)

  return (
    <div
      data-slot={DATA_SLOT_ROOT}
      className={cn("flex flex-col", alignClass, className)}
      {...props}
    >
      <h2
        data-slot={DATA_SLOT_TITLE}
        className={cn(
          "text-2xl sm:text-3xl lg:text-3xl",
          "font-display font-bold",
          "text-primary",
          "leading-[1.2]",
          HEADING_MARGIN_BOTTOM_CLASS
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <div className={cn("lg:w-fit", SUBTITLE_MARGIN_BOTTOM_CLASS)}>
          <p
            data-slot={DATA_SLOT_SUBTITLE}
            className="text-sm sm:text-base lg:text-lg font-display font-medium text-secondary"
          >
            {subtitle}
          </p>
          {showSeparator && (
            <div
              data-slot={DATA_SLOT_SEPARATOR}
              className={cn(
                "separator-dashed w-full",
                SEPARATOR_MARGIN_TOP_CLASS,
                separatorClass
              )}
            />
          )}
        </div>
      )}
    </div>
  )
}

SectionHeading.displayName = "SectionHeading"

export default SectionHeading
