import type { Meta, StoryObj } from '@storybook/react';
import { SHADOWS, COLORS } from '../../constants/designTokens';

const meta = {
  title: 'Design Tokens/Shadows',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Shadow elevation system for creating depth and hierarchy in the UI.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// Shadow Scales
const ShadowScales = () => {
  const shadows = [
    { name: 'none', value: SHADOWS.none, description: 'No shadow' },
    { name: 'sm', value: SHADOWS.sm, description: 'Subtle elevation for cards' },
    { name: 'md', value: SHADOWS.md, description: 'Medium elevation for dropdowns' },
    { name: 'lg', value: SHADOWS.lg, description: 'Large elevation for modals' },
    { name: 'xl', value: SHADOWS.xl, description: 'Extra large for overlays' },
    { name: '2xl', value: SHADOWS['2xl'], description: 'Maximum elevation' },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: '24px', fontSize: '24px', fontWeight: '700' }}>Shadow Scale</h2>
      <p style={{ fontSize: '16px', color: COLORS.text.secondary, marginBottom: '32px', maxWidth: '600px' }}>
        Progressive shadow system for creating visual hierarchy and depth.
      </p>

      <div style={{ display: 'grid', gap: '32px' }}>
        {shadows.map(({ name, value, description }) => (
          <div key={name}>
            <div style={{ marginBottom: '12px' }}>
              <span style={{ fontSize: '16px', fontWeight: '600', color: COLORS.text.primary }}>{name}</span>
              <span style={{ fontSize: '14px', color: COLORS.text.secondary, marginLeft: '12px' }}>• {description}</span>
            </div>
            <div
              style={{
                width: '300px',
                height: '120px',
                background: COLORS.surface,
                borderRadius: '8px',
                boxShadow: value,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ fontSize: '14px', color: COLORS.text.secondary }}>
                Elevation: {name}
              </span>
            </div>
            <div style={{
              marginTop: '8px',
              fontSize: '12px',
              fontFamily: 'monospace',
              color: COLORS.text.disabled,
            }}>
              {value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ShadowScalesStory: Story = {
  name: 'Shadow Scale',
  render: () => <ShadowScales />,
};

// Custom Shadows
const CustomShadows = () => {
  const customShadows = [
    { name: 'image', value: SHADOWS.image, description: 'Optimized for images' },
    { name: 'header', value: SHADOWS.header, description: 'Glass header shadow' },
    { name: 'button', value: SHADOWS.button, description: 'Subtle button elevation' },
    { name: 'inner', value: SHADOWS.inner, description: 'Inset shadow for depth' },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: '24px', fontSize: '24px', fontWeight: '700' }}>Custom Shadows</h2>
      <p style={{ fontSize: '16px', color: COLORS.text.secondary, marginBottom: '32px', maxWidth: '600px' }}>
        Specialized shadow effects for specific use cases.
      </p>

      <div style={{ display: 'grid', gap: '32px' }}>
        {customShadows.map(({ name, value, description }) => (
          <div key={name}>
            <div style={{ marginBottom: '12px' }}>
              <span style={{ fontSize: '16px', fontWeight: '600', color: COLORS.text.primary }}>{name}</span>
              <span style={{ fontSize: '14px', color: COLORS.text.secondary, marginLeft: '12px' }}>• {description}</span>
            </div>
            <div
              style={{
                width: '300px',
                height: '120px',
                background: name === 'inner' ? COLORS.cream[100] : COLORS.surface,
                borderRadius: '8px',
                boxShadow: value,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ fontSize: '14px', color: COLORS.text.secondary }}>
                {name} shadow
              </span>
            </div>
            <div style={{
              marginTop: '8px',
              fontSize: '12px',
              fontFamily: 'monospace',
              color: COLORS.text.disabled,
            }}>
              {value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const CustomShadowsStory: Story = {
  name: 'Custom Shadows',
  render: () => <CustomShadows />,
};

// Shadow Comparison
const ShadowComparison = () => (
  <div>
    <h2 style={{ marginBottom: '24px', fontSize: '24px', fontWeight: '700' }}>Shadow Comparison</h2>
    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
      {['sm', 'md', 'lg', 'xl', '2xl'].map((size) => (
        <div
          key={size}
          style={{
            width: '150px',
            height: `${100 + (size === '2xl' ? 80 : ['sm', 'md', 'lg', 'xl'].indexOf(size) * 20)}px`,
            background: COLORS.surface,
            borderRadius: '8px',
            boxShadow: SHADOWS[size as keyof typeof SHADOWS],
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <span style={{ fontSize: '18px', fontWeight: '600', color: COLORS.text.primary }}>{size}</span>
          <span style={{ fontSize: '12px', color: COLORS.text.secondary }}>
            {size === 'sm' ? 'Cards' : size === 'md' ? 'Dropdowns' : size === 'lg' ? 'Modals' : size === 'xl' ? 'Overlays' : 'Maximum'}
          </span>
        </div>
      ))}
    </div>
  </div>
);

export const ShadowComparisonStory: Story = {
  name: 'Shadow Comparison',
  render: () => <ShadowComparison />,
};
