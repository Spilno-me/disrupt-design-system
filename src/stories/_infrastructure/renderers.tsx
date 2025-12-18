/**
 * Story Render Utilities
 *
 * Helper functions for rendering consistent variant grids, state matrices,
 * and other common story patterns. These replace inline render functions
 * with standardized implementations.
 *
 * @example
 * import { renderVariants, renderSizes } from '@/stories/_infrastructure/renderers'
 *
 * export const AllVariants: Story = {
 *   render: () => renderVariants(Button, BUTTON_VARIANTS),
 * }
 */

import type { ComponentType, ReactElement, ReactNode } from 'react'
import { StorySection, StoryFlex, STORY_SPACING } from './decorators'

// =============================================================================
// TYPES
// =============================================================================

interface VariantConfig {
  /** Display label for the variant */
  label: string
  /** Props to apply for this variant */
  props: Record<string, unknown>
}

interface StateConfig {
  /** Display label for the state */
  label: string
  /** Props to apply for this state */
  props: Record<string, unknown>
  /** Optional wrapper element */
  wrapper?: (children: ReactNode) => ReactElement
}

// =============================================================================
// VARIANT RENDERERS
// =============================================================================

/**
 * Renders all variants of a component in a flex row.
 *
 * @param Component - The React component to render
 * @param variants - Array of variant configurations
 * @param baseProps - Props applied to all variants
 *
 * @example
 * const BUTTON_VARIANTS: VariantConfig[] = [
 *   { label: 'Default', props: { variant: 'default' } },
 *   { label: 'Outline', props: { variant: 'outline' } },
 *   { label: 'Ghost', props: { variant: 'ghost' } },
 * ]
 *
 * export const AllVariants: Story = {
 *   render: () => renderVariants(Button, BUTTON_VARIANTS, { children: 'Click me' }),
 * }
 */
export function renderVariants<P extends Record<string, unknown>>(
  Component: ComponentType<P>,
  variants: VariantConfig[],
  baseProps: Partial<P> = {}
): ReactElement {
  return (
    <StoryFlex direction="row" align="center" wrap>
      {variants.map((variant) => (
        <Component
          key={variant.label}
          {...(baseProps as P)}
          {...(variant.props as P)}
        />
      ))}
    </StoryFlex>
  )
}

/**
 * Renders all sizes of a component in a flex row with center alignment.
 *
 * @param Component - The React component to render
 * @param sizes - Array of size values (e.g., ['sm', 'default', 'lg'])
 * @param baseProps - Props applied to all sizes
 *
 * @example
 * export const AllSizes: Story = {
 *   render: () => renderSizes(Button, ['sm', 'default', 'lg'], { children: 'Button' }),
 * }
 */
export function renderSizes<P extends Record<string, unknown>>(
  Component: ComponentType<P>,
  sizes: string[],
  baseProps: Partial<P> = {}
): ReactElement {
  return (
    <StoryFlex direction="row" align="center" wrap>
      {sizes.map((size) => (
        <Component key={size} {...(baseProps as P)} size={size} />
      ))}
    </StoryFlex>
  )
}

/**
 * Renders a component in multiple states (default, disabled, loading, etc.).
 *
 * @param Component - The React component to render
 * @param states - Array of state configurations
 * @param baseProps - Props applied to all states
 *
 * @example
 * const BUTTON_STATES: StateConfig[] = [
 *   { label: 'Default', props: {} },
 *   { label: 'Disabled', props: { disabled: true } },
 *   { label: 'Loading', props: { loading: true } },
 * ]
 *
 * export const AllStates: Story = {
 *   render: () => renderStates(Button, BUTTON_STATES, { children: 'Button' }),
 * }
 */
export function renderStates<P extends Record<string, unknown>>(
  Component: ComponentType<P>,
  states: StateConfig[],
  baseProps: Partial<P> = {}
): ReactElement {
  return (
    <div className={STORY_SPACING.sections}>
      {states.map((state) => {
        const element = (
          <Component {...(baseProps as P)} {...(state.props as P)} />
        )

        return (
          <div key={state.label} className="space-y-2">
            <p className="text-xs font-medium text-secondary">{state.label}</p>
            {state.wrapper ? state.wrapper(element) : element}
          </div>
        )
      })}
    </div>
  )
}

// =============================================================================
// MATRIX RENDERERS
// =============================================================================

/**
 * Renders a matrix showing all combinations of two prop dimensions.
 * Useful for showing variants × sizes or variants × states.
 *
 * @param Component - The React component to render
 * @param rowDimension - First dimension config (e.g., variants)
 * @param colDimension - Second dimension config (e.g., sizes)
 * @param baseProps - Props applied to all items
 *
 * @example
 * export const VariantSizeMatrix: Story = {
 *   render: () => renderMatrix(
 *     Button,
 *     { name: 'variant', values: ['default', 'outline', 'ghost'] },
 *     { name: 'size', values: ['sm', 'default', 'lg'] },
 *     { children: 'Button' }
 *   ),
 * }
 */
export function renderMatrix<P extends Record<string, unknown>>(
  Component: ComponentType<P>,
  rowDimension: { name: string; values: string[] },
  colDimension: { name: string; values: string[] },
  baseProps: Partial<P> = {}
): ReactElement {
  return (
    <div className="overflow-x-auto">
      <table className="border-collapse">
        <thead>
          <tr>
            <th className="p-2 text-xs font-medium text-secondary text-left">
              {rowDimension.name} / {colDimension.name}
            </th>
            {colDimension.values.map((col) => (
              <th key={col} className="p-2 text-xs font-medium text-secondary">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rowDimension.values.map((row) => (
            <tr key={row}>
              <td className="p-2 text-xs font-medium text-secondary">{row}</td>
              {colDimension.values.map((col) => (
                <td key={`${row}-${col}`} className="p-2">
                  <Component
                    {...(baseProps as P)}
                    {...({ [rowDimension.name]: row, [colDimension.name]: col } as P)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// =============================================================================
// SECTION RENDERERS
// =============================================================================

interface SectionGroup<P> {
  title: string
  description?: string
  items: Array<{
    label: string
    props: Partial<P>
    wrapper?: (children: ReactNode) => ReactElement
  }>
}

/**
 * Renders grouped sections for AllStates-style stories.
 * Provides consistent structure for comprehensive variant displays.
 *
 * @param Component - The React component to render
 * @param sections - Array of section groups
 * @param baseProps - Props applied to all items
 *
 * @example
 * export const AllStates: Story = {
 *   render: () => renderSections(Button, [
 *     {
 *       title: 'Variants',
 *       items: [
 *         { label: 'Default', props: { variant: 'default' } },
 *         { label: 'Outline', props: { variant: 'outline' } },
 *       ],
 *     },
 *     {
 *       title: 'Sizes',
 *       items: [
 *         { label: 'Small', props: { size: 'sm' } },
 *         { label: 'Large', props: { size: 'lg' } },
 *       ],
 *     },
 *   ], { children: 'Button' }),
 * }
 */
export function renderSections<P extends Record<string, unknown>>(
  Component: ComponentType<P>,
  sections: SectionGroup<P>[],
  baseProps: Partial<P> = {}
): ReactElement {
  return (
    <div className={STORY_SPACING.sections}>
      {sections.map((section) => (
        <StorySection
          key={section.title}
          title={section.title}
          description={section.description}
        >
          <div className="space-y-4">
            {section.items.map((item) => {
              const element = (
                <Component {...(baseProps as P)} {...(item.props as P)} />
              )

              return (
                <div key={item.label}>
                  <p className="text-xs font-medium text-secondary mb-2">
                    {item.label}
                  </p>
                  {item.wrapper ? item.wrapper(element) : element}
                </div>
              )
            })}
          </div>
        </StorySection>
      ))}
    </div>
  )
}

// =============================================================================
// COMPARISON RENDERERS
// =============================================================================

/**
 * Renders a before/after comparison view.
 * Useful for showing light vs dark mode, old vs new, etc.
 *
 * @example
 * export const DarkModeComparison: Story = {
 *   render: () => renderComparison(
 *     <Button>Light Mode</Button>,
 *     <div className="bg-inverse-bg p-4 rounded"><Button>Dark Mode</Button></div>,
 *     { leftLabel: 'Light Mode', rightLabel: 'Dark Mode' }
 *   ),
 * }
 */
export function renderComparison(
  left: ReactElement,
  right: ReactElement,
  options: { leftLabel?: string; rightLabel?: string } = {}
): ReactElement {
  const { leftLabel = 'Before', rightLabel = 'After' } = options

  return (
    <div className="grid grid-cols-2 gap-8">
      <div className="space-y-2">
        <p className="text-xs font-medium text-secondary">{leftLabel}</p>
        {left}
      </div>
      <div className="space-y-2">
        <p className="text-xs font-medium text-secondary">{rightLabel}</p>
        {right}
      </div>
    </div>
  )
}

// =============================================================================
// INTERACTIVE DEMO RENDERER
// =============================================================================

interface InteractiveDemoConfig {
  title: string
  description: string
  content: ReactElement
  instructions?: string[]
}

/**
 * Renders an interactive demo with title, description, and keyboard hints.
 *
 * @example
 * export const Interactive: Story = {
 *   render: () => renderInteractiveDemo({
 *     title: 'Interactive Demo',
 *     description: 'Try interacting with the component below.',
 *     content: <Button onClick={() => alert('Clicked!')}>Click Me</Button>,
 *     instructions: ['Click the button to see an alert', 'Tab to focus'],
 *   }),
 * }
 */
export function renderInteractiveDemo(config: InteractiveDemoConfig): ReactElement {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-primary">{config.title}</h3>
        <p className="text-sm text-secondary mt-1">{config.description}</p>
      </div>

      <div className="p-6 bg-surface border border-default rounded-lg">
        {config.content}
      </div>

      {config.instructions && config.instructions.length > 0 && (
        <div className="px-4 py-3 bg-muted-bg rounded-lg">
          <p className="text-xs font-medium text-secondary mb-2">Try it:</p>
          <ul className="text-sm text-primary space-y-1">
            {config.instructions.map((instruction, i) => (
              <li key={i}>• {instruction}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
