import type { Meta, StoryObj } from '@storybook/react'
import { HeroSection } from './HeroSection'
import { optimizedImages } from '../../assets/optimized'

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
      description: 'Main hero title (fallback when rotatingTitles not provided)',
    },
    rotatingTitles: {
      control: 'object',
      description: 'Array of titles to rotate through with animation',
    },
    rotationInterval: {
      control: 'number',
      description: 'Rotation interval in milliseconds',
    },
    subtitle: {
      control: 'text',
      description: 'Subtitle text displayed below title',
    },
    layout: {
      control: 'select',
      options: ['center', 'left-bottom', 'two-column'],
      description: 'Content layout variant',
    },
    showParticles: {
      control: 'boolean',
      description: 'Show particle effects',
    },
    showGridBlob: {
      control: 'boolean',
      description: 'Show grid blob background effect',
    },
  },
}

export default meta
type Story = StoryObj<typeof HeroSection>

// Home Page Hero - Center Layout
export const HomePageHero: Story = {
  args: {
    title: 'Protect People',
    rotatingTitles: ['Protect People', 'Empower Strategy', 'Cut the Admin'],
    rotationInterval: 4000,
    subtitle: 'Compliance should make workplaces safer and decisions smarter — not bury teams in forms.',
    backgroundImage: optimizedImages.heroFrame,
    layout: 'center',
    showParticles: true,
    showGridBlob: true,
  },
}

// Product Page Hero - Left Bottom Layout
export const ProductPageHero: Story = {
  args: {
    title: 'Platform Overview',
    subtitle: 'The only EHS platform built for the way you actually work',
    backgroundImage: optimizedImages.heroFrame,
    layout: 'left-bottom',
    showParticles: true,
    showGridBlob: true,
  },
}

// About Page Hero - Two Column Layout
export const AboutPageHero: Story = {
  render: () => (
    <HeroSection
      title="About Disrupt"
      rotatingTitles={['About Disrupt', 'Our Mission', 'Our Story']}
      subtitle="Building the future of workplace safety and compliance"
      backgroundImage={optimizedImages.heroFrame}
      layout="two-column"
      showParticles={true}
      showGridBlob={true}
    >
      <ul className="space-y-2 text-cream/80 text-sm">
        <li>Founded in 2020</li>
        <li>100+ enterprise clients</li>
        <li>Global team of experts</li>
      </ul>
    </HeroSection>
  ),
}

// Static Title (no rotation)
export const StaticTitle: Story = {
  args: {
    title: 'Single Static Title',
    subtitle: 'Without rotating animation',
    backgroundImage: optimizedImages.heroFrame,
    layout: 'center',
    showParticles: true,
    showGridBlob: true,
  },
}

// Without Particles
export const WithoutParticles: Story = {
  args: {
    title: 'Minimal Hero',
    subtitle: 'Without particle effects',
    backgroundImage: optimizedImages.heroFrame,
    layout: 'center',
    showParticles: false,
    showGridBlob: false,
  },
}
