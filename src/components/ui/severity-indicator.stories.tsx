import type { Meta, StoryObj } from '@storybook/react'
import {
  ATOM_META,
  atomDescription,
} from '@/stories/_infrastructure'
import { SeverityIndicator, SeverityLevel } from './SeverityIndicator'

// =============================================================================
// META CONFIGURATION
// =============================================================================

const meta: Meta<typeof SeverityIndicator> = {
  title: 'Flow/Components/SeverityIndicator',
  component: SeverityIndicator,
  ...ATOM_META,
  parameters: {
    ...ATOM_META.parameters,
    docs: {
      description: {
        component: atomDescription(
          `Visual indicator for severity/priority levels. Displays a squircle-shaped badge with color-coded severity.

**Severity Levels:**
| Level | Color | Icon | Use Case |
|-------|-------|------|----------|
| critical | Red | Flame | Urgent issues |
| high | Orange | !!! | High priority |
| medium | Yellow | !! | Medium priority |
| low | Green | ! | Low priority |
| none | Cyan | -- | No priority |`
        ),
      },
    },
  },
  argTypes: {
    level: {
      control: 'select',
      options: ['critical', 'high', 'medium', 'low', 'none'],
      description: 'Severity level to display',
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
      description: 'Size variant',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
}

export default meta
type Story = StoryObj<typeof SeverityIndicator>

// =============================================================================
// INDIVIDUAL STORIES
// =============================================================================

export const Critical: Story = {
  args: {
    level: 'critical',
  },
}

export const High: Story = {
  args: {
    level: 'high',
  },
}

export const Medium: Story = {
  args: {
    level: 'medium',
  },
}

export const Low: Story = {
  args: {
    level: 'low',
  },
}

export const None: Story = {
  args: {
    level: 'none',
  },
}

// =============================================================================
// SIZE VARIANTS
// =============================================================================

export const SmallSize: Story = {
  args: {
    level: 'high',
    size: 'sm',
  },
}

export const MediumSize: Story = {
  args: {
    level: 'high',
    size: 'md',
  },
}

// =============================================================================
// ALL VARIANTS
// =============================================================================

export const AllLevels: Story = {
  render: () => {
    const levels: SeverityLevel[] = ['critical', 'high', 'medium', 'low', 'none']

    return (
      <div className="flex flex-col gap-6">
        <div>
          <h3 className="text-sm font-medium text-muted mb-3">Default Size (md)</h3>
          <div className="flex items-center gap-4">
            {levels.map((level) => (
              <div key={level} className="flex flex-col items-center gap-2">
                <SeverityIndicator level={level} />
                <span className="text-xs text-muted capitalize">{level}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-muted mb-3">Small Size (sm)</h3>
          <div className="flex items-center gap-4">
            {levels.map((level) => (
              <div key={level} className="flex flex-col items-center gap-2">
                <SeverityIndicator level={level} size="sm" />
                <span className="text-xs text-muted capitalize">{level}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  },
}

// =============================================================================
// IN CONTEXT
// =============================================================================

export const InTableContext: Story = {
  render: () => {
    const data = [
      { id: 1, name: 'Server outage', priority: 'critical' as const },
      { id: 2, name: 'Database backup failing', priority: 'high' as const },
      { id: 3, name: 'Update user permissions', priority: 'medium' as const },
      { id: 4, name: 'Review documentation', priority: 'low' as const },
      { id: 5, name: 'General inquiry', priority: 'none' as const },
    ]

    return (
      <div className="w-full max-w-md">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-default">
              <th className="text-left py-2 px-3 text-sm font-medium text-muted">Task</th>
              <th className="text-center py-2 px-3 text-sm font-medium text-muted">Priority</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="border-b border-subtle">
                <td className="py-3 px-3 text-sm text-primary">{item.name}</td>
                <td className="py-3 px-3 text-center">
                  <SeverityIndicator level={item.priority} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  },
}

export const InCardContext: Story = {
  render: () => (
    <div className="flex items-center gap-3 p-4 bg-surface border border-default rounded-lg max-w-sm">
      <SeverityIndicator level="high" />
      <div>
        <div className="font-medium text-primary">Lead: John Smith</div>
        <div className="text-sm text-muted">Founders Fund - $45,000</div>
      </div>
    </div>
  ),
}

