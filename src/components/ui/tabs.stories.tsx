import type { Meta, StoryObj } from '@storybook/react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs'

// =============================================================================
// META
// =============================================================================

const meta: Meta<typeof Tabs> = {
  title: 'Core/Tabs',
  component: Tabs,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A set of layered sections of content, known as tab panels, that display one panel of content at a time.
Built on Radix UI Tabs primitive with DDS styling.

Features:
- Keyboard navigation (Arrow keys, Home/End)
- Automatic/manual activation modes
- Accessible by default
- Styled with DDS design tokens
        `,
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Tabs>

// =============================================================================
// STORIES
// =============================================================================

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

export const FullWidth: Story = {
  render: () => (
    <div className="w-[500px]">
      <Tabs defaultValue="overview">
        <TabsList className="w-full grid grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="p-4 border border-default rounded-lg mt-4">
          <h3 className="text-lg font-semibold text-primary mb-2">Overview</h3>
          <p className="text-secondary text-sm">
            Get a high-level view of your dashboard metrics and key performance indicators.
          </p>
        </TabsContent>
        <TabsContent value="analytics" className="p-4 border border-default rounded-lg mt-4">
          <h3 className="text-lg font-semibold text-primary mb-2">Analytics</h3>
          <p className="text-secondary text-sm">
            Deep dive into your analytics data with detailed charts and graphs.
          </p>
        </TabsContent>
        <TabsContent value="reports" className="p-4 border border-default rounded-lg mt-4">
          <h3 className="text-lg font-semibold text-primary mb-2">Reports</h3>
          <p className="text-secondary text-sm">
            Generate and download reports for your business needs.
          </p>
        </TabsContent>
        <TabsContent value="notifications" className="p-4 border border-default rounded-lg mt-4">
          <h3 className="text-lg font-semibold text-primary mb-2">Notifications</h3>
          <p className="text-secondary text-sm">
            Manage your notification preferences and alert settings.
          </p>
        </TabsContent>
      </Tabs>
    </div>
  ),
}

export const WithDisabledTab: Story = {
  render: () => (
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
        <p className="text-secondary text-sm">Billing settings content (disabled).</p>
      </TabsContent>
    </Tabs>
  ),
}

export const WithCards: Story = {
  render: () => (
    <div className="w-[500px]">
      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="plan">Plan</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="mt-4">
          <div className="p-4 bg-white border border-default rounded-lg shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-accent-strong text-white flex items-center justify-center font-semibold">
                JD
              </div>
              <div>
                <h3 className="font-semibold text-primary">John Doe</h3>
                <p className="text-sm text-secondary">john@example.com</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-secondary">Role</span>
                <span className="text-primary font-medium">Administrator</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-secondary">Last Active</span>
                <span className="text-primary font-medium">2 hours ago</span>
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="team" className="mt-4">
          <div className="p-4 bg-white border border-default rounded-lg shadow-sm">
            <h3 className="font-semibold text-primary mb-4">Team Members</h3>
            <div className="space-y-3">
              {['Alice Smith', 'Bob Johnson', 'Carol Williams'].map((name) => (
                <div key={name} className="flex items-center gap-3 p-2 hover:bg-muted-bg rounded-md">
                  <div className="w-8 h-8 rounded-full bg-muted-bg text-secondary flex items-center justify-center text-sm font-medium">
                    {name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <span className="text-primary text-sm">{name}</span>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="plan" className="mt-4">
          <div className="p-4 bg-white border border-default rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-primary">Current Plan</h3>
              <span className="px-2 py-1 bg-accent-bg text-accent text-xs font-semibold rounded">
                Pro
              </span>
            </div>
            <p className="text-secondary text-sm mb-4">
              You're currently on the Pro plan with 100 users included.
            </p>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-accent-strong text-white rounded-md text-sm font-medium hover:bg-accent-strong/90">
                Upgrade
              </button>
              <button className="px-4 py-2 border border-default text-secondary rounded-md text-sm font-medium hover:bg-muted-bg">
                Manage
              </button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  ),
}

export const Vertical: Story = {
  render: () => (
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

export const InCard: Story = {
  render: () => (
    <div className="w-[500px] p-6 bg-white border border-default rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold text-primary mb-4">Tenant Request Details</h2>
      <Tabs defaultValue="overview">
        <TabsList className="w-full">
          <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
          <TabsTrigger value="company" className="flex-1">Company</TabsTrigger>
          <TabsTrigger value="contact" className="flex-1">Contact</TabsTrigger>
          <TabsTrigger value="billing" className="flex-1">Billing</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-4 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-sm font-medium text-primary">REQ-20251208-5313</span>
              <span className="ml-2 px-2 py-0.5 bg-warning-light text-warning text-xs font-semibold rounded">
                Pending Payment
              </span>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-primary">$221,000.04/year</p>
              <p className="text-sm text-secondary">$18,416.67/month</p>
            </div>
          </div>
          <div className="p-3 bg-accent-bg rounded-lg border border-accent/30">
            <p className="text-sm font-medium text-primary">Partner & Commission</p>
            <p className="text-sm text-secondary mt-1">Commission Eligible: <span className="text-success">Yes</span></p>
          </div>
        </TabsContent>
        <TabsContent value="company" className="mt-4">
          <p className="text-secondary text-sm">Company information tab content.</p>
        </TabsContent>
        <TabsContent value="contact" className="mt-4">
          <p className="text-secondary text-sm">Contact information tab content.</p>
        </TabsContent>
        <TabsContent value="billing" className="mt-4">
          <p className="text-secondary text-sm">Billing information tab content.</p>
        </TabsContent>
      </Tabs>
    </div>
  ),
}
