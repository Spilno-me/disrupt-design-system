import type { Meta, StoryObj } from '@storybook/react'
import { Camera, Image, FileText, Home, Package, Info, Phone, Settings, User, Mail } from 'lucide-react'
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

/**
 * Default sheet slides in from the right side.
 * Includes header, content area, and footer with action buttons.
 */
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
        <div className="flex-1 overflow-auto px-4">
          <p className="text-sm text-muted">
            Sheet content goes here. Use sheets for secondary content,
            navigation menus, or form panels that don't require full focus.
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

/**
 * AllStates demonstrates all sheet positions and configurations.
 *
 * **Anatomy:**
 * - Sheet (root) → SheetTrigger + SheetContent
 * - SheetContent → SheetHeader + content + SheetFooter
 * - SheetHeader → SheetTitle + SheetDescription
 *
 * **Positions:** right (default), left, top, bottom
 *
 * **Focus behavior:**
 * - Tab to navigate interactive elements
 * - ESC to close
 * - Focus trapped within sheet
 * - Focus returns to trigger on close
 */
export const AllStates: Story = {
  render: () => (
    <div className="space-y-8">
      {/* Anatomy Diagram */}
      <div className="rounded-md border border-default bg-page p-4">
        <h3 className="text-sm font-semibold mb-3">Sheet Anatomy</h3>
        <div className="flex items-start gap-8">
          <div className="flex-1 rounded-md border border-dashed border-default p-3 text-xs">
            <div className="text-muted mb-2">Sheet (root)</div>
            <div className="flex gap-2">
              <div className="rounded bg-accent/10 px-2 py-1">SheetTrigger</div>
              <div className="rounded bg-accent/10 px-2 py-1 flex-1">
                <div className="mb-1">SheetContent</div>
                <div className="ml-2 space-y-1 text-muted">
                  <div>├─ SheetOverlay</div>
                  <div>├─ SheetHeader</div>
                  <div>│  ├─ SheetTitle</div>
                  <div>│  └─ SheetDescription</div>
                  <div>├─ [content]</div>
                  <div>├─ SheetFooter</div>
                  <div>└─ SheetClose (X button)</div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <div className="text-xs font-medium mb-2">data-slot attributes:</div>
            <code className="text-xs text-muted block space-y-0.5">
              <div>sheet, sheet-trigger</div>
              <div>sheet-content, sheet-overlay</div>
              <div>sheet-header, sheet-footer</div>
              <div>sheet-title, sheet-description</div>
              <div>sheet-close</div>
            </code>
          </div>
        </div>
      </div>

      {/* Position Variants */}
      <div>
        <h3 className="text-sm font-semibold mb-3">Position Variants</h3>
        <div className="flex flex-wrap gap-3">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">Right (default)</Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Right Sheet</SheetTitle>
                <SheetDescription>Default position, slides from right edge.</SheetDescription>
              </SheetHeader>
              <div className="flex-1 px-4">
                <p className="text-sm text-muted">Common for settings panels, detail views, and forms.</p>
              </div>
            </SheetContent>
          </Sheet>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">Left</Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Navigation</SheetTitle>
                <SheetDescription>Browse through the menu options.</SheetDescription>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4">
                <a href="#" className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent/10">
                  <Home className="size-4" /> Home
                </a>
                <a href="#" className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent/10">
                  <Package className="size-4" /> Products
                </a>
                <a href="#" className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent/10">
                  <Info className="size-4" /> About
                </a>
                <a href="#" className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent/10">
                  <Phone className="size-4" /> Contact
                </a>
              </nav>
            </SheetContent>
          </Sheet>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">Top</Button>
            </SheetTrigger>
            <SheetContent side="top">
              <SheetHeader>
                <SheetTitle>Notifications</SheetTitle>
                <SheetDescription>You have 3 unread notifications.</SheetDescription>
              </SheetHeader>
              <div className="flex gap-4 px-4 pb-4">
                <div className="flex-1 rounded-md border border-default p-3">
                  <p className="text-sm font-medium">New message</p>
                  <p className="text-xs text-muted">2 minutes ago</p>
                </div>
                <div className="flex-1 rounded-md border border-default p-3">
                  <p className="text-sm font-medium">Task completed</p>
                  <p className="text-xs text-muted">1 hour ago</p>
                </div>
                <div className="flex-1 rounded-md border border-default p-3">
                  <p className="text-sm font-medium">System update</p>
                  <p className="text-xs text-muted">Yesterday</p>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">Bottom</Button>
            </SheetTrigger>
            <SheetContent side="bottom">
              <SheetHeader>
                <SheetTitle>Quick Actions</SheetTitle>
                <SheetDescription>Select an action to perform.</SheetDescription>
              </SheetHeader>
              <div className="flex justify-center gap-4 px-4 pb-4">
                <Button variant="outline" className="flex flex-col items-center justify-center h-20 w-20 gap-1">
                  <Camera className="size-5 shrink-0" />
                  <span className="text-xs">Camera</span>
                </Button>
                <Button variant="outline" className="flex flex-col items-center justify-center h-20 w-20 gap-1">
                  <Image className="size-5 shrink-0" />
                  <span className="text-xs">Gallery</span>
                </Button>
                <Button variant="outline" className="flex flex-col items-center justify-center h-20 w-20 gap-1">
                  <FileText className="size-5 shrink-0" />
                  <span className="text-xs">Files</span>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Focus Behavior Reference */}
      <div className="rounded-md border border-default bg-page p-4">
        <h3 className="text-sm font-semibold mb-2">Keyboard Navigation</h3>
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="font-mono bg-accent/10 px-1 rounded">Tab</span>
            <span className="text-muted ml-2">Navigate interactive elements</span>
          </div>
          <div>
            <span className="font-mono bg-accent/10 px-1 rounded">Shift+Tab</span>
            <span className="text-muted ml-2">Navigate backwards</span>
          </div>
          <div>
            <span className="font-mono bg-accent/10 px-1 rounded">Escape</span>
            <span className="text-muted ml-2">Close sheet</span>
          </div>
          <div>
            <span className="font-mono bg-accent/10 px-1 rounded">Enter/Space</span>
            <span className="text-muted ml-2">Activate button</span>
          </div>
        </div>
      </div>
    </div>
  ),
}

/**
 * Example sheet with a form for editing settings.
 * Demonstrates proper form layout within a sheet.
 */
export const WithForm: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button>
          <Settings className="mr-2 size-4" />
          Edit Settings
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 space-y-4 overflow-auto px-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              <User className="mr-1 inline size-3" />
              Display Name
            </Label>
            <Input id="name" defaultValue="John Doe" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">
              <Mail className="mr-1 inline size-3" />
              Email
            </Label>
            <Input id="email" type="email" defaultValue="john@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <textarea
              id="bio"
              className="min-h-[80px] w-full rounded-md border border-default bg-surface px-3 py-2 text-sm focus:ring-2 focus:ring-accent focus:outline-none"
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
