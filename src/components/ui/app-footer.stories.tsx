import type { Meta, StoryObj } from '@storybook/react'
import { AppFooter } from './AppFooter'

const meta = {
  title: 'Core/AppFooter',
  component: AppFooter,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AppFooter>

export default meta
type Story = StoryObj<typeof AppFooter>

// Default (for Controls panel)
export const Default: Story = {
  args: {},
}

// Light Mode
export const LightMode: Story = {
  args: {
    colorMode: 'light',
  },
  decorators: [
    (Story) => (
      <div className="bg-abyss-500 min-h-[100px]">
        <Story />
      </div>
    ),
  ],
}

// All States (Visual Matrix)
export const AllStates: Story = {
  render: () => (
    <div className="space-y-8 p-6">
      <div>
        <h4 className="text-sm font-semibold text-primary mb-3">Dark Mode (Default)</h4>
        <div className="border border-default rounded-md overflow-hidden">
          <AppFooter />
        </div>
        <p className="text-xs text-secondary mt-2">Default appearance on light backgrounds</p>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-primary mb-3">Light Mode (On Dark Background)</h4>
        <div className="bg-abyss-500 rounded-md overflow-hidden">
          <AppFooter colorMode="light" />
        </div>
        <p className="text-xs text-secondary mt-2">For use on dark backgrounds</p>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-primary mb-3">Compact Mobile (Default)</h4>
        <div className="max-w-md border border-default rounded-md overflow-hidden">
          <AppFooter compactOnMobile={true} />
        </div>
        <p className="text-xs text-secondary mt-2">Scales down on mobile (resize browser to see)</p>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-primary mb-3">Full Size on Mobile</h4>
        <div className="max-w-md border border-default rounded-md overflow-hidden">
          <AppFooter compactOnMobile={false} />
        </div>
        <p className="text-xs text-secondary mt-2">Same size on all screen sizes</p>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-primary mb-3">In Page Context</h4>
        <div className="border border-default rounded-md overflow-hidden">
          <div className="min-h-[200px] flex items-center justify-center bg-surface">
            <p className="text-muted text-sm">Page Content</p>
          </div>
          <AppFooter />
        </div>
        <p className="text-xs text-secondary mt-2">Footer at bottom of page layout</p>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-primary mb-3">Responsive Behavior</h4>
        <div className="space-y-2">
          <div className="w-[320px] border border-default rounded-md overflow-hidden">
            <AppFooter />
          </div>
          <p className="text-xs text-secondary">Mobile (320px) - compact height</p>

          <div className="w-[768px] border border-default rounded-md overflow-hidden mt-4">
            <AppFooter />
          </div>
          <p className="text-xs text-secondary">Tablet+ (768px+) - full height</p>
        </div>
      </div>
    </div>
  ),
}
