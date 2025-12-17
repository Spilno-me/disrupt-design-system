import type { Meta, StoryObj } from '@storybook/react'
import { Plus, Pencil, Trash2, Copy, Share, Download, Info, HelpCircle } from 'lucide-react'
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from './tooltip'
import { Button } from './button'

const meta: Meta<typeof Tooltip> = {
  title: 'Core/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `**Type:** MOLECULE

Contextual information popup that appears on hover. Built on Radix UI Tooltip with TooltipProvider, TooltipTrigger, and TooltipContent sub-components.`,
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Tooltip>

/**
 * Default tooltip appears on hover with instant display.
 * Tooltips provide brief, contextual information.
 */
export const Default: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Hover me</Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>This is a tooltip</p>
      </TooltipContent>
    </Tooltip>
  ),
}

/**
 * AllStates demonstrates all tooltip positions, configurations, and use cases.
 *
 * **Anatomy:**
 * - TooltipProvider (optional) → shared config for delay
 * - Tooltip (root) → TooltipTrigger + TooltipContent
 *
 * **Positions:** top (default), right, bottom, left
 *
 * **Focus behavior:**
 * - Hover to show tooltip
 * - Focus (keyboard) also shows tooltip
 * - ESC to dismiss
 */
export const AllStates: Story = {
  render: () => (
    <div className="space-y-8">
      {/* Anatomy Diagram */}
      <div className="rounded-md border border-default bg-page p-4">
        <h3 className="text-sm font-semibold mb-3">Tooltip Anatomy</h3>
        <div className="flex items-start gap-8">
          <div className="flex-1 rounded-md border border-dashed border-default p-3 text-xs">
            <div className="text-muted mb-2">TooltipProvider (optional, for shared delay)</div>
            <div className="ml-2 rounded bg-accent/10 px-2 py-1">
              <div className="mb-1">Tooltip (root)</div>
              <div className="ml-2 space-y-1 text-muted">
                <div>├─ TooltipTrigger</div>
                <div>└─ TooltipContent</div>
                <div className="ml-4">└─ Arrow (auto)</div>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <div className="text-xs font-medium mb-2">data-slot attributes:</div>
            <code className="text-xs text-muted block space-y-0.5">
              <div>tooltip-provider</div>
              <div>tooltip, tooltip-trigger</div>
              <div>tooltip-content</div>
            </code>
          </div>
        </div>
      </div>

      {/* Position Variants */}
      <div>
        <h3 className="text-sm font-semibold mb-3">Position Variants</h3>
        <div className="flex gap-8">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline">Top (default)</Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>Tooltip on top</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline">Right</Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Tooltip on right</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline">Bottom</Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Tooltip on bottom</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline">Left</Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Tooltip on left</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Icon Buttons with Tooltips */}
      <div>
        <h3 className="text-sm font-semibold mb-3">Icon Buttons (common use case)</h3>
        <div className="flex gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon">
                <Plus className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Add new item</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon">
                <Pencil className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Edit</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="destructive" size="icon">
                <Trash2 className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Delete</TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Shared Provider with Delay */}
      <div>
        <h3 className="text-sm font-semibold mb-3">Shared Provider (toolbar pattern)</h3>
        <p className="text-xs text-muted mb-3">Using TooltipProvider for shared 100ms delay</p>
        <TooltipProvider delayDuration={100}>
          <div className="flex gap-1 rounded-md border border-default p-1 w-fit">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="size-8">
                  <Copy className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Copy</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="size-8">
                  <Share className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Share</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="size-8">
                  <Download className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Download</TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </div>

      {/* Disabled Element Pattern */}
      <div>
        <h3 className="text-sm font-semibold mb-3">On Disabled Element</h3>
        <p className="text-xs text-muted mb-3">Wrap disabled element in span to enable tooltip</p>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-block">
              <Button variant="outline" disabled>
                Disabled button
              </Button>
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>This button is disabled because you don't have permission</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Keyboard Navigation */}
      <div className="rounded-md border border-default bg-page p-4">
        <h3 className="text-sm font-semibold mb-2">Interaction</h3>
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="font-mono bg-accent/10 px-1 rounded">Hover</span>
            <span className="text-muted ml-2">Show tooltip</span>
          </div>
          <div>
            <span className="font-mono bg-accent/10 px-1 rounded">Focus</span>
            <span className="text-muted ml-2">Show tooltip (keyboard)</span>
          </div>
          <div>
            <span className="font-mono bg-accent/10 px-1 rounded">Escape</span>
            <span className="text-muted ml-2">Dismiss tooltip</span>
          </div>
          <div>
            <span className="font-mono bg-accent/10 px-1 rounded">Mouse leave</span>
            <span className="text-muted ml-2">Hide tooltip</span>
          </div>
        </div>
      </div>
    </div>
  ),
}

/**
 * Rich content tooltips for more detailed information.
 * Use sparingly - consider a popover for complex content.
 */
export const RichContent: Story = {
  render: () => (
    <div className="flex gap-4">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Info className="size-4" />
            Pro tip
          </Button>
        </TooltipTrigger>
        <TooltipContent className="max-w-[200px]">
          <p className="font-medium">Keyboard shortcuts</p>
          <p className="text-xs opacity-80 mt-1">
            Press Ctrl+K to open the command palette for quick navigation.
          </p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon">
            <HelpCircle className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent className="max-w-[180px]">
          <p>Need help? Check out our documentation or contact support.</p>
        </TooltipContent>
      </Tooltip>
    </div>
  ),
}
