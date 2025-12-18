import type { Meta, StoryObj } from '@storybook/react'
import {
  MOLECULE_META,
  moleculeDescription,
} from '@/stories/_infrastructure'
import { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs'

// =============================================================================
// META CONFIGURATION
// =============================================================================

const meta: Meta<typeof Tabs> = {
  title: 'Core/Tabs',
  component: Tabs,
  ...MOLECULE_META,
  parameters: {
    ...MOLECULE_META.parameters,
    docs: {
      description: {
        component: moleculeDescription(
          `Tabbed content panels built on Radix UI Tabs primitive.

**Features:**
- Keyboard navigation (Arrow keys, Home/End)
- Horizontal and vertical orientations
- Accessible by default (ARIA roles)

**Sub-components:** Tabs, TabsList, TabsTrigger, TabsContent`
        ),
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Tabs>

// =============================================================================
// STORIES
// =============================================================================

/**
 * Visual matrix showing all component states, orientations, and keyboard behavior.
 * Use this as reference when implementing tabs in your application.
 *
 * Demonstrates:
 * - Horizontal and vertical orientations
 * - Active, inactive, and disabled states
 * - Full-width vs auto-width layouts
 * - Keyboard navigation patterns
 */
export const AllStates: Story = {
  render: () => (
    <div className="space-y-12 p-8 max-w-4xl">
      {/* Component Anatomy */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-primary">Component Anatomy</h3>
        <div className="p-4 border border-default rounded-lg bg-muted-bg/50">
          <div className="space-y-2 text-sm text-secondary">
            <p><span className="font-semibold text-primary">Tabs:</span> Root container (data-slot="tabs")</p>
            <p><span className="font-semibold text-primary">TabsList:</span> Container for triggers (data-slot="tabs-list")</p>
            <p><span className="font-semibold text-primary">TabsTrigger:</span> Clickable tab button (data-slot="tabs-trigger")</p>
            <p><span className="font-semibold text-primary">TabsContent:</span> Content panel (data-slot="tabs-content")</p>
          </div>
        </div>
      </div>

      {/* Horizontal Tabs - Default */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-primary">Horizontal Tabs (Default)</h3>
        <Tabs defaultValue="account" className="w-[400px]">
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="account" className="p-4">
            <h4 className="text-base font-semibold text-primary mb-2">Account</h4>
            <p className="text-secondary text-sm">
              Make changes to your account here.
            </p>
          </TabsContent>
          <TabsContent value="password" className="p-4">
            <h4 className="text-base font-semibold text-primary mb-2">Password</h4>
            <p className="text-secondary text-sm">
              Change your password here.
            </p>
          </TabsContent>
          <TabsContent value="settings" className="p-4">
            <h4 className="text-base font-semibold text-primary mb-2">Settings</h4>
            <p className="text-secondary text-sm">
              Configure your settings here.
            </p>
          </TabsContent>
        </Tabs>
      </div>

      {/* Full Width Tabs */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-primary">Full Width Layout</h3>
        <div className="w-[500px]">
          <Tabs defaultValue="overview">
            <TabsList className="w-full grid grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="p-4">
              <p className="text-secondary text-sm">Overview content panel.</p>
            </TabsContent>
            <TabsContent value="analytics" className="p-4">
              <p className="text-secondary text-sm">Analytics content panel.</p>
            </TabsContent>
            <TabsContent value="reports" className="p-4">
              <p className="text-secondary text-sm">Reports content panel.</p>
            </TabsContent>
            <TabsContent value="settings" className="p-4">
              <p className="text-secondary text-sm">Settings content panel.</p>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Disabled State */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-primary">With Disabled Tab</h3>
        <Tabs defaultValue="account" className="w-[400px]">
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
            <TabsTrigger value="billing" disabled>
              Billing
            </TabsTrigger>
          </TabsList>
          <TabsContent value="account" className="p-4">
            <p className="text-secondary text-sm">Account settings content.</p>
          </TabsContent>
          <TabsContent value="password" className="p-4">
            <p className="text-secondary text-sm">Password settings content.</p>
          </TabsContent>
          <TabsContent value="billing" className="p-4">
            <p className="text-secondary text-sm">Billing settings (disabled).</p>
          </TabsContent>
        </Tabs>
      </div>

      {/* Vertical Orientation */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-primary">Vertical Orientation</h3>
        <div className="flex gap-4 w-[500px]">
          <Tabs defaultValue="general" orientation="vertical" className="flex gap-4">
            <TabsList className="flex flex-col h-auto bg-transparent p-0 gap-1">
              <TabsTrigger
                value="general"
                className="justify-start data-[state=active]:bg-accent-bg data-[state=active]:text-accent"
              >
                General
              </TabsTrigger>
              <TabsTrigger
                value="security"
                className="justify-start data-[state=active]:bg-accent-bg data-[state=active]:text-accent"
              >
                Security
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="justify-start data-[state=active]:bg-accent-bg data-[state=active]:text-accent"
              >
                Notifications
              </TabsTrigger>
            </TabsList>
            <div className="flex-1 border-l border-default pl-4">
              <TabsContent value="general" className="mt-0">
                <h4 className="text-base font-semibold text-primary mb-2">General Settings</h4>
                <p className="text-secondary text-sm">
                  Configure your general application settings.
                </p>
              </TabsContent>
              <TabsContent value="security" className="mt-0">
                <h4 className="text-base font-semibold text-primary mb-2">Security</h4>
                <p className="text-secondary text-sm">
                  Manage your security settings.
                </p>
              </TabsContent>
              <TabsContent value="notifications" className="mt-0">
                <h4 className="text-base font-semibold text-primary mb-2">Notifications</h4>
                <p className="text-secondary text-sm">
                  Control which notifications you receive.
                </p>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>

      {/* Keyboard Navigation Reference */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-primary">Keyboard Navigation</h3>
        <ul className="text-sm text-secondary space-y-1">
          <li><span className="font-semibold text-primary">Arrow Left/Right:</span> Navigate between horizontal tabs</li>
          <li><span className="font-semibold text-primary">Arrow Up/Down:</span> Navigate between vertical tabs</li>
          <li><span className="font-semibold text-primary">Home:</span> Jump to first tab</li>
          <li><span className="font-semibold text-primary">End:</span> Jump to last tab</li>
          <li><span className="font-semibold text-primary">Tab:</span> Move focus to content panel</li>
        </ul>
      </div>
    </div>
  ),
}

/**
 * Basic horizontal tabs with three panels.
 * Use for simple content organization.
 */
export const Default: Story = {
  render: () => (
    <Tabs defaultValue="account" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="account" className="p-4">
        <h3 className="text-lg font-semibold text-primary mb-2">Account</h3>
        <p className="text-secondary text-sm">
          Make changes to your account here. Click save when you're done.
        </p>
      </TabsContent>
      <TabsContent value="password" className="p-4">
        <h3 className="text-lg font-semibold text-primary mb-2">Password</h3>
        <p className="text-secondary text-sm">
          Change your password here. After saving, you'll be logged out.
        </p>
      </TabsContent>
      <TabsContent value="settings" className="p-4">
        <h3 className="text-lg font-semibold text-primary mb-2">Settings</h3>
        <p className="text-secondary text-sm">
          Configure your application settings and preferences.
        </p>
      </TabsContent>
    </Tabs>
  ),
}

/**
 * Vertical tabs layout for settings pages.
 * Use when space allows for side-by-side navigation.
 */
export const Vertical: Story = {
  render: () => (
    <div className="flex gap-4 w-[600px]">
      <Tabs defaultValue="general" orientation="vertical" className="flex gap-4">
        <TabsList className="flex flex-col h-auto bg-transparent p-0 gap-1">
          <TabsTrigger
            value="general"
            className="justify-start data-[state=active]:bg-accent-bg data-[state=active]:text-accent"
          >
            General
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="justify-start data-[state=active]:bg-accent-bg data-[state=active]:text-accent"
          >
            Security
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="justify-start data-[state=active]:bg-accent-bg data-[state=active]:text-accent"
          >
            Notifications
          </TabsTrigger>
          <TabsTrigger
            value="integrations"
            className="justify-start data-[state=active]:bg-accent-bg data-[state=active]:text-accent"
          >
            Integrations
          </TabsTrigger>
        </TabsList>
        <div className="flex-1 border-l border-default pl-4">
          <TabsContent value="general" className="mt-0">
            <h3 className="text-lg font-semibold text-primary mb-2">General Settings</h3>
            <p className="text-secondary text-sm">
              Configure your general application settings like language, timezone, and display preferences.
            </p>
          </TabsContent>
          <TabsContent value="security" className="mt-0">
            <h3 className="text-lg font-semibold text-primary mb-2">Security</h3>
            <p className="text-secondary text-sm">
              Manage your security settings including two-factor authentication and session management.
            </p>
          </TabsContent>
          <TabsContent value="notifications" className="mt-0">
            <h3 className="text-lg font-semibold text-primary mb-2">Notifications</h3>
            <p className="text-secondary text-sm">
              Control which notifications you receive and how you receive them.
            </p>
          </TabsContent>
          <TabsContent value="integrations" className="mt-0">
            <h3 className="text-lg font-semibold text-primary mb-2">Integrations</h3>
            <p className="text-secondary text-sm">
              Connect your account to third-party services and manage API access.
            </p>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  ),
}
