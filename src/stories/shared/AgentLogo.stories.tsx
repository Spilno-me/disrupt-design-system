import type { Meta, StoryObj } from '@storybook/react'
import { useState, useEffect } from 'react'
import { AgentLogo, type LogoState, type LogoVariant } from '@/components/shared/AgentLogo'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  ATOM_META,
  atomDescription,
} from '../_infrastructure'

const meta: Meta<typeof AgentLogo> = {
  title: 'Shared/AgentLogo',
  component: AgentLogo,
  ...ATOM_META,
  parameters: {
    ...ATOM_META.parameters,
    layout: 'centered',
    docs: {
      description: {
        component: atomDescription(
          `# Agent Logo - Animated Copilot Logo

An animated logo component that visualizes AI agent reasoning states.
The logo consists of three colored shapes (Deep Current teal, Abyss navy/Cream, and Coral red)
that animate differently based on the agent's current processing state.

## States

- **idle**: Gentle breathing pulse - waiting for input
- **listening**: Sound wave bars pulsing - processing voice input
- **thinking**: Dots orbit around center like electrons - analyzing
- **planning**: Dots extend into lines - writing todo list
- **executing**: Fast continuous orbit - running actions
- **complete**: Snap back to logo with bounce - task finished

## Variants

- **dark**: For dark backgrounds (medium shape is Cream)
- **light**: For light backgrounds (medium shape is Abyss navy)`
        ),
      },
    },
  },
  argTypes: {
    state: {
      control: 'select',
      options: ['idle', 'listening', 'thinking', 'planning', 'executing', 'complete'],
      description: 'The current agent reasoning state',
    },
    variant: {
      control: 'select',
      options: ['dark', 'light'],
      description: 'Color variant for background type',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
}

export default meta
type Story = StoryObj<typeof AgentLogo>

// =============================================================================
// DEFAULT STORY
// =============================================================================

export const Default: Story = {
  args: {
    state: 'idle',
    variant: 'dark',
  },
  render: (args) => (
    <Card className={`p-12 ${args.variant === 'dark' ? 'bg-dark' : 'bg-cream border-2 border-slate/20'}`}>
      <div className="w-32 h-40">
        <AgentLogo {...args} className="w-full h-full" />
      </div>
    </Card>
  ),
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
            <li>Large: Deep Current (teal)</li>
            <li>Medium: {activeVariant === 'dark' ? 'Tide Foam (cream)' : 'Abyss (navy)'}</li>
            <li>Small: Coral (red)</li>
          </ul>
        </div>
      </div>

      {/* State Selector */}
      <Card className="p-6 bg-surface flex-1">
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
// ANIMATED LOGO STANDALONE
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
// ALL STATES GRID
// =============================================================================

export const AllStates: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-6">
      {(['idle', 'listening', 'thinking', 'planning', 'executing', 'complete'] as LogoState[]).map((state) => (
        <Card key={state} className="p-6 bg-dark flex flex-col items-center gap-3">
          <div className="w-20 h-28">
            <AgentLogo state={state} variant="dark" className="w-full h-full" />
          </div>
          <Badge variant="secondary" className="bg-white/10 text-white border-0">
            {state}
          </Badge>
        </Card>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All agent states displayed in a grid for comparison.',
      },
    },
  },
}

// =============================================================================
// SIZES
// =============================================================================

export const Sizes: Story = {
  render: () => (
    <Card className="p-8 bg-dark">
      <div className="flex items-end gap-8">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-10">
            <AgentLogo state="idle" variant="dark" className="w-full h-full" />
          </div>
          <span className="text-xs text-white/60">XS (32x40)</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-16">
            <AgentLogo state="idle" variant="dark" className="w-full h-full" />
          </div>
          <span className="text-xs text-white/60">SM (48x64)</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-20 h-28">
            <AgentLogo state="idle" variant="dark" className="w-full h-full" />
          </div>
          <span className="text-xs text-white/60">MD (80x112)</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-32 h-40">
            <AgentLogo state="idle" variant="dark" className="w-full h-full" />
          </div>
          <span className="text-xs text-white/60">LG (128x160)</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-40 h-52">
            <AgentLogo state="idle" variant="dark" className="w-full h-full" />
          </div>
          <span className="text-xs text-white/60">XL (160x208)</span>
        </div>
      </div>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'The AgentLogo scales responsively. Use className to set dimensions.',
      },
    },
  },
}
