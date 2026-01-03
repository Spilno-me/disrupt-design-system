/**
 * Color Intelligence System Visual Reference
 *
 * Visual demonstration of the complete color intelligence system:
 * - All 13 contexts with light/dark theme comparison
 * - Button variants and states
 * - Badge variants and sizes
 * - Status states with icons
 * - DataViz palettes (categorical, sequential, diverging)
 * - Glass depth examples
 *
 * @see src/data/color-intelligence.json for source data
 */

import type { Meta, StoryObj } from '@storybook/react'
import * as React from 'react'
import colorData from '@/data/color-intelligence.json'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle, AlertTriangle, XCircle, Info, Loader2 } from 'lucide-react'

// =============================================================================
// TYPES
// =============================================================================

type ContextKey = keyof typeof colorData.contexts
type ButtonVariant = 'primary' | 'secondary' | 'destructive' | 'ghost' | 'outline' | 'link'
type ButtonState = 'default' | 'hover' | 'active' | 'focus' | 'loading' | 'disabled'
type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'accent'
type BadgeSize = 'sm' | 'md' | 'lg'
type StatusType = 'success' | 'warning' | 'error' | 'info'

// =============================================================================
// SECTION HEADER COMPONENT
// =============================================================================

function SectionHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold text-primary">{title}</h2>
      {description && <p className="mt-1 text-sm text-secondary">{description}</p>}
    </div>
  )
}

// =============================================================================
// CONTEXT CARD COMPONENT
// =============================================================================

interface ContextCardProps {
  contextKey: ContextKey
  theme: 'light' | 'dark'
}

function ContextCard({ contextKey, theme }: ContextCardProps) {
  const context = colorData.contexts[contextKey]
  const isDark = theme === 'dark'

  // Get background styles
  const getBgClass = () => {
    if ('solid' in context && context.solid) {
      const solid = context.solid as { light?: { bg: string }; dark?: { bg: string } }
      return isDark ? solid.dark?.bg : solid.light?.bg
    }
    if ('light' in context && 'dark' in context) {
      const themed = context as { light?: { bg: string }; dark?: { bg: string } }
      return isDark ? themed.dark?.bg : themed.light?.bg
    }
    return isDark ? 'bg-surface' : 'bg-surface'
  }

  // Get text classes
  const getTextClasses = () => {
    if ('text' in context && context.text) {
      const text = context.text as { primary?: string; secondary?: string; muted?: string }
      return {
        primary: text.primary || 'text-primary',
        secondary: text.secondary || 'text-secondary',
        muted: text.muted || 'text-muted',
      }
    }
    return { primary: 'text-primary', secondary: 'text-secondary', muted: 'text-muted' }
  }

  // Get border class
  const getBorderClass = () => {
    if ('border' in context && typeof context.border === 'string') {
      return context.border
    }
    return 'border border-default'
  }

  // Get shadow class
  const getShadowClass = () => {
    if ('shadow' in context && typeof context.shadow === 'string') {
      return context.shadow
    }
    return ''
  }

  const bgClass = getBgClass()
  const textClasses = getTextClasses()
  const borderClass = getBorderClass()
  const shadowClass = getShadowClass()

  return (
    <div
      className={`${isDark ? 'dark' : ''} rounded-lg p-4 ${bgClass} ${borderClass} ${shadowClass}`}
    >
      <div className="space-y-2">
        <h3 className={`font-semibold ${textClasses.primary}`}>
          {contextKey}
        </h3>
        <p className={`text-sm ${textClasses.secondary}`}>
          {context.description}
        </p>
        <p className={`text-xs ${textClasses.muted}`}>
          Muted text example
        </p>
        {'depth' in context && (
          <span className="inline-block text-xs bg-accent-bg text-accent px-2 py-0.5 rounded">
            Depth: {String(context.depth)}
          </span>
        )}
      </div>
    </div>
  )
}

// =============================================================================
// ALL CONTEXTS DEMO
// =============================================================================

const CONTEXT_KEYS: ContextKey[] = [
  'default', 'page', 'card', 'surface', 'modal', 'button',
  'input', 'navigation', 'tooltip', 'tableRow', 'badge', 'status', 'dataViz'
]

function AllContextsDemo() {
  return (
    <div className="space-y-8 p-8 bg-page min-h-screen">
      <SectionHeader
        title="All 13 Contexts"
        description="Each context defines background, text hierarchy, borders, and shadows for specific UI elements"
      />

      <div className="grid grid-cols-2 gap-6">
        {/* Light Theme Column */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-primary mb-4">Light Theme</h3>
          {CONTEXT_KEYS.map((key) => (
            <ContextCard key={`light-${key}`} contextKey={key} theme="light" />
          ))}
        </div>

        {/* Dark Theme Column */}
        <div className="space-y-4 bg-abyss-900 p-4 rounded-xl">
          <h3 className="text-lg font-semibold text-white mb-4">Dark Theme</h3>
          {CONTEXT_KEYS.map((key) => (
            <ContextCard key={`dark-${key}`} contextKey={key} theme="dark" />
          ))}
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// BUTTON VARIANTS DEMO
// =============================================================================

const BUTTON_VARIANTS: { variant: ButtonVariant; label: string; mappedVariant?: string }[] = [
  { variant: 'primary', label: 'Primary', mappedVariant: 'default' },
  { variant: 'secondary', label: 'Secondary', mappedVariant: 'secondary' },
  { variant: 'destructive', label: 'Destructive', mappedVariant: 'destructive' },
  { variant: 'ghost', label: 'Ghost', mappedVariant: 'ghost' },
  { variant: 'outline', label: 'Outline', mappedVariant: 'outline' },
  { variant: 'link', label: 'Link', mappedVariant: 'link' },
]

const BUTTON_STATES: ButtonState[] = ['default', 'hover', 'active', 'focus', 'loading', 'disabled']

function ButtonVariantsDemo() {
  return (
    <div className="space-y-8 p-8 bg-page min-h-screen">
      <SectionHeader
        title="Button Variants"
        description="All 6 button variants across all states"
      />

      <div className="space-y-6">
        {BUTTON_VARIANTS.map(({ variant, label, mappedVariant }) => (
          <div key={variant} className="space-y-2">
            <h3 className="text-sm font-semibold text-primary">{label}</h3>
            <div className="flex flex-wrap gap-3">
              {BUTTON_STATES.map((state) => {
                const buttonVariant = (mappedVariant || variant) as 'default' | 'secondary' | 'destructive' | 'ghost' | 'outline' | 'link'
                const isDisabled = state === 'disabled'
                const isLoading = state === 'loading'

                // Simulate states with data attributes for visual demo
                let stateClass = ''
                if (state === 'hover') stateClass = 'hover:brightness-110'
                if (state === 'active') stateClass = 'scale-[0.98]'
                if (state === 'focus') stateClass = 'ring-2 ring-offset-2 ring-accent'

                return (
                  <div key={state} className="flex flex-col items-center gap-1">
                    <Button
                      variant={buttonVariant}
                      disabled={isDisabled}
                      className={stateClass}
                      noEffect
                    >
                      {isLoading && <Loader2 className="animate-spin size-4" />}
                      {state.charAt(0).toUpperCase() + state.slice(1)}
                    </Button>
                    <span className="text-xs text-muted">{state}</span>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Color intelligence data display */}
      <div className="mt-8 p-4 bg-surface rounded-lg border border-default">
        <h4 className="font-semibold text-primary mb-2">Button Context from color-intelligence.json</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-secondary">Transition:</span>
            <code className="ml-2 text-accent font-mono text-xs">
              {colorData.contexts.button.transition?.default}
            </code>
          </div>
          <div>
            <span className="text-secondary">Active modifier:</span>
            <code className="ml-2 text-accent font-mono text-xs">
              {colorData.contexts.button.states?.active?.modifier}
            </code>
          </div>
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// BADGE VARIANTS DEMO
// =============================================================================

const BADGE_VARIANTS: { variant: BadgeVariant; label: string; mappedVariant?: string }[] = [
  { variant: 'default', label: 'Default', mappedVariant: 'secondary' },
  { variant: 'success', label: 'Success', mappedVariant: 'success' },
  { variant: 'warning', label: 'Warning', mappedVariant: 'warning' },
  { variant: 'error', label: 'Error', mappedVariant: 'destructive' },
  { variant: 'info', label: 'Info', mappedVariant: 'info' },
  { variant: 'accent', label: 'Accent', mappedVariant: 'outline' },
]

const BADGE_SIZES: BadgeSize[] = ['sm', 'md', 'lg']

function BadgeVariantsDemo() {
  return (
    <div className="space-y-8 p-8 bg-page min-h-screen">
      <SectionHeader
        title="Badge Variants"
        description="All 6 badge variants across 3 sizes"
      />

      {/* Variants by Size */}
      <div className="space-y-6">
        {BADGE_SIZES.map((size) => (
          <div key={size} className="space-y-2">
            <h3 className="text-sm font-semibold text-primary capitalize">{size.toUpperCase()} Size</h3>
            <div className="flex flex-wrap gap-3">
              {BADGE_VARIANTS.map(({ variant, label, mappedVariant }) => (
                <Badge
                  key={`${size}-${variant}`}
                  variant={mappedVariant as 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info'}
                  size={size}
                >
                  {label}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Badge context from JSON */}
      <div className="mt-8 p-4 bg-surface rounded-lg border border-default">
        <h4 className="font-semibold text-primary mb-2">Badge Sizes from color-intelligence.json</h4>
        <div className="grid grid-cols-3 gap-4 text-sm font-mono">
          {Object.entries(colorData.contexts.badge.sizes || {}).map(([size, classes]) => (
            <div key={size}>
              <span className="text-secondary">{size}:</span>
              <code className="block text-xs text-accent mt-1">{String(classes)}</code>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// STATUS STATES DEMO
// =============================================================================

const STATUS_ICONS: Record<StatusType, React.ReactNode> = {
  success: <CheckCircle className="size-5" />,
  warning: <AlertTriangle className="size-5" />,
  error: <XCircle className="size-5" />,
  info: <Info className="size-5" />,
}

function StatusStatesDemo() {
  const statusData = colorData.contexts.status as {
    success: { bg: string; text: string; icon: string }
    warning: { bg: string; text: string; icon: string }
    error: { bg: string; text: string; icon: string }
    info: { bg: string; text: string; icon: string }
  }

  return (
    <div className="space-y-8 p-8 bg-page min-h-screen">
      <SectionHeader
        title="Status States"
        description="Semantic status indicators with icons"
      />

      <div className="grid grid-cols-2 gap-4">
        {(Object.keys(STATUS_ICONS) as StatusType[]).map((status) => {
          const config = statusData[status]
          return (
            <div
              key={status}
              className={`flex items-center gap-3 p-4 rounded-lg ${config.bg}`}
            >
              <span className={config.icon}>
                {STATUS_ICONS[status]}
              </span>
              <div>
                <h4 className={`font-semibold capitalize ${config.text}`}>{status}</h4>
                <p className="text-sm text-secondary">Status message here</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Dark mode comparison */}
      <div className="dark bg-abyss-900 p-6 rounded-xl">
        <h3 className="text-lg font-semibold text-white mb-4">Dark Mode</h3>
        <div className="grid grid-cols-2 gap-4">
          {(Object.keys(STATUS_ICONS) as StatusType[]).map((status) => {
            const config = statusData[status]
            return (
              <div
                key={`dark-${status}`}
                className={`flex items-center gap-3 p-4 rounded-lg ${config.bg}`}
              >
                <span className={config.icon}>
                  {STATUS_ICONS[status]}
                </span>
                <div>
                  <h4 className="font-semibold capitalize text-white">{status}</h4>
                  <p className="text-sm text-slate-300">Status message here</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// DATAVIZ SECTION
// =============================================================================

function DataVizDemo() {
  const dataViz = colorData.contexts.dataViz

  return (
    <div className="space-y-8 p-8 bg-page min-h-screen">
      <SectionHeader
        title="DataViz Palettes"
        description="Categorical, sequential, and diverging color scales for data visualization"
      />

      {/* Categorical Palette */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-primary">Categorical Palette</h3>
        <p className="text-sm text-secondary">{dataViz.categorical.description}</p>
        <div className="flex gap-2">
          {dataViz.categorical.palette.map((color, index) => (
            <div key={index} className="flex flex-col items-center gap-2">
              <div
                className="size-16 rounded-lg shadow-md border border-default"
                style={{ backgroundColor: color.hex }}
              />
              <span className="text-xs text-primary font-mono">{color.token}</span>
              <span className="text-xs text-muted">{color.role}</span>
            </div>
          ))}
        </div>
        <div className="p-3 bg-muted-bg rounded text-xs text-secondary">
          <strong>Rules:</strong> Max {dataViz.categorical.rules.maxDistinct} distinct colors. {dataViz.categorical.rules.overflow}
        </div>
      </div>

      {/* Sequential Scales */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-primary">Sequential Scales</h3>
        <p className="text-sm text-secondary">{dataViz.sequential.description}</p>

        <div className="grid grid-cols-3 gap-6">
          {/* Cool */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-primary">Cool ({dataViz.sequential.cool.family})</h4>
            <div className="flex">
              {dataViz.sequential.cool.hexScale.map((hex, i) => (
                <div
                  key={i}
                  className="flex-1 h-12 first:rounded-l last:rounded-r"
                  style={{ backgroundColor: hex }}
                />
              ))}
            </div>
            <p className="text-xs text-muted">{dataViz.sequential.cool.usage}</p>
          </div>

          {/* Warm */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-primary">Warm ({dataViz.sequential.warm.family})</h4>
            <div className="flex">
              {dataViz.sequential.warm.hexScale.map((hex, i) => (
                <div
                  key={i}
                  className="flex-1 h-12 first:rounded-l last:rounded-r"
                  style={{ backgroundColor: hex }}
                />
              ))}
            </div>
            <p className="text-xs text-muted">{dataViz.sequential.warm.usage}</p>
          </div>

          {/* Success */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-primary">Success ({dataViz.sequential.success.family})</h4>
            <div className="flex">
              {dataViz.sequential.success.hexScale.map((hex, i) => (
                <div
                  key={i}
                  className="flex-1 h-12 first:rounded-l last:rounded-r"
                  style={{ backgroundColor: hex }}
                />
              ))}
            </div>
            <p className="text-xs text-muted">{dataViz.sequential.success.usage}</p>
          </div>
        </div>
      </div>

      {/* Diverging Scale */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-primary">Diverging Scale</h3>
        <p className="text-sm text-secondary">{dataViz.diverging.description}</p>

        <div className="flex items-center">
          {dataViz.diverging.scale.map((step, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div
                className="w-full h-16 first:rounded-l last:rounded-r"
                style={{ backgroundColor: step.hex }}
              />
              <span className="text-xs text-muted text-center">{step.meaning}</span>
            </div>
          ))}
        </div>

        <p className="text-xs text-secondary">
          <strong>Usage:</strong> {dataViz.diverging.usage}
        </p>
      </div>

      {/* Accessibility Note */}
      <div className="p-4 bg-info-light rounded-lg border border-info/30">
        <h4 className="font-semibold text-info mb-2">Accessibility</h4>
        <ul className="text-sm text-secondary space-y-1">
          <li>{dataViz.accessibility.colorBlindSafe}</li>
          <li>{dataViz.accessibility.patterns}</li>
          <li>{dataViz.accessibility.labels}</li>
        </ul>
      </div>
    </div>
  )
}

// =============================================================================
// GLASS EXAMPLES
// =============================================================================

function GlassExamplesDemo() {
  const glass = colorData.glass

  return (
    <div className="relative min-h-screen bg-page overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 size-64 bg-accent/20 rounded-full blur-3xl" />
        <div className="absolute top-40 right-20 size-48 bg-warning/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-1/3 size-56 bg-info/15 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 p-8 space-y-8">
        <SectionHeader
          title="Glass Depth Examples"
          description="Transparency and blur levels for glass morphism effects"
        />

        {/* Depth Cards */}
        <div className="grid grid-cols-3 gap-6">
          {/* Depth 1 - Elevated */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-primary">Depth 1 (Elevated)</h3>
            <div className={`${glass.depth1_elevated.light} rounded-xl p-6 border border-white/20`}>
              <p className="text-primary font-semibold">60% opacity, 8px blur</p>
              <p className="text-secondary text-sm mt-2">{glass.depth1_elevated.textStrategy}</p>
              <p className="text-muted text-xs mt-4">{glass.depth1_elevated.notes}</p>
            </div>
            <code className="block text-xs font-mono text-accent bg-muted-bg p-2 rounded">
              {glass.depth1_elevated.light}
            </code>
          </div>

          {/* Depth 2 - Card */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-primary">Depth 2 (Card)</h3>
            <div className={`${glass.depth2_card.light} rounded-xl p-6 ${glass.depth2_card.border}`}>
              <p className="text-primary font-semibold">40% opacity, 4px blur</p>
              <p className="text-secondary text-sm mt-2">{glass.depth2_card.textStrategy}</p>
              <p className="text-muted text-xs mt-4">{glass.depth2_card.notes}</p>
            </div>
            <code className="block text-xs font-mono text-accent bg-muted-bg p-2 rounded">
              {glass.depth2_card.light}
            </code>
          </div>

          {/* Depth 3 - Surface */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-primary">Depth 3 (Surface)</h3>
            <div className={`${glass.depth3_surface.light} rounded-xl p-6 border border-white/10`}>
              {/* Nested solid surface for text */}
              <div className="bg-surface rounded-lg p-4">
                <p className="text-primary font-semibold">20% opacity, 2px blur</p>
                <p className="text-secondary text-sm mt-2">{glass.depth3_surface.textStrategy}</p>
                <p className="text-muted text-xs mt-4">{glass.depth3_surface.notes}</p>
              </div>
            </div>
            <code className="block text-xs font-mono text-accent bg-muted-bg p-2 rounded">
              {glass.depth3_surface.light}
            </code>
          </div>
        </div>

        {/* Glass Rules */}
        <div className="p-4 bg-surface rounded-lg border border-default">
          <h4 className="font-semibold text-primary mb-3">Glass Rules</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-secondary">Min opacity for direct text:</span>
              <span className="ml-2 font-mono text-accent">{glass.rules.minOpacityForDirectText}%</span>
            </div>
            <div>
              <span className="text-secondary">Min opacity for semantic text:</span>
              <span className="ml-2 font-mono text-accent">{glass.rules.minOpacityForSemanticText}%</span>
            </div>
          </div>
          <div className="mt-4 space-y-1">
            <h5 className="text-sm font-medium text-primary">Text Placement Decision Tree:</h5>
            {glass.rules.textPlacementDecisionTree.map((rule, i) => (
              <p key={i} className="text-xs text-secondary font-mono">{rule}</p>
            ))}
          </div>
        </div>

        {/* Dark Mode Glass */}
        <div className="dark bg-abyss-900 p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-white mb-4">Dark Mode Glass</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className={`${glass.depth1_elevated.dark} rounded-xl p-4 border border-white/10`}>
              <p className="text-white font-semibold">Depth 1</p>
              <p className="text-slate-300 text-sm">60% black, 8px blur</p>
            </div>
            <div className={`${glass.depth2_card.dark} rounded-xl p-4 border border-white/10`}>
              <p className="text-white font-semibold">Depth 2</p>
              <p className="text-slate-300 text-sm">40% black, 4px blur</p>
            </div>
            <div className={`${glass.depth3_surface.dark} rounded-xl p-4 border border-white/10`}>
              <div className="bg-abyss-700 rounded p-3">
                <p className="text-white font-semibold">Depth 3</p>
                <p className="text-slate-300 text-sm">Nested surface</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// COMPLETE OVERVIEW (ALL IN ONE)
// =============================================================================

function ColorIntelligenceOverview() {
  const [activeTab, setActiveTab] = React.useState<'contexts' | 'buttons' | 'badges' | 'status' | 'dataviz' | 'glass'>('contexts')

  const tabs = [
    { id: 'contexts', label: 'Contexts' },
    { id: 'buttons', label: 'Buttons' },
    { id: 'badges', label: 'Badges' },
    { id: 'status', label: 'Status' },
    { id: 'dataviz', label: 'DataViz' },
    { id: 'glass', label: 'Glass' },
  ] as const

  return (
    <div className="min-h-screen bg-page">
      {/* Tab Navigation */}
      <div className="sticky top-0 z-20 bg-surface border-b border-default p-4">
        <div className="flex gap-2 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-accent-strong text-inverse'
                  : 'bg-muted-bg text-secondary hover:bg-muted-bg/80'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'contexts' && <AllContextsDemo />}
        {activeTab === 'buttons' && <ButtonVariantsDemo />}
        {activeTab === 'badges' && <BadgeVariantsDemo />}
        {activeTab === 'status' && <StatusStatesDemo />}
        {activeTab === 'dataviz' && <DataVizDemo />}
        {activeTab === 'glass' && <GlassExamplesDemo />}
      </div>
    </div>
  )
}

// =============================================================================
// STORYBOOK META
// =============================================================================

const meta: Meta = {
  title: 'Foundation/Color Intelligence',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
**Color Intelligence System**

A comprehensive visual reference for the DDS color system, including:

| Section | Description |
|---------|-------------|
| **Contexts** | All 13 UI contexts with light/dark theme comparison |
| **Buttons** | 6 variants across 6 states |
| **Badges** | 6 variants across 3 sizes |
| **Status** | 4 semantic states with icons |
| **DataViz** | Categorical, sequential, and diverging palettes |
| **Glass** | 3 depth levels with blur and opacity rules |

See \`src/data/color-intelligence.json\` for the source data.
        `,
      },
    },
  },
}

export default meta

// =============================================================================
// STORIES
// =============================================================================

export const Overview: StoryObj = {
  name: 'Overview',
  render: () => <ColorIntelligenceOverview />,
  parameters: {
    docs: {
      description: {
        story: 'Interactive overview with tabbed navigation through all color intelligence sections.',
      },
    },
  },
}

export const AllContexts: StoryObj = {
  name: 'All Contexts',
  render: () => <AllContextsDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Side-by-side light/dark comparison of all 13 UI contexts.',
      },
    },
  },
}

export const ButtonVariants: StoryObj = {
  name: 'Button Variants',
  render: () => <ButtonVariantsDemo />,
  parameters: {
    docs: {
      description: {
        story: 'All 6 button variants (primary, secondary, destructive, ghost, outline, link) across all states.',
      },
    },
  },
}

export const BadgeVariants: StoryObj = {
  name: 'Badge Variants',
  render: () => <BadgeVariantsDemo />,
  parameters: {
    docs: {
      description: {
        story: 'All 6 badge variants across 3 sizes (sm, md, lg).',
      },
    },
  },
}

export const StatusStates: StoryObj = {
  name: 'Status States',
  render: () => <StatusStatesDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Semantic status indicators (success, warning, error, info) with icons.',
      },
    },
  },
}

export const DataVizPalettes: StoryObj = {
  name: 'DataViz Palettes',
  render: () => <DataVizDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Categorical palette (6 colors), sequential scales (cool, warm, success), and diverging scale.',
      },
    },
  },
}

export const GlassExamples: StoryObj = {
  name: 'Glass Examples',
  render: () => <GlassExamplesDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Glass morphism depth levels (1, 2, 3) with correct blur, opacity, and text placement.',
      },
    },
  },
}
