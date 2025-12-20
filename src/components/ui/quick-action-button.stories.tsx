/**
 * QuickActionButton Stories
 *
 * Demonstrates the QuickActionButton component in mobile navigation context.
 * Primary use case: prominent action button in center of mobile nav bar.
 */

import type { Meta, StoryObj } from '@storybook/react'
import { Home, FileText, Bell, Settings, ClipboardList } from 'lucide-react'
import { QuickActionButton, type QuickActionVariant } from '../../flow/components/quick-action-button'
import {
  ATOM_META,
  atomDescription,
  StorySection,
  StoryFlex,
  withDarkBackground,
} from '../../stories/_infrastructure'

// =============================================================================
// META
// =============================================================================

const meta: Meta<typeof QuickActionButton> = {
  title: 'Flow/Components/QuickActionButton',
  component: QuickActionButton,
  ...ATOM_META,
  parameters: {
    ...ATOM_META.parameters,
    docs: {
      description: {
        component: atomDescription(
          `A prominent gradient action button for mobile navigation.

**Primary Use Case:**
Placed in the center of mobile navigation bars for quick access to key actions
like reporting incidents, creating records, or emergency calls.

**Variants:**
| Variant | Gradient | Icon | Use Case |
|---------|----------|------|----------|
| incident | Red (CORAL) | AlertTriangle | Report incidents - default |
| create | Teal (DEEP_CURRENT) | Plus | Create new items |
| emergency | Orange | Phone | Emergency calls |
| capture | Green (HARBOR) | Camera | Photo/document capture |
| custom | User-defined | Custom | Custom actions |

**Features:**
- Vertical gradient fill (light → medium → dark)
- Glass-like gradient border (white → transparent)
- Touch-optimized with active state feedback
- Multiple size variants for different nav bar heights
- Customizable icons`
        ),
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['incident', 'create', 'emergency', 'capture', 'custom'] satisfies QuickActionVariant[],
      description: 'Button variant determines gradient and default icon',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
      description: 'Button size',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the button',
    },
  },
}

export default meta

type Story = StoryObj<typeof QuickActionButton>

// =============================================================================
// INDIVIDUAL VARIANTS
// =============================================================================

/**
 * Default: Incident reporting button (red gradient)
 * Primary use case - report incidents quickly from mobile nav
 */
export const Default: Story = {
  args: {
    variant: 'incident',
  },
}

/**
 * Create variant - teal gradient for creation actions
 */
export const Create: Story = {
  args: {
    variant: 'create',
  },
}

/**
 * Emergency variant - orange gradient for urgent actions
 */
export const Emergency: Story = {
  args: {
    variant: 'emergency',
  },
}

/**
 * Capture variant - green gradient for photo/document capture
 */
export const Capture: Story = {
  args: {
    variant: 'capture',
  },
}

/**
 * Disabled state
 */
export const Disabled: Story = {
  args: {
    variant: 'incident',
    disabled: true,
  },
}

// =============================================================================
// SIZE VARIANTS
// =============================================================================

/**
 * All size variants
 */
export const Sizes: Story = {
  render: () => (
    <StorySection title="Size Variants">
      <StoryFlex>
        <div className="flex flex-col items-center gap-2">
          <QuickActionButton variant="incident" size="sm" />
          <span className="text-xs text-secondary">Small (48px)</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <QuickActionButton variant="incident" size="md" />
          <span className="text-xs text-secondary">Medium (56px)</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <QuickActionButton variant="incident" size="lg" />
          <span className="text-xs text-secondary">Large (64px)</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <QuickActionButton variant="incident" size="xl" />
          <span className="text-xs text-secondary">XL (80px)</span>
        </div>
      </StoryFlex>
    </StorySection>
  ),
}

// =============================================================================
// ALL VARIANTS
// =============================================================================

const VARIANTS: Exclude<QuickActionVariant, 'custom'>[] = ['incident', 'create', 'emergency', 'capture']
const VARIANT_LABELS: Record<Exclude<QuickActionVariant, 'custom'>, string> = {
  incident: 'Incident',
  create: 'Create',
  emergency: 'Emergency',
  capture: 'Capture',
}

/**
 * All variants displayed together
 */
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-8 p-6">
      <StorySection title="All Variants">
        <StoryFlex>
          {VARIANTS.map((variant) => (
            <div key={variant} className="flex flex-col items-center gap-2">
              <QuickActionButton variant={variant} />
              <span className="text-xs text-secondary">{VARIANT_LABELS[variant]}</span>
            </div>
          ))}
        </StoryFlex>
      </StorySection>

      <StorySection title="On Dark Background">
        <div className="bg-inverse-bg p-6 rounded-lg">
          <StoryFlex>
            {VARIANTS.map((variant) => (
              <div key={variant} className="flex flex-col items-center gap-2">
                <QuickActionButton variant={variant} />
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
// MOBILE NAVIGATION CONTEXT
// =============================================================================

/**
 * Mock mobile nav item for context demos
 */
const MobileNavItem = ({
  icon: Icon,
  label,
  active = false,
}: {
  icon: typeof Home
  label: string
  active?: boolean
}) => (
  <button
    type="button"
    className={`flex flex-col items-center gap-1 p-2 min-w-[60px] ${
      active ? 'text-accent' : 'text-secondary'
    }`}
  >
    <Icon size={20} />
    <span className="text-[10px]">{label}</span>
  </button>
)

/**
 * In mobile navigation context - the primary use case
 */
export const InMobileNav: Story = {
  render: () => (
    <div className="space-y-8">
      <StorySection
        title="Mobile Navigation Context"
        description="QuickActionButton positioned in center of bottom navigation"
      >
        {/* Mobile nav simulation */}
        <div className="max-w-sm mx-auto">
          <div className="bg-surface border border-default rounded-t-2xl shadow-lg">
            {/* Content area placeholder */}
            <div className="h-48 flex items-center justify-center text-secondary text-sm">
              App Content Area
            </div>
          </div>

          {/* Bottom navigation bar */}
          <div className="bg-surface border-x border-b border-default rounded-b-2xl shadow-lg">
            <div className="flex items-center justify-around py-2 relative">
              <MobileNavItem icon={Home} label="Home" active />
              <MobileNavItem icon={ClipboardList} label="Tasks" />

              {/* Center action button - elevated */}
              <div className="relative -mt-8">
                <QuickActionButton
                  variant="incident"
                  size="lg"
                  onClick={() => alert('Report Incident clicked!')}
                />
              </div>

              <MobileNavItem icon={Bell} label="Alerts" />
              <MobileNavItem icon={Settings} label="Settings" />
            </div>
          </div>
        </div>
      </StorySection>

      <StorySection
        title="Different Actions in Nav"
        description="Various button variants in navigation context"
      >
        <div className="flex gap-6 flex-wrap">
          {VARIANTS.map((variant) => (
            <div key={variant} className="max-w-[200px]">
              <div className="bg-surface border border-default rounded-2xl shadow-md overflow-hidden">
                <div className="h-24 flex items-center justify-center text-secondary text-xs">
                  Content
                </div>
                <div className="flex items-center justify-around py-2 border-t border-default relative">
                  <div className="w-8 h-8 rounded-full bg-muted" />
                  <div className="relative -mt-6">
                    <QuickActionButton variant={variant} size="md" />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-muted" />
                </div>
              </div>
              <p className="text-xs text-center text-secondary mt-2">{VARIANT_LABELS[variant]}</p>
            </div>
          ))}
        </div>
      </StorySection>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Primary use case: QuickActionButton in the center of mobile bottom navigation, elevated above the nav bar for prominence.',
      },
    },
  },
}

/**
 * Dark mode mobile nav
 */
export const InMobileNavDark: Story = {
  decorators: [withDarkBackground()],
  render: () => (
    <StorySection title="Dark Mode Mobile Navigation">
      <div className="max-w-sm mx-auto">
        {/* Dark bottom nav */}
        <div className="bg-inverse-bg rounded-2xl">
          <div className="h-32 flex items-center justify-center text-inverse/50 text-sm">
            Dark App Content
          </div>
          <div className="flex items-center justify-around py-3 border-t border-white/10 relative">
            <div className="flex flex-col items-center gap-1 text-inverse/60">
              <Home size={20} />
              <span className="text-[10px]">Home</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-inverse/60">
              <FileText size={20} />
              <span className="text-[10px]">Tasks</span>
            </div>

            <div className="relative -mt-8">
              <QuickActionButton variant="incident" size="lg" />
            </div>

            <div className="flex flex-col items-center gap-1 text-inverse/60">
              <Bell size={20} />
              <span className="text-[10px]">Alerts</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-inverse/60">
              <Settings size={20} />
              <span className="text-[10px]">More</span>
            </div>
          </div>
        </div>
      </div>
    </StorySection>
  ),
}

// =============================================================================
// CUSTOM ICON
// =============================================================================

/**
 * With custom icon
 */
export const CustomIcon: Story = {
  render: () => (
    <StorySection title="Custom Icons">
      <StoryFlex>
        <div className="flex flex-col items-center gap-2">
          <QuickActionButton
            variant="incident"
            icon={<FileText size={28} strokeWidth={2.5} />}
          />
          <span className="text-xs text-secondary">Custom Icon</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <QuickActionButton
            variant="create"
            icon={<ClipboardList size={28} strokeWidth={2.5} />}
          />
          <span className="text-xs text-secondary">Checklist</span>
        </div>
      </StoryFlex>
    </StorySection>
  ),
}

// =============================================================================
// INTERACTIVE DEMO
// =============================================================================

/**
 * Interactive demo showing click feedback
 */
export const Interactive: Story = {
  render: () => (
    <StorySection
      title="Interactive Demo"
      description="Click/tap the buttons to see active state feedback"
    >
      <StoryFlex>
        {VARIANTS.map((variant) => (
          <QuickActionButton
            key={variant}
            variant={variant}
            onClick={() => alert(`${VARIANT_LABELS[variant]} action triggered!`)}
          />
        ))}
      </StoryFlex>
    </StorySection>
  ),
}
