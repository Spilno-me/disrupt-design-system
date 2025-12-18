/**
 * Story Templates
 *
 * Copy-paste templates for creating new stories at each atomic level.
 * These templates ensure consistent structure across all stories.
 *
 * Usage:
 * 1. Copy the appropriate template
 * 2. Replace placeholders (ComponentName, description, variants, etc.)
 * 3. Remove stories you don't need
 *
 * Every story file should include:
 * - Default story (for Controls panel)
 * - AllStates story (comprehensive visual matrix)
 * - Specific variant stories as needed
 */

// =============================================================================
// ATOM TEMPLATE
// =============================================================================

/**
 * ATOM Story Template
 *
 * Use for: Button, Input, Label, Checkbox, Badge, Avatar, Icon
 *
 * Standard stories:
 * - Default: Basic instance with controls
 * - Variants: All visual variants in a row
 * - Sizes: All size options
 * - States: Disabled, loading, error states
 *
 * @example Copy this to create a new atom story:
 *
 * ```tsx
 * import type { StoryObj } from '@storybook/react'
 * import {
 *   createAtomMeta,
 *   StoryFlex,
 *   StorySection,
 *   STORY_SPACING,
 * } from '@/stories/_infrastructure'
 * import { ComponentName } from './component-name'
 *
 * const meta = createAtomMeta({
 *   title: 'Core/ComponentName',
 *   component: ComponentName,
 *   description: 'Brief description of what this atom does.',
 *   argTypes: {
 *     variant: {
 *       control: 'select',
 *       options: ['default', 'secondary', 'outline'],
 *       description: 'Visual style variant',
 *     },
 *     size: {
 *       control: 'select',
 *       options: ['sm', 'default', 'lg'],
 *       description: 'Size of the component',
 *     },
 *     disabled: {
 *       control: 'boolean',
 *       description: 'Whether the component is disabled',
 *     },
 *   },
 * })
 *
 * export default meta
 * type Story = StoryObj<typeof ComponentName>
 *
 * // Default with controls
 * export const Default: Story = {
 *   args: {
 *     children: 'Label Text',
 *     variant: 'default',
 *     size: 'default',
 *   },
 * }
 *
 * // All variants
 * export const Variants: Story = {
 *   render: () => (
 *     <StoryFlex>
 *       <ComponentName variant="default">Default</ComponentName>
 *       <ComponentName variant="secondary">Secondary</ComponentName>
 *       <ComponentName variant="outline">Outline</ComponentName>
 *     </StoryFlex>
 *   ),
 * }
 *
 * // All sizes
 * export const Sizes: Story = {
 *   render: () => (
 *     <StoryFlex align="center">
 *       <ComponentName size="sm">Small</ComponentName>
 *       <ComponentName size="default">Default</ComponentName>
 *       <ComponentName size="lg">Large</ComponentName>
 *     </StoryFlex>
 *   ),
 * }
 *
 * // Disabled state
 * export const Disabled: Story = {
 *   args: {
 *     children: 'Disabled',
 *     disabled: true,
 *   },
 * }
 * ```
 */
export const ATOM_TEMPLATE = `
// Copy the template above
` as const

// =============================================================================
// MOLECULE TEMPLATE
// =============================================================================

/**
 * MOLECULE Story Template
 *
 * Use for: Card, Dialog, Form, Accordion, ErrorState, Tooltip
 *
 * Standard stories:
 * - Default: Basic instance with controls
 * - Variants: All visual variants
 * - WithContent: Real-world content examples
 * - AllStates: Comprehensive visual matrix
 *
 * @example Copy this to create a new molecule story:
 *
 * ```tsx
 * import type { StoryObj } from '@storybook/react'
 * import {
 *   createMoleculeMeta,
 *   StorySection,
 *   StoryFlex,
 *   STORY_SPACING,
 * } from '@/stories/_infrastructure'
 * import {
 *   ComponentName,
 *   ComponentNameHeader,
 *   ComponentNameContent,
 * } from './component-name'
 *
 * const meta = createMoleculeMeta({
 *   title: 'Core/ComponentName',
 *   component: ComponentName,
 *   description: 'Brief description of what this molecule does and its sub-components.',
 *   argTypes: {
 *     variant: {
 *       control: 'select',
 *       options: ['default', 'outlined'],
 *       description: 'Visual style variant',
 *     },
 *   },
 * })
 *
 * export default meta
 * type Story = StoryObj<typeof ComponentName>
 *
 * // Default with controls
 * export const Default: Story = {
 *   args: {
 *     variant: 'default',
 *   },
 *   render: (args) => (
 *     <ComponentName {...args}>
 *       <ComponentNameHeader>Title</ComponentNameHeader>
 *       <ComponentNameContent>Content goes here</ComponentNameContent>
 *     </ComponentName>
 *   ),
 * }
 *
 * // All variants
 * export const Variants: Story = {
 *   render: () => (
 *     <div className="flex gap-6">
 *       <ComponentName variant="default">
 *         <ComponentNameHeader>Default</ComponentNameHeader>
 *         <ComponentNameContent>Default variant content</ComponentNameContent>
 *       </ComponentName>
 *       <ComponentName variant="outlined">
 *         <ComponentNameHeader>Outlined</ComponentNameHeader>
 *         <ComponentNameContent>Outlined variant content</ComponentNameContent>
 *       </ComponentName>
 *     </div>
 *   ),
 * }
 *
 * // All states
 * export const AllStates: Story = {
 *   render: () => (
 *     <div className={STORY_SPACING.sections}>
 *       <StorySection title="Variants">
 *         <div className="flex gap-6">
 *           <ComponentName variant="default">Default</ComponentName>
 *           <ComponentName variant="outlined">Outlined</ComponentName>
 *         </div>
 *       </StorySection>
 *
 *       <StorySection title="With Different Content">
 *         <ComponentName>
 *           <ComponentNameHeader>Real World Example</ComponentNameHeader>
 *           <ComponentNameContent>
 *             Realistic content that demonstrates typical usage.
 *           </ComponentNameContent>
 *         </ComponentName>
 *       </StorySection>
 *     </div>
 *   ),
 * }
 * ```
 */
export const MOLECULE_TEMPLATE = `
// Copy the template above
` as const

// =============================================================================
// ORGANISM TEMPLATE
// =============================================================================

/**
 * ORGANISM Story Template
 *
 * Use for: AppHeader, AppSidebar, DataTable, Navigation
 *
 * Standard stories:
 * - Default: Basic instance with controls
 * - Interactive: With click handlers demonstrating callbacks
 * - AllStates: Comprehensive visual matrix showing all configurations
 *
 * NOTE: Organisms typically use fullscreen layout and decorators for context.
 *
 * @example Copy this to create a new organism story:
 *
 * ```tsx
 * import type { StoryObj } from '@storybook/react'
 * import {
 *   createOrganismMeta,
 *   StorySection,
 *   StoryAnatomy,
 *   StoryInfoBox,
 *   withFullscreen,
 *   STORY_SPACING,
 * } from '@/stories/_infrastructure'
 * import { ComponentName } from './ComponentName'
 *
 * const meta = createOrganismMeta({
 *   title: 'Shared/Category/ComponentName',
 *   component: ComponentName,
 *   description: `
 * Application component description.
 *
 * ## Features
 * - Feature 1
 * - Feature 2
 *
 * ## Usage
 * \`\`\`tsx
 * <ComponentName prop1="value" onAction={() => {}} />
 * \`\`\`
 *   `,
 *   argTypes: {
 *     variant: {
 *       control: 'select',
 *       options: ['option1', 'option2'],
 *       description: 'Configuration option',
 *     },
 *   },
 *   decorators: [withFullscreen('200px')],
 * })
 *
 * export default meta
 * type Story = StoryObj<typeof ComponentName>
 *
 * // Sample data
 * const sampleData = {
 *   name: 'Sample User',
 *   email: 'user@example.com',
 * }
 *
 * // Default with controls
 * export const Default: Story = {
 *   args: {
 *     data: sampleData,
 *     variant: 'option1',
 *   },
 * }
 *
 * // Interactive demo
 * export const Interactive: Story = {
 *   render: () => (
 *     <div className="space-y-4">
 *       <ComponentName
 *         data={sampleData}
 *         onAction={(item) => alert(\`Action: \${item}\`)}
 *       />
 *       <p className="text-sm text-secondary px-4">
 *         Click elements to see callbacks in action.
 *       </p>
 *     </div>
 *   ),
 * }
 *
 * // All states
 * export const AllStates: Story = {
 *   render: () => (
 *     <div className={STORY_SPACING.sections}>
 *       <StoryAnatomy
 *         slots={[
 *           { name: 'container', description: 'Main container' },
 *           { name: 'header', description: 'Header section' },
 *           { name: 'content', description: 'Content area' },
 *         ]}
 *       />
 *
 *       <StorySection title="Variant Options">
 *         <div className="space-y-4">
 *           <div>
 *             <p className="text-xs font-medium text-secondary mb-2">Option 1</p>
 *             <ComponentName variant="option1" data={sampleData} />
 *           </div>
 *           <div>
 *             <p className="text-xs font-medium text-secondary mb-2">Option 2</p>
 *             <ComponentName variant="option2" data={sampleData} />
 *           </div>
 *         </div>
 *       </StorySection>
 *
 *       <StoryInfoBox>
 *         <strong>Keyboard Navigation:</strong>
 *         <ul className="mt-2 space-y-1">
 *           <li>Tab - Navigate between elements</li>
 *           <li>Enter/Space - Activate focused element</li>
 *           <li>Esc - Close menus/dialogs</li>
 *         </ul>
 *       </StoryInfoBox>
 *     </div>
 *   ),
 * }
 * ```
 */
export const ORGANISM_TEMPLATE = `
// Copy the template above
` as const

// =============================================================================
// TEMPLATE/PAGE TEMPLATE
// =============================================================================

/**
 * TEMPLATE/PAGE Story Template
 *
 * Use for: AppLayoutShell, AuthLayout, DashboardLayout, specific pages
 *
 * Standard stories:
 * - Default: Full page view
 * - WithNavigation: With navigation state
 * - MobileView: Responsive mobile version
 *
 * NOTE: Templates/Pages use fullscreen layout with no padding.
 *
 * @example Copy this to create a new template/page story:
 *
 * ```tsx
 * import type { StoryObj } from '@storybook/react'
 * import {
 *   createTemplateMeta, // or createPageMeta
 *   StorySection,
 *   STORY_SPACING,
 * } from '@/stories/_infrastructure'
 * import { LayoutComponent } from './LayoutComponent'
 *
 * const meta = createTemplateMeta({
 *   title: 'Templates/LayoutComponent',
 *   component: LayoutComponent,
 *   description: 'Page-level layout for [use case].',
 *   argTypes: {
 *     variant: {
 *       control: 'select',
 *       options: ['default', 'compact'],
 *     },
 *   },
 * })
 *
 * export default meta
 * type Story = StoryObj<typeof LayoutComponent>
 *
 * // Default full page
 * export const Default: Story = {
 *   args: {
 *     children: <div className="p-8">Page content goes here</div>,
 *   },
 * }
 *
 * // With sidebar navigation
 * export const WithSidebar: Story = {
 *   render: () => (
 *     <LayoutComponent
 *       sidebar={<nav>Sidebar content</nav>}
 *       header={<header>Header content</header>}
 *     >
 *       <main className="p-8">Main content area</main>
 *     </LayoutComponent>
 *   ),
 * }
 *
 * // Mobile responsive view
 * export const MobileView: Story = {
 *   parameters: {
 *     viewport: { defaultViewport: 'mobile1' },
 *   },
 *   render: () => (
 *     <LayoutComponent>
 *       <main className="p-4">Mobile optimized content</main>
 *     </LayoutComponent>
 *   ),
 * }
 * ```
 */
export const TEMPLATE_PAGE_TEMPLATE = `
// Copy the template above
` as const

// =============================================================================
// QUICK REFERENCE
// =============================================================================

/**
 * Quick Reference: Story Structure
 *
 * Every story file should follow this structure:
 *
 * 1. Imports
 *    - Storybook types
 *    - Infrastructure utilities
 *    - Component(s) being documented
 *
 * 2. Meta Configuration
 *    - Use appropriate createXxxMeta factory
 *    - Include description
 *    - Define argTypes for controls
 *
 * 3. Sample Data (if needed)
 *    - Define at module level
 *    - Use realistic values
 *
 * 4. Stories (in this order)
 *    - Default: For controls panel interaction
 *    - Variants: Visual comparison of all variants
 *    - Sizes: Size comparison (if applicable)
 *    - States: Disabled, loading, error (if applicable)
 *    - Interactive: With callbacks (for organisms)
 *    - AllStates: Comprehensive visual matrix
 *    - Specific: Use-case specific stories
 *
 * 5. Naming Conventions
 *    - PascalCase for story exports
 *    - Descriptive names: OnDarkBackground, WithIcon, FullWidth
 *    - Use `name` property for display names with spaces
 */
export const STORY_STRUCTURE_GUIDE = {
  imports: ['types', 'infrastructure', 'components'],
  meta: ['title', 'component', 'description', 'argTypes'],
  stories: ['Default', 'Variants', 'Sizes', 'States', 'Interactive', 'AllStates'],
} as const
