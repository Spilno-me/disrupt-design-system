import type { Meta, StoryObj } from '@storybook/react'
import { Footer } from './Footer'
import { ORGANISM_META, organismDescription } from '@/stories/_infrastructure'
import { GridBlobBackground } from '@/components/ui/GridBlobCanvas'

const meta: Meta<typeof Footer> = {
  title: 'Website/Layout/Footer',
  component: Footer,
  ...ORGANISM_META,
  parameters: {
    ...ORGANISM_META.parameters,
    docs: {
      description: {
        component: organismDescription('Website footer with copyright, links, and social icons. Supports default, dark, and transparent variants.'),
      },
    },
  },
  argTypes: {
    companyName: {
      control: 'text',
      description: 'Company/Website name',
    },
    copyrightYear: {
      control: 'number',
      description: 'Copyright year',
    },
    variant: {
      control: 'select',
      options: ['default', 'transparent', 'dark'],
      description: 'Background style',
    },
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen h-screen relative overflow-hidden bg-surface">
        {/* Grid with animated blob mask */}
        <GridBlobBackground />

        {/* Content */}
        <div className="absolute z-10 bottom-0 left-0 right-0">
          <Story />
        </div>
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Footer>

// Default footer
export const Default: Story = {
  args: {
    companyName: 'DisruptInc.io',
    copyrightYear: 2024,
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
    ],
    variant: 'default',
  },
}

// Dark variant
export const Dark: Story = {
  args: {
    companyName: 'DisruptInc.io',
    copyrightYear: 2024,
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
    ],
    variant: 'dark',
  },
}

// Transparent variant
export const Transparent: Story = {
  args: {
    companyName: 'DisruptInc.io',
    copyrightYear: 2024,
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
    ],
    variant: 'transparent',
  },
}

// With more links
export const WithMoreLinks: Story = {
  args: {
    companyName: 'Acme Corp',
    copyrightYear: 2024,
    links: [
      { label: 'About', href: '/about' },
      { label: 'Blog', href: '/blog' },
      { label: 'Careers', href: '/careers' },
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
    ],
    variant: 'default',
  },
}

// Minimal (no links)
export const Minimal: Story = {
  args: {
    companyName: 'My Company',
    copyrightYear: 2024,
    links: [],
    variant: 'default',
  },
}

// With custom left content
export const CustomLeftContent: Story = {
  args: {
    leftContent: (
      <div className="flex items-center gap-2">
        <span className="text-xs sm:text-sm font-medium text-dark">Made with ❤️ by</span>
        <a href="#" className="text-teal text-xs sm:text-sm font-bold hover:underline">
          Our Team
        </a>
      </div>
    ),
    links: [
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
    ],
    variant: 'default',
  },
}

// With custom right content
export const CustomRightContent: Story = {
  args: {
    companyName: 'Company',
    copyrightYear: 2024,
    rightContent: (
      <div className="flex items-center gap-4">
        <a href="#" className="text-dark hover:text-teal">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
          </svg>
        </a>
        <a href="#" className="text-dark hover:text-teal">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
          </svg>
        </a>
        <a href="#" className="text-dark hover:text-teal">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
        </a>
      </div>
    ),
    variant: 'default',
  },
}

// Full custom
export const FullCustom: Story = {
  args: {
    leftContent: (
      <p className="text-dark text-xs sm:text-sm">
        © 2024 All rights reserved
      </p>
    ),
    rightContent: (
      <div className="flex items-center gap-6">
        <a href="#" className="text-dark hover:text-teal text-xs sm:text-sm">
          Support
        </a>
        <a href="#" className="text-dark hover:text-teal text-xs sm:text-sm">
          Documentation
        </a>
        <a href="#" className="text-dark hover:text-teal text-xs sm:text-sm">
          Contact
        </a>
      </div>
    ),
    variant: 'default',
  },
}

// In page context
export const InPageContext: Story = {
  render: () => (
    <div className="min-h-screen h-screen relative overflow-hidden bg-surface">
      {/* Grid with animated blob mask */}
      <GridBlobBackground />

      <div className="absolute z-10 top-0 left-0 right-0 p-8">
        <h1 className="text-2xl font-bold mb-4 text-primary">Page Content</h1>
        <p className="text-secondary">
          This demonstrates the footer at the bottom of a page layout with glass morphism effect.
        </p>
      </div>
      <div className="absolute z-10 bottom-0 left-0 right-0">
        <Footer
          companyName="DisruptInc.io"
          copyrightYear={2024}
          links={[
            { label: 'Privacy Policy', href: '/privacy' },
            { label: 'Terms of Service', href: '/terms' },
          ]}
        />
      </div>
    </div>
  ),
  // Override the global decorator for this story
  decorators: [(Story) => <Story />],
}
