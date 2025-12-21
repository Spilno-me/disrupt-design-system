import type { Meta, StoryObj } from '@storybook/react'
import { Rocket, Pencil, Trash2, Plus, Settings, Eye } from 'lucide-react'
import {
  ATOM_META,
  atomDescription,
  StorySection,
  StoryFlex,
  STORY_SPACING,
} from '@/stories/_infrastructure'
import { ActionTile } from './ActionTile'

// =============================================================================
// META CONFIGURATION
// =============================================================================

const meta: Meta<typeof ActionTile> = {
  title: 'Core/ActionTile',
  component: ActionTile,
  ...ATOM_META,
  parameters: {
    ...ATOM_META.parameters,
    docs: {
      description: {
        component: atomDescription(
          'Square icon button for common actions. Supports success/neutral/destructive variants and outline/filled appearances.'
        ),
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['success', 'neutral', 'destructive'],
      description: 'Semantic color variant',
    },
    appearance: {
      control: 'select',
      options: ['outline', 'filled'],
      description: 'Visual style (outline = transparent, filled = subtle colored fill)',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Tile size',
    },
  },
}

export default meta
type Story = StoryObj<typeof ActionTile>

// =============================================================================
// DEFAULT (for Controls panel)
// =============================================================================

export const Default: Story = {
  args: {
    variant: 'neutral',
    appearance: 'outline',
    size: 'md',
    'aria-label': 'Edit item',
    children: <Pencil className="size-8" />,
  },
}

// =============================================================================
// ALL STATES (Comprehensive Visual Matrix)
// =============================================================================

export const AllStates: Story = {
  render: () => (
    <div className={STORY_SPACING.sections}>
      {/* Outline variants on dark background */}
      <StorySection
        title="Outline Appearance (Dark Background)"
        description="Use outline appearance on dark surfaces"
      >
        <div className="bg-dark rounded-xl p-8">
          <StoryFlex>
            <ActionTile variant="success" appearance="outline" aria-label="Create new">
              <Rocket className="size-8" />
            </ActionTile>
            <ActionTile variant="neutral" appearance="outline" aria-label="Edit">
              <Pencil className="size-8" />
            </ActionTile>
            <ActionTile variant="destructive" appearance="outline" aria-label="Delete">
              <Trash2 className="size-8" />
            </ActionTile>
          </StoryFlex>
        </div>
      </StorySection>

      {/* Filled variants on dark background */}
      <StorySection
        title="Filled Appearance (Dark Background)"
        description="Filled uses subtle colored fill at rest, stronger on hover"
      >
        <div className="bg-dark rounded-xl p-8">
          <StoryFlex>
            <ActionTile variant="success" appearance="filled" aria-label="Create new">
              <Rocket className="size-8" />
            </ActionTile>
            <ActionTile variant="neutral" appearance="filled" aria-label="Edit">
              <Pencil className="size-8" />
            </ActionTile>
            <ActionTile variant="destructive" appearance="filled" aria-label="Delete">
              <Trash2 className="size-8" />
            </ActionTile>
          </StoryFlex>
        </div>
      </StorySection>

      {/* Filled variants on light background */}
      <StorySection
        title="Filled Appearance (Light Background)"
        description="Same subtle fills work on light surfaces too"
      >
        <StoryFlex>
          <ActionTile variant="success" appearance="filled" aria-label="Create new">
            <Rocket className="size-8" />
          </ActionTile>
          <ActionTile variant="neutral" appearance="filled" aria-label="Edit">
            <Pencil className="size-8" />
          </ActionTile>
          <ActionTile variant="destructive" appearance="filled" aria-label="Delete">
            <Trash2 className="size-8" />
          </ActionTile>
        </StoryFlex>
      </StorySection>

      {/* Sizes */}
      <StorySection title="Sizes" description="Small, medium, and large">
        <div className="bg-dark rounded-xl p-8">
          <StoryFlex>
            <ActionTile variant="success" appearance="outline" size="sm" aria-label="Small">
              <Plus className="size-5" />
            </ActionTile>
            <ActionTile variant="success" appearance="outline" size="md" aria-label="Medium">
              <Plus className="size-8" />
            </ActionTile>
            <ActionTile variant="success" appearance="outline" size="lg" aria-label="Large">
              <Plus className="size-10" />
            </ActionTile>
          </StoryFlex>
        </div>
      </StorySection>

      {/* Use case examples */}
      <StorySection
        title="Common Actions"
        description="Typical action tile use cases"
      >
        <div className="bg-dark rounded-xl p-8">
          <StoryFlex>
            <ActionTile variant="success" appearance="outline" aria-label="Add new item">
              <Plus className="size-8" />
            </ActionTile>
            <ActionTile variant="neutral" appearance="outline" aria-label="View details">
              <Eye className="size-8" />
            </ActionTile>
            <ActionTile variant="neutral" appearance="outline" aria-label="Settings">
              <Settings className="size-8" />
            </ActionTile>
            <ActionTile variant="destructive" appearance="outline" aria-label="Delete item">
              <Trash2 className="size-8" />
            </ActionTile>
          </StoryFlex>
        </div>
      </StorySection>

      {/* Disabled state */}
      <StorySection title="Disabled State" description="All variants in disabled state">
        <div className="bg-dark rounded-xl p-8">
          <StoryFlex>
            <ActionTile variant="success" appearance="outline" disabled aria-label="Disabled create">
              <Rocket className="size-8" />
            </ActionTile>
            <ActionTile variant="neutral" appearance="outline" disabled aria-label="Disabled edit">
              <Pencil className="size-8" />
            </ActionTile>
            <ActionTile variant="destructive" appearance="outline" disabled aria-label="Disabled delete">
              <Trash2 className="size-8" />
            </ActionTile>
          </StoryFlex>
        </div>
      </StorySection>
    </div>
  ),
}

// =============================================================================
// INDIVIDUAL STORIES
// =============================================================================

export const Success: Story = {
  args: {
    variant: 'success',
    appearance: 'outline',
    'aria-label': 'Create new item',
    children: <Rocket className="size-8" />,
  },
  decorators: [
    (Story) => (
      <div className="bg-dark rounded-xl p-8">
        <Story />
      </div>
    ),
  ],
}

export const Neutral: Story = {
  args: {
    variant: 'neutral',
    appearance: 'outline',
    'aria-label': 'Edit item',
    children: <Pencil className="size-8" />,
  },
  decorators: [
    (Story) => (
      <div className="bg-dark rounded-xl p-8">
        <Story />
      </div>
    ),
  ],
}

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    appearance: 'outline',
    'aria-label': 'Delete item',
    children: <Trash2 className="size-8" />,
  },
  decorators: [
    (Story) => (
      <div className="bg-dark rounded-xl p-8">
        <Story />
      </div>
    ),
  ],
}

export const Filled: Story = {
  args: {
    variant: 'success',
    appearance: 'filled',
    'aria-label': 'Create new item',
    children: <Rocket className="size-8" />,
  },
  decorators: [
    (Story) => (
      <div className="bg-dark rounded-xl p-8">
        <Story />
      </div>
    ),
  ],
}
