import type { Meta, StoryObj } from '@storybook/react'
import { MobileMenu } from './MobileMenu'
import { Button } from './button'

// Shared decorator that simulates a header bar for proper menu positioning
const withSimulatedHeader = (Story: React.ComponentType) => (
  <div className="min-h-[500px] bg-gray-100 relative">
    {/* Simulated header bar */}
    <div className="fixed top-0 left-0 right-0 h-[70px] bg-white shadow-md z-50 flex items-center justify-between px-4">
      <div className="font-bold text-dark">Logo</div>
      <Story />
    </div>
    {/* Page content */}
    <div className="pt-[90px] px-4">
      <p className="text-sm text-muted">
        Click the hamburger icon to toggle the menu. The icon animates to an X when open.
      </p>
    </div>
  </div>
)

const meta: Meta<typeof MobileMenu> = {
  title: 'Website/MobileMenu',
  component: MobileMenu,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        component:
          'A mobile navigation menu with animated hamburger icon. This component is viewport-dependent and only displays on mobile screens (< 768px). **View individual stories in Canvas mode** to see the full interactive experience.',
      },
    },
  },
  // Apply the header decorator to all stories
  decorators: [withSimulatedHeader],
  argTypes: {
    children: {
      control: false,
      description: 'Content to render inside the menu panel',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    open: {
      control: 'boolean',
      description: 'Control the open state externally',
    },
    onOpenChange: {
      control: false,
      description: 'Callback when open state changes',
      table: {
        type: { summary: '(open: boolean) => void' },
      },
    },
    onItemClick: {
      control: false,
      description: 'Callback when a menu item is clicked',
      table: {
        type: { summary: '() => void' },
      },
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes for the trigger button',
    },
    disablePortal: {
      control: 'boolean',
      description: 'Disable portal rendering (for Storybook/testing)',
    },
    disableHeaderPadding: {
      control: 'boolean',
      description: 'Disable header padding (for standalone demos)',
    },
  },
}

export default meta
type Story = StoryObj<typeof MobileMenu>

// Sample navigation items
const SampleNavItems = () => (
  <>
    <div className="flex flex-col gap-2 mb-4">
      <a
        href="#"
        className="px-4 py-3 rounded-[8px] text-base font-medium text-dark hover:bg-gray-100 block"
      >
        Home
      </a>
      <a
        href="#"
        className="px-4 py-3 rounded-[8px] text-base font-medium text-dark hover:bg-gray-100 block"
      >
        Product
      </a>
      <a
        href="#"
        className="px-4 py-3 rounded-[8px] text-base font-medium text-dark hover:bg-gray-100 block"
      >
        About
      </a>
      <a
        href="#"
        className="px-4 py-3 rounded-[8px] text-base font-medium bg-teal/10 text-teal block"
      >
        Active Item
      </a>
    </div>
    <Button className="w-full bg-dark text-white">Contact us</Button>
  </>
)

// Default mobile menu
export const Default: Story = {
  globals: {
    viewport: { value: 'mobile1', isRotated: false },
  },
  parameters: {
    docs: { disable: true },
  },
  args: {
    children: <SampleNavItems />,
    disablePortal: true,
  },
}

// Controlled open state
export const ControlledOpen: Story = {
  globals: {
    viewport: { value: 'mobile1', isRotated: false },
  },
  parameters: {
    docs: { disable: true },
  },
  args: {
    open: true,
    children: <SampleNavItems />,
    disablePortal: true,
  },
}

// With custom content
export const CustomContent: Story = {
  globals: {
    viewport: { value: 'mobile1', isRotated: false },
  },
  parameters: {
    docs: { disable: true },
  },
  args: {
    children: (
      <div className="p-4">
        <h3 className="text-lg font-bold mb-4">Custom Menu Content</h3>
        <p className="text-muted mb-4">
          You can put any content inside the mobile menu.
        </p>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" className="w-full">
            Option 1
          </Button>
          <Button variant="outline" className="w-full">
            Option 2
          </Button>
          <Button variant="outline" className="w-full">
            Option 3
          </Button>
          <Button variant="outline" className="w-full">
            Option 4
          </Button>
        </div>
      </div>
    ),
    disablePortal: true,
  },
}

// Minimal menu
export const Minimal: Story = {
  globals: {
    viewport: { value: 'mobile1', isRotated: false },
  },
  parameters: {
    docs: { disable: true },
  },
  args: {
    children: (
      <div className="flex flex-col gap-1">
        <a href="#" className="px-4 py-2 text-dark hover:text-teal">
          Link 1
        </a>
        <a href="#" className="px-4 py-2 text-dark hover:text-teal">
          Link 2
        </a>
        <a href="#" className="px-4 py-2 text-dark hover:text-teal">
          Link 3
        </a>
      </div>
    ),
    disablePortal: true,
  },
}
