import type { Meta, StoryObj } from '@storybook/react';
import { GRID_PATTERNS, COLORS } from '../../constants/designTokens';
import { GridBlobBackground, BlobSection } from '../../components/ui/GridBlobCanvas';

const meta = {
  title: 'Design Tokens/Grid Patterns',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Animated grid background with moving blob effect - used in hero sections and feature areas.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// GridBlobCanvas - Default
const GridBlobDefault = () => (
  <div style={{ position: 'relative', width: '100%', height: '600px', background: COLORS.primary, overflow: 'hidden' }}>
    <GridBlobBackground />
    <div style={{
      position: 'relative',
      zIndex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      padding: '48px',
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: `1px dashed ${COLORS.teal[500]}`,
        borderRadius: '8px',
        padding: '48px',
        maxWidth: '600px',
        textAlign: 'center',
      }}>
        <h1 style={{
          fontFamily: 'Pilat Extended, Arial, sans-serif',
          fontSize: '48px',
          fontWeight: 'bold',
          color: COLORS.text.inverse,
          marginBottom: '16px',
          lineHeight: '1.2',
        }}>
          Effortless Action
        </h1>
        <p style={{
          fontFamily: 'Fixel, system-ui, sans-serif',
          fontSize: '18px',
          color: COLORS.cream[100],
          marginBottom: '32px',
          lineHeight: '1.6',
        }}>
          Watch the animated grid pattern move behind this content. This is the GridBlobCanvas component in action.
        </p>
        <button style={{
          background: COLORS.teal[800],
          color: COLORS.text.inverse,
          padding: '12px 24px',
          borderRadius: '4px',
          border: 'none',
          fontSize: '14px',
          fontWeight: '500',
          cursor: 'pointer',
          fontFamily: 'Fixel, system-ui, sans-serif',
        }}>
          Get Started
        </button>
      </div>
    </div>
  </div>
);

export const GridBlobDefaultStory: Story = {
  name: 'GridBlobCanvas - Default',
  render: () => <GridBlobDefault />,
};

// GridBlobCanvas with Scale
const GridBlobScaled = () => (
  <div style={{ position: 'relative', width: '100%', height: '600px', background: COLORS.primary, overflow: 'hidden' }}>
    <GridBlobBackground scale={1.5} />
    <div style={{
      position: 'relative',
      zIndex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      padding: '48px',
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: `1px dashed ${COLORS.teal[500]}`,
        borderRadius: '8px',
        padding: '48px',
        maxWidth: '600px',
        textAlign: 'center',
      }}>
        <h1 style={{
          fontFamily: 'Pilat Extended, Arial, sans-serif',
          fontSize: '48px',
          fontWeight: 'bold',
          color: COLORS.text.inverse,
          marginBottom: '16px',
          lineHeight: '1.2',
        }}>
          Larger Blob Effect
        </h1>
        <p style={{
          fontFamily: 'Fixel, system-ui, sans-serif',
          fontSize: '18px',
          color: COLORS.cream[100],
          lineHeight: '1.6',
        }}>
          This grid uses a 1.5x scale multiplier for a more prominent blob effect. Notice the larger animated area.
        </p>
        <div style={{
          marginTop: '24px',
          fontSize: '14px',
          fontFamily: 'monospace',
          color: COLORS.cream[200],
        }}>
          &lt;GridBlobBackground scale=&#123;1.5&#125; /&gt;
        </div>
      </div>
    </div>
  </div>
);

export const GridBlobScaledStory: Story = {
  name: 'GridBlobCanvas - Scaled (1.5x)',
  render: () => <GridBlobScaled />,
};

// BlobSection Wrapper
const BlobSectionExample = () => (
  <BlobSection
    className="py-16"
    style={{ background: COLORS.primary, minHeight: '600px' }}
  >
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 24px',
      textAlign: 'center',
    }}>
      <h2 style={{
        fontFamily: 'Pilat Extended, Arial, sans-serif',
        fontSize: '36px',
        fontWeight: 'bold',
        color: COLORS.text.inverse,
        marginBottom: '16px',
      }}>
        Using BlobSection Wrapper
      </h2>
      <p style={{
        fontFamily: 'Fixel, system-ui, sans-serif',
        fontSize: '18px',
        color: COLORS.cream[100],
        marginBottom: '48px',
        maxWidth: '600px',
        margin: '0 auto 48px',
        lineHeight: '1.6',
      }}>
        The BlobSection component automatically wraps your content with the grid blob background. Just add your content as children.
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '24px',
        marginTop: '48px',
      }}>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: `1px dashed ${COLORS.teal[500]}40`,
              borderRadius: '8px',
              padding: '24px',
            }}
          >
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: COLORS.text.inverse,
              marginBottom: '12px',
            }}>
              Feature {i}
            </h3>
            <p style={{
              fontSize: '14px',
              color: COLORS.cream[100],
              lineHeight: '1.6',
            }}>
              Content cards float above the animated grid background.
            </p>
          </div>
        ))}
      </div>
    </div>
  </BlobSection>
);

export const BlobSectionExampleStory: Story = {
  name: 'BlobSection Wrapper',
  render: () => <BlobSectionExample />,
};

// Grid Configuration Display
const GridConfiguration = () => (
  <div style={{ background: COLORS.background, padding: '48px', minHeight: '600px' }}>
    <h2 style={{ marginBottom: '32px', fontSize: '24px', fontWeight: '700' }}>Grid Configuration</h2>
    <p style={{ fontSize: '16px', color: COLORS.text.secondary, marginBottom: '32px', maxWidth: '600px' }}>
      The GridBlobCanvas uses these configuration values from your design tokens:
    </p>

    <div style={{
      background: COLORS.surface,
      border: `1px dashed ${COLORS.dark[200]}`,
      borderRadius: '8px',
      padding: '24px',
      marginBottom: '32px',
    }}>
      <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: COLORS.text.primary }}>
        Grid Settings
      </h3>
      <div style={{
        fontFamily: 'monospace',
        fontSize: '14px',
        color: COLORS.text.secondary,
        lineHeight: '2',
      }}>
        <div><strong>Size:</strong> {GRID_PATTERNS.preset.default.size}</div>
        <div><strong>Color:</strong> {GRID_PATTERNS.preset.default.color}</div>
        <div><strong>Stroke Width:</strong> {GRID_PATTERNS.preset.default.strokeWidth}</div>
      </div>
    </div>

    <div style={{
      background: COLORS.surface,
      border: `1px dashed ${COLORS.dark[200]}`,
      borderRadius: '8px',
      padding: '24px',
      marginBottom: '32px',
    }}>
      <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: COLORS.text.primary }}>
        Blob Animation
      </h3>
      <div style={{
        fontFamily: 'monospace',
        fontSize: '14px',
        color: COLORS.text.secondary,
        lineHeight: '2',
      }}>
        <div><strong>Waypoint Interval:</strong> 2000ms (2 seconds)</div>
        <div><strong>Transition Duration:</strong> 1.8s</div>
        <div><strong>Waypoints:</strong> 8 positions</div>
        <div><strong>Animation:</strong> Smooth easeInOut</div>
      </div>
    </div>

    <div style={{
      background: COLORS.teal[50],
      border: `1px solid ${COLORS.teal[500]}`,
      borderRadius: '8px',
      padding: '24px',
    }}>
      <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: COLORS.text.primary }}>
        Usage
      </h3>
      <pre style={{
        fontFamily: 'monospace',
        fontSize: '13px',
        color: COLORS.text.primary,
        lineHeight: '1.6',
        margin: 0,
        background: COLORS.surface,
        padding: '16px',
        borderRadius: '6px',
        overflow: 'auto',
      }}>
{`// Direct usage
import { GridBlobBackground } from '../../components/ui/GridBlobCanvas';

<section className="relative">
  <GridBlobBackground scale={1} />
  <div className="relative z-[1]">
    Your content here
  </div>
</section>

// Using wrapper component
import { BlobSection } from '../../components/ui/GridBlobCanvas';

<BlobSection className="py-16">
  Your content here
</BlobSection>`}
      </pre>
    </div>
  </div>
);

export const GridConfigurationStory: Story = {
  name: 'Grid Configuration',
  render: () => <GridConfiguration />,
};
