import type { Meta, StoryObj } from '@storybook/react'
import {
  // Tier 1: Primitives
  ABYSS,
  DEEP_CURRENT,
  DUSK_REEF,
  CORAL,
  WAVE,
  SUNRISE,
  HARBOR,
  SLATE,
  PRIMITIVES,
  // Tier 2: Alias (Semantic)
  ALIAS,
  // Other tokens
  SHADOWS,
  RADIUS,
  SPACING,
  TYPOGRAPHY,
  ANIMATION,
  Z_INDEX,
} from '../constants/designTokens'

const meta: Meta = {
  title: 'Foundation/Design Tokens',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Design tokens are the foundational values that define the visual design of the Disrupt Design System.
They ensure consistency across all components and applications.

**3-Tier Architecture:**
- **Tier 1 (Primitives):** Raw color values - ABYSS, DEEP_CURRENT, CORAL, etc.
- **Tier 2 (Alias):** Semantic tokens - ALIAS.text.primary, ALIAS.background.surface
- **Tier 3 (Mapped):** Component-specific - MAPPED.button.primary.bg

Import tokens:
\`\`\`typescript
import { ALIAS, MAPPED, SHADOWS, SPACING } from '@/constants/designTokens'
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

function ColorSwatch({ name, value, token }: { name: string; value: string; token?: string }) {
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
      {token && (
        <code className="text-[10px] text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">{token}</code>
      )}
    </div>
  )
}

// =============================================================================
// COLORS STORY
// =============================================================================

export const Colors: Story = {
  render: () => {
    // Primary brand colors (Tier 1 base values)
    const primaryColors = [
      { name: 'Abyss', value: ABYSS[500], token: 'ABYSS[500]' },
      { name: 'Deep Current', value: DEEP_CURRENT[500], token: 'DEEP_CURRENT[500]' },
      { name: 'Red Coral', value: CORAL[500], token: 'CORAL[500]' },
    ]

    // Secondary/neutral colors
    const secondaryColors = [
      { name: 'Dusk Reef', value: DUSK_REEF[500], token: 'DUSK_REEF[500]' },
      { name: 'Tide Foam', value: PRIMITIVES.cream, token: 'PRIMITIVES.cream' },
      { name: 'Slate', value: SLATE[300], token: 'SLATE[300]' },
      { name: 'White', value: PRIMITIVES.white, token: 'PRIMITIVES.white' },
      { name: 'Black', value: PRIMITIVES.black, token: 'PRIMITIVES.black' },
    ]

    // Semantic/status colors
    const semanticColors = [
      { name: 'Wave (Info)', value: WAVE[500], token: 'WAVE[500]' },
      { name: 'Tide Alert (Error)', value: CORAL[500], token: 'CORAL[500]' },
      { name: 'Sunrise (Warning)', value: SUNRISE[500], token: 'SUNRISE[500]' },
      { name: 'Harbor (Success)', value: HARBOR[500], token: 'HARBOR[500]' },
    ]

    // Alias tokens (Tier 2 - semantic usage)
    const aliasTextColors = [
      { name: 'Primary', value: ALIAS.text.primary, token: 'ALIAS.text.primary' },
      { name: 'Secondary', value: ALIAS.text.secondary, token: 'ALIAS.text.secondary' },
      { name: 'Tertiary', value: ALIAS.text.tertiary, token: 'ALIAS.text.tertiary' },
      { name: 'Inverse', value: ALIAS.text.inverse, token: 'ALIAS.text.inverse' },
      { name: 'Link', value: ALIAS.text.link, token: 'ALIAS.text.link' },
    ]

    const aliasBgColors = [
      { name: 'Page', value: ALIAS.background.page, token: 'ALIAS.background.page' },
      { name: 'Surface', value: ALIAS.background.surface, token: 'ALIAS.background.surface' },
      { name: 'Muted', value: ALIAS.background.muted, token: 'ALIAS.background.muted' },
      { name: 'Inverse', value: ALIAS.background.inverse, token: 'ALIAS.background.inverse' },
    ]

    return (
      <div className="p-8 bg-white">
        <h1 className="text-3xl font-display font-bold text-dark mb-2">Colors</h1>
        <p className="text-muted mb-8">Three-tiered color system: Primitives → Alias → Mapped</p>

        {/* Tier 1: Primary Palette */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-dark mb-2">Tier 1: Primary Colors</h2>
          <p className="text-muted mb-6">Core brand primitives - raw color values.</p>
          <div className="grid grid-cols-3 gap-6">
            {primaryColors.map((color) => (
              <ColorSwatch key={color.name} {...color} />
            ))}
          </div>
        </section>

        {/* Secondary/Neutral Colors */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-dark mb-2">Tier 1: Secondary & Neutral Colors</h2>
          <p className="text-muted mb-6">Supporting colors for text, backgrounds, and borders.</p>
          <div className="grid grid-cols-5 gap-6">
            {secondaryColors.map((color) => (
              <ColorSwatch key={color.name} {...color} />
            ))}
          </div>
        </section>

        {/* Semantic Colors */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-dark mb-2">Tier 1: Status Colors</h2>
          <p className="text-muted mb-6">Semantic colors for feedback and alerts.</p>
          <div className="grid grid-cols-4 gap-6">
            {semanticColors.map((color) => (
              <ColorSwatch key={color.name} {...color} />
            ))}
          </div>
        </section>

        {/* Tier 2: Alias Tokens */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-dark mb-2">Tier 2: Text Colors (Alias)</h2>
          <p className="text-muted mb-6">Semantic tokens - use these in components.</p>
          <div className="grid grid-cols-5 gap-6">
            {aliasTextColors.map((color) => (
              <ColorSwatch key={color.name} {...color} />
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-semibold text-dark mb-2">Tier 2: Background Colors (Alias)</h2>
          <p className="text-muted mb-6">Semantic background tokens.</p>
          <div className="grid grid-cols-4 gap-6">
            {aliasBgColors.map((color) => (
              <ColorSwatch key={color.name} {...color} />
            ))}
          </div>
        </section>

        {/* Usage Example */}
        <section className="p-6 bg-slate-50 rounded-lg">
          <h3 className="text-lg font-semibold text-dark mb-3">Usage (Recommended: Tier 2 Alias)</h3>
          <pre className="bg-dark text-cream p-4 rounded text-sm overflow-x-auto">
{`import { ALIAS, MAPPED } from '@/constants/designTokens'

// Tier 2: Semantic tokens (recommended)
<div style={{
  color: ALIAS.text.primary,
  backgroundColor: ALIAS.background.surface
}}>

// Tier 3: Component-specific tokens
<button style={{
  background: MAPPED.button.primary.bg,
  color: MAPPED.button.primary.text
}}>

// Tailwind classes (mapped to tokens)
<div className="text-dark bg-surface border-slate">`}
          </pre>
        </section>
      </div>
    )
  },
}

// =============================================================================
// COLOR SCALES STORY
// =============================================================================

export const ColorScales: Story = {
  render: () => {
    const scales = [
      { name: 'Abyss', scale: ABYSS, description: 'Primary dark neutral' },
      { name: 'Deep Current', scale: DEEP_CURRENT, description: 'Teal accent' },
      { name: 'Dusk Reef', scale: DUSK_REEF, description: 'Purple secondary' },
      { name: 'Coral', scale: CORAL, description: 'Red/error' },
      { name: 'Wave', scale: WAVE, description: 'Blue/info' },
      { name: 'Sunrise', scale: SUNRISE, description: 'Yellow/warning' },
      { name: 'Harbor', scale: HARBOR, description: 'Green/success' },
      { name: 'Slate', scale: SLATE, description: 'Neutral gray' },
    ]

    return (
      <div className="p-8 bg-white">
        <h1 className="text-3xl font-display font-bold text-dark mb-2">Color Scales</h1>
        <p className="text-muted mb-8">Full 50-900 scales for each color primitive.</p>

        {scales.map(({ name, scale, description }) => (
          <section key={name} className="mb-10">
            <h2 className="text-lg font-semibold text-dark mb-1">{name}</h2>
            <p className="text-sm text-muted mb-4">{description}</p>
            <div className="flex gap-1">
              {Object.entries(scale).map(([shade, value]) => (
                <div key={shade} className="flex-1 text-center">
                  <div
                    className="h-16 rounded-md mb-2"
                    style={{ backgroundColor: value }}
                  />
                  <div className="text-xs font-medium text-dark">{shade}</div>
                  <div className="text-[10px] text-muted font-mono">{value}</div>
                </div>
              ))}
            </div>
          </section>
        ))}
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
                  SHADOWS.{level}
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
{`import { SHADOWS } from '@/constants/designTokens'
import { Card } from '@/components/ui/card'

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
{`import { TYPOGRAPHY } from '@/constants/designTokens'

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
{`import { SPACING, RADIUS } from '@/constants/designTokens'

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
{`import { ANIMATION } from '@/constants/designTokens'
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
                backgroundColor: index === 0 ? SLATE[300] :
                               index === 1 ? PRIMITIVES.cream :
                               index === 2 ? DEEP_CURRENT[500] :
                               index === 3 ? DUSK_REEF[500] : CORAL[500],
                color: index < 2 ? ABYSS[500] : PRIMITIVES.white,
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
{`import { Z_INDEX } from '@/constants/designTokens'

<header style={{ zIndex: Z_INDEX.header }}>...</header>
<div className="modal" style={{ zIndex: Z_INDEX.modal }}>...</div>
<div className="tooltip" style={{ zIndex: Z_INDEX.tooltip }}>...</div>`}
        </pre>
      </section>
    </div>
  ),
}
