import type { Meta, StoryObj } from '@storybook/react'
import {
  MOLECULE_META,
  moleculeDescription,
} from '@/stories/_infrastructure'
import {
  AppCard,
  AppCardHeader,
  AppCardTitle,
  AppCardDescription,
  AppCardContent,
  AppCardFooter,
  AppCardAction,
} from './app-card'
import { Button } from './button'

// =============================================================================
// META CONFIGURATION
// =============================================================================

const meta: Meta<typeof AppCard> = {
  title: 'Core/AppCard',
  component: AppCard,
  ...MOLECULE_META,
  parameters: {
    ...MOLECULE_META.parameters,
    docs: {
      description: {
        component: moleculeDescription(
          'Container component for in-app use with header, content, and footer sections. Features elevated, flat, and default variants with configurable shadow levels.'
        ),
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'elevated', 'flat'],
      description: 'Card variant style for app use',
    },
    shadow: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'xl', 'elevated'],
      description: 'Shadow elevation level (elevated = natural light from above)',
    },
  },
}

export default meta
type Story = StoryObj<typeof AppCard>

// =============================================================================
// BASIC STORIES
// =============================================================================

// Basic card with header/content/footer
export const Default: Story = {
  render: () => (
    <AppCard className="w-[380px]" shadow="sm">
      <AppCardHeader>
        <AppCardTitle>Card Title</AppCardTitle>
        <AppCardDescription>Card description goes here</AppCardDescription>
      </AppCardHeader>
      <AppCardContent>
        <p className="text-sm text-muted leading-relaxed">
          This is the main content area of the card.
        </p>
      </AppCardContent>
      <AppCardFooter className="justify-end gap-2">
        <Button variant="outline" size="sm">Cancel</Button>
        <Button size="sm" variant="contact">Confirm</Button>
      </AppCardFooter>
    </AppCard>
  ),
}

// Elevated card with natural light shadow
export const Elevated: Story = {
  render: () => (
    <AppCard variant="elevated" shadow="elevated" className="w-[408px]">
      <AppCardHeader>
        <AppCardTitle className="text-primary text-lg">Elevated Card</AppCardTitle>
        <AppCardDescription>Natural gradient + realistic shadow</AppCardDescription>
      </AppCardHeader>
      <AppCardContent>
        <p className="text-sm text-muted leading-relaxed">
          The elevated variant features a subtle gradient background and natural shadow mimicking light from above.
          Ideal for dashboard widgets, feature highlights, or important notifications.
        </p>
      </AppCardContent>
    </AppCard>
  ),
}

// Flat card with minimal styling
export const Flat: Story = {
  render: () => (
    <AppCard variant="flat" className="w-[380px]">
      <AppCardHeader>
        <AppCardTitle>Flat Card</AppCardTitle>
        <AppCardDescription>Minimal styling</AppCardDescription>
      </AppCardHeader>
      <AppCardContent>
        <p className="text-sm text-muted">
          Minimal card variant without borders or shadows. Use for grouped content or nested layouts.
        </p>
      </AppCardContent>
    </AppCard>
  ),
}

// Card with action button in header
export const WithAction: Story = {
  render: () => (
    <AppCard className="w-[380px]" shadow="sm">
      <AppCardHeader>
        <AppCardTitle>Card with Action</AppCardTitle>
        <AppCardDescription>Header action demonstration</AppCardDescription>
        <AppCardAction>
          <Button variant="ghost" size="sm">Edit</Button>
        </AppCardAction>
      </AppCardHeader>
      <AppCardContent>
        <p className="text-sm text-muted">
          Use AppCardAction for quick actions in the card header.
        </p>
      </AppCardContent>
    </AppCard>
  ),
}

// Usage Guidelines
export const UsageGuidelines: Story = {
  name: 'Usage Guidelines',
  render: () => (
    <div className="flex flex-col gap-8 p-8 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-primary mb-2">Icon Contrast Guidelines</h2>
        <p className="text-muted mb-6">
          When using colored icons on elevated cards (gradient backgrounds), ensure proper contrast:
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Good Example */}
        <div>
          <p className="text-sm font-semibold text-success mb-3">✓ High Contrast (Dark icon colors)</p>
          <AppCard variant="elevated" shadow="elevated" className="w-full">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-error/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-primary text-sm">Clear & visible</h3>
                <p className="text-xs text-muted">Dark saturated colors</p>
              </div>
            </div>
          </AppCard>
        </div>

        {/* Bad Example */}
        <div>
          <p className="text-sm font-semibold text-error mb-3">✗ Low Contrast (Light teal)</p>
          <AppCard variant="elevated" shadow="elevated" className="w-full">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-primary text-sm">Hard to see</h3>
                <p className="text-xs text-muted">Light color on light bg</p>
              </div>
            </div>
          </AppCard>
        </div>
      </div>

      <div className="bg-muted/50 p-4 rounded-lg">
        <p className="text-sm text-primary">
          <strong>Recommendation:</strong> On light gradient backgrounds, use dark, saturated colors for icons
          (error, success, warning, primary) instead of light colors (accent, info) to ensure proper visibility.
        </p>
      </div>
    </div>
  ),
}

// =============================================================================
// SHADOW LEVELS
// =============================================================================

export const ShadowLevels: Story = {
  render: () => (
    <div className="flex gap-6 flex-wrap">
      <AppCard shadow="none" className="w-[130px] p-4">
        <p className="text-sm text-center">none</p>
      </AppCard>
      <AppCard shadow="sm" className="w-[130px] p-4">
        <p className="text-sm text-center">sm</p>
      </AppCard>
      <AppCard shadow="md" className="w-[130px] p-4">
        <p className="text-sm text-center">md</p>
      </AppCard>
      <AppCard shadow="lg" className="w-[130px] p-4">
        <p className="text-sm text-center">lg</p>
      </AppCard>
      <AppCard shadow="xl" className="w-[130px] p-4">
        <p className="text-sm text-center">xl</p>
      </AppCard>
      <AppCard shadow="elevated" className="w-[130px] p-4">
        <p className="text-sm text-center font-semibold">elevated</p>
        <p className="text-xs text-muted mt-1">natural light</p>
      </AppCard>
    </div>
  ),
}

// =============================================================================
// IN-APP CARD EXAMPLES
// =============================================================================

export const DashboardCards: Story = {
  render: () => (
    <div className="flex gap-6">
      <AppCard variant="elevated" shadow="elevated" className="w-[408px]">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-error/10 flex items-center justify-center">
            <svg className="w-6 h-6 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-primary">Active Incidents</h3>
            <p className="text-sm text-muted">12 open items</p>
          </div>
        </div>
        <p className="text-sm text-muted mt-4">
          Track and manage active safety incidents across all facilities.
        </p>
      </AppCard>
      <AppCard variant="elevated" shadow="elevated" className="w-[408px]">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
            <svg className="w-6 h-6 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-primary">Compliance Score</h3>
            <p className="text-sm text-muted">94% compliant</p>
          </div>
        </div>
        <p className="text-sm text-muted mt-4">
          Monitor regulatory compliance across your organization.
        </p>
      </AppCard>
    </div>
  ),
}

// =============================================================================
// ALL STATES STORY (Visual Testing Matrix)
// =============================================================================

export const AllStates: Story = {
  name: 'All States',
  render: () => (
    <div className="flex flex-col gap-12 p-8">
      {/* Variants Grid */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-primary">Variants</h3>
        <div className="grid grid-cols-3 gap-6">
          {/* Default */}
          <div>
            <p className="text-xs text-muted mb-2">default</p>
            <AppCard shadow="sm" className="w-[280px]">
              <AppCardHeader>
                <AppCardTitle>Default</AppCardTitle>
                <AppCardDescription>Standard variant</AppCardDescription>
              </AppCardHeader>
              <AppCardContent>
                <p className="text-sm text-muted">Content area</p>
              </AppCardContent>
            </AppCard>
          </div>

          {/* Elevated */}
          <div>
            <p className="text-xs text-muted mb-2">elevated</p>
            <AppCard variant="elevated" shadow="elevated" className="w-[280px]">
              <AppCardHeader>
                <AppCardTitle>Elevated</AppCardTitle>
                <AppCardDescription>Enhanced emphasis</AppCardDescription>
              </AppCardHeader>
              <AppCardContent>
                <p className="text-sm text-muted">Content area</p>
              </AppCardContent>
            </AppCard>
          </div>

          {/* Flat */}
          <div>
            <p className="text-xs text-muted mb-2">flat</p>
            <AppCard variant="flat" className="w-[280px]">
              <AppCardHeader>
                <AppCardTitle>Flat</AppCardTitle>
                <AppCardDescription>Minimal styling</AppCardDescription>
              </AppCardHeader>
              <AppCardContent>
                <p className="text-sm text-muted">Content area</p>
              </AppCardContent>
            </AppCard>
          </div>
        </div>
      </div>

      {/* Shadow Levels */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-primary">Shadow Levels</h3>
        <div className="flex gap-4 flex-wrap">
          {['none', 'sm', 'md', 'lg', 'xl', 'elevated'].map((shadow) => (
            <div key={shadow}>
              <p className="text-xs text-muted mb-2">{shadow}</p>
              <AppCard shadow={shadow as any} className="w-[110px] h-[110px] p-3 flex items-center justify-center">
                <p className="text-sm text-center">{shadow}</p>
              </AppCard>
            </div>
          ))}
        </div>
      </div>

      {/* Composition Examples */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-primary">Composition Examples</h3>
        <div className="grid grid-cols-2 gap-6">
          {/* Full composition */}
          <AppCard shadow="sm" className="w-[340px]">
            <AppCardHeader>
              <AppCardTitle>Full Composition</AppCardTitle>
              <AppCardDescription>All sub-components</AppCardDescription>
              <AppCardAction>
                <Button variant="ghost" size="sm">Edit</Button>
              </AppCardAction>
            </AppCardHeader>
            <AppCardContent>
              <p className="text-sm text-muted">
                Header + Content + Footer + Action
              </p>
            </AppCardContent>
            <AppCardFooter className="justify-end gap-2">
              <Button variant="outline" size="sm">Cancel</Button>
              <Button size="sm">Save</Button>
            </AppCardFooter>
          </AppCard>

          {/* Minimal composition */}
          <AppCard shadow="sm" className="w-[340px]">
            <AppCardHeader>
              <AppCardTitle>Minimal Composition</AppCardTitle>
            </AppCardHeader>
            <AppCardContent>
              <p className="text-sm text-muted">
                Header + Content only
              </p>
            </AppCardContent>
          </AppCard>
        </div>
      </div>

      {/* Focus State Testing */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-primary">Focus States</h3>
        <div className="flex gap-6">
          <AppCard
            shadow="sm"
            className="w-[280px] cursor-pointer hover:shadow-md transition-shadow"
            tabIndex={0}
          >
            <AppCardHeader>
              <AppCardTitle>Interactive Card</AppCardTitle>
              <AppCardDescription>Focusable with keyboard</AppCardDescription>
            </AppCardHeader>
            <AppCardContent>
              <p className="text-sm text-muted">
                Tab to focus, see outline ring
              </p>
            </AppCardContent>
          </AppCard>
        </div>
      </div>
    </div>
  ),
}
