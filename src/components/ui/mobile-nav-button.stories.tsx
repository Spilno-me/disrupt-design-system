/**
 * MobileNavButton Stories
 *
 * Demonstrates the MobileNavButton component for mobile bottom navigation.
 * Shows all variants, states, and usage patterns.
 */

import type { Meta, StoryObj } from '@storybook/react'
import { Settings, User, Bell, Search } from 'lucide-react'
import { MobileNavButton, type MobileNavButtonVariant } from './mobile-nav-button'
import {
  ATOM_META,
  atomDescription,
  StorySection,
  StoryFlex,
} from '../../stories/_infrastructure'

// =============================================================================
// META
// =============================================================================

const meta: Meta<typeof MobileNavButton> = {
  title: 'Flow/Components/MobileNavButton',
  component: MobileNavButton,
  ...ATOM_META,
  parameters: {
    ...ATOM_META.parameters,
    docs: {
      description: {
        component: atomDescription(
          `A navigation button for mobile bottom navigation bars.

**Primary Use Case:**
Individual navigation items in mobile app bottom navigation bars.
Features gradient background and tactile press feedback.

**Variants:**
| Variant | Icon | Label | Use Case |
|---------|------|-------|----------|
| myFlow | LayoutDashboard | My Flow | Main dashboard |
| steps | Waypoints | Steps | Steps/workflow |
| incidents | Siren | Incidents | Incident list |
| more | Ellipsis | More | Additional options |
| custom | User-defined | User-defined | Custom navigation |

**States:**
- Default: Gradient background with shadow
- Active: Teal accent color for icon and label
- Pressed: Inset shadow (shown on touch/click)`
        ),
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['myFlow', 'steps', 'incidents', 'more', 'custom'] satisfies MobileNavButtonVariant[],
      description: 'Button variant determines default icon and label',
    },
    isActive: {
      control: 'boolean',
      description: 'Whether this nav item is currently active/selected',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the button',
    },
  },
}

export default meta

type Story = StoryObj<typeof MobileNavButton>

// =============================================================================
// INDIVIDUAL VARIANTS
// =============================================================================

/**
 * Default: My Flow navigation button
 */
export const Default: Story = {
  args: {
    variant: 'myFlow',
  },
}

/**
 * Steps variant - workflow/steps navigation
 */
export const Steps: Story = {
  args: {
    variant: 'steps',
  },
}

/**
 * Incidents variant - incident list navigation
 */
export const Incidents: Story = {
  args: {
    variant: 'incidents',
  },
}

/**
 * More variant - additional options menu
 */
export const More: Story = {
  args: {
    variant: 'more',
  },
}

/**
 * Active state - shows teal accent color
 */
export const Active: Story = {
  args: {
    variant: 'myFlow',
    isActive: true,
  },
}

/**
 * Disabled state
 */
export const Disabled: Story = {
  args: {
    variant: 'myFlow',
    disabled: true,
  },
}

// =============================================================================
// ALL VARIANTS
// =============================================================================

const VARIANTS: Exclude<MobileNavButtonVariant, 'custom'>[] = ['myFlow', 'steps', 'incidents', 'more']
const VARIANT_LABELS: Record<Exclude<MobileNavButtonVariant, 'custom'>, string> = {
  myFlow: 'My Flow',
  steps: 'Steps',
  incidents: 'Incidents',
  more: 'More',
}

/**
 * All variants displayed together
 */
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-8 p-6">
      <StorySection title="All Variants - Default State">
        <StoryFlex>
          {VARIANTS.map((variant) => (
            <div key={variant} className="flex flex-col items-center gap-2">
              <MobileNavButton variant={variant} />
              <span className="text-xs text-secondary">{VARIANT_LABELS[variant]}</span>
            </div>
          ))}
        </StoryFlex>
      </StorySection>

      <StorySection title="All Variants - Active State">
        <StoryFlex>
          {VARIANTS.map((variant) => (
            <div key={variant} className="flex flex-col items-center gap-2">
              <MobileNavButton variant={variant} isActive />
              <span className="text-xs text-secondary">{VARIANT_LABELS[variant]} (active)</span>
            </div>
          ))}
        </StoryFlex>
      </StorySection>
    </div>
  ),
}

// =============================================================================
// STATES
// =============================================================================

/**
 * All button states
 */
export const AllStates: Story = {
  render: () => (
    <div className="space-y-8 p-6">
      <StorySection
        title="Light Mode States"
        description="Click/tap to see pressed state"
      >
        <StoryFlex>
          <div className="flex flex-col items-center gap-2">
            <MobileNavButton variant="myFlow" />
            <span className="text-xs text-secondary">Default</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <MobileNavButton variant="myFlow" isActive />
            <span className="text-xs text-secondary">Active</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <MobileNavButton variant="myFlow" disabled />
            <span className="text-xs text-secondary">Disabled</span>
          </div>
        </StoryFlex>
      </StorySection>

      <StorySection title="Dark Mode States">
        <div className="dark bg-inverse-bg p-6 rounded-lg">
          <StoryFlex>
            <div className="flex flex-col items-center gap-2">
              <MobileNavButton variant="myFlow" />
              <span className="text-xs text-inverse">Default</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <MobileNavButton variant="myFlow" isActive />
              <span className="text-xs text-inverse">Active</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <MobileNavButton variant="myFlow" disabled />
              <span className="text-xs text-inverse">Disabled</span>
            </div>
          </StoryFlex>
        </div>
      </StorySection>

      <StorySection title="All Variants - Dark Mode">
        <div className="dark bg-inverse-bg p-6 rounded-lg">
          <StoryFlex>
            {VARIANTS.map((variant) => (
              <div key={variant} className="flex flex-col items-center gap-2">
                <MobileNavButton variant={variant} />
                <span className="text-xs text-inverse">{VARIANT_LABELS[variant]}</span>
              </div>
            ))}
          </StoryFlex>
        </div>
      </StorySection>
    </div>
  ),
}

// =============================================================================
// CUSTOM ICON
// =============================================================================

/**
 * Custom icons and labels
 */
export const CustomIcons: Story = {
  render: () => (
    <StorySection title="Custom Icons & Labels">
      <StoryFlex>
        <div className="flex flex-col items-center gap-2">
          <MobileNavButton
            variant="custom"
            icon={<Settings size={20} strokeWidth={1.75} />}
            label="Settings"
          />
          <span className="text-xs text-secondary">Settings</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <MobileNavButton
            variant="custom"
            icon={<User size={20} strokeWidth={1.75} />}
            label="Profile"
          />
          <span className="text-xs text-secondary">Profile</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <MobileNavButton
            variant="custom"
            icon={<Bell size={20} strokeWidth={1.75} />}
            label="Alerts"
            isActive
          />
          <span className="text-xs text-secondary">Alerts (active)</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <MobileNavButton
            variant="custom"
            icon={<Search size={20} strokeWidth={1.75} />}
            label="Search"
          />
          <span className="text-xs text-secondary">Search</span>
        </div>
      </StoryFlex>
    </StorySection>
  ),
}

// =============================================================================
// INTERACTIVE DEMO
// =============================================================================

/**
 * Interactive demo with click handlers
 */
export const Interactive: Story = {
  render: () => (
    <StorySection
      title="Interactive Demo"
      description="Click to trigger navigation (shows alert)"
    >
      <StoryFlex>
        {VARIANTS.map((variant) => (
          <MobileNavButton
            key={variant}
            variant={variant}
            onClick={() => alert(`Navigating to ${VARIANT_LABELS[variant]}`)}
          />
        ))}
      </StoryFlex>
    </StorySection>
  ),
}
