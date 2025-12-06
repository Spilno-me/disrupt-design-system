import type { Meta, StoryObj } from '@storybook/react'
import { HeroSection } from './HeroSection'

const meta: Meta<typeof HeroSection> = {
  title: 'Website/Sections/HeroSection',
  component: HeroSection,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Main hero title',
    },
    subtitle: {
      control: 'text',
      description: 'Subtitle text',
    },
    primaryButtonText: {
      control: 'text',
      description: 'Primary CTA button text',
    },
    secondaryButtonText: {
      control: 'text',
      description: 'Secondary CTA button text',
    },
    backgroundColor: {
      control: 'select',
      options: ['dark', 'primary', 'gradient'],
      description: 'Background color when no image',
    },
    alignment: {
      control: 'select',
      options: ['center', 'left'],
      description: 'Content alignment',
    },
    height: {
      control: 'select',
      options: ['small', 'medium', 'large', 'full'],
      description: 'Hero height',
    },
    showOverlay: {
      control: 'boolean',
      description: 'Show gradient overlay on background image',
    },
  },
}

export default meta
type Story = StoryObj<typeof HeroSection>

// Default hero (matches website home page)
export const Default: Story = {
  args: {
    title: 'Protect People. Empower Strategy.',
    subtitle: 'Compliance should make workplaces safer and decisions smarter — not bury teams in forms.',
    primaryButtonText: 'Get Started',
    secondaryButtonText: 'Learn More',
    backgroundColor: 'dark',
    alignment: 'center',
    height: 'medium',
  },
}

// With background image
export const WithBackgroundImage: Story = {
  args: {
    title: 'Transform Your Business',
    subtitle: 'Next-generation solutions for modern enterprises',
    primaryButtonText: 'Start Free Trial',
    backgroundImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920',
    alignment: 'center',
    height: 'large',
    showOverlay: true,
  },
}

// Rotating Titles (slideshow animation)
export const RotatingTitles: Story = {
  args: {
    title: 'Fallback Title',
    rotatingTitles: ['Protect People', 'Empower Strategy', 'Cut the Admin'],
    rotationInterval: 4000,
    subtitle: 'Compliance should make workplaces safer and decisions smarter — not bury teams in forms.',
    primaryButtonText: 'Get Started',
    backgroundColor: 'dark',
    alignment: 'center',
    height: 'medium',
  },
}

// Minimal (page header style)
export const Minimal: Story = {
  args: {
    title: 'About Us',
    subtitle: 'Our story and mission',
    backgroundColor: 'dark',
    alignment: 'center',
    height: 'small',
  },
}

// With custom content (logos, trust badges, etc.)
export const WithCustomContent: Story = {
  render: () => (
    <HeroSection
      title="Trusted by Industry Leaders"
      subtitle="See why companies choose us"
      primaryButtonText="Get Started"
      backgroundColor="dark"
      height="medium"
    >
      <div className="flex gap-8 justify-center items-center mt-4 opacity-60">
        <div className="text-white text-xl font-bold">Company A</div>
        <div className="text-white text-xl font-bold">Company B</div>
        <div className="text-white text-xl font-bold">Company C</div>
        <div className="text-white text-xl font-bold">Company D</div>
      </div>
    </HeroSection>
  ),
}
