import type { Meta, StoryObj } from '@storybook/react'
import { useState, useEffect } from 'react'
import {
  AIAssistantProvider,
  AIAssistantFab,
  AIAssistantPanel,
  AIAssistantQuickActions,
  useAIAssistant,
  type LogoState,
} from '@/components/shared/AIAssistant'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { GridBlobBackground } from '@/components/ui/GridBlobCanvas'
import {
  ORGANISM_META,
  organismDescription,
  IPhoneMobileFrame,
} from '../_infrastructure'

// =============================================================================
// META
// =============================================================================

const meta: Meta<typeof AIAssistantFab> = {
  title: 'Shared/AIAssistant',
  component: AIAssistantFab,
  ...ORGANISM_META,
  parameters: {
    ...ORGANISM_META.parameters,
    layout: 'fullscreen',
    docs: {
      description: {
        component: organismDescription(
          `# AI Assistant - Global Floating Helper

A floating AI assistant FAB fixed to the bottom-right corner.
Provides quick access to AI-powered features throughout the application.

## Features

- **Fixed Position**: Always visible in bottom-right corner
- **Minimizable**: Shrinks to a small dot when minimized
- **Quick Actions**: Single click opens action popover
- **Chat Panel**: Double click opens full chat interface
- **Animated Logo**: Uses AgentLogo with 6 animated states

## Usage

\`\`\`tsx
import {
  AIAssistantProvider,
  AIAssistantFab,
  AIAssistantPanel
} from '@dds/design-system'

function App() {
  return (
    <AIAssistantProvider>
      <YourApp />
      <AIAssistantFab />
      <AIAssistantPanel />
    </AIAssistantProvider>
  )
}
\`\`\``
        ),
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof AIAssistantFab>

// =============================================================================
// DEMO CONTENT
// =============================================================================

function DemoContent() {
  return (
    <div className="relative min-h-screen bg-surface overflow-hidden">
      <GridBlobBackground scale={1.2} blobCount={2} />
      <div className="relative z-10 p-8 max-w-4xl mx-auto space-y-6">
        <Card className="p-6 bg-white/40 dark:bg-black/40 backdrop-blur-[4px] border-2 border-accent shadow-md">
          <h1 className="text-2xl font-bold text-primary mb-4">
            AI Assistant Demo
          </h1>
          <p className="text-secondary mb-4">
            The floating AI assistant is in the bottom-right corner.
            Try these interactions:
          </p>
          <ul className="space-y-2 text-sm text-secondary">
            <li className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-accent" />
              <strong>Single Click</strong> - Open quick actions menu
            </li>
            <li className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-accent" />
              <strong>Double Click</strong> - Open full chat panel
            </li>
            <li className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-accent" />
              <strong>Hover + Minimize</strong> - Shrink to tiny dot
            </li>
          </ul>
        </Card>

        {/* Sample content cards - Depth 3 glass (surface cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4 bg-white/20 dark:bg-black/20 backdrop-blur-[2px] border-2 border-accent shadow-sm">
            <h3 className="font-semibold text-primary mb-2">Recent Incidents</h3>
            <p className="text-sm text-secondary">
              View and manage your recent safety incidents.
            </p>
          </Card>
          <Card className="p-4 bg-white/20 dark:bg-black/20 backdrop-blur-[2px] border-2 border-accent shadow-sm">
            <h3 className="font-semibold text-primary mb-2">Reports</h3>
            <p className="text-sm text-secondary">
              Generate compliance reports with AI-assisted insights.
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// DEFAULT - INTERACTIVE DEMO
// =============================================================================

export const Default: Story = {
  render: () => (
    <AIAssistantProvider
      onAnalyze={() => console.log('Analyze clicked')}
      onSuggest={() => console.log('Suggest clicked')}
      onHelp={() => console.log('Help clicked')}
    >
      <DemoContent />
      <AIAssistantFab />
      <AIAssistantPanel />
    </AIAssistantProvider>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Fully interactive AI Assistant. Click for quick actions, double-click for chat panel.',
      },
    },
  },
}

// =============================================================================
// MINIMIZED STATE
// =============================================================================

export const Minimized: Story = {
  render: () => (
    <AIAssistantProvider defaultMinimized>
      <div className="relative min-h-[500px] bg-surface overflow-hidden">
        <GridBlobBackground scale={1.2} blobCount={2} />
        <div className="relative z-10 p-8">
          <Card className="p-6 bg-white/40 dark:bg-black/40 backdrop-blur-[4px] border-2 border-accent shadow-md max-w-md mx-auto">
            <h2 className="text-lg font-semibold text-primary mb-3">Minimized Mode</h2>
            <p className="text-sm text-secondary">
              The AI assistant starts minimized as a small pulsing dot.
              Click it to expand.
            </p>
          </Card>
        </div>
      </div>
      <AIAssistantFab />
      <AIAssistantPanel />
    </AIAssistantProvider>
  ),
  parameters: {
    docs: {
      description: {
        story: 'The assistant starts minimized as a small dot. Click to expand.',
      },
    },
  },
}

// =============================================================================
// WITH PANEL OPEN
// =============================================================================

export const WithPanelOpen: Story = {
  render: () => (
    <AIAssistantProvider defaultPanelOpen>
      <div className="relative min-h-[600px] bg-surface overflow-hidden">
        <GridBlobBackground scale={1.2} blobCount={2} />
        <div className="relative z-10 p-8 pr-[400px]">
          <Card className="p-6 bg-white/40 dark:bg-black/40 backdrop-blur-[4px] border-2 border-accent shadow-md max-w-md">
            <h2 className="text-lg font-semibold text-primary mb-3">Chat Panel</h2>
            <p className="text-sm text-secondary">
              Double-click the FAB to open the chat panel.
              Press Escape or click backdrop to close.
            </p>
          </Card>
        </div>
      </div>
      <AIAssistantFab />
      <AIAssistantPanel />
    </AIAssistantProvider>
  ),
  parameters: {
    docs: {
      description: {
        story: 'The chat panel slides in from the right.',
      },
    },
  },
}

// =============================================================================
// WITH QUICK ACTIONS
// =============================================================================

export const QuickActions: Story = {
  render: () => (
    <AIAssistantProvider
      defaultQuickActionsOpen
      onAnalyze={() => console.log('Analyze')}
      onSuggest={() => console.log('Suggest')}
      onHelp={() => console.log('Help')}
    >
      <div className="relative min-h-[500px] bg-surface overflow-hidden">
        <GridBlobBackground scale={1.2} blobCount={2} />
        <div className="relative z-10 p-8">
          <Card className="p-6 bg-white/40 dark:bg-black/40 backdrop-blur-[4px] border-2 border-accent shadow-md max-w-md">
            <h2 className="text-lg font-semibold text-primary mb-3">Quick Actions</h2>
            <p className="text-sm text-secondary">
              Single click the FAB to open quick actions.
            </p>
          </Card>
        </div>
      </div>
      <AIAssistantFab />
      <AIAssistantQuickActions />
      <AIAssistantPanel />
    </AIAssistantProvider>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Quick actions popover with Analyze, Suggest, and Help buttons.',
      },
    },
  },
}

// =============================================================================
// STATE CYCLING DEMO
// =============================================================================

const LOGO_STATES: LogoState[] = ['idle', 'listening', 'thinking', 'planning', 'executing', 'complete']

/**
 * Inner component that cycles states using context
 */
function StateCycler() {
  const { agentState, setAgentState } = useAIAssistant()
  const [stateIndex, setStateIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setStateIndex((prev) => (prev + 1) % LOGO_STATES.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  // Update agent state when index changes
  useEffect(() => {
    setAgentState(LOGO_STATES[stateIndex])
  }, [stateIndex, setAgentState])

  return (
    <Card className="p-6 bg-white/40 dark:bg-black/40 backdrop-blur-[4px] border-2 border-accent shadow-md max-w-md mx-auto">
      <h2 className="text-lg font-semibold text-primary mb-3">State Cycling</h2>
      <p className="text-sm text-secondary mb-4">
        Watch the AI assistant cycle through all animation states.
      </p>
      <div className="flex items-center gap-3">
        <span className="text-sm text-secondary">Current state:</span>
        <Badge variant="default" className="capitalize">
          {agentState}
        </Badge>
      </div>
    </Card>
  )
}

function StateCyclingDemo() {
  return (
    <AIAssistantProvider>
      <div className="relative min-h-[500px] bg-surface overflow-hidden">
        <GridBlobBackground scale={1.2} blobCount={2} />
        <div className="relative z-10 p-8">
          <StateCycler />
        </div>
      </div>
      <AIAssistantFab />
      <AIAssistantPanel />
    </AIAssistantProvider>
  )
}

export const StateCycling: Story = {
  render: () => <StateCyclingDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Auto-cycling through all 6 agent states every 2 seconds.',
      },
    },
  },
}

// =============================================================================
// MOBILE RESPONSIVE
// =============================================================================

/**
 * Mobile story using iframe embed pattern.
 *
 * Uses `storyId` prop to embed the Default story in an iPhone frame.
 * This approach naturally contains fixed-position elements (like FAB)
 * because the iframe creates a separate document context.
 *
 * @see .claude/storybook-rules.md for mobile story pattern documentation
 */
export const Mobile: Story = {
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        story: `**Mobile View with iPhone Frame**

On mobile devices, the chat panel expands to full width.

This story embeds the Default story inside an iPhone 16 Pro Max frame using the \`storyId\` prop pattern.`,
      },
    },
  },
  render: () => (
    <div className="min-h-screen bg-neutral-200 flex items-center justify-center p-4">
      <IPhoneMobileFrame
        model="iphone16promax"
        storyId="shared-aiassistant--default"
        scale={0.95}
      />
    </div>
  ),
}
