import type { Meta, StoryObj } from '@storybook/react'
import * as React from 'react'
import { Pencil, Trash2, Share2, Copy, Archive, Star, MoreVertical, Rocket } from 'lucide-react'
import {
  ActionSheet,
  ActionSheetTrigger,
  ActionSheetContent,
  ActionSheetItem,
  ActionSheetSeparator,
  ActionSheetLabel,
} from './ActionSheet'
import {
  ResponsiveActionMenu,
  ResponsiveActionMenuTrigger,
  ResponsiveActionMenuContent,
  ResponsiveActionMenuItem,
  ResponsiveActionMenuSeparator,
  ResponsiveActionMenuLabel,
} from './ResponsiveActionMenu'
import { Button } from './button'
import { ActionTile } from './ActionTile'
import {
  MOLECULE_META,
  moleculeDescription,
  StorySection,
  StoryFlex,
  StoryGrid,
  withStoryContainer,
  IPhoneMobileFrame,
} from '../../stories/_infrastructure'

/**
 * ActionSheet - iOS-style contextual action menu
 *
 * A mobile-optimized action menu that appears near the trigger element.
 * Features glassmorphism styling, 44px touch targets, and destructive action variants.
 *
 * ## Action Overflow Rule (CRITICAL)
 *
 * **≤3 actions = Visible buttons | ≥4 actions = Overflow menu**
 *
 * | Actions | Display | Rationale |
 * |---------|---------|-----------|
 * | 1-3 | Individual buttons (ActionTile) | Quick scan, immediate access |
 * | 4+ | ActionSheet/DropdownMenu | Hick's Law - reduce decision load |
 *
 * **Example**: An incident with Submit, Edit, Delete (3 actions) should show
 * 3 visible buttons, NOT an ActionSheet. Only use ActionSheet when you have
 * 4+ actions that would clutter the interface.
 *
 * ## Usage
 *
 * - **Mobile**: iOS-style ActionSheet with glassmorphic background
 * - **Desktop**: Use ResponsiveActionMenu for automatic switching to DropdownMenu
 *
 * ## Accessibility
 *
 * - Focus trapped within menu when open
 * - ESC key closes menu
 * - Arrow keys navigate between items
 * - Enter/Space selects item
 */
const meta: Meta<typeof ActionSheet> = {
  title: 'Core/ActionSheet',
  component: ActionSheet,
  ...MOLECULE_META,
  parameters: {
    docs: {
      description: {
        component: moleculeDescription(
          'iOS-style contextual action menu with glassmorphism effect. **Only use when 4+ actions** - for ≤3 actions, use visible buttons instead. Adapts between ActionSheet (mobile) and DropdownMenu (desktop) using ResponsiveActionMenu wrapper.'
        ),
      },
    },
  },
  decorators: [withStoryContainer('molecule')],
}

export default meta
type Story = StoryObj<typeof ActionSheet>

// =============================================================================
// BASIC USAGE
// =============================================================================

export const Default: Story = {
  render: () => (
    <ActionSheet>
      <ActionSheetTrigger asChild>
        <Button variant="outline">Open Menu</Button>
      </ActionSheetTrigger>
      <ActionSheetContent>
        <ActionSheetItem icon={<Pencil className="size-full" />} onSelect={() => alert('Edit')}>
          Edit
        </ActionSheetItem>
        <ActionSheetItem icon={<Copy className="size-full" />} onSelect={() => alert('Copy')}>
          Duplicate
        </ActionSheetItem>
        <ActionSheetItem icon={<Share2 className="size-full" />} onSelect={() => alert('Share')}>
          Share
        </ActionSheetItem>
        <ActionSheetSeparator />
        <ActionSheetItem
          variant="destructive"
          icon={<Trash2 className="size-full" />}
          onSelect={() => alert('Delete')}
        >
          Delete
        </ActionSheetItem>
      </ActionSheetContent>
    </ActionSheet>
  ),
}

// =============================================================================
// ACTION OVERFLOW RULE DEMO
// =============================================================================

export const ActionOverflowRule: Story = {
  name: 'Action Overflow Rule (UX Guide)',
  parameters: {
    docs: {
      description: {
        story:
          '**Critical UX Rule**: Only use ActionSheet/DropdownMenu when there are 4+ actions. For ≤3 actions, show visible buttons for immediate access (Hick\'s Law).',
      },
    },
  },
  render: () => (
    <div className="space-y-8">
      <StorySection title="❌ WRONG: 3 actions hidden in menu">
        <div className="p-4 rounded-lg border-2 border-error/50 bg-error/5">
          <p className="text-sm text-error mb-4">
            Don't hide 3 actions in a menu - users lose quick access
          </p>
          <ActionSheet>
            <ActionSheetTrigger asChild>
              <ActionTile variant="neutral" appearance="outline" size="sm" aria-label="Actions">
                <MoreVertical className="size-4" />
              </ActionTile>
            </ActionSheetTrigger>
            <ActionSheetContent>
              <ActionSheetItem icon={<Rocket className="size-full" />}>Submit</ActionSheetItem>
              <ActionSheetItem icon={<Pencil className="size-full" />}>Edit</ActionSheetItem>
              <ActionSheetItem variant="destructive" icon={<Trash2 className="size-full" />}>
                Delete
              </ActionSheetItem>
            </ActionSheetContent>
          </ActionSheet>
        </div>
      </StorySection>

      <StorySection title="✅ CORRECT: 3 actions as visible buttons">
        <div className="p-4 rounded-lg border-2 border-success/50 bg-success/5">
          <p className="text-sm text-success mb-4">
            Show ≤3 actions as visible buttons for immediate access
          </p>
          <div className="flex items-center gap-2">
            <ActionTile variant="success" appearance="filled" size="sm" aria-label="Submit">
              <Rocket className="size-4" />
            </ActionTile>
            <ActionTile variant="info" appearance="filled" size="sm" aria-label="Edit">
              <Pencil className="size-4" />
            </ActionTile>
            <ActionTile variant="destructive" appearance="filled" size="sm" aria-label="Delete">
              <Trash2 className="size-4" />
            </ActionTile>
          </div>
        </div>
      </StorySection>

      <StorySection title="✅ CORRECT: 4+ actions in overflow menu">
        <div className="p-4 rounded-lg border-2 border-success/50 bg-success/5">
          <p className="text-sm text-success mb-4">
            Use ActionSheet/DropdownMenu when you have 4+ actions
          </p>
          <ActionSheet>
            <ActionSheetTrigger asChild>
              <ActionTile variant="neutral" appearance="outline" size="sm" aria-label="Actions">
                <MoreVertical className="size-4" />
              </ActionTile>
            </ActionSheetTrigger>
            <ActionSheetContent>
              <ActionSheetItem icon={<Pencil className="size-full" />}>Edit</ActionSheetItem>
              <ActionSheetItem icon={<Copy className="size-full" />}>Duplicate</ActionSheetItem>
              <ActionSheetItem icon={<Share2 className="size-full" />}>Share</ActionSheetItem>
              <ActionSheetItem icon={<Archive className="size-full" />}>Archive</ActionSheetItem>
              <ActionSheetSeparator />
              <ActionSheetItem variant="destructive" icon={<Trash2 className="size-full" />}>
                Delete
              </ActionSheetItem>
            </ActionSheetContent>
          </ActionSheet>
        </div>
      </StorySection>
    </div>
  ),
}

// =============================================================================
// WITH LABEL
// =============================================================================

export const WithLabel: Story = {
  render: () => (
    <ActionSheet>
      <ActionSheetTrigger asChild>
        <Button variant="outline">Document Actions</Button>
      </ActionSheetTrigger>
      <ActionSheetContent>
        <ActionSheetLabel>Document Options</ActionSheetLabel>
        <ActionSheetSeparator />
        <ActionSheetItem icon={<Pencil className="size-full" />}>Edit Document</ActionSheetItem>
        <ActionSheetItem icon={<Copy className="size-full" />}>Make a Copy</ActionSheetItem>
        <ActionSheetItem icon={<Archive className="size-full" />}>Move to Archive</ActionSheetItem>
        <ActionSheetSeparator />
        <ActionSheetItem variant="destructive" icon={<Trash2 className="size-full" />}>
          Delete Document
        </ActionSheetItem>
      </ActionSheetContent>
    </ActionSheet>
  ),
}

// =============================================================================
// INCIDENT DRAFT ACTIONS
// =============================================================================

export const IncidentDraftActions: Story = {
  name: 'Incident Draft Actions',
  render: () => (
    <ActionSheet>
      <ActionSheetTrigger asChild>
        <ActionTile variant="neutral" appearance="outline" size="xs" aria-label="Actions">
          <MoreVertical className="size-4" />
        </ActionTile>
      </ActionSheetTrigger>
      <ActionSheetContent>
        <ActionSheetLabel>INC-2024-001234</ActionSheetLabel>
        <ActionSheetSeparator />
        <ActionSheetItem icon={<Rocket className="size-full" />} onSelect={() => alert('Submit')}>
          Submit Incident
        </ActionSheetItem>
        <ActionSheetItem icon={<Pencil className="size-full" />} onSelect={() => alert('Edit')}>
          Edit Draft
        </ActionSheetItem>
        <ActionSheetSeparator />
        <ActionSheetItem
          variant="destructive"
          icon={<Trash2 className="size-full" />}
          onSelect={() => alert('Delete')}
        >
          Delete Draft
        </ActionSheetItem>
      </ActionSheetContent>
    </ActionSheet>
  ),
}

// =============================================================================
// MOBILE PREVIEW
// =============================================================================

export const MobilePreview: Story = {
  name: 'Mobile Preview (iPhone Frame)',
  parameters: {
    layout: 'centered',
  },
  render: () => (
    <IPhoneMobileFrame>
      <div className="flex flex-col h-full bg-page">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-default bg-surface">
          <span className="font-semibold">Incident Draft</span>
          <ActionSheet>
            <ActionSheetTrigger asChild>
              <ActionTile variant="neutral" appearance="outline" size="xs" aria-label="Actions">
                <MoreVertical className="size-4" />
              </ActionTile>
            </ActionSheetTrigger>
            <ActionSheetContent>
              <ActionSheetLabel>INC-2024-001234</ActionSheetLabel>
              <ActionSheetSeparator />
              <ActionSheetItem icon={<Rocket className="size-full" />}>
                Submit Incident
              </ActionSheetItem>
              <ActionSheetItem icon={<Pencil className="size-full" />}>
                Edit Draft
              </ActionSheetItem>
              <ActionSheetSeparator />
              <ActionSheetItem variant="destructive" icon={<Trash2 className="size-full" />}>
                Delete Draft
              </ActionSheetItem>
            </ActionSheetContent>
          </ActionSheet>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 space-y-4">
          <div className="bg-elevated rounded-lg p-4 shadow-sm border border-default">
            <h3 className="font-medium mb-1">Slip and Fall - Warehouse A</h3>
            <p className="text-sm text-secondary">Reported 2 hours ago</p>
          </div>
          <div className="text-center text-sm text-muted mt-8">
            <p>Tap the menu icon to see the action sheet</p>
          </div>
        </div>
      </div>
    </IPhoneMobileFrame>
  ),
}

// =============================================================================
// RESPONSIVE ACTION MENU
// =============================================================================

export const ResponsiveDemo: Story = {
  name: 'ResponsiveActionMenu (Adaptive)',
  parameters: {
    docs: {
      description: {
        story:
          'ResponsiveActionMenu automatically switches between ActionSheet (mobile < 640px) and DropdownMenu (desktop). Resize your browser to see the difference.',
      },
    },
  },
  render: () => (
    <StorySection title="Responsive Action Menu">
      <div className="space-y-4">
        <p className="text-sm text-secondary">
          This component adapts to viewport size. Resize your browser window to see it switch
          between ActionSheet (mobile) and DropdownMenu (desktop).
        </p>
        <ResponsiveActionMenu>
          <ResponsiveActionMenuTrigger asChild>
            <Button variant="outline">Adaptive Menu</Button>
          </ResponsiveActionMenuTrigger>
          <ResponsiveActionMenuContent>
            <ResponsiveActionMenuLabel>Quick Actions</ResponsiveActionMenuLabel>
            <ResponsiveActionMenuSeparator />
            <ResponsiveActionMenuItem icon={<Star className="size-full" />}>
              Add to Favorites
            </ResponsiveActionMenuItem>
            <ResponsiveActionMenuItem icon={<Copy className="size-full" />}>
              Duplicate
            </ResponsiveActionMenuItem>
            <ResponsiveActionMenuItem icon={<Share2 className="size-full" />}>
              Share Link
            </ResponsiveActionMenuItem>
            <ResponsiveActionMenuSeparator />
            <ResponsiveActionMenuItem variant="destructive" icon={<Trash2 className="size-full" />}>
              Delete
            </ResponsiveActionMenuItem>
          </ResponsiveActionMenuContent>
        </ResponsiveActionMenu>
      </div>
    </StorySection>
  ),
}

// =============================================================================
// ALL STATES
// =============================================================================

export const AllStates: Story = {
  render: () => (
    <div className="space-y-8">
      <StorySection title="Trigger Variants">
        <StoryFlex>
          <ActionSheet>
            <ActionSheetTrigger asChild>
              <Button variant="default">Default Trigger</Button>
            </ActionSheetTrigger>
            <ActionSheetContent>
              <ActionSheetItem>Action 1</ActionSheetItem>
              <ActionSheetItem>Action 2</ActionSheetItem>
            </ActionSheetContent>
          </ActionSheet>

          <ActionSheet>
            <ActionSheetTrigger asChild>
              <Button variant="outline">Outline Trigger</Button>
            </ActionSheetTrigger>
            <ActionSheetContent>
              <ActionSheetItem>Action 1</ActionSheetItem>
              <ActionSheetItem>Action 2</ActionSheetItem>
            </ActionSheetContent>
          </ActionSheet>

          <ActionSheet>
            <ActionSheetTrigger asChild>
              <ActionTile variant="neutral" appearance="outline" size="sm" aria-label="More actions">
                <MoreVertical className="size-4" />
              </ActionTile>
            </ActionSheetTrigger>
            <ActionSheetContent>
              <ActionSheetItem>Action 1</ActionSheetItem>
              <ActionSheetItem>Action 2</ActionSheetItem>
            </ActionSheetContent>
          </ActionSheet>
        </StoryFlex>
      </StorySection>

      <StorySection title="Item Variants">
        <StoryGrid cols={2}>
          <div className="p-4 rounded-lg border border-default bg-elevated">
            <p className="text-xs text-secondary mb-2">Default Item</p>
            <div className="bg-elevated/95 backdrop-blur-xl rounded-xl p-1 border border-white/20">
              <button className="flex w-full items-center gap-3 px-4 py-3 min-h-[44px] text-left text-base font-medium rounded-xl text-primary hover:bg-surfaceHover">
                <Pencil className="size-5" />
                <span>Edit Item</span>
              </button>
            </div>
          </div>

          <div className="p-4 rounded-lg border border-default bg-elevated">
            <p className="text-xs text-secondary mb-2">Destructive Item</p>
            <div className="bg-elevated/95 backdrop-blur-xl rounded-xl p-1 border border-white/20">
              <button className="flex w-full items-center gap-3 px-4 py-3 min-h-[44px] text-left text-base font-medium rounded-xl text-error hover:bg-error/10">
                <Trash2 className="size-5" />
                <span>Delete Item</span>
              </button>
            </div>
          </div>
        </StoryGrid>
      </StorySection>

      <StorySection title="Positioning">
        <StoryFlex>
          <ActionSheet>
            <ActionSheetTrigger asChild>
              <Button variant="outline">Align Start</Button>
            </ActionSheetTrigger>
            <ActionSheetContent align="start">
              <ActionSheetItem>Action 1</ActionSheetItem>
              <ActionSheetItem>Action 2</ActionSheetItem>
            </ActionSheetContent>
          </ActionSheet>

          <ActionSheet>
            <ActionSheetTrigger asChild>
              <Button variant="outline">Align Center</Button>
            </ActionSheetTrigger>
            <ActionSheetContent align="center">
              <ActionSheetItem>Action 1</ActionSheetItem>
              <ActionSheetItem>Action 2</ActionSheetItem>
            </ActionSheetContent>
          </ActionSheet>

          <ActionSheet>
            <ActionSheetTrigger asChild>
              <Button variant="outline">Align End</Button>
            </ActionSheetTrigger>
            <ActionSheetContent align="end">
              <ActionSheetItem>Action 1</ActionSheetItem>
              <ActionSheetItem>Action 2</ActionSheetItem>
            </ActionSheetContent>
          </ActionSheet>
        </StoryFlex>
      </StorySection>
    </div>
  ),
}
