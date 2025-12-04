import type { Meta, StoryObj } from '@storybook/react';
import { GLASS_EFFECTS, COLORS } from '../../constants/designTokens';

const meta = {
  title: 'Design Tokens/Glassmorphism',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Glassmorphism (frosted glass) effects for creating modern, translucent UI surfaces with backdrop blur.',
      },
    },
    backgrounds: {
      default: 'gradient',
      values: [
        {
          name: 'gradient',
          value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        },
        {
          name: 'cream',
          value: COLORS.background,
        },
        {
          name: 'dark',
          value: COLORS.primary,
        },
      ],
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// Glass Surface Presets
const GlassSurfacePresets = () => (
  <div>
    <h2 style={{ marginBottom: '24px', fontSize: '24px', fontWeight: '700', color: '#FFFFFF' }}>
      Glass Surface Presets
    </h2>
    <p style={{ fontSize: '16px', color: '#FFFFFF', marginBottom: '32px', maxWidth: '600px', opacity: 0.9 }}>
      Pre-configured glassmorphism surfaces with backdrop blur, transparency, and borders.
    </p>

    {/* Light Glass */}
    <div style={{ marginBottom: '32px' }}>
      <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#FFFFFF' }}>
        Light Surface
      </h3>
      <div
        style={{
          background: GLASS_EFFECTS.surface.light.background,
          backdropFilter: `blur(${GLASS_EFFECTS.surface.light.backdropBlur})`,
          WebkitBackdropFilter: `blur(${GLASS_EFFECTS.surface.light.backdropBlur})`,
          border: `1px solid ${GLASS_EFFECTS.surface.light.border}`,
          boxShadow: GLASS_EFFECTS.surface.light.shadow,
          borderRadius: '12px',
          padding: '24px',
          maxWidth: '400px',
        }}
      >
        <h4 style={{ fontSize: '18px', fontWeight: '600', color: COLORS.text.primary, marginBottom: '8px' }}>
          Light Glass Surface
        </h4>
        <p style={{ fontSize: '14px', color: COLORS.text.secondary, lineHeight: '1.6', marginBottom: '16px' }}>
          Subtle transparency with 10px blur. Perfect for headers and overlays that need minimal visual weight.
        </p>
        <div style={{
          fontSize: '12px',
          fontFamily: 'monospace',
          color: COLORS.text.secondary,
          background: 'rgba(255,255,255,0.5)',
          padding: '8px',
          borderRadius: '4px'
        }}>
          <div>background: rgba(251, 251, 243, 0.3)</div>
          <div>backdrop-blur: 10px</div>
          <div>border: 1px solid teal</div>
        </div>
      </div>
    </div>

    {/* Medium Glass */}
    <div style={{ marginBottom: '32px' }}>
      <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#FFFFFF' }}>
        Medium Surface
      </h3>
      <div
        style={{
          background: GLASS_EFFECTS.surface.medium.background,
          backdropFilter: `blur(${GLASS_EFFECTS.surface.medium.backdropBlur})`,
          WebkitBackdropFilter: `blur(${GLASS_EFFECTS.surface.medium.backdropBlur})`,
          border: `1px solid ${GLASS_EFFECTS.surface.medium.border}`,
          boxShadow: GLASS_EFFECTS.surface.medium.shadow,
          borderRadius: '12px',
          padding: '24px',
          maxWidth: '400px',
        }}
      >
        <h4 style={{ fontSize: '18px', fontWeight: '600', color: COLORS.text.primary, marginBottom: '8px' }}>
          Medium Glass Surface
        </h4>
        <p style={{ fontSize: '14px', color: COLORS.text.secondary, lineHeight: '1.6', marginBottom: '16px' }}>
          More visible with 12px blur. Ideal for cards, modals, and content containers that need moderate emphasis.
        </p>
        <div style={{
          fontSize: '12px',
          fontFamily: 'monospace',
          color: COLORS.text.secondary,
          background: 'rgba(255,255,255,0.5)',
          padding: '8px',
          borderRadius: '4px'
        }}>
          <div>background: rgba(251, 251, 243, 0.5)</div>
          <div>backdrop-blur: 12px</div>
          <div>border: 1px solid teal/30</div>
        </div>
      </div>
    </div>

    {/* Heavy Glass */}
    <div style={{ marginBottom: '32px' }}>
      <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#FFFFFF' }}>
        Heavy Surface
      </h3>
      <div
        style={{
          background: GLASS_EFFECTS.surface.heavy.background,
          backdropFilter: `blur(${GLASS_EFFECTS.surface.heavy.backdropBlur})`,
          WebkitBackdropFilter: `blur(${GLASS_EFFECTS.surface.heavy.backdropBlur})`,
          border: `1px solid ${GLASS_EFFECTS.surface.heavy.border}`,
          boxShadow: GLASS_EFFECTS.surface.heavy.shadow,
          borderRadius: '12px',
          padding: '24px',
          maxWidth: '400px',
        }}
      >
        <h4 style={{ fontSize: '18px', fontWeight: '600', color: COLORS.text.primary, marginBottom: '8px' }}>
          Heavy Glass Surface
        </h4>
        <p style={{ fontSize: '14px', color: COLORS.text.secondary, lineHeight: '1.6', marginBottom: '16px' }}>
          Strong blur at 16px with higher opacity. Best for prominent overlays and focus-grabbing elements.
        </p>
        <div style={{
          fontSize: '12px',
          fontFamily: 'monospace',
          color: COLORS.text.secondary,
          background: 'rgba(255,255,255,0.5)',
          padding: '8px',
          borderRadius: '4px'
        }}>
          <div>background: rgba(251, 251, 243, 0.7)</div>
          <div>backdrop-blur: 16px</div>
          <div>border: 1px solid teal/50</div>
        </div>
      </div>
    </div>

    {/* Dark Glass */}
    <div style={{ marginBottom: '32px' }}>
      <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#FFFFFF' }}>
        Dark Surface
      </h3>
      <div
        style={{
          background: GLASS_EFFECTS.surface.dark.background,
          backdropFilter: `blur(${GLASS_EFFECTS.surface.dark.backdropBlur})`,
          WebkitBackdropFilter: `blur(${GLASS_EFFECTS.surface.dark.backdropBlur})`,
          border: `1px solid ${GLASS_EFFECTS.surface.dark.border}`,
          boxShadow: GLASS_EFFECTS.surface.dark.shadow,
          borderRadius: '12px',
          padding: '24px',
          maxWidth: '400px',
        }}
      >
        <h4 style={{ fontSize: '18px', fontWeight: '600', color: COLORS.text.inverse, marginBottom: '8px' }}>
          Dark Glass Surface
        </h4>
        <p style={{ fontSize: '14px', color: COLORS.cream[100], lineHeight: '1.6', marginBottom: '16px' }}>
          Dark glass with 16px blur. Perfect for dark mode or overlays on light backgrounds.
        </p>
        <div style={{
          fontSize: '12px',
          fontFamily: 'monospace',
          color: COLORS.cream[100],
          background: 'rgba(0,0,0,0.3)',
          padding: '8px',
          borderRadius: '4px'
        }}>
          <div>background: rgba(45, 49, 66, 0.6)</div>
          <div>backdrop-blur: 16px</div>
          <div>border: 1px solid teal/40</div>
        </div>
      </div>
    </div>
  </div>
);

export const GlassSurfacePresetsStory: Story = {
  name: 'Glass Surface Presets',
  render: () => <GlassSurfacePresets />,
};

// Blur Values
const BlurValues = () => {
  const blurLevels = [
    { name: 'none', value: GLASS_EFFECTS.blur.none, usage: 'No blur' },
    { name: 'sm', value: GLASS_EFFECTS.blur.sm, usage: 'Very subtle' },
    { name: 'md', value: GLASS_EFFECTS.blur.md, usage: 'Light blur' },
    { name: 'lg', value: GLASS_EFFECTS.blur.lg, usage: 'Medium blur' },
    { name: 'xl', value: GLASS_EFFECTS.blur.xl, usage: 'Heavy blur' },
    { name: '2xl', value: GLASS_EFFECTS.blur['2xl'], usage: 'Extra heavy' },
    { name: 'header', value: GLASS_EFFECTS.blur.header, usage: 'Header specific' },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: '24px', fontSize: '24px', fontWeight: '700', color: '#FFFFFF' }}>
        Backdrop Blur Values
      </h2>
      <p style={{ fontSize: '16px', color: '#FFFFFF', marginBottom: '32px', maxWidth: '600px', opacity: 0.9 }}>
        Individual blur values for custom glassmorphism effects.
      </p>

      <div style={{ display: 'grid', gap: '16px' }}>
        {blurLevels.map(({ name, value, usage }) => (
          <div
            key={name}
            style={{
              background: 'rgba(251, 251, 243, 0.5)',
              backdropFilter: `blur(${value})`,
              WebkitBackdropFilter: `blur(${value})`,
              border: '1px solid rgba(8, 164, 189, 0.3)',
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              maxWidth: '600px',
            }}
          >
            <div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: COLORS.text.primary, marginBottom: '4px' }}>
                {name}
              </div>
              <div style={{ fontSize: '14px', color: COLORS.text.secondary }}>
                {usage}
              </div>
            </div>
            <div style={{
              fontSize: '14px',
              fontFamily: 'monospace',
              color: COLORS.text.primary,
              background: 'rgba(255,255,255,0.6)',
              padding: '8px 12px',
              borderRadius: '6px',
            }}>
              {value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const BlurValuesStory: Story = {
  name: 'Blur Values',
  render: () => <BlurValues />,
};

// Header Example
const HeaderExample = () => (
  <div>
    <h2 style={{ marginBottom: '24px', fontSize: '24px', fontWeight: '700', color: '#FFFFFF' }}>
      Glass Header Example
    </h2>
    <p style={{ fontSize: '16px', color: '#FFFFFF', marginBottom: '32px', maxWidth: '600px', opacity: 0.9 }}>
      The classic glassmorphism header used in the Disrupt website.
    </p>

    <div style={{ position: 'relative', minHeight: '300px' }}>
      {/* Mock content behind header */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '300px',
        background: 'linear-gradient(180deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        borderRadius: '12px',
      }}>
        <div style={{ padding: '120px 24px', color: '#FFFFFF', textAlign: 'center' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '16px' }}>
            Content Behind Header
          </h1>
          <p style={{ fontSize: '18px', opacity: 0.9 }}>
            Notice how the header creates a frosted glass effect
          </p>
        </div>
      </div>

      {/* Glass Header */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: GLASS_EFFECTS.surface.light.background,
          backdropFilter: `blur(${GLASS_EFFECTS.blur.header})`,
          WebkitBackdropFilter: `blur(${GLASS_EFFECTS.blur.header})`,
          borderBottom: `1px solid ${COLORS.accent}`,
          boxShadow: GLASS_EFFECTS.surface.light.shadow,
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ fontSize: '20px', fontWeight: 'bold', color: COLORS.text.primary }}>
          Disrupt Inc.
        </div>
        <div style={{ display: 'flex', gap: '24px', fontSize: '14px', fontWeight: '500', color: COLORS.text.primary }}>
          <span>Home</span>
          <span>About</span>
          <span>Contact</span>
        </div>
      </div>
    </div>

    <div style={{
      marginTop: '24px',
      background: 'rgba(255,255,255,0.1)',
      padding: '16px',
      borderRadius: '8px',
      fontSize: '14px',
      color: '#FFFFFF',
      fontFamily: 'monospace',
    }}>
      <div>backdrop-filter: blur({GLASS_EFFECTS.blur.header})</div>
      <div>background: {GLASS_EFFECTS.surface.light.background}</div>
      <div>border-bottom: 1px solid {COLORS.accent}</div>
    </div>
  </div>
);

export const HeaderExampleStory: Story = {
  name: 'Glass Header Example',
  render: () => <HeaderExample />,
};

// Usage Guidelines
const UsageGuidelines = () => (
  <div style={{ maxWidth: '800px' }}>
    <h2 style={{ marginBottom: '24px', fontSize: '24px', fontWeight: '700', color: '#FFFFFF' }}>
      Usage Guidelines
    </h2>

    <div style={{ marginBottom: '32px' }}>
      <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#FFFFFF' }}>
        When to Use Glassmorphism
      </h3>
      <ul style={{ fontSize: '16px', lineHeight: '1.8', color: '#FFFFFF', opacity: 0.9 }}>
        <li><strong>Headers:</strong> Create floating navigation bars that don't obstruct content</li>
        <li><strong>Overlays:</strong> Modals and dialogs that maintain context visibility</li>
        <li><strong>Cards:</strong> Elevate content while keeping backgrounds visible</li>
        <li><strong>Sidebars:</strong> Translucent panels that show underlying content</li>
      </ul>
    </div>

    <div style={{ marginBottom: '32px' }}>
      <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#FFFFFF' }}>
        Best Practices
      </h3>
      <ol style={{ fontSize: '16px', lineHeight: '1.8', color: '#FFFFFF', opacity: 0.9 }}>
        <li>Use on colorful or textured backgrounds for maximum effect</li>
        <li>Ensure sufficient contrast between text and glass surface</li>
        <li>Combine with borders to define edges clearly</li>
        <li>Test across different browsers (WebKit and non-WebKit)</li>
        <li>Use sparingly - too much glass can reduce readability</li>
      </ol>
    </div>

    <div style={{ marginBottom: '32px' }}>
      <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#FFFFFF' }}>
        Browser Support
      </h3>
      <div style={{
        background: 'rgba(255,255,255,0.1)',
        padding: '16px',
        borderRadius: '8px',
        fontSize: '14px',
        color: '#FFFFFF',
        lineHeight: '1.8'
      }}>
        <div><strong>backdrop-filter</strong> is supported in:</div>
        <div>✓ Chrome 76+ (with -webkit prefix)</div>
        <div>✓ Safari 9+ (with -webkit prefix)</div>
        <div>✓ Edge 79+</div>
        <div>✓ Firefox 103+</div>
        <div>⚠ Provide fallback backgrounds for older browsers</div>
      </div>
    </div>

    <div style={{
      background: 'rgba(255,255,255,0.1)',
      padding: '16px',
      borderRadius: '8px',
      border: '1px solid rgba(8, 164, 189, 0.5)'
    }}>
      <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#FFFFFF' }}>
        CSS Implementation
      </h3>
      <pre style={{ fontSize: '13px', color: '#FFFFFF', lineHeight: '1.6', margin: 0 }}>
{`.glass-surface {
  background: rgba(251, 251, 243, 0.5);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(8, 164, 189, 0.3);
  border-radius: 12px;
}`}
      </pre>
    </div>
  </div>
);

export const UsageGuidelinesStory: Story = {
  name: 'Usage Guidelines',
  render: () => <UsageGuidelines />,
};
