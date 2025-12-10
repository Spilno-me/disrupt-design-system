import type { Meta, StoryObj } from '@storybook/react'
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from './sheet'
import { Button } from './button'
import { Input } from './input'
import { Label } from './label'

const meta: Meta<typeof Sheet> = {
  title: 'Core/Sheet',
  component: Sheet,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Sheet>

// Default right-side sheet
export const Default: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open Sheet</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Sheet Title</SheetTitle>
          <SheetDescription>
            This is a sheet component that slides in from the side.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            Sheet content goes here. You can add forms, lists, or any other content.
          </p>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
}

// Sheet from left side
export const LeftSide: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open Left Sheet</Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Navigation</SheetTitle>
          <SheetDescription>
            Browse through the menu options.
          </SheetDescription>
        </SheetHeader>
        <nav className="flex flex-col gap-2 py-4">
          <a href="#" className="rounded-md px-3 py-2 text-sm hover:bg-accent">Home</a>
          <a href="#" className="rounded-md px-3 py-2 text-sm hover:bg-accent">Products</a>
          <a href="#" className="rounded-md px-3 py-2 text-sm hover:bg-accent">About</a>
          <a href="#" className="rounded-md px-3 py-2 text-sm hover:bg-accent">Contact</a>
        </nav>
      </SheetContent>
    </Sheet>
  ),
}

// Sheet from top
export const TopSide: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open Top Sheet</Button>
      </SheetTrigger>
      <SheetContent side="top">
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
          <SheetDescription>
            You have 3 unread notifications.
          </SheetDescription>
        </SheetHeader>
        <div className="flex gap-4 py-4">
          <div className="flex-1 rounded-md border p-3">
            <p className="text-sm font-medium">New message</p>
            <p className="text-xs text-muted-foreground">2 minutes ago</p>
          </div>
          <div className="flex-1 rounded-md border p-3">
            <p className="text-sm font-medium">Task completed</p>
            <p className="text-xs text-muted-foreground">1 hour ago</p>
          </div>
          <div className="flex-1 rounded-md border p-3">
            <p className="text-sm font-medium">System update</p>
            <p className="text-xs text-muted-foreground">Yesterday</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  ),
}

// Sheet from bottom
export const BottomSide: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open Bottom Sheet</Button>
      </SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>Quick Actions</SheetTitle>
          <SheetDescription>
            Select an action to perform.
          </SheetDescription>
        </SheetHeader>
        <div className="grid grid-cols-3 gap-4 py-4">
          <Button variant="outline" className="flex-col h-auto py-4">
            <span className="text-2xl mb-1">📷</span>
            <span className="text-xs">Camera</span>
          </Button>
          <Button variant="outline" className="flex-col h-auto py-4">
            <span className="text-2xl mb-1">🖼️</span>
            <span className="text-xs">Gallery</span>
          </Button>
          <Button variant="outline" className="flex-col h-auto py-4">
            <span className="text-2xl mb-1">📄</span>
            <span className="text-xs">Files</span>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  ),
}

// Sheet with form
export const WithForm: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Edit Settings</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Settings</SheetTitle>
          <SheetDescription>
            Make changes to your settings here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Display Name</Label>
            <Input id="name" defaultValue="John Doe" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue="john@example.com" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="bio">Bio</Label>
            <textarea
              id="bio"
              className="min-h-[80px] w-full rounded-md border bg-background px-3 py-2 text-sm"
              defaultValue="Software developer and coffee enthusiast."
            />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
          <Button>Save changes</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
}

// All sides showcase
export const AllSides: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">Right (default)</Button>
        </SheetTrigger>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Right Sheet</SheetTitle>
            <SheetDescription>Default position on the right side.</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">Left</Button>
        </SheetTrigger>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>Left Sheet</SheetTitle>
            <SheetDescription>Slides in from the left.</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">Top</Button>
        </SheetTrigger>
        <SheetContent side="top">
          <SheetHeader>
            <SheetTitle>Top Sheet</SheetTitle>
            <SheetDescription>Slides in from the top.</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">Bottom</Button>
        </SheetTrigger>
        <SheetContent side="bottom">
          <SheetHeader>
            <SheetTitle>Bottom Sheet</SheetTitle>
            <SheetDescription>Slides in from the bottom.</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  ),
}
