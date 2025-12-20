/**
 * MobileNavBar Stories
 *
 * Demonstrates the MobileNavBar container component with MobileNavButton items
 * and QuickActionButton in the center.
 */

import type { Meta, StoryObj } from '@storybook/react'
import { MobileNavBar, FlowMobileNav } from './mobile-nav-bar'
import { MobileNavButton } from './mobile-nav-button'
import { QuickActionButton } from './quick-action-button'
import {
  MOLECULE_META,
  moleculeDescription,
  StorySection,
  withDarkBackground,
  IPhoneFrame,
} from '../../stories/_infrastructure'

// =============================================================================
// META
// =============================================================================

const meta: Meta<typeof MobileNavBar> = {
  title: 'Flow/Components/MobileNavBar',
  component: MobileNavBar,
  ...MOLECULE_META,
  parameters: {
    ...MOLECULE_META.parameters,
    docs: {
      description: {
        component: moleculeDescription(
          `A bottom navigation bar container for mobile applications.

**Primary Use Case:**
Container for mobile bottom navigation with MobileNavButton items
and optionally a QuickActionButton in the center.

**Position Variants:**
| Position | Behavior | Use Case |
|----------|----------|----------|
| fixed | Fixed to bottom of viewport | Production apps |
| sticky | Sticks to bottom when scrolled | Scrollable contexts |
| relative | Normal document flow | Storybook demos |

**Features:**
- Glass effect background with blur
- Safe area padding for notched devices
- Flexible composition with children
- Optional top border`
        ),
      },
    },
  },
  argTypes: {
    position: {
      control: 'select',
      options: ['fixed', 'sticky', 'relative'],
      description: 'Positioning mode',
    },
    variant: {
      control: 'select',
      options: ['glass', 'solid'],
      description: 'Background variant',
    },
    showBorder: {
      control: 'boolean',
      description: 'Show top border',
    },
  },
}

export default meta

type Story = StoryObj<typeof MobileNavBar>

// =============================================================================
// DEFAULT
// =============================================================================

/**
 * Default: Complete mobile navigation with QuickActionButton
 */
export const Default: Story = {
  args: {
    position: 'relative',
  },
  render: (args) => (
    <MobileNavBar {...args}>
      <MobileNavButton variant="myFlow" isActive />
      <MobileNavButton variant="steps" />
      <QuickActionButton variant="incident" size="lg" />
      <MobileNavButton variant="incidents" />
      <MobileNavButton variant="more" />
    </MobileNavBar>
  ),
}

// =============================================================================
// COMPLETE LAYOUTS
// =============================================================================

/**
 * Complete navigation with different active states
 */
export const NavigationStates: Story = {
  render: () => (
    <div className="space-y-8 p-6">
      <StorySection
        title="My Flow Active"
        description="First nav item selected"
      >
        <MobileNavBar position="relative">
          <MobileNavButton variant="myFlow" isActive />
          <MobileNavButton variant="steps" />
          <QuickActionButton variant="incident" size="lg" />
          <MobileNavButton variant="incidents" />
          <MobileNavButton variant="more" />
        </MobileNavBar>
      </StorySection>

      <StorySection
        title="Steps Active"
        description="Second nav item selected"
      >
        <MobileNavBar position="relative">
          <MobileNavButton variant="myFlow" />
          <MobileNavButton variant="steps" isActive />
          <QuickActionButton variant="incident" size="lg" />
          <MobileNavButton variant="incidents" />
          <MobileNavButton variant="more" />
        </MobileNavBar>
      </StorySection>

      <StorySection
        title="Incidents Active"
        description="Fourth nav item selected"
      >
        <MobileNavBar position="relative">
          <MobileNavButton variant="myFlow" />
          <MobileNavButton variant="steps" />
          <QuickActionButton variant="incident" size="lg" />
          <MobileNavButton variant="incidents" isActive />
          <MobileNavButton variant="more" />
        </MobileNavBar>
      </StorySection>
    </div>
  ),
}

// =============================================================================
// QUICKACTION VARIANTS
// =============================================================================

/**
 * Different QuickActionButton variants in navigation
 */
export const QuickActionVariants: Story = {
  render: () => (
    <div className="space-y-8 p-6">
      <StorySection
        title="Incident Reporting (Default)"
        description="Red gradient for urgent incident reporting"
      >
        <MobileNavBar position="relative">
          <MobileNavButton variant="myFlow" isActive />
          <MobileNavButton variant="steps" />
          <QuickActionButton variant="incident" size="lg" />
          <MobileNavButton variant="incidents" />
          <MobileNavButton variant="more" />
        </MobileNavBar>
      </StorySection>

      <StorySection
        title="Create Action"
        description="Teal gradient for general creation"
      >
        <MobileNavBar position="relative">
          <MobileNavButton variant="myFlow" isActive />
          <MobileNavButton variant="steps" />
          <QuickActionButton variant="create" size="lg" />
          <MobileNavButton variant="incidents" />
          <MobileNavButton variant="more" />
        </MobileNavBar>
      </StorySection>

      <StorySection
        title="Emergency Action"
        description="Orange gradient for emergency calls"
      >
        <MobileNavBar position="relative">
          <MobileNavButton variant="myFlow" isActive />
          <MobileNavButton variant="steps" />
          <QuickActionButton variant="emergency" size="lg" />
          <MobileNavButton variant="incidents" />
          <MobileNavButton variant="more" />
        </MobileNavBar>
      </StorySection>

      <StorySection
        title="Capture Action"
        description="Green gradient for photo/document capture"
      >
        <MobileNavBar position="relative">
          <MobileNavButton variant="myFlow" isActive />
          <MobileNavButton variant="steps" />
          <QuickActionButton variant="capture" size="lg" />
          <MobileNavButton variant="incidents" />
          <MobileNavButton variant="more" />
        </MobileNavBar>
      </StorySection>
    </div>
  ),
}

// =============================================================================
// BACKGROUND VARIANTS
// =============================================================================

/**
 * Glass vs Solid background
 */
export const BackgroundVariants: Story = {
  render: () => (
    <div className="space-y-8 p-6">
      <StorySection
        title="Glass Background (Default)"
        description="Semi-transparent with blur effect"
      >
        <div className="bg-gradient-to-b from-accent-subtle to-surface p-6 rounded-lg">
          <div className="h-24 flex items-center justify-center text-secondary text-sm mb-2">
            Content Area (gradient background)
          </div>
          <MobileNavBar position="relative" variant="glass">
            <MobileNavButton variant="myFlow" isActive />
            <MobileNavButton variant="steps" />
            <QuickActionButton variant="incident" size="lg" />
            <MobileNavButton variant="incidents" />
            <MobileNavButton variant="more" />
          </MobileNavBar>
        </div>
      </StorySection>

      <StorySection
        title="Solid Background"
        description="Opaque white background"
      >
        <div className="bg-gradient-to-b from-accent-subtle to-surface p-6 rounded-lg">
          <div className="h-24 flex items-center justify-center text-secondary text-sm mb-2">
            Content Area (gradient background)
          </div>
          <MobileNavBar position="relative" variant="solid">
            <MobileNavButton variant="myFlow" isActive />
            <MobileNavButton variant="steps" />
            <QuickActionButton variant="incident" size="lg" />
            <MobileNavButton variant="incidents" />
            <MobileNavButton variant="more" />
          </MobileNavBar>
        </div>
      </StorySection>
    </div>
  ),
}

// =============================================================================
// MOBILE APP SIMULATION (iPhone 17 Pro Max Template)
// =============================================================================

/**
 * Full mobile app simulation - iPhone 17 Pro Max
 * Uses the IPhoneFrame component from stories infrastructure
 */
export const MobileAppSimulation: Story = {
  render: () => (
    <StorySection
      title="Mobile App Context"
      description="Simulated mobile app with bottom navigation (iPhone 17 Pro Max - 430×932)"
    >
      <IPhoneFrame model="proMax">
        {/* App header */}
        <div className="h-14 bg-inverse-bg border-b border-white/10 flex items-center px-4">
          <span className="font-semibold text-inverse">Flow EHS</span>
        </div>

        {/* Content area - fills remaining space */}
        <div className="flex-1 bg-inverse-bg flex items-center justify-center">
          <div className="text-center text-inverse/50">
            <p className="text-sm">App Content Area</p>
            <p className="text-xs mt-1">Scroll to see navigation</p>
          </div>
        </div>

        {/* Bottom navigation */}
        <MobileNavBar position="relative" className="rounded-none">
          <MobileNavButton variant="myFlow" isActive />
          <MobileNavButton variant="steps" />
          <QuickActionButton variant="incident" size="lg" />
          <MobileNavButton variant="incidents" />
          <MobileNavButton variant="more" />
        </MobileNavBar>

        {/* Safe area padding at bottom */}
        <div className="h-8 bg-[rgba(251,251,243,0.85)]" />
      </IPhoneFrame>
    </StorySection>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Complete mobile app simulation showing the navigation bar in context. Uses iPhone 17 Pro Max dimensions (430×932 points).',
      },
    },
  },
}

// =============================================================================
// DARK MODE
// =============================================================================

/**
 * Navigation on dark background
 */
export const OnDarkBackground: Story = {
  decorators: [withDarkBackground()],
  render: () => (
    <StorySection title="On Dark Background">
      <div className="bg-inverse-bg p-6 rounded-lg">
        <div className="h-24 flex items-center justify-center text-inverse/50 text-sm mb-4">
          Dark Content Area
        </div>
        <MobileNavBar position="relative">
          <MobileNavButton variant="myFlow" isActive />
          <MobileNavButton variant="steps" />
          <QuickActionButton variant="incident" size="lg" />
          <MobileNavButton variant="incidents" />
          <MobileNavButton variant="more" />
        </MobileNavBar>
      </div>
    </StorySection>
  ),
}

// =============================================================================
// WITHOUT QUICKACTION
// =============================================================================

/**
 * Simple navigation without center action button
 */
export const WithoutQuickAction: Story = {
  render: () => (
    <StorySection
      title="Without QuickActionButton"
      description="Simple 4-item navigation"
    >
      <MobileNavBar position="relative">
        <MobileNavButton variant="myFlow" isActive />
        <MobileNavButton variant="steps" />
        <MobileNavButton variant="incidents" />
        <MobileNavButton variant="more" />
      </MobileNavBar>
    </StorySection>
  ),
}

// =============================================================================
// SPACING VARIANTS
// =============================================================================

/**
 * Different spacing options between nav items
 */
export const SpacingVariants: Story = {
  render: () => (
    <div className="space-y-8 p-6">
      <StorySection
        title="Tight Spacing (8px)"
        description="gap-2 - compact mobile nav"
      >
        <MobileNavBar position="relative" spacing="tight">
          <MobileNavButton variant="myFlow" isActive />
          <MobileNavButton variant="steps" />
          <QuickActionButton variant="incident" size="lg" />
          <MobileNavButton variant="incidents" />
          <MobileNavButton variant="more" />
        </MobileNavBar>
      </StorySection>

      <StorySection
        title="Default Spacing (12px)"
        description="gap-3 - standard button group"
      >
        <MobileNavBar position="relative" spacing="default">
          <MobileNavButton variant="myFlow" isActive />
          <MobileNavButton variant="steps" />
          <QuickActionButton variant="incident" size="lg" />
          <MobileNavButton variant="incidents" />
          <MobileNavButton variant="more" />
        </MobileNavBar>
      </StorySection>

      <StorySection
        title="Comfortable Spacing (16px)"
        description="gap-4 - more breathing room"
      >
        <MobileNavBar position="relative" spacing="comfortable">
          <MobileNavButton variant="myFlow" isActive />
          <MobileNavButton variant="steps" />
          <QuickActionButton variant="incident" size="lg" />
          <MobileNavButton variant="incidents" />
          <MobileNavButton variant="more" />
        </MobileNavBar>
      </StorySection>
    </div>
  ),
}

// =============================================================================
// ALLSTATES
// =============================================================================

/**
 * All component states (required)
 */
export const AllStates: Story = {
  render: () => (
    <div className="space-y-8 p-6">
      <StorySection title="Default Navigation Layout">
        <MobileNavBar position="relative">
          <MobileNavButton variant="myFlow" isActive />
          <MobileNavButton variant="steps" />
          <QuickActionButton variant="incident" size="lg" />
          <MobileNavButton variant="incidents" />
          <MobileNavButton variant="more" />
        </MobileNavBar>
      </StorySection>

      <StorySection title="Without Border">
        <MobileNavBar position="relative" showBorder={false}>
          <MobileNavButton variant="myFlow" isActive />
          <MobileNavButton variant="steps" />
          <QuickActionButton variant="incident" size="lg" />
          <MobileNavButton variant="incidents" />
          <MobileNavButton variant="more" />
        </MobileNavBar>
      </StorySection>

      <StorySection title="Solid Background">
        <MobileNavBar position="relative" variant="solid">
          <MobileNavButton variant="myFlow" isActive />
          <MobileNavButton variant="steps" />
          <QuickActionButton variant="incident" size="lg" />
          <MobileNavButton variant="incidents" />
          <MobileNavButton variant="more" />
        </MobileNavBar>
      </StorySection>
    </div>
  ),
}

// =============================================================================
// FLOW MOBILE NAV (Pre-configured Component)
// =============================================================================

/**
 * FlowMobileNav - Pre-configured navigation with incident reporting
 * This is the recommended way to use the mobile navigation in Flow EHS apps.
 */
export const FlowMobileNavDefault: Story = {
  render: () => (
    <StorySection
      title="FlowMobileNav - Pre-configured Component"
      description="Ready-to-use navigation with QuickActionButton (incident) in center"
    >
      <FlowMobileNav
        position="relative"
        activeItem="myFlow"
        onNavigate={(item) => alert(`Navigate to: ${item}`)}
        onQuickAction={() => alert('Report Incident clicked!')}
      />
    </StorySection>
  ),
}

/**
 * FlowMobileNav with different active items
 */
export const FlowMobileNavActiveStates: Story = {
  render: () => (
    <div className="space-y-8 p-6">
      <StorySection title="My Flow Active">
        <FlowMobileNav position="relative" activeItem="myFlow" />
      </StorySection>

      <StorySection title="Steps Active">
        <FlowMobileNav position="relative" activeItem="steps" />
      </StorySection>

      <StorySection title="Incidents Active">
        <FlowMobileNav position="relative" activeItem="incidents" />
      </StorySection>

      <StorySection title="More Active">
        <FlowMobileNav position="relative" activeItem="more" />
      </StorySection>
    </div>
  ),
}

/**
 * FlowMobileNav with different QuickAction variants
 */
export const FlowMobileNavQuickActionVariants: Story = {
  render: () => (
    <div className="space-y-8 p-6">
      <StorySection
        title="Incident Reporting (Default)"
        description="Red gradient - for urgent incident reporting"
      >
        <FlowMobileNav
          position="relative"
          activeItem="myFlow"
          quickActionVariant="incident"
        />
      </StorySection>

      <StorySection
        title="Create Action"
        description="Teal gradient - for general creation"
      >
        <FlowMobileNav
          position="relative"
          activeItem="myFlow"
          quickActionVariant="create"
        />
      </StorySection>

      <StorySection
        title="Emergency Action"
        description="Orange gradient - for emergency calls"
      >
        <FlowMobileNav
          position="relative"
          activeItem="myFlow"
          quickActionVariant="emergency"
        />
      </StorySection>

      <StorySection
        title="Capture Action"
        description="Green gradient - for photo/document capture"
      >
        <FlowMobileNav
          position="relative"
          activeItem="myFlow"
          quickActionVariant="capture"
        />
      </StorySection>
    </div>
  ),
}

/**
 * FlowMobileNav in mobile app context - iPhone 17 Pro Max
 */
export const FlowMobileNavInApp: Story = {
  render: () => (
    <StorySection
      title="FlowMobileNav in App Context"
      description="Pre-configured navigation in iPhone 17 Pro Max frame (430×932)"
    >
      <IPhoneFrame model="proMax">
        {/* App header */}
        <div className="h-14 bg-inverse-bg border-b border-white/10 flex items-center px-4">
          <span className="font-semibold text-inverse">Flow EHS</span>
        </div>

        {/* Content area */}
        <div className="flex-1 bg-inverse-bg flex items-center justify-center">
          <div className="text-center text-inverse/50">
            <p className="text-sm">App Content Area</p>
            <p className="text-xs mt-1">Tap navigation items</p>
          </div>
        </div>

        {/* FlowMobileNav - pre-configured */}
        <FlowMobileNav
          position="relative"
          activeItem="myFlow"
          onNavigate={(item) => alert(`Navigate to: ${item}`)}
          onQuickAction={() => alert('Report Incident!')}
        />

        {/* Safe area padding */}
        <div className="h-8 bg-[rgba(251,251,243,0.85)]" />
      </IPhoneFrame>
    </StorySection>
  ),
}
