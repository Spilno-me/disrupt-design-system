/**
 * Depth Transparency Model Demo
 *
 * Visual demonstration of the depth-transparency relationship:
 * Elements closer to the page background reveal more of the blob grid.
 * Elevated elements feel more solid/frosted.
 *
 * @see .claude/depth-layering-rules.md for full documentation
 */

import type { Meta, StoryObj } from '@storybook/react'
import * as React from 'react'
import { GridBlobBackground } from '../../components/ui/GridBlobCanvas'

// =============================================================================
// DEPTH CONFIGURATION
// =============================================================================

interface DepthLevel {
  depth: number
  name: string
  background: string
  blur: string
  gridVisibility: string
  useCase: string
  className: string
}

const DEPTH_LEVELS: DepthLevel[] = [
  {
    depth: 5,
    name: 'Page',
    background: 'bg-page (solid)',
    blur: '—',
    gridVisibility: 'Full',
    useCase: 'Page background with blob',
    className: 'bg-page',
  },
  {
    depth: 4,
    name: 'SurfaceHover',
    background: 'bg-white/10',
    blur: 'blur-[1px]',
    gridVisibility: 'High',
    useCase: 'Hover states, subtle overlays',
    className: 'bg-white/10 backdrop-blur-[1px]',
  },
  {
    depth: 3,
    name: 'Surface',
    background: 'bg-white/20',
    blur: 'blur-[2px]',
    gridVisibility: 'Medium',
    useCase: 'Stats cards, filters, tabs',
    className: 'bg-white/20 backdrop-blur-[2px]',
  },
  {
    depth: 2,
    name: 'Card',
    background: 'bg-white/40',
    blur: 'blur-[4px]',
    gridVisibility: 'Low',
    useCase: 'Data tables, primary content',
    className: 'bg-white/40 backdrop-blur-[4px]',
  },
  {
    depth: 1,
    name: 'Elevated',
    background: 'bg-white/60',
    blur: 'blur-[8px]',
    gridVisibility: 'Minimal',
    useCase: 'Modals, dropdowns, popovers',
    className: 'bg-white/60 backdrop-blur-[8px]',
  },
]

// =============================================================================
// DEPTH CARD COMPONENT
// =============================================================================

interface DepthCardProps {
  level: DepthLevel
  showCode?: boolean
}

function DepthCard({ level, showCode = true }: DepthCardProps) {
  return (
    <div
      className={`
        ${level.className}
        rounded-lg border-2 border-accent p-4
        transition-all duration-300
      `}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Depth indicator */}
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-abyss-700 text-ivory-100 font-bold text-lg shadow-sm">
            {level.depth}
          </div>
          <div>
            <h3 className="text-base font-semibold text-primary">{level.name}</h3>
            <p className="text-sm text-secondary">{level.useCase}</p>
          </div>
        </div>

        {/* Grid visibility indicator */}
        <div className="text-right">
          <span className="text-xs font-medium text-tertiary">Grid Visibility</span>
          <p className="text-sm font-semibold text-primary">{level.gridVisibility}</p>
        </div>
      </div>

      {/* Code block */}
      {showCode && (
        <div className="mt-3 rounded-md bg-abyss-900/10 px-3 py-2">
          <code className="text-xs text-secondary font-mono">
            className="{level.className}"
          </code>
        </div>
      )}
    </div>
  )
}

// =============================================================================
// DEMO COMPONENTS
// =============================================================================

function DepthTransparencyDemo() {
  return (
    <div className="relative min-h-screen bg-page">
      {/* Blob background */}
      <GridBlobBackground scale={1.2} blobCount={2} />

      {/* Content */}
      <div className="relative z-10 p-8">
        <div className="mx-auto max-w-3xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-primary">
              Depth Transparency Model
            </h1>
            <p className="mt-2 text-secondary">
              Elements closer to the background reveal more of the blob grid.
              <br />
              Elevated elements feel more solid/frosted.
            </p>
          </div>

          {/* Depth cards stack */}
          <div className="flex flex-col gap-4">
            {DEPTH_LEVELS.map((level) => (
              <DepthCard key={level.depth} level={level} />
            ))}
          </div>

          {/* Legend */}
          <div className="mt-8 rounded-lg bg-white/30 backdrop-blur-[3px] border-2 border-accent p-4">
            <h3 className="text-sm font-semibold text-primary mb-3">
              Transparency Formula
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-tertiary">Opacity:</span>
                <span className="ml-2 font-mono text-primary">
                  10% → 20% → 40% → 60%
                </span>
              </div>
              <div>
                <span className="text-tertiary">Blur:</span>
                <span className="ml-2 font-mono text-primary">
                  1px → 2px → 4px → 8px
                </span>
              </div>
            </div>
            <p className="mt-3 text-xs text-secondary">
              Both opacity and blur double at each depth level for consistent visual progression.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function SideBySideComparison() {
  return (
    <div className="relative min-h-screen bg-page">
      <GridBlobBackground scale={1.2} blobCount={2} />

      <div className="relative z-10 p-8">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-2xl font-bold text-primary text-center mb-8">
            Glass vs Solid Comparison
          </h1>

          <div className="grid grid-cols-2 gap-8">
            {/* Glass column */}
            <div>
              <h2 className="text-lg font-semibold text-primary mb-4 text-center">
                Glass Effect (Over Blob)
              </h2>
              <div className="flex flex-col gap-3">
                {DEPTH_LEVELS.slice(1).map((level) => (
                  <div
                    key={level.depth}
                    className={`${level.className} rounded-lg border-2 border-accent p-4`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-primary">
                        Depth {level.depth}
                      </span>
                      <span className="text-xs text-secondary">
                        ({level.name})
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Solid column - glass outer (over blob), then solid surface, then solid cards */}
            <div className="bg-white/20 backdrop-blur-[2px] border-2 border-accent rounded-xl p-4">
              <h2 className="text-lg font-semibold text-primary mb-3 text-center">
                Solid Background (Nested)
              </h2>
              <p className="text-xs text-secondary text-center mb-3">
                Glass outer → Solid surface → Solid cards
              </p>
              {/* Solid surface container */}
              <div className="bg-surface rounded-lg p-4 border border-default">
                <span className="text-xs text-tertiary mb-2 block">bg-surface (solid)</span>
                <div className="flex flex-col gap-2">
                  {[
                    { name: 'bg-elevated', className: 'bg-elevated shadow-sm' },
                    { name: 'bg-elevated + shadow-md', className: 'bg-elevated shadow-md' },
                    { name: 'bg-elevated + shadow-lg', className: 'bg-elevated shadow-lg' },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className={`${item.className} rounded-md border border-default p-3`}
                    >
                      <span className="text-sm font-semibold text-primary">
                        {item.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Usage guide */}
          <div className="mt-8 bg-white/20 backdrop-blur-[2px] rounded-lg border-2 border-accent p-4">
            <h3 className="font-semibold text-primary mb-2">When to Use</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-primary">Use Glass:</span>
                <p className="text-secondary">
                  When element sits over blob/grid background
                </p>
              </div>
              <div>
                <span className="font-medium text-primary">Use Solid:</span>
                <p className="text-secondary">
                  When element sits over solid surface (no transparency benefit)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function InteractiveDemo() {
  const [selectedDepth, setSelectedDepth] = React.useState<number>(3)

  return (
    <div className="relative min-h-screen bg-page">
      <GridBlobBackground scale={1.2} blobCount={2} />

      <div className="relative z-10 p-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-2xl font-bold text-primary text-center mb-8">
            Interactive Depth Selector
          </h1>

          {/* Depth selector */}
          <div className="flex justify-center gap-2 mb-8">
            {DEPTH_LEVELS.map((level) => (
              <button
                key={level.depth}
                onClick={() => setSelectedDepth(level.depth)}
                className={`
                  px-4 py-2 rounded-lg font-medium transition-all
                  ${
                    selectedDepth === level.depth
                      ? 'bg-abyss-700 text-ivory-100 shadow-md border-2 border-abyss-700'
                      : 'bg-white/20 backdrop-blur-[2px] text-primary hover:bg-white/30 border-2 border-accent'
                  }
                `}
              >
                {level.depth}
              </button>
            ))}
          </div>

          {/* Selected depth preview */}
          {DEPTH_LEVELS.filter((l) => l.depth === selectedDepth).map((level) => (
            <div key={level.depth} className="space-y-4">
              {/* Large preview card */}
              <div
                className={`
                  ${level.className}
                  rounded-xl border-2 border-accent p-8
                  transition-all duration-500
                `}
              >
                <div className="text-center">
                  <div className="text-6xl font-bold text-abyss-700 mb-2">
                    {level.depth}
                  </div>
                  <h2 className="text-xl font-semibold text-primary">
                    {level.name}
                  </h2>
                  <p className="text-secondary mt-2">{level.useCase}</p>
                </div>
              </div>

              {/* Properties */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/20 backdrop-blur-[2px] rounded-lg border-2 border-accent p-4 text-center">
                  <span className="text-xs text-tertiary">Background</span>
                  <p className="font-mono text-sm text-primary">{level.background}</p>
                </div>
                <div className="bg-white/20 backdrop-blur-[2px] rounded-lg border-2 border-accent p-4 text-center">
                  <span className="text-xs text-tertiary">Blur</span>
                  <p className="font-mono text-sm text-primary">{level.blur}</p>
                </div>
                <div className="bg-white/20 backdrop-blur-[2px] rounded-lg border-2 border-accent p-4 text-center">
                  <span className="text-xs text-tertiary">Grid Visibility</span>
                  <p className="font-medium text-sm text-primary">{level.gridVisibility}</p>
                </div>
              </div>

              {/* Copy-paste code */}
              <div className="bg-abyss-900/80 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-abyss-300">CSS Classes</span>
                </div>
                <code className="text-sm text-ivory-100 font-mono">
                  className="{level.className}"
                </code>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// COLORED GLASS DEMO
// =============================================================================

interface ColoredGlassConfig {
  name: string
  baseColor: string // Tailwind color class base (e.g., 'warning', 'error')
  bgClasses: Record<number, string> // depth -> bg class
  borderClasses: Record<number, string> // depth -> border class (same color, +20% opacity)
  iconClass: string
}

const COLORED_GLASS_VARIANTS: ColoredGlassConfig[] = [
  {
    name: 'Warning',
    baseColor: 'warning',
    bgClasses: {
      4: 'bg-warning/10 backdrop-blur-[1px]',
      3: 'bg-warning/20 backdrop-blur-[2px]',
      2: 'bg-warning/40 backdrop-blur-[4px]',
      1: 'bg-warning/60 backdrop-blur-[8px]',
    },
    // Border = bg opacity + 20% (darker but still transparent)
    borderClasses: {
      4: 'border-warning/30',
      3: 'border-warning/40',
      2: 'border-warning/60',
      1: 'border-warning/80',
    },
    iconClass: 'text-warning',
  },
  {
    name: 'Error',
    baseColor: 'error',
    bgClasses: {
      4: 'bg-error/10 backdrop-blur-[1px]',
      3: 'bg-error/20 backdrop-blur-[2px]',
      2: 'bg-error/40 backdrop-blur-[4px]',
      1: 'bg-error/60 backdrop-blur-[8px]',
    },
    borderClasses: {
      4: 'border-error/30',
      3: 'border-error/40',
      2: 'border-error/60',
      1: 'border-error/80',
    },
    iconClass: 'text-error',
  },
  {
    name: 'Success',
    baseColor: 'success',
    bgClasses: {
      4: 'bg-success/10 backdrop-blur-[1px]',
      3: 'bg-success/20 backdrop-blur-[2px]',
      2: 'bg-success/40 backdrop-blur-[4px]',
      1: 'bg-success/60 backdrop-blur-[8px]',
    },
    borderClasses: {
      4: 'border-success/30',
      3: 'border-success/40',
      2: 'border-success/60',
      1: 'border-success/80',
    },
    iconClass: 'text-success',
  },
  {
    name: 'Info',
    baseColor: 'info',
    bgClasses: {
      4: 'bg-info/10 backdrop-blur-[1px]',
      3: 'bg-info/20 backdrop-blur-[2px]',
      2: 'bg-info/40 backdrop-blur-[4px]',
      1: 'bg-info/60 backdrop-blur-[8px]',
    },
    borderClasses: {
      4: 'border-info/30',
      3: 'border-info/40',
      2: 'border-info/60',
      1: 'border-info/80',
    },
    iconClass: 'text-info',
  },
  {
    name: 'Accent (Teal)',
    baseColor: 'accent',
    bgClasses: {
      4: 'bg-accent/10 backdrop-blur-[1px]',
      3: 'bg-accent/20 backdrop-blur-[2px]',
      2: 'bg-accent/40 backdrop-blur-[4px]',
      1: 'bg-accent/60 backdrop-blur-[8px]',
    },
    borderClasses: {
      4: 'border-accent/30',
      3: 'border-accent/40',
      2: 'border-accent/60',
      1: 'border-accent/80',
    },
    iconClass: 'text-accent',
  },
]

function ColoredGlassDemo() {
  return (
    <div className="relative min-h-screen bg-page">
      <GridBlobBackground scale={1.2} blobCount={2} />

      <div className="relative z-10 p-8">
        <div className="mx-auto max-w-5xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-primary">
              Colored Glass Cards
            </h1>
            <p className="mt-2 text-secondary">
              Same transparency/blur rules, but with semantic colors.
              <br />
              Borders are darker than the card to stand out.
            </p>
          </div>

          {/* Colored variants grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {COLORED_GLASS_VARIANTS.map((variant) => (
              <div key={variant.name} className="space-y-3">
                <h3 className={`text-sm font-semibold ${variant.iconClass}`}>
                  {variant.name}
                </h3>

                {/* Depth levels for this color */}
                {[4, 3, 2, 1].map((depth) => (
                  <div
                    key={depth}
                    className={`
                      ${variant.bgClasses[depth]}
                      rounded-lg border-2 ${variant.borderClasses[depth]} p-3
                      transition-all duration-300
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="flex size-6 items-center justify-center rounded-full bg-abyss-700 text-ivory-100 text-xs font-bold">
                          {depth}
                        </span>
                        <span className="text-sm font-medium text-primary">
                          Depth {depth}
                        </span>
                      </div>
                      <span className="text-xs text-secondary">
                        {depth === 4 && '10% / 1px'}
                        {depth === 3 && '20% / 2px'}
                        {depth === 2 && '40% / 4px'}
                        {depth === 1 && '60% / 8px'}
                      </span>
                    </div>
                  </div>
                ))}

                {/* Code block */}
                <div className="rounded-md bg-abyss-900/80 px-3 py-2">
                  <code className="text-[10px] text-ivory-100 font-mono">
                    bg-{variant.baseColor}/20 backdrop-blur-[2px]
                    <br />
                    border-2 border-{variant.baseColor}/40
                  </code>
                </div>
              </div>
            ))}
          </div>

          {/* Rules summary */}
          <div className="mt-8 rounded-lg bg-white/20 backdrop-blur-[2px] border-2 border-accent p-4">
            <h3 className="font-semibold text-primary mb-3">Colored Glass Rules</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-primary">Background opacity:</span>
                <p className="text-secondary">
                  10% → 20% → 40% → 60% (same as white glass)
                </p>
              </div>
              <div>
                <span className="font-medium text-primary">Border opacity:</span>
                <p className="text-secondary">
                  +20% darker: 30% → 40% → 60% → 80%
                </p>
              </div>
            </div>
            <div className="mt-3 p-2 bg-abyss-900/10 rounded text-xs text-secondary">
              <strong>Formula:</strong> border opacity = background opacity + 20% (same color, more opaque for contrast)
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// STORYBOOK META
// =============================================================================

const meta: Meta = {
  title: 'Foundation/DepthTransparency',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
**Depth Transparency Model**

Visual depth hierarchy through transparency and blur. Elements closer to the page background reveal more of the underlying blob grid, while elevated elements feel more solid/frosted.

| Depth | Layer | Background | Blur | Grid Visibility |
|-------|-------|------------|------|-----------------|
| 5 | Page | solid | — | Full |
| 4 | SurfaceHover | white/10 | 1px | High |
| 3 | Surface | white/20 | 2px | Medium |
| 2 | Card | white/40 | 4px | Low |
| 1 | Elevated | white/60 | 8px | Minimal |

See \`.claude/depth-layering-rules.md\` for full documentation.
        `,
      },
    },
  },
}

export default meta

// =============================================================================
// STORIES
// =============================================================================

export const AllDepths: StoryObj = {
  name: 'All Depth Levels',
  render: () => <DepthTransparencyDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Shows all 5 depth levels stacked vertically over the blob grid background.',
      },
    },
  },
}

export const GlassVsSolid: StoryObj = {
  name: 'Glass vs Solid',
  render: () => <SideBySideComparison />,
  parameters: {
    docs: {
      description: {
        story: 'Side-by-side comparison of glass effects (over blob) vs solid backgrounds (over surface).',
      },
    },
  },
}

export const Interactive: StoryObj = {
  name: 'Interactive Demo',
  render: () => <InteractiveDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Interactive depth selector to explore each level individually.',
      },
    },
  },
}

export const ColoredGlass: StoryObj = {
  name: 'Colored Glass',
  render: () => <ColoredGlassDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Colored glass cards following the same transparency/blur rules. Borders use darker variants to stand out.',
      },
    },
  },
}
