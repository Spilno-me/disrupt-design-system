import type { Meta, StoryObj } from '@storybook/react'
import { useRef, useState } from 'react'
import {
  MOLECULE_META,
  moleculeDescription,
} from '@/stories/_infrastructure'
import { HeroParticles } from './HeroParticles'
import { MouseParticleRenderer } from './MouseParticleRenderer'
import { BlurImage } from './BlurImage'
import { useMouseParticles } from '../../hooks/useMouseParticles'
import { optimizedImages } from '../../assets/optimized'

// =============================================================================
// META CONFIGURATION
// =============================================================================

const meta: Meta<typeof HeroParticles> = {
  title: 'Website/Components/HeroParticles',
  component: HeroParticles,
  ...MOLECULE_META,
  parameters: {
    ...MOLECULE_META.parameters,
    layout: 'fullscreen',
    docs: {
      description: {
        component: moleculeDescription(
          'Floating particle effects for hero sections with color-shifting animations and mouse interaction.'
        ),
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof HeroParticles>

// =============================================================================
// STORIES
// =============================================================================

// Default particles on dark background
export const Default: Story = {
  render: () => (
    <div className="relative w-full h-[500px] bg-gradient-to-br from-inverse-bg to-inverse-bg/90 overflow-hidden">
      <HeroParticles />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-inverse">
          <h1 className="text-4xl font-bold mb-4">Hero Section</h1>
          <p className="text-inverse/70">Watch the particles float and change colors</p>
        </div>
      </div>
    </div>
  ),
}

// With actual hero image from the website
const ActualHeroImageDemo = () => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const { particles, handleMouseMove } = useMouseParticles({
    enabled: imageLoaded,
    containerRef,
  })

  return (
    <div
      className="relative w-full h-[500px] overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Hero Image Container */}
      <div
        ref={containerRef}
        className="absolute inset-0"
      >
        <BlurImage
          images={optimizedImages.heroFrame}
          placeholder={optimizedImages.heroFrame.placeholder}
          alt="Hero background"
          className="object-cover object-center"
          onLoad={() => setImageLoaded(true)}
        />

        {/* Gradient overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(0deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 30%, rgba(0,0,0,0.2) 50%, transparent 70%)'
          }}
        />

        {/* Particles - only render after image loads */}
        {imageLoaded && (
          <>
            <HeroParticles />
            <MouseParticleRenderer particles={particles} />
          </>
        )}
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="text-center text-inverse">
          <h1 className="text-4xl font-bold mb-4">Protect People</h1>
          <p className="text-accent text-lg">Compliance should make workplaces safer and decisions smarter</p>
        </div>
      </div>
    </div>
  )
}

export const WithActualHeroImage: Story = {
  render: () => <ActualHeroImageDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Hero particles with the actual website hero image. Move your mouse to generate additional particles.',
      },
    },
  },
}

// Full recreation of the website hero section
const WebsiteHeroDemo = () => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const heroFrameRef = useRef<HTMLDivElement>(null)
  const { particles, handleMouseMove } = useMouseParticles({
    enabled: imageLoaded,
    containerRef: heroFrameRef,
  })

  return (
    <section
      className="relative mb-8 mt-[82px]"
      onMouseMove={handleMouseMove}
    >
      {/* Background Frame */}
      <div className="absolute inset-x-0 top-0 flex justify-center z-[1] px-0 sm:px-6">
        <div
          ref={heroFrameRef}
          className="w-full h-[380px] sm:h-[420px] lg:h-[499px] rounded-none sm:rounded-b-[10px] overflow-hidden relative max-w-[1440px]"
        >
          {/* Responsive Hero Image with blur-up loading */}
          <BlurImage
            images={optimizedImages.heroFrame}
            placeholder={optimizedImages.heroFrame.placeholder}
            className="object-[center_30%] sm:object-center"
            onLoad={() => setImageLoaded(true)}
          />

          {/* Gradient overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(0deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 30%, rgba(0,0,0,0.2) 50%, transparent 70%)'
            }}
          />

          {/* Particles */}
          {imageLoaded && (
            <>
              <HeroParticles />
              <MouseParticleRenderer particles={particles} />
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto relative z-[2] flex flex-col w-full h-[380px] sm:h-[420px] lg:h-[499px] pointer-events-none px-4 sm:px-6 max-w-[1440px]">
        <div className="w-full flex flex-col items-center justify-between relative h-full px-4 sm:px-6 lg:px-[36px] pt-[120px] sm:pt-[140px] lg:pt-[160px] pb-8 sm:pb-10 lg:pb-14">
          {/* Title */}
          <div className="relative z-10 text-center w-full h-[80px] sm:h-[80px] lg:h-[100px]">
            <h1 className="flex items-center justify-center font-display font-bold text-white text-[32px] sm:text-[32px] lg:text-[48px] leading-[44px] sm:leading-[48px] lg:leading-[60px] tracking-[2.5px] sm:tracking-[3px] lg:tracking-[4px]">
              Protect People
            </h1>
          </div>

          {/* Subtitle */}
          <p className="text-center text-accent font-display font-medium text-sm sm:text-base lg:text-lg max-w-[340px] sm:max-w-none z-10">
            Compliance should make workplaces safer and decisions smarter — not bury teams in forms.
          </p>
        </div>
      </div>
    </section>
  )
}

export const WebsiteHeroExact: Story = {
  render: () => <WebsiteHeroDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Exact recreation of the Disrupt website hero section with particles, blur-up image loading, and mouse interaction.',
      },
    },
  },
}

// With gradient background
export const WithGradient: Story = {
  render: () => (
    <div className="relative w-full h-[500px] bg-gradient-to-br from-accent via-circleBlue to-purple overflow-hidden">
      <HeroParticles />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-inverse">
          <h1 className="text-4xl font-bold mb-4">Colorful Background</h1>
          <p className="text-inverse/80">Particles visible on gradient backgrounds</p>
        </div>
      </div>
    </div>
  ),
}

// Mouse particles demo
const MouseParticlesDemo = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { particles, handleMouseMove } = useMouseParticles({
    enabled: true,
    containerRef,
  })

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[500px] bg-gradient-to-br from-inverse-bg to-inverse-bg/90 overflow-hidden cursor-crosshair"
      onMouseMove={handleMouseMove}
    >
      <HeroParticles />
      <MouseParticleRenderer particles={particles} />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-inverse">
          <h1 className="text-4xl font-bold mb-4">Mouse Interaction</h1>
          <p className="text-inverse/70">Move your mouse to generate particles (desktop only)</p>
        </div>
      </div>
    </div>
  )
}

export const WithMouseInteraction: Story = {
  render: () => <MouseParticlesDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Move your mouse over the hero area to generate additional particles that drift upward. This effect is only visible on desktop viewports.',
      },
    },
  },
}

// Particle animation showcase
export const AnimationShowcase: Story = {
  render: () => (
    <div className="space-y-8">
      <div className="p-8 bg-muted/20 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Particle Animations</h2>
        <p className="text-muted-foreground mb-4">
          The particle system includes several animations:
        </p>
        <ul className="list-disc list-inside text-muted-foreground space-y-2">
          <li><strong>dust-drift-1 to 6</strong> - Different drift patterns with depth simulation (scale + blur)</li>
          <li><strong>dust-color-shift</strong> - Cycles through brand colors (white, teal, blue, purple)</li>
          <li><strong>mouse-drift-1 to 6</strong> - Upward drift for mouse-generated particles</li>
        </ul>
      </div>

      <div className="relative w-full h-[400px] bg-inverse-bg rounded-lg overflow-hidden">
        <HeroParticles />
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-inverse/50 text-sm">Watch the particles drift and change colors</p>
        </div>
      </div>

      <div className="p-8 bg-muted/20 rounded-lg">
        <h3 className="text-lg font-bold mb-2">Color Palette</h3>
        <div className="flex gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#FBFBF3] border border-gray-200" />
            <span className="text-sm">#FBFBF3</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#08A4BD]" />
            <span className="text-sm">#08A4BD (Teal)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#93C5FD]" />
            <span className="text-sm">#93C5FD</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#A78BFA]" />
            <span className="text-sm">#A78BFA (Purple)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#60A5FA]" />
            <span className="text-sm">#60A5FA</span>
          </div>
        </div>
      </div>
    </div>
  ),
}

// Mobile preview note
export const MobileNote: Story = {
  render: () => (
    <div className="p-8">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="text-lg font-bold text-yellow-800 mb-2">Mobile Optimization</h3>
        <p className="text-yellow-700 mb-4">
          On mobile devices (viewport width &lt; 768px), the particle system automatically:
        </p>
        <ul className="list-disc list-inside text-yellow-700 space-y-1">
          <li>Reduces particle count from 18 to 8</li>
          <li>Scales particle size by 50%</li>
          <li>Disables mouse-generated particles</li>
        </ul>
        <p className="text-yellow-700 mt-4">
          This ensures smooth performance on mobile devices while maintaining the visual effect.
        </p>
      </div>

      <div className="mt-8 relative w-full h-[300px] bg-inverse-bg rounded-lg overflow-hidden">
        <HeroParticles />
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-inverse/50 text-sm">Resize browser to see mobile adaptation</p>
        </div>
      </div>
    </div>
  ),
}
