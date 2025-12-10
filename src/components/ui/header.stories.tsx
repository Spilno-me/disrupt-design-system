import type { Meta, StoryObj } from '@storybook/react'
import { Header, NavItem } from './Header'

const meta: Meta<typeof Header> = {
  title: 'Website/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    navItems: {
      description: 'Navigation items to display',
    },
    showContactButton: {
      control: 'boolean',
      description: 'Whether to show the contact button',
    },
    contactButtonText: {
      control: 'text',
      description: 'Text for the contact button',
    },
    contactButtonPath: {
      control: 'text',
      description: 'Contact button href/path',
    },
    logoAlt: {
      control: 'text',
      description: 'Logo alt text for accessibility',
    },
    showLogoTagline: {
      control: 'boolean',
      description: 'Whether to show the tagline in the logo',
    },
    colorMode: {
      control: 'select',
      options: ['dark', 'light'],
      description: 'Color mode for contrast on different backgrounds',
    },
    className: {
      control: 'text',
      description: 'Additional className for the header',
    },
  },
}

export default meta
type Story = StoryObj<typeof Header>

// Helpers to prevent navigation in stories
const preventNavClick = (_item: NavItem, e: React.MouseEvent) => {
  e.preventDefault()
}
const preventContactClick = (e: React.MouseEvent) => {
  e.preventDefault()
}

// Default header with standard navigation
export const Default: Story = {
  args: {
    navItems: [
      { label: 'Home', path: '#', isActive: true },
      { label: 'Product', path: '#' },
      { label: 'About', path: '#' },
    ],
    showContactButton: true,
    contactButtonText: 'Contact us',
    contactButtonPath: '#',
    showLogoTagline: true,
    colorMode: 'dark',
    onNavItemClick: preventNavClick,
    onContactClick: preventContactClick,
  },
  decorators: [
    (Story) => (
      <div className="min-h-[400px] bg-white">
        <Story />
        <div className="pt-24 px-8">
          <h1 className="text-2xl font-bold text-primary">Page Content</h1>
          <p className="text-muted mt-2">
            The header is fixed at the top. Scroll down to see it stay in place.
          </p>
        </div>
      </div>
    ),
  ],
}

// Mobile view - Canvas only (viewport-dependent)
export const Mobile: Story = {
  globals: {
    viewport: { value: 'mobile1', isRotated: false },
  },
  parameters: {
    // Hide from Docs - only visible in Canvas mode via sidebar
    docs: { disable: true },
  },
  args: {
    navItems: [
      { label: 'Home', path: '#', isActive: true },
      { label: 'Product', path: '#' },
      { label: 'About', path: '#' },
    ],
    showContactButton: true,
    contactButtonPath: '#',
    showLogoTagline: true,
    colorMode: 'dark',
    onNavItemClick: preventNavClick,
    onContactClick: preventContactClick,
    disableMobileMenuPortal: true,
  },
  decorators: [
    (Story) => (
      <div className="min-h-[500px] bg-white">
        <Story />
        <div className="pt-24 px-4">
          <h1 className="text-xl font-bold text-primary">Mobile View</h1>
          <p className="text-muted mt-2 text-sm">
            Click the hamburger icon to open the mobile menu.
          </p>
        </div>
      </div>
    ),
  ],
}

// Tablet view - Canvas only (viewport-dependent)
export const Tablet: Story = {
  globals: {
    viewport: { value: 'ipad', isRotated: false },
  },
  parameters: {
    // Hide from Docs - only visible in Canvas mode via sidebar
    docs: { disable: true },
  },
  args: {
    navItems: [
      { label: 'Home', path: '#' },
      { label: 'Product', path: '#' },
      { label: 'About', path: '#', isActive: true },
    ],
    showContactButton: true,
    contactButtonPath: '#',
    showLogoTagline: true,
    colorMode: 'dark',
    onNavItemClick: preventNavClick,
    onContactClick: preventContactClick,
  },
  decorators: [
    (Story) => (
      <div className="min-h-[400px] bg-white">
        <Story />
      </div>
    ),
  ],
}

// Without contact button
export const WithoutContactButton: Story = {
  args: {
    navItems: [
      { label: 'Home', path: '#' },
      { label: 'Product', path: '#' },
      { label: 'About', path: '#' },
    ],
    showContactButton: false,
    showLogoTagline: true,
    colorMode: 'dark',
    onNavItemClick: preventNavClick,
  },
  decorators: [
    (Story) => (
      <div className="min-h-[300px] bg-white">
        <Story />
      </div>
    ),
  ],
}

// Without logo tagline
export const WithoutTagline: Story = {
  args: {
    navItems: [
      { label: 'Home', path: '#' },
      { label: 'Products', path: '#' },
      { label: 'Services', path: '#' },
    ],
    showContactButton: true,
    contactButtonPath: '#',
    showLogoTagline: false,
    colorMode: 'dark',
    onNavItemClick: preventNavClick,
    onContactClick: preventContactClick,
  },
  decorators: [
    (Story) => (
      <div className="min-h-[300px] bg-white">
        <Story />
      </div>
    ),
  ],
}

// Navigation with active state
export const WithActiveState: Story = {
  args: {
    navItems: [
      { label: 'Home', path: '#' },
      { label: 'Product', path: '#', isActive: true },
      { label: 'About', path: '#' },
    ],
    showContactButton: true,
    contactButtonPath: '#',
    showLogoTagline: true,
    colorMode: 'dark',
    onNavItemClick: preventNavClick,
    onContactClick: preventContactClick,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Navigation items can have an `isActive` prop to indicate the current page.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="min-h-[300px] bg-white">
        <Story />
      </div>
    ),
  ],
}

// Extended navigation
export const ExtendedNavigation: Story = {
  args: {
    navItems: [
      { label: 'Home', path: '#' },
      { label: 'Product', path: '#' },
      { label: 'About', path: '#' },
      { label: 'Pricing', path: '#' },
      { label: 'Blog', path: '#' },
      { label: 'Docs', path: '#' },
    ],
    showContactButton: true,
    contactButtonText: 'Contact',
    contactButtonPath: '#',
    showLogoTagline: true,
    colorMode: 'dark',
    onNavItemClick: preventNavClick,
    onContactClick: preventContactClick,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Header with more navigation items.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="min-h-[300px] bg-white">
        <Story />
      </div>
    ),
  ],
}

// Custom render function example (for router integration)
export const CustomLinkRenderer: Story = {
  args: {
    navItems: [
      { label: 'Home', path: '/' },
      { label: 'Product', path: '/product' },
      { label: 'About', path: '/about' },
    ],
    showContactButton: true,
    showLogoTagline: true,
    colorMode: 'dark',
    renderNavLink: (item: NavItem, children: React.ReactNode) => (
      <button
        onClick={() => console.log(`Custom navigation to: ${item.path}`)}
        className="h-9 px-4 py-2 rounded-[12px] text-sm font-sans font-medium leading-[1.43] transition-colors flex items-center justify-center gap-2 cursor-pointer text-primary hover:bg-white/10"
      >
        {children}
      </button>
    ),
    renderContactLink: (children: React.ReactNode) => (
      <button onClick={() => console.log('Custom contact action')}>
        {children}
      </button>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Use `renderNavLink` and `renderContactLink` props to integrate with your routing library (React Router, Next.js, etc.). Check the console for output.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="min-h-[300px] bg-white">
        <Story />
      </div>
    ),
  ],
}
