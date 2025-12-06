import type { Meta, StoryObj } from '@storybook/react'
import { ScrollToTopButton } from './ScrollToTopButton'

const meta: Meta<typeof ScrollToTopButton> = {
  title: 'Website/Components/ScrollToTopButton',
  component: ScrollToTopButton,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    triggerSelector: {
      control: 'text',
      description: 'CSS selector for the element that triggers button visibility',
    },
  },
}

export default meta
type Story = StoryObj<typeof ScrollToTopButton>

// Note: The ScrollToTopButton is designed to work on mobile devices only
// and appears when a specific section scrolls into view.

// Default - Note this component is mobile-only and scroll-triggered
export const Default: Story = {
  render: () => (
    <div className="relative">
      <div className="bg-muted/20 p-8 min-h-[200px]">
        <h2 className="text-xl font-bold mb-4">ScrollToTopButton</h2>
        <p className="text-muted-foreground mb-4">
          This component is designed for mobile devices only (&lt;768px viewport).
          It appears when a specific section (default: FAQ section) reaches the top of the viewport.
        </p>
        <p className="text-muted-foreground mb-4">
          <strong>Features:</strong>
        </p>
        <ul className="list-disc list-inside text-muted-foreground space-y-1">
          <li>Only visible on mobile devices</li>
          <li>Appears when trigger element scrolls into view</li>
          <li>Smooth scroll to top animation</li>
          <li>Animated entry/exit transitions</li>
          <li>Fixed position at bottom-right corner</li>
        </ul>
      </div>

      {/* Visual representation of the button */}
      <div className="mt-8 flex justify-center">
        <div className="relative">
          <p className="text-sm text-muted-foreground mb-2 text-center">Button preview:</p>
          <button
            className="w-12 h-12 rounded-full bg-dark text-white shadow-lg flex items-center justify-center"
            aria-label="Scroll to top preview"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m18 15-6-6-6 6" />
            </svg>
          </button>
        </div>
      </div>

      {/* The actual component - won't show in Storybook unless viewport is mobile */}
      <ScrollToTopButton triggerSelector="[data-element='demo-trigger']" />
    </div>
  ),
}

// Scrollable demo
export const ScrollableDemo: Story = {
  render: () => (
    <div className="relative h-screen overflow-auto">
      <div className="bg-white p-8">
        <h1 className="text-2xl font-bold mb-4">Scrollable Demo</h1>
        <p className="text-muted-foreground mb-8">
          Resize your browser to mobile width (&lt;768px) and scroll down to see the button appear.
        </p>

        {/* Content sections */}
        <div className="space-y-8">
          <section className="bg-muted/10 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Section 1</h2>
            <p className="text-muted-foreground">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
              tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </section>

          <section className="bg-muted/10 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Section 2</h2>
            <p className="text-muted-foreground">
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi
              ut aliquip ex ea commodo consequat.
            </p>
          </section>

          <section className="bg-muted/10 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Section 3</h2>
            <p className="text-muted-foreground">
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
              dolore eu fugiat nulla pariatur.
            </p>
          </section>

          {/* Trigger section */}
          <section
            className="bg-teal/10 p-6 rounded-lg"
            data-element="scroll-trigger"
          >
            <h2 className="text-xl font-semibold mb-2 text-teal">Trigger Section</h2>
            <p className="text-muted-foreground">
              When this section reaches the top of the viewport on mobile, the scroll-to-top button appears.
            </p>
          </section>

          <section className="bg-muted/10 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Section 5</h2>
            <p className="text-muted-foreground">
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
              deserunt mollit anim id est laborum.
            </p>
          </section>

          <section className="bg-muted/10 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Section 6</h2>
            <p className="text-muted-foreground">
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium
              doloremque laudantium.
            </p>
          </section>
        </div>
      </div>

      <ScrollToTopButton triggerSelector="[data-element='scroll-trigger']" />
    </div>
  ),
}

// Button states
export const ButtonStates: Story = {
  render: () => (
    <div className="p-8 space-y-8">
      <h2 className="text-xl font-bold">Button Visual States</h2>

      <div className="flex gap-8 items-center">
        {/* Default state */}
        <div className="text-center">
          <button
            className="w-12 h-12 rounded-full bg-dark text-white shadow-lg flex items-center justify-center"
            aria-label="Default state"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m18 15-6-6-6 6" />
            </svg>
          </button>
          <p className="text-sm text-muted-foreground mt-2">Default</p>
        </div>

        {/* Active/Pressed state */}
        <div className="text-center">
          <button
            className="w-12 h-12 rounded-full bg-dark text-white shadow-lg flex items-center justify-center scale-95"
            aria-label="Active state"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m18 15-6-6-6 6" />
            </svg>
          </button>
          <p className="text-sm text-muted-foreground mt-2">Pressed</p>
        </div>

        {/* With shadow emphasis */}
        <div className="text-center">
          <button
            className="w-12 h-12 rounded-full bg-dark text-white shadow-xl flex items-center justify-center"
            aria-label="Shadow emphasis"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m18 15-6-6-6 6" />
            </svg>
          </button>
          <p className="text-sm text-muted-foreground mt-2">Shadow XL</p>
        </div>
      </div>
    </div>
  ),
}
