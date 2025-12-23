import type { Meta, StoryObj } from '@storybook/react'
import {
  ArrowRight,
  Plus,
  Trash2,
  Check,
  ExternalLink,
  Download,
  Send,
  Play,
  ChevronRight,
  Settings,
  Upload,
  Save,
} from 'lucide-react'

import { SplitButton } from './split-button'

const meta: Meta<typeof SplitButton> = {
  title: 'Components/SplitButton',
  component: SplitButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Split Button with diagonal divider design. Features a main action area and a separate icon section.

## Features
- **5 variants**: primary, secondary, destructive, success, outline
- **3 sizes**: sm, default, lg
- **Custom icons**: Pass any Lucide icon
- **Separate icon action**: Optional \`onIconClick\` for split functionality
- **Full width mode**: Responsive layouts

## Usage
\`\`\`tsx
import { SplitButton } from '@dds/design-system'
import { ArrowRight, Trash2, Check } from 'lucide-react'

<SplitButton icon={ArrowRight}>Get Started</SplitButton>
<SplitButton variant="destructive" icon={Trash2}>Delete</SplitButton>
<SplitButton variant="success" icon={Check}>Confirm</SplitButton>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'destructive', 'success', 'outline'],
      description: 'Visual style variant',
    },
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg'],
      description: 'Button size',
    },
    icon: {
      control: false,
      description: 'Icon component to display',
    },
    hideIcon: {
      control: 'boolean',
      description: 'Hide the icon section',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Make button full width',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the button',
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof SplitButton>

// =============================================================================
// DEFAULT
// =============================================================================

export const Default: Story = {
  args: {
    children: 'Get Started',
    variant: 'primary',
    size: 'default',
    icon: ArrowRight,
  },
}

// =============================================================================
// VARIANTS
// =============================================================================

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-4 items-start">
      <SplitButton variant="primary" icon={ArrowRight}>
        Primary Action
      </SplitButton>
      <SplitButton variant="secondary" icon={Plus}>
        Secondary Action
      </SplitButton>
      <SplitButton variant="destructive" icon={Trash2}>
        Delete Item
      </SplitButton>
      <SplitButton variant="success" icon={Check}>
        Confirm Action
      </SplitButton>
      <SplitButton variant="outline" icon={ExternalLink}>
        Learn More
      </SplitButton>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All available button variants with appropriate icons.',
      },
    },
  },
}

// =============================================================================
// SIZES
// =============================================================================

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 items-start">
      <SplitButton size="sm" icon={ArrowRight}>
        Small Button
      </SplitButton>
      <SplitButton size="default" icon={ArrowRight}>
        Default Button
      </SplitButton>
      <SplitButton size="lg" icon={ArrowRight}>
        Large Button
      </SplitButton>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Three size options: sm, default, and lg.',
      },
    },
  },
}

// =============================================================================
// ICON VARIATIONS
// =============================================================================

export const IconVariations: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <SplitButton icon={ArrowRight}>Continue</SplitButton>
      <SplitButton icon={ChevronRight}>Next</SplitButton>
      <SplitButton icon={Download}>Download</SplitButton>
      <SplitButton icon={Upload}>Upload</SplitButton>
      <SplitButton icon={Send}>Send</SplitButton>
      <SplitButton icon={Play}>Play</SplitButton>
      <SplitButton icon={Save}>Save</SplitButton>
      <SplitButton icon={Settings}>Settings</SplitButton>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Any Lucide icon can be used in the icon section.',
      },
    },
  },
}

// =============================================================================
// FULL WIDTH
// =============================================================================

export const FullWidth: Story = {
  render: () => (
    <div className="w-[400px] flex flex-col gap-4">
      <SplitButton fullWidth icon={ArrowRight}>
        Full Width Primary
      </SplitButton>
      <SplitButton fullWidth variant="secondary" icon={Plus}>
        Full Width Secondary
      </SplitButton>
      <SplitButton fullWidth variant="outline" icon={ExternalLink}>
        Full Width Outline
      </SplitButton>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Full width mode for responsive layouts.',
      },
    },
  },
}

// =============================================================================
// WITHOUT ICON
// =============================================================================

export const WithoutIcon: Story = {
  render: () => (
    <div className="flex flex-col gap-4 items-start">
      <SplitButton hideIcon>Primary Without Icon</SplitButton>
      <SplitButton hideIcon variant="secondary">
        Secondary Without Icon
      </SplitButton>
      <SplitButton hideIcon variant="outline">
        Outline Without Icon
      </SplitButton>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Use `hideIcon` prop to hide the icon section.',
      },
    },
  },
}

// =============================================================================
// DISABLED STATE
// =============================================================================

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-4 items-start">
      <SplitButton disabled icon={ArrowRight}>
        Disabled Primary
      </SplitButton>
      <SplitButton disabled variant="destructive" icon={Trash2}>
        Disabled Destructive
      </SplitButton>
      <SplitButton disabled variant="outline" icon={ExternalLink}>
        Disabled Outline
      </SplitButton>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Disabled state reduces opacity and disables interactions.',
      },
    },
  },
}

// =============================================================================
// SPLIT ACTION
// =============================================================================

export const SplitAction: Story = {
  render: () => (
    <div className="flex flex-col gap-4 items-start">
      <SplitButton
        icon={ChevronRight}
        onIconClick={(e) => {
          e.preventDefault()
          alert('Dropdown menu would open here')
        }}
      >
        Save Changes
      </SplitButton>
      <p className="text-sm text-secondary mt-2">
        Click the main button or the icon section separately.
        <br />
        The icon section has a separate click handler.
      </p>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Use `onIconClick` prop to make the icon section a separate action (e.g., for dropdown menus).',
      },
    },
  },
}

// =============================================================================
// ALL STATES GRID
// =============================================================================

export const AllStates: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-6">
      {/* Primary */}
      <div className="flex flex-col gap-3">
        <span className="text-xs font-semibold text-muted uppercase tracking-wide">
          Primary
        </span>
        <SplitButton size="sm" icon={ArrowRight}>
          Small
        </SplitButton>
        <SplitButton size="default" icon={ArrowRight}>
          Default
        </SplitButton>
        <SplitButton size="lg" icon={ArrowRight}>
          Large
        </SplitButton>
        <SplitButton disabled icon={ArrowRight}>
          Disabled
        </SplitButton>
        <SplitButton hideIcon>
          No Icon
        </SplitButton>
      </div>

      {/* Secondary */}
      <div className="flex flex-col gap-3">
        <span className="text-xs font-semibold text-muted uppercase tracking-wide">
          Secondary
        </span>
        <SplitButton variant="secondary" size="sm" icon={Plus}>
          Small
        </SplitButton>
        <SplitButton variant="secondary" size="default" icon={Plus}>
          Default
        </SplitButton>
        <SplitButton variant="secondary" size="lg" icon={Plus}>
          Large
        </SplitButton>
        <SplitButton variant="secondary" disabled icon={Plus}>
          Disabled
        </SplitButton>
        <SplitButton variant="secondary" hideIcon>
          No Icon
        </SplitButton>
      </div>

      {/* Destructive */}
      <div className="flex flex-col gap-3">
        <span className="text-xs font-semibold text-muted uppercase tracking-wide">
          Destructive
        </span>
        <SplitButton variant="destructive" size="sm" icon={Trash2}>
          Small
        </SplitButton>
        <SplitButton variant="destructive" size="default" icon={Trash2}>
          Default
        </SplitButton>
        <SplitButton variant="destructive" size="lg" icon={Trash2}>
          Large
        </SplitButton>
        <SplitButton variant="destructive" disabled icon={Trash2}>
          Disabled
        </SplitButton>
        <SplitButton variant="destructive" hideIcon>
          No Icon
        </SplitButton>
      </div>

      {/* Success */}
      <div className="flex flex-col gap-3">
        <span className="text-xs font-semibold text-muted uppercase tracking-wide">
          Success
        </span>
        <SplitButton variant="success" size="sm" icon={Check}>
          Small
        </SplitButton>
        <SplitButton variant="success" size="default" icon={Check}>
          Default
        </SplitButton>
        <SplitButton variant="success" size="lg" icon={Check}>
          Large
        </SplitButton>
        <SplitButton variant="success" disabled icon={Check}>
          Disabled
        </SplitButton>
        <SplitButton variant="success" hideIcon>
          No Icon
        </SplitButton>
      </div>

      {/* Outline */}
      <div className="flex flex-col gap-3">
        <span className="text-xs font-semibold text-muted uppercase tracking-wide">
          Outline
        </span>
        <SplitButton variant="outline" size="sm" icon={ExternalLink}>
          Small
        </SplitButton>
        <SplitButton variant="outline" size="default" icon={ExternalLink}>
          Default
        </SplitButton>
        <SplitButton variant="outline" size="lg" icon={ExternalLink}>
          Large
        </SplitButton>
        <SplitButton variant="outline" disabled icon={ExternalLink}>
          Disabled
        </SplitButton>
        <SplitButton variant="outline" hideIcon>
          No Icon
        </SplitButton>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: 'Complete grid showing all variants, sizes, and states.',
      },
    },
  },
}
