import type { Meta, StoryObj } from '@storybook/react'
import { COLORS, SHADOWS, RADIUS, SPACING, TYPOGRAPHY, ANIMATION, Z_INDEX } from '../constants/designTokens'

const meta: Meta = {
  title: 'Foundation/Design Tokens',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Design tokens are the foundational values that define the visual design of the Disrupt Design System.
They ensure consistency across all components and applications.

Import tokens:
\`\`\`typescript
import { COLORS, SHADOWS, SPACING } from '@adrozdenko/design-system'
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj

// =============================================================================
// COLOR SWATCH COMPONENT
// =============================================================================

function ColorSwatch({ name, value }: { name: string; value: string }) {
  const isTransparent = value.includes('rgba') || value.includes('transparent')

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="w-20 h-20 rounded-lg border border-slate-200 shadow-sm"
        style={{
          backgroundColor: value,
          backgroundImage: isTransparent ? 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)' : undefined,
          backgroundSize: isTransparent ? '10px 10px' : undefined,
          backgroundPosition: isTransparent ? '0 0, 0 5px, 5px -5px, -5px 0px' : undefined,
        }}
      >
        {isTransparent && (
          <div className="w-full h-full rounded-lg" style={{ backgroundColor: value }} />
        )}
      </div>
      <span className="text-sm font-semibold text-dark">{name}</span>
      <code className="text-xs text-muted bg-slate-100 px-2 py-0.5 rounded">{value}</code>
    </div>
  )
}

// =============================================================================
// COLORS STORY
// =============================================================================

export const Colors: Story = {
  render: () => {
    const primaryColors = {
      dark: COLORS.dark,
      cream: COLORS.cream,
      teal: COLORS.teal,
      ferrariRed: COLORS.ferrariRed,
      muted: COLORS.muted,
      darkPurple: COLORS.darkPurple,
    }

    const circleColors = {
      circleBlue: COLORS.circleBlue,
      circleRed: COLORS.circleRed,
      circleYellow: COLORS.circleYellow,
      circleGreen: COLORS.circleGreen,
    }

    const uiColors = {
      slate: COLORS.slate,
      lightPurple: COLORS.lightPurple,
      linkedInBlue: COLORS.linkedInBlue,
    }

    return (
      <div className="p-8 bg-white">
        <h1 className="text-3xl font-display font-bold text-dark mb-8">Colors</h1>

        {/* Primary Palette */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-dark mb-4">Primary Palette</h2>
          <p className="text-muted mb-6">Core brand colors used throughout the design system.</p>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
            {Object.entries(primaryColors).map(([name, value]) => (
              <ColorSwatch key={name} name={name} value={value} />
            ))}
          </div>
        </section>

        {/* Feature Circle Colors */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-dark mb-4">Feature Card Colors</h2>
          <p className="text-muted mb-6">Used in feature cards for visual distinction.</p>
          <div className="grid grid-cols-4 gap-6">
            {Object.entries(circleColors).map(([name, value]) => (
              <ColorSwatch key={name} name={name} value={value} />
            ))}
          </div>
        </section>

        {/* UI Colors */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-dark mb-4">UI Colors</h2>
          <p className="text-muted mb-6">Supporting colors for UI elements.</p>
          <div className="grid grid-cols-3 gap-6">
            {Object.entries(uiColors).map(([name, value]) => (
              <ColorSwatch key={name} name={name} value={value} />
            ))}
          </div>
        </section>

        {/* Usage Example */}
        <section className="p-6 bg-slate-50 rounded-lg">
          <h3 className="text-lg font-semibold text-dark mb-3">Usage</h3>
          <pre className="bg-dark text-cream p-4 rounded text-sm overflow-x-auto">
{`import { COLORS } from '@adrozdenko/design-system'

// In inline styles
<div style={{ color: COLORS.dark, backgroundColor: COLORS.cream }}>

// Or reference in Tailwind config
colors: {
  dark: COLORS.dark,
  teal: COLORS.teal,
}`}
          </pre>
        </section>
      </div>
    )
  },
}

// =============================================================================
// SHADOWS STORY
// =============================================================================

export const Shadows: Story = {
  render: () => {
    const elevationShadows = ['none', 'sm', 'md', 'lg', 'xl'] as const

    return (
      <div className="p-8 bg-cream">
        <h1 className="text-3xl font-display font-bold text-dark mb-8">Shadows</h1>

        {/* Elevation Scale */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-dark mb-4">Elevation Scale</h2>
          <p className="text-muted mb-6">Use these shadows for consistent depth and elevation.</p>
          <div className="flex flex-wrap gap-8">
            {elevationShadows.map((level) => (
              <div key={level} className="flex flex-col items-center gap-3">
                <div
                  className="w-32 h-32 bg-white rounded-lg flex items-center justify-center"
                  style={{ boxShadow: SHADOWS[level] }}
                >
                  <span className="text-sm font-medium text-dark">{level}</span>
                </div>
                <code className="text-xs text-muted bg-white px-2 py-1 rounded border">
                  shadow="{level}"
                </code>
              </div>
            ))}
          </div>
        </section>

        {/* Special Shadows */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-dark mb-4">Special Shadows</h2>
          <div className="flex flex-wrap gap-8">
            <div className="flex flex-col items-center gap-3">
              <div
                className="w-40 h-32 bg-white rounded-lg flex items-center justify-center"
                style={{ boxShadow: SHADOWS.image }}
              >
                <span className="text-sm font-medium text-dark">image</span>
              </div>
              <span className="text-xs text-muted">Hero images</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div
                className="w-40 h-32 bg-white/30 backdrop-blur rounded-lg flex items-center justify-center"
                style={{ boxShadow: SHADOWS.header }}
              >
                <span className="text-sm font-medium text-dark">header</span>
              </div>
              <span className="text-xs text-muted">Header glass effect</span>
            </div>
          </div>
        </section>

        {/* Usage */}
        <section className="p-6 bg-white rounded-lg">
          <h3 className="text-lg font-semibold text-dark mb-3">Usage</h3>
          <pre className="bg-dark text-cream p-4 rounded text-sm overflow-x-auto">
{`import { SHADOWS } from '@adrozdenko/design-system'
import { Card } from '@adrozdenko/design-system'

// Using Card shadow prop
<Card shadow="sm">...</Card>
<Card shadow="lg">...</Card>

// In inline styles
<div style={{ boxShadow: SHADOWS.md }}>...</div>`}
          </pre>
        </section>
      </div>
    )
  },
}

// =============================================================================
// TYPOGRAPHY STORY
// =============================================================================

export const Typography: Story = {
  render: () => (
    <div className="p-8 bg-white">
      <h1 className="text-3xl font-display font-bold text-dark mb-8">Typography</h1>

      {/* Font Families */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-dark mb-4">Font Families</h2>
        <div className="space-y-6">
          <div className="p-6 bg-slate-50 rounded-lg">
            <span className="text-sm font-mono text-muted block mb-2">font-display (Pilat Extended)</span>
            <p className="font-display text-3xl font-bold text-dark">
              The quick brown fox jumps over the lazy dog
            </p>
          </div>
          <div className="p-6 bg-slate-50 rounded-lg">
            <span className="text-sm font-mono text-muted block mb-2">font-sans (Fixel)</span>
            <p className="font-sans text-xl text-dark">
              The quick brown fox jumps over the lazy dog
            </p>
          </div>
        </div>
      </section>

      {/* Heading Scale */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-dark mb-4">Heading Scale</h2>
        <div className="space-y-4">
          <div className="flex items-baseline gap-4 p-4 bg-slate-50 rounded">
            <code className="text-xs text-muted w-20">h1</code>
            <span className={`${TYPOGRAPHY.h1} font-display font-bold text-dark`}>Heading 1</span>
          </div>
          <div className="flex items-baseline gap-4 p-4 bg-slate-50 rounded">
            <code className="text-xs text-muted w-20">h2</code>
            <span className={`${TYPOGRAPHY.h2} font-display font-semibold text-dark`}>Heading 2</span>
          </div>
          <div className="flex items-baseline gap-4 p-4 bg-slate-50 rounded">
            <code className="text-xs text-muted w-20">subheading</code>
            <span className={`${TYPOGRAPHY.subheading} font-display font-medium text-teal`}>Subheading text</span>
          </div>
          <div className="flex items-baseline gap-4 p-4 bg-slate-50 rounded">
            <code className="text-xs text-muted w-20">body</code>
            <span className={`${TYPOGRAPHY.body} font-sans text-dark`}>Body text for paragraphs and descriptions</span>
          </div>
        </div>
      </section>

      {/* Usage */}
      <section className="p-6 bg-slate-50 rounded-lg">
        <h3 className="text-lg font-semibold text-dark mb-3">Usage</h3>
        <pre className="bg-dark text-cream p-4 rounded text-sm overflow-x-auto">
{`import { TYPOGRAPHY } from '@adrozdenko/design-system'

// Use typography tokens
<h1 className={TYPOGRAPHY.h1}>Large Heading</h1>
<h2 className={TYPOGRAPHY.sectionHeading}>Section Title</h2>
<p className={TYPOGRAPHY.body}>Body text</p>`}
        </pre>
      </section>
    </div>
  ),
}

// =============================================================================
// SPACING STORY
// =============================================================================

export const Spacing: Story = {
  render: () => (
    <div className="p-8 bg-white">
      <h1 className="text-3xl font-display font-bold text-dark mb-8">Spacing</h1>

      {/* Container */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-dark mb-4">Container Widths</h2>
        <div className="space-y-4">
          <div className="p-4 bg-teal/10 rounded border border-teal/30">
            <code className="text-sm font-mono">containerMaxWidth: {SPACING.containerMaxWidth}</code>
            <p className="text-sm text-muted mt-1">Maximum width for main content containers</p>
          </div>
          <div className="p-4 bg-teal/10 rounded border border-teal/30">
            <code className="text-sm font-mono">headerHeight: {SPACING.headerHeight}</code>
            <p className="text-sm text-muted mt-1">Fixed header height for scroll offset calculations</p>
          </div>
        </div>
      </section>

      {/* Section Padding */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-dark mb-4">Section Padding</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded">
            <code className="text-sm font-mono text-dark">sectionPaddingY</code>
            <p className="text-xs text-muted mt-1">{SPACING.sectionPaddingY}</p>
          </div>
          <div className="p-4 bg-slate-50 rounded">
            <code className="text-sm font-mono text-dark">sectionPaddingX</code>
            <p className="text-xs text-muted mt-1">{SPACING.sectionPaddingX}</p>
          </div>
        </div>
      </section>

      {/* Border Radius */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-dark mb-4">Border Radius</h2>
        <div className="flex gap-8">
          {Object.entries(RADIUS).map(([name, value]) => (
            <div key={name} className="flex flex-col items-center gap-2">
              <div
                className="w-20 h-20 bg-teal"
                style={{ borderRadius: value }}
              />
              <code className="text-sm font-mono">{name}</code>
              <span className="text-xs text-muted">{value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Usage */}
      <section className="p-6 bg-slate-50 rounded-lg">
        <h3 className="text-lg font-semibold text-dark mb-3">Usage</h3>
        <pre className="bg-dark text-cream p-4 rounded text-sm overflow-x-auto">
{`import { SPACING, RADIUS } from '@adrozdenko/design-system'

// In styles
<div style={{
  maxWidth: SPACING.containerMaxWidth,
  borderRadius: RADIUS.lg
}}>

// Or use pre-composed Tailwind classes
<section className={SPACING.sectionPaddingY}>...</section>`}
        </pre>
      </section>
    </div>
  ),
}

// =============================================================================
// ANIMATION STORY
// =============================================================================

export const Animation: Story = {
  render: () => (
    <div className="p-8 bg-white">
      <h1 className="text-3xl font-display font-bold text-dark mb-8">Animation</h1>

      {/* Duration Scale */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-dark mb-4">Duration Scale</h2>
        <p className="text-muted mb-6">Consistent timing values for animations.</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(ANIMATION.duration).map(([name, value]) => (
            <div key={name} className="p-4 bg-slate-50 rounded text-center">
              <code className="text-sm font-mono text-dark block">{name}</code>
              <span className="text-2xl font-bold text-teal">{value}s</span>
            </div>
          ))}
        </div>
      </section>

      {/* Easing */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-dark mb-4">Easing Curves</h2>
        <div className="space-y-3">
          <div className="p-4 bg-slate-50 rounded flex justify-between items-center">
            <code className="text-sm font-mono">EASE_OUT</code>
            <span className="text-sm text-muted">[{ANIMATION.easing.EASE_OUT.join(', ')}]</span>
          </div>
          <div className="p-4 bg-slate-50 rounded flex justify-between items-center">
            <code className="text-sm font-mono">EASE_IN_OUT</code>
            <span className="text-sm text-muted">{ANIMATION.easing.EASE_IN_OUT}</span>
          </div>
          <div className="p-4 bg-slate-50 rounded flex justify-between items-center">
            <code className="text-sm font-mono">SPRING_CAROUSEL</code>
            <span className="text-sm text-muted">[{ANIMATION.easing.SPRING_CAROUSEL.join(', ')}]</span>
          </div>
        </div>
      </section>

      {/* Usage */}
      <section className="p-6 bg-slate-50 rounded-lg">
        <h3 className="text-lg font-semibold text-dark mb-3">Usage with Motion</h3>
        <pre className="bg-dark text-cream p-4 rounded text-sm overflow-x-auto">
{`import { ANIMATION } from '@adrozdenko/design-system'
import { motion } from 'motion/react'

<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{
    duration: ANIMATION.duration.NORMAL,
    ease: ANIMATION.easing.EASE_OUT,
  }}
>
  Animated content
</motion.div>`}
        </pre>
      </section>
    </div>
  ),
}

// =============================================================================
// Z-INDEX STORY
// =============================================================================

export const ZIndex: Story = {
  render: () => (
    <div className="p-8 bg-white">
      <h1 className="text-3xl font-display font-bold text-dark mb-8">Z-Index Layers</h1>

      <section className="mb-12">
        <p className="text-muted mb-6">Consistent stacking order for UI elements.</p>
        <div className="relative h-64 bg-slate-100 rounded-lg overflow-hidden">
          {Object.entries(Z_INDEX).map(([name, value], index) => (
            <div
              key={name}
              className="absolute left-1/2 transform -translate-x-1/2 w-48 h-16 rounded shadow-md flex items-center justify-center"
              style={{
                zIndex: value,
                bottom: `${index * 40 + 20}px`,
                backgroundColor: index === 0 ? COLORS.slate :
                               index === 1 ? COLORS.cream :
                               index === 2 ? COLORS.teal :
                               index === 3 ? COLORS.darkPurple : COLORS.ferrariRed,
                color: index < 2 ? COLORS.dark : 'white',
              }}
            >
              <span className="font-mono text-sm">{name}: {value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Usage */}
      <section className="p-6 bg-slate-50 rounded-lg">
        <h3 className="text-lg font-semibold text-dark mb-3">Usage</h3>
        <pre className="bg-dark text-cream p-4 rounded text-sm overflow-x-auto">
{`import { Z_INDEX } from '@adrozdenko/design-system'

<header style={{ zIndex: Z_INDEX.header }}>...</header>
<div className="modal" style={{ zIndex: Z_INDEX.modal }}>...</div>
<div className="tooltip" style={{ zIndex: Z_INDEX.tooltip }}>...</div>`}
        </pre>
      </section>
    </div>
  ),
}
