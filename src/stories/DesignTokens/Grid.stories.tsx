import type { Meta, StoryObj } from '@storybook/react';
import { GRID_PATTERNS, COLORS } from '../../constants/designTokens';

const meta = {
  title: 'Design Tokens/Grid (Static)',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Static grid background patterns - pure design token for use as CSS backgrounds.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// Static Grid Component
const StaticGridPattern = ({ size, color, strokeWidth }: { size: string; color: string; strokeWidth: string }) => {
  const sizeNum = parseInt(size);

  return (
    <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
      <defs>
        <pattern
          id={`grid-${size}-${color.replace(/[(),\s]/g, '')}`}
          width={sizeNum}
          height={sizeNum}
          patternUnits="userSpaceOnUse"
        >
          <path
            d={`M ${sizeNum} 0 L 0 0 0 ${sizeNum}`}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#grid-${size}-${color.replace(/[(),\s]/g, '')})`} />
    </svg>
  );
};

// Grid - Default (20px, medium opacity)
const GridDefault = () => (
  <div style={{ position: 'relative', width: '100%', height: '600px', background: COLORS.primary, overflow: 'hidden' }}>
    <StaticGridPattern
      size={GRID_PATTERNS.preset.default.size}
      color="rgba(180, 180, 180, 0.4)"
      strokeWidth={GRID_PATTERNS.preset.default.strokeWidth}
    />
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
        }}>
          Default Grid
        </h1>
        <p style={{
          fontFamily: 'Fixel, system-ui, sans-serif',
          fontSize: '16px',
          color: COLORS.cream[100],
          lineHeight: '1.6',
        }}>
          20px grid size with medium opacity (0.4). This is the standard grid pattern used throughout the site.
        </p>
      </div>
    </div>
  </div>
);

export const GridDefaultStory: Story = {
  name: 'Default Grid (20px)',
  render: () => <GridDefault />,
};

// Grid - Fine (10px, light opacity)
const GridFine = () => (
  <div style={{ position: 'relative', width: '100%', height: '600px', background: COLORS.primary, overflow: 'hidden' }}>
    <StaticGridPattern
      size={GRID_PATTERNS.preset.fine.size}
      color="rgba(180, 180, 180, 0.2)"
      strokeWidth={GRID_PATTERNS.preset.fine.strokeWidth}
    />
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
        }}>
          Fine Grid
        </h1>
        <p style={{
          fontFamily: 'Fixel, system-ui, sans-serif',
          fontSize: '16px',
          color: COLORS.cream[100],
          lineHeight: '1.6',
        }}>
          10px grid size with light opacity (0.2). Subtle texture for detailed sections.
        </p>
      </div>
    </div>
  </div>
);

export const GridFineStory: Story = {
  name: 'Fine Grid (10px)',
  render: () => <GridFine />,
};

// Grid - Large (40px, medium opacity)
const GridLarge = () => (
  <div style={{ position: 'relative', width: '100%', height: '600px', background: COLORS.primary, overflow: 'hidden' }}>
    <StaticGridPattern
      size={GRID_PATTERNS.preset.large.size}
      color="rgba(180, 180, 180, 0.3)"
      strokeWidth={GRID_PATTERNS.preset.large.strokeWidth}
    />
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
        }}>
          Large Grid
        </h1>
        <p style={{
          fontFamily: 'Fixel, system-ui, sans-serif',
          fontSize: '16px',
          color: COLORS.cream[100],
          lineHeight: '1.6',
        }}>
          40px grid size with medium opacity (0.3). Bold pattern for hero sections.
        </p>
      </div>
    </div>
  </div>
);

export const GridLargeStory: Story = {
  name: 'Large Grid (40px)',
  render: () => <GridLarge />,
};

// Grid - Branded Teal
const GridBranded = () => (
  <div style={{ position: 'relative', width: '100%', height: '600px', background: COLORS.primary, overflow: 'hidden' }}>
    <StaticGridPattern
      size={GRID_PATTERNS.preset.branded.size}
      color={COLORS.teal[500] + '80'}
      strokeWidth={GRID_PATTERNS.preset.branded.strokeWidth}
    />
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
        }}>
          Branded Teal Grid
        </h1>
        <p style={{
          fontFamily: 'Fixel, system-ui, sans-serif',
          fontSize: '16px',
          color: COLORS.cream[100],
          lineHeight: '1.6',
        }}>
          20px grid with teal color accent. Use for branded sections and key features.
        </p>
      </div>
    </div>
  </div>
);

export const GridBrandedStory: Story = {
  name: 'Branded Teal Grid',
  render: () => <GridBranded />,
};

// Grid Token Reference
const GridTokenReference = () => (
  <div style={{ background: COLORS.background, padding: '48px', minHeight: '600px' }}>
    <h2 style={{ marginBottom: '32px', fontSize: '24px', fontWeight: '700' }}>Static Grid Design Tokens</h2>
    <p style={{ fontSize: '16px', color: COLORS.text.secondary, marginBottom: '48px', maxWidth: '700px' }}>
      Use these static grid patterns as CSS backgrounds without animation. Perfect for simple decorative backgrounds.
    </p>

    <div style={{ display: 'grid', gap: '32px' }}>
      {/* Default Grid */}
      <div>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>Default Grid</h3>
        <div style={{
          background: COLORS.surface,
          border: `1px dashed ${COLORS.dark[200]}`,
          borderRadius: '8px',
          padding: '16px',
          fontFamily: 'monospace',
          fontSize: '13px',
          color: COLORS.text.secondary,
        }}>
          <div>Size: <strong>{GRID_PATTERNS.preset.default.size}</strong></div>
          <div>Color: <strong>{GRID_PATTERNS.preset.default.color}</strong></div>
          <div>Stroke: <strong>{GRID_PATTERNS.preset.default.strokeWidth}</strong></div>
        </div>
      </div>

      {/* Fine Grid */}
      <div>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>Fine Grid</h3>
        <div style={{
          background: COLORS.surface,
          border: `1px dashed ${COLORS.dark[200]}`,
          borderRadius: '8px',
          padding: '16px',
          fontFamily: 'monospace',
          fontSize: '13px',
          color: COLORS.text.secondary,
        }}>
          <div>Size: <strong>{GRID_PATTERNS.preset.fine.size}</strong></div>
          <div>Color: <strong>{GRID_PATTERNS.preset.fine.color}</strong></div>
          <div>Stroke: <strong>{GRID_PATTERNS.preset.fine.strokeWidth}</strong></div>
        </div>
      </div>

      {/* Large Grid */}
      <div>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>Large Grid</h3>
        <div style={{
          background: COLORS.surface,
          border: `1px dashed ${COLORS.dark[200]}`,
          borderRadius: '8px',
          padding: '16px',
          fontFamily: 'monospace',
          fontSize: '13px',
          color: COLORS.text.secondary,
        }}>
          <div>Size: <strong>{GRID_PATTERNS.preset.large.size}</strong></div>
          <div>Color: <strong>{GRID_PATTERNS.preset.large.color}</strong></div>
          <div>Stroke: <strong>{GRID_PATTERNS.preset.large.strokeWidth}</strong></div>
        </div>
      </div>

      {/* Branded Grid */}
      <div>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>Branded Teal Grid</h3>
        <div style={{
          background: COLORS.surface,
          border: `1px dashed ${COLORS.dark[200]}`,
          borderRadius: '8px',
          padding: '16px',
          fontFamily: 'monospace',
          fontSize: '13px',
          color: COLORS.text.secondary,
        }}>
          <div>Size: <strong>{GRID_PATTERNS.preset.branded.size}</strong></div>
          <div>Color: <strong>{GRID_PATTERNS.preset.branded.color}</strong></div>
          <div>Stroke: <strong>{GRID_PATTERNS.preset.branded.strokeWidth}</strong></div>
        </div>
      </div>
    </div>

    <div style={{
      marginTop: '48px',
      background: COLORS.teal[50],
      border: `1px solid ${COLORS.teal[500]}`,
      borderRadius: '8px',
      padding: '24px',
    }}>
      <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: COLORS.text.primary }}>
        CSS Implementation (Static Grid)
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
{`// Using SVG background
.grid-background {
  background-image: url('data:image/svg+xml,<svg>...</svg>');
  background-size: 20px 20px;
}

// Or create SVG element
<svg width="100%" height="100%">
  <defs>
    <pattern id="grid" width="20" height="20"
             patternUnits="userSpaceOnUse">
      <path d="M 20 0 L 0 0 0 20"
            fill="none"
            stroke="rgba(180,180,180,0.4)"
            stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#grid)"/>
</svg>`}
      </pre>
    </div>
  </div>
);

export const GridTokenReferenceStory: Story = {
  name: 'Grid Tokens Reference',
  render: () => <GridTokenReference />,
};
