import type { Meta, StoryObj } from '@storybook/react';
import { COLORS } from '../../constants/designTokens';

const meta = {
  title: 'Design Tokens/Colors',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Color palette for the Disrupt Design System including brand colors, semantic colors, and feature colors.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// Color Swatch Component
const ColorSwatch = ({ name, value, description }: { name: string; value: string; description?: string }) => (
  <div style={{ marginBottom: '16px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '8px',
          background: value,
          border: '1px solid #E8EAED',
          flexShrink: 0
        }}
      />
      <div>
        <div style={{ fontSize: '14px', fontWeight: '600', color: '#2D3142' }}>{name}</div>
        <div style={{ fontSize: '12px', fontFamily: 'monospace', color: '#5E4F7E' }}>{value}</div>
        {description && <div style={{ fontSize: '12px', color: '#9FA5B0' }}>{description}</div>}
      </div>
    </div>
  </div>
);

// Color Scale Component
const ColorScale = ({ name, scale, description }: { name: string; scale: Record<string, string>; description: string }) => (
  <div style={{ marginBottom: '32px' }}>
    <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>{name}</h3>
    <p style={{ fontSize: '14px', color: '#5E4F7E', marginBottom: '16px' }}>{description}</p>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
      {Object.entries(scale).map(([shade, color]) => (
        <ColorSwatch key={shade} name={shade} value={color} />
      ))}
    </div>
  </div>
);

// Brand Colors
const BrandColors = () => (
  <div>
    <h2 style={{ marginBottom: '24px', fontSize: '24px', fontWeight: '700' }}>Brand Colors</h2>

    <ColorScale
      name="Dark Scale"
      scale={COLORS.dark}
      description="Primary text, buttons, and headings. Base shade (500) is the main dark color."
    />

    <ColorScale
      name="Teal Scale"
      scale={COLORS.teal}
      description="Accent color for links, interactive elements, and brand highlights. Base shade (500) is the signature teal."
    />

    <ColorScale
      name="Ferrari Red Scale"
      scale={COLORS.red}
      description="Brand accent for alerts, errors, and emphasis. Base shade (500) is the iconic Ferrari red."
    />

    <ColorScale
      name="Cream Scale"
      scale={COLORS.cream}
      description="Background and surface colors. Base shade (300) is the main background."
    />

    <ColorScale
      name="Muted Purple Scale"
      scale={COLORS.muted}
      description="Secondary text and subtle accents. Base shade (500) for secondary content."
    />
  </div>
);

export const BrandColorsStory: Story = {
  name: 'Brand Colors',
  render: () => <BrandColors />,
};

// Semantic Colors
const SemanticColors = () => (
  <div>
    <h2 style={{ marginBottom: '24px', fontSize: '24px', fontWeight: '700' }}>Semantic Colors</h2>
    <p style={{ fontSize: '16px', color: '#5E4F7E', marginBottom: '32px', maxWidth: '600px' }}>
      Semantic colors provide consistent meaning across the application. Use these instead of direct color values for better maintainability.
    </p>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px', marginBottom: '32px' }}>
      <ColorSwatch name="primary" value={COLORS.primary} description="Primary brand color" />
      <ColorSwatch name="accent" value={COLORS.accent} description="Accent and interactive elements" />
      <ColorSwatch name="background" value={COLORS.background} description="Page background" />
      <ColorSwatch name="surface" value={COLORS.surface} description="Card and surface background" />
      <ColorSwatch name="error" value={COLORS.error} description="Error states and alerts" />
    </div>

    <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', marginTop: '32px' }}>Text Colors</h3>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
      <ColorSwatch name="text.primary" value={COLORS.text.primary} description="Primary text content" />
      <ColorSwatch name="text.secondary" value={COLORS.text.secondary} description="Secondary/muted text" />
      <ColorSwatch name="text.disabled" value={COLORS.text.disabled} description="Disabled text" />
      <ColorSwatch name="text.inverse" value={COLORS.text.inverse} description="Text on dark backgrounds" />
    </div>
  </div>
);

export const SemanticColorsStory: Story = {
  name: 'Semantic Colors',
  render: () => <SemanticColors />,
};

// Feature Colors
const FeatureColors = () => (
  <div>
    <h2 style={{ marginBottom: '24px', fontSize: '24px', fontWeight: '700' }}>Feature Colors</h2>
    <p style={{ fontSize: '16px', color: '#5E4F7E', marginBottom: '32px', maxWidth: '600px' }}>
      Bright, vibrant colors used for feature cards, status indicators, and visual differentiation.
    </p>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
      <ColorSwatch name="feature.blue" value={COLORS.feature.blue} description="Automate features" />
      <ColorSwatch name="feature.red" value={COLORS.feature.red} description="Advice features" />
      <ColorSwatch name="feature.yellow" value={COLORS.feature.yellow} description="Adapt features" />
      <ColorSwatch name="feature.green" value={COLORS.feature.green} description="Scale features" />
    </div>
  </div>
);

export const FeatureColorsStory: Story = {
  name: 'Feature Colors',
  render: () => <FeatureColors />,
};

// Utility Colors
const UtilityColors = () => (
  <div>
    <h2 style={{ marginBottom: '24px', fontSize: '24px', fontWeight: '700' }}>Utility Colors</h2>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
      <ColorSwatch name="white" value={COLORS.white} description="Pure white" />
      <ColorSwatch name="slate" value={COLORS.slate} description="Disabled/inactive" />
      <ColorSwatch name="linkedIn" value={COLORS.linkedIn} description="LinkedIn brand color" />
    </div>
  </div>
);

export const UtilityColorsStory: Story = {
  name: 'Utility Colors',
  render: () => <UtilityColors />,
};

// Color Combinations
const ColorCombinations = () => (
  <div>
    <h2 style={{ marginBottom: '24px', fontSize: '24px', fontWeight: '700' }}>Color Combinations</h2>
    <p style={{ fontSize: '16px', color: '#5E4F7E', marginBottom: '32px', maxWidth: '600px' }}>
      Common color pairings for consistent UI patterns.
    </p>

    {/* Button Example */}
    <div style={{ marginBottom: '32px' }}>
      <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>Primary Button</h3>
      <button style={{
        background: COLORS.primary,
        color: COLORS.text.inverse,
        padding: '12px 24px',
        borderRadius: '8px',
        border: 'none',
        fontSize: '16px',
        fontWeight: '500',
        cursor: 'pointer'
      }}>
        Get Started
      </button>
      <div style={{ marginTop: '8px', fontSize: '14px', color: '#5E4F7E' }}>
        Background: <code>primary</code>, Text: <code>text.inverse</code>
      </div>
    </div>

    {/* Accent Button */}
    <div style={{ marginBottom: '32px' }}>
      <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>Accent Button</h3>
      <button style={{
        background: COLORS.accent,
        color: COLORS.text.inverse,
        padding: '12px 24px',
        borderRadius: '8px',
        border: 'none',
        fontSize: '16px',
        fontWeight: '500',
        cursor: 'pointer'
      }}>
        Learn More
      </button>
      <div style={{ marginTop: '8px', fontSize: '14px', color: '#5E4F7E' }}>
        Background: <code>accent</code>, Text: <code>text.inverse</code>
      </div>
    </div>

    {/* Card Example */}
    <div style={{ marginBottom: '32px' }}>
      <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>Card Component</h3>
      <div style={{
        background: COLORS.surface,
        padding: '24px',
        borderRadius: '12px',
        border: `1px solid ${COLORS.dark[100]}`,
        maxWidth: '400px'
      }}>
        <h4 style={{ color: COLORS.text.primary, fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
          Card Title
        </h4>
        <p style={{ color: COLORS.text.secondary, fontSize: '14px', marginBottom: '16px', lineHeight: '1.6' }}>
          This is example card content with secondary text color for better hierarchy.
        </p>
        <a href="#" style={{ color: COLORS.accent, fontSize: '14px', fontWeight: '500', textDecoration: 'none' }}>
          Read More →
        </a>
      </div>
      <div style={{ marginTop: '8px', fontSize: '14px', color: '#5E4F7E' }}>
        Background: <code>surface</code>, Title: <code>text.primary</code>, Body: <code>text.secondary</code>, Link: <code>accent</code>
      </div>
    </div>

    {/* Alert Example */}
    <div style={{ marginBottom: '32px' }}>
      <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>Error Alert</h3>
      <div style={{
        background: COLORS.red[50],
        padding: '16px',
        borderRadius: '8px',
        border: `1px solid ${COLORS.error}`,
        maxWidth: '400px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ color: COLORS.error, fontSize: '20px', fontWeight: '600' }}>⚠</div>
          <span style={{ color: COLORS.error, fontSize: '14px', fontWeight: '600' }}>
            Error: Please fix the issues below
          </span>
        </div>
      </div>
      <div style={{ marginTop: '8px', fontSize: '14px', color: '#5E4F7E' }}>
        Background: <code>red.50</code>, Border & Text: <code>error</code>
      </div>
    </div>
  </div>
);

export const ColorCombinationsStory: Story = {
  name: 'Color Combinations',
  render: () => <ColorCombinations />,
};

// Accessibility Guidelines
const AccessibilityGuidelines = () => (
  <div style={{ maxWidth: '800px' }}>
    <h2 style={{ marginBottom: '24px', fontSize: '24px', fontWeight: '700' }}>Accessibility Guidelines</h2>

    <div style={{ marginBottom: '32px' }}>
      <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>Contrast Ratios (WCAG 2.1 AA)</h3>
      <ul style={{ fontSize: '16px', lineHeight: '1.8', color: '#2D3142' }}>
        <li><strong>Normal text (16px):</strong> Minimum 4.5:1 contrast ratio</li>
        <li><strong>Large text (18px+ or 14px+ bold):</strong> Minimum 3:1 contrast ratio</li>
        <li><strong>UI components:</strong> Minimum 3:1 contrast for focus indicators and interactive elements</li>
      </ul>
    </div>

    <div style={{ marginBottom: '32px' }}>
      <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>Approved Combinations</h3>
      <div style={{ display: 'grid', gap: '16px' }}>
        <div style={{
          background: COLORS.background,
          padding: '16px',
          borderRadius: '8px',
          border: '1px solid #E8EAED'
        }}>
          <div style={{ color: COLORS.text.primary, fontSize: '16px', marginBottom: '4px' }}>
            ✓ Primary text on cream background (6.2:1)
          </div>
          <div style={{ fontSize: '12px', color: '#5E4F7E' }}>
            background + text.primary
          </div>
        </div>

        <div style={{
          background: COLORS.primary,
          padding: '16px',
          borderRadius: '8px'
        }}>
          <div style={{ color: COLORS.text.inverse, fontSize: '16px', marginBottom: '4px' }}>
            ✓ White text on dark background (12.5:1)
          </div>
          <div style={{ fontSize: '12px', color: COLORS.cream[100] }}>
            primary + text.inverse
          </div>
        </div>

        <div style={{
          background: COLORS.accent,
          padding: '16px',
          borderRadius: '8px'
        }}>
          <div style={{ color: COLORS.text.inverse, fontSize: '16px', marginBottom: '4px' }}>
            ✓ White text on teal background (4.9:1)
          </div>
          <div style={{ fontSize: '12px', color: COLORS.cream[100] }}>
            accent + text.inverse
          </div>
        </div>
      </div>
    </div>

    <div style={{
      background: '#FEF2F2',
      padding: '16px',
      borderRadius: '8px',
      border: '1px solid #FFB3B8'
    }}>
      <div style={{ fontSize: '14px', color: '#2D3142', lineHeight: '1.6' }}>
        <strong>Warning:</strong> Always test color combinations with a contrast checker tool. The combinations shown above meet WCAG AA standards, but custom combinations should be verified.
      </div>
    </div>
  </div>
);

export const AccessibilityGuidelinesStory: Story = {
  name: 'Accessibility Guidelines',
  render: () => <AccessibilityGuidelines />,
};
