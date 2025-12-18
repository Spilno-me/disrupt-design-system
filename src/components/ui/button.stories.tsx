import type { Meta, StoryObj } from '@storybook/react'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import {
  ATOM_META,
  atomDescription,
  StoryFlex,
  StorySection,
  StoryInfoBox,
  STORY_SPACING,
  STORY_WIDTHS,
} from '@/stories/_infrastructure'
import { Button } from './button'

// =============================================================================
// META CONFIGURATION
// =============================================================================

const meta: Meta<typeof Button> = {
  title: 'Core/Button',
  component: Button,
  ...ATOM_META,
  parameters: {
    ...ATOM_META.parameters,
    docs: {
      description: {
        component: atomDescription(
          'The primary interactive element for user actions. Supports multiple variants, sizes, and states.'
        ),
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'destructive',
        'outline',
        'secondary',
        'ghost',
        'link',
        'accent',
        'contact',
      ],
      description: 'The visual style variant of the button',
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
      description: 'The size of the button',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
    },
  },
}

export default meta
type Story = StoryObj<typeof Button>

// =============================================================================
// STORIES
// =============================================================================

/** Default button with controls */
export const Default: Story = {
  args: {
    children: 'Button',
    variant: 'default',
    size: 'default',
  },
}

/** All visual variants in a row */
export const Variants: Story = {
  render: () => (
    <StoryFlex>
      <Button variant="default">Default</Button>
      <Button variant="accent">Accent</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </StoryFlex>
  ),
}

/** All size options */
export const Sizes: Story = {
  render: () => (
    <StoryFlex align="center">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
    </StoryFlex>
  ),
}

/** Contact button - primary CTA used on website */
export const ContactButton: Story = {
  args: {
    children: 'Contact us',
    variant: 'contact',
  },
}

/** Full width button pattern for forms */
export const FullWidth: Story = {
  name: 'Full Width',
  render: () => (
    <div className={STORY_WIDTHS.atom}>
      <Button variant="contact" className="w-full">
        Send Message
      </Button>
    </div>
  ),
}

/** Disabled state */
export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    disabled: true,
  },
}

/** Buttons with icons */
export const WithIcon: Story = {
  render: () => (
    <StoryFlex>
      <Button>
        <ArrowRight className="w-4 h-4" />
        Next
      </Button>
      <Button variant="outline">
        <ArrowLeft className="w-4 h-4" />
        Back
      </Button>
    </StoryFlex>
  ),
}

// =============================================================================
// ALL STATES (Comprehensive Visual Matrix)
// =============================================================================

export const AllStates: Story = {
  render: () => (
    <div className={STORY_SPACING.sections}>
      <StorySection title="Variants" description="All available visual styles">
        <StoryFlex>
          <Button variant="default">Default</Button>
          <Button variant="accent">Accent</Button>
          <Button variant="contact">Contact</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </StoryFlex>
      </StorySection>

      <StorySection title="Sizes" description="Available size options">
        <StoryFlex align="center">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
          <Button size="icon">
            <ArrowRight className="w-4 h-4" />
          </Button>
        </StoryFlex>
      </StorySection>

      <StorySection title="States" description="Interactive states">
        <StoryFlex>
          <Button>Default</Button>
          <Button disabled>Disabled</Button>
          <Button autoFocus>Focused (click)</Button>
        </StoryFlex>
      </StorySection>

      <StorySection title="With Icons" description="Icon placement patterns">
        <StoryFlex>
          <Button>
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <Button>
            Next
            <ArrowRight className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon">
            <ArrowRight className="w-4 h-4" />
          </Button>
        </StoryFlex>
      </StorySection>

      <StorySection title="Full Width" description="Form submit pattern">
        <div className={STORY_WIDTHS.atom}>
          <Button variant="contact" className="w-full">
            Submit Form
          </Button>
        </div>
      </StorySection>

      <StoryInfoBox>
        <strong>Keyboard Navigation:</strong>
        <ul className="mt-2 space-y-1 text-sm">
          <li>
            <kbd className="px-2 py-0.5 bg-surface rounded border border-default text-xs">
              Tab
            </kbd>{' '}
            - Navigate between buttons
          </li>
          <li>
            <kbd className="px-2 py-0.5 bg-surface rounded border border-default text-xs">
              Enter
            </kbd>{' '}
            or{' '}
            <kbd className="px-2 py-0.5 bg-surface rounded border border-default text-xs">
              Space
            </kbd>{' '}
            - Activate button
          </li>
        </ul>
      </StoryInfoBox>
    </div>
  ),
}
