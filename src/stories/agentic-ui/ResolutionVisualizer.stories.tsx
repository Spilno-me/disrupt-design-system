/**
 * Resolution Visualizer
 *
 * Shows the full pipeline from Intention → Resolution:
 * Intent → Traits → Pattern → Render
 *
 * Makes the "magic" visible and debuggable.
 */

import type { Meta, StoryObj } from '@storybook/react'
import * as React from 'react'
import { useState, useMemo } from 'react'
import {
  type Intention,
  type ConstraintSet,
  type BehaviorTrait,
  createDefaultConstraints,
  resolve,
  actionToTraits,
  enhanceTraitsForConstraints,
  findMatchingRules,
  BEHAVIOR_PRIMITIVES,
  withMobileDevice,
  withScreenReader,
} from '../../lib/agentic-ui'
import { cn } from '../../lib/utils'

// =============================================================================
// PIPELINE STEP COMPONENTS
// =============================================================================

interface PipelineStepProps {
  title: string
  description: string
  children: React.ReactNode
  stepNumber: number
  isActive?: boolean
}

function PipelineStep({ title, description, children, stepNumber, isActive = true }: PipelineStepProps) {
  return (
    <div
      className={cn(
        'p-4 rounded-lg border transition-all',
        isActive
          ? 'border-accent bg-surface'
          : 'border-default bg-muted-bg opacity-60'
      )}
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className={cn(
            'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
            isActive ? 'bg-accent-strong text-inverse' : 'bg-muted-bg text-secondary'
          )}
        >
          {stepNumber}
        </div>
        <div>
          <h3 className="font-semibold text-primary">{title}</h3>
          <p className="text-xs text-secondary">{description}</p>
        </div>
      </div>
      <div className="pl-11">{children}</div>
    </div>
  )
}

// =============================================================================
// TRAIT BADGE COMPONENT
// =============================================================================

interface TraitBadgeProps {
  trait: BehaviorTrait
  isHighlighted?: boolean
}

function TraitBadge({ trait, isHighlighted }: TraitBadgeProps) {
  const primitive = BEHAVIOR_PRIMITIVES[trait]

  return (
    <div
      className={cn(
        'px-3 py-2 rounded-md border text-sm transition-all',
        isHighlighted
          ? 'border-accent bg-accent-bg text-text-accent'
          : 'border-default bg-surface text-secondary'
      )}
      title={primitive.description}
    >
      <div className="font-medium">{primitive.name}</div>
      <div className="text-xs opacity-70">{trait}</div>
    </div>
  )
}

// =============================================================================
// CONSTRAINT INDICATOR
// =============================================================================

interface ConstraintIndicatorProps {
  label: string
  value: string
  isModified?: boolean
}

function ConstraintIndicator({ label, value, isModified }: ConstraintIndicatorProps) {
  return (
    <div
      className={cn(
        'px-3 py-2 rounded-md text-sm',
        isModified ? 'bg-accent-bg text-text-accent' : 'bg-muted-bg text-secondary'
      )}
    >
      <div className="text-xs opacity-70">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  )
}

// =============================================================================
// MAIN VISUALIZER COMPONENT
// =============================================================================

function ResolutionVisualizer() {
  // Sample intention
  const intention: Intention = {
    action: 'choose-one',
    subject: {
      type: 'severity',
      label: 'Issue Severity',
      constraints: {
        options: [
          { value: 'critical', label: 'Critical' },
          { value: 'high', label: 'High' },
          { value: 'medium', label: 'Medium' },
          { value: 'low', label: 'Low' },
        ],
        required: true,
      },
    },
    purpose: 'request',
  }

  // Constraint presets
  const [preset, setPreset] = useState<'desktop' | 'mobile' | 'accessible'>('desktop')

  const constraints = useMemo<ConstraintSet>(() => {
    const base = createDefaultConstraints()
    switch (preset) {
      case 'mobile':
        return withMobileDevice(base)
      case 'accessible':
        return withScreenReader(base)
      default:
        return base
    }
  }, [preset])

  // Calculate pipeline stages
  const baseTraits = useMemo(() => actionToTraits(intention.action), [intention.action])
  const enhancedTraits = useMemo(
    () => enhanceTraitsForConstraints(baseTraits, constraints),
    [baseTraits, constraints]
  )
  const matchingRules = useMemo(
    () => findMatchingRules(enhancedTraits, constraints),
    [enhancedTraits, constraints]
  )
  const resolution = useMemo(() => resolve(intention, constraints), [intention, constraints])

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary font-display mb-2">
          Resolution Visualizer
        </h1>
        <p className="text-secondary">
          Watch the pipeline: Intent → Traits → Pattern → Render
        </p>
      </div>

      {/* Preset selector */}
      <div className="flex justify-center gap-3 mb-8">
        {(['desktop', 'mobile', 'accessible'] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPreset(p)}
            className={cn(
              'px-6 py-2 rounded-full text-sm font-medium transition-all',
              preset === p
                ? 'bg-accent-strong text-inverse'
                : 'bg-muted-bg text-secondary hover:bg-surface-hover'
            )}
          >
            {p === 'desktop' && '🖥️ Desktop'}
            {p === 'mobile' && '📱 Mobile'}
            {p === 'accessible' && '♿ Screen Reader'}
          </button>
        ))}
      </div>

      {/* Pipeline visualization */}
      <div className="space-y-4">
        {/* Step 1: Intention */}
        <PipelineStep
          stepNumber={1}
          title="Intention"
          description="What the user wants to DO"
        >
          <div className="bg-page p-4 rounded-md font-mono text-sm overflow-auto">
            <div className="text-secondary">
              <span className="text-accent">action:</span> &quot;{intention.action}&quot;
            </div>
            <div className="text-secondary">
              <span className="text-accent">subject.type:</span> &quot;{intention.subject.type}&quot;
            </div>
            <div className="text-secondary">
              <span className="text-accent">subject.label:</span> &quot;{intention.subject.label}&quot;
            </div>
            <div className="text-secondary">
              <span className="text-accent">purpose:</span> &quot;{intention.purpose}&quot;
            </div>
          </div>
        </PipelineStep>

        {/* Arrow */}
        <div className="flex justify-center">
          <div className="text-3xl text-accent">↓</div>
        </div>

        {/* Step 2: Constraints */}
        <PipelineStep
          stepNumber={2}
          title="Constraints Applied"
          description="Context that shapes the resolution"
        >
          <div className="flex flex-wrap gap-2">
            <ConstraintIndicator
              label="Viewport"
              value={constraints.device.viewport}
              isModified={preset !== 'desktop'}
            />
            <ConstraintIndicator
              label="Touch"
              value={constraints.device.hasTouch ? 'Yes' : 'No'}
              isModified={preset === 'mobile'}
            />
            <ConstraintIndicator
              label="Screen Reader"
              value={constraints.accessibility.screenReader ? 'Yes' : 'No'}
              isModified={preset === 'accessible'}
            />
            <ConstraintIndicator
              label="Density"
              value={constraints.designSystem.density}
            />
            <ConstraintIndicator
              label="Urgency"
              value={constraints.context.urgency}
            />
          </div>
        </PipelineStep>

        {/* Arrow */}
        <div className="flex justify-center">
          <div className="text-3xl text-accent">↓</div>
        </div>

        {/* Step 3: Behavior Traits */}
        <PipelineStep
          stepNumber={3}
          title="Behavior Traits"
          description="Traits derived from intention + constraints"
        >
          <div className="space-y-3">
            <div>
              <div className="text-xs text-secondary mb-2">Base traits (from intention):</div>
              <div className="flex flex-wrap gap-2">
                {baseTraits.map((trait) => (
                  <TraitBadge key={trait} trait={trait} />
                ))}
              </div>
            </div>
            {enhancedTraits.length > baseTraits.length && (
              <div>
                <div className="text-xs text-secondary mb-2">
                  Enhanced traits (from constraints):
                </div>
                <div className="flex flex-wrap gap-2">
                  {enhancedTraits
                    .filter((t) => !baseTraits.includes(t))
                    .map((trait) => (
                      <TraitBadge key={trait} trait={trait} isHighlighted />
                    ))}
                </div>
              </div>
            )}
          </div>
        </PipelineStep>

        {/* Arrow */}
        <div className="flex justify-center">
          <div className="text-3xl text-accent">↓</div>
        </div>

        {/* Step 4: Affinity Rules */}
        <PipelineStep
          stepNumber={4}
          title="Affinity Rule Matching"
          description="Which rules match these traits?"
        >
          <div className="space-y-2">
            {matchingRules.slice(0, 3).map((rule, i) => (
              <div
                key={rule.id}
                className={cn(
                  'p-3 rounded-md border',
                  i === 0
                    ? 'border-accent bg-accent-bg'
                    : 'border-default bg-muted-bg opacity-60'
                )}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-primary">{rule.name}</div>
                    <div className="text-xs text-secondary">
                      Pattern: {rule.pattern} | Priority: {rule.priority}
                    </div>
                  </div>
                  {i === 0 && (
                    <span className="px-2 py-1 bg-accent-strong text-inverse text-xs rounded">
                      SELECTED
                    </span>
                  )}
                </div>
              </div>
            ))}
            {matchingRules.length === 0 && (
              <div className="text-sm text-secondary italic">
                No rules matched — using default pattern
              </div>
            )}
          </div>
        </PipelineStep>

        {/* Arrow */}
        <div className="flex justify-center">
          <div className="text-3xl text-accent">↓</div>
        </div>

        {/* Step 5: Resolution */}
        <PipelineStep
          stepNumber={5}
          title="Resolution"
          description="The final manifestation form"
        >
          <div className="grid md:grid-cols-2 gap-4">
            {/* Pattern & Traits */}
            <div className="bg-page p-4 rounded-md">
              <h4 className="font-semibold text-primary mb-2">Manifestation</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-secondary">Pattern:</span>
                  <span className="font-medium text-accent">
                    {resolution.manifestation.pattern}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary">Role:</span>
                  <span className="font-mono">{resolution.manifestation.traits.role}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary">Interactive:</span>
                  <span>{resolution.manifestation.traits.interactive ? '✓' : '✗'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary">Focusable:</span>
                  <span>{resolution.manifestation.traits.focusable ? '✓' : '✗'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary">Emphasized:</span>
                  <span>{resolution.manifestation.traits.emphasized ? '✓' : '✗'}</span>
                </div>
              </div>
            </div>

            {/* Reasoning */}
            <div className="bg-page p-4 rounded-md">
              <h4 className="font-semibold text-primary mb-2">Reasoning</h4>
              <p className="text-sm text-secondary">{resolution.reasoning.explanation}</p>
              <div className="mt-3">
                <div className="text-xs text-secondary mb-1">Confidence:</div>
                <div className="w-full bg-muted-bg rounded-full h-2">
                  <div
                    className="bg-accent-strong h-2 rounded-full transition-all"
                    style={{ width: `${resolution.reasoning.confidence * 100}%` }}
                  />
                </div>
                <div className="text-xs text-secondary mt-1">
                  {(resolution.reasoning.confidence * 100).toFixed(0)}%
                </div>
              </div>
            </div>
          </div>
        </PipelineStep>

        {/* Arrow */}
        <div className="flex justify-center">
          <div className="text-3xl text-accent">↓</div>
        </div>

        {/* Step 6: Render Output */}
        <PipelineStep
          stepNumber={6}
          title="Render Instructions"
          description="What gets passed to the rendering layer"
        >
          <div className="grid md:grid-cols-2 gap-4">
            {/* Classes */}
            <div className="bg-page p-4 rounded-md">
              <h4 className="font-semibold text-primary mb-2">CSS Classes</h4>
              <div className="flex flex-wrap gap-1">
                {resolution.manifestation.render.classNames.slice(0, 12).map((cls, i) => (
                  <code
                    key={i}
                    className="px-2 py-1 bg-muted-bg text-xs rounded text-secondary"
                  >
                    {cls}
                  </code>
                ))}
                {resolution.manifestation.render.classNames.length > 12 && (
                  <code className="px-2 py-1 bg-muted-bg text-xs rounded text-secondary">
                    +{resolution.manifestation.render.classNames.length - 12} more
                  </code>
                )}
              </div>
            </div>

            {/* ARIA */}
            <div className="bg-page p-4 rounded-md">
              <h4 className="font-semibold text-primary mb-2">ARIA Attributes</h4>
              <div className="space-y-1 text-sm font-mono">
                {Object.entries(resolution.manifestation.render.aria)
                  .filter(([_, v]) => v !== undefined)
                  .map(([key, value]) => (
                    <div key={key} className="text-secondary">
                      <span className="text-accent">{key}</span>=&quot;{String(value)}&quot;
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </PipelineStep>
      </div>

      {/* Summary callout */}
      <div className="mt-8 p-6 bg-inverse-bg text-inverse rounded-lg text-center">
        <p className="text-lg font-semibold mb-2">
          6 steps. Zero component names.
        </p>
        <p className="text-sm opacity-80">
          The entire pipeline operates on intentions and constraints.
          Components are an implementation detail at the very end.
        </p>
      </div>
    </div>
  )
}

// =============================================================================
// STORYBOOK CONFIG
// =============================================================================

const meta: Meta = {
  title: 'Agentic UI/Resolution Visualizer',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Resolution Visualizer

Watch the complete pipeline from Intention to Rendered UI.

## The Pipeline

1. **Intention** - What the user wants to DO
2. **Constraints** - Context that shapes resolution
3. **Behavior Traits** - Capabilities derived from intention + constraints
4. **Affinity Rules** - Pattern matching based on traits
5. **Resolution** - The determined manifestation form
6. **Render Instructions** - CSS classes, ARIA attributes, data attributes

## Key Insight

At no point does the system think in terms of "RadioGroup" or "Select".
It works entirely with intentions, traits, and patterns.

The component is truly dead at this level — it only appears as an
implementation detail when the Render Instructions are finally consumed.
        `,
      },
    },
  },
}

export default meta

type Story = StoryObj

export const Default: Story = {
  render: () => <ResolutionVisualizer />,
}
