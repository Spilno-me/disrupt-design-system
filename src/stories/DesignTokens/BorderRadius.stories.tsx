import type { Meta, StoryObj } from '@storybook/react';
import { RADIUS, COLORS } from '../../constants/designTokens';

const meta = {
  title: 'Design Tokens/Border Radius',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Border radius scale for rounded corners on cards, buttons, and inputs.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// Border Radius Scale
const BorderRadiusScale = () => {
  const radiusValues = [
    { name: 'none', value: RADIUS.none, usage: 'Sharp corners' },
    { name: 'xs', value: RADIUS.xs, usage: 'Very subtle' },
    { name: 'sm', value: RADIUS.sm, usage: 'Buttons, inputs (default)' },
    { name: 'md', value: RADIUS.md, usage: 'Cards, modals' },
    { name: 'lg', value: RADIUS.lg, usage: 'Large cards' },
    { name: 'xl', value: RADIUS.xl, usage: 'Hero sections' },
    { name: '2xl', value: RADIUS['2xl'], usage: 'Very rounded' },
    { name: 'full', value: RADIUS.full, usage: 'Pills, circles' },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: '24px', fontSize: '24px', fontWeight: '700' }}>Border Radius Scale</h2>

      <div style={{ display: 'grid', gap: '24px' }}>
        {radiusValues.map(({ name, value, usage }) => (
          <div key={name}>
            <div style={{ marginBottom: '12px' }}>
              <span style={{ fontSize: '16px', fontWeight: '600', color: COLORS.text.primary }}>{name}</span>
              <span style={{ fontSize: '14px', color: COLORS.text.secondary, marginLeft: '12px' }}>{value}</span>
              <span style={{ fontSize: '14px', color: COLORS.text.disabled, marginLeft: '12px' }}>• {usage}</span>
            </div>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div
                style={{
                  width: name === 'full' ? '120px' : '200px',
                  height: '120px',
                  background: COLORS.teal[500],
                  borderRadius: value,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: COLORS.text.inverse,
                  fontSize: '14px',
                  fontWeight: '500',
                }}
              >
                {name}
              </div>
              {name === 'sm' && (
                <div style={{
                  padding: '12px 24px',
                  background: COLORS.teal[800],
                  borderRadius: value,
                  color: COLORS.text.inverse,
                  fontSize: '14px',
                  fontWeight: '500',
                }}>
                  Button Example
                </div>
              )}
              {name === 'md' && (
                <div style={{
                  padding: '24px',
                  background: COLORS.surface,
                  border: `1px dashed ${COLORS.dark[200]}`,
                  borderRadius: value,
                  fontSize: '14px',
                  color: COLORS.text.secondary,
                }}>
                  Card Example
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const BorderRadiusScaleStory: Story = {
  name: 'Border Radius Scale',
  render: () => <BorderRadiusScale />,
};
