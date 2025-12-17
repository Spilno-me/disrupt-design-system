import type { Meta, StoryObj } from '@storybook/react'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from './dialog'
import { Button } from './button'
import { Input } from './input'
import { Label } from './label'
import { Separator } from './separator'

// Note: DialogHeader, DialogTitle, etc. require Dialog context.
// Default/WithForm use plain HTML to show static previews.
// AllStates uses actual Dialog components for interactive demos.

const meta: Meta<typeof Dialog> = {
  title: 'Core/Dialog',
  component: Dialog,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `**Type:** MOLECULE

Modal dialog for focused user interactions. Built on Radix UI Dialog with DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription, and DialogClose sub-components.`,
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Dialog>

/**
 * ## AllStates
 *
 * Visual reference showing dialog anatomy and common patterns.
 * Since dialogs are modals (only one visible at a time), this story
 * shows the static structure and provides interactive examples.
 *
 * ### Sub-components:
 * - `Dialog` - Root (controls open state)
 * - `DialogTrigger` - Opens the dialog
 * - `DialogContent` - Main panel (includes overlay + close button)
 * - `DialogHeader` - Container for title/description
 * - `DialogTitle` - Accessible title (required)
 * - `DialogDescription` - Optional description
 * - `DialogFooter` - Action buttons container
 * - `DialogClose` - Closes the dialog
 *
 * ### Testing with data-slot:
 * ```tsx
 * container.querySelector('[data-slot="dialog-content"]')
 * container.querySelector('[data-slot="dialog-title"]')
 * container.querySelector('[data-slot="dialog-footer"]')
 * ```
 */
export const AllStates: Story = {
  render: () => (
    <div className="space-y-8">
      {/* Anatomy Reference */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Dialog Anatomy</h3>
        <div className="rounded-lg border border-default bg-surface p-6 shadow-lg max-w-lg">
          <div className="flex flex-col gap-2 text-left">
            <div className="flex items-center justify-between text-xs text-muted">
              <span>DialogHeader</span>
              <span>× Close</span>
            </div>
            <div className="text-base font-semibold">DialogTitle</div>
            <div className="text-sm text-muted">DialogDescription</div>
          </div>
          <Separator className="my-4" />
          <div className="py-4">
            <span className="text-xs text-muted">Content Area</span>
          </div>
          <Separator className="my-4" />
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted">DialogFooter</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Cancel</Button>
              <Button size="sm">Confirm</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Examples */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Interactive Examples</h3>
        <div className="flex flex-wrap gap-4">
          {/* Basic Info Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Info Dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Information</DialogTitle>
                <DialogDescription>
                  This is a basic informational dialog. It provides context or instructions to the user.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button>Got it</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Confirmation Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive">Destructive Action</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this item? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button variant="destructive">Delete</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Form Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button>Form Dialog</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogDescription>
                  Update your profile information below.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="demo-name" className="text-right">Name</Label>
                  <Input id="demo-name" defaultValue="Jane Doe" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="demo-email" className="text-right">Email</Label>
                  <Input id="demo-email" defaultValue="jane@example.com" className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Focus State Reference */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Focus Behavior</h3>
        <ul className="text-sm text-muted space-y-1">
          <li>• Focus trapped within dialog when open</li>
          <li>• First focusable element receives focus on open</li>
          <li>• ESC key closes the dialog</li>
          <li>• Clicking overlay closes the dialog</li>
          <li>• Focus returns to trigger on close</li>
        </ul>
      </div>
    </div>
  ),
}

/**
 * Default dialog with standard structure.
 * Use for confirmations and simple interactions.
 *
 * Static visual representation for documentation purposes.
 */
export const Default: Story = {
  render: () => (
    <div className="bg-surface text-primary font-sans w-full max-w-lg rounded-lg border border-default p-6 shadow-lg">
      <div className="flex flex-col gap-2 text-left">
        <h2 className="text-lg font-semibold leading-none tracking-tight">Dialog Title</h2>
        <p className="text-muted text-sm">
          This is a basic dialog with a title and description.
        </p>
      </div>
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end mt-4">
        <Button variant="outline">Cancel</Button>
        <Button>Confirm</Button>
      </div>
    </div>
  ),
}

/**
 * Dialog with form inputs.
 * Common pattern for editing data or collecting user input.
 *
 * Static visual representation for documentation purposes.
 */
export const WithForm: Story = {
  render: () => (
    <div className="bg-surface text-primary font-sans w-full max-w-[425px] rounded-lg border border-default p-6 shadow-lg">
      <div className="flex flex-col gap-2 text-left">
        <h2 className="text-lg font-semibold leading-none tracking-tight">Edit Profile</h2>
        <p className="text-muted text-sm">
          Make changes to your profile. Click save when done.
        </p>
      </div>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">Name</Label>
          <Input id="name" defaultValue="John Doe" className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="email" className="text-right">Email</Label>
          <Input id="email" defaultValue="john@example.com" className="col-span-3" />
        </div>
      </div>
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button type="submit">Save changes</Button>
      </div>
    </div>
  ),
}
