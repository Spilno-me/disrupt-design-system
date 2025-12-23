/**
 * NextStepButton Stories
 *
 * Demonstrates all severity variants and states of the NextStepButton component.
 * Includes interaction tests for click, keyboard, and disabled behavior.
 */

import type { Meta, StoryObj } from '@storybook/react'
import { expect, within, userEvent, fn } from 'storybook/test'
import { NextStepButton, type NextStepSeverity } from '../../flow/components/next-step-button'
import {
  ATOM_META,
  atomDescription,
  StorySection,
  StoryFlex,
  StoryGrid,
  withDarkBackground,
} from '../../stories/_infrastructure'

// =============================================================================
// META
// =============================================================================

const meta: Meta<typeof NextStepButton> = {
  title: 'Core/NextStepButton',
  component: NextStepButton,
  ...ATOM_META,
  decorators: [withDarkBackground()],
  parameters: {
    ...ATOM_META.parameters,
    docs: {
      description: {
        component: atomDescription(
          `A severity-coded navigation button for workflow progression.

**Severity Variants:**
- \`critical\` - Red - Urgent items requiring immediate attention
- \`high\` - Orange - High priority items
- \`medium\` - Yellow - Medium priority items
- \`low\` - Green - Low priority items
- \`none\` - Teal - Neutral/informational items

**States:**
- Default: Outlined with severity-colored border and text
- Hover: Filled with severity color, white text
- Disabled: Reduced opacity, no interaction`
        ),
      },
    },
  },
  argTypes: {
    severity: {
      control: 'select',
      options: ['critical', 'high', 'medium', 'low', 'none'] satisfies NextStepSeverity[],
      description: 'Severity level determines the color scheme',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Button size variant',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the button',
    },
    children: {
      control: 'text',
      description: 'Button label text',
    },
  },
}

export default meta

type Story = StoryObj<typeof NextStepButton>

// =============================================================================
// STORIES
// =============================================================================

/**
 * Default NextStepButton with teal/none severity
 */
export const Default: Story = {
  args: {
    severity: 'none',
    children: 'Next Step',
  },
}

/**
 * Critical severity - for urgent items (red)
 */
export const Critical: Story = {
  args: {
    severity: 'critical',
    children: 'Next Step',
  },
}

/**
 * High severity - orange color scheme
 */
export const High: Story = {
  args: {
    severity: 'high',
    children: 'Next Step',
  },
}

/**
 * Medium severity - yellow color scheme
 */
export const Medium: Story = {
  args: {
    severity: 'medium',
    children: 'Next Step',
  },
}

/**
 * Low severity - green color scheme
 */
export const Low: Story = {
  args: {
    severity: 'low',
    children: 'Next Step',
  },
}

/**
 * Disabled state
 */
export const Disabled: Story = {
  args: {
    severity: 'none',
    disabled: true,
    children: 'Next Step',
  },
}

// =============================================================================
// INTERACTION TESTS
// =============================================================================

/**
 * Tests that onClick handler is called when button is clicked.
 */
export const ClickInteraction: Story = {
  args: {
    severity: 'critical',
    children: 'Next Step',
    onClick: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button', { name: /next step/i })

    // Click the button
    await userEvent.click(button)

    // Verify onClick was called
    await expect(args.onClick).toHaveBeenCalledTimes(1)
  },
}

/**
 * Tests that disabled button doesn't respond to clicks.
 */
export const DisabledInteraction: Story = {
  args: {
    severity: 'high',
    disabled: true,
    children: 'Next Step',
    onClick: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button', { name: /next step/i })

    // Verify button is disabled
    await expect(button).toBeDisabled()

    // Verify pointer-events is disabled (can't click)
    await expect(button).toHaveClass('disabled:pointer-events-none')

    // onClick should not have been called (no interaction possible)
    await expect(args.onClick).not.toHaveBeenCalled()
  },
}

/**
 * Tests keyboard accessibility (Enter and Space trigger click).
 */
export const KeyboardAccessibility: Story = {
  args: {
    severity: 'low',
    children: 'Next Step',
    onClick: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button', { name: /next step/i })

    // Focus the button
    button.focus()
    await expect(button).toHaveFocus()

    // Press Enter - should trigger click
    await userEvent.keyboard('{Enter}')
    await expect(args.onClick).toHaveBeenCalledTimes(1)

    // Press Space - should also trigger click
    await userEvent.keyboard(' ')
    await expect(args.onClick).toHaveBeenCalledTimes(2)
  },
}

/**
 * Tests that data-severity attribute is set correctly for each variant.
 */
export const DataAttributesTest: Story = {
  render: () => (
    <div className="flex gap-4">
      <NextStepButton severity="critical" data-testid="btn-critical" />
      <NextStepButton severity="high" data-testid="btn-high" />
      <NextStepButton severity="medium" data-testid="btn-medium" />
      <NextStepButton severity="low" data-testid="btn-low" />
      <NextStepButton severity="none" data-testid="btn-none" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Verify each button has correct data-severity attribute
    const criticalBtn = canvas.getByTestId('btn-critical')
    await expect(criticalBtn).toHaveAttribute('data-severity', 'critical')

    const highBtn = canvas.getByTestId('btn-high')
    await expect(highBtn).toHaveAttribute('data-severity', 'high')

    const mediumBtn = canvas.getByTestId('btn-medium')
    await expect(mediumBtn).toHaveAttribute('data-severity', 'medium')

    const lowBtn = canvas.getByTestId('btn-low')
    await expect(lowBtn).toHaveAttribute('data-severity', 'low')

    const noneBtn = canvas.getByTestId('btn-none')
    await expect(noneBtn).toHaveAttribute('data-severity', 'none')
  },
}

// =============================================================================
// ALL STATES
// =============================================================================

const SEVERITIES: NextStepSeverity[] = ['critical', 'high', 'medium', 'low', 'none']
const SEVERITY_LABELS: Record<NextStepSeverity, string> = {
  critical: 'Critical',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
  none: 'None',
}

/**
 * All severity variants and states displayed together.
 * This matches the Figma design grid layout.
 */
export const AllStates: Story = {
  render: () => (
    <div className="space-y-8 p-6">
      <StorySection title="All Severities - Default State">
        <StoryFlex>
          {SEVERITIES.map((severity) => (
            <div key={severity} className="flex flex-col items-center gap-2">
              <NextStepButton severity={severity} />
              <span className="text-xs text-secondary">{SEVERITY_LABELS[severity]}</span>
            </div>
          ))}
        </StoryFlex>
      </StorySection>

      <StorySection title="Size Variants">
        <StoryFlex>
          <div className="flex flex-col items-center gap-2">
            <NextStepButton severity="none" size="sm" />
            <span className="text-xs text-secondary">Small</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <NextStepButton severity="none" size="md" />
            <span className="text-xs text-secondary">Medium</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <NextStepButton severity="none" size="lg" />
            <span className="text-xs text-secondary">Large</span>
          </div>
        </StoryFlex>
      </StorySection>

      <StorySection title="Custom Labels">
        <StoryFlex>
          <NextStepButton severity="critical">Urgent Action</NextStepButton>
          <NextStepButton severity="high">Continue</NextStepButton>
          <NextStepButton severity="low">Proceed</NextStepButton>
        </StoryFlex>
      </StorySection>

      <StorySection title="Disabled State">
        <StoryFlex>
          {SEVERITIES.map((severity) => (
            <NextStepButton key={severity} severity={severity} disabled />
          ))}
        </StoryFlex>
      </StorySection>

      <StorySection title="Complete Matrix (Figma Reference)">
        <StoryGrid cols={2}>
          {/* Header row */}
          <div className="text-xs font-medium text-secondary text-center">Default</div>
          <div className="text-xs font-medium text-secondary text-center">Disabled</div>

          {/* Severity rows */}
          {SEVERITIES.map((severity) => (
            <>
              <div key={`${severity}-default`} className="flex justify-center">
                <NextStepButton severity={severity} />
              </div>
              <div key={`${severity}-disabled`} className="flex justify-center">
                <NextStepButton severity={severity} disabled />
              </div>
            </>
          ))}
        </StoryGrid>
        <p className="text-xs text-tertiary mt-4 text-center">
          Hover over default state buttons to see the filled hover effect
        </p>
      </StorySection>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Complete overview of all severity variants in default and disabled states. Hover over buttons to see the hover effect.',
      },
    },
  },
}
