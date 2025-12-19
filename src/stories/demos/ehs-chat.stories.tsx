import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { EHSChat, type IncidentReport } from './EHSChat'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  CheckCircle2,
  FileText,
  RotateCcw,
} from 'lucide-react'
import {
  ORGANISM_META,
  organismDescription,
} from '../_infrastructure'

const meta: Meta<typeof EHSChat> = {
  title: 'Flow/Components/EHSChat',
  component: EHSChat,
  ...ORGANISM_META,
  parameters: {
    ...ORGANISM_META.parameters,
    layout: 'centered',
    docs: {
      description: {
        component: organismDescription(
          `# EHS Chat - Agentic UI Fusion

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
- **Seamless UI Fusion**: Traditional forms embedded within conversational UI`
        ),
      },
    },
  },
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
        <Card className="p-4 bg-surface">
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
        <Card className="p-4 bg-surface">
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
// ARCHITECTURE DIAGRAM
// =============================================================================

function ArchitectureDiagram() {
  return (
    <Card className="p-6 bg-surface max-w-2xl">
      <h3 className="font-semibold mb-4" style={{ color: 'var(--arch-box-text)' }}>Agentic UI Fusion Architecture</h3>

      <div className="space-y-4 font-mono text-xs">
        <div className="p-3 rounded-lg text-center" style={{ backgroundColor: 'var(--arch-box-bg)' }}>
          <span className="font-medium" style={{ color: 'var(--arch-box-text)' }}>[User]</span>
        </div>

        <div className="flex justify-center">
          <div className="w-px h-4" style={{ backgroundColor: 'var(--arch-connector)' }} />
        </div>

        <div className="p-3 rounded-lg text-center" style={{
          backgroundColor: 'var(--arch-teal-bg)',
          border: '1px solid var(--arch-teal-border)'
        }}>
          <span className="font-medium" style={{ color: 'var(--arch-teal-text)' }}>[UI Components] ←→ [Fusion Runtime] ←→ [Design Tokens]</span>
        </div>

        <div className="flex justify-center">
          <div className="w-px h-4" style={{ backgroundColor: 'var(--arch-connector)' }} />
        </div>

        <div className="p-3 rounded-lg text-center" style={{ backgroundColor: 'var(--arch-box-bg)' }}>
          <span className="font-medium" style={{ color: 'var(--arch-box-text)' }}>[Structured Intents]</span>
        </div>

        <div className="flex justify-center">
          <div className="w-px h-4" style={{ backgroundColor: 'var(--arch-connector)' }} />
        </div>

        <div className="p-3 rounded-lg text-center" style={{
          backgroundColor: 'var(--arch-purple-bg)',
          border: '1px solid var(--arch-purple-border)'
        }}>
          <span className="font-medium" style={{ color: 'var(--arch-purple-text)' }}>[Agent: Interpreter → Planner → Executor]</span>
        </div>

        <div className="flex justify-center">
          <div className="w-px h-4" style={{ backgroundColor: 'var(--arch-connector)' }} />
        </div>

        <div className="p-3 rounded-lg text-center" style={{ backgroundColor: 'var(--arch-box-bg)' }}>
          <span className="font-medium" style={{ color: 'var(--arch-box-text)' }}>[Backend / APIs / Database]</span>
        </div>
      </div>

      <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: 'var(--arch-principles-bg)' }}>
        <h4 className="text-sm font-medium mb-2" style={{ color: 'var(--arch-principles-text)' }}>Key Principles:</h4>
        <ul className="text-xs space-y-1" style={{ color: 'var(--arch-principles-muted)' }}>
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

