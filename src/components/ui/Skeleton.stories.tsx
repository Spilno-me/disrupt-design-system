import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton, SkeletonImage, SkeletonText } from './Skeleton';

const meta = {
  title: 'Core/Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Skeleton loading placeholder component for maintaining layout while content loads.

## When to Use Skeleton

**✅ Use Skeleton when:**
- Loading initial page/component content (page first load, navigation)
- You know the layout structure ahead of time
- Replacing skeleton with actual content (cards, lists, tables, forms)
- Preventing layout shift (maintains space while loading)
- Loading multiple items in a list or grid
- Content will appear in place of skeleton

**❌ Use Loading Indicator (spinner) instead when:**
- Performing actions/operations (submitting form, deleting item, saving changes)
- Indeterminate time operations (processing, calculating)
- Background processes (file upload, data sync)
- Small sections where skeleton would be excessive
- Full-page loading overlay
- You don't know the content structure

**Example Decision:**
- ✅ Loading LeadsPage table → Use TableRowPattern skeleton
- ❌ Submitting login form → Use button loading state (spinner)
- ✅ Loading lead details → Use CardPattern skeleton
- ❌ Deleting a lead → Use loading indicator
- ✅ Loading search results → Use ListItemPattern skeleton
- ❌ Filtering/sorting table → Use loading indicator

## Building Blocks

Skeleton provides 3 primitives to compose loading states:

- **\`<Skeleton />\`** - Base primitive for single elements (buttons, text lines, images)
- **\`<SkeletonText lines={3} />\`** - Multiple text lines with natural width variation
- **\`<SkeletonImage aspectRatio="16/9" />\`** - Image placeholder with aspect ratio

## Recommended Patterns

Use these established patterns for consistency:

### 1. **CardPattern** - Profile cards, product cards, dashboard widgets

**[→ View CardPattern Example](?path=/story/core-skeleton--card-pattern)**

\`\`\`tsx
<Skeleton className="size-12" rounded="full" />  {/* Avatar */}
<Skeleton className="w-3/4 h-[20px]" />         {/* Title */}
<Skeleton className="w-1/2 h-[16px]" />         {/* Subtitle */}
<SkeletonText lines={3} />                       {/* Description */}
<Skeleton className="w-full h-[40px]" />        {/* Action button */}
\`\`\`

### 2. **ListItemPattern** - Feeds, notifications, search results

**[→ View ListItemPattern Example](?path=/story/core-skeleton--list-item-pattern)**

\`\`\`tsx
<Skeleton className="size-10" rounded="full" />  {/* Icon/Avatar */}
<Skeleton className="w-3/4 h-[16px]" />         {/* Title */}
<Skeleton className="w-1/2 h-[14px]" />         {/* Subtitle */}
\`\`\`

### 3. **TableRowPattern** - DataTables, reports, lists with columns

**[→ View TableRowPattern Example](?path=/story/core-skeleton--table-row-pattern)**

\`\`\`tsx
<Skeleton className="w-32 h-[16px]" />  {/* Column 1 */}
<Skeleton className="w-20 h-[16px]" />  {/* Column 2 */}
<Skeleton className="w-24 h-[16px]" />  {/* Column 3 */}
\`\`\`

### 4. **FormFieldPattern** - Form loading states (label + input pairs)

**[→ View FormFieldPattern Example](?path=/story/core-skeleton--form-field-pattern)**

\`\`\`tsx
<Skeleton className="w-20 h-[14px]" />          {/* Label */}
<Skeleton className="w-full h-[40px]" />        {/* Input */}
\`\`\`

## Creating Custom Patterns

You can create custom skeleton layouts by combining the building blocks.

### When to create custom patterns:
- ✅ Unique layout not covered by recommended patterns
- ✅ Domain-specific components (InvoiceCard, LeadCard)
- ✅ Complex multi-section layouts
- ✅ Specific aspect ratios or sizing requirements

### When to use recommended patterns:
- ✅ Standard cards, lists, or tables
- ✅ Common UI patterns
- ✅ Matching existing component layouts

### Rules for custom patterns:
1. **Match real component layout** - Skeleton should mirror actual content structure
2. **Use consistent sizing**:
   - Avatars: \`size-10\` (small) or \`size-12\` (default)
   - Text lines: \`h-[16px]\` (body) or \`h-[20px]\` (title)
   - Buttons: \`h-[40px]\` (default button height)
3. **Use established spacing**: \`gap-3\`, \`gap-4\`, \`space-y-2\`, \`space-y-3\`
4. **Use SkeletonText for paragraphs** - Don't manually create multiple Skeleton lines
5. **Use semantic rounded values**: \`rounded-full\` (avatars), \`rounded-lg\` (default), \`rounded-sm\` (buttons/inputs)

### Example - Custom Invoice Card Skeleton:

**[→ View Custom Pattern Example](?path=/story/core-skeleton--custom-pattern-example)** - See visual example of custom Invoice Card skeleton pattern.

\`\`\`tsx
<div className="border border-default rounded-lg p-4 space-y-4">
  <div className="flex justify-between items-center">
    <Skeleton className="w-32 h-[20px]" />      {/* Invoice number */}
    <Skeleton className="w-20 h-[24px]" />      {/* Status badge */}
  </div>
  <div className="space-y-2">
    <Skeleton className="w-full h-[16px]" />    {/* Client name */}
    <Skeleton className="w-3/4 h-[14px]" />     {/* Date */}
  </div>
  <Skeleton className="w-24 h-[24px]" />        {/* Amount */}
</div>
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof Skeleton>;

// Default Skeleton (for Controls panel)
export const Default: Story = {
  render: () => <Skeleton className="w-[200px] h-[20px]" />,
};

// Card Skeleton Pattern (most common usage)
export const CardPattern: Story = {
  render: () => (
    <div className="w-[350px] bg-surface border border-default rounded-lg p-6">
      <div className="flex items-center gap-4 mb-4">
        <Skeleton className="size-12 shrink-0" rounded="full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="w-3/4 h-[20px]" />
          <Skeleton className="w-1/2 h-[16px]" />
        </div>
      </div>
      <SkeletonText lines={3} />
      <Skeleton className="w-full h-[40px] mt-4" rounded="sm" />
    </div>
  ),
};

// List Item Skeleton Pattern (feeds, search results)
export const ListItemPattern: Story = {
  render: () => (
    <div className="w-[400px] space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="size-10 shrink-0" rounded="full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="w-3/4 h-[16px]" />
            <Skeleton className="w-1/2 h-[14px]" />
          </div>
        </div>
      ))}
    </div>
  ),
};

// Table Row Skeleton Pattern (data tables)
export const TableRowPattern: Story = {
  render: () => (
    <div className="w-full max-w-[600px]">
      <table className="w-full">
        <thead>
          <tr className="border-b border-default">
            <th className="text-left py-2 px-3 text-sm font-medium">Name</th>
            <th className="text-left py-2 px-3 text-sm font-medium">Status</th>
            <th className="text-left py-2 px-3 text-sm font-medium">Amount</th>
            <th className="text-left py-2 px-3 text-sm font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {[1, 2, 3].map((i) => (
            <tr key={i} className="border-b border-subtle">
              <td className="py-3 px-3"><Skeleton className="w-32 h-[16px]" /></td>
              <td className="py-3 px-3"><Skeleton className="w-20 h-[16px]" /></td>
              <td className="py-3 px-3"><Skeleton className="w-24 h-[16px]" /></td>
              <td className="py-3 px-3"><Skeleton className="w-16 h-[16px]" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
};

// Form Field Pattern (form loading state)
export const FormFieldPattern: Story = {
  render: () => (
    <div className="w-[400px] space-y-6">
      <div className="space-y-2">
        <Skeleton className="w-20 h-[14px]" />
        <Skeleton className="w-full h-[40px]" rounded="sm" />
      </div>
      <div className="space-y-2">
        <Skeleton className="w-24 h-[14px]" />
        <Skeleton className="w-full h-[40px]" rounded="sm" />
      </div>
      <div className="space-y-2">
        <Skeleton className="w-32 h-[14px]" />
        <Skeleton className="w-full h-[40px]" rounded="sm" />
      </div>
      <div className="flex justify-end mt-4">
        <Skeleton className="w-24 h-[40px]" rounded="sm" />
      </div>
    </div>
  ),
};

// Custom Pattern Example - Invoice Card
export const CustomPatternExample: Story = {
  render: () => (
    <div className="border border-default rounded-lg p-4 space-y-4 w-[350px] bg-surface">
      <div className="flex justify-between items-center">
        <Skeleton className="w-32 h-[20px]" />
        <Skeleton className="w-20 h-[24px]" />
      </div>
      <div className="space-y-2">
        <Skeleton className="w-full h-[16px]" />
        <Skeleton className="w-3/4 h-[14px]" />
      </div>
      <Skeleton className="w-24 h-[24px]" />
    </div>
  ),
};

// All States (Visual Matrix - No interaction needed)
export const AllStates: Story = {
  render: () => (
    <div className="w-[600px] space-y-6 p-6">
      <div>
        <h4 className="text-sm font-semibold text-primary mb-4">Default (Shimmer Animation)</h4>
        <Skeleton className="w-full h-[60px]" />
      </div>

      <div>
        <h4 className="text-sm font-semibold text-primary mb-4">Rounded Variants</h4>
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <span className="text-sm text-secondary w-24">SM:</span>
            <Skeleton className="flex-1 h-[20px]" rounded="sm" />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-secondary w-24">MD:</span>
            <Skeleton className="flex-1 h-[40px]" rounded="md" />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-secondary w-24">LG (default):</span>
            <Skeleton className="flex-1 h-[60px]" rounded="lg" />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-secondary w-24">Full (avatar):</span>
            <Skeleton className="size-16" rounded="full" />
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-primary mb-4">SkeletonImage (Aspect Ratios)</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-secondary mb-2">Square</p>
            <SkeletonImage aspectRatio="square" className="w-32" />
          </div>
          <div>
            <p className="text-xs text-secondary mb-2">4/3</p>
            <SkeletonImage aspectRatio="4/3" className="w-32" />
          </div>
          <div>
            <p className="text-xs text-secondary mb-2">16/9</p>
            <SkeletonImage aspectRatio="16/9" className="w-48" />
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-primary mb-4">SkeletonText (Line Counts)</h4>
        <div className="space-y-4">
          <div>
            <p className="text-xs text-secondary mb-2">2 lines</p>
            <SkeletonText lines={2} />
          </div>
          <div>
            <p className="text-xs text-secondary mb-2">4 lines</p>
            <SkeletonText lines={4} />
          </div>
        </div>
      </div>
    </div>
  ),
};

