/**
 * Device Frames Stories
 *
 * Documentation and examples for mobile story patterns using device frames.
 *
 * ## CRITICAL: Mobile Story Pattern
 *
 * When creating mobile stories, ALWAYS use the `storyId` prop to embed stories
 * in device frames. This ensures fixed-position elements (FABs, modals, toasts)
 * are contained within the device frame.
 *
 * @see .claude/storybook-rules.md for full documentation
 */

import type { Meta, StoryObj } from '@storybook/react'
import * as React from 'react'
import {
  IPhoneFrame,
  IPhoneMobileFrame,
  IPadFrame,
  IPadMobileFrame,
  IPHONE_SPECS,
  IPAD_SPECS,
  type IPhoneModel,
  type IPadModel,
} from './device-frames'

// =============================================================================
// DEMO CONTENT
// =============================================================================

const DemoContent = ({ label = 'Content' }: { label?: string }) => (
  <div className="flex-1 flex items-center justify-center p-4 bg-neutral-100">
    <div className="text-center space-y-2">
      <div className="w-12 h-12 mx-auto rounded-xl bg-teal-500/20 flex items-center justify-center">
        <span className="text-2xl">📱</span>
      </div>
      <p className="text-sm font-medium text-neutral-900">{label}</p>
      <p className="text-xs text-neutral-500">Your content goes here</p>
    </div>
  </div>
)

// =============================================================================
// META
// =============================================================================

const meta: Meta<typeof IPhoneFrame> = {
  title: 'Infrastructure/Device Frames',
  component: IPhoneFrame,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `# Device Frames for Mobile Stories

## CRITICAL: Mobile Story Pattern

When creating mobile stories, **ALWAYS use the \`storyId\` prop** to embed stories in device frames.

### Why storyId is Required

| Mode | Fixed Elements | Why |
|------|----------------|-----|
| \`storyId\` (iframe) | ✅ Contained | Iframe = separate document |
| \`children\` (direct) | ❌ Escape | \`position: fixed\` ignores parents |

### Template

\`\`\`tsx
export const Mobile: Story = {
  parameters: { layout: 'centered' },
  render: () => (
    <div className="min-h-screen bg-neutral-200 flex items-center justify-center p-8">
      <IPhoneMobileFrame
        model="iphone16promax"
        storyId="category-component--default"
        scale={0.7}
      />
    </div>
  ),
}
\`\`\`

### storyId Format

\`kebab-case-title--kebab-case-story-name\`

| Story Title | Story Name | storyId |
|-------------|------------|---------|
| \`Shared/AIAssistant\` | \`Default\` | \`shared-aiassistant--default\` |
| \`Flow/Dashboard\` | \`IncidentsPage\` | \`flow-dashboard--incidents-page\` |

@see \`.claude/storybook-rules.md\` for full documentation`,
      },
    },
  },
}

export default meta

// =============================================================================
// SHOWCASE
// =============================================================================

const iPhoneModels: IPhoneModel[] = ['iphone16pro', 'iphone16promax', 'iphone17promax']
const iPadModels: IPadModel[] = ['ipadMini', 'ipad', 'ipadPro11']

/**
 * Device frames for previewing mobile components.
 * iPhones shown in portrait, iPads in landscape.
 */
export const Showcase: StoryObj = {
  render: () => (
    <div className="min-h-screen bg-neutral-200 p-8 space-y-16">
      {/* iPhone Section */}
      <section>
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">iPhone Models</h2>
        <p className="text-neutral-500 mb-8">iPhone 16 & 17 series</p>
        <div className="flex flex-wrap items-end gap-6">
          {iPhoneModels.map((model) => (
            <div key={model} className="text-center">
              <IPhoneFrame model={model} scale={0.45}>
                <DemoContent label={IPHONE_SPECS[model].name.split('/')[0]} />
              </IPhoneFrame>
              <p className="mt-3 text-sm font-medium text-neutral-900">
                {IPHONE_SPECS[model].name.split('/')[0]}
              </p>
              <p className="text-xs text-neutral-500">
                {IPHONE_SPECS[model].width}×{IPHONE_SPECS[model].height}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* iPad Section */}
      <section>
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">iPad Models</h2>
        <p className="text-neutral-500 mb-8">Landscape orientation</p>
        <div className="flex flex-wrap items-start gap-8">
          {iPadModels.map((model) => (
            <div key={model} className="text-center">
              <IPadFrame model={model} scale={0.28}>
                <DemoContent label={IPAD_SPECS[model].name} />
              </IPadFrame>
              <p className="mt-3 text-sm font-medium text-neutral-900">
                {IPAD_SPECS[model].name}
              </p>
              <p className="text-xs text-neutral-500">
                {IPAD_SPECS[model].height}×{IPAD_SPECS[model].width}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  ),
}

// =============================================================================
// DEVICE SWITCHER - INTERACTIVE DEMO
// =============================================================================

/**
 * Interactive device switcher component
 * Allows switching between iPhone and iPad, with orientation toggle for iPad
 */
const DeviceSwitcherDemo = () => {
  const [device, setDevice] = React.useState<'iphone' | 'ipad'>('iphone')
  const [orientation, setOrientation] = React.useState<'portrait' | 'landscape'>('landscape')

  const getScale = () => {
    if (device === 'iphone') return 0.95
    return orientation === 'portrait' ? 0.65 : 0.75
  }

  const getDimensions = () => {
    if (device === 'iphone') return '440×956'
    return orientation === 'portrait' ? '834×1194' : '1194×834'
  }

  return (
    <div className="min-h-screen bg-neutral-200 flex flex-col items-center justify-center p-4 gap-6">
      {/* Device & Orientation Controls */}
      <div className="flex items-center gap-4">
        {/* Device Toggle */}
        <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-md">
          <button
            onClick={() => setDevice('iphone')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
              device === 'iphone'
                ? 'bg-neutral-900 text-white'
                : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17 2H7c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 18H7V4h10v16zm-5-1c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1z"/>
            </svg>
            iPhone
          </button>
          <button
            onClick={() => setDevice('ipad')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
              device === 'ipad'
                ? 'bg-neutral-900 text-white'
                : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-7-2c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1z"/>
            </svg>
            iPad
          </button>
        </div>

        {/* Orientation Toggle (iPad only) */}
        {device === 'ipad' && (
          <div className="flex items-center gap-2 bg-white rounded-full px-3 py-2 shadow-md">
            <button
              onClick={() => setOrientation('portrait')}
              className={`p-2 rounded-full transition-all ${
                orientation === 'portrait'
                  ? 'bg-neutral-900 text-white'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
              title="Portrait"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17 1H7c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zm0 18H7V5h10v14z"/>
              </svg>
            </button>
            <button
              onClick={() => setOrientation('landscape')}
              className={`p-2 rounded-full transition-all ${
                orientation === 'landscape'
                  ? 'bg-neutral-900 text-white'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
              title="Landscape"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M1 7h18c1.1 0 2 .9 2 2v10c0 1.1-.9 2-2 2H1c-1.1 0-2-.9-2-2V9c0-1.1.9-2 2-2zm0 12h18V9H1v10z" transform="translate(2, -2)"/>
              </svg>
            </button>
            <div className="w-px h-6 bg-neutral-200" />
            <button
              onClick={() => setOrientation(o => o === 'portrait' ? 'landscape' : 'portrait')}
              className="p-2 rounded-full hover:bg-neutral-100 transition-colors text-neutral-600"
              title="Rotate"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Device Frame */}
      {device === 'iphone' ? (
        <IPhoneMobileFrame
          model="iphone16promax"
          storyId="shared-aiassistant--default"
          scale={getScale()}
        />
      ) : (
        <IPadMobileFrame
          model="ipadPro11"
          orientation={orientation}
          storyId="shared-aiassistant--default"
          scale={getScale()}
        />
      )}

      {/* Device Info */}
      <div className="text-center">
        <p className="text-sm font-medium text-neutral-700">
          {device === 'iphone' ? 'iPhone 16 Pro Max' : `iPad Pro 11" (${orientation})`}
        </p>
        <p className="text-xs text-neutral-500">{getDimensions()}</p>
      </div>
    </div>
  )
}

/**
 * Device Switcher - Interactive Demo
 *
 * Switch between iPhone and iPad devices.
 * For iPad, toggle between portrait and landscape orientations.
 */
export const DeviceSwitcher: StoryObj = {
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        story: `## Interactive Device Switcher

Switch between **iPhone** and **iPad** devices to preview your story.

For iPad, toggle between **portrait** and **landscape** orientations.

### Code Examples

**iPhone:**
\`\`\`tsx
<IPhoneMobileFrame
  model="iphone16promax"
  storyId="shared-aiassistant--default"
  scale={0.95}
/>
\`\`\`

**iPad:**
\`\`\`tsx
<IPadMobileFrame
  model="ipadPro11"
  orientation="landscape"  // or "portrait"
  storyId="shared-aiassistant--default"
  scale={0.75}  // 0.65 for portrait
/>
\`\`\``,
      },
    },
  },
  render: () => <DeviceSwitcherDemo />,
}

// =============================================================================
// MOBILE STORY PATTERN - RECOMMENDED
// =============================================================================

/**
 * Mobile Story Pattern - Using storyId (RECOMMENDED)
 *
 * This is the **correct way** to create mobile stories.
 * The `storyId` prop embeds another story in an iframe,
 * which naturally contains fixed-position elements.
 *
 * ## How to Use
 *
 * 1. Create your base story (e.g., `Default`)
 * 2. Create a `Mobile` story that embeds it using `storyId`
 * 3. Use the format: `kebab-case-title--kebab-case-story-name`
 *
 * ## Example
 *
 * This story embeds the AIAssistant Default story which has
 * a fixed-position FAB. Notice how it stays inside the device frame.
 */
export const MobileStoryPattern: StoryObj = {
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        story: `## Recommended Mobile Story Pattern

This demonstrates the **correct way** to create mobile stories using \`storyId\`.

The embedded story (\`shared-aiassistant--default\`) contains a fixed-position FAB
that stays properly contained within the device frame because it's rendered in an iframe.

### Code Example

\`\`\`tsx
export const Mobile: Story = {
  parameters: { layout: 'centered' },
  render: () => (
    <div className="min-h-screen bg-neutral-200 flex items-center justify-center p-4">
      <IPhoneMobileFrame
        model="iphone16promax"
        storyId="shared-aiassistant--default"
        scale={0.95}
      />
    </div>
  ),
}
\`\`\``,
      },
    },
  },
  render: () => (
    <div className="min-h-screen bg-neutral-200 flex items-center justify-center p-4">
      <IPhoneMobileFrame
        model="iphone16promax"
        storyId="shared-aiassistant--default"
        scale={0.95}
      />
    </div>
  ),
}

// =============================================================================
// MOBILE STORY WITH SAFARI BROWSER CHROME
// =============================================================================

/**
 * Mobile Story with Safari Browser Chrome
 *
 * For PWA or mobile web apps, use `showBrowser` to display
 * Safari iOS browser chrome (address bar + bottom toolbar).
 *
 * This provides a realistic preview of how your app appears
 * in Safari on iOS with all the browser UI elements.
 */
export const MobileWithSafariBrowser: StoryObj = {
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        story: `## Safari Browser Chrome

Use \`showBrowser\` and \`browserUrl\` for PWA/mobile web stories.

Shows realistic Safari iOS 18 chrome:
- Status bar with Dynamic Island
- Compact address bar with lock icon
- Bottom toolbar (back, forward, share, bookmarks, tabs)
- Home indicator

### Code Example

\`\`\`tsx
<IPhoneMobileFrame
  model="iphone16promax"
  storyId="flow-dashboard--incidents-page"
  scale={0.95}
  showBrowser
  browserUrl="flow.disrupt.app"
/>
\`\`\``,
      },
    },
  },
  render: () => (
    <div className="min-h-screen bg-neutral-200 flex items-center justify-center p-4">
      <IPhoneMobileFrame
        model="iphone16promax"
        storyId="shared-aiassistant--default"
        scale={0.95}
        showBrowser
        browserUrl="app.disrupt.io/assistant"
      />
    </div>
  ),
}

// =============================================================================
// COMPARISON: storyId vs children
// =============================================================================

/**
 * Comparison: storyId vs children
 *
 * This story demonstrates WHY we use `storyId` instead of `children`.
 *
 * The left device uses `children` - notice how fixed-position elements
 * would escape to the viewport (not shown here as it would break the story).
 *
 * The right device uses `storyId` - fixed elements stay contained.
 */
export const ComparisonStoryIdVsChildren: StoryObj = {
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        story: `## Comparison: storyId vs children

### Why storyId?

| Approach | Fixed Positioning | Use Case |
|----------|-------------------|----------|
| \`storyId\` | ✅ Contained in frame | Components with FABs, modals, toasts |
| \`children\` | ❌ Escapes to viewport | Simple content without fixed elements |

### Technical Reason

- **\`storyId\`**: Renders in an \`<iframe>\`, which is a separate document context
- **\`children\`**: Direct render in the same document; \`position: fixed\` is relative to viewport

### When to Use children

Only use \`children\` for quick visual previews of components that:
- Have NO fixed-position elements
- Don't need CSS media queries to work
- Are purely visual mockups`,
      },
    },
  },
  render: () => (
    <div className="min-h-screen bg-neutral-200 flex items-center justify-center gap-12 p-4">
      {/* Children approach - for simple content only */}
      <div className="text-center">
        <IPhoneFrame model="iphone16promax" scale={0.55}>
          <div className="h-full bg-surface flex flex-col">
            <div className="p-4 border-b border-default">
              <h2 className="font-semibold text-primary">children prop</h2>
              <p className="text-xs text-secondary">Direct render</p>
            </div>
            <div className="flex-1 flex items-center justify-center p-4">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 mx-auto rounded-xl bg-amber-500/20 flex items-center justify-center">
                  <span className="text-2xl">⚠️</span>
                </div>
                <p className="text-sm text-secondary">
                  Fixed elements escape!
                </p>
                <p className="text-xs text-tertiary">
                  Use only for simple content
                </p>
              </div>
            </div>
          </div>
        </IPhoneFrame>
        <p className="mt-4 text-sm font-medium text-neutral-700">children (⚠️ Limited)</p>
        <p className="text-xs text-neutral-500">No fixed positioning</p>
      </div>

      {/* storyId approach - recommended */}
      <div className="text-center">
        <IPhoneMobileFrame
          model="iphone16promax"
          storyId="shared-aiassistant--default"
          scale={0.55}
        />
        <p className="mt-4 text-sm font-medium text-neutral-700">storyId (✅ Recommended)</p>
        <p className="text-xs text-neutral-500">Fixed elements contained</p>
      </div>
    </div>
  ),
}

// =============================================================================
// AVAILABLE IPHONE MODELS
// =============================================================================

/**
 * Available iPhone Models
 *
 * Reference for all available iPhone models and their dimensions.
 * Use `iphone16promax` as the default for most mobile stories.
 */
export const AvailableModels: StoryObj = {
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        story: `## Available iPhone Models

| Model | Dimensions | Best For |
|-------|------------|----------|
| \`iphone16promax\` | 440×956 | **Default** - largest display |
| \`iphone16pro\` | 402×874 | Standard Pro |
| \`iphone16\` | 393×852 | Standard |
| \`iphone15promax\` | 430×932 | Previous gen large |
| \`iphone6\` | 375×667 | Compact/legacy |

### Recommendation

Use \`iphone16promax\` for most stories - it's the largest and most common
device for testing mobile layouts.`,
      },
    },
  },
  render: () => {
    const models: { model: IPhoneModel; recommended?: boolean }[] = [
      { model: 'iphone6' },
      { model: 'iphone16' },
      { model: 'iphone16pro' },
      { model: 'iphone16promax', recommended: true },
    ]

    return (
      <div className="min-h-screen bg-neutral-200 p-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">iPhone Models for Mobile Stories</h2>
          <p className="text-neutral-600 mb-8">
            Use <code className="bg-neutral-300 px-1.5 py-0.5 rounded text-sm">iphone16promax</code> as the default
          </p>

          <div className="flex flex-wrap items-end justify-center gap-8">
            {models.map(({ model, recommended }) => (
              <div key={model} className="text-center">
                <IPhoneFrame model={model} scale={0.35}>
                  <DemoContent label={IPHONE_SPECS[model].name.split('/')[0]} />
                </IPhoneFrame>
                <div className="mt-3">
                  <p className="text-sm font-medium text-neutral-900">
                    {model}
                    {recommended && (
                      <span className="ml-2 text-xs bg-teal-500 text-white px-1.5 py-0.5 rounded">
                        Default
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {IPHONE_SPECS[model].width}×{IPHONE_SPECS[model].height}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  },
}

// =============================================================================
// IPAD STORY PATTERN - RECOMMENDED
// =============================================================================

/**
 * iPad Story Pattern - Using storyId (RECOMMENDED)
 *
 * Same pattern as iPhone but for tablet views.
 * Use `IPadMobileFrame` with `storyId` to embed stories in an iPad frame.
 */
export const TabletStoryPattern: StoryObj = {
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        story: `## Recommended iPad Story Pattern

Use \`IPadMobileFrame\` for tablet stories. Same pattern as iPhone:
- Use \`storyId\` to embed stories (not \`children\`)
- Fixed-position elements stay contained in the iframe

### Code Example

\`\`\`tsx
export const Tablet: Story = {
  parameters: { layout: 'centered' },
  render: () => (
    <div className="min-h-screen bg-neutral-200 flex items-center justify-center p-4">
      <IPadMobileFrame
        model="ipadPro11"
        storyId="flow-dashboard--default"
        scale={0.75}
      />
    </div>
  ),
}
\`\`\``,
      },
    },
  },
  render: () => (
    <div className="min-h-screen bg-neutral-200 flex items-center justify-center p-4">
      <IPadMobileFrame
        model="ipadPro11"
        storyId="shared-aiassistant--default"
        scale={0.75}
      />
    </div>
  ),
}

// =============================================================================
// IPAD WITH SAFARI BROWSER
// =============================================================================

/**
 * iPad with Safari Browser Chrome
 *
 * Shows iPadOS Safari browser chrome for PWA/web app previews.
 */
export const TabletWithSafariBrowser: StoryObj = {
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        story: `## iPad with Safari Browser

Use \`showBrowser\` for PWA/mobile web stories on iPad.

### Code Example

\`\`\`tsx
<IPadMobileFrame
  model="ipadPro11"
  storyId="flow-dashboard--default"
  scale={0.75}
  showBrowser
  browserUrl="flow.disrupt.app"
/>
\`\`\``,
      },
    },
  },
  render: () => (
    <div className="min-h-screen bg-neutral-200 flex items-center justify-center p-4">
      <IPadMobileFrame
        model="ipadPro11"
        storyId="shared-aiassistant--default"
        scale={0.75}
        showBrowser
        browserUrl="flow.disrupt.app/dashboard"
      />
    </div>
  ),
}

// =============================================================================
// AVAILABLE IPAD MODELS
// =============================================================================

/**
 * Available iPad Models
 *
 * Reference for all available iPad models and their dimensions.
 * Use `ipadPro11` as the default for most tablet stories.
 */
export const AvailableIPadModels: StoryObj = {
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        story: `## Available iPad Models

| Model | Dimensions | Best For |
|-------|------------|----------|
| \`ipadPro12\` | 1024×1366 | Large displays, detailed dashboards |
| \`ipadPro11\` | 834×1194 | **Default** - standard Pro size |
| \`ipadAir\` | 820×1180 | Modern Air/10th gen |
| \`ipad\` | 768×1024 | Standard/legacy testing |
| \`ipadMini\` | 744×1133 | Compact tablet |

### Recommendation

Use \`ipadPro11\` for most stories - it's the most common iPad Pro size.`,
      },
    },
  },
  render: () => {
    const models: { model: IPadModel; recommended?: boolean }[] = [
      { model: 'ipadMini' },
      { model: 'ipad' },
      { model: 'ipadAir' },
      { model: 'ipadPro11', recommended: true },
    ]

    return (
      <div className="min-h-screen bg-neutral-200 p-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">iPad Models for Tablet Stories</h2>
          <p className="text-neutral-600 mb-8">
            Use <code className="bg-neutral-300 px-1.5 py-0.5 rounded text-sm">ipadPro11</code> as the default
          </p>

          <div className="flex flex-wrap items-end justify-center gap-8">
            {models.map(({ model, recommended }) => (
              <div key={model} className="text-center">
                <IPadFrame model={model} orientation="landscape" scale={0.22}>
                  <DemoContent label={IPAD_SPECS[model].name} />
                </IPadFrame>
                <div className="mt-3">
                  <p className="text-sm font-medium text-neutral-900">
                    {model}
                    {recommended && (
                      <span className="ml-2 text-xs bg-teal-500 text-white px-1.5 py-0.5 rounded">
                        Default
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {IPAD_SPECS[model].width}×{IPAD_SPECS[model].height}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  },
}
