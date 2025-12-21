/**
 * Materializer Demo - Resolution to Real Components
 *
 * Demonstrates the complete Agentic UI pipeline:
 * Intention → Resolution Engine → Materializer → Real DDS Components
 *
 * This is the "last mile" that turns abstract resolutions into
 * interactive React components that users can actually use.
 */

import type { Meta, StoryObj } from '@storybook/react'
import * as React from 'react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  ABYSS,
  DEEP_CURRENT,
  DUSK_REEF,
  HARBOR,
  CORAL,
  WAVE,
  SLATE,
  PRIMITIVES,
  RADIUS,
} from '../../constants/designTokens'
import {
  Monitor,
  Smartphone,
  Minimize2,
  Eye,
  Layers,
  Play,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  Zap,
} from 'lucide-react'
import {
  ORGANISM_META,
  organismDescription,
} from '../_infrastructure'

// Import the real agentic-ui system
import {
  resolve,
  createDefaultConstraints,
  withMobileDevice,
  withCompactDensity,
  withHighUrgency,
  createSelectionIntention,
  createTextInputIntention,
  createConfirmationIntention,
  createAlertIntention,
  Materializer,
  type Intention,
  type ConstraintSet,
} from '../../lib/agentic-ui'

// =============================================================================
// TYPES
// =============================================================================

interface DemoScenario {
  id: string
  name: string
  description: string
  intention: Intention
  icon: React.ReactNode
}

interface ConstraintPreset {
  id: string
  name: string
  icon: React.ReactNode
  constraints: ConstraintSet
}

// =============================================================================
// DEMO SCENARIOS
// =============================================================================

const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: 'time-selection',
    name: 'Appointment Time',
    description: 'Choose preferred meeting time',
    icon: <Zap className="w-4 h-4" />,
    intention: createSelectionIntention(
      [
        { value: 'morning', label: 'Morning', description: '9:00 AM - 12:00 PM' },
        { value: 'afternoon', label: 'Afternoon', description: '1:00 PM - 5:00 PM' },
        { value: 'evening', label: 'Evening', description: '6:00 PM - 9:00 PM' },
      ],
      'Preferred Time',
      { type: 'appointment_time' }
    ),
  },
  {
    id: 'priority-multi',
    name: 'Priority Tags',
    description: 'Select multiple priority levels',
    icon: <Layers className="w-4 h-4" />,
    intention: createSelectionIntention(
      [
        { value: 'urgent', label: 'Urgent' },
        { value: 'high', label: 'High' },
        { value: 'normal', label: 'Normal' },
        { value: 'low', label: 'Low' },
      ],
      'Priority Levels',
      { multiSelect: true }
    ),
  },
  {
    id: 'message-input',
    name: 'Feedback Message',
    description: 'Provide text feedback',
    icon: <Eye className="w-4 h-4" />,
    intention: createTextInputIntention(
      'Your Feedback',
      { placeholder: 'Tell us what you think...', maxLength: 500 }
    ),
  },
  {
    id: 'delete-confirm',
    name: 'Delete Confirmation',
    description: 'Critical action confirmation',
    icon: <AlertTriangle className="w-4 h-4" />,
    intention: createConfirmationIntention(
      'Delete Account',
      { description: 'This action cannot be undone. All your data will be permanently deleted.', urgent: true }
    ),
  },
  {
    id: 'success-alert',
    name: 'Success Alert',
    description: 'Show success feedback',
    icon: <CheckCircle2 className="w-4 h-4" />,
    intention: createAlertIntention(
      'Operation completed successfully!',
      { type: 'success' }
    ),
  },
]

// =============================================================================
// CONSTRAINT PRESETS
// =============================================================================

const CONSTRAINT_PRESETS: ConstraintPreset[] = [
  {
    id: 'desktop',
    name: 'Desktop',
    icon: <Monitor className="w-4 h-4" />,
    constraints: createDefaultConstraints(),
  },
  {
    id: 'mobile',
    name: 'Mobile',
    icon: <Smartphone className="w-4 h-4" />,
    constraints: withMobileDevice(createDefaultConstraints()),
  },
  {
    id: 'compact',
    name: 'Compact',
    icon: <Minimize2 className="w-4 h-4" />,
    constraints: withCompactDensity(createDefaultConstraints()),
  },
  {
    id: 'urgent',
    name: 'Urgent',
    icon: <AlertTriangle className="w-4 h-4" />,
    constraints: withHighUrgency(createDefaultConstraints()),
  },
]

// =============================================================================
// DEMO COMPONENT
// =============================================================================

function MaterializerDemoComponent() {
  const [selectedScenario, setSelectedScenario] = useState<DemoScenario>(DEMO_SCENARIOS[0])
  const [selectedConstraint, setSelectedConstraint] = useState<ConstraintPreset>(CONSTRAINT_PRESETS[0])
  const [formValues, setFormValues] = useState<Record<string, unknown>>({})

  // Resolve the intention with current constraints
  const resolution = resolve(selectedScenario.intention, selectedConstraint.constraints)

  // Get the current form value for this scenario
  const currentValue = formValues[selectedScenario.id]

  const handleChange = (value: unknown) => {
    setFormValues(prev => ({
      ...prev,
      [selectedScenario.id]: value,
    }))
  }

  return (
    <div
      className="min-h-screen p-8"
      style={{
        background: `linear-gradient(135deg, ${ABYSS[500]} 0%, ${DEEP_CURRENT[700]} 100%)`,
      }}
    >
      {/* Header */}
      <div className="mb-8 text-center">
        <h1
          className="text-3xl font-semibold mb-2"
          style={{ color: PRIMITIVES.white }}
        >
          Materializer Demo
        </h1>
        <p style={{ color: SLATE[300] }}>
          Intention → Resolution → Real Interactive Components
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {/* Left Panel: Scenario Selection */}
        <div
          className="p-6"
          style={{
            backgroundColor: `${ABYSS[500]}CC`,
            borderRadius: RADIUS.lg,
            border: `1px solid ${SLATE[700]}`,
          }}
        >
          <h2
            className="text-lg font-semibold mb-4 flex items-center gap-2"
            style={{ color: PRIMITIVES.white }}
          >
            <Play className="w-5 h-5" />
            <span>Select Scenario</span>
          </h2>
          <div className="space-y-2">
            {DEMO_SCENARIOS.map((scenario) => (
              <button
                key={scenario.id}
                onClick={() => setSelectedScenario(scenario)}
                className="w-full text-left p-3 rounded-lg transition-all"
                style={{
                  backgroundColor:
                    selectedScenario.id === scenario.id
                      ? HARBOR[500]
                      : 'transparent',
                  color:
                    selectedScenario.id === scenario.id
                      ? PRIMITIVES.white
                      : SLATE[300],
                  border: `1px solid ${
                    selectedScenario.id === scenario.id
                      ? HARBOR[400]
                      : 'transparent'
                  }`,
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  {scenario.icon}
                  <span className="font-medium">{scenario.name}</span>
                </div>
                <p className="text-xs opacity-70">{scenario.description}</p>
              </button>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t" style={{ borderColor: SLATE[700] }}>
            <h3
              className="text-sm font-medium mb-3"
              style={{ color: SLATE[300] }}
            >
              Constraint Preset
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {CONSTRAINT_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => setSelectedConstraint(preset)}
                  className="flex items-center gap-2 p-2 rounded-md transition-all"
                  style={{
                    backgroundColor:
                      selectedConstraint.id === preset.id
                        ? DUSK_REEF[500]
                        : `${SLATE[700]}50`,
                    color:
                      selectedConstraint.id === preset.id
                        ? PRIMITIVES.white
                        : SLATE[400],
                  }}
                >
                  {preset.icon}
                  <span className="text-sm">{preset.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Center Panel: Live Component */}
        <div
          className="p-6"
          style={{
            backgroundColor: PRIMITIVES.white,
            borderRadius: RADIUS.lg,
          }}
        >
          <h2
            className="text-lg font-semibold mb-4 flex items-center gap-2"
            style={{ color: ABYSS[500] }}
          >
            <Layers className="w-5 h-5" />
            <span>Materialized Component</span>
          </h2>

          <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: SLATE[50] }}>
            <div className="flex items-center gap-2 text-sm" style={{ color: SLATE[600] }}>
              <ChevronRight className="w-4 h-4" />
              <span>Pattern: <strong>{resolution.manifestation.pattern}</strong></span>
              <span className="mx-2">|</span>
              <span>Device: <strong>{selectedConstraint.name}</strong></span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${selectedScenario.id}-${selectedConstraint.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="min-h-[200px]"
            >
              <Materializer
                resolution={resolution}
                value={currentValue}
                onChange={handleChange}
              />
            </motion.div>
          </AnimatePresence>

          {/* Form State Display */}
          {currentValue !== undefined && (
            <div
              className="mt-6 p-3 rounded-lg"
              style={{ backgroundColor: WAVE[50], border: `1px solid ${WAVE[200]}` }}
            >
              <p className="text-xs font-medium mb-1" style={{ color: WAVE[700] }}>
                Captured Value:
              </p>
              <code className="text-sm font-mono" style={{ color: ABYSS[500] }}>
                {JSON.stringify(currentValue, null, 2)}
              </code>
            </div>
          )}
        </div>

        {/* Right Panel: Resolution Details */}
        <div
          className="p-6"
          style={{
            backgroundColor: `${ABYSS[500]}CC`,
            borderRadius: RADIUS.lg,
            border: `1px solid ${SLATE[700]}`,
          }}
        >
          <h2
            className="text-lg font-semibold mb-4 flex items-center gap-2"
            style={{ color: PRIMITIVES.white }}
          >
            <Eye className="w-5 h-5" />
            <span>Resolution Details</span>
          </h2>

          <div className="space-y-4">
            {/* Pattern */}
            <div>
              <label className="text-xs font-medium" style={{ color: SLATE[400] }}>
                Pattern
              </label>
              <p className="font-mono text-sm mt-1" style={{ color: HARBOR[300] }}>
                {resolution.manifestation.pattern}
              </p>
            </div>

            {/* Traits */}
            <div>
              <label className="text-xs font-medium" style={{ color: SLATE[400] }}>
                Active Traits
              </label>
              <div className="flex flex-wrap gap-1 mt-2">
                {Object.entries(resolution.manifestation.traits)
                  .filter(([_, value]) => value === true)
                  .map(([trait]) => (
                    <span
                      key={trait}
                      className="px-2 py-0.5 text-xs rounded-full"
                      style={{
                        backgroundColor: DUSK_REEF[500],
                        color: PRIMITIVES.white,
                      }}
                    >
                      {trait}
                    </span>
                  ))}
              </div>
            </div>

            {/* Reasoning */}
            <div>
              <label className="text-xs font-medium" style={{ color: SLATE[400] }}>
                Resolution Reasoning
              </label>
              <div
                className="mt-2 p-3 rounded text-xs space-y-1"
                style={{ backgroundColor: `${SLATE[800]}50` }}
              >
                <p style={{ color: SLATE[300] }}>
                  {resolution.reasoning.explanation}
                </p>
                <p className="mt-2 text-xs" style={{ color: SLATE[400] }}>
                  Dominant constraints: {resolution.reasoning.dominantConstraints.join(', ')}
                </p>
              </div>
            </div>

            {/* Confidence */}
            <div>
              <label className="text-xs font-medium" style={{ color: SLATE[400] }}>
                Confidence
              </label>
              <div className="mt-2 flex items-center gap-2">
                <div
                  className="flex-1 h-2 rounded-full overflow-hidden"
                  style={{ backgroundColor: SLATE[700] }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${resolution.reasoning.confidence * 100}%`,
                      backgroundColor:
                        resolution.reasoning.confidence > 0.7
                          ? WAVE[500]
                          : resolution.reasoning.confidence > 0.4
                          ? HARBOR[500]
                          : CORAL[500],
                    }}
                  />
                </div>
                <span className="text-sm font-mono" style={{ color: SLATE[300] }}>
                  {Math.round(resolution.reasoning.confidence * 100)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// ALL PATTERNS SHOWCASE
// =============================================================================

function AllPatternsShowcase() {
  const [values, setValues] = useState<Record<string, unknown>>({})

  const updateValue = (id: string, value: unknown) => {
    setValues(prev => ({ ...prev, [id]: value }))
  }

  const scenarios = DEMO_SCENARIOS.map((scenario) => ({
    ...scenario,
    resolution: resolve(scenario.intention, createDefaultConstraints()),
  }))

  return (
    <div
      className="min-h-screen p-8"
      style={{
        background: `linear-gradient(135deg, ${ABYSS[500]} 0%, ${DEEP_CURRENT[700]} 100%)`,
      }}
    >
      <div className="max-w-4xl mx-auto">
        <h1
          className="text-2xl font-semibold mb-6"
          style={{ color: PRIMITIVES.white }}
        >
          All Pattern Types
        </h1>

        <div className="grid gap-6">
          {scenarios.map(({ id, name, description, resolution }) => (
            <div
              key={id}
              className="p-6"
              style={{
                backgroundColor: PRIMITIVES.white,
                borderRadius: RADIUS.lg,
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold" style={{ color: ABYSS[500] }}>
                    {name}
                  </h3>
                  <p className="text-sm" style={{ color: SLATE[500] }}>
                    {description}
                  </p>
                </div>
                <span
                  className="px-3 py-1 text-xs font-mono rounded-full"
                  style={{
                    backgroundColor: HARBOR[100],
                    color: HARBOR[700],
                  }}
                >
                  {resolution.manifestation.pattern}
                </span>
              </div>

              <Materializer
                resolution={resolution}
                value={values[id]}
                onChange={(v) => updateValue(id, v)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// STORY CONFIGURATION
// =============================================================================

const meta: Meta = {
  title: 'Agentic UI/Materializer Demo',
  ...ORGANISM_META,
  parameters: {
    ...ORGANISM_META.parameters,
    layout: 'fullscreen',
    docs: {
      description: {
        component: organismDescription(
          `The Materializer Demo shows the complete Agentic UI pipeline in action.

**Key Concepts:**
- **Intention**: What the user wants to DO (not what component to show)
- **Resolution**: The system determines the best UI form based on constraints
- **Materializer**: Turns abstract resolutions into real interactive components

**Try it:**
1. Select different scenarios to see various UI patterns
2. Change constraint presets to see adaptive rendering
3. Interact with components to see values captured`
        ),
      },
    },
  },
}

export default meta

type Story = StoryObj<typeof meta>

/**
 * Interactive demo with scenario and constraint selection.
 * Shows how the same intention renders differently based on context.
 */
export const Interactive: Story = {
  render: () => <MaterializerDemoComponent />,
}

/**
 * Showcase of all supported pattern types.
 * Each pattern shown with its default desktop constraints.
 */
export const AllPatterns: Story = {
  render: () => <AllPatternsShowcase />,
}
