/**
 * Shared Story Decorators
 *
 * These decorators provide consistent story wrappers across all atomic levels.
 * Import these instead of creating inline decorators in stories.
 *
 * @example
 * import { StoryContainer, DarkBackgroundDecorator } from '@/stories/_infrastructure/decorators'
 */

import type { Decorator } from '@storybook/react'
import type { ReactNode } from 'react'

// =============================================================================
// CONTAINER WIDTHS - Standardized across all stories
// =============================================================================

export const STORY_WIDTHS = {
  /** For atoms: inputs, buttons, small controls */
  atom: 'max-w-md', // 448px
  /** For molecules: cards, forms, dialogs */
  molecule: 'max-w-xl', // 576px
  /** For organisms: headers, complex sections */
  organism: 'max-w-4xl', // 896px
  /** For templates/pages: full layouts */
  page: 'max-w-7xl', // 1280px
  /** Unrestricted width */
  full: 'w-full',
} as const

// =============================================================================
// SPACING - Consistent gaps between story sections
// =============================================================================

export const STORY_SPACING = {
  /** Between variants in a grid/flex: 16px */
  variants: 'gap-4',
  /** Between sections in AllStates: 32px */
  sections: 'space-y-8',
  /** Section title to content: 16px */
  sectionContent: 'space-y-4',
  /** Padding inside containers: 24px */
  container: 'p-6',
} as const

// =============================================================================
// DECORATORS
// =============================================================================

/**
 * Standard container decorator with consistent padding and max-width.
 * Use for most component stories.
 *
 * @param width - One of STORY_WIDTHS keys (default: 'molecule')
 *
 * @example
 * decorators: [withStoryContainer('atom')]
 */
export const withStoryContainer = (
  width: keyof typeof STORY_WIDTHS = 'molecule'
): Decorator => {
  return (Story) => (
    <div className={`${STORY_WIDTHS[width]} ${STORY_SPACING.container} mx-auto`}>
      <Story />
    </div>
  )
}

/**
 * Dark background decorator for components that need dark context.
 * Includes proper padding and rounded corners.
 *
 * @example
 * // In story definition:
 * OnDarkBackground: {
 *   decorators: [withDarkBackground()],
 * }
 */
export const withDarkBackground = (): Decorator => {
  return (Story) => (
    <div className="bg-inverse-bg p-8 rounded-lg">
      <Story />
    </div>
  )
}

/**
 * Light surface decorator for components shown on accent backgrounds.
 *
 * @example
 * decorators: [withSurfaceBackground()]
 */
export const withSurfaceBackground = (): Decorator => {
  return (Story) => (
    <div className="bg-surface p-8 rounded-lg border border-default">
      <Story />
    </div>
  )
}

/**
 * Fullscreen decorator for layout components (headers, sidebars, pages).
 * Sets minimum height and white background.
 *
 * @param minHeight - Minimum height CSS value (default: '200px')
 *
 * @example
 * decorators: [withFullscreen('100vh')]
 */
export const withFullscreen = (minHeight = '200px'): Decorator => {
  return (Story) => (
    <div className="bg-white" style={{ minHeight }}>
      <Story />
    </div>
  )
}

// =============================================================================
// STORY SECTION COMPONENTS
// =============================================================================

interface StorySectionProps {
  title: string
  description?: string
  children: ReactNode
}

/**
 * Section wrapper for AllStates stories.
 * Provides consistent title styling and spacing.
 *
 * @example
 * <StorySection title="Size Variants" description="All available sizes">
 *   <Button size="sm">Small</Button>
 *   <Button size="default">Default</Button>
 * </StorySection>
 */
export function StorySection({ title, description, children }: StorySectionProps) {
  return (
    <div className={STORY_SPACING.sectionContent}>
      <div>
        <h3 className="text-lg font-semibold text-primary">{title}</h3>
        {description && (
          <p className="text-sm text-secondary mt-1">{description}</p>
        )}
      </div>
      {children}
    </div>
  )
}

interface StoryGridProps {
  children: ReactNode
  /** Number of columns (default: auto-fit) */
  cols?: 1 | 2 | 3 | 4 | 'auto'
  /** Gap between items (default: 'variants') */
  gap?: keyof typeof STORY_SPACING
}

/**
 * Grid container for displaying multiple variants.
 * Automatically handles responsive behavior.
 *
 * @example
 * <StoryGrid cols={3}>
 *   <Button variant="default">Default</Button>
 *   <Button variant="outline">Outline</Button>
 *   <Button variant="ghost">Ghost</Button>
 * </StoryGrid>
 */
export function StoryGrid({ children, cols = 'auto', gap = 'variants' }: StoryGridProps) {
  const colsClass =
    cols === 'auto'
      ? 'grid-cols-[repeat(auto-fit,minmax(200px,1fr))]'
      : `grid-cols-${cols}`

  return (
    <div className={`grid ${colsClass} ${STORY_SPACING[gap]}`}>
      {children}
    </div>
  )
}

interface StoryFlexProps {
  children: ReactNode
  /** Direction (default: 'row') */
  direction?: 'row' | 'column'
  /** Alignment (default: 'center') */
  align?: 'start' | 'center' | 'end' | 'stretch'
  /** Wrap items (default: true) */
  wrap?: boolean
}

/**
 * Flex container for displaying variants in a row or column.
 *
 * @example
 * <StoryFlex direction="row" align="center">
 *   <Button size="sm">Small</Button>
 *   <Button size="default">Default</Button>
 *   <Button size="lg">Large</Button>
 * </StoryFlex>
 */
export function StoryFlex({
  children,
  direction = 'row',
  align = 'center',
  wrap = true,
}: StoryFlexProps) {
  const directionClass = direction === 'row' ? 'flex-row' : 'flex-col'
  const alignClass = `items-${align}`
  const wrapClass = wrap ? 'flex-wrap' : ''

  return (
    <div className={`flex ${directionClass} ${alignClass} ${wrapClass} ${STORY_SPACING.variants}`}>
      {children}
    </div>
  )
}

// =============================================================================
// INFO COMPONENTS
// =============================================================================

interface StoryInfoBoxProps {
  children: ReactNode
  variant?: 'info' | 'warning' | 'success'
}

/**
 * Info box for adding notes, keyboard hints, or warnings to stories.
 *
 * @example
 * <StoryInfoBox variant="info">
 *   <strong>Keyboard Navigation:</strong> Use Tab to navigate between elements.
 * </StoryInfoBox>
 */
export function StoryInfoBox({ children, variant = 'info' }: StoryInfoBoxProps) {
  const variantStyles = {
    info: 'bg-muted-bg border-muted',
    warning: 'bg-warning-subtle border-warning',
    success: 'bg-success-subtle border-success',
  }

  return (
    <div className={`px-6 py-4 rounded-lg border ${variantStyles[variant]}`}>
      <div className="text-sm text-primary">{children}</div>
    </div>
  )
}

/**
 * Anatomy diagram box for showing component slots/parts.
 *
 * @example
 * <StoryAnatomy
 *   slots={[
 *     { name: 'app-header', description: 'Main header container' },
 *     { name: 'logo', description: 'Logo section' },
 *   ]}
 * />
 */
export function StoryAnatomy({
  slots,
}: {
  slots: Array<{ name: string; description: string }>
}) {
  return (
    <StoryInfoBox>
      <h4 className="font-semibold mb-3">Component Anatomy</h4>
      <div className="space-y-2 text-sm">
        {slots.map((slot) => (
          <p key={slot.name}>
            <code className="px-2 py-1 bg-surface rounded text-xs">
              data-slot="{slot.name}"
            </code>{' '}
            - {slot.description}
          </p>
        ))}
      </div>
    </StoryInfoBox>
  )
}
