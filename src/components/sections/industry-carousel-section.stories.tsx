import type { Meta, StoryObj } from '@storybook/react'
import { IndustryCarouselSection } from './IndustryCarouselSection'

const meta: Meta<typeof IndustryCarouselSection> = {
  title: 'Website/Sections/IndustryCarouselSection',
  component: IndustryCarouselSection,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'An expandable card carousel showcasing different industries. Features parallax effects, auto-scrolling on mobile, and blur-up image loading.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Section title',
    },
    subtitle: {
      control: 'text',
      description: 'Section subtitle',
    },
    defaultExpandedId: {
      control: 'select',
      options: [null, 'construction', 'manufacturing', 'energy', 'pharma', 'logistics'],
      description: 'Initially expanded industry card',
    },
  },
}

export default meta
type Story = StoryObj<typeof IndustryCarouselSection>

// Default carousel with logistics expanded
export const Default: Story = {
  args: {
    title: 'Empowering Disruptors in',
    subtitle: 'Industry-specific compliance solutions built for the way you work',
    defaultExpandedId: 'logistics',
  },
}

// No card expanded initially
export const AllCollapsed: Story = {
  args: {
    title: 'Empowering Disruptors in',
    subtitle: 'Industry-specific compliance solutions built for the way you work',
    defaultExpandedId: null,
  },
  parameters: {
    docs: {
      description: {
        story: 'All cards start collapsed. Click any card to expand it.',
      },
    },
  },
}

// Construction expanded
export const ConstructionExpanded: Story = {
  args: {
    title: 'Empowering Disruptors in',
    subtitle: 'Industry-specific compliance solutions built for the way you work',
    defaultExpandedId: 'construction',
  },
}

// Manufacturing expanded
export const ManufacturingExpanded: Story = {
  args: {
    title: 'Empowering Disruptors in',
    subtitle: 'Industry-specific compliance solutions built for the way you work',
    defaultExpandedId: 'manufacturing',
  },
}

// Custom title and subtitle
export const CustomContent: Story = {
  args: {
    title: 'Solutions for Every Industry',
    subtitle: 'Tailored compliance tools that adapt to your workflow',
    defaultExpandedId: 'energy',
  },
}

// Feature documentation
export const Features: Story = {
  render: () => (
    <div className="space-y-8">
      <div className="p-8 bg-white">
        <h2 className="text-2xl font-bold mb-6">IndustryCarouselSection Features</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-muted/20 p-4 rounded-lg">
            <h3 className="font-bold mb-2">Expandable Cards</h3>
            <p className="text-sm text-muted-foreground">
              Click any card to expand it and reveal the description. Click again to collapse.
              Only one card can be expanded at a time.
            </p>
          </div>

          <div className="bg-muted/20 p-4 rounded-lg">
            <h3 className="font-bold mb-2">Parallax Effect</h3>
            <p className="text-sm text-muted-foreground">
              Images have a subtle parallax effect when scrolling horizontally.
              The image appears to move slower than the card, creating depth.
            </p>
          </div>

          <div className="bg-muted/20 p-4 rounded-lg">
            <h3 className="font-bold mb-2">Auto-Scroll (Mobile)</h3>
            <p className="text-sm text-muted-foreground">
              On mobile devices, the carousel automatically scrolls back and forth.
              User interaction pauses auto-scroll for 3 seconds.
            </p>
          </div>

          <div className="bg-muted/20 p-4 rounded-lg">
            <h3 className="font-bold mb-2">Blur-Up Loading</h3>
            <p className="text-sm text-muted-foreground">
              Images load progressively with a blurred placeholder that fades out
              when the full resolution image is ready.
            </p>
          </div>

          <div className="bg-muted/20 p-4 rounded-lg">
            <h3 className="font-bold mb-2">Responsive Images</h3>
            <p className="text-sm text-muted-foreground">
              Each industry has mobile, tablet, and desktop optimized images in
              AVIF, WebP, and PNG formats for best performance.
            </p>
          </div>

          <div className="bg-muted/20 p-4 rounded-lg">
            <h3 className="font-bold mb-2">Card Sizes</h3>
            <p className="text-sm text-muted-foreground">
              Desktop: 400px expanded / 200px collapsed.
              Mobile: 300px expanded / 140px collapsed.
            </p>
          </div>
        </div>
      </div>

      <IndustryCarouselSection defaultExpandedId="pharma" />
    </div>
  ),
}

// Mobile simulation note
export const MobileNote: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mx-4">
        <h3 className="text-lg font-bold text-yellow-800 mb-2">Mobile Experience</h3>
        <p className="text-yellow-700 mb-4">
          On mobile devices (viewport width &lt; 768px), the carousel has these behaviors:
        </p>
        <ul className="list-disc list-inside text-yellow-700 space-y-1">
          <li>Auto-scrolls continuously back and forth</li>
          <li>Touch interaction pauses auto-scroll for 3 seconds</li>
          <li>Expanding a card centers it in the viewport</li>
          <li>Cards are smaller (300px expanded / 140px collapsed)</li>
          <li>Scroll snapping enabled when not auto-scrolling</li>
        </ul>
        <p className="text-yellow-700 mt-4 text-sm">
          Resize your browser to mobile width to see these features in action.
        </p>
      </div>

      <IndustryCarouselSection defaultExpandedId={null} />
    </div>
  ),
}

// Industries showcase
export const IndustriesShowcase: Story = {
  render: () => (
    <div className="space-y-8 py-8">
      <div className="text-center px-4">
        <h1 className="text-3xl font-bold mb-2">5 Industries Supported</h1>
        <p className="text-muted-foreground">
          Click each card to see industry-specific descriptions
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 px-4">
        {[
          { id: 'construction', name: 'Construction', icon: '🏗️' },
          { id: 'manufacturing', name: 'Manufacturing', icon: '🏭' },
          { id: 'energy', name: 'Energy', icon: '⚡' },
          { id: 'pharma', name: 'Pharma', icon: '💊' },
          { id: 'logistics', name: 'Logistics', icon: '🚛' },
        ].map((industry) => (
          <div key={industry.id} className="bg-white p-4 rounded-lg text-center shadow-sm">
            <span className="text-3xl mb-2 block">{industry.icon}</span>
            <span className="font-medium">{industry.name}</span>
          </div>
        ))}
      </div>

      <IndustryCarouselSection defaultExpandedId="construction" />
    </div>
  ),
}
