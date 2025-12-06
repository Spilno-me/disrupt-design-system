import type { Meta, StoryObj } from '@storybook/react'
import { CursorPixels } from './cursor-pixels'
import { Button } from './button'

const meta: Meta<typeof CursorPixels> = {
  title: 'Website/Components/CursorPixels',
  component: CursorPixels,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Custom animated cursor with trailing pixels - Disrupt signature interaction.

**Features:**
- Trailing pixel "wake" follows the cursor with physics-based motion
- Idle floating animation when mouse stops moving
- Repel/excited state when hovering buttons and links
- Disrupt explosion animation on click
- Respects reduced motion preferences
- Automatically hidden on touch devices and mobile

**States:**
1. **Following** - Pixels trail behind cursor
2. **Idle** - Gentle floating animation after 600ms of no movement
3. **Excited** - Pixels repel outward when hovering interactive elements
4. **Disrupt** - Explosion animation on click
        `,
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof CursorPixels>

// Default - Interactive Demo
export const Default: Story = {
  render: () => (
    <div className="min-h-screen bg-cream p-8">
      <CursorPixels />

      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center py-16">
          <h1 className="text-4xl font-display font-bold text-dark mb-4">
            Custom Cursor Demo
          </h1>
          <p className="text-muted mb-8">
            Move your mouse around to see the trailing pixel effect.
            The pixels will follow your cursor with a physics-based delay.
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-dark mb-4">Interactive Elements</h2>
          <p className="text-muted mb-6">
            Hover over these buttons to see the pixels repel outward.
            Click anywhere to trigger the "disrupt" explosion animation.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button variant="default">Default Button</Button>
            <Button variant="contact">Contact Us</Button>
            <Button variant="outline">Outline Button</Button>
          </div>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-dark mb-4">Links</h2>
          <p className="text-muted mb-4">
            The cursor also reacts to links:
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-teal hover:underline">Link One</a>
            <a href="#" className="text-teal hover:underline">Link Two</a>
            <a href="#" className="text-teal hover:underline">Link Three</a>
          </div>
        </div>

        <div className="text-center py-8">
          <h3 className="text-lg font-semibold text-dark mb-2">Idle Animation</h3>
          <p className="text-muted">
            Stop moving your mouse for a moment to see the pixels
            start floating gently in place.
          </p>
        </div>
      </div>
    </div>
  ),
}

// On Dark Background
export const DarkBackground: Story = {
  render: () => (
    <div className="min-h-screen bg-dark p-8">
      <CursorPixels darkMode />

      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center py-16">
          <h1 className="text-4xl font-display font-bold text-white mb-4">
            Dark Background Demo
          </h1>
          <p className="text-white/70 mb-8">
            On dark backgrounds, use the darkMode prop to make dark pixels white.
            Red pixels stay red for brand consistency.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <Button variant="contact">Get Started</Button>
          <Button variant="outline" className="border-white text-white hover:bg-white/10">
            Learn More
          </Button>
        </div>
      </div>
    </div>
  ),
}

// Instructions
export const HowToUse: Story = {
  render: () => (
    <div className="min-h-screen bg-cream p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-display font-bold text-dark mb-8">
          How to Use CursorPixels
        </h1>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-dark mb-3">Installation</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
{`import { CursorPixels } from '@adrozdenko/design-system'

// Add to your root layout/app component
function App() {
  return (
    <>
      <CursorPixels />
      {/* Your app content */}
    </>
  )
}

// For dark backgrounds, use darkMode prop
// This changes dark pixels to white for visibility
<CursorPixels darkMode />`}
            </pre>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-dark mb-3">Features</h2>
            <ul className="list-disc list-inside space-y-2 text-muted">
              <li><strong>Zero Configuration</strong> - Just drop it in your app</li>
              <li><strong>Automatic Touch Detection</strong> - Hidden on mobile/tablets</li>
              <li><strong>Reduced Motion Support</strong> - Respects user preferences</li>
              <li><strong>Performance Optimized</strong> - Uses GSAP quickTo for smooth 60fps</li>
              <li><strong>Non-Blocking</strong> - pointer-events: none on all elements</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-dark mb-3">Pixel Configuration</h2>
            <p className="text-muted mb-4">
              The cursor consists of 7 pixels in brand colors:
            </p>
            <div className="flex gap-3">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-[#F70D1A]" />
                <span className="text-sm">Ferrari Red (3 pixels)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-[#2D3142]" />
                <span className="text-sm">Dark (4 pixels)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
}
