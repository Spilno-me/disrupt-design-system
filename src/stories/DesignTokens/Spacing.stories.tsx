import type { Meta, StoryObj } from '@storybook/react';
import { SPACING, COLORS } from '../../constants/designTokens';

const meta = {
  title: 'Design Tokens/Spacing',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'T-shirt sizing spacing scale for consistent padding, margins, and gaps.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// Spacing Scale
const SpacingScale = () => {
  const spacingValues = [
    { key: 'px', value: SPACING.px },
    { key: '0', value: SPACING[0] },
    { key: '0.5', value: SPACING[0.5] },
    { key: '1', value: SPACING[1] },
    { key: '2', value: SPACING[2] },
    { key: '3', value: SPACING[3] },
    { key: '4', value: SPACING[4] },
    { key: '5', value: SPACING[5] },
    { key: '6', value: SPACING[6] },
    { key: '8', value: SPACING[8] },
    { key: '10', value: SPACING[10] },
    { key: '12', value: SPACING[12] },
    { key: '16', value: SPACING[16] },
    { key: '20', value: SPACING[20] },
    { key: '24', value: SPACING[24] },
    { key: '32', value: SPACING[32] },
    { key: '40', value: SPACING[40] },
    { key: '48', value: SPACING[48] },
    { key: '64', value: SPACING[64] },
    { key: '80', value: SPACING[80] },
    { key: '96', value: SPACING[96] },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: '24px', fontSize: '24px', fontWeight: '700' }}>Spacing Scale</h2>
      <p style={{ fontSize: '16px', color: COLORS.text.secondary, marginBottom: '32px', maxWidth: '600px' }}>
        T-shirt sizing scale from 1px to 384px for consistent spacing throughout the design system.
      </p>

      <div style={{ display: 'grid', gap: '16px' }}>
        {spacingValues.map(({ key, value }) => (
          <div
            key={key}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              paddingBottom: '16px',
              borderBottom: `1px solid ${COLORS.dark[100]}`,
            }}
          >
            <div style={{ width: '60px', fontFamily: 'monospace', fontSize: '14px', fontWeight: '600', color: COLORS.text.primary }}>
              {key}
            </div>
            <div style={{ width: '60px', fontSize: '14px', color: COLORS.text.secondary }}>
              {value}
            </div>
            <div
              style={{
                width: value,
                height: '24px',
                background: COLORS.teal[500],
                borderRadius: '4px',
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export const SpacingScaleStory: Story = {
  name: 'Spacing Scale',
  render: () => <SpacingScale />,
};

// Spacing Examples
const SpacingExamples = () => (
  <div>
    <h2 style={{ marginBottom: '24px', fontSize: '24px', fontWeight: '700' }}>Spacing Examples</h2>

    <div style={{ marginBottom: '48px' }}>
      <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Card Padding (p-6 = 24px)</h3>
      <div
        style={{
          maxWidth: '400px',
          background: COLORS.surface,
          border: `1px dashed ${COLORS.dark[200]}`,
          borderRadius: '8px',
          padding: SPACING[6],
        }}
      >
        <h4 style={{ fontSize: '16px', fontWeight: '600', color: COLORS.text.primary, marginBottom: '8px' }}>
          Card Title
        </h4>
        <p style={{ fontSize: '14px', color: COLORS.text.secondary, lineHeight: '1.6' }}>
          This card uses 24px padding (spacing-6) on all sides for comfortable breathing room.
        </p>
      </div>
    </div>

    <div style={{ marginBottom: '48px' }}>
      <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Stack Gap (gap-4 = 16px)</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING[4], maxWidth: '400px' }}>
        <div style={{ padding: '16px', background: COLORS.teal[50], borderRadius: '8px', border: `1px solid ${COLORS.teal[200]}` }}>
          Item 1
        </div>
        <div style={{ padding: '16px', background: COLORS.teal[50], borderRadius: '8px', border: `1px solid ${COLORS.teal[200]}` }}>
          Item 2
        </div>
        <div style={{ padding: '16px', background: COLORS.teal[50], borderRadius: '8px', border: `1px solid ${COLORS.teal[200]}` }}>
          Item 3
        </div>
      </div>
    </div>

    <div>
      <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Section Padding (py-16 = 64px)</h3>
      <div
        style={{
          background: COLORS.primary,
          paddingTop: SPACING[16],
          paddingBottom: SPACING[16],
          paddingLeft: SPACING[6],
          paddingRight: SPACING[6],
          borderRadius: '8px',
        }}
      >
        <div style={{ textAlign: 'center', color: COLORS.text.inverse }}>
          <h4 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '12px' }}>Section Title</h4>
          <p style={{ fontSize: '16px', opacity: 0.9 }}>64px vertical padding for comfortable section spacing</p>
        </div>
      </div>
    </div>
  </div>
);

export const SpacingExamplesStory: Story = {
  name: 'Spacing Examples',
  render: () => <SpacingExamples />,
};
