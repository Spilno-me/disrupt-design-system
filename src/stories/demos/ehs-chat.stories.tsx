import type { Meta, StoryObj } from '@storybook/react'
import { useState, useEffect } from 'react'
import { EHSChat, AgentLogo, type IncidentReport, type LogoState, type LogoVariant } from './EHSChat'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  CheckCircle2,
  FileText,
  RotateCcw,
} from 'lucide-react'

const meta: Meta<typeof EHSChat> = {
  title: 'Flow/Components/EHSChat',
  component: EHSChat,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# EHS Chat - Agentic UI Fusion

An AI-powered chat interface for Environmental Health & Safety (EHS) incident reporting.
This component demonstrates the **Agentic UI Fusion** architecture where traditional UI
elements merge with autonomous agent intelligence.

## Architecture

\`\`\`
[User]
   ↓
[UI Components] ←→ [Fusion Runtime] ←→ [Design System Tokens]
   ↓
[Structured Intents]
   ↓
[Agentic Layer: Interpreter → Planner → Executors]
   ↓
[Backend / APIs / Database]
\`\`\`

## Key Features

- **Agent State Visualization**: Shows real-time agent reasoning (thinking, planning, executing)
- **Dynamic Form Generation**: Forms appear contextually based on conversation flow
- **Quick Reply Options**: Guided interaction through suggested responses
- **Structured Intents**: User actions become typed, actionable intents
- **Seamless UI Fusion**: Traditional forms embedded within conversational UI

## Usage

\`\`\`tsx
<EHSChat
  greeting="Hello! How can I help you today?"
  onReportSubmit={(report) => console.log('Report submitted:', report)}
/>
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    greeting: {
      control: 'text',
      description: 'Initial greeting message from the agent',
    },
    onReportSubmit: {
      action: 'report-submitted',
      description: 'Callback when an incident report is submitted',
    },
  },
}

export default meta
type Story = StoryObj<typeof EHSChat>

// =============================================================================
// DEFAULT STORY
// =============================================================================

export const Default: Story = {
  args: {
    greeting: "Hello! I'm your EHS Assistant. I can help you report safety incidents quickly and accurately. What would you like to report today?",
  },
  render: (args) => (
    <div className="w-[420px]">
      <EHSChat {...args} />
    </div>
  ),
}

// =============================================================================
// INTERACTIVE SIMULATION STORY
// =============================================================================

function SimulationDemo() {
  const [reports, setReports] = useState<IncidentReport[]>([])
  const [key, setKey] = useState(0)

  const handleReportSubmit = (report: IncidentReport) => {
    setReports((prev) => [...prev, report])
  }

  const resetSimulation = () => {
    setReports([])
    setKey((k) => k + 1)
  }

  return (
    <div className="flex gap-6">
      {/* Chat Interface */}
      <div className="w-[420px]">
        <EHSChat
          key={key}
          greeting="Hello! I'm your EHS Assistant. I can help you report safety incidents quickly and accurately. What would you like to report today?"
          onReportSubmit={handleReportSubmit}
        />
      </div>

      {/* Simulation Panel */}
      <div className="w-[300px] space-y-4">
        <Card className="p-4 bg-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-dark">Simulation Panel</h3>
            <Button variant="ghost" size="sm" onClick={resetSimulation}>
              <RotateCcw className="w-4 h-4 mr-1" />
              Reset
            </Button>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-cream rounded-lg">
              <h4 className="text-sm font-medium text-dark mb-2">Try These:</h4>
              <ul className="text-xs text-muted space-y-1">
                <li>• Click "Report Incident" to start</li>
                <li>• Type "I want to report an accident"</li>
                <li>• Ask "Check my report status"</li>
                <li>• Type anything to see agent response</li>
              </ul>
            </div>

            <div className="p-3 bg-cream rounded-lg">
              <h4 className="text-sm font-medium text-dark mb-2">Agent States:</h4>
              <div className="flex flex-wrap gap-1">
                <Badge variant="outline" className="text-xs">idle</Badge>
                <Badge variant="outline" className="text-xs">thinking</Badge>
                <Badge variant="outline" className="text-xs">planning</Badge>
                <Badge variant="outline" className="text-xs">executing</Badge>
                <Badge variant="outline" className="text-xs">complete</Badge>
              </div>
            </div>
          </div>
        </Card>

        {/* Submitted Reports */}
        <Card className="p-4 bg-white">
          <h3 className="font-semibold text-dark mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Submitted Reports ({reports.length})
          </h3>

          {reports.length === 0 ? (
            <p className="text-sm text-muted">No reports submitted yet.</p>
          ) : (
            <div className="space-y-2">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="p-2 bg-cream rounded-lg text-xs"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-dark">{report.id}</span>
                    <Badge
                      variant={report.severity === 'critical' || report.severity === 'high' ? 'destructive' : 'secondary'}
                      className="text-[10px]"
                    >
                      {report.severity}
                    </Badge>
                  </div>
                  <p className="text-muted truncate">{report.title}</p>
                  <div className="flex items-center gap-1 mt-1 text-teal">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Submitted</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

export const InteractiveSimulation: Story = {
  render: () => <SimulationDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Full interactive simulation showing the Agentic UI Fusion in action. Try different inputs and watch the agent reasoning states change.',
      },
    },
  },
}

// =============================================================================
// AGENT STATES SHOWCASE
// =============================================================================

function AgentStatesShowcase() {
  const [activeState, setActiveState] = useState<LogoState>('idle')
  const [activeVariant, setActiveVariant] = useState<LogoVariant>('dark')

  const states: { state: LogoState; label: string; description: string }[] = [
    { state: 'idle', label: 'Ready', description: 'Gentle breathing pulse - waiting for input' },
    { state: 'listening', label: 'Listening', description: 'Sound wave bars pulsing - processing voice input' },
    { state: 'thinking', label: 'Thinking', description: 'Dots orbit around center like electrons - analyzing' },
    { state: 'planning', label: 'Planning', description: 'Dots extend into lines - writing todo list' },
    { state: 'executing', label: 'Executing', description: 'Fast continuous orbit - running actions' },
    { state: 'complete', label: 'Complete', description: 'Snap back to logo with bounce - task finished' },
  ]

  return (
    <div className="flex gap-8">
      {/* Animated Logo Preview */}
      <div className="flex flex-col gap-4 min-w-[280px]">
        {/* Variant Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveVariant('dark')}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              activeVariant === 'dark'
                ? 'bg-dark text-white'
                : 'bg-slate/20 text-dark hover:bg-slate/30'
            }`}
          >
            Dark BG
          </button>
          <button
            onClick={() => setActiveVariant('light')}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              activeVariant === 'light'
                ? 'bg-cream text-dark ring-2 ring-dark'
                : 'bg-slate/20 text-dark hover:bg-slate/30'
            }`}
          >
            Light BG
          </button>
        </div>

        {/* Logo Preview */}
        <Card className={`p-8 flex flex-col items-center justify-center ${
          activeVariant === 'dark' ? 'bg-dark' : 'bg-cream'
        }`}>
          <div className="w-32 h-40 mb-4">
            <AgentLogo state={activeState} variant={activeVariant} className="w-full h-full" />
          </div>
          <Badge variant="secondary" className={`${
            activeVariant === 'dark'
              ? 'bg-white/10 text-white border-0'
              : 'bg-dark/10 text-dark border-0'
          }`}>
            {activeState}
          </Badge>
        </Card>

        {/* Color Info */}
        <div className={`p-3 rounded-lg text-xs ${
          activeVariant === 'dark' ? 'bg-dark/10' : 'bg-cream'
        }`}>
          <p className="font-medium text-dark mb-1">Colors ({activeVariant} variant):</p>
          <ul className="text-muted space-y-0.5">
            <li>• Large: Deep Current (teal)</li>
            <li>• Medium: {activeVariant === 'dark' ? 'Tide Foam (cream)' : 'Abyss (navy)'}</li>
            <li>• Small: Coral (red)</li>
          </ul>
        </div>
      </div>

      {/* State Selector */}
      <Card className="p-6 bg-white flex-1">
        <h3 className="font-semibold text-dark mb-2">Agent Reasoning States</h3>
        <p className="text-sm text-muted mb-4">
          The animated logo communicates the agent's current processing state,
          making AI decision-making transparent to users. Click a state to preview.
        </p>
        <div className="space-y-2">
          {states.map(({ state, label, description }) => (
            <button
              key={state}
              onClick={() => setActiveState(state)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all ${
                activeState === state
                  ? 'bg-teal/10 border-2 border-teal'
                  : 'bg-cream hover:bg-cream/80 border-2 border-transparent'
              }`}
            >
              <div className="w-8 h-10 flex-shrink-0">
                <AgentLogo state={state} variant="light" className="w-full h-full" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-dark">{label}</div>
                <div className="text-xs text-muted">{description}</div>
              </div>
            </button>
          ))}
        </div>
      </Card>
    </div>
  )
}

export const AgentStates: Story = {
  render: () => <AgentStatesShowcase />,
  parameters: {
    docs: {
      description: {
        story: 'Interactive showcase of all agent reasoning states with animated logo. Click each state to see the corresponding animation. The logo uses three colored shapes (Coral red, Abyss navy, and Cream) that animate differently based on the agent\'s current state.',
      },
    },
  },
}

// =============================================================================
// AGENT LOGO STANDALONE
// =============================================================================

function AgentLogoShowcase() {
  const [isPlaying, setIsPlaying] = useState(true)
  const [currentStateIndex, setCurrentStateIndex] = useState(0)

  const states: LogoState[] = ['idle', 'listening', 'thinking', 'planning', 'executing', 'complete']

  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setCurrentStateIndex((prev) => (prev + 1) % states.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [isPlaying])

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Large Previews - Both Variants */}
      <div className="flex gap-6">
        <div className="flex flex-col items-center gap-2">
          <Card className="p-12 bg-dark">
            <div className="w-40 h-52">
              <AgentLogo state={states[currentStateIndex]} variant="dark" className="w-full h-full" />
            </div>
          </Card>
          <span className="text-sm text-muted">Dark Background</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Card className="p-12 bg-cream border-2 border-slate/20">
            <div className="w-40 h-52">
              <AgentLogo state={states[currentStateIndex]} variant="light" className="w-full h-full" />
            </div>
          </Card>
          <span className="text-sm text-muted">Light Background</span>
        </div>
      </div>

      {/* State Indicator */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? 'Pause' : 'Play'} Auto-Cycle
        </Button>
        <Badge variant="secondary" className="text-base px-4 py-1">
          {states[currentStateIndex]}
        </Badge>
      </div>

      {/* Mini Previews */}
      <div className="flex gap-4">
        {states.map((state, index) => (
          <button
            key={state}
            onClick={() => {
              setCurrentStateIndex(index)
              setIsPlaying(false)
            }}
            className={`p-3 rounded-lg transition-all ${
              currentStateIndex === index
                ? 'bg-dark ring-2 ring-teal'
                : 'bg-slate/20 hover:bg-slate/30'
            }`}
          >
            <div className="w-12 h-16">
              <AgentLogo state={state} className="w-full h-full" />
            </div>
            <p className="text-xs text-center mt-1 text-muted">{state}</p>
          </button>
        ))}
      </div>
    </div>
  )
}

export const AnimatedLogo: Story = {
  render: () => <AgentLogoShowcase />,
  parameters: {
    docs: {
      description: {
        story: 'Standalone animated logo component that cycles through all agent states. The logo consists of three shapes that animate based on state: Coral red (smallest), Abyss navy (medium), and Cream (largest).',
      },
    },
  },
}

// =============================================================================
// ARCHITECTURE DIAGRAM
// =============================================================================

function ArchitectureDiagram() {
  return (
    <Card className="p-6 bg-white max-w-2xl">
      <h3 className="font-semibold text-dark mb-4">Agentic UI Fusion Architecture</h3>

      <div className="space-y-4 font-mono text-xs">
        <div className="p-3 bg-cream rounded-lg text-center">
          <span className="text-dark font-medium">[User]</span>
        </div>

        <div className="flex justify-center">
          <div className="w-px h-4 bg-slate" />
        </div>

        <div className="p-3 bg-teal/10 border border-teal rounded-lg text-center">
          <span className="text-teal font-medium">[UI Components] ←→ [Fusion Runtime] ←→ [Design Tokens]</span>
        </div>

        <div className="flex justify-center">
          <div className="w-px h-4 bg-slate" />
        </div>

        <div className="p-3 bg-cream rounded-lg text-center">
          <span className="text-dark font-medium">[Structured Intents]</span>
        </div>

        <div className="flex justify-center">
          <div className="w-px h-4 bg-slate" />
        </div>

        <div className="p-3 bg-dark-purple/10 border border-dark-purple rounded-lg text-center">
          <span className="text-dark-purple font-medium">[Agent: Interpreter → Planner → Executor]</span>
        </div>

        <div className="flex justify-center">
          <div className="w-px h-4 bg-slate" />
        </div>

        <div className="p-3 bg-cream rounded-lg text-center">
          <span className="text-dark font-medium">[Backend / APIs / Database]</span>
        </div>
      </div>

      <div className="mt-6 p-4 bg-cream rounded-lg">
        <h4 className="text-sm font-medium text-dark mb-2">Key Principles:</h4>
        <ul className="text-xs text-muted space-y-1">
          <li>• <strong>UI gives structure</strong> - Predictable, accessible interfaces</li>
          <li>• <strong>Agents give intelligence</strong> - Flexible, contextual reasoning</li>
          <li>• <strong>Full transparency</strong> - Agent state always visible</li>
          <li>• <strong>Compliance-friendly</strong> - Auditable actions and decisions</li>
        </ul>
      </div>
    </Card>
  )
}

export const Architecture: Story = {
  render: () => <ArchitectureDiagram />,
  parameters: {
    docs: {
      description: {
        story: 'Visual representation of the Agentic UI Fusion architecture showing how UI components, agents, and backends work together.',
      },
    },
  },
}

// =============================================================================
// CUSTOM GREETING
// =============================================================================

export const CustomGreeting: Story = {
  args: {
    greeting: "Welcome to the Safety Portal. I'm here to help you document and track workplace incidents. Let's work together to maintain a safe environment.",
  },
  render: (args) => (
    <div className="w-[420px]">
      <EHSChat {...args} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example with a customized greeting message.',
      },
    },
  },
}

// =============================================================================
// MOBILE VIEW
// =============================================================================

export const MobileView: Story = {
  args: {
    greeting: "Hi! I'm your EHS Assistant. How can I help?",
  },
  render: (args) => (
    <div className="w-[320px]">
      <EHSChat {...args} className="h-[500px]" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Mobile-optimized view with reduced width.',
      },
    },
  },
}

