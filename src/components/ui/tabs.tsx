import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "../../lib/utils"

export interface TabsProps extends React.ComponentProps<typeof TabsPrimitive.Root> {}
export interface TabsListProps extends React.ComponentProps<typeof TabsPrimitive.List> {}
export interface TabsTriggerProps extends React.ComponentProps<typeof TabsPrimitive.Trigger> {}
export interface TabsContentProps extends React.ComponentProps<typeof TabsPrimitive.Content> {}

/**
 * Tabs component for organizing content into tabbed sections. Built on Radix UI Tabs primitive.
 *
 * **MOLECULE**: Compound component with multiple sub-components working together.
 *
 * **Features:**
 * - Keyboard navigation (Arrow Left/Right, Home/End)
 * - Automatic/manual activation modes
 * - Horizontal and vertical orientations
 * - Accessible by default (ARIA roles, keyboard support)
 * - Focus management with visible focus rings
 *
 * **Testing:**
 * - Each sub-component includes `data-slot` attribute for testing
 * - Consumer should provide `data-testid` for context-specific test IDs
 * - Test keyboard navigation, disabled states, and tab switching
 *
 * **Accessibility:**
 * - Uses ARIA `role="tablist"`, `role="tab"`, and `role="tabpanel"`
 * - Manages `aria-selected` and `aria-controls` automatically
 * - Supports keyboard navigation per ARIA authoring practices
 * - Focus visible on keyboard interaction (ring-accent)
 * - Disabled tabs have `aria-disabled` and `disabled` attributes
 *
 * @example
 * ```tsx
 * // Basic horizontal tabs
 * <Tabs defaultValue="account" data-testid="settings-tabs">
 *   <TabsList data-testid="settings-tabs-list">
 *     <TabsTrigger value="account" data-testid="tab-account">
 *       Account
 *     </TabsTrigger>
 *     <TabsTrigger value="password" data-testid="tab-password">
 *       Password
 *     </TabsTrigger>
 *   </TabsList>
 *   <TabsContent value="account" data-testid="content-account">
 *     <p>Account settings content</p>
 *   </TabsContent>
 *   <TabsContent value="password" data-testid="content-password">
 *     <p>Password settings content</p>
 *   </TabsContent>
 * </Tabs>
 *
 * // Vertical orientation
 * <Tabs defaultValue="general" orientation="vertical">
 *   <TabsList className="flex flex-col">
 *     <TabsTrigger value="general">General</TabsTrigger>
 *     <TabsTrigger value="security">Security</TabsTrigger>
 *   </TabsList>
 *   <TabsContent value="general">...</TabsContent>
 *   <TabsContent value="security">...</TabsContent>
 * </Tabs>
 *
 * // With disabled tab
 * <Tabs defaultValue="account">
 *   <TabsList>
 *     <TabsTrigger value="account">Account</TabsTrigger>
 *     <TabsTrigger value="billing" disabled>Billing</TabsTrigger>
 *   </TabsList>
 * </Tabs>
 * ```
 */
function Tabs({
  ...props
}: TabsProps) {
  return <TabsPrimitive.Root data-slot="tabs" {...props} />
}

Tabs.displayName = "Tabs"

/**
 * TabsList - Container for tab triggers.
 *
 * @example
 * ```tsx
 * <TabsList data-testid="tabs-list">
 *   <TabsTrigger value="tab1">Tab 1</TabsTrigger>
 *   <TabsTrigger value="tab2">Tab 2</TabsTrigger>
 * </TabsList>
 * ```
 */
function TabsList({
  className,
  ...props
}: TabsListProps) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-md bg-muted-bg p-1 text-secondary",
        className
      )}
      {...props}
    />
  )
}

TabsList.displayName = "TabsList"

/**
 * TabsTrigger - Clickable button that activates a tab.
 *
 * @example
 * ```tsx
 * <TabsTrigger value="account" data-testid="tab-account">
 *   Account
 * </TabsTrigger>
 * <TabsTrigger value="settings" disabled>
 *   Settings (Coming Soon)
 * </TabsTrigger>
 * ```
 */
function TabsTrigger({
  className,
  ...props
}: TabsTriggerProps) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-2 text-sm font-medium ring-offset-surface transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-surface data-[state=active]:text-primary data-[state=active]:shadow-sm",
        className
      )}
      {...props}
    />
  )
}

TabsTrigger.displayName = "TabsTrigger"

/**
 * TabsContent - Content panel associated with a tab trigger.
 *
 * @example
 * ```tsx
 * <TabsContent value="account" data-testid="content-account">
 *   <h3>Account Settings</h3>
 *   <p>Manage your account preferences.</p>
 * </TabsContent>
 * ```
 */
function TabsContent({
  className,
  ...props
}: TabsContentProps) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn(
        "mt-2 ring-offset-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
        className
      )}
      {...props}
    />
  )
}

TabsContent.displayName = "TabsContent"

export { Tabs, TabsList, TabsTrigger, TabsContent }
